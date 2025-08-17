import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

export const metadata = {
    title: "TalentAI - Dashboard",
};

export default function Layout({ children }) {
    return (
        <SidebarProvider>
            <AppSidebar />
            <div>
                <SidebarTrigger className="mt-4 ml-4" />
                <main className="p-12 min-h-screen flex flex-col gap-8 ml-4">
                    {children}
                </main>
            </div>
        </SidebarProvider>
    );
}

// export default function DashboardLayout({ children }) {
//   return (
//     <div className="min-h-screen flex flex-col bg-gray-50">
//       <header className="p-4 border-b bg-white">Header do Dashboard</header>
//       <main className="flex flex-col p-6 max-w-5xl mx-auto w-full">
//         {children}
//       </main>
//     </div>
//   );
// }
