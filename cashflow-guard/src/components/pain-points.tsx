import { Bot, Landmark, PhoneOff, type LucideIcon } from "lucide-react";

type PainPoint = {
  icon: LucideIcon;
  title: string;
  description: string;
};

const painPoints: PainPoint[] = [
  {
    icon: PhoneOff,
    title: "Je mi to blbý.",
    description:
      "Máte venku peníze, ale nechcete volat, abyste nepokazili vztahy.",
  },
  {
    icon: Landmark,
    title: "Hrajete si na banku.",
    description:
      "Dodavatele jste zaplatili, ale klienti si z vás dělají bezúročnou půjčku.",
  },
  {
    icon: Bot,
    title: "Ignorovaný automat.",
    description:
      "Vaše upomínka z účetního systému nemá váhu. Dlužník ví, že je to stroj.",
  },
];

export function PainPoints() {
  return (
    <section className="border-t border-border bg-slate-50/60 py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="mx-auto max-w-2xl text-center text-3xl font-semibold tracking-[-0.02em] text-balance sm:text-4xl">
          Znáte ten pocit z prvního dne v měsíci?
        </h2>

        <div className="mt-14 grid gap-6 sm:mt-16 md:grid-cols-3">
          {painPoints.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="group rounded-xl border border-border bg-background p-7 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex size-11 items-center justify-center rounded-xl bg-accent text-primary">
                <Icon className="size-5" aria-hidden="true" />
              </div>
              <h3 className="mt-5 text-lg font-semibold tracking-tight">
                {title}
              </h3>
              <p className="mt-2 leading-relaxed text-muted-foreground text-pretty">
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
