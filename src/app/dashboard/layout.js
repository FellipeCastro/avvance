import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

export const metadata = {
    title: "Avvance Dashboard",
};

export default function Layout({ children }) {
    return (
        <SidebarProvider>
            <AppSidebar />
            <div>
                <SidebarTrigger className="mt-4 ml-8" />
                <main className="p-12 min-h-screen flex flex-col gap-8 ml-4">
                    {children}
                </main>
            </div>
        </SidebarProvider>
    );
}