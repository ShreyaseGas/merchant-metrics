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
          action_id: string
          assigned_to: string | null
          created_at: string | null
          description: string
          due_date: string | null
          priority: string | null
          status: string | null
          user_id: string | null
        }
        Insert: {
          action_id?: string
          assigned_to?: string | null
          created_at?: string | null
          description: string
          due_date?: string | null
          priority?: string | null
          status?: string | null
          user_id?: string | null
        }
        Update: {
          action_id?: string
          assigned_to?: string | null
          created_at?: string | null
          description?: string
          due_date?: string | null
          priority?: string | null
          status?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "action_items_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      fulfillment: {
        Row: {
          actual_delivery_date: string | null
          estimated_delivery_date: string | null
          fulfillment_id: string
          sale_id: string | null
          shipment_status: string | null
          shipping_provider: string | null
          tracking_id: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          actual_delivery_date?: string | null
          estimated_delivery_date?: string | null
          fulfillment_id?: string
          sale_id?: string | null
          shipment_status?: string | null
          shipping_provider?: string | null
          tracking_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          actual_delivery_date?: string | null
          estimated_delivery_date?: string | null
          fulfillment_id?: string
          sale_id?: string | null
          shipment_status?: string | null
          shipping_provider?: string | null
          tracking_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fulfillment_sale_id_fkey"
            columns: ["sale_id"]
            isOneToOne: false
            referencedRelation: "sales"
            referencedColumns: ["sale_id"]
          },
          {
            foreignKeyName: "fulfillment_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      inventory_tracker: {
        Row: {
          inventory_id: string
          product_id: string | null
          stock_in: number | null
          stock_lost: number | null
          stock_out: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          inventory_id?: string
          product_id?: string | null
          stock_in?: number | null
          stock_lost?: number | null
          stock_out?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          inventory_id?: string
          product_id?: string | null
          stock_in?: number | null
          stock_lost?: number | null
          stock_out?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "inventory_tracker_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "inventory_tracker_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number
          payment_date: string | null
          payment_id: string
          payment_method: string | null
          payment_status: string | null
          sale_id: string | null
          user_id: string | null
        }
        Insert: {
          amount: number
          payment_date?: string | null
          payment_id?: string
          payment_method?: string | null
          payment_status?: string | null
          sale_id?: string | null
          user_id?: string | null
        }
        Update: {
          amount?: number
          payment_date?: string | null
          payment_id?: string
          payment_method?: string | null
          payment_status?: string | null
          sale_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_sale_id_fkey"
            columns: ["sale_id"]
            isOneToOne: false
            referencedRelation: "sales"
            referencedColumns: ["sale_id"]
          },
          {
            foreignKeyName: "payments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      platforms: {
        Row: {
          created_at: string | null
          description: string | null
          name: string
          platform_id: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          name: string
          platform_id?: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          name?: string
          platform_id?: string
        }
        Relationships: []
      }
      products: {
        Row: {
          category: string | null
          created_at: string | null
          description: string | null
          name: string
          price: number
          product_id: string
          sku: string
          stock_quantity: number | null
          user_id: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          name: string
          price: number
          product_id?: string
          sku: string
          stock_quantity?: number | null
          user_id?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          name?: string
          price?: number
          product_id?: string
          sku?: string
          stock_quantity?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "products_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      returns: {
        Row: {
          processed_date: string | null
          product_id: string | null
          reason: string | null
          requested_date: string | null
          return_id: string
          return_status: string | null
          sale_id: string | null
          user_id: string | null
        }
        Insert: {
          processed_date?: string | null
          product_id?: string | null
          reason?: string | null
          requested_date?: string | null
          return_id?: string
          return_status?: string | null
          sale_id?: string | null
          user_id?: string | null
        }
        Update: {
          processed_date?: string | null
          product_id?: string | null
          reason?: string | null
          requested_date?: string | null
          return_id?: string
          return_status?: string | null
          sale_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "returns_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "returns_sale_id_fkey"
            columns: ["sale_id"]
            isOneToOne: false
            referencedRelation: "sales"
            referencedColumns: ["sale_id"]
          },
          {
            foreignKeyName: "returns_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      sales: {
        Row: {
          platform_id: string | null
          product_id: string | null
          quantity: number
          sale_date: string | null
          sale_id: string
          status: string | null
          total_amount: number
          user_id: string | null
        }
        Insert: {
          platform_id?: string | null
          product_id?: string | null
          quantity: number
          sale_date?: string | null
          sale_id?: string
          status?: string | null
          total_amount: number
          user_id?: string | null
        }
        Update: {
          platform_id?: string | null
          product_id?: string | null
          quantity?: number
          sale_date?: string | null
          sale_id?: string
          status?: string | null
          total_amount?: number
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sales_platform_id_fkey"
            columns: ["platform_id"]
            isOneToOne: false
            referencedRelation: "platforms"
            referencedColumns: ["platform_id"]
          },
          {
            foreignKeyName: "sales_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "sales_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      users: {
        Row: {
          business_name: string | null
          created_at: string | null
          email: string
          name: string
          password_hash: string
          user_id: string
        }
        Insert: {
          business_name?: string | null
          created_at?: string | null
          email: string
          name: string
          password_hash: string
          user_id?: string
        }
        Update: {
          business_name?: string | null
          created_at?: string | null
          email?: string
          name?: string
          password_hash?: string
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