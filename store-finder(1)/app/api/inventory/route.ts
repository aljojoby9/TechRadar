import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

// GET /api/inventory - Get all inventory items for a store
export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    
    // Get the current user's session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get store_id from user metadata
    const storeId = session.user.user_metadata?.store_id;
    
    if (!storeId) {
      return NextResponse.json({ error: "Store not found" }, { status: 404 });
    }

    // Fetch inventory items for the store
    const { data, error } = await supabase
      .from("inventory")
      .select("*")
      .eq("store_id", storeId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching inventory:", error);
      return NextResponse.json({ error: "Failed to fetch inventory" }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in GET /api/inventory:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST /api/inventory - Add a new inventory item
export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    
    // Get the current user's session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get store_id from user metadata
    const storeId = session.user.user_metadata?.store_id;
    
    if (!storeId) {
      return NextResponse.json({ error: "Store not found" }, { status: 404 });
    }

    // Get the request body
    const body = await request.json();
    
    // Validate required fields
    if (!body.name || !body.quantity || !body.price) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Insert the new inventory item
    const { data, error } = await supabase
      .from("inventory")
      .insert([
        {
          store_id: storeId,
          name: body.name,
          description: body.description || "",
          quantity: body.quantity,
          price: body.price,
          category: body.category || "general",
          sku: body.sku || "",
          last_updated: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Error adding inventory item:", error);
      return NextResponse.json({ error: "Failed to add inventory item" }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in POST /api/inventory:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PUT /api/inventory - Update an inventory item
export async function PUT(request: Request) {
  try {
    const supabase = await createClient();
    
    // Get the current user's session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get store_id from user metadata
    const storeId = session.user.user_metadata?.store_id;
    
    if (!storeId) {
      return NextResponse.json({ error: "Store not found" }, { status: 404 });
    }

    // Get the request body
    const body = await request.json();
    
    // Validate required fields
    if (!body.id) {
      return NextResponse.json(
        { error: "Missing item ID" },
        { status: 400 }
      );
    }

    // Update the inventory item
    const { data, error } = await supabase
      .from("inventory")
      .update({
        name: body.name,
        description: body.description,
        quantity: body.quantity,
        price: body.price,
        category: body.category,
        sku: body.sku,
        last_updated: new Date().toISOString(),
      })
      .eq("id", body.id)
      .eq("store_id", storeId)
      .select()
      .single();

    if (error) {
      console.error("Error updating inventory item:", error);
      return NextResponse.json({ error: "Failed to update inventory item" }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in PUT /api/inventory:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE /api/inventory - Delete an inventory item
export async function DELETE(request: Request) {
  try {
    const supabase = await createClient();
    
    // Get the current user's session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get store_id from user metadata
    const storeId = session.user.user_metadata?.store_id;
    
    if (!storeId) {
      return NextResponse.json({ error: "Store not found" }, { status: 404 });
    }

    // Get the item ID from the URL
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Missing item ID" },
        { status: 400 }
      );
    }

    // Delete the inventory item
    const { error } = await supabase
      .from("inventory")
      .delete()
      .eq("id", id)
      .eq("store_id", storeId);

    if (error) {
      console.error("Error deleting inventory item:", error);
      return NextResponse.json({ error: "Failed to delete inventory item" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in DELETE /api/inventory:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
} 