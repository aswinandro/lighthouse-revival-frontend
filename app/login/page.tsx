"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { useLanguage } from "@/components/providers/language-provider"
import { useGSAP } from "@/hooks/use-gsap"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function LoginPage() {
  const cardRef = useRef<HTMLDivElement>(null)
  const { fadeIn } = useGSAP()
  const { t } = useLanguage()

  useEffect(() => {
    if (cardRef.current) {
      fadeIn(cardRef.current, { y: 20, duration: 0.5 })
    }
  }, [fadeIn])

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Handle login logic here
    console.log("Login attempt with:", { email, password })
  }

  return (
    <section className="flex min-h-screen items-center justify-center bg-muted/30 p-4">
      <Card ref={cardRef} className="mx-auto w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">{t("login.title")}</CardTitle>
          <CardDescription>
            {t("login.description")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">{t("login.emailLabel")}</Label>
              <Input
                id="email"
                type="email"
                placeholder={t("login.emailPlaceholder")}
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">{t("login.passwordLabel")}</Label>
                <Link
                  href="#"
                  className="ms-auto inline-block text-sm underline"
                >
                  {t("login.forgotPassword")}
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full">
              {t("login.loginButton")}
            </Button>
            <Button variant="outline" className="w-full">
              {t("login.googleButton")}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            {t("login.noAccount")}{" "}
            <Link href="/signup" className="underline">
              {t("login.signUpLink")}
            </Link>
          </div>
        </CardContent>
      </Card>
    </section>
  )
}