export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.15"
  }
  public: {
    Tables: {
      concepts: {
        Row: {
          created_at: string
          id: string
          memory_hook: string | null
          professional_explanation: string | null
          simple_explanation: string | null
          slug: string
          status: Database["public"]["Enums"]["content_status"]
          tattoo_relevance: string | null
          title: string
          topic_id: string
          updated_at: string
          visual_prompt: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          memory_hook?: string | null
          professional_explanation?: string | null
          simple_explanation?: string | null
          slug: string
          status?: Database["public"]["Enums"]["content_status"]
          tattoo_relevance?: string | null
          title: string
          topic_id: string
          updated_at?: string
          visual_prompt?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          memory_hook?: string | null
          professional_explanation?: string | null
          simple_explanation?: string | null
          slug?: string
          status?: Database["public"]["Enums"]["content_status"]
          tattoo_relevance?: string | null
          title?: string
          topic_id?: string
          updated_at?: string
          visual_prompt?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "concepts_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "topics"
            referencedColumns: ["id"]
          },
        ]
      }
      content_conflicts: {
        Row: {
          claim_a: string
          claim_b: string
          created_at: string
          created_by: string
          id: string
          resolution: string | null
          resolved_at: string | null
          source_a: string | null
          source_b: string | null
          status: Database["public"]["Enums"]["review_decision"]
          subject: string
        }
        Insert: {
          claim_a: string
          claim_b: string
          created_at?: string
          created_by: string
          id?: string
          resolution?: string | null
          resolved_at?: string | null
          source_a?: string | null
          source_b?: string | null
          status?: Database["public"]["Enums"]["review_decision"]
          subject: string
        }
        Update: {
          claim_a?: string
          claim_b?: string
          created_at?: string
          created_by?: string
          id?: string
          resolution?: string | null
          resolved_at?: string | null
          source_a?: string | null
          source_b?: string | null
          status?: Database["public"]["Enums"]["review_decision"]
          subject?: string
        }
        Relationships: []
      }
      facts: {
        Row: {
          claim_scope: string
          concept_id: string
          confidence: number
          created_at: string
          id: string
          source_excerpt: string | null
          source_label: string | null
          source_url: string | null
          statement: string
          status: Database["public"]["Enums"]["content_status"]
        }
        Insert: {
          claim_scope?: string
          concept_id: string
          confidence?: number
          created_at?: string
          id?: string
          source_excerpt?: string | null
          source_label?: string | null
          source_url?: string | null
          statement: string
          status?: Database["public"]["Enums"]["content_status"]
        }
        Update: {
          claim_scope?: string
          concept_id?: string
          confidence?: number
          created_at?: string
          id?: string
          source_excerpt?: string | null
          source_label?: string | null
          source_url?: string | null
          statement?: string
          status?: Database["public"]["Enums"]["content_status"]
        }
        Relationships: [
          {
            foreignKeyName: "facts_concept_id_fkey"
            columns: ["concept_id"]
            isOneToOne: false
            referencedRelation: "concepts"
            referencedColumns: ["id"]
          },
        ]
      }
      import_batches: {
        Row: {
          completed_at: string | null
          created_at: string
          created_by: string
          error_message: string | null
          generation_instructions: string | null
          id: string
          requested_levels: Database["public"]["Enums"]["difficulty_level"][]
          requested_question_types: Database["public"]["Enums"]["question_type"][]
          source_document_id: string
          started_at: string | null
          status: Database["public"]["Enums"]["import_status"]
          target_topic_slug: string | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          created_by: string
          error_message?: string | null
          generation_instructions?: string | null
          id?: string
          requested_levels?: Database["public"]["Enums"]["difficulty_level"][]
          requested_question_types?: Database["public"]["Enums"]["question_type"][]
          source_document_id: string
          started_at?: string | null
          status?: Database["public"]["Enums"]["import_status"]
          target_topic_slug?: string | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          created_by?: string
          error_message?: string | null
          generation_instructions?: string | null
          id?: string
          requested_levels?: Database["public"]["Enums"]["difficulty_level"][]
          requested_question_types?: Database["public"]["Enums"]["question_type"][]
          source_document_id?: string
          started_at?: string | null
          status?: Database["public"]["Enums"]["import_status"]
          target_topic_slug?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "import_batches_source_document_id_fkey"
            columns: ["source_document_id"]
            isOneToOne: false
            referencedRelation: "source_documents"
            referencedColumns: ["id"]
          },
        ]
      }
      import_items: {
        Row: {
          approved_record_id: string | null
          batch_id: string
          created_at: string
          difficulty: Database["public"]["Enums"]["difficulty_level"] | null
          id: string
          item_type: Database["public"]["Enums"]["import_item_type"]
          proposed_payload: Json
          review_decision: Database["public"]["Enums"]["review_decision"]
          reviewed_at: string | null
          reviewer_notes: string | null
          source_excerpt: string | null
        }
        Insert: {
          approved_record_id?: string | null
          batch_id: string
          created_at?: string
          difficulty?: Database["public"]["Enums"]["difficulty_level"] | null
          id?: string
          item_type: Database["public"]["Enums"]["import_item_type"]
          proposed_payload: Json
          review_decision?: Database["public"]["Enums"]["review_decision"]
          reviewed_at?: string | null
          reviewer_notes?: string | null
          source_excerpt?: string | null
        }
        Update: {
          approved_record_id?: string | null
          batch_id?: string
          created_at?: string
          difficulty?: Database["public"]["Enums"]["difficulty_level"] | null
          id?: string
          item_type?: Database["public"]["Enums"]["import_item_type"]
          proposed_payload?: Json
          review_decision?: Database["public"]["Enums"]["review_decision"]
          reviewed_at?: string | null
          reviewer_notes?: string | null
          source_excerpt?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "import_items_batch_id_fkey"
            columns: ["batch_id"]
            isOneToOne: false
            referencedRelation: "import_batches"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          display_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          display_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          display_name?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      question_options: {
        Row: {
          id: string
          is_correct: boolean
          option_text: string
          question_id: string
          sort_order: number
        }
        Insert: {
          id?: string
          is_correct?: boolean
          option_text: string
          question_id: string
          sort_order?: number
        }
        Update: {
          id?: string
          is_correct?: boolean
          option_text?: string
          question_id?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "question_options_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
        ]
      }
      questions: {
        Row: {
          concept_id: string
          created_at: string
          difficulty: Database["public"]["Enums"]["difficulty_level"]
          explanation: string
          fact_id: string | null
          id: string
          image_url: string | null
          prompt: string
          status: Database["public"]["Enums"]["content_status"]
          type: Database["public"]["Enums"]["question_type"]
          updated_at: string
        }
        Insert: {
          concept_id: string
          created_at?: string
          difficulty: Database["public"]["Enums"]["difficulty_level"]
          explanation: string
          fact_id?: string | null
          id?: string
          image_url?: string | null
          prompt: string
          status?: Database["public"]["Enums"]["content_status"]
          type: Database["public"]["Enums"]["question_type"]
          updated_at?: string
        }
        Update: {
          concept_id?: string
          created_at?: string
          difficulty?: Database["public"]["Enums"]["difficulty_level"]
          explanation?: string
          fact_id?: string | null
          id?: string
          image_url?: string | null
          prompt?: string
          status?: Database["public"]["Enums"]["content_status"]
          type?: Database["public"]["Enums"]["question_type"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "questions_concept_id_fkey"
            columns: ["concept_id"]
            isOneToOne: false
            referencedRelation: "concepts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "questions_fact_id_fkey"
            columns: ["fact_id"]
            isOneToOne: false
            referencedRelation: "facts"
            referencedColumns: ["id"]
          },
        ]
      }
      source_documents: {
        Row: {
          created_at: string
          created_by: string
          id: string
          notes: string | null
          raw_text: string
          source_label: string | null
          source_type: string
          source_url: string | null
          status: Database["public"]["Enums"]["import_status"]
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by: string
          id?: string
          notes?: string | null
          raw_text: string
          source_label?: string | null
          source_type?: string
          source_url?: string | null
          status?: Database["public"]["Enums"]["import_status"]
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string
          id?: string
          notes?: string | null
          raw_text?: string
          source_label?: string | null
          source_type?: string
          source_url?: string | null
          status?: Database["public"]["Enums"]["import_status"]
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      speaking_challenges: {
        Row: {
          concept_id: string
          difficulty: Database["public"]["Enums"]["difficulty_level"]
          id: string
          ideal_points: Json
          prompt: string
          status: Database["public"]["Enums"]["content_status"]
          target_seconds: number
        }
        Insert: {
          concept_id: string
          difficulty: Database["public"]["Enums"]["difficulty_level"]
          id?: string
          ideal_points?: Json
          prompt: string
          status?: Database["public"]["Enums"]["content_status"]
          target_seconds?: number
        }
        Update: {
          concept_id?: string
          difficulty?: Database["public"]["Enums"]["difficulty_level"]
          id?: string
          ideal_points?: Json
          prompt?: string
          status?: Database["public"]["Enums"]["content_status"]
          target_seconds?: number
        }
        Relationships: [
          {
            foreignKeyName: "speaking_challenges_concept_id_fkey"
            columns: ["concept_id"]
            isOneToOne: false
            referencedRelation: "concepts"
            referencedColumns: ["id"]
          },
        ]
      }
      study_attempts: {
        Row: {
          attempted_at: string
          confidence_rating: number | null
          id: string
          question_id: string
          response_seconds: number | null
          selected_option_id: string | null
          user_id: string
          was_correct: boolean | null
          written_response: string | null
        }
        Insert: {
          attempted_at?: string
          confidence_rating?: number | null
          id?: string
          question_id: string
          response_seconds?: number | null
          selected_option_id?: string | null
          user_id: string
          was_correct?: boolean | null
          written_response?: string | null
        }
        Update: {
          attempted_at?: string
          confidence_rating?: number | null
          id?: string
          question_id?: string
          response_seconds?: number | null
          selected_option_id?: string | null
          user_id?: string
          was_correct?: boolean | null
          written_response?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "study_attempts_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "study_attempts_selected_option_id_fkey"
            columns: ["selected_option_id"]
            isOneToOne: false
            referencedRelation: "question_options"
            referencedColumns: ["id"]
          },
        ]
      }
      study_state: {
        Row: {
          due_at: string
          ease_factor: number
          id: string
          interval_days: number
          last_seen_at: string | null
          mastery_score: number
          question_id: string
          repetitions: number
          user_id: string
        }
        Insert: {
          due_at?: string
          ease_factor?: number
          id?: string
          interval_days?: number
          last_seen_at?: string | null
          mastery_score?: number
          question_id: string
          repetitions?: number
          user_id: string
        }
        Update: {
          due_at?: string
          ease_factor?: number
          id?: string
          interval_days?: number
          last_seen_at?: string | null
          mastery_score?: number
          question_id?: string
          repetitions?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "study_state_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
        ]
      }
      topics: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          parent_id: string | null
          slug: string
          sort_order: number
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          parent_id?: string | null
          slug: string
          sort_order?: number
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          parent_id?: string | null
          slug?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "topics_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "topics"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      import_review_queue: {
        Row: {
          batch_id: string | null
          created_at: string | null
          difficulty: Database["public"]["Enums"]["difficulty_level"] | null
          id: string | null
          item_type: Database["public"]["Enums"]["import_item_type"] | null
          proposed_payload: Json | null
          review_decision: Database["public"]["Enums"]["review_decision"] | null
          reviewer_notes: string | null
          source_excerpt: string | null
          source_title: string | null
        }
        Relationships: [
          {
            foreignKeyName: "import_items_batch_id_fkey"
            columns: ["batch_id"]
            isOneToOne: false
            referencedRelation: "import_batches"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      content_status: "draft" | "approved" | "needs_review" | "archived"
      difficulty_level: "easy" | "medium" | "advanced" | "mastery"
      import_item_type:
        | "concept"
        | "fact"
        | "question"
        | "speaking_challenge"
        | "memory_hook"
        | "visual_prompt"
      import_status:
        | "draft"
        | "queued"
        | "processing"
        | "ready_for_review"
        | "approved"
        | "failed"
        | "archived"
      question_type:
        | "multiple_choice"
        | "true_false"
        | "written"
        | "scenario"
        | "speaking"
        | "image"
      review_decision: "pending" | "approved" | "rejected" | "edited"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database["public"]

export type Tables<
  T extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"]),
> = (DefaultSchema["Tables"] & DefaultSchema["Views"])[T] extends { Row: infer R } ? R : never

export type Enums<T extends keyof DefaultSchema["Enums"]> = DefaultSchema["Enums"][T]
