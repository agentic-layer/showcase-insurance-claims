export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      call_speaker_segments: {
        Row: {
          call_id: string
          confidence: number | null
          created_at: string
          end_time: number
          id: string
          speaker_id: string
          start_time: number
          text: string
        }
        Insert: {
          call_id: string
          confidence?: number | null
          created_at?: string
          end_time: number
          id?: string
          speaker_id: string
          start_time: number
          text: string
        }
        Update: {
          call_id?: string
          confidence?: number | null
          created_at?: string
          end_time?: number
          id?: string
          speaker_id?: string
          start_time?: number
          text?: string
        }
        Relationships: []
      }
      call_transcripts: {
        Row: {
          call_id: string
          created_at: string
          duration_seconds: number | null
          ended_at: string | null
          id: string
          metadata: Json | null
          processed_at: string | null
          recording_url: string | null
          speaker_count: number | null
          started_at: string | null
          status: string
          transcript_language: string | null
          transcript_text: string | null
        }
        Insert: {
          call_id: string
          created_at?: string
          duration_seconds?: number | null
          ended_at?: string | null
          id?: string
          metadata?: Json | null
          processed_at?: string | null
          recording_url?: string | null
          speaker_count?: number | null
          started_at?: string | null
          status: string
          transcript_language?: string | null
          transcript_text?: string | null
        }
        Update: {
          call_id?: string
          created_at?: string
          duration_seconds?: number | null
          ended_at?: string | null
          id?: string
          metadata?: Json | null
          processed_at?: string | null
          recording_url?: string | null
          speaker_count?: number | null
          started_at?: string | null
          status?: string
          transcript_language?: string | null
          transcript_text?: string | null
        }
        Relationships: []
      }
      claims: {
        Row: {
          accident_date: string | null
          accident_location: Json | null
          bodily_injury: boolean | null
          claim_number: string | null
          conversation_id: string | null
          created_at: string
          customer_id: string | null
          driver: Json | null
          id: string
          incident_description: string | null
          material_damage: string | null
          metadata: Json | null
          overall_sentiment: string | null
          raw_transcript_id: string | null
          status: string | null
          updated_at: string | null
          vehicle_id: string | null
        }
        Insert: {
          accident_date?: string | null
          accident_location?: Json | null
          bodily_injury?: boolean | null
          claim_number?: string | null
          conversation_id?: string | null
          created_at?: string
          customer_id?: string | null
          driver?: Json | null
          id?: string
          incident_description?: string | null
          material_damage?: string | null
          metadata?: Json | null
          overall_sentiment?: string | null
          raw_transcript_id?: string | null
          status?: string | null
          updated_at?: string | null
          vehicle_id?: string | null
        }
        Update: {
          accident_date?: string | null
          accident_location?: Json | null
          bodily_injury?: boolean | null
          claim_number?: string | null
          conversation_id?: string | null
          created_at?: string
          customer_id?: string | null
          driver?: Json | null
          id?: string
          incident_description?: string | null
          material_damage?: string | null
          metadata?: Json | null
          overall_sentiment?: string | null
          raw_transcript_id?: string | null
          status?: string | null
          updated_at?: string | null
          vehicle_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "claims_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      conversations: {
        Row: {
          accumulated_cost: number | null
          agent_id: string | null
          analysis: Json | null
          call_direction: string | null
          call_duration_seconds: number | null
          call_id: string
          call_metadata: Json | null
          call_quality_metrics: Json | null
          call_status: string | null
          call_summary: string | null
          call_type: string | null
          caller_number: string | null
          collected_data: Json | null
          conversation_config: Json | null
          conversation_id: string | null
          cost: number | null
          cost_breakdown: Json | null
          created_at: string | null
          customer_id: string | null
          data_collected: Json | null
          duration_seconds: number | null
          elevenlabs_agent_id: string | null
          elevenlabs_conversation_id: string | null
          elevenlabs_metadata: Json | null
          end_time: string | null
          full_transcript: Json | null
          id: string
          key_topics: string[] | null
          language_code: string | null
          metadata: Json | null
          raw_data: Json | null
          recording_sid: string | null
          recording_url: string | null
          sentiment_label: string | null
          sentiment_score: number | null
          speaker_count: number | null
          start_time: string | null
          status: string | null
          summary: string | null
          transcript: Json | null
          transcript_confidence: number | null
          transcript_text: string | null
          updated_at: string | null
        }
        Insert: {
          accumulated_cost?: number | null
          agent_id?: string | null
          analysis?: Json | null
          call_direction?: string | null
          call_duration_seconds?: number | null
          call_id: string
          call_metadata?: Json | null
          call_quality_metrics?: Json | null
          call_status?: string | null
          call_summary?: string | null
          call_type?: string | null
          caller_number?: string | null
          collected_data?: Json | null
          conversation_config?: Json | null
          conversation_id?: string | null
          cost?: number | null
          cost_breakdown?: Json | null
          created_at?: string | null
          customer_id?: string | null
          data_collected?: Json | null
          duration_seconds?: number | null
          elevenlabs_agent_id?: string | null
          elevenlabs_conversation_id?: string | null
          elevenlabs_metadata?: Json | null
          end_time?: string | null
          full_transcript?: Json | null
          id?: string
          key_topics?: string[] | null
          language_code?: string | null
          metadata?: Json | null
          raw_data?: Json | null
          recording_sid?: string | null
          recording_url?: string | null
          sentiment_label?: string | null
          sentiment_score?: number | null
          speaker_count?: number | null
          start_time?: string | null
          status?: string | null
          summary?: string | null
          transcript?: Json | null
          transcript_confidence?: number | null
          transcript_text?: string | null
          updated_at?: string | null
        }
        Update: {
          accumulated_cost?: number | null
          agent_id?: string | null
          analysis?: Json | null
          call_direction?: string | null
          call_duration_seconds?: number | null
          call_id?: string
          call_metadata?: Json | null
          call_quality_metrics?: Json | null
          call_status?: string | null
          call_summary?: string | null
          call_type?: string | null
          caller_number?: string | null
          collected_data?: Json | null
          conversation_config?: Json | null
          conversation_id?: string | null
          cost?: number | null
          cost_breakdown?: Json | null
          created_at?: string | null
          customer_id?: string | null
          data_collected?: Json | null
          duration_seconds?: number | null
          elevenlabs_agent_id?: string | null
          elevenlabs_conversation_id?: string | null
          elevenlabs_metadata?: Json | null
          end_time?: string | null
          full_transcript?: Json | null
          id?: string
          key_topics?: string[] | null
          language_code?: string | null
          metadata?: Json | null
          raw_data?: Json | null
          recording_sid?: string | null
          recording_url?: string | null
          sentiment_label?: string | null
          sentiment_score?: number | null
          speaker_count?: number | null
          start_time?: string | null
          status?: string | null
          summary?: string | null
          transcript?: Json | null
          transcript_confidence?: number | null
          transcript_text?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "conversations_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      customers: {
        Row: {
          city: string | null
          country: string | null
          created_at: string
          customer_id: string
          date_of_birth: string | null
          email: string | null
          first_name: string | null
          house_number: string | null
          id: string
          last_name: string | null
          metadata: Json | null
          phone_number: string
          postal_code: string | null
          street: string | null
          updated_at: string | null
        }
        Insert: {
          city?: string | null
          country?: string | null
          created_at?: string
          customer_id?: string
          date_of_birth?: string | null
          email?: string | null
          first_name?: string | null
          house_number?: string | null
          id?: string
          last_name?: string | null
          metadata?: Json | null
          phone_number: string
          postal_code?: string | null
          street?: string | null
          updated_at?: string | null
        }
        Update: {
          city?: string | null
          country?: string | null
          created_at?: string
          customer_id?: string
          date_of_birth?: string | null
          email?: string | null
          first_name?: string | null
          house_number?: string | null
          id?: string
          last_name?: string | null
          metadata?: Json | null
          phone_number?: string
          postal_code?: string | null
          street?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      decision_logs: {
        Row: {
          action: string
          claim_id: string | null
          confidence_score: number | null
          created_at: string
          customer_id: string | null
          error_message: string | null
          id: string
          input_data: Json | null
          model_name: string | null
          model_version: string | null
          output_data: Json | null
          prompt_version: string | null
          reference_type: Database["public"]["Enums"]["decision_reference_type"]
          status: string
        }
        Insert: {
          action: string
          claim_id?: string | null
          confidence_score?: number | null
          created_at?: string
          customer_id?: string | null
          error_message?: string | null
          id?: string
          input_data?: Json | null
          model_name?: string | null
          model_version?: string | null
          output_data?: Json | null
          prompt_version?: string | null
          reference_type: Database["public"]["Enums"]["decision_reference_type"]
          status: string
        }
        Update: {
          action?: string
          claim_id?: string | null
          confidence_score?: number | null
          created_at?: string
          customer_id?: string | null
          error_message?: string | null
          id?: string
          input_data?: Json | null
          model_name?: string | null
          model_version?: string | null
          output_data?: Json | null
          prompt_version?: string | null
          reference_type?: Database["public"]["Enums"]["decision_reference_type"]
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "decision_logs_claim_id_fkey"
            columns: ["claim_id"]
            isOneToOne: false
            referencedRelation: "claims"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "decision_logs_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      decisions: {
        Row: {
          claim_id: string
          created_at: string
          decision_confidence: number | null
          decision_metadata: Json | null
          decision_status: string
          decision_type: string
          id: string
        }
        Insert: {
          claim_id: string
          created_at?: string
          decision_confidence?: number | null
          decision_metadata?: Json | null
          decision_status: string
          decision_type: string
          id?: string
        }
        Update: {
          claim_id?: string
          created_at?: string
          decision_confidence?: number | null
          decision_metadata?: Json | null
          decision_status?: string
          decision_type?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "decisions_claim_id_fkey"
            columns: ["claim_id"]
            isOneToOne: false
            referencedRelation: "claims"
            referencedColumns: ["id"]
          },
        ]
      }
      raw_webhook_events: {
        Row: {
          event_type: string
          id: string
          payload: Json
          processed: boolean | null
          received_at: string
        }
        Insert: {
          event_type: string
          id?: string
          payload: Json
          processed?: boolean | null
          received_at?: string
        }
        Update: {
          event_type?: string
          id?: string
          payload?: Json
          processed?: boolean | null
          received_at?: string
        }
        Relationships: []
      }
      sentiment_analysis: {
        Row: {
          claim_id: string | null
          conversation_id: string | null
          created_at: string
          id: string
          key_phrases: string[] | null
          metadata: Json | null
          overall_sentiment: string | null
          sentiment_score: number | null
        }
        Insert: {
          claim_id?: string | null
          conversation_id?: string | null
          created_at?: string
          id?: string
          key_phrases?: string[] | null
          metadata?: Json | null
          overall_sentiment?: string | null
          sentiment_score?: number | null
        }
        Update: {
          claim_id?: string | null
          conversation_id?: string | null
          created_at?: string
          id?: string
          key_phrases?: string[] | null
          metadata?: Json | null
          overall_sentiment?: string | null
          sentiment_score?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "sentiment_analysis_claim_id_fkey"
            columns: ["claim_id"]
            isOneToOne: false
            referencedRelation: "claims"
            referencedColumns: ["id"]
          },
        ]
      }
      vehicles: {
        Row: {
          created_at: string
          customer_id: string
          id: string
          license_plate: string
          make: string | null
          metadata: Json | null
          model: string | null
        }
        Insert: {
          created_at?: string
          customer_id: string
          id?: string
          license_plate: string
          make?: string | null
          metadata?: Json | null
          model?: string | null
        }
        Update: {
          created_at?: string
          customer_id?: string
          id?: string
          license_plate?: string
          make?: string | null
          metadata?: Json | null
          model?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vehicles_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      verification_attempts: {
        Row: {
          address_verified: boolean | null
          agent_id: string | null
          conversation_id: string | null
          created_at: string | null
          customer_id: string | null
          id: string
          input_data: Json
          match_confidence: number | null
          matched_customer_id: string | null
          updated_at: string | null
        }
        Insert: {
          address_verified?: boolean | null
          agent_id?: string | null
          conversation_id?: string | null
          created_at?: string | null
          customer_id?: string | null
          id?: string
          input_data: Json
          match_confidence?: number | null
          matched_customer_id?: string | null
          updated_at?: string | null
        }
        Update: {
          address_verified?: boolean | null
          agent_id?: string | null
          conversation_id?: string | null
          created_at?: string | null
          customer_id?: string | null
          id?: string
          input_data?: Json
          match_confidence?: number | null
          matched_customer_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "verification_attempts_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["customer_id"]
          },
          {
            foreignKeyName: "verification_attempts_matched_customer_id_fkey"
            columns: ["matched_customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["customer_id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_claim_number: {
        Args: { claim_id: string }
        Returns: string
      }
      log_verification_attempt: {
        Args:
          | {
              p_customer_id: string
              p_matched_customer_id: string
              p_input_data: Json
              p_match_confidence: number
              p_address_verified: boolean
              p_status: string
            }
          | {
              p_customer_id: string
              p_matched_customer_id: string
              p_input_data: Json
              p_match_confidence: number
              p_address_verified: boolean
              p_status: string
              p_agent_id?: string
              p_conversation_id?: string
            }
        Returns: Json
      }
      populate_claims_sentiment: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
    }
    Enums: {
      claim_status:
        | "new"
        | "awaiting_photos"
        | "escalated_to_human"
        | "processing_automated"
        | "closed"
      decision_reference_type:
        | "customer_verification"
        | "claim_creation"
        | "sentiment_analysis"
        | "chunk_extraction"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      claim_status: [
        "new",
        "awaiting_photos",
        "escalated_to_human",
        "processing_automated",
        "closed",
      ],
      decision_reference_type: [
        "customer_verification",
        "claim_creation",
        "sentiment_analysis",
        "chunk_extraction",
      ],
    },
  },
} as const
