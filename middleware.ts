import { type NextRequest } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";
import { createClient } from "@/utils/supabase/server";

// Define public and admin routes
const PUBLIC_ROUTES = ["/sign-in", "/sign-up"];
const ADMIN_ROUTES = ["/attendance_dashboard", "/attendee_report", "/users"];
const USER_ROUTES = ["/attendance_records"];
export async function middleware(request: NextRequest) {
  const response = await updateSession(request);
  const supabase = await createClient();

  // Step 1: Get current user directly (verifies session validity)
  const { data, error } = await supabase.auth.getUser();
  
  const { pathname } = request.nextUrl;

  // Step 2: Handle unauthenticated users
  if (!data?.user || error) {
    if (!PUBLIC_ROUTES.includes(pathname)) {
      return Response.redirect(new URL("/sign-in", request.url));
    }
    return response;
  }

  // // Step 3: Enforce email verification
  // if (!data.user.email_verified && !pathname.startsWith("/verify-email")) {
  //   return Response.redirect(new URL("/verify-email", request.url)); // Custom verification page
  // }

  // Step 4: Skip role checks for public routes
  if (PUBLIC_ROUTES.includes(pathname)) {
    return response;
  }

  // Step 5: Fetch and validate user role
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", data.user.id)
    .single();

  if (profileError || !profile) {
    console.error("Profile fetch error:", profileError?.message);
    return Response.redirect(new URL("/sign-in", request.url));
  }

  // Step 6: Admin route protection
  if (ADMIN_ROUTES.some(route => pathname === route || pathname.startsWith(route + "/")) && profile.role !== "admin") {
    return Response.redirect(new URL("/unauthorized", request.url));
  }
    if (USER_ROUTES.some(route => pathname === route || pathname.startsWith(route + "/")) && profile.role !== "user") {
    return Response.redirect(new URL("/unauthorized", request.url));
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$|sign-in|sign-up|verify-email|unauthorized).*)"
  ],
};