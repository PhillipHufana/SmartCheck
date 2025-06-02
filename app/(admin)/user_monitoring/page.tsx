// kapoy yawa
// 
//  // app/admin/users/page.tsx
// import { createClient } from "@/utils/supabase/server";
// import { redirect } from "next/navigation";

// export default async function AdminUsersPage() {
//   const supabase = await createClient();
//   const { data: profiles, error } = await supabase.from("profiles").select("*");

//   if (error) throw error;

//   const handleRoleChange = async (userId: string, newRole: string) => {
//     "use server";
//     const supabase = await createClient();
//     await supabase.from("profiles").update({ role: newRole }).eq("id", userId);
//   };

//   return (
//     <div>
//       <h1>Manage Users</h1>
//       <table>
//         {profiles.map((profile) => (
//           <tr key={profile.id}>
//             <td>{profile.first_name} {profile.last_name}</td>
//             <td>{profile.email}</td>
//             <td>
//               <form action={handleRoleChange.bind(null, profile.id, profile.role === "admin" ? "user" : "admin")}>
//                 <button type="submit">
//                   {profile.role === "admin" ? "Revoke Admin" : "Make Admin"}
//                 </button>
//               </form>
//             </td>
//           </tr>
//         ))}
//       </table>
//     </div>
//   );
// }