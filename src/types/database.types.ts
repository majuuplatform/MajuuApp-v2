export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      agencies: {
        Row: {
          account_number: string | null
          active: boolean
          address: Json | null
          contact_email: string
          contact_phone: string | null
          created_at: string
          created_by: string | null
          daraja_consumer_key: string | null
          daraja_consumer_secret: string | null
          daraja_passkey: string | null
          description: string | null
          headquarter_country_iso: string | null
          id: string
          logo_url: string | null
          metadata: Json | null
          name: string
          paybill_number: string | null
          payment_type: string | null
          slug: string
          till_number: string | null
          updated_at: string | null
          website: string | null
          verified: boolean
        }
        Insert: {
          account_number?: string | null
          active?: boolean
          address?: Json | null
          contact_email: string
          contact_phone?: string | null
          created_at?: string
          created_by?: string | null
          daraja_consumer_key?: string | null
          daraja_consumer_secret?: string | null
          daraja_passkey?: string | null
          description?: string | null
          headquarter_country_iso?: string | null
          id?: string
          logo_url?: string | null
          metadata?: Json | null
          name: string
          paybill_number?: string | null
          payment_type?: string | null
          slug: string
          till_number?: string | null
          updated_at?: string | null
          website?: string | null
          verified?: boolean
        }
        Update: {
          account_number?: string | null
          active?: boolean
          address?: Json | null
          contact_email?: string
          contact_phone?: string | null
          created_at?: string
          created_by?: string | null
          daraja_consumer_key?: string | null
          daraja_consumer_secret?: string | null
          daraja_passkey?: string | null
          description?: string | null
          headquarter_country_iso?: string | null
          id?: string
          logo_url?: string | null
          metadata?: Json | null
          name?: string
          paybill_number?: string | null
          payment_type?: string | null
          slug?: string
          till_number?: string | null
          updated_at?: string | null
          website?: string | null
          verified?: boolean
        }
      }
      agency_admins: {
        Row: {
          agency_id: string
          created_at: string
          id: string
          is_primary: boolean
          role: string
          user_id: string
        }
        Insert: {
          agency_id: string
          created_at?: string
          id?: string
          is_primary?: boolean
          role?: string
          user_id: string
        }
        Update: {
          agency_id?: string
          created_at?: string
          id?: string
          is_primary?: boolean
          role?: string
          user_id?: string
        }
      }
      agency_services: {
        Row: {
          active: boolean
          agency_id: string
          agency_price: number
          created_at: string
          currency: string
          effective_from: string
          id: string
          metadata: Json | null
          service_id: string
          updated_at: string | null
        }
        Insert: {
          active?: boolean
          agency_id: string
          agency_price: number
          created_at?: string
          currency?: string
          effective_from?: string
          id?: string
          metadata?: Json | null
          service_id: string
          updated_at?: string | null
        }
        Update: {
          active?: boolean
          agency_id?: string
          agency_price?: number
          created_at?: string
          currency?: string
          effective_from?: string
          id?: string
          metadata?: Json | null
          service_id?: string
          updated_at?: string | null
        }
      }
      analytics_events: {
        Row: {
          actor_id: string | null
          agency_id: string | null
          country_iso: string | null
          created_at: string
          event_type: string
          id: string
          properties: Json | null
          request_id: string | null
          service_id: string | null
        }
        Insert: {
          actor_id?: string | null
          agency_id?: string | null
          country_iso?: string | null
          created_at?: string
          event_type: string
          id?: string
          properties?: Json | null
          request_id?: string | null
          service_id?: string | null
        }
        Update: {
          actor_id?: string | null
          agency_id?: string | null
          country_iso?: string | null
          created_at?: string
          event_type?: string
          id?: string
          properties?: Json | null
          request_id?: string | null
          service_id?: string | null
        }
      }
      audit_logs: {
        Row: {
          action: string
          actor_id: string | null
          actor_role: string | null
          created_at: string
          details: Json | null
          id: string
          ip_address: string | null
          target_id: string | null
          target_table: string | null
          user_agent: string | null
        }
        Insert: {
          action: string
          actor_id?: string | null
          actor_role?: string | null
          created_at?: string
          details?: Json | null
          id?: string
          ip_address?: string | null
          target_id?: string | null
          target_table?: string | null
          user_agent?: string | null
        }
        Update: {
          action?: string
          actor_id?: string | null
          actor_role?: string | null
          created_at?: string
          details?: Json | null
          id?: string
          ip_address?: string | null
          target_id?: string | null
          target_table?: string | null
          user_agent?: string | null
        }
      }
      categories: {
        Row: {
          description: string | null
          icon_url: string | null
          id: string
          title: string
        }
        Insert: {
          description?: string | null
          icon_url?: string | null
          id: string
          title: string
        }
        Update: {
          description?: string | null
          icon_url?: string | null
          id?: string
          title?: string
        }
      }
      chat_messages: {
        Row: {
          attachments: Json | null
          content: string | null
          created_at: string
          deleted: boolean
          edited_at: string | null
          id: string
          sender_id: string
          thread_id: string
        }
        Insert: {
          attachments?: Json | null
          content?: string | null
          created_at?: string
          deleted?: boolean
          edited_at?: string | null
          id?: string
          sender_id: string
          thread_id: string
        }
        Update: {
          attachments?: Json | null
          content?: string | null
          created_at?: string
          deleted?: boolean
          edited_at?: string | null
          id?: string
          sender_id?: string
          thread_id?: string
        }
      }
      chat_threads: {
        Row: {
          created_by: string | null
          id: string
          is_unlocked: boolean
          last_message_at: string | null
          metadata: Json | null
          request_id: string
          started_at: string | null
        }
        Insert: {
          created_by?: string | null
          id?: string
          is_unlocked?: boolean
          last_message_at?: string | null
          metadata?: Json | null
          request_id: string
          started_at?: string | null
        }
        Update: {
          created_by?: string | null
          id?: string
          is_unlocked?: boolean
          last_message_at?: string | null
          metadata?: Json | null
          request_id?: string
          started_at?: string | null
        }
      }
      countries: {
        Row: {
          created_at: string
          currency_code: string | null
          flag_url: string | null
          iso_code: string
          meta: Json | null
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string
          currency_code?: string | null
          flag_url?: string | null
          iso_code: string
          meta?: Json | null
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          currency_code?: string | null
          flag_url?: string | null
          iso_code?: string
          meta?: Json | null
          name?: string
          updated_at?: string | null
        }
      }
      documents: {
        Row: {
          attached_message_id: string | null
          created_at: string
          filename: string
          id: string
          metadata: Json | null
          mime_type: string | null
          origin: Database['public']['Enums']['document_origin']
          request_id: string | null
          size_bytes: number | null
          storage_path: string
          uploader_id: string
          visibility: Database['public']['Enums']['document_visibility']
        }
        Insert: {
          attached_message_id?: string | null
          created_at?: string
          filename: string
          id?: string
          metadata?: Json | null
          mime_type?: string | null
          origin: Database['public']['Enums']['document_origin']
          request_id?: string | null
          size_bytes?: number | null
          storage_path: string
          uploader_id: string
          visibility?: Database['public']['Enums']['document_visibility']
        }
        Update: {
          attached_message_id?: string | null
          created_at?: string
          filename?: string
          id?: string
          metadata?: Json | null
          mime_type?: string | null
          origin?: Database['public']['Enums']['document_origin']
          request_id?: string | null
          size_bytes?: number | null
          storage_path?: string
          uploader_id?: string
          visibility?: Database['public']['Enums']['document_visibility']
        }
      }
      featured_countries: {
        Row: {
          active: boolean
          category_id: string
          country_id: string
          created_at: string
          created_by: string | null
          display_order: number
          id: string
          updated_at: string | null
        }
        Insert: {
          active?: boolean
          category_id: string
          country_id: string
          created_at?: string
          created_by?: string | null
          display_order?: number
          id?: string
          updated_at?: string | null
        }
        Update: {
          active?: boolean
          category_id?: string
          country_id?: string
          created_at?: string
          created_by?: string | null
          display_order?: number
          id?: string
          updated_at?: string | null
        }
      }
      form_fields: {
        Row: {
          created_at: string
          display_order: number
          field_key: string
          field_type: Database['public']['Enums']['form_field_type']
          id: string
          label: string
          options: Json | null
          placeholder: string | null
          required: boolean
          section: string | null
          template_id: string
          validation_rules: Json | null
        }
        Insert: {
          created_at?: string
          display_order?: number
          field_key: string
          field_type: Database['public']['Enums']['form_field_type']
          id?: string
          label: string
          options?: Json | null
          placeholder?: string | null
          required?: boolean
          section?: string | null
          template_id: string
          validation_rules?: Json | null
        }
        Update: {
          created_at?: string
          display_order?: number
          field_key?: string
          field_type?: Database['public']['Enums']['form_field_type']
          id?: string
          label?: string
          options?: Json | null
          placeholder?: string | null
          required?: boolean
          section?: string | null
          template_id?: string
          validation_rules?: Json | null
        }
      }
      form_responses: {
        Row: {
          created_at: string
          data: Json
          form_template_id: string
          id: string
          request_id: string
          submitted: boolean
          submitted_at: string | null
          template_version: number
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          data?: Json
          form_template_id: string
          id?: string
          request_id: string
          submitted?: boolean
          submitted_at?: string | null
          template_version: number
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          data?: Json
          form_template_id?: string
          id?: string
          request_id?: string
          submitted?: boolean
          submitted_at?: string | null
          template_version?: number
          updated_at?: string | null
          user_id?: string
        }
      }
      form_templates: {
        Row: {
          active: boolean
          created_at: string
          created_by: string | null
          id: string
          name: string
          schema: Json | null
          service_id: string
          ui_schema: Json | null
          updated_at: string | null
          version: number
        }
        Insert: {
          active?: boolean
          created_at?: string
          created_by?: string | null
          id?: string
          name: string
          schema?: Json | null
          service_id: string
          ui_schema?: Json | null
          updated_at?: string | null
          version?: number
        }
        Update: {
          active?: boolean
          created_at?: string
          created_by?: string | null
          id?: string
          name?: string
          schema?: Json | null
          service_id?: string
          ui_schema?: Json | null
          updated_at?: string | null
          version?: number
        }
      }
      message_reads: {
        Row: {
          id: string
          message_id: string
          read_at: string
          user_id: string
        }
        Insert: {
          id?: string
          message_id: string
          read_at?: string
          user_id: string
        }
        Update: {
          id?: string
          message_id?: string
          read_at?: string
          user_id?: string
        }
      }
      notifications: {
        Row: {
          actor_id: string | null
          agency_id: string | null
          created_at: string
          expires_at: string | null
          id: string
          is_read: boolean
          payload: Json
          recipient_agency_id: string | null
          recipient_user_id: string | null
          type: string
        }
        Insert: {
          actor_id?: string | null
          agency_id?: string | null
          created_at?: string
          expires_at?: string | null
          id?: string
          is_read?: boolean
          payload: Json
          recipient_agency_id?: string | null
          recipient_user_id?: string | null
          type: string
        }
        Update: {
          actor_id?: string | null
          agency_id?: string | null
          created_at?: string
          expires_at?: string | null
          id?: string
          is_read?: boolean
          payload?: Json
          recipient_agency_id?: string | null
          recipient_user_id?: string | null
          type?: string
        }
      }
      payments: {
        Row: {
          amount: number
          created_at: string
          currency: string
          id: string
          metadata: Json | null
          payee_agency_id: string | null
          payer_id: string
          provider: string
          provider_payment_id: string | null
          request_id: string | null
          status: Database['public']['Enums']['payment_status']
          type: Database['public']['Enums']['payment_type']
          updated_at: string | null
        }
        Insert: {
          amount: number
          created_at?: string
          currency?: string
          id?: string
          metadata?: Json | null
          payee_agency_id?: string | null
          payer_id: string
          provider: string
          provider_payment_id?: string | null
          request_id?: string | null
          status: Database['public']['Enums']['payment_status']
          type: Database['public']['Enums']['payment_type']
          updated_at?: string | null
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string
          id?: string
          metadata?: Json | null
          payee_agency_id?: string | null
          payer_id?: string
          provider?: string
          provider_payment_id?: string | null
          request_id?: string | null
          status?: Database['public']['Enums']['payment_status']
          type?: Database['public']['Enums']['payment_type']
          updated_at?: string | null
        }
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          display_name: string | null
          email: string
          full_name: string | null
          id: string
          locale: string | null
          metadata: Json | null
          phone: string | null
          role: Database['public']['Enums']['profile_role'] | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          email: string
          full_name?: string | null
          id: string
          locale?: string | null
          metadata?: Json | null
          phone?: string | null
          role?: Database['public']['Enums']['profile_role'] | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          email?: string
          full_name?: string | null
          id?: string
          locale?: string | null
          metadata?: Json | null
          phone?: string | null
          role?: Database['public']['Enums']['profile_role'] | null
          updated_at?: string | null
        }
      }
      progress_updates: {
        Row: {
          actor_id: string
          actor_role: string
          created_at: string
          data: Json | null
          id: string
          note: string | null
          request_id: string
          status_snapshot: string | null
          visible_to_user: boolean
        }
        Insert: {
          actor_id: string
          actor_role: string
          created_at?: string
          data?: Json | null
          id?: string
          note?: string | null
          request_id: string
          status_snapshot?: string | null
          visible_to_user?: boolean
        }
        Update: {
          actor_id?: string
          actor_role?: string
          created_at?: string
          data?: Json | null
          id?: string
          note?: string | null
          request_id?: string
          status_snapshot?: string | null
          visible_to_user?: boolean
        }
      }
      requests: {
        Row: {
          agency_id: string
          archived_at: string | null
          assigned_to: string | null
          category_id: string
          completed_at: string | null
          country_iso: string
          created_at: string
          id: string
          is_chat_unlocked: boolean
          metadata: Json | null
          priority: number
          request_number: string
          result: Database['public']['Enums']['request_result'] | null
          service_id: string
          started_at: string | null
          status: Database['public']['Enums']['request_status']
          unlock_fee_paid: boolean
          updated_at: string | null
          user_id: string
        }
        Insert: {
          agency_id: string
          archived_at?: string | null
          assigned_to?: string | null
          category_id: string
          completed_at?: string | null
          country_iso: string
          created_at?: string
          id?: string
          is_chat_unlocked?: boolean
          metadata?: Json | null
          priority?: number
          request_number: string
          result?: Database['public']['Enums']['request_result'] | null
          service_id: string
          started_at?: string | null
          status?: Database['public']['Enums']['request_status']
          unlock_fee_paid?: boolean
          updated_at?: string | null
          user_id: string
        }
        Update: {
          agency_id?: string
          archived_at?: string | null
          assigned_to?: string | null
          category_id?: string
          completed_at?: string | null
          country_iso?: string
          created_at?: string
          id?: string
          is_chat_unlocked?: boolean
          metadata?: Json | null
          priority?: number
          request_number?: string
          result?: Database['public']['Enums']['request_result'] | null
          service_id?: string
          started_at?: string | null
          status?: Database['public']['Enums']['request_status']
          unlock_fee_paid?: boolean
          updated_at?: string | null
          user_id?: string
        }
      }
      resource_history: {
        Row: {
          id: string
          opened_at: string
          resource_id: string
          user_id: string
        }
        Insert: {
          id?: string
          opened_at?: string
          resource_id: string
          user_id: string
        }
        Update: {
          id?: string
          opened_at?: string
          resource_id?: string
          user_id?: string
        }
      }
      resources: {
        Row: {
          active: boolean
          category_id: string
          country_id: string
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          resource_type: Database['public']['Enums']['resource_type']
          tags: string[] | null
          thumbnail_url: string | null
          title: string
          updated_at: string | null
          url: string
        }
        Insert: {
          active?: boolean
          category_id: string
          country_id: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          resource_type: Database['public']['Enums']['resource_type']
          tags?: string[] | null
          thumbnail_url?: string | null
          title: string
          updated_at?: string | null
          url: string
        }
        Update: {
          active?: boolean
          category_id?: string
          country_id?: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          resource_type?: Database['public']['Enums']['resource_type']
          tags?: string[] | null
          thumbnail_url?: string | null
          title?: string
          updated_at?: string | null
          url?: string
        }
      }
      service_views: {
        Row: {
          agency_id: string | null
          created_at: string
          id: string
          service_id: string
          session_id: string | null
          user_id: string | null
        }
        Insert: {
          agency_id?: string | null
          created_at?: string
          id?: string
          service_id: string
          session_id?: string | null
          user_id?: string | null
        }
        Update: {
          agency_id?: string | null
          created_at?: string
          id?: string
          service_id?: string
          session_id?: string | null
          user_id?: string | null
        }
      }
      services: {
        Row: {
          category_id: string
          country_iso: string
          created_at: string
          created_by: string | null
          currency: string
          description: string | null
          discount_percentage: number
          duration_estimate: string | null
          id: string
          metadata: Json | null
          published: boolean
          slug: string
          tags: string[] | null
          thumbnail_url: string | null
          title: string
          unlock_fee: number
          updated_at: string | null
        }
        Insert: {
          category_id: string
          country_iso: string
          created_at?: string
          created_by?: string | null
          currency?: string
          description?: string | null
          discount_percentage?: number
          duration_estimate?: string | null
          id?: string
          metadata?: Json | null
          published?: boolean
          slug: string
          tags?: string[] | null
          thumbnail_url?: string | null
          title: string
          unlock_fee?: number
          updated_at?: string | null
        }
        Update: {
          category_id?: string
          country_iso?: string
          created_at?: string
          created_by?: string | null
          currency?: string
          description?: string | null
          discount_percentage?: number
          duration_estimate?: string | null
          id?: string
          metadata?: Json | null
          published?: boolean
          slug?: string
          tags?: string[] | null
          thumbnail_url?: string | null
          title?: string
          unlock_fee?: number
          updated_at?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_agency_admin_of: {
        Args: {
          p_agency_id: string
        }
        Returns: boolean
      }
      is_request_agency_admin: {
        Args: {
          p_request_id: string
        }
        Returns: boolean
      }
      is_super_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      owns_request: {
        Args: {
          p_request_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      document_origin: "FORM" | "CHAT" | "USER" | "AGENCY"
      document_visibility: "PRIVATE" | "AGENCY" | "PUBLIC"
      form_field_type:
        | "TEXT"
        | "NUMBER"
        | "DATE"
        | "SELECT"
        | "MULTI_SELECT"
        | "FILE"
        | "BOOLEAN"
      payment_status: "PENDING" | "SUCCESS" | "FAILED" | "REFUNDED"
      payment_type: "UNLOCK_FEE" | "SERVICE_PAYMENT"
      profile_role: "user" | "agency_admin" | "super_admin"
      request_result: "SUCCESS" | "FAILED"
      request_status: "NEW" | "IN_PROGRESS" | "DONE"
      resource_type: "LINK" | "ARTICLE" | "AFFILIATE"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
