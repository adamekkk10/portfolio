import { AlertTriangle } from "lucide-react";

export function TopBar() {
  return (
    <div className="w-full bg-orange-600 text-white">
      <div className="mx-auto flex max-w-6xl items-center justify-center gap-2 px-4 py-2.5 text-center">
        <AlertTriangle
          className="hidden size-4 shrink-0 sm:block"
          aria-hidden="true"
        />
        <p className="text-[0.8125rem] leading-snug font-medium tracking-tight sm:text-sm">
          <span className="sm:hidden" aria-hidden="true">
            ⚠️{" "}
          </span>
          Upozornění: Přístup do uzavřené Beta verze končí po zaplnění prvních
          10 míst.{" "}
          <span className="font-semibold underline decoration-white/40 underline-offset-2">
            Zbývají 3 volná místa.
          </span>
        </p>
      </div>
    </div>
  );
}
