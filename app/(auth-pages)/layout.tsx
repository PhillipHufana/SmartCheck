import { Navbar } from "./components/navbar";
export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // ✅ Add `relative` to enable absolute positioning
    <>
    <Navbar></Navbar>
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-4 relative">
      
      {/* ✅ Absolute positioned welcome message
      <div className="absolute top-0 flex h-48 flex-col items-center justify-center z-10">
        <h1 className="text-4xl font-bold">Welcome to SmartCheck!</h1>
        <h3 className="text-2xl font-semibold text-gray-600">
          The fastest way to track and monitor class attendance.
        </h3>
      </div> */}

      {/* ✅ Lower z-index for the card */}
      <div className="w-auto max-w-md p-8 space-y-6 bg-card shadow-lg rounded-lg border border-border z-0">
        {children}
      </div>
    </div>
    </>
  );
}