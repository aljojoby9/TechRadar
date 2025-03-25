import { NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"
import { createClient } from "@/utils/supabase/server"

// Initialize the Google Generative AI with your API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "")

// Create a system prompt that defines the chatbot's behavior
const systemPrompt = `
You are a helpful assistant for a Store Inventory Finder application. Your name is StoreBot.

Your primary functions are:
1. Help users find products in stores
2. Answer questions about store locations, hours, and inventory
3. Provide information about product availability
4. Assist with navigating the store finder application

Important rules:
- Only answer questions related to store inventory, locations, and the application
- For questions outside this scope, politely redirect to store-related topics
- Be concise and helpful
- Don't make up information about specific stores or inventory that you don't have
- If asked about specific inventory, suggest using the search function on the website
- When providing store information, use the exact details provided to you

Current application context:
- Users can browse stores on a map
- Each store has its own inventory
- Users can check product availability at different stores
- Store owners can update their inventory

Respond in a friendly, helpful manner.
`

export async function POST(request: Request) {
  try {
    const { messages, storeId } = await request.json()
    
    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Invalid request format" },
        { status: 400 }
      )
    }

    try {
      // Get the last user message
      const lastUserMessage = messages[messages.length - 1].content
      
      // Initialize context with store data if available
      let storeContext = ""
      
      // If storeId is provided, fetch store details from Supabase
      if (storeId) {
        const supabase = await createClient()
        
        // Fetch store data
        const { data: store, error: storeError } = await supabase
          .from('stores')
          .select('*')
          .eq('id', storeId)
          .single()
          
        if (!storeError && store) {
          storeContext = `
Current store information:
- Store Name: ${store.name}
- Store ID: ${store.id}
- Location: ${store.address || "Address not specified"}
- Contact: ${store.phone || "Phone not specified"}
- Hours: ${store.hours || "Hours not specified"}
`
          
          // Fetch inventory for this store
          const { data: inventory, error: inventoryError } = await supabase
            .from('inventory')
            .select('*')
            .eq('store_id', storeId)
            
          if (!inventoryError && inventory && inventory.length > 0) {
            storeContext += `\nCurrent inventory items:\n`
            inventory.forEach(item => {
              storeContext += `- ${item.name}: ${item.quantity} in stock, Price: $${item.price}\n`
            })
          } else {
            storeContext += `\nNo inventory items are currently available for this store.`
          }
        }
      }
      
      // Get the Gemini model
      const model = genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash"
      })
      
      // Combine system prompt, store context, and user message
      const prompt = `${systemPrompt}\n\n${storeContext}\n\nUser: ${lastUserMessage}`
      
      // Generate content with the enhanced prompt
      const result = await model.generateContent(prompt)
      const response = result.response.text()
      
      return NextResponse.json({ response })
    } catch (genError) {
      console.error("Gemini API error:", genError)
      
      // Fallback response if API fails
      return NextResponse.json({ 
        response: "I'm sorry, I'm having trouble accessing store information right now. Please try again later or contact store support for assistance."
      })
    }
  } catch (error) {
    console.error("Error in chatbot API:", error)
    return NextResponse.json(
      { error: "Failed to process request", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}