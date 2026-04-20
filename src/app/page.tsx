import Link from "next/link";
import Button from "@/src/components/Button";
import { ShieldCheck, Layers, BarChart3, ArrowRight } from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center px-4 pt-20 pb-16 text-center sm:pt-32 sm:pb-24">
        <div className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium bg-[var(--surface-secondary)] text-[var(--muted)] border border-[var(--border)] mb-6">
          <span className="flex h-2 w-2 rounded-full bg-[var(--accent)] mr-2" />
          V1.0.0 — Multi-Profile Management
        </div>

        <h1 className="max-w-3xl text-4xl font-semibold tracking-tight sm:text-6xl text-[var(--foreground)]">
          จัดการเงินทุกมิติ <br />
          <span className="text-[var(--muted)]">ในบัญชีเดียว</span>
        </h1>

        <p className="mt-6 max-w-[600px] text-lg text-[var(--muted)] leading-relaxed">
          Multi-Wallet ช่วยให้คุณแยกกระเป๋าเงินส่วนตัว ธุรกิจ และเงินเก็บออกจากกันอย่างเด็ดขาด
          ด้วยระบบ Multi-Profile ที่ออกแบบมาเพื่อความปลอดภัยสูงสุด
        </p>

        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link href="/auth">
            <Button size="xl" variant={'success'} rightIcon={<ArrowRight size={18} />}>
              เริ่มต้นใช้งานฟรี
            </Button>
          </Link>
        </div>
      </section>

      <section className="px-4 py-16 bg-[var(--surface-secondary])/50">
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              icon={<Layers size={24} />}
              title="Multi-Profile"
              description="สร้างโปรไฟล์ย่อยได้ไม่จำกัด แยก Data Integrity ด้วย profile_id อย่างชัดเจน"
            />
            <FeatureCard
              icon={<ShieldCheck size={24} />}
              title="Enterprise Security"
              description="ปลอดภัยด้วย NextAuth.js และระบบ Rate Limiting ผ่าน Upstash Redis"
            />
            <FeatureCard
              icon={<BarChart3 size={24} />}
              title="Real-time Analytics"
              description="วิเคราะห์พฤติกรรมการใช้จ่ายตามหมวดหมู่ พร้อมยอดคงเหลือแบบ Real-time"
            />
          </div>
        </div>
      </section>

      <section className="px-4 py-20 text-center">
        <h3 className="text-sm font-medium uppercase tracking-[0.2em] text-[--muted] mb-8">
          Powered by Industry-Standard Tech
        </h3>
        <div className="flex flex-wrap justify-center gap-8 opacity-60 grayscale hover:grayscale-0 transition-all">
          <span className="font-mono font-bold">Next.js 15</span>
          <span className="font-mono font-bold">TypeScript</span>
          <span className="font-mono font-bold">Drizzle ORM</span>
          <span className="font-mono font-bold">PostgreSQL</span>
          <span className="font-mono font-bold">Tailwind v4</span>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="group p-8 rounded-2xl bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--accent)] transition-all">
      <div className="mb-4 text-[var(--accent)] inline-block p-3 rounded-xl bg-[var(--surface-secondary)]">
        {icon}
      </div>
      <h3 className="text-xl font-medium mb-2 text-[var(--foreground)]">{title}</h3>
      <p className="text-[var(--muted)] leading-relaxed text-sm">{description}</p>
    </div>
  );
}