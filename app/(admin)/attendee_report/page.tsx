/*import React, { useEffect, useState } from 'react'
import { supabase } from '@/utils/supabase/client'
import { revalidatePath } from "next/cache";


const Incidentreport = async () => {
 revalidatePath("/admin_incident")
  const { data: incidentData, error: incidentError} = await supabase.from('incidentform').select('*');
  if (incidentError) {
   console.error({incidentError });
   return <div>Error loading data</div>;
  }
  return (
      
    <div className="container mx-auto py-10 pt-24">
      <AttendeeDataTable columns={attendee_columns} data={AttendeeDataTable} />
    </div>
  )
}
 
export default Incidentreport; */

import { AttendeeDataTable } from '@/app/(admin)/attendee_report/components/attendee-data-table'
import { Attendee, attendee_columns } from "@/app/(admin)/attendee_report/components/attendee-columns"
import { supabase } from '@/lib/supabaseClient';
async function getData(): Promise<Attendee[]> {
  const { data, error } = await supabase
    .from('attendee') // Replace with your Supabase table name
    .select('*');
  
  if (error) {
    console.error('Error fetching data:', error);
    return [];
  }
  
  return data as Attendee[];
}
//   return [
//     {
//       id: 1,
//       name: "Phillip Hufana",
//       studentnum: "2022-06863",
//       date_arrived: "May 5, 2025",
//       time_arrived: "12:00 PM",
//       time_course: "11:30 PM",
//       adviser: "Vicente Calag",
//       course_title: "CMSC 186",
//       degreeProg: "BSCS",
//       description: "Heavy Rainfall",
//       status: false,
//     },
//     // ...
//   ]
// }
 
export default async function DemoPage() {
  const data = await getData()
 
 return (
   <div className="container mx-auto py-10">
      <AttendeeDataTable columns={attendee_columns} data={data} />
   </div>
  )
}