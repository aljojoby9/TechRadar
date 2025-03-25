import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import InventoryManagement from "@/components/inventory/inventory-management";
import OpenStreetMap from "@/components/map/open-street-map";

export default async function InventoryPage() {
  const supabase = await createClient();
  
  // Get the current user's session
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();
  
  if (sessionError || !session) {
    redirect("/auth/sign-in");
  }

  // Get store_id from user metadata
  const storeId = session.user.user_metadata?.store_id;
  
  if (!storeId) {
    redirect("/dashboard/store_owner");
  }

  // Fetch store details to get the address for the map
  const { data: store, error: storeError } = await supabase
    .from("stores")
    .select("address")
    .eq("id", storeId)
    .single();

  if (storeError) {
    console.error("Error fetching store:", storeError);
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Inventory Management</h1>
          <p className="mt-2 text-sm text-gray-600">
            Manage your store's inventory and track stock levels
          </p>
        </div>

        {/* Store Location Map */}
        {store?.address && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Store Location</h2>
            <div className="h-[400px] w-full bg-white rounded-lg shadow-sm overflow-hidden">
              <OpenStreetMap address={store.address} />
            </div>
          </div>
        )}

        {/* Inventory Management Component */}
        <InventoryManagement />
      </div>
    </div>
  );
} 