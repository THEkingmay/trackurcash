import Navbar from "@/src/components/Navbar";
import { Metadata } from "next";
import AuthProvider from "@/src/hooks/auth/AuthProvider";
export const metadata: Metadata = {
    title: "เริ่มจัดการเงินของคุณกับ Track Your Cash",
    description: "A simple expense tracker built with Next.js, Drizzle ORM, and PostgreSQL.",
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <main>
            <AuthProvider>
                <Navbar />
                {children}
            </AuthProvider>
        </main>
    )
}
