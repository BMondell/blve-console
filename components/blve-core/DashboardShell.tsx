import LeftNav from "./LeftNav";
import TopHeader from "./TopHeader";

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <LeftNav />

      <div className="flex-1 flex flex-col">
        <TopHeader />

        <main className="flex-1 px-10 py-8">
          <div className="max-w-[1600px] mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
