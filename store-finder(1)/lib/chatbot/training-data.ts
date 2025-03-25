export interface TrainingData {
  patterns: string[];
  responses: string[];
  category: string;
  context?: {
    requiresStoreId?: boolean;
    requiresAuth?: boolean;
    requiresRole?: string[];
  };
}

export const trainingData: TrainingData[] = [
  // Store Information
  {
    patterns: [
      "where is the store located",
      "what is the store address",
      "store location",
      "where can I find the store",
      "store directions"
    ],
    responses: [
      "The store is located at {store.address}. You can find directions on our map.",
      "You can find us at {store.address}. Check our map for detailed directions."
    ],
    category: "location",
    context: { requiresStoreId: true }
  },
  {
    patterns: [
      "what are the opening hours",
      "when is the store open",
      "store hours",
      "business hours",
      "opening times"
    ],
    responses: [
      "Our store is open {store.opening_hours}.",
      "You can visit us during these hours: {store.opening_hours}."
    ],
    category: "hours",
    context: { requiresStoreId: true }
  },
  {
    patterns: [
      "is the store open now",
      "are you open",
      "store open",
      "currently open"
    ],
    responses: [
      "Yes, we are currently open!",
      "No, we are currently closed. We'll be open {store.next_opening_time}."
    ],
    category: "availability",
    context: { requiresStoreId: true }
  },

  // Inventory and Products
  {
    patterns: [
      "what products do you have",
      "show me your inventory",
      "what items are available",
      "product list",
      "available items"
    ],
    responses: [
      "We have several items in stock. Here are some highlights: {inventory_summary}",
      "Our current inventory includes: {inventory_summary}"
    ],
    category: "inventory",
    context: { requiresStoreId: true }
  },
  {
    patterns: [
      "do you have {product}",
      "is {product} in stock",
      "product availability",
      "stock status"
    ],
    responses: [
      "Yes, we have {product} in stock. It's priced at ${price}.",
      "Sorry, {product} is currently out of stock. We expect to restock soon."
    ],
    category: "product_availability",
    context: { requiresStoreId: true }
  },

  // Store Management
  {
    patterns: [
      "how do I add a store",
      "create new store",
      "register store",
      "add store"
    ],
    responses: [
      "To add a store, you need to be a registered store owner. Please sign up or log in to your account.",
      "Store registration is available for store owners. Please ensure you're logged in with the correct role."
    ],
    category: "store_management",
    context: { requiresAuth: true, requiresRole: ["store_owner"] }
  },
  {
    patterns: [
      "how do I manage inventory",
      "update inventory",
      "edit stock",
      "manage products"
    ],
    responses: [
      "You can manage your inventory through the store dashboard. Please log in to access these features.",
      "Inventory management is available in your store dashboard. Make sure you're logged in as a store owner."
    ],
    category: "inventory_management",
    context: { requiresAuth: true, requiresRole: ["store_owner"] }
  },

  // User Account
  {
    patterns: [
      "how do I sign up",
      "create account",
      "register",
      "new account"
    ],
    responses: [
      "You can create an account by clicking the 'Sign Up' button in the top right corner.",
      "To create an account, visit our sign-up page and follow the registration process."
    ],
    category: "account"
  },
  {
    patterns: [
      "how do I log in",
      "sign in",
      "login",
      "access account"
    ],
    responses: [
      "You can log in using the 'Sign In' button in the top right corner.",
      "To access your account, click the 'Sign In' button and enter your credentials."
    ],
    category: "account"
  },

  // General Help
  {
    patterns: [
      "help",
      "support",
      "how can I help you",
      "what can you do",
      "assistance"
    ],
    responses: [
      "I can help you with store locations, opening hours, product availability, and account management. What would you like to know?",
      "I'm here to help! I can provide information about stores, inventory, and help you manage your account. What do you need?"
    ],
    category: "help"
  },
  {
    patterns: [
      "contact support",
      "customer service",
      "get help",
      "support contact"
    ],
    responses: [
      "For additional support, please contact our customer service team at support@storefinder.com",
      "You can reach our support team at support@storefinder.com for any questions or concerns."
    ],
    category: "support"
  }
];

// Helper function to find the best matching pattern
export function findBestMatch(userInput: string, trainingData: TrainingData[]): TrainingData | null {
  const normalizedInput = userInput.toLowerCase().trim();
  
  for (const data of trainingData) {
    for (const pattern of data.patterns) {
      // Check for exact matches
      if (normalizedInput === pattern.toLowerCase()) {
        return data;
      }
      
      // Check for pattern with variables (e.g., "do you have {product}")
      const patternRegex = new RegExp(
        pattern.replace(/\{([^}]+)\}/g, '[^\\s]+').toLowerCase()
      );
      if (patternRegex.test(normalizedInput)) {
        return data;
      }
    }
  }
  
  return null;
}

// Helper function to extract variables from user input
export function extractVariables(userInput: string, pattern: string): Record<string, string> {
  const variables: Record<string, string> = {};
  const patternParts = pattern.split(/\{([^}]+)\}/g);
  const inputParts = userInput.toLowerCase().split(/\s+/);
  
  patternParts.forEach((part, index) => {
    if (part.startsWith('{') && part.endsWith('}')) {
      const varName = part.slice(1, -1);
      variables[varName] = inputParts[index - 1] || '';
    }
  });
  
  return variables;
} 