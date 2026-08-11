import { ShieldCheck } from "lucide-react";

import { Reveal } from "@/components/motion/reveal";

export function SiteFooter() {
  return (
    <footer className="bg-slate-950 text-slate-400">
      <Reveal className="mx-auto flex max-w-6xl flex-col items-center gap-5 px-6 py-14 text-center">
        <div className="flex items-center gap-2 text-white">
          <ShieldCheck className="size-5 text-primary" aria-hidden="true" />
          <span className="text-[0.9375rem] font-semibold tracking-tight">
            CashFlow Guard
          </span>
        </div>

        <p className="max-w-md text-sm leading-relaxed text-pretty">
          Nejsme inkasní agentura s obuškem. Jsme softwarový nástroj, který
          proces urychluje.
        </p>

        <p className="text-xs text-slate-500">
          © {new Date().getFullYear()} CashFlow Guard
        </p>
      </Reveal>
    </footer>
  );
}
