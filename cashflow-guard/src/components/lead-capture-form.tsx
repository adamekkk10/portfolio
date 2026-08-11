"use client";

import { useState } from "react";
import { ArrowRight, CheckCircle2, Lock } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function LeadCaptureForm() {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!EMAIL_PATTERN.test(email.trim())) {
      setError("Zadejte prosím platný e-mail, ať víme, kam se ozvat.");
      return;
    }

    setError(null);
    // TODO: napojit na reálný cíl (webhook, CRM, e-mail). Zatím jen lokální stav.
    console.info("Lead:", { email: email.trim(), phone: phone.trim() });
    setSubmitted(true);
  }

  return (
    <section id="formular" className="scroll-mt-16 border-t border-border py-20 sm:py-24">
      <div className="mx-auto max-w-lg px-6">
        <Card className="gap-0 p-0 shadow-lg shadow-primary/10 ring-2 ring-primary/20">
          <div aria-hidden="true" className="h-1.5 w-full bg-primary" />

          {submitted ? (
            <CardContent className="px-7 py-12 text-center sm:px-9">
              <CheckCircle2
                className="mx-auto size-11 text-primary"
                aria-hidden="true"
              />
              <p className="mt-5 text-xl font-semibold tracking-tight">
                Máme to. Místo držíme pro vás.
              </p>
              <p className="mt-2.5 leading-relaxed text-muted-foreground text-pretty">
                Ozveme se vám na <strong className="font-medium text-foreground">{email.trim()}</strong>{" "}
                a domluvíme osobní onboarding.
              </p>
            </CardContent>
          ) : (
            <>
              <CardHeader className="px-7 pt-9 sm:px-9">
                <CardTitle className="text-2xl font-semibold tracking-[-0.02em] text-balance">
                  Zajistit si 1 ze 3 zbývajících míst
                </CardTitle>
              </CardHeader>

              <CardContent className="px-7 pt-7 pb-9 sm:px-9">
                <form onSubmit={handleSubmit} noValidate className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="email">
                      Firemní e-mail{" "}
                      <span className="text-destructive" aria-hidden="true">
                        *
                      </span>
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required
                      autoComplete="email"
                      placeholder="jmeno@firma.cz"
                      value={email}
                      onChange={(event) => {
                        setEmail(event.target.value);
                        if (error) setError(null);
                      }}
                      aria-invalid={error ? true : undefined}
                      aria-describedby={error ? "email-error" : undefined}
                      className="h-11 rounded-lg px-3.5"
                    />
                    {error && (
                      <p
                        id="email-error"
                        role="alert"
                        className="text-sm text-destructive"
                      >
                        {error}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">
                      Telefon{" "}
                      <span className="font-normal text-muted-foreground">
                        (nepovinné)
                      </span>
                    </Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      autoComplete="tel"
                      placeholder="+420 777 123 456"
                      value={phone}
                      onChange={(event) => setPhone(event.target.value)}
                      className="h-11 rounded-lg px-3.5"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="animate-cta-pulse h-auto w-full rounded-xl px-4 py-4 text-sm font-semibold tracking-tight shadow-lg shadow-primary/25 transition-transform hover:bg-blue-700 hover:-translate-y-0.5 sm:text-base"
                  >
                    [ ZÍSKAT PŘÍSTUP + 3 MĚSÍCE ZDARMA ]
                    <ArrowRight
                      className="hidden size-[1.125rem] sm:block"
                      aria-hidden="true"
                    />
                  </Button>

                  <p className="text-center text-xs leading-relaxed text-muted-foreground text-pretty">
                    <Lock
                      className="mr-1.5 inline-block size-3.5 -translate-y-px"
                      aria-hidden="true"
                    />
                    Nezávazné a zdarma. Žádná platební karta, žádná smlouva —
                    jen vám dáme vědět, jestli je místo ještě volné.
                  </p>
                </form>
              </CardContent>
            </>
          )}
        </Card>
      </div>
    </section>
  );
}
