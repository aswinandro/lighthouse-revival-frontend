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

export default function SignupPage() {
  const cardRef = useRef<HTMLDivElement>(null)
  const { fadeIn } = useGSAP()
  const { t } = useLanguage()

  useEffect(() => {
    if (cardRef.current) {
      fadeIn(cardRef.current, { y: 20, duration: 0.5 })
    }
  }, [fadeIn])

  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Handle signup logic here
    console.log("Signup attempt with:", { firstName, lastName, email, password })
  }

  return (
    <section className="flex min-h-screen items-center justify-center bg-muted/30 p-4">
      <Card ref={cardRef} className="mx-auto w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-xl">{t("signup.title")}</CardTitle>
          <CardDescription>
            {t("signup.description")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="first-name">{t("signup.firstNameLabel")}</Label>
                <Input
                  id="first-name"
                  placeholder={t("signup.firstNamePlaceholder")}
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="last-name">{t("signup.lastNameLabel")}</Label>
                <Input
                  id="last-name"
                  placeholder={t("signup.lastNamePlaceholder")}
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">{t("signup.emailLabel")}</Label>
              <Input
                id="email"
                type="email"
                placeholder={t("signup.emailPlaceholder")}
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">{t("signup.passwordLabel")}</Label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full">
              {t("signup.createButton")}
            </Button>
            <Button variant="outline" className="w-full">
              {t("signup.googleButton")}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            {t("signup.haveAccount")}{" "}
            <Link href="/login" className="underline">
              {t("signup.loginLink")}
            </Link>
          </div>
        </CardContent>
      </Card>
    </section>
  )
}