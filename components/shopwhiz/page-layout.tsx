import { Header } from "./header";
import { Footer } from "./footer";
import { SidebarNav } from "./sidebar-nav";

export function PageLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen w-full flex flex-col bg-white">
      <Header />
      <main className="flex-grow w-full max-w-screen-2xl mx-auto px-8 py-6">
        <div className="grid grid-cols-12 gap-8">
          <SidebarNav />
          <div className="col-span-12 lg:col-span-10">
            {children}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
