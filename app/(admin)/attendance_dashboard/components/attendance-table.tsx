"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

// UI Components (keep unchanged)
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast"

export function AttendanceTable() {
  const [attendanceData, setAttendanceData] = useState<any[]>([]);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  // Fetch data on mount
  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase.from("attendance_record").select("*");
      if (error) {
        console.error("Error fetching data:", error);
        toast({ title: "Error", description: "Failed to load attendance records", variant: "destructive" });
      } else {
        setAttendanceData(data || []);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  // Delete handler
  const handleDelete = async (attendance_id: string) => {
    const { error } = await supabase.from("attendance_record").delete().eq("attendance_id", attendance_id);
    if (error) {
      toast({ title: "Error", description: "Failed to delete record", variant: "destructive" });
    } else {
      setAttendanceData(attendanceData.filter((item) => item.attendance_id !== attendance_id));
      toast({ title: "Deleted", description: "Attendance record removed" });
    }
    setDeleteId(null);
  };

  // Edit handler
  const handleEdit = (attendance_id: string) => {
    router.push(`/attendance_dashboard/edit/${attendance_id}`);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <>
      <div className="rounded-md border">
        <Table>
          {/* Table Headers */}
          <TableHeader className="bg-emerald-100">
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Time of Course</TableHead>
              <TableHead>Time of Late</TableHead>
              <TableHead>Course Title</TableHead>
              <TableHead>Creator</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>

          {/* Table Body */}
          <TableBody>
            {attendanceData.map((item) => (
              <TableRow key={item.attendance_id}>
                <TableCell>{item.attendance_date}</TableCell>
                <TableCell>{item.course_time}</TableCell>
                <TableCell>{item.lateTime}</TableCell>
                <TableCell>{item.course_title}</TableCell>
                <TableCell>{item.creator}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEdit(item.attendance_id)}>
                        <Pencil className="mr-2 h-4 w-4" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setDeleteId(item.attendance_id)}>
                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
            {!attendanceData.length && (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  No records found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => deleteId && handleDelete(deleteId)}
              className="bg-red-500 hover:bg-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}