export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      action_items: {
        Row: {
          actionitem_key: string
          content: string | null
        }
        Insert: {
          actionitem_key?: string
          content?: string | null
        }
        Update: {
          actionitem_key?: string
          content?: string | null
        }
        Relationships: []
      }
      action_items_categories: {
        Row: {
          actionitem_category_key: string
          category: string
        }
        Insert: {
          actionitem_category_key?: string
          category: string
        }
        Update: {
          actionitem_category_key?: string
          category?: string
        }
        Relationships: []
      }
      actionitems_insights: {
        Row: {
          actionitem_key: string
          insight_key: string
        }
        Insert: {
          actionitem_key?: string
          insight_key?: string
        }
        Update: {
          actionitem_key?: string
          insight_key?: string
        }
        Relationships: [
          {
            foreignKeyName: "actionitems_insights_actionitem_key_fkey"
            columns: ["actionitem_key"]
            isOneToOne: false
            referencedRelation: "action_items"
            referencedColumns: ["actionitem_key"]
          },
          {
            foreignKeyName: "actionitems_insights_insight_key_fkey"
            columns: ["insight_key"]
            isOneToOne: false
            referencedRelation: "insights"
            referencedColumns: ["insight_key"]
          },
        ]
      }
      actionitems_to_categories: {
        Row: {
          actionitem_category_key: string
          actionitem_key: string
        }
        Insert: {
          actionitem_category_key?: string
          actionitem_key?: string
        }
        Update: {
          actionitem_category_key?: string
          actionitem_key?: string
        }
        Relationships: [
          {
            foreignKeyName: "actionitems_labels_actionitem_key_fkey"
            columns: ["actionitem_key"]
            isOneToOne: false
            referencedRelation: "action_items"
            referencedColumns: ["actionitem_key"]
          },
          {
            foreignKeyName: "actionitems_to_categories_actionitem_category_key_fkey"
            columns: ["actionitem_category_key"]
            isOneToOne: false
            referencedRelation: "action_items_categories"
            referencedColumns: ["actionitem_category_key"]
          },
        ]
      }
      feature_evidence: {
        Row: {
          company: string | null
          company_arr: string | null
          content: string | null
          detailed_role: string | null
          employee_count: string | null
          feature_id: string | null
          feedback_key: string | null
          file_id: string | null
          id: string
          name: string | null
          role: string | null
          source: string | null
        }
        Insert: {
          company?: string | null
          company_arr?: string | null
          content?: string | null
          detailed_role?: string | null
          employee_count?: string | null
          feature_id?: string | null
          feedback_key?: string | null
          file_id?: string | null
          id?: string
          name?: string | null
          role?: string | null
          source?: string | null
        }
        Update: {
          company?: string | null
          company_arr?: string | null
          content?: string | null
          detailed_role?: string | null
          employee_count?: string | null
          feature_id?: string | null
          feedback_key?: string | null
          file_id?: string | null
          id?: string
          name?: string | null
          role?: string | null
          source?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "feature_evidence_feature_id_fkey"
            columns: ["feature_id"]
            isOneToOne: false
            referencedRelation: "feature_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      feature_requests: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          role: string | null
          title: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          role?: string | null
          title: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          role?: string | null
          title?: string
        }
        Relationships: []
      }
      feedbacks: {
        Row: {
          company: string | null
          company_arr: string | null
          content: string | null
          created_at: string | null
          customer_id: string | null
          embedding: string | null
          employee_count: string | null
          feedback_key: string
          file_id: string | null
          name: string | null
          role: string | null
          source: string | null
        }
        Insert: {
          company?: string | null
          company_arr?: string | null
          content?: string | null
          created_at?: string | null
          customer_id?: string | null
          embedding?: string | null
          employee_count?: string | null
          feedback_key?: string
          file_id?: string | null
          name?: string | null
          role?: string | null
          source?: string | null
        }
        Update: {
          company?: string | null
          company_arr?: string | null
          content?: string | null
          created_at?: string | null
          customer_id?: string | null
          embedding?: string | null
          employee_count?: string | null
          feedback_key?: string
          file_id?: string | null
          name?: string | null
          role?: string | null
          source?: string | null
        }
        Relationships: []
      }
      feedbacks_chunks: {
        Row: {
          chunk_key: string
          content: string | null
          embedding: string | null
          feedback_key: string
          file_id: string | null
        }
        Insert: {
          chunk_key?: string
          content?: string | null
          embedding?: string | null
          feedback_key?: string
          file_id?: string | null
        }
        Update: {
          chunk_key?: string
          content?: string | null
          embedding?: string | null
          feedback_key?: string
          file_id?: string | null
        }
        Relationships: []
      }
      insight_labels: {
        Row: {
          insight_key: string
          label_key: string
        }
        Insert: {
          insight_key?: string
          label_key?: string
        }
        Update: {
          insight_key?: string
          label_key?: string
        }
        Relationships: [
          {
            foreignKeyName: "insight_labels_insight_key_fkey"
            columns: ["insight_key"]
            isOneToOne: false
            referencedRelation: "insights"
            referencedColumns: ["insight_key"]
          },
          {
            foreignKeyName: "insight_labels_label_key_fkey"
            columns: ["label_key"]
            isOneToOne: false
            referencedRelation: "labels"
            referencedColumns: ["label_key"]
          },
        ]
      }
      insights: {
        Row: {
          content: string | null
          created_at: string | null
          insight_key: string
          Title: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          insight_key?: string
          Title?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string | null
          insight_key?: string
          Title?: string | null
        }
        Relationships: []
      }
      insights_feedbacks: {
        Row: {
          feedback_key: string
          insight_key: string
        }
        Insert: {
          feedback_key?: string
          insight_key?: string
        }
        Update: {
          feedback_key?: string
          insight_key?: string
        }
        Relationships: [
          {
            foreignKeyName: "insights_feedbacks_feedback_key_fkey"
            columns: ["feedback_key"]
            isOneToOne: false
            referencedRelation: "feedbacks"
            referencedColumns: ["feedback_key"]
          },
          {
            foreignKeyName: "insights_feedbacks_insight_key_fkey"
            columns: ["insight_key"]
            isOneToOne: false
            referencedRelation: "insights"
            referencedColumns: ["insight_key"]
          },
        ]
      }
      labels: {
        Row: {
          label: string | null
          label_key: string
        }
        Insert: {
          label?: string | null
          label_key?: string
        }
        Update: {
          label?: string | null
          label_key?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      binary_quantize: {
        Args: { "": string } | { "": unknown }
        Returns: unknown
      }
      get_action_items_with_insights: {
        Args: Record<PropertyKey, never>
        Returns: {
          actionitem_key: string
          actionitem_content: string
          insight_key: string
          insight_content: string
        }[]
      }
      get_insights_with_feedbacks: {
        Args: Record<PropertyKey, never>
        Returns: {
          insight_key: string
          insight_content: string
          title: string
          insight_created_at: string
          feedback_key: string
          feedback_content: string
          source: string
          role: string
          feedback_created_at: string
        }[]
      }
      get_insights_with_labels: {
        Args: Record<PropertyKey, never>
        Returns: {
          insight_key: string
          content: string
          title: string
          created_at: string
          label_key: string
          label: string
        }[]
      }
      get_table_columns: {
        Args: { p_table_name: string }
        Returns: {
          column_name: string
          data_type: string
        }[]
      }
      halfvec_avg: {
        Args: { "": number[] }
        Returns: unknown
      }
      halfvec_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      halfvec_send: {
        Args: { "": unknown }
        Returns: string
      }
      halfvec_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
      hnsw_bit_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnsw_halfvec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnsw_sparsevec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnswhandler: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflat_bit_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflat_halfvec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflathandler: {
        Args: { "": unknown }
        Returns: unknown
      }
      l2_norm: {
        Args: { "": unknown } | { "": unknown }
        Returns: number
      }
      l2_normalize: {
        Args: { "": string } | { "": unknown } | { "": unknown }
        Returns: string
      }
      match_documents: {
        Args: { query_embedding: string; match_count?: number }
        Returns: {
          id: string
          content: string
          source: string
          created_at: string
          similarity: number
        }[]
      }
      match_feedbacks: {
        Args: {
          query_embedding: string
          match_count?: number
          similarity_threshold?: number
        }
        Returns: {
          content: string
          similarity: number
        }[]
      }
      sparsevec_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      sparsevec_send: {
        Args: { "": unknown }
        Returns: string
      }
      sparsevec_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
      vector_avg: {
        Args: { "": number[] }
        Returns: string
      }
      vector_dims: {
        Args: { "": string } | { "": unknown }
        Returns: number
      }
      vector_norm: {
        Args: { "": string }
        Returns: number
      }
      vector_out: {
        Args: { "": string }
        Returns: unknown
      }
      vector_send: {
        Args: { "": string }
        Returns: string
      }
      vector_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
