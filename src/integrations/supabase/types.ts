export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      affiliate_codes: {
        Row: {
          active: boolean
          code: string
          created_at: string
          created_by: string
          id: string
          label: string | null
          owner_user_id: string | null
          trial_days: number
          updated_at: string
        }
        Insert: {
          active?: boolean
          code: string
          created_at?: string
          created_by: string
          id?: string
          label?: string | null
          owner_user_id?: string | null
          trial_days?: number
          updated_at?: string
        }
        Update: {
          active?: boolean
          code?: string
          created_at?: string
          created_by?: string
          id?: string
          label?: string | null
          owner_user_id?: string | null
          trial_days?: number
          updated_at?: string
        }
        Relationships: []
      }
      affiliate_referrals: {
        Row: {
          code: string
          code_id: string
          created_at: string
          id: string
          trial_days: number
          user_id: string
        }
        Insert: {
          code: string
          code_id: string
          created_at?: string
          id?: string
          trial_days: number
          user_id: string
        }
        Update: {
          code?: string
          code_id?: string
          created_at?: string
          id?: string
          trial_days?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "affiliate_referrals_code_id_fkey"
            columns: ["code_id"]
            isOneToOne: false
            referencedRelation: "affiliate_codes"
            referencedColumns: ["id"]
          },
        ]
      }
      announcements: {
        Row: {
          active: boolean
          audience: string
          body: string
          created_at: string
          created_by: string | null
          cta_label: string | null
          cta_url: string | null
          ends_at: string | null
          id: string
          severity: string
          starts_at: string
          title: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          audience?: string
          body: string
          created_at?: string
          created_by?: string | null
          cta_label?: string | null
          cta_url?: string | null
          ends_at?: string | null
          id?: string
          severity?: string
          starts_at?: string
          title: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          audience?: string
          body?: string
          created_at?: string
          created_by?: string | null
          cta_label?: string | null
          cta_url?: string | null
          ends_at?: string | null
          id?: string
          severity?: string
          starts_at?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      app_settings: {
        Row: {
          key: string
          updated_at: string
          value: string | null
        }
        Insert: {
          key: string
          updated_at?: string
          value?: string | null
        }
        Update: {
          key?: string
          updated_at?: string
          value?: string | null
        }
        Relationships: []
      }
      coach_usage: {
        Row: {
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      contact_messages: {
        Row: {
          created_at: string
          email: string
          id: string
          message: string
          name: string
          status: string
          subject: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
          status?: string
          subject: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
          status?: string
          subject?: string
        }
        Relationships: []
      }
      creative_performance: {
        Row: {
          ad_spend: number
          attributed_delivered: number
          attributed_orders: number
          created_at: string
          creative_id: string
          entry_date: string
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          ad_spend?: number
          attributed_delivered?: number
          attributed_orders?: number
          created_at?: string
          creative_id: string
          entry_date?: string
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          ad_spend?: number
          attributed_delivered?: number
          attributed_orders?: number
          created_at?: string
          creative_id?: string
          entry_date?: string
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "creative_performance_creative_id_fkey"
            columns: ["creative_id"]
            isOneToOne: false
            referencedRelation: "creatives"
            referencedColumns: ["id"]
          },
        ]
      }
      creatives: {
        Row: {
          budget_total: number | null
          created_at: string
          id: string
          name: string
          objective: string | null
          platform: string
          product_id: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          budget_total?: number | null
          created_at?: string
          id?: string
          name: string
          objective?: string | null
          platform?: string
          product_id: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          budget_total?: number | null
          created_at?: string
          id?: string
          name?: string
          objective?: string | null
          platform?: string
          product_id?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "creatives_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      daily_entries: {
        Row: {
          ad_budget: number
          ad_budget_currency: string
          business_mode: string
          cash_collected: number | null
          confirmed_orders: number | null
          created_at: string
          ctr: number | null
          delivered_by_zone: Json
          delivered_orders: number | null
          entry_date: string
          id: string
          include_meta_tax: boolean
          include_shopify_fees: boolean
          include_wave_fees: boolean
          notes: string | null
          product_id: string
          received_orders: number | null
          refunded_amount: number
          refunded_orders: number
          refused_orders: number | null
          shopify_orders: number
          total_revenue: number | null
          total_revenue_currency: string
          updated_at: string
          upsells: Json
          user_id: string
          visits: number | null
        }
        Insert: {
          ad_budget?: number
          ad_budget_currency?: string
          business_mode?: string
          cash_collected?: number | null
          confirmed_orders?: number | null
          created_at?: string
          ctr?: number | null
          delivered_by_zone?: Json
          delivered_orders?: number | null
          entry_date?: string
          id?: string
          include_meta_tax?: boolean
          include_shopify_fees?: boolean
          include_wave_fees?: boolean
          notes?: string | null
          product_id: string
          received_orders?: number | null
          refunded_amount?: number
          refunded_orders?: number
          refused_orders?: number | null
          shopify_orders?: number
          total_revenue?: number | null
          total_revenue_currency?: string
          updated_at?: string
          upsells?: Json
          user_id: string
          visits?: number | null
        }
        Update: {
          ad_budget?: number
          ad_budget_currency?: string
          business_mode?: string
          cash_collected?: number | null
          confirmed_orders?: number | null
          created_at?: string
          ctr?: number | null
          delivered_by_zone?: Json
          delivered_orders?: number | null
          entry_date?: string
          id?: string
          include_meta_tax?: boolean
          include_shopify_fees?: boolean
          include_wave_fees?: boolean
          notes?: string | null
          product_id?: string
          received_orders?: number | null
          refunded_amount?: number
          refunded_orders?: number
          refused_orders?: number | null
          shopify_orders?: number
          total_revenue?: number | null
          total_revenue_currency?: string
          updated_at?: string
          upsells?: Json
          user_id?: string
          visits?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "daily_entries_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number
          created_at: string
          currency: string
          external_transaction_id: string | null
          id: string
          paid_at: string | null
          payment_method: string
          plan: string
          raw_payload: Json | null
          reference: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          currency?: string
          external_transaction_id?: string | null
          id?: string
          paid_at?: string | null
          payment_method: string
          plan: string
          raw_payload?: Json | null
          reference: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string
          external_transaction_id?: string | null
          id?: string
          paid_at?: string | null
          payment_method?: string
          plan?: string
          raw_payload?: Json | null
          reference?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      products: {
        Row: {
          active: boolean
          business_mode: string
          cost_price: number
          countries: string[]
          created_at: string
          currency: string | null
          id: string
          image_url: string | null
          name: string
          sale_price: number
          shipping_cost: number
          shipping_zones: Json
          shopify_product_match: string | null
          shopify_shop_domain: string | null
          target_cpl: number
          testing_days: number
          testing_started_at: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          active?: boolean
          business_mode?: string
          cost_price?: number
          countries?: string[]
          created_at?: string
          currency?: string | null
          id?: string
          image_url?: string | null
          name: string
          sale_price?: number
          shipping_cost?: number
          shipping_zones?: Json
          shopify_product_match?: string | null
          shopify_shop_domain?: string | null
          target_cpl?: number
          testing_days?: number
          testing_started_at?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          active?: boolean
          business_mode?: string
          cost_price?: number
          countries?: string[]
          created_at?: string
          currency?: string | null
          id?: string
          image_url?: string | null
          name?: string
          sale_price?: number
          shipping_cost?: number
          shipping_zones?: Json
          shopify_product_match?: string | null
          shopify_shop_domain?: string | null
          target_cpl?: number
          testing_days?: number
          testing_started_at?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          active_mode: string
          auto_sync_enabled: boolean
          cod_currency: string
          country: string | null
          created_at: string
          currency: string
          display_name: string | null
          dropshipping_currency: string
          email: string | null
          first_name: string | null
          id: string
          last_name: string | null
          legacy_dual_mode: boolean
          meta_tax_pct: number
          onboarding_status: string
          onboarding_step: number
          phone: string | null
          phone_country_code: string | null
          referral_source: string | null
          selected_mode: string | null
          updated_at: string
          usd_to_xof_rate: number
        }
        Insert: {
          active_mode?: string
          auto_sync_enabled?: boolean
          cod_currency?: string
          country?: string | null
          created_at?: string
          currency?: string
          display_name?: string | null
          dropshipping_currency?: string
          email?: string | null
          first_name?: string | null
          id: string
          last_name?: string | null
          legacy_dual_mode?: boolean
          meta_tax_pct?: number
          onboarding_status?: string
          onboarding_step?: number
          phone?: string | null
          phone_country_code?: string | null
          referral_source?: string | null
          selected_mode?: string | null
          updated_at?: string
          usd_to_xof_rate?: number
        }
        Update: {
          active_mode?: string
          auto_sync_enabled?: boolean
          cod_currency?: string
          country?: string | null
          created_at?: string
          currency?: string
          display_name?: string | null
          dropshipping_currency?: string
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          legacy_dual_mode?: boolean
          meta_tax_pct?: number
          onboarding_status?: string
          onboarding_step?: number
          phone?: string | null
          phone_country_code?: string | null
          referral_source?: string | null
          selected_mode?: string | null
          updated_at?: string
          usd_to_xof_rate?: number
        }
        Relationships: []
      }
      roas_calculations: {
        Row: {
          created_at: string
          currency: string
          id: string
          mode: string
          payload: Json
          product_name: string
          summary: Json
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          currency: string
          id?: string
          mode: string
          payload?: Json
          product_name: string
          summary?: Json
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          currency?: string
          id?: string
          mode?: string
          payload?: Json
          product_name?: string
          summary?: Json
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      shopify_connections: {
        Row: {
          access_token: string
          active: boolean
          connected_at: string
          created_at: string
          currency: string | null
          id: string
          last_sync_at: string | null
          last_sync_message: string | null
          last_sync_status: string | null
          scopes: string | null
          shop_domain: string
          shop_name: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          access_token: string
          active?: boolean
          connected_at?: string
          created_at?: string
          currency?: string | null
          id?: string
          last_sync_at?: string | null
          last_sync_message?: string | null
          last_sync_status?: string | null
          scopes?: string | null
          shop_domain: string
          shop_name?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          access_token?: string
          active?: boolean
          connected_at?: string
          created_at?: string
          currency?: string | null
          id?: string
          last_sync_at?: string | null
          last_sync_message?: string | null
          last_sync_status?: string | null
          scopes?: string | null
          shop_domain?: string
          shop_name?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          cancel_at_period_end: boolean
          created_at: string
          current_period_end: string | null
          plan: string
          status: string
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          trial_ends_at: string
          updated_at: string
          user_id: string
        }
        Insert: {
          cancel_at_period_end?: boolean
          created_at?: string
          current_period_end?: string | null
          plan?: string
          status?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          trial_ends_at?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          cancel_at_period_end?: boolean
          created_at?: string
          current_period_end?: string | null
          plan?: string
          status?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          trial_ends_at?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      admin_delete_account: { Args: { _id: string }; Returns: string }
      admin_list_accounts: {
        Args: never
        Returns: {
          created_at: string
          display_name: string
          email: string
          id: string
          last_login_at: string
          role: string
          status: string
        }[]
      }
      admin_list_audit_logs: {
        Args: {
          _admin_email?: string
          _category?: string
          _page?: number
          _page_size?: number
          _search?: string
        }
        Returns: {
          action: string
          admin_email: string
          admin_id: string
          category: string
          created_at: string
          details: Json
          id: number
          target_email: string
          target_user_id: string
          total_count: number
        }[]
      }
      admin_log_action: {
        Args: {
          _action: string
          _admin_email: string
          _admin_id: string
          _category?: string
          _details?: Json
          _target_email?: string
          _target_user_id?: string
        }
        Returns: undefined
      }
      admin_update_account: {
        Args: { _id: string; _role: string; _status: string }
        Returns: string
      }
      admin_upsert_account: {
        Args: {
          _display_name: string
          _email: string
          _id: string
          _invited_by: string
          _role: string
        }
        Returns: undefined
      }
      get_admin_role: { Args: { _uid: string }; Returns: string }
      get_user_plan: { Args: { _uid: string }; Returns: string }
      has_dual_mode_access: { Args: { _uid: string }; Returns: boolean }
      has_history_limit: { Args: { _uid: string }; Returns: boolean }
      has_paid_access: { Args: { _uid: string }; Returns: boolean }
      has_pro_access: { Args: { _uid: string }; Returns: boolean }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin: { Args: { _uid: string }; Returns: boolean }
      validate_affiliate_code: {
        Args: { _code: string }
        Returns: {
          label: string
          trial_days: number
          valid: boolean
        }[]
      }
    }
    Enums: {
      app_role: "admin"
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
      app_role: ["admin"],
    },
  },
} as const
