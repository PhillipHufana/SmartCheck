"use client"
 
import { ColumnDef } from "@tanstack/react-table"

export type Attendee = {
    id: number;
    name: string;
    studentnum: string;
    date_arrived: string;
    time_arrived: string;
    time_course: string;
    adviser: string;
    course_title: string;
    degreeProg: string;
    description: string;
    status: boolean;
  }

  //Column Definitions
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
      header: "Date of Arrival",
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
        const statusClass = status ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800";
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusClass}`}>
            {status ? "Resolved" : "Unresolved"}
          </span>
        );
      },
    }
  ]