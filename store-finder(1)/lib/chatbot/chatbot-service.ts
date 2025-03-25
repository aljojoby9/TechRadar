import { createClient } from '@/lib/supabase/client';
import { Database } from '@/lib/supabase/types';

export interface ChatbotContext {
  storeId?: string;
  userId?: string;
  userRole?: string;
  isAuthenticated?: boolean;
}

// Define simple training data patterns for fallback responses
interface TrainingPattern {
  pattern: RegExp;
  responses: string[];
}

export class ChatbotService {
  private context: ChatbotContext;
  private supabase;
  private geminiApiKey: string;
  private trainingPatterns: TrainingPattern[];

  constructor(context: ChatbotContext) {
    this.context = context;
    this.supabase = createClient();
    this.geminiApiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || '';
    
    // Initialize training patterns for fallback responses
    this.trainingPatterns = [
      {
        pattern: /\b(hi|hello|hey|greetings)\b/i,
        responses: [
          "Hello! How can I help you today?",
          "Hi there! What can I do for you?",
          "Hey! Welcome to our store. How may I assist you?"
        ]
      },
      {
        pattern: /\b(store hours|opening hours|when (are you|is the store) open|hours of operation)\b/i,
        responses: [
          "Our store hours vary by location. Let me check the specific hours for you.",
          "I'd be happy to provide the opening hours for this store. Let me look that up for you."
        ]
      },
      {
        pattern: /\b(inventory|stock|product|item|availability)\b/i,
        responses: [
          "I can help you check our inventory. What item are you looking for?",
          "We have various products in stock. Can you specify which item you're interested in?",
          "I'd be happy to check if we have a specific product available."
        ]
      },
      {
        pattern: /\b(where|location|address|find|directions)\b/i,
        responses: [
          "Let me provide you with the store's address and location details.",
          "You can find our store at the address listed in the store information. Would you like directions?",
          "The store location is available in the store details. I can help you with directions if needed."
        ]
      },
      {
        pattern: /\b(thanks|thank you|appreciate)\b/i,
        responses: [
          "You're welcome! Is there anything else I can help you with?",
          "Happy to help! Let me know if you have any other questions.",
          "No problem at all. Feel free to ask if you need anything else."
        ]
      },
      {
        pattern: /\b(bye|goodbye|see you|farewell)\b/i,
        responses: [
          "Goodbye! Have a great day!",
          "Thank you for chatting. Come back anytime!",
          "Take care! We look forward to serving you again."
        ]
      }
    ];
  }

  private async getStoreData(storeId: string) {
    const { data: store, error } = await this.supabase
      .from('stores')
      .select('*')
      .eq('id', storeId)
      .single();

    if (error) {
      console.error('Error fetching store:', error);
      return null;
    }

    return store as Database['public']['Tables']['stores']['Row'];
  }

  private async getInventorySummary(storeId: string) {
    const { data: inventory, error } = await this.supabase
      .from('inventory')
      .select('*')
      .eq('store_id', storeId)
      .limit(5);

    if (error) {
      console.error('Error fetching inventory:', error);
      return 'Unable to fetch inventory details.';
    }

    return (inventory as Database['public']['Tables']['inventory']['Row'][])
      .map(item => `${item.name} (${item.quantity} in stock)`)
      .join(', ');
  }

  private async checkProductAvailability(storeId: string, productName: string) {
    const { data: product, error } = await this.supabase
      .from('inventory')
      .select('*')
      .eq('store_id', storeId)
      .ilike('name', `%${productName}%`)
      .limit(3);

    if (error) {
      console.error('Error checking product:', error);
      return null;
    }

    return product as Database['public']['Tables']['inventory']['Row'][];
  }

  private async getContextData() {
    let contextData = '';

    if (this.context.storeId) {
      const store = await this.getStoreData(this.context.storeId);
      if (store) {
        contextData += `Store Information:
- Name: ${store.name}
- Address: ${store.address}
- Opening Hours: ${store.opening_hours}
- Next Opening: ${store.next_opening_time}
`;
      }

      const inventory = await this.getInventorySummary(this.context.storeId);
      if (inventory) {
        contextData += `\nCurrent Inventory:
${inventory}
`;
      }
    }

    if (this.context.isAuthenticated) {
      contextData += `\nUser Information:
- Role: ${this.context.userRole || 'Customer'}
- Authenticated: Yes
`;
    }

    return contextData;
  }

  private getRandomResponse(responses: string[]): string {
    const index = Math.floor(Math.random() * responses.length);
    return responses[index];
  }

  private async generateFallbackResponse(userInput: string): Promise<string> {
    // Try to match against training patterns
    for (const patternObj of this.trainingPatterns) {
      if (patternObj.pattern.test(userInput)) {
        return this.getRandomResponse(patternObj.responses);
      }
    }

    // Check for product availability query
    if (/\b(do you have|is there|availability of|in stock)\b/i.test(userInput)) {
      const productMatch = userInput.match(/\b(do you have|is there|availability of|in stock)\s+(?:any|some)?\s*([a-zA-Z\s]+)/i);
      if (productMatch && this.context.storeId) {
        const productName = productMatch[2].trim();
        const products = await this.checkProductAvailability(this.context.storeId, productName);
        
        if (products && products.length > 0) {
          const productList = products.map(p => `${p.name} (${p.quantity} in stock)`).join(', ');
          return `Yes, we have the following related products: ${productList}`;
        } else {
          return `I'm sorry, but it doesn't look like we have "${productName}" in stock at the moment. Is there something else you're looking for?`;
        }
      }
    }

    // Check for store hours query
    if (/\b(hours|open|close|opening|closing)\b/i.test(userInput) && this.context.storeId) {
      const store = await this.getStoreData(this.context.storeId);
      if (store) {
        return `The store is open ${store.opening_hours}. The next opening time is ${store.next_opening_time}.`;
      }
    }

    // Default response
    return "I'm here to help with information about our store, inventory, and services. How can I assist you today?";
  }

  public async processMessage(userInput: string): Promise<string> {
    try {
      // Get context data for more informed responses
      const contextData = await this.getContextData();
      console.log('Context data:', contextData);

      // Use the fallback response generation
      return await this.generateFallbackResponse(userInput);
    } catch (error) {
      console.error('Error processing message:', error);
      if (error instanceof Error) {
        return `I apologize, but I encountered an error: ${error.message}. Please try again later.`;
      }
      return "I apologize, but I'm having trouble processing your request at the moment. Please try again later.";
    }
  }
} 