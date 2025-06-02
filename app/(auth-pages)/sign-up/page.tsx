import { signUpAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { SmtpMessage } from "../smtp-message";

export default async function Signup(props: {
  searchParams: Promise<Message>;
}) {
  const searchParams = await props.searchParams;
  if ("message" in searchParams) {
    return (
      <div className="w-full flex-1 flex items-center h-screen sm:max-w-md justify-center gap-2 p-4">
        <FormMessage message={searchParams} />
      </div>
    );
  }

  return (
    <>
      <form className="flex flex-col min-w-64 max-w-64 mx-auto">
        <h1 className="text-2xl font-medium">Sign up</h1>
        <p className="text-sm text text-foreground">
          Already have an account?{" "}
          <Link className="text-primary font-medium underline" href="/sign-in">
            Sign in
          </Link>
        </p>
        <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
          {/* Email */}
          <Label htmlFor="email">Email</Label>
          <Input name="email" placeholder="you@example.com" required />

          {/* Password */}
          <Label htmlFor="password">Password</Label>
          <Input
            type="password"
            name="password"
            placeholder="Your password"
            minLength={6}
            required
          />

          {/* First Name */}
          <Label htmlFor="firstName">First Name</Label>
          <Input name="firstName" placeholder="John" required />

          {/* Last Name */}
          <Label htmlFor="lastName">Last Name</Label>
          <Input name="lastName" placeholder="Doe" required />

          {/* Student Number */}
          <Label htmlFor="studentnum">Student Number</Label>
          <Input
            id="studentnum"
            name="studentnum"
            placeholder="2023-12345"
            required
          />

          {/* Degree Program */}
          <Label htmlFor="degreeprog">Degree Program</Label>
          <Input
            id="degreeprog"
            name="degreeprog"
            placeholder="BS Computer Science"
            required
          />

          {/* Year Level */}
          <Label htmlFor="yearlevel">Year Level</Label>
          <Input
            type="number"
            name="yearlevel"
            placeholder="e.g., 1, 2, 3"
            min={1}
            max={5}
            required
          />

          {/* Submit Button */}
          <SubmitButton formAction={signUpAction} pendingText="Signing up...">
            Sign up
          </SubmitButton>

          {/* Form Messages */}
          <FormMessage message={searchParams} />
        </div>
      </form>

      {/* SMTP Message for Debugging */}
      <SmtpMessage />
    </>
  );
}