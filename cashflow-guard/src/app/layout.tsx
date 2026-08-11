import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "CashFlow Guard | Vymáhání nezaplacených faktur na autopilota",
  description:
    "Automatické vymáhání B2B pohledávek. E-maily, asertivní SMS jednateli a předžalobní výzvy do datové schránky. Nastavení za 3 minuty, bez platební karty.",
  openGraph: {
    title: "CashFlow Guard | Vymáhání nezaplacených faktur na autopilota",
    description:
      "Přestaňte svým klientům dotovat byznys. Automatické upomínky, eskalace a předžalobní výzvy.",
    type: "website",
    locale: "cs_CZ",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="cs" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
