// student-dialog.tsx
"use client";

import type React from "react";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "./components/ui/textarea"; // Or from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabaseClient";

interface StudentData {
  id: number;
  name: string;
  studentnum: string;
  date_arrived: string;
  time_arrived: string;
  time_course: string; // This will now be populated from fetched data
  adviser: string;
  course_title: string;
  degreeprog: string;
  description: string;
  status: "on-time" | "late" | "absent";
  attendance_id: number;
}

const defaultStudentData: StudentData = {
  id: 0,
  name: "",
  studentnum: "",
  date_arrived: new Date().toISOString().split("T")[0],
  time_arrived: new Date().toTimeString().split(" ")[0].slice(0, 5),
  time_course: "", // Will be fetched, initially empty
  adviser: "",
  course_title: "",
  degreeprog: "",
  description: "",
  status: "on-time",
  attendance_id: 0,
};

export default function StudentDialog({
  children,
  attendance_id: prop_attendance_id,
}: {
  children: React.ReactNode;
  attendance_id: number;
}) {
  const [open, setOpen] = useState(false);
  const [studentData, setStudentData] = useState<StudentData>(() => ({
    ...defaultStudentData,
    attendance_id: prop_attendance_id,
  }));
  const [isFetchingDetails, setIsFetchingDetails] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false)
  const { toast } = useToast();

  const getSubmittedKey = (id: number) => `attendance_submitted_${id}`;
  useEffect(() => {
    if (open) {
      const key = getSubmittedKey(prop_attendance_id); 
      const submitted = localStorage.getItem(key) === "true"; 
      setHasSubmitted(submitted); 
      
      setStudentData({
        ...defaultStudentData,
        name: "",
        studentnum: "",
        degreeprog: "",
        description: "",
        status: "on-time",
        attendance_id: prop_attendance_id,
        adviser: "Loading...",
        course_title: "Loading...",
        time_course: "Loading...", // Add loading state for course time
      });

      if (prop_attendance_id) {
        const fetchRecordDetails = async () => {
          setIsFetchingDetails(true);
          try {
            // IMPORTANT: Replace 'course_time' with the actual column name in your 'attendance_record' table
            const { data: recordData, error: recordError } = await supabase
              .from("attendance_record")
              .select("creator, course_title, course_time") // Fetch course_time as well
              .eq("attendance_id", prop_attendance_id)
              .single();

            if (recordError) {
              console.error(
                "Error fetching attendance record details:",
                recordError
              );
              toast({
                title: "Error",
                description: "Could not fetch record details.",
                variant: "destructive",
              });
              setStudentData((prev) => ({
                ...prev,
                adviser: "Error fetching",
                course_title:
                  defaultStudentData.course_title || "Error fetching",
                time_course: defaultStudentData.time_course || "Error fetching", // Fallback for time_course
              }));
            } else if (recordData) {
              setStudentData((prev) => ({
                ...prev,
                adviser: recordData.creator || "N/A",
                course_title:
                  recordData.course_title || defaultStudentData.course_title,
                // Populate time_course from fetched data, fallback to empty or default
                time_course:
                  recordData.course_time || defaultStudentData.time_course,
              }));
            } else {
              setStudentData((prev) => ({
                ...prev,
                adviser: "N/A (Not found)",
                course_title:
                  defaultStudentData.course_title || "N/A (Not found)",
                time_course:
                  defaultStudentData.time_course || "N/A (Not found)",
              }));
            }
          } catch (err) {
            console.error("Unexpected error fetching record details:", err);
            toast({
              title: "Error",
              description:
                "An unexpected error occurred while fetching details.",
              variant: "destructive",
            });
            setStudentData((prev) => ({
              ...prev,
              adviser: "Error",
              course_title: "Error",
              time_course: "Error", // Error state for time_course
            }));
          } finally {
            setIsFetchingDetails(false);
          }
        };
        fetchRecordDetails();
      } else {
        setStudentData((prev) => ({
          ...prev,
          adviser: "N/A (No ID)",
          course_title: defaultStudentData.course_title || "N/A (No ID)",
          time_course: defaultStudentData.time_course || "N/A (No ID)",
        }));
      }
    } else {
      setStudentData({
        ...defaultStudentData,
        attendance_id: prop_attendance_id,
        adviser: "",
        course_title: "",
        time_course: "", // Clear time_course when dialog is closed
      });
    }
  }, [open, prop_attendance_id, toast]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setStudentData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!studentData.name || !studentData.studentnum) {
      toast({
        title: "Validation Error",
        description: "Name and Student Number are required",
        variant: "destructive",
      });
      return;
    }
    const { id, ...submitData } = studentData;

    try {
      const { data, error } = await supabase
        .from("attendee")
        .insert([submitData])
        .select();

      if (error) {
        console.error("Supabase Error:", {
          message: error.message,
          code: error.code,
          details: error.details,
        });
        toast({
          title: "Submission Failed",
          description: `Error: ${error.message} (Code: ${error.code})`,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: "Attendance submitted successfully.",
      });
      localStorage.setItem(getSubmittedKey(prop_attendance_id), "true"); 
      setHasSubmitted(true); 
      setOpen(false);
    } catch (err) {
      console.error("Unexpected Error:", err);
      toast({
        title: "Submission Failed",
        description: "An unexpected error occurred. Check console for details.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <div onClick={() => setOpen(true)}>{children}</div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Student Attendance Details</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {/* Student Name and Number */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Student Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={studentData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="studentnum">Student Number</Label>
                <Input
                  id="studentnum"
                  name="studentnum"
                  value={studentData.studentnum}
                  onChange={handleChange}
                  placeholder="2023-12345"
                />
              </div>
            </div>

            {/* Date and Time Arrived (read-only) */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date_arrived">Date Arrived</Label>
                <Input
                  id="date_arrived"
                  name="date_arrived"
                  type="date"
                  value={studentData.date_arrived}
                  readOnly
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="time_arrived">Time Arrived</Label>
                <Input
                  id="time_arrived"
                  name="time_arrived"
                  type="time"
                  value={studentData.time_arrived}
                  readOnly
                />
              </div>
            </div>

            {/* Course Time (now fetched) and Adviser (read-only) */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="time_course">Course Time</Label>
                <Input
                  id="time_course"
                  name="time_course"
                  type="time"
                  value={
                    studentData.time_course === "Loading..." ||
                    studentData.time_course.includes("Error") ||
                    studentData.time_course.includes("N/A")
                      ? ""
                      : studentData.time_course
                  }
                  onChange={handleChange}
                  placeholder={
                    isFetchingDetails ||
                    studentData.time_course.includes("Error") ||
                    studentData.time_course.includes("N/A")
                      ? studentData.time_course
                      : "HH:MM"
                  }
                  // Add readOnly prop if this should also be uneditable after fetch
                  // readOnly={!isFetchingDetails && studentData.time_course !== "" && !studentData.time_course.includes("Error")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="adviser">Adviser</Label>
                <Input
                  id="adviser"
                  name="adviser"
                  value={studentData.adviser}
                  readOnly
                  placeholder={
                    isFetchingDetails ? "Loading..." : "Adviser Name"
                  }
                />
              </div>
            </div>

            {/* Course Title (fetched) and Degree Program */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="course_title">Course Title</Label>
                <Input
                  id="course_title"
                  name="course_title"
                  value={studentData.course_title}
                  onChange={handleChange}
                  placeholder={isFetchingDetails ? "Loading..." : "Course Name"}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="degreeprog">Degree Program</Label>
                <Input
                  id="degreeprog"
                  name="degreeprog"
                  value={studentData.degreeprog}
                  onChange={handleChange}
                  placeholder="BS Computer Science"
                />
              </div>
            </div>

            {/* Description / Notes */}
            <div className="space-y-2">
              <Label htmlFor="description">Description / Notes</Label>
              <Textarea
                id="description"
                name="description"
                value={studentData.description}
                onChange={handleChange}
                placeholder="Additional notes about the attendance"
                rows={3}
              />
            </div>

            {/* Status */}
            <div className="flex items-center space-x-2">
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                name="status"
                value={studentData.status}
                onChange={handleChange}
                className="border rounded px-3 py-2 bg-white"
              >
                <option value="on-time">On-Time</option>
                <option value="late">Late</option>
                <option value="absent">Absent</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              className="bg-green-500 hover:bg-green-600 text-white"
              disabled={hasSubmitted}
            >
              {hasSubmitted ? "Already Submitted" : "Submit"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
