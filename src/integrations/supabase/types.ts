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
          actionitem_key: number
          content: string | null
        }
        Insert: {
          actionitem_key: number
          content?: string | null
        }
        Update: {
          actionitem_key?: number
          content?: string | null
        }
        Relationships: []
      }
      actionitems_insights: {
        Row: {
          actionitem_key: number
          insight_key: number
        }
        Insert: {
          actionitem_key: number
          insight_key: number
        }
        Update: {
          actionitem_key?: number
          insight_key?: number
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
      actionitems_labels: {
        Row: {
          actionitem_key: number
          label_key: number
        }
        Insert: {
          actionitem_key: number
          label_key: number
        }
        Update: {
          actionitem_key?: number
          label_key?: number
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
            foreignKeyName: "actionitems_labels_label_key_fkey"
            columns: ["label_key"]
            isOneToOne: false
            referencedRelation: "labels"
            referencedColumns: ["label_key"]
          },
        ]
      }
      feedbacks: {
        Row: {
          content: string | null
          "Creation Date": string | null
          customer_id: number | null
          feedback_key: number
          segment: string | null
          sentiment: string | null
          source: string | null
        }
        Insert: {
          content?: string | null
          "Creation Date"?: string | null
          customer_id?: number | null
          feedback_key: number
          segment?: string | null
          sentiment?: string | null
          source?: string | null
        }
        Update: {
          content?: string | null
          "Creation Date"?: string | null
          customer_id?: number | null
          feedback_key?: number
          segment?: string | null
          sentiment?: string | null
          source?: string | null
        }
        Relationships: []
      }
      insight_labels: {
        Row: {
          insight_key: number
          label_key: number
        }
        Insert: {
          insight_key: number
          label_key: number
        }
        Update: {
          insight_key?: number
          label_key?: number
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
          insight_key: number
        }
        Insert: {
          content?: string | null
          insight_key: number
        }
        Update: {
          content?: string | null
          insight_key?: number
        }
        Relationships: []
      }
      insights_feedbacks: {
        Row: {
          feedback_key: number
          insight_key: number
        }
        Insert: {
          feedback_key: number
          insight_key: number
        }
        Update: {
          feedback_key?: number
          insight_key?: number
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
          label_key: number
        }
        Insert: {
          label?: string | null
          label_key: number
        }
        Update: {
          label?: string | null
          label_key?: number
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
