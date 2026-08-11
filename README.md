# CashFlow Guard

Squeeze landing page pro CashFlow Guard — nástroj na automatické vymáhání B2B pohledávek.

## Stack

- [Next.js](https://nextjs.org) 16 (App Router, TypeScript)
- [Tailwind CSS](https://tailwindcss.com) v4
- [shadcn/ui](https://ui.shadcn.com) — `button`, `input`, `card`, `label`
- [lucide-react](https://lucide.dev) na ikony
- [framer-motion](https://motion.dev) na animace
- Font Inter přes `next/font/google` (subsety `latin` + `latin-ext`)

## Vývoj

```bash
npm install
npm run dev
```

Stránka běží na [http://localhost:3000](http://localhost:3000).

```bash
npm run build   # produkční build
npm run lint    # eslint
```

## Struktura

Sekce stránky jsou samostatné komponenty ve `src/components/`, poskládané v `src/app/page.tsx`:

| Komponenta | Obsah |
| --- | --- |
| `TopBar` | Pruh se zprávou o zbývajících beta místech |
| `HeroSection` | Pre-headline, H1, H2, hlavní CTA |
| `PainPoints` | Tři problémy, které nástroj řeší |
| `HowItWorks` | Timeline eskalace Den 3 → Den 7 → Den 14 |
| `OfferSection` | Nabídka pro beta partnery a cena |
| `LeadCaptureForm` | Sběr e-mailu a telefonu |
| `SiteFooter` | Patička |

Sdílené animační varianty a komponenta `Reveal` jsou v `src/components/motion/`.

## Co zbývá dodělat

Formulář zatím leady nikam neodesílá — drží je jen v lokálním stavu komponenty.
Místo napojení je označené `TODO` v `src/components/lead-capture-form.tsx`.
