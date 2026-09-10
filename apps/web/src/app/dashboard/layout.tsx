import AppHeader from "@/components/AppHeader";
import FooterNavigation from "@/components/AppShell/FooterNavigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <AppHeader />

      <main className="mx-auto max-w-7xl px-8 py-10">
        {children}
      </main>
    </div>
  );
}