"use server"


import { revalidatePath } from 'next/cache';
import { supabase } from '@/lib/supabaseClient';

export async function deleteAttendee(id: number) {
  const { error } = await supabase
    .from('attendee')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting attendee:', error);
    return JSON.stringify({ error: error.message });
  }

  revalidatePath('/admin/attendee_report');
  return JSON.stringify({ message: 'Attendee deleted successfully' });
}

export async function Attendeestatus(id: string, status: string, data:any) {
  const { data: updatedData, error } = await supabase
    .from('attendee')
    .update({ status })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating status of attendee:', error);
    return JSON.stringify({ error: error.message });
  }

  revalidatePath('/admin/attendee_report');
  return JSON.stringify(updatedData);
}
