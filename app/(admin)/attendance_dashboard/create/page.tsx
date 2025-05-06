"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Check, ChevronLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

export default function CreateAttendance() {
  const router = useRouter()
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    date: "",
    courseTime: "",
    lateTime: "",
    courseTitle: "",
    creator: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Here you would typically send the data to your API/database
    console.log("Form submitted:", formData)

    toast({
      title: "Attendance record created",
      description: "The attendance record has been successfully created.",
    })

    router.push("/attendance_dashboard")
  }

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
              <CardTitle>Create Attendance Record</CardTitle>
              <CardDescription>Add a new attendance record to the system.</CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="date">Date</Label>
                    <Input id="date" name="date" type="date" value={formData.date} onChange={handleChange} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="courseTitle">Course Title</Label>
                    <Input
                      id="courseTitle"
                      name="courseTitle"
                      placeholder="e.g. CMSC 186"
                      value={formData.courseTitle}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="courseTime">Time of Course</Label>
                    <Input
                      id="courseTime"
                      name="courseTime"
                      type="time"
                      value={formData.courseTime}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lateTime">Time of Late</Label>
                    <Input
                      id="lateTime"
                      name="lateTime"
                      type="time"
                      value={formData.lateTime}
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
                  Create Record
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      </main>
    </div>
  )
}
