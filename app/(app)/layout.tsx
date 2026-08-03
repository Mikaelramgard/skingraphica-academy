import { Sidebar } from "@/components/nav/sidebar";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-paper">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto w-full max-w-[880px] px-8 py-12">{children}</div>
      </main>
    </div>
  );
}
