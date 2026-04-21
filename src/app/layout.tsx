import type { Metadata } from "next";
import { Prompt } from "next/font/google";
import './globals.css';
import { Toaster } from "react-hot-toast";
const prompt = Prompt({
  weight: ['300', '400', '500', '600'],
  subsets: ['latin', 'thai'],
  display: 'swap',
});


export const metadata: Metadata = {
  title: "Track Your Cash",
  description: "A simple expense tracker built with Next.js, Drizzle ORM, and PostgreSQL.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${prompt.className} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <Toaster
          position="bottom-right"
          reverseOrder={true}
        />
      </body>
    </html>
  );
}
