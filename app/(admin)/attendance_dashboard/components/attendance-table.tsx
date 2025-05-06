"use client"

import { useState } from "react"
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"

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

// This would typically come from your database
const initialAttendanceData = [
  {
    id: "1",
    date: "March 31, 2025",
    courseTime: "11:30 AM",
    lateTime: "11:45 AM",
    courseTitle: "CMSC 186",
    creator: "Vic Calag",
  },
  {
    id: "2",
    date: "April 1, 2025",
    courseTime: "11:30 AM",
    lateTime: "11:45 AM",
    courseTitle: "CMSC 186",
    creator: "Vic Calag",
  },
]

export function AttendanceTable() {
  const [attendanceData, setAttendanceData] = useState(initialAttendanceData)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const router = useRouter()
  const { toast } = useToast()

  const handleDelete = (id: string) => {
    setAttendanceData(attendanceData.filter((item) => item.id !== id))
    toast({
      title: "Attendance record deleted",
      description: "The attendance record has been successfully deleted.",
    })
    setDeleteId(null)
  }

  const handleEdit = (id: string) => {
    router.push(`/attendance_dashboard/edit/${id}`)
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader className="bg-emerald-100">
            <TableRow>
              <TableHead className="w-[150px]">Date</TableHead>
              <TableHead>Time of Course</TableHead>
              <TableHead>Time of Late</TableHead>
              <TableHead>Course Title</TableHead>
              <TableHead>Creator</TableHead>
              <TableHead className="w-[80px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {attendanceData.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.date}</TableCell>
                <TableCell>{item.courseTime}</TableCell>
                <TableCell>{item.lateTime}</TableCell>
                <TableCell>{item.courseTitle}</TableCell>
                <TableCell>{item.creator}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEdit(item.id)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setDeleteId(item.id)}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
            {attendanceData.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No attendance records found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the attendance record.
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
  )
}
