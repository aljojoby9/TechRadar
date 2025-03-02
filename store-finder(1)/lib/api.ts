import type { Store, Product } from "./types"

// Mock data for demonstration purposes
// In a real application, these would be API calls to your backend

export const mockStores: Store[] = [
  {
    id: "1",
    name: "Downtown Superstore",
    address: "123 Main St, Downtown, City",
    latitude: 40.7128,
    longitude: -74.006,
    phone: "(555) 123-4567",
    openingHours: "Mon-Fri: 8AM-9PM, Sat-Sun: 9AM-7PM",
    isOpen: true,
    inventoryCount: 1245,
  },
  {
    id: "2",
    name: "Westside Market",
    address: "456 West Ave, Westside, City",
    latitude: 40.7138,
    longitude: -74.016,
    phone: "(555) 234-5678",
    openingHours: "Mon-Sat: 9AM-8PM, Sun: 10AM-6PM",
    isOpen: true,
    inventoryCount: 876,
  },
  {
    id: "3",
    name: "Eastside Electronics",
    address: "789 East Blvd, Eastside, City",
    latitude: 40.7118,
    longitude: -73.996,
    phone: "(555) 345-6789",
    openingHours: "Mon-Fri: 10AM-9PM, Sat-Sun: 11AM-7PM",
    isOpen: false,
    inventoryCount: 532,
  },
  {
    id: "4",
    name: "Northside Apparel",
    address: "101 North St, Northside, City",
    latitude: 40.7228,
    longitude: -74.003,
    phone: "(555) 456-7890",
    openingHours: "Mon-Sun: 10AM-8PM",
    isOpen: true,
    inventoryCount: 1089,
  },
  {
    id: "5",
    name: "Southside Home Goods",
    address: "202 South Ave, Southside, City",
    latitude: 40.7028,
    longitude: -74.009,
    phone: "(555) 567-8901",
    openingHours: "Mon-Sat: 8AM-10PM, Sun: 9AM-8PM",
    isOpen: true,
    inventoryCount: 743,
  },
]

export const mockProducts: { [key: string]: Product[] } = {
  "1": [
    {
      id: "p1",
      name: "Laptop Pro X",
      sku: "LPX001",
      description: "High-performance laptop with 16GB RAM",
      price: 1299.99,
      category: "Electronics",
      image: "/images/laptop.jpg",
      stockQuantity: 25,
      location: "Aisle 3, Shelf 2"
    },
    // Add more products...
  ],
  // Add more stores' products...
}

// Helper function to simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export async function fetchStores(): Promise<Store[]> {
  await delay(500)
  return mockStores
}

export async function fetchStoreById(id: string): Promise<Store> {
  await delay(300)
  const store = mockStores.find((store) => store.id === id)
  if (!store) {
    throw new Error(`Store with ID ${id} not found`)
  }
  return store
}

export async function fetchStoreProducts(storeId: string): Promise<Product[]> {
  await delay(700)
  return mockProducts[storeId] || []
}