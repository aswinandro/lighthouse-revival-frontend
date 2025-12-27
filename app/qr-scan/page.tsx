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
    return <div className="h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
  }

  if (viewState === 'error') {
    return (
      <div className="h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-700">
              <AlertCircle className="w-6 h-6" /> Error
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-600">{errorMsg}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (viewState === 'success') {
    return (
      <div className="h-screen flex items-center justify-center p-4 bg-green-50/30">
        <Card className="w-full max-w-md border-green-200 shadow-lg">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <CardTitle className="text-2xl text-green-800">Checked In!</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-lg font-medium">{successMsg}</p>
            <p className="text-sm text-muted-foreground">Session: {session?.session_name}</p>
          </CardContent>
          <CardFooter className="justify-center">
            <Button variant="outline" onClick={() => window.location.reload()}>Scan Another</Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  if (viewState === 'onboarding') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50">
        <Card className="w-full max-w-lg shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="w-6 h-6 text-primary" /> New Registration
            </CardTitle>
            <CardDescription>
              We couldn't find your number ({phone}). Please fill in your details to check in.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <OnboardingForm
              phone={phone}
              onSubmit={handleOnboardingComplete}
              onCancel={() => setViewState('phone-entry')}
            />
          </CardContent>
        </Card>
      </div>
    )
  }

  // Default: Phone Entry
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-slate-50">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
            <LogIn className="w-6 h-6 text-primary" />
          </div>
          <div>
            <CardTitle className="text-2xl">{session?.church?.name}</CardTitle>
            <CardDescription className="text-base mt-1">{session?.session_name}</CardDescription>
          </div>
          <div className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-muted text-xs font-medium">
            {session?.session_date} • {session?.session_time}
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePhoneSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Mobile Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="050 123 4567"
                className="text-lg h-12"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                autoFocus
              />
            </div>
            <Button type="submit" className="w-full h-12 text-lg" disabled={loading}>
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Check In"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default function QRScanPage() {
  return (
    <Suspense fallback={<div className="h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>}>
      <QRScanContent />
    </Suspense>
  )
}
