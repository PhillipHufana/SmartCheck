import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import StudentDialog from "./student-dialog"


export default function Home() {
  const attendanceRecords = [
    {
      id: "CMSC 186",
      date: "March 31, 2025",
      createdBy: "Vic Calag",
    },
    {
      id: "CMSC 186",
      date: "March 31, 2025",
      createdBy: "Vic Calag",
    },
    {
      id: "CMSC 186",
      date: "March 31, 2025",
      createdBy: "Vic Calag",
    },
  ]

  return (
    <div className="min-h-screen flex flex-col">

      <main className="flex-1 container mx-auto px-4 py-6">
        <section className="mb-8">
          <h1 className="text-2xl font-bold mb-1">Attendance Records</h1>
          <p className="text-gray-700 mb-6">View and Complete available Attendance reports</p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {attendanceRecords.map((record, index) => (
              <Card key={index} className="border border-gray-200">
                <CardContent className="pt-6">
                  <h2 className="text-xl font-bold mb-4">{record.id}</h2>
                  <div className="space-y-2">
                    <p className="text-sm">Date: {record.date}</p>
                    <p className="text-sm">Created by: {record.createdBy}</p>
                  </div>
                </CardContent>
                <CardFooter>
                  <StudentDialog>
                    <Button className="w-full bg-green-500 hover:bg-green-600">Fill Out</Button>
                  </StudentDialog>
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
