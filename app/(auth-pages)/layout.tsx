export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
      <div className="w-auto max-w-md p-8 space-y-6 bg-card shadow-lg rounded-lg border border-border">
        {children}
      </div>
    </div>
  );
}
