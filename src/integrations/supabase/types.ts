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
      class_plans: {
        Row: {
          class_name: string | null
          created_at: string | null
          exercises: Json | null
          id: string
          sections: Json | null
          user_id: string | null
        }
        Insert: {
          class_name?: string | null
          created_at?: string | null
          exercises?: Json | null
          id?: string
          sections?: Json | null
          user_id?: string | null
        }
        Update: {
          class_name?: string | null
          created_at?: string | null
          exercises?: Json | null
          id?: string
          sections?: Json | null
          user_id?: string | null
        }
        Relationships: []
      }
      custom_exercises: {
        Row: {
          category: string
          contraindications: string[] | null
          created_at: string
          cues: string[] | null
          description: string | null
          difficulty: string
          duration: number
          equipment: string[]
          id: string
          image_url: string | null
          is_pregnancy_safe: boolean
          muscle_groups: string[]
          name: string
          notes: string | null
          springs: string
          transitions: string[] | null
          updated_at: string
          user_id: string
          video_url: string | null
        }
        Insert: {
          category: string
          contraindications?: string[] | null
          created_at?: string
          cues?: string[] | null
          description?: string | null
          difficulty?: string
          duration?: number
          equipment?: string[]
          id?: string
          image_url?: string | null
          is_pregnancy_safe?: boolean
          muscle_groups?: string[]
          name: string
          notes?: string | null
          springs?: string
          transitions?: string[] | null
          updated_at?: string
          user_id: string
          video_url?: string | null
        }
        Update: {
          category?: string
          contraindications?: string[] | null
          created_at?: string
          cues?: string[] | null
          description?: string | null
          difficulty?: string
          duration?: number
          equipment?: string[]
          id?: string
          image_url?: string | null
          is_pregnancy_safe?: boolean
          muscle_groups?: string[]
          name?: string
          notes?: string | null
          springs?: string
          transitions?: string[] | null
          updated_at?: string
          user_id?: string
          video_url?: string | null
        }
        Relationships: []
      }
      exercise_sets: {
        Row: {
          category: string
          created_at: string
          description: string | null
          exercises: Json
          id: string
          name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          category?: string
          created_at?: string
          description?: string | null
          exercises?: Json
          id?: string
          name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          exercises?: Json
          id?: string
          name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      exercises: {
        Row: {
          category: string | null
          created_at: string | null
          cues: string | null
          difficulty: string | null
          id: string
          muscles: string[] | null
          name: string
          pregnancy_safe: boolean | null
          props: string[] | null
          springs: string[] | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          cues?: string | null
          difficulty?: string | null
          id?: string
          muscles?: string[] | null
          name: string
          pregnancy_safe?: boolean | null
          props?: string[] | null
          springs?: string[] | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          cues?: string | null
          difficulty?: string | null
          id?: string
          muscles?: string[] | null
          name?: string
          pregnancy_safe?: boolean | null
          props?: string[] | null
          springs?: string[] | null
        }
        Relationships: []
      }
      flows: {
        Row: {
          content: Json | null
          created_at: string | null
          id: string
          title: string | null
          user_id: string | null
        }
        Insert: {
          content?: Json | null
          created_at?: string | null
          id?: string
          title?: string | null
          user_id?: string | null
        }
        Update: {
          content?: Json | null
          created_at?: string | null
          id?: string
          title?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_preferences: {
        Row: {
          created_at: string
          dark_mode: boolean | null
          favorite_exercises: Json | null
          id: string
          show_pregnancy_safe_only: boolean | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          dark_mode?: boolean | null
          favorite_exercises?: Json | null
          id?: string
          show_pregnancy_safe_only?: boolean | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          dark_mode?: boolean | null
          favorite_exercises?: Json | null
          id?: string
          show_pregnancy_safe_only?: boolean | null
          updated_at?: string
          user_id?: string
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
