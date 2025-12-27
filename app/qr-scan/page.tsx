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

  // 2. Submit Phone (Check-in attempt)
  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!phone || phone.length < 8) {
      alert("Please enter a valid phone number")
      return
    }
    setLoading(true)

    try {
      const res: any = await apiClient.submitAttendance({
        sessionId: sessionId!,
        phoneNumber: phone
      })

      const { status, message, name } = res.data

      if (status === 'success' || status === 'already_checked_in') {
        setSuccessMsg(message)
        setUserName(name)
        setViewState('success')
      } else if (status === 'needs_registration') {
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
      // Re-submit attendance with details
      const res: any = await apiClient.submitAttendance({
        sessionId: sessionId!,
        phoneNumber: phone,
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
      <div className="min-h-screen flex items-center justify-center p-4 bg-background text-foreground">
        <Card className="w-full max-w-md border-destructive/20 bg-destructive/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertCircle className="w-6 h-6" /> Error
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-destructive font-medium">{errorMsg}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (viewState === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-background">
        <Card className="w-full max-w-md border-primary/20 shadow-2xl bg-card">
          <CardHeader className="text-center pb-6">
            <div className="mx-auto w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6 animate-in zoom-in duration-300">
              <CheckCircle className="w-10 h-10 text-primary" />
            </div>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Checked In!
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-foreground">Welcome, {userName}!</h3>
              <p className="text-muted-foreground">{successMsg}</p>
            </div>
            <div className="p-4 rounded-lg bg-muted/50 border border-muted">
              <p className="text-sm font-medium text-foreground">{session?.church?.name}</p>
              <p className="text-xs text-muted-foreground mt-1">{session?.session_name}</p>
            </div>
          </CardContent>
          <CardFooter className="justify-center pt-4">
            <Button variant="outline" className="w-full" onClick={() => window.location.reload()}>
              Check In Another Person
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  if (viewState === 'onboarding') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background py-10">
        <div className="w-full max-w-lg space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Welcome!</h1>
            <p className="text-muted-foreground">Complete your profile to join the family.</p>
          </div>

          <OnboardingForm
            phone={phone}
            onSubmit={handleOnboardingComplete}
            onCancel={() => setViewState('phone-entry')}
          />
        </div>
      </div>
    )
  }

  // Default: Phone Entry
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background text-foreground">
      <Card className="w-full max-w-md shadow-2xl border-border bg-card">
        <CardHeader className="text-center space-y-6 pt-10">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center animate-pulse">
            <LogIn className="w-8 h-8 text-primary" />
          </div>
          <div>
            <CardTitle className="text-3xl font-bold tracking-tight">{session?.church?.name}</CardTitle>
            <CardDescription className="text-lg mt-2 font-medium text-primary">
              {session?.session_name}
            </CardDescription>
          </div>
          <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-muted text-sm font-medium text-muted-foreground">
            {session?.session_date} • {session?.session_time}
          </div>
        </CardHeader>
        <CardContent className="pb-10 pt-6">
          <form onSubmit={handlePhoneSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-base">Mobile Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="050 123 4567"
                className="text-lg h-14 bg-background"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                autoFocus
              />
            </div>
            <Button type="submit" className="w-full h-14 text-lg font-semibold shadow-lg hover:shadow-xl transition-all" disabled={loading}>
              {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : "Check In"}
            </Button>
          </form>
        </CardContent>
      </Card>
      <div className="mt-8 text-center text-sm text-muted-foreground">
        <p>Protected by Lighthouse Revival</p>
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
