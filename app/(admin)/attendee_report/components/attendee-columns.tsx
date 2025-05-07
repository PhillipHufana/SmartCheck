"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { deleteAttendee, Attendeestatus } from "../actions";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DialogClose } from "@radix-ui/react-dialog";
import { FC, useState } from "react";

export type Attendee = {
  id: number;
  name: string;
  studentnum: string;
  date_arrived: Date;
  time_arrived: string;
  time_course: string;
  adviser: string;
  course_title: string;
  degreeProg: string;
  description: string;
  status: string;
};

// Functional Component for Actions
const AttendeeActions: FC<{ attendee: Attendee }> = ({ attendee }) => {
  const [status, setStatus] = useState(attendee.status);

  const handleDelete = async () => {
    try {
      await deleteAttendee(attendee.id);
      console.log("Deleted Attendee:", attendee.id);
      window.location.reload(); // Reload to reflect changes or use revalidatePath
    } catch (error) {
      console.error("Error deleting attendee:", error);
    }
  };

  const handleStatus = async (newStatus: string) => {
    try {
      const result = await Attendeestatus(attendee.id.toString(), newStatus, null);
      const { error } = JSON.parse(result);
      if (error) {
        console.error("Error resolving incident:", error);
      } else {
        console.log("Updated attendee status:", attendee.id);
        setStatus(newStatus); // Update local state to reflect status change
        window.location.reload(); // Reload to reflect changes or use revalidatePath
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <Dialog>
          <DialogTrigger asChild>
            <Button className="flex flex-col px-8 w-60 up-primary-red mb-2">
              Mark as On time
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Confirm Attendee to be On time</DialogTitle>
              <DialogDescription>
                Are you sure you want to mark this student as on time? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <Button className="up-primary-red" onClick={() => handleStatus("on-time")}>Mark as On time</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="px-8 w-60 up-primary-red mb-2">
              Mark as Late
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Confirm Attendee to be Late</DialogTitle>
              <DialogDescription>
                Are you sure you want to mark this student as Late? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <Button className="up-primary-red" onClick={() => handleStatus("late")}>Mark as Late</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="flex flex-col px-8 w-60 up-primary-red mb-2">
              Mark as Absent
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Confirm Attendee to be Absent</DialogTitle>
              <DialogDescription>
                Are you sure you want to mark this student as Absent? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <Button className="up-primary-red" onClick={() => handleStatus("absent")}>Mark as Absent</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="px-8 w-60 mt-2 up-primary-red">
              Delete
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Confirm Attendee to be Deleted</DialogTitle>
              <DialogDescription>
                Deleting this attendee report will permanently remove all associated data. Are you sure?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <Button className="up-primary-red" onClick={handleDelete}>Delete</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

// Column Definitions
export const attendee_columns: ColumnDef<Attendee>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "studentnum",
    header: "Student No.",
  },
  {
    accessorKey: "date_arrived",
    header: "Date",
  },
  {
    accessorKey: "time_arrived",
    header: "Time of Arrival",
  },
  {
    accessorKey: "time_course",
    header: "Time of Course Subject",
  },
  {
    accessorKey: "adviser",
    header: "Adviser",
  },
  {
    accessorKey: "course_title",
    header: "Course Title",
  },
  {
    accessorKey: "degreeprog",
    header: "Program",
  },
  {
    accessorKey: "description",
    header: "Notes",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      let statusClass = "";
      let statusLabel = "";

      switch (status) {
        case "on-time":
          statusClass = "bg-green-100 text-green-800";
          statusLabel = "On time";
          break;
        case "late":
          statusClass = "bg-yellow-100 text-yellow-800";
          statusLabel = "Late";
          break;
        case "absent":
          statusClass = "bg-red-100 text-red-800";
          statusLabel = "Absent";
          break;
        default:
          statusClass = "bg-blue-100 text-blue-800";
          statusLabel = "on-time";
          break;
      }

      return (
        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusClass}`}>
          {statusLabel}
        </span>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <AttendeeActions attendee={row.original} />,
  },
];
