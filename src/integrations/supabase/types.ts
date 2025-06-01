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
      class_plan_exercises: {
        Row: {
          class_plan_id: string
          created_at: string | null
          duration_override: number | null
          exercise_id: string
          exercise_type: string
          id: string
          is_section_divider: boolean | null
          notes: string | null
          position: number
          reps_override: string | null
          section_name: string | null
        }
        Insert: {
          class_plan_id: string
          created_at?: string | null
          duration_override?: number | null
          exercise_id: string
          exercise_type: string
          id?: string
          is_section_divider?: boolean | null
          notes?: string | null
          position: number
          reps_override?: string | null
          section_name?: string | null
        }
        Update: {
          class_plan_id?: string
          created_at?: string | null
          duration_override?: number | null
          exercise_id?: string
          exercise_type?: string
          id?: string
          is_section_divider?: boolean | null
          notes?: string | null
          position?: number
          reps_override?: string | null
          section_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "class_plan_exercises_class_plan_id_fkey"
            columns: ["class_plan_id"]
            isOneToOne: false
            referencedRelation: "class_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      class_plans: {
        Row: {
          copy_count: number | null
          created_at: string | null
          description: string | null
          difficulty_level: string | null
          duration_minutes: number | null
          id: string
          image_url: string | null
          is_public: boolean | null
          name: string
          notes: string | null
          share_token: string | null
          tags: string[] | null
          updated_at: string | null
          user_id: string
          view_count: number | null
        }
        Insert: {
          copy_count?: number | null
          created_at?: string | null
          description?: string | null
          difficulty_level?: string | null
          duration_minutes?: number | null
          id?: string
          image_url?: string | null
          is_public?: boolean | null
          name: string
          notes?: string | null
          share_token?: string | null
          tags?: string[] | null
          updated_at?: string | null
          user_id: string
          view_count?: number | null
        }
        Update: {
          copy_count?: number | null
          created_at?: string | null
          description?: string | null
          difficulty_level?: string | null
          duration_minutes?: number | null
          id?: string
          image_url?: string | null
          is_public?: boolean | null
          name?: string
          notes?: string | null
          share_token?: string | null
          tags?: string[] | null
          updated_at?: string | null
          user_id?: string
          view_count?: number | null
        }
        Relationships: []
      }
      exercise_analytics: {
        Row: {
          action: string
          class_plan_id: string | null
          created_at: string | null
          exercise_id: string
          exercise_type: string
          id: string
          metadata: Json | null
          user_id: string
        }
        Insert: {
          action: string
          class_plan_id?: string | null
          created_at?: string | null
          exercise_id: string
          exercise_type: string
          id?: string
          metadata?: Json | null
          user_id: string
        }
        Update: {
          action?: string
          class_plan_id?: string | null
          created_at?: string | null
          exercise_id?: string
          exercise_type?: string
          id?: string
          metadata?: Json | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "exercise_analytics_class_plan_id_fkey"
            columns: ["class_plan_id"]
            isOneToOne: false
            referencedRelation: "class_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      exercise_bundles: {
        Row: {
          created_at: string | null
          description: string | null
          download_count: number | null
          exercise_count: number | null
          icon_url: string | null
          id: string
          is_featured: boolean | null
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          download_count?: number | null
          exercise_count?: number | null
          icon_url?: string | null
          id?: string
          is_featured?: boolean | null
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          download_count?: number | null
          exercise_count?: number | null
          icon_url?: string | null
          id?: string
          is_featured?: boolean | null
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      exercise_store: {
        Row: {
          admin_notes: string | null
          breathing_cues: string[] | null
          bundle_id: string | null
          category: string
          contraindications: string[] | null
          created_at: string | null
          cues: string[] | null
          description: string | null
          difficulty: string
          download_count: number | null
          duration: number | null
          equipment: string[] | null
          id: string
          image_url: string | null
          is_featured: boolean | null
          is_pregnancy_safe: boolean | null
          modifications: string[] | null
          muscle_groups: string[]
          name: string
          notes: string | null
          progressions: string[] | null
          regressions: string[] | null
          reps_or_duration: string | null
          setup: string | null
          springs: string
          target_areas: string[] | null
          teaching_focus: string[] | null
          tempo: string | null
          updated_at: string | null
          video_url: string | null
        }
        Insert: {
          admin_notes?: string | null
          breathing_cues?: string[] | null
          bundle_id?: string | null
          category: string
          contraindications?: string[] | null
          created_at?: string | null
          cues?: string[] | null
          description?: string | null
          difficulty: string
          download_count?: number | null
          duration?: number | null
          equipment?: string[] | null
          id?: string
          image_url?: string | null
          is_featured?: boolean | null
          is_pregnancy_safe?: boolean | null
          modifications?: string[] | null
          muscle_groups?: string[]
          name: string
          notes?: string | null
          progressions?: string[] | null
          regressions?: string[] | null
          reps_or_duration?: string | null
          setup?: string | null
          springs: string
          target_areas?: string[] | null
          teaching_focus?: string[] | null
          tempo?: string | null
          updated_at?: string | null
          video_url?: string | null
        }
        Update: {
          admin_notes?: string | null
          breathing_cues?: string[] | null
          bundle_id?: string | null
          category?: string
          contraindications?: string[] | null
          created_at?: string | null
          cues?: string[] | null
          description?: string | null
          difficulty?: string
          download_count?: number | null
          duration?: number | null
          equipment?: string[] | null
          id?: string
          image_url?: string | null
          is_featured?: boolean | null
          is_pregnancy_safe?: boolean | null
          modifications?: string[] | null
          muscle_groups?: string[]
          name?: string
          notes?: string | null
          progressions?: string[] | null
          regressions?: string[] | null
          reps_or_duration?: string | null
          setup?: string | null
          springs?: string
          target_areas?: string[] | null
          teaching_focus?: string[] | null
          tempo?: string | null
          updated_at?: string | null
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_exercise_store_bundle"
            columns: ["bundle_id"]
            isOneToOne: false
            referencedRelation: "exercise_bundles"
            referencedColumns: ["id"]
          },
        ]
      }
      system_exercises: {
        Row: {
          breathing_cues: string[] | null
          category: string
          contraindications: string[] | null
          created_at: string | null
          cues: string[] | null
          description: string | null
          difficulty: string
          duration: number | null
          equipment: string[] | null
          id: string
          image_url: string | null
          is_active: boolean | null
          is_pregnancy_safe: boolean | null
          modifications: string[] | null
          muscle_groups: string[]
          name: string
          notes: string | null
          progressions: string[] | null
          regressions: string[] | null
          reps_or_duration: string | null
          setup: string | null
          springs: string
          target_areas: string[] | null
          teaching_focus: string[] | null
          tempo: string | null
          updated_at: string | null
          version: number | null
          video_url: string | null
        }
        Insert: {
          breathing_cues?: string[] | null
          category: string
          contraindications?: string[] | null
          created_at?: string | null
          cues?: string[] | null
          description?: string | null
          difficulty: string
          duration?: number | null
          equipment?: string[] | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          is_pregnancy_safe?: boolean | null
          modifications?: string[] | null
          muscle_groups: string[]
          name: string
          notes?: string | null
          progressions?: string[] | null
          regressions?: string[] | null
          reps_or_duration?: string | null
          setup?: string | null
          springs: string
          target_areas?: string[] | null
          teaching_focus?: string[] | null
          tempo?: string | null
          updated_at?: string | null
          version?: number | null
          video_url?: string | null
        }
        Update: {
          breathing_cues?: string[] | null
          category?: string
          contraindications?: string[] | null
          created_at?: string | null
          cues?: string[] | null
          description?: string | null
          difficulty?: string
          duration?: number | null
          equipment?: string[] | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          is_pregnancy_safe?: boolean | null
          modifications?: string[] | null
          muscle_groups?: string[]
          name?: string
          notes?: string | null
          progressions?: string[] | null
          regressions?: string[] | null
          reps_or_duration?: string | null
          setup?: string | null
          springs?: string
          target_areas?: string[] | null
          teaching_focus?: string[] | null
          tempo?: string | null
          updated_at?: string | null
          version?: number | null
          video_url?: string | null
        }
        Relationships: []
      }
      user_exercise_customizations: {
        Row: {
          created_at: string | null
          custom_breathing_cues: string[] | null
          custom_cues: string[] | null
          custom_difficulty: string | null
          custom_duration: number | null
          custom_modifications: string[] | null
          custom_name: string | null
          custom_notes: string | null
          custom_reps_or_duration: string | null
          custom_setup: string | null
          custom_springs: string | null
          custom_target_areas: string[] | null
          custom_teaching_focus: string[] | null
          custom_tempo: string | null
          id: string
          is_favorite: boolean | null
          is_hidden: boolean | null
          last_used_at: string | null
          system_exercise_id: string
          updated_at: string | null
          usage_count: number | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          custom_breathing_cues?: string[] | null
          custom_cues?: string[] | null
          custom_difficulty?: string | null
          custom_duration?: number | null
          custom_modifications?: string[] | null
          custom_name?: string | null
          custom_notes?: string | null
          custom_reps_or_duration?: string | null
          custom_setup?: string | null
          custom_springs?: string | null
          custom_target_areas?: string[] | null
          custom_teaching_focus?: string[] | null
          custom_tempo?: string | null
          id?: string
          is_favorite?: boolean | null
          is_hidden?: boolean | null
          last_used_at?: string | null
          system_exercise_id: string
          updated_at?: string | null
          usage_count?: number | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          custom_breathing_cues?: string[] | null
          custom_cues?: string[] | null
          custom_difficulty?: string | null
          custom_duration?: number | null
          custom_modifications?: string[] | null
          custom_name?: string | null
          custom_notes?: string | null
          custom_reps_or_duration?: string | null
          custom_setup?: string | null
          custom_springs?: string | null
          custom_target_areas?: string[] | null
          custom_teaching_focus?: string[] | null
          custom_tempo?: string | null
          id?: string
          is_favorite?: boolean | null
          is_hidden?: boolean | null
          last_used_at?: string | null
          system_exercise_id?: string
          updated_at?: string | null
          usage_count?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_exercise_customizations_system_exercise_id_fkey"
            columns: ["system_exercise_id"]
            isOneToOne: false
            referencedRelation: "system_exercises"
            referencedColumns: ["id"]
          },
        ]
      }
      user_exercise_library: {
        Row: {
          added_at: string | null
          id: string
          store_exercise_id: string | null
          user_id: string
        }
        Insert: {
          added_at?: string | null
          id?: string
          store_exercise_id?: string | null
          user_id: string
        }
        Update: {
          added_at?: string | null
          id?: string
          store_exercise_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_exercise_library_store_exercise_id_fkey"
            columns: ["store_exercise_id"]
            isOneToOne: false
            referencedRelation: "exercise_store"
            referencedColumns: ["id"]
          },
        ]
      }
      user_exercises: {
        Row: {
          ai_generation_cost: number | null
          ai_prompt: string | null
          breathing_cues: string[] | null
          category: string
          contraindications: string[] | null
          created_at: string | null
          cues: string[] | null
          description: string | null
          difficulty: string
          duration: number | null
          equipment: string[] | null
          id: string
          image_url: string | null
          is_ai_generated: boolean | null
          is_pregnancy_safe: boolean | null
          modifications: string[] | null
          muscle_groups: string[]
          name: string
          notes: string | null
          progressions: string[] | null
          regressions: string[] | null
          reps_or_duration: string | null
          setup: string | null
          springs: string
          target_areas: string[] | null
          teaching_focus: string[] | null
          tempo: string | null
          updated_at: string | null
          user_id: string
          video_url: string | null
        }
        Insert: {
          ai_generation_cost?: number | null
          ai_prompt?: string | null
          breathing_cues?: string[] | null
          category: string
          contraindications?: string[] | null
          created_at?: string | null
          cues?: string[] | null
          description?: string | null
          difficulty: string
          duration?: number | null
          equipment?: string[] | null
          id?: string
          image_url?: string | null
          is_ai_generated?: boolean | null
          is_pregnancy_safe?: boolean | null
          modifications?: string[] | null
          muscle_groups: string[]
          name: string
          notes?: string | null
          progressions?: string[] | null
          regressions?: string[] | null
          reps_or_duration?: string | null
          setup?: string | null
          springs: string
          target_areas?: string[] | null
          teaching_focus?: string[] | null
          tempo?: string | null
          updated_at?: string | null
          user_id: string
          video_url?: string | null
        }
        Update: {
          ai_generation_cost?: number | null
          ai_prompt?: string | null
          breathing_cues?: string[] | null
          category?: string
          contraindications?: string[] | null
          created_at?: string | null
          cues?: string[] | null
          description?: string | null
          difficulty?: string
          duration?: number | null
          equipment?: string[] | null
          id?: string
          image_url?: string | null
          is_ai_generated?: boolean | null
          is_pregnancy_safe?: boolean | null
          modifications?: string[] | null
          muscle_groups?: string[]
          name?: string
          notes?: string | null
          progressions?: string[] | null
          regressions?: string[] | null
          reps_or_duration?: string | null
          setup?: string | null
          springs?: string
          target_areas?: string[] | null
          teaching_focus?: string[] | null
          tempo?: string | null
          updated_at?: string | null
          user_id?: string
          video_url?: string | null
        }
        Relationships: []
      }
      user_preferences: {
        Row: {
          bio: string | null
          created_at: string | null
          dark_mode: boolean | null
          default_class_duration: number | null
          favorite_equipment: string[] | null
          id: string
          profile_image_url: string | null
          show_pregnancy_safe_only: boolean | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          bio?: string | null
          created_at?: string | null
          dark_mode?: boolean | null
          default_class_duration?: number | null
          favorite_equipment?: string[] | null
          id?: string
          profile_image_url?: string | null
          show_pregnancy_safe_only?: boolean | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          bio?: string | null
          created_at?: string | null
          dark_mode?: boolean | null
          default_class_duration?: number | null
          favorite_equipment?: string[] | null
          id?: string
          profile_image_url?: string | null
          show_pregnancy_safe_only?: boolean | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_sync_data: {
        Row: {
          class_plan: Json | null
          created_at: string
          id: string
          preferences: Json | null
          synced_at: string
          updated_at: string
          user_id: string
        }
        Insert: {
          class_plan?: Json | null
          created_at?: string
          id?: string
          preferences?: Json | null
          synced_at?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          class_plan?: Json | null
          created_at?: string
          id?: string
          preferences?: Json | null
          synced_at?: string
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
