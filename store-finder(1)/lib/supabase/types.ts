export interface User {
  id: string
  email: string
  role: string
  created_at: string
}

export interface Store {
  id: string
  name: string
  address: string
  opening_hours: string
  next_opening_time: string
  created_at: string
  owner_id: string
}

export interface Inventory {
  id: string
  store_id: string
  name: string
  description: string
  price: number
  quantity: number
  created_at: string
  updated_at: string
}

export interface Database {
  public: {
    Tables: {
      users: {
        Row: User
        Insert: Omit<User, 'id' | 'created_at'>
        Update: Partial<Omit<User, 'id' | 'created_at'>>
      }
      stores: {
        Row: Store
        Insert: Omit<Store, 'id' | 'created_at'>
        Update: Partial<Omit<Store, 'id' | 'created_at'>>
      }
      inventory: {
        Row: Inventory
        Insert: Omit<Inventory, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Inventory, 'id' | 'created_at' | 'updated_at'>>
      }
    }
  }
} 