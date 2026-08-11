"use client";

import { motion } from "framer-motion";
import { Bot, Landmark, PhoneOff, type LucideIcon } from "lucide-react";

import { EASE_OUT, fadeInUp, iconWiggle } from "@/components/motion/reveal";

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
        <motion.h2
          data-reveal=""
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.55, ease: EASE_OUT }}
          className="mx-auto max-w-2xl text-center text-3xl font-semibold tracking-[-0.02em] text-balance sm:text-4xl"
        >
          Znáte ten pocit z prvního dne v měsíci?
        </motion.h2>

        <div className="mt-14 grid gap-6 sm:mt-16 md:grid-cols-3">
          {painPoints.map(({ icon: Icon, title, description }, index) => (
            <motion.div
              key={title}
              data-reveal=""
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              whileHover="hover"
              viewport={{ once: true, amount: 0.3 }}
              transition={{
                duration: 0.55,
                delay: index * 0.1,
                ease: EASE_OUT,
              }}
              className="rounded-xl border border-border bg-background p-7 shadow-sm transition-shadow hover:shadow-md"
            >
              <motion.div
                variants={iconWiggle}
                className="flex size-11 items-center justify-center rounded-xl bg-accent text-primary"
              >
                <Icon className="size-5" aria-hidden="true" />
              </motion.div>
              <h3 className="mt-5 text-lg font-semibold tracking-tight">
                {title}
              </h3>
              <p className="mt-2 leading-relaxed text-muted-foreground text-pretty">
                {description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
