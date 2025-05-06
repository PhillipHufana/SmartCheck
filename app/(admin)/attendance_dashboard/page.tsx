
import { Suspense } from "react"
import Link from "next/link"
import { Check, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { AttendanceTable } from "./components/attendance-table"
import { AttendanceTableSkeleton } from "./components/attendance-table-skeleton"

export default function Dashboard() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* <header className="sticky top-0 z-10 bg-emerald-500 text-white">
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
      </header> */}
      <main className="flex-1 bg-white">
        <div className="container px-4 py-6 md:px-6 md:py-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold tracking-tight">Attendance Dashboard</h1>
            <p className="text-muted-foreground">Create and Manage available Attendance reports</p>
          </div>
          <div className="mb-4 flex justify-end">
            <Button asChild className="bg-emerald-500 hover:bg-emerald-600">
              <Link href="/attendance_dashboard/create">
                <Plus className="mr-2 h-4 w-4" />
                Create Attendance
              </Link>
            </Button>
          </div>
          <Suspense fallback={<AttendanceTableSkeleton />}>
            <AttendanceTable />
          </Suspense>
        </div>
      </main>
    </div>
  )
}
