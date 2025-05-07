// app/(admin)/attendance_dashboard/edit/[attendance_id]/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Check, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabaseClient";

export default function EditAttendance() {
  const router = useRouter();
  const { toast } = useToast();
  const { attendance_id } = useParams(); 

  const [formData, setFormData] = useState({
    attendance_date: "",
    course_time: "",
    course_title: "",
    creator: "",
  });

  const [isLoading, setIsLoading] = useState(true);

  // Fetch record on mount
  useEffect(() => {
    const fetchRecord = async () => {
      try {
        const { data, error } = await supabase
          .from("attendance_record") // Ensure this matches your Supabase table name
          .select("*")
          .eq("attendance_id", attendance_id)
          .single();

        if (error) throw error;

        if (!data) {
          toast({
            title: "Record not found",
            description: "The attendance record you're trying to edit doesn't exist.",
            variant: "destructive",
          });
          router.push("/attendance_dashboard");
          return;
        }

        setFormData({
          attendance_date: data.attendance_date,
          course_time: data.course_time,
          course_title: data.course_title,
          creator: data.creator,
        });
      } catch (err: any) {
        console.error("Error fetching record:", err.message);
        toast({
          title: "Error",
          description: "Failed to load attendance record.",
          variant: "destructive",
        });
        router.push("/attendance_dashboard");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecord();
  }, [attendance_id, router, toast]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const { error } = await supabase
        .from("attendance_record")
        .update(formData)
        .eq("attendance_id", attendance_id); 

      if (error) throw error;

      toast({
        title: "Attendance record updated",
        description: "The attendance record has been successfully updated.",
      });

      router.push("/attendance_dashboard");
    } catch (err: any) {
      console.error("Error updating record:", err.message);
      toast({
        title: "Error",
        description: "Failed to update attendance record.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <div className="flex min-h-screen items-center justify-center">Loading...</div>;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 bg-emerald-500 text-white">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2 text-2xl font-bold">
            <span>SmartCheck</span>
            <Check className="h-6 w-6" />
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm">admin@gmail.com</span>
            <Button variant="outline" size="sm" className="text-white hover:bg-emerald-600 hover:text-white">
              Log Out
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-1 bg-white">
        <div className="container px-4 py-6 md:px-6 md:py-8">
          <div className="mb-6">
            <Button variant="outline" size="sm" asChild>
              <Link href="/attendance_dashboard">
                <ChevronLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Link>
            </Button>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Edit Attendance Record</CardTitle>
              <CardDescription>Update the attendance record information.</CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="attendance_date">Attendance Date</Label>
                    <Input
                      id="attendance_date"
                      name="attendance_date"
                      type="date"
                      value={formData.attendance_date}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="course_title">Course Title</Label>
                    <Input
                      id="course_title"
                      name="course_title"
                      placeholder="e.g. CMSC 186"
                      value={formData.course_title}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="course_time">Time of Course</Label>
                    <Input
                      id="course_time"
                      name="course_time"
                      type="time"
                      value={formData.course_time}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="creator">Creator</Label>
                    <Input
                      id="creator"
                      name="creator"
                      placeholder="Your name"
                      value={formData.creator}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                <Button variant="outline" type="button" onClick={() => router.push("/attendance_dashboard")}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-emerald-500 hover:bg-emerald-600">
                  Update Record
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      </main>
    </div>
  );
}