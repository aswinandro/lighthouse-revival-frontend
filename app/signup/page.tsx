"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
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
import { apiClient } from "@/lib/api-client"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function SignupPage() {
  const cardRef = useRef<HTMLDivElement>(null)
  const { fadeIn } = useGSAP()
  const { t } = useLanguage()
  const router = useRouter()

  useEffect(() => {
    if (cardRef.current && fadeIn) {
      fadeIn(cardRef.current, { y: 20, duration: 0.5 })
    }
  }, [fadeIn])

  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [phone, setPhone] = useState("+971")
  const [country, setCountry] = useState("UAE")
  const [city, setCity] = useState("")
  const [emirate, setEmirate] = useState("")
  const [churchId, setChurchId] = useState("")
  const [churches, setChurches] = useState<any[]>([])

  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const loadChurches = async () => {
      try {
        const data = await apiClient.getPublicChurches()
        setChurches(data)
      } catch (err) {
        console.error("Failed to load churches", err)
      }
    }
    loadChurches()
  }, [])

  const handleCountryChange = (val: string) => {
    setCountry(val)
    if (val === "UAE") {
      if (!phone.startsWith("+971")) setPhone("+971")
    } else if (val === "Oman") {
      setPhone("+968")
    } else if (val === "Qatar") {
      setPhone("+974")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    setIsLoading(true)
    try {
      const response = await apiClient.register({
        firstName,
        lastName,
        email,
        password,
        phone,
        country,
        city,
        emirate: country === "UAE" ? emirate : undefined,
        churchId
      })

      setSuccess(`Welcome, ${firstName}! Registration successful. Redirecting to your dashboard...`)

      // Automatic Login
      if (response && response.data && response.data.token) {
        localStorage.setItem("token", response.data.token)
        localStorage.setItem("user", JSON.stringify(response.data.user))

        // Wait a bit to show the success message
        setTimeout(() => {
          router.push("/dashboard")
        }, 1500)
      } else {
        // Fallback to login if token not returned for some reason
        setTimeout(() => {
          router.push("/login")
        }, 2000)
      }
    } catch (err: any) {
      setError(err.message || "Registration failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section className="flex min-h-screen items-center justify-center bg-[#0a0a0a] p-4 font-sans">
      <div className="absolute inset-0 bg-grid-white/[0.02] -z-10" />
      <div className="absolute h-[500px] w-[500px] bg-primary/10 blur-[120px] rounded-full -top-24 -left-24 -z-10" />

      <Card ref={cardRef} className="mx-auto w-full max-w-md border-white/10 bg-black/40 backdrop-blur-xl shadow-2xl">
        <CardHeader>
          <CardTitle className="text-2xl font-black tracking-tight text-white">{t("signup.title")}</CardTitle>
          <CardDescription className="text-slate-400">
            {t("signup.description")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-6 bg-red-500/10 border-red-500/20 text-red-400">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {success && (
            <Alert className="mb-6 bg-green-500/10 border-green-500/20 text-green-400">
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="first-name" className="text-xs uppercase tracking-widest text-slate-500 font-bold">{t("signup.firstNameLabel")}</Label>
                <Input
                  id="first-name"
                  placeholder={t("signup.firstNamePlaceholder")}
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="bg-white/5 border-white/10 focus:border-primary/50 transition-all h-11"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="last-name" className="text-xs uppercase tracking-widest text-slate-500 font-bold">{t("signup.lastNameLabel")}</Label>
                <Input
                  id="last-name"
                  placeholder={t("signup.lastNamePlaceholder")}
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="bg-white/5 border-white/10 focus:border-primary/50 transition-all h-11"
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="email" className="text-xs uppercase tracking-widest text-slate-500 font-bold">{t("signup.emailLabel")}</Label>
              <Input
                id="email"
                type="email"
                placeholder={t("signup.emailPlaceholder")}
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white/5 border-white/10 focus:border-primary/50 transition-all h-11"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="password" className="text-xs uppercase tracking-widest text-slate-500 font-bold">{t("signup.passwordLabel")}</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-white/5 border-white/10 focus:border-primary/50 transition-all h-11"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label className="text-xs uppercase tracking-widest text-slate-500 font-bold">Country</Label>
                <Select value={country} onValueChange={handleCountryChange}>
                  <SelectTrigger className="bg-white/5 border-white/10 h-11">
                    <SelectValue placeholder="Select Country" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-white/10 text-white">
                    <SelectItem value="UAE">UAE</SelectItem>
                    <SelectItem value="Oman">Oman</SelectItem>
                    <SelectItem value="Qatar">Qatar</SelectItem>
                    <SelectItem value="Kuwait">Kuwait</SelectItem>
                    <SelectItem value="Bahrain">Bahrain</SelectItem>
                    <SelectItem value="Saudi Arabia">Saudi Arabia</SelectItem>
                    <SelectItem value="India">India</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label className="text-xs uppercase tracking-widest text-slate-500 font-bold">City / Emirate</Label>
                {country === "UAE" ? (
                  <Select value={emirate} onValueChange={setEmirate}>
                    <SelectTrigger className="bg-white/5 border-white/10 h-11">
                      <SelectValue placeholder="Select Emirate" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-white/10 text-white">
                      <SelectItem value="Abu Dhabi">Abu Dhabi</SelectItem>
                      <SelectItem value="Dubai">Dubai</SelectItem>
                      <SelectItem value="Sharjah">Sharjah</SelectItem>
                      <SelectItem value="Ajman">Ajman</SelectItem>
                      <SelectItem value="Umm Al Quwain">Umm Al Quwain</SelectItem>
                      <SelectItem value="Ras Al Khaimah">Ras Al Khaimah</SelectItem>
                      <SelectItem value="Fujairah">Fujairah</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <Input
                    placeholder="Enter city"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="bg-white/5 border-white/10 h-11"
                  />
                )}
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="phone" className="text-xs uppercase tracking-widest text-slate-500 font-bold">Mobile Number</Label>
              <Input
                id="phone"
                placeholder="+971 50 123 4567"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="bg-white/5 border-white/10 focus:border-primary/50 transition-all h-11"
              />
            </div>

            <div className="grid gap-2">
              <Label className="text-xs uppercase tracking-widest text-slate-500 font-bold">Select Church</Label>
              <Select value={churchId} onValueChange={setChurchId}>
                <SelectTrigger className="bg-white/5 border-white/10 h-11">
                  <SelectValue placeholder="Which church do you attend?" />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-white/10 text-white">
                  {churches.map((church) => (
                    <SelectItem key={church.id} value={church.id}>
                      {church.name} ({church.city})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button type="submit" className="w-full h-12 mt-4 font-bold text-base shadow-lg shadow-primary/20 transition-all hover:scale-[1.02]" disabled={isLoading}>
              {isLoading ? "Creating Account..." : t("signup.createButton")}
            </Button>
          </form>

          <div className="mt-4 text-center text-sm">
            <span className="text-slate-500">{t("signup.haveAccount")} </span>
            <Link href="/login" className="text-primary hover:underline font-bold">
              {t("signup.loginLink")}
            </Link>
          </div>
        </CardContent>
      </Card>
    </section>
  )
}
