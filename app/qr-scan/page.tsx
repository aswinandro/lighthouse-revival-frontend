"use client"

import { Suspense, useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { CheckCircle, Loader2, UserPlus, LogIn, AlertCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { apiClient } from "@/lib/api-client"
import { OnboardingForm } from "@/components/attendance/onboarding-form"
import { PhoneInput } from "@/components/ui/phone-input"

type ViewState = 'loading' | 'phone-entry' | 'success' | 'onboarding' | 'error'

function QRScanContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const sessionId = searchParams.get('sessionId')

  const [viewState, setViewState] = useState<ViewState>('loading')
  const [session, setSession] = useState<any>(null)
  const [phone, setPhone] = useState("")
  const [errorMsg, setErrorMsg] = useState("")
  const [successMsg, setSuccessMsg] = useState("")
  const [userName, setUserName] = useState("")
  const [visitorData, setVisitorData] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  // 1. Load Session Details
  useEffect(() => {
    if (!sessionId) {
      setViewState('error')
      setErrorMsg("No session ID provided. Please scan a valid QR code.")
      return
    }

    const fetchSession = async () => {
      try {
        const res: any = await apiClient.getSessionDetails(sessionId)
        setSession(res.data)
        setViewState('phone-entry')
      } catch (err: any) {
        setViewState('error')
        setErrorMsg(err.message || "Invalid or expired session.")
      }
    }
    fetchSession()
  }, [sessionId])

  const normalizePhoneValue = (p: string) => p.replace(/\D/g, "")

  // 2. Submit Phone (Check-in attempt)
  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!phone || phone.length < 8) {
      alert("Please enter a valid phone number")
      return
    }
    setLoading(true)

    try {
      const normalizedPhone = normalizePhoneValue(phone)
      const res: any = await apiClient.submitAttendance({
        sessionId: sessionId!,
        phoneNumber: normalizedPhone
      })

      const { status, message, name, visitor } = res.data

      if (status === 'success' || status === 'already_checked_in') {
        setSuccessMsg(message)
        setUserName(name)
        setViewState('success')
      } else if (status === 'needs_registration') {
        if (visitor) setVisitorData(visitor)
        setViewState('onboarding')
      }
    } catch (err: any) {
      console.error(err)
      alert("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  // 3. Handle Onboarding Success
  const handleOnboardingComplete = async (memberDetails: any) => {
    setLoading(true)
    try {
      const normalizedPhone = normalizePhoneValue(phone)
      // Re-submit attendance with details
      const res: any = await apiClient.submitAttendance({
        sessionId: sessionId!,
        phoneNumber: normalizedPhone,
        memberDetails
      })

      const { status, message, name } = res.data
      if (status === 'success') {
        setSuccessMsg(message)
        setUserName(name)
        setViewState('success')
      }
    } catch (err) {
      console.error(err)
      alert("Registration failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  // RENDER STATES
  if (viewState === 'loading') {
    return <div className="min-h-screen flex items-center justify-center bg-background"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
  }

  if (viewState === 'error') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-[#0a0a0a] relative overflow-hidden text-white">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-destructive/10 rounded-full blur-[120px] pointer-events-none" />
        <Card className="w-full max-w-md border-destructive/20 bg-destructive/5 backdrop-blur-xl relative z-10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertCircle className="w-6 h-6" /> Error
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-destructive font-medium">{errorMsg}</p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full border-white/10 hover:bg-white/5 text-white" onClick={() => router.push('/')}>
              Return Home
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  if (viewState === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-[#0a0a0a] relative overflow-hidden text-white">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
        <Card className="w-full max-w-md border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl relative z-10">
          <CardHeader className="text-center pb-6">
            <div className="mx-auto w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center mb-6 animate-in zoom-in duration-500 border border-primary/30 shadow-[0_0_40px_rgba(var(--primary-rgb),0.3)]">
              <CheckCircle className="w-12 h-12 text-primary" />
            </div>
            <CardTitle className="text-4xl font-black bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent underline decoration-primary lg:whitespace-nowrap">
              Check-in Successful!
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <div className="space-y-2 animate-in fade-in slide-in-from-bottom-2 duration-700 delay-300">
              <h3 className="text-2xl font-bold text-white">Welcome, {userName}!</h3>
              <p className="text-gray-400 font-medium">{successMsg}</p>
            </div>
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 shadow-inner">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">{session?.church?.name}</p>
              <p className="text-xs text-gray-500 mt-2 font-medium">{session?.session_name}</p>
            </div>
          </CardContent>
          <CardFooter className="justify-center pt-8">
            <Button variant="outline" className="w-full h-14 border-white/10 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl" onClick={() => window.location.reload()}>
              Check In Another Person
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  if (viewState === 'onboarding') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[#0a0a0a] relative overflow-hidden text-white py-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] pointer-events-none" />

        <div className="w-full max-w-lg space-y-8 relative z-10">
          <div className="text-center space-y-3 animate-in fade-in slide-in-from-top-4 duration-700">
            <div className="mx-auto w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center border border-primary/30 mb-4">
              <UserPlus className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-4xl font-black tracking-tight text-white">Joining the Family</h1>
            <p className="text-gray-400 font-medium">{visitorData ? `Welcome back, ${visitorData.first_name}! Let's complete your profile.` : "We're so glad you're here! Let's get to know you."}</p>
          </div>

          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-1 shadow-2xl">
            <OnboardingForm
              phone={phone}
              initialData={visitorData}
              onSubmit={handleOnboardingComplete}
              onCancel={() => setViewState('phone-entry')}
            />
          </div>
        </div>
      </div>
    )
  }

  // Default: Phone Entry
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[#0a0a0a] relative overflow-hidden text-white">
      {/* Decorative background elements */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md space-y-8 relative z-10">
        <div className="text-center space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h2 className="text-primary font-bold tracking-[0.2em] uppercase text-sm">Welcome to</h2>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">
            Lighthouse Revival <br />
            <span className="text-primary">International Church</span>
          </h1>
          <div className="h-1.5 w-24 bg-primary mx-auto rounded-full" />
        </div>

        <Card className="shadow-2xl border-white/10 bg-white/5 backdrop-blur-xl animate-in zoom-in duration-500">
          <CardHeader className="text-center space-y-4 pt-10 pb-6">
            <div className="mx-auto w-20 h-20 bg-primary/20 rounded-2xl flex items-center justify-center border border-primary/30 shadow-[0_0_30px_rgba(var(--primary-rgb),0.2)]">
              <LogIn className="w-10 h-10 text-primary" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold tracking-tight text-white">{session?.church?.name}</CardTitle>
              <CardDescription className="text-lg mt-1 font-medium text-primary/80">
                {session?.session_name}
              </CardDescription>
            </div>
            <div className="inline-flex items-center justify-center px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm font-medium text-gray-300">
              {session?.session_date} • {session?.session_time}
            </div>
          </CardHeader>
          <CardContent className="pb-10 pt-2 px-8">
            <form onSubmit={handlePhoneSubmit} className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="phone" className="text-sm font-semibold uppercase tracking-wider text-gray-400">Mobile Number</Label>
                <PhoneInput
                  value={phone}
                  onChange={setPhone}
                  placeholder="50 123 4567"
                  required
                  className="text-lg h-14 bg-white/5 border-white/10 text-white placeholder:text-gray-500 hover:border-primary/50 focus:border-primary transition-all rounded-xl"
                  autoFocus
                />
              </div>
              <Button type="submit" className="w-full h-15 text-lg font-bold shadow-[0_10px_30px_rgba(var(--primary-rgb),0.3)] hover:shadow-[0_15px_40px_rgba(var(--primary-rgb),0.4)] transition-all bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl" disabled={loading}>
                {loading ? <Loader2 className="mr-2 h-6 w-6 animate-spin" /> : "Check In Now"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="text-center space-y-2 animate-in fade-in duration-1000 delay-500">
          <p className="text-sm font-medium text-gray-500">We are glad you are joining us for this session.</p>
          <div className="flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] text-gray-600">
            <span className="w-8 h-[1px] bg-gray-600/30" />
            Lighthouse Revival
            <span className="w-8 h-[1px] bg-gray-600/30" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default function QRScanPage() {
  return (
    <Suspense fallback={<div className="h-screen flex items-center justify-center bg-background"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>}>
      <QRScanContent />
    </Suspense>
  )
}
