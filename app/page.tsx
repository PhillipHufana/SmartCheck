import Hero from "@/components/hero";
import ConnectSupabaseSteps from "@/components/tutorial/connect-supabase-steps";
import SignUpUserSteps from "@/components/tutorial/sign-up-user-steps";
import { hasEnvVars } from "@/utils/supabase/check-env-vars";
import { GraduationCap, School } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

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
    // Returning a fragment <> allows the two direct children to be placed
    // directly inside the layout's main tag, where they will stack vertically.
    <>
      {/* Div for Welcome text - This will be the first element in main */}
      {/* Use flex/items-center to center text horizontally within this div */}
      {/* Added some padding/margin for spacing */}
      <div className="flex-1 flex-col items-center text-center pt-12 mb-8 w-full">
        {" "}
        {/* Added w-full here as well */}
        <h1 className="text-4xl font-bold">Welcome to SmartCheck!</h1>
        <h3 className="text-2xl font-semibold text-gray-600">
          The fastest way to track and monitor class attendance.
        </h3>
      </div>

      {/* Div for Select Role Card - This will be the second element in main, appearing below */}
      {/* Use flex justify-center to center the Card horizontally within this div */}
      {/* Added padding for spacing below */}
      <div className="flex-1 justify-center pb-12 w-full">
        {" "}
        {/* Added w-full */}
        <Card className="flex-1 w-full max-w-md pl-12">
          <CardHeader className="text-center">
            <CardTitle>Select your role</CardTitle>
            <CardDescription>
              Choose whether you're a student or teacher
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <Link href="/student">
              <Button className="hover:bg-green-100 gap-2 hover:text-green-700 hover:border-green-300 w-full">
                <GraduationCap className="h-6 w-6 " />I am a Student
              </Button>
            </Link>

            <Link href="/admin">
              <Button className="hover:bg-green-100 gap-2 hover:text-green-700 hover:border-green-300 w-full">
                <School className="h-6 w-6" />I am a Teacher
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
