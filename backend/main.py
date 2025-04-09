from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from langchain.memory import ConversationBufferMemory
from langchain.chains import ConversationalRetrievalChain
from langchain.llms import OpenAI
from langchain.vectorstores import FAISS
from langchain.embeddings import OpenAIEmbeddings
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize FastAPI app
app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8080"],  # Your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize LLM and embeddings
llm = OpenAI(temperature=0)
embeddings = OpenAIEmbeddings()

# Initialize vector store (you'll need to set this up with your data)
# retriever = FAISS.load_local("faiss_index", embeddings).as_retriever()
retriever = None  # Placeholder - you'll need to implement this

# Store chat sessions
chat_memory_store = {}

class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    message: str
    session_id: str

class ChatResponse(BaseModel):
    response: str
    session_id: str
    history: List[ChatMessage]

@app.post("/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    """
    Chat endpoint that maintains conversation history per session
    """
    session_id = request.session_id
    
    # Initialize session memory if it doesn't exist
    if session_id not in chat_memory_store:
        chat_memory_store[session_id] = ConversationBufferMemory(
            memory_key="chat_history",
            return_messages=True
        )
    
    memory = chat_memory_store[session_id]
    
    # Create conversation chain
    qa = ConversationalRetrievalChain.from_llm(
        llm=llm,
        retriever=retriever,
        memory=memory,
        verbose=False
    )
    
    # Get response
    response = qa.run(request.message)
    
    # Get chat history
    history = []
    if memory.chat_memory.messages:
        history = [
            ChatMessage(role=msg.type, content=msg.content)
            for msg in memory.chat_memory.messages
        ]
    
    return ChatResponse(
        response=response,
        session_id=session_id,
        history=history
    )

@app.delete("/chat/{session_id}")
async def end_chat_session(session_id: str):
    """
    End a chat session and clean up its memory
    """
    if session_id in chat_memory_store:
        del chat_memory_store[session_id]
        return {"message": f"Session {session_id} ended successfully"}
    raise HTTPException(status_code=404, detail="Session not found")

@app.get("/chat/{session_id}/history")
async def get_chat_history(session_id: str):
    """
    Retrieve chat history for a specific session
    """
    if session_id not in chat_memory_store:
        raise HTTPException(status_code=404, detail="Session not found")
    
    memory = chat_memory_store[session_id]
    history = [
        ChatMessage(role=msg.type, content=msg.content)
        for msg in memory.chat_memory.messages
    ]
    
    return {"history": history}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 