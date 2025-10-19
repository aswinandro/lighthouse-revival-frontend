"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { useLanguage } from "@/components/providers/language-provider"
import { useGSAP } from "@/hooks/use-gsap"

import { Button } from "@/components/ui/button"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
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
    // Only run on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState("church_believer")
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    try {
      const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000"
      const res = await fetch(`${apiBase}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName, email, password, role }),
      })
      if (res.ok) {
        setSuccess("Registration successful! You can now log in.")
        setFirstName("")
        setLastName("")
        setEmail("")
        setPassword("")
      } else {
        const errorText = await res.text()
        setError(errorText || "Registration failed. Please try again.")
      }
    } catch (err) {
      setError("Registration failed. Please try again.")
    }
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
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {success && (
            <Alert variant="default" className="mb-4">
              <AlertTitle>Success</AlertTitle>
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}
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
            {/* Role selection (optional, default to church_believer) */}
            <div className="grid gap-2">
              <Label htmlFor="role">Role</Label>
              <select
                id="role"
                className="border rounded-md px-3 py-2 bg-background"
                value={role}
                onChange={e => setRole(e.target.value)}
              >
                <option value="church_believer">Church Believer</option>
                <option value="church_leader">Church Leader</option>
                <option value="church_pastor">Church Pastor</option>
                <option value="super_admin">Super Admin</option>
              </select>
            </div>
            <Button type="submit" className="w-full">
              {t("signup.createButton")}
            </Button>
            <Button variant="outline" className="w-full">
              {t("signup.googleButton")}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            {t("signup.haveAccount") + " "}
            <Link href="/login" className="underline">
              {t("signup.loginLink")}
            </Link>
          </div>
        </CardContent>
      </Card>
    </section>
  )
}