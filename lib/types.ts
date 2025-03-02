export interface Store {
  id: string
  name: string
  address: string
  latitude: number
  longitude: number
  phone: string
  openingHours: string
  isOpen: boolean
  inventoryCount: number
}

export interface Product {
  id: string
  name: string
  sku: string
  description: string
  price: number
  category: string
  image: string
  stockQuantity: number
  location: string // Aisle/shelf location within the store
}

