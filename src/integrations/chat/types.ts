export interface ChatMessage {
  role: 'human' | 'ai';
  content: string;
}

export interface ChatRequest {
  message: string;
  session_id?: string;
}

export interface ChatResponse {
  response: string;
  session_id: string;
  history?: ChatMessage[];
}

export interface ChatHistory {
  history: ChatMessage[];
} 