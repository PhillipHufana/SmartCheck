// app/page.tsx or components/Home.tsx
"use client"
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import StudentDialog from './student-dialog';

export default function Home() {
  
  const [attendanceRecords, setAttendanceRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecords = async () => {
      const { data, error } = await supabase
        .from('attendance_record') // Replace with your actual table name
        .select('*');
      
      if (error) {
        console.error('Error fetching records:', error);
      } else {
        setAttendanceRecords(data);
      }
      setLoading(false);
    };

    fetchRecords();
  }, []);

  if (loading) return <div>Loading...</div>;
  

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 container mx-auto px-4 py-6">
        <section className="mb-8">
          <h1 className="text-2xl font-bold mb-1">Attendance Records</h1>
          <p className="text-gray-700 mb-6">View and Complete available Attendance reports</p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {attendanceRecords.length > 0 ? (
              attendanceRecords.map((record, index) => (
                <Card key={index} className="border border-gray-200">
                  <CardContent className="pt-6">
                    <h2 className="text-xl font-bold mb-4">{record.course_title}</h2>
                    <div className="space-y-2">
                      <p className="text-sm">Date: {record.attendance_date}</p>
                      <p className="text-sm">Created by: {record.creator}</p>
                      <p className="text-sm">Attendance ID: {record.attendance_id}</p>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <StudentDialog attendance_id={record.attendance_id}>
                      <Button className="w-full bg-green-500 hover:bg-green-600">Fill Out</Button>
                    </StudentDialog>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <p>No records found.</p>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}