"use client";

import Link from "next/link";
import { Check, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation"; // For programmatic navigation
import { createClient } from "@/utils/supabase/client"; // Adjust this path to your Supabase client initialization file

export function Navbar() {
  const router = useRouter();
  // Initialize the Supabase client.
  // Ensure createClient is your function for creating a client-side Supabase instance.
  const supabase = createClient();

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Error signing out:", error.message);
      // You might want to show a notification to the user here
    } else {
      // Redirect to the sign-in page after successful sign-out
      router.push("/sign-in");
      // Optionally, you can refresh the page if you want to ensure all server component states are cleared,
      // though redirecting to a sign-in page that checks auth state usually suffices.
      // router.refresh();
    }
  };

  return (
    <header className="w-full bg-green-400 px-5 py-4 flex items-center justify-between">
      <div className="flex items-center gap-1">
        <Link href="/" className="text-2xl font-bold flex items-center">
          SmartCheck
          <Check className="h-6 w-6 ml-1" />
        </Link>
      </div>
      <div>
        <Button
          onClick={handleSignOut}
          variant="ghost" // A subtle variant, good for navbars
          className="hover:bg-green-500 hover:text-white focus-visible:ring-white focus-visible:ring-offset-green-400" // Custom hover and focus states for visibility
        >
          <LogOut className="h-5 w-5 mr-2" />
          Sign Out
        </Button>
      </div>
    </header>
  );
}
