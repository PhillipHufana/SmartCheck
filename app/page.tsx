import Hero from "@/components/hero";
import ConnectSupabaseSteps from "@/components/tutorial/connect-supabase-steps";
import SignUpUserSteps from "@/components/tutorial/sign-up-user-steps";
import { hasEnvVars } from "@/utils/supabase/check-env-vars";
import { GraduationCap, School } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from 'next/link';

import FetchDataSteps from "@/components/tutorial/fetch-data-steps";
import { createClient } from "@/utils/supabase/server";
import { InfoIcon } from "lucide-react";
import { redirect } from "next/navigation";


export default async function Home() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }
  return (
    <>
        <div className="flex h-64 flex-col items-center justify-center">
        <h1 className="text-4xl font-bold">Welcome to SmartCheck!</h1>
        <h3 className="text-2xl font-semibold text-gray-600">The fastest way to track and monitor class attendance.</h3>
        </div>

        <div className="flex h-40 flex-col  items-center justify-center">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <CardTitle>Select your role</CardTitle>
              <CardDescription>Choose whether you're a student or teacher</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <Link href="/student"><Button className="hover:bg-green-100 gap-2 hover:text-green-700 hover:border-green-300 w-full">
                <GraduationCap className="h-6 w-6 " />I am a Student
              </Button> </Link>

              <Link href="/admin"><Button className="hover:bg-green-100 gap-2 hover:text-green-700 hover:border-green-300 w-full"> 
                <School className="h-6 w-6" />I am a Teacher
              </Button> </Link>
            </CardContent>
        </Card>
        </div>
    </>
  );
}
