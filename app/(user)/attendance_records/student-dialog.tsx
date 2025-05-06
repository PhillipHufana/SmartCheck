"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "./components/ui/textarea"
import { Switch } from "./components/ui/switch"
import { useToast } from "@/hooks/use-toast"

interface StudentData {
  id: number
  name: string
  studentnum: string
  date_arrived: string
  time_arrived: string
  time_course: string
  adviser: string
  course_title: string
  degreeProg: string
  description: string
  status: boolean
}

const defaultStudentData: StudentData = {
  id: 0,
  name: "",
  studentnum: "",
  date_arrived: new Date().toISOString().split("T")[0],
  time_arrived: new Date().toTimeString().split(" ")[0].slice(0, 5),
  time_course: "",
  adviser: "",
  course_title: "CMSC 186",
  degreeProg: "",
  description: "",
  status: true,
}

export default function StudentDialog({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const [studentData, setStudentData] = useState<StudentData>(defaultStudentData)
  const { toast } = useToast()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setStudentData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSwitchChange = (checked: boolean) => {
    setStudentData((prev) => ({ ...prev, status: checked }))
  }

  const handleSubmit = () => {
    // Here you would typically submit the data to your backend
    console.log("Submitting student data:", studentData)

    toast({
      title: "Attendance recorded",
      description: `Successfully recorded attendance for ${studentData.name}`,
    })

    setOpen(false)
    // Reset form after submission
    setStudentData(defaultStudentData)
  }

  return (
    <>
      <div onClick={() => setOpen(true)}>{children}</div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Student Attendance Details</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Student Name</Label>
                <Input id="name" name="name" value={studentData.name} onChange={handleChange} placeholder="John Doe" />
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

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date_arrived">Date Arrived</Label>
                <Input
                  id="date_arrived"
                  name="date_arrived"
                  type="date"
                  value={studentData.date_arrived}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="time_arrived">Time Arrived</Label>
                <Input
                  id="time_arrived"
                  name="time_arrived"
                  type="time"
                  value={studentData.time_arrived}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="time_course">Course Time</Label>
                <Input
                  id="time_course"
                  name="time_course"
                  value={studentData.time_course}
                  onChange={handleChange}
                  placeholder="9:00 AM - 10:30 AM"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="adviser">Adviser</Label>
                <Input
                  id="adviser"
                  name="adviser"
                  value={studentData.adviser}
                  onChange={handleChange}
                  placeholder="Dr. Jane Smith"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="course_title">Course Title</Label>
                <Input
                  id="course_title"
                  name="course_title"
                  value={studentData.course_title}
                  onChange={handleChange}
                  placeholder="CMSC 186"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="degreeProg">Degree Program</Label>
                <Input
                  id="degreeProg"
                  name="degreeProg"
                  value={studentData.degreeProg}
                  onChange={handleChange}
                  placeholder="BS Computer Science"
                />
              </div>
            </div>

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

            <div className="flex items-center space-x-2">
              <Switch id="status" checked={studentData.status} onCheckedChange={handleSwitchChange} />
              <Label htmlFor="status">Present</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} className="bg-green-500 hover:bg-green-600">
              Submit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
