"use client"

import { useState, useEffect, Suspense, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { apiClient } from "@/lib/api-client"
import { useToast } from "@/hooks/use-toast"
import { CheckCircle2, Loader2, Phone, User as UserIcon } from "lucide-react"

export default function CheckInPage() {
    return (
        <Suspense fallback={<div className="container mx-auto py-8 px-4 text-center">Loading...</div>}>
            <CheckInContent />
        </Suspense>
    )
}

function CheckInContent() {
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [session, setSession] = useState<any>(null)
    const [phone, setPhone] = useState("")
    const [result, setResult] = useState<any>(null)
    const [user, setUser] = useState<any>(null)
    const [showSignUp, setShowSignUp] = useState(false)

    const [signUpData, setSignUpData] = useState({
        firstName: "",
        lastName: "",
        phone: "",
        email: "",
        preferredLanguage: "English",
        howDidYouHear: "",
    })

    const { toast } = useToast()
    const router = useRouter()
    const searchParams = useSearchParams()
    const phoneInputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        // 1. Get user from local storage
        const storedUser = JSON.parse(localStorage.getItem("user") || "null")
        setUser(storedUser)

        // 2. Load session
        loadSession(storedUser)
    }, [])

    const loadSession = async (currentUser: any) => {
        setLoading(true)
        try {
            const sessionId = searchParams.get("sessionId")
            let activeSession = null

            if (sessionId) {
                const response = await apiClient.getQRSessionPublicInfo(sessionId) as any
                activeSession = response.data
            } else {
                const response = await apiClient.getLatestActiveSession() as any
                activeSession = response.data
            }

            setSession(activeSession)

            // 3. If user is logged in, auto-mark attendance
            if (currentUser && activeSession) {
                handleCheckIn(activeSession.id, currentUser.phone || "", currentUser.email || "")
            } else {
                // Otherwise, focus on phone input after a short delay
                setTimeout(() => {
                    phoneInputRef.current?.focus()
                }, 500)
            }
        } catch (error: any) {
            console.error("Failed to load session", error)
            toast({
                title: "Session Error",
                description: "Could not find an active service session. Please try sharing the QR code again.",
                variant: "destructive",
            })
        } finally {
            setLoading(false)
        }
    }

    const handleCheckIn = async (sid: string, p: string, e?: string) => {
        setSubmitting(true)
        try {
            const response = await apiClient.scanQRCode({ qrCode: sid, phone: p, email: e }) as any
            setResult(response.data)

            if (response.data.type === "new_visitor") {
                setShowSignUp(true)
                setSignUpData((prev) => ({ ...prev, phone: p }))
            } else {
                toast({ title: "Welcome!", description: response.data.message })
            }
        } catch (err: any) {
            toast({
                title: "Error",
                description: err.message || "Failed to check in",
                variant: "destructive",
            })
        } finally {
            setSubmitting(false)
        }
    }

    const onPhoneSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!phone || phone.length < 8) {
            toast({ title: "Invalid Phone", description: "Please enter a valid phone number", variant: "destructive" })
            return
        }
        if (session) {
            handleCheckIn(session.id, phone)
        }
    }

    const handleSignUp = async () => {
        if (!signUpData.firstName || !signUpData.lastName || !signUpData.phone) {
            toast({ title: "Error", description: "Please fill in all required fields", variant: "destructive" })
            return
        }

        setSubmitting(true)
        try {
            const response = await apiClient.quickSignUp({
                qrCode: session.id,
                ...signUpData,
            }) as any

            toast({ title: "Welcome!", description: response.data.message })
            setResult(response.data)
            setShowSignUp(false)
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message || "Failed to sign up",
                variant: "destructive",
            })
        } finally {
            setSubmitting(false)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="text-center space-y-4">
                    <Loader2 className="w-12 h-12 animate-spin mx-auto text-primary" />
                    <p className="text-muted-foreground animate-pulse">Setting things up for you...</p>
                </div>
            </div>
        )
    }

    if (result && result.type !== "new_visitor") {
        return (
            <div className="min-h-screen flex items-center justify-center p-4 bg-background">
                <Card className="max-w-md w-full border-primary/20 bg-card/50 backdrop-blur-xl shadow-2xl shadow-primary/10">
                    <CardHeader className="text-center pb-2">
                        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-primary/20">
                            <CheckCircle2 className="w-10 h-10 text-primary animate-in zoom-in duration-500" />
                        </div>
                        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                            {result.type === "success" ? "Check-in Successful!" : "Welcome Back!"}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="text-center space-y-4">
                            <p className="text-lg font-medium text-foreground/90">{result.message}</p>

                            {result.member && (
                                <div className="p-4 bg-muted/50 rounded-2xl border border-border/50 text-left">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                            <UserIcon className="w-5 h-5 text-primary" />
                                        </div>
                                        <div>
                                            <p className="font-bold">{result.member.first_name} {result.member.last_name}</p>
                                            <p className="text-xs text-muted-foreground">{result.member.phone}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {result.session && (
                                <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10 text-left space-y-1">
                                    <p className="text-[10px] uppercase tracking-widest text-primary font-bold">Current Service</p>
                                    <p className="font-bold">{result.session.session_name}</p>
                                    <p className="text-sm text-muted-foreground">{result.session.church_name}</p>
                                </div>
                            )}
                        </div>
                        <Button onClick={() => router.push("/")} className="w-full h-12 text-lg font-semibold rounded-xl transition-all hover:scale-[1.02]">
                            Return Home
                        </Button>
                    </CardContent>
                </Card>
            </div>
        )
    }

    if (showSignUp) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4 bg-background">
                <Card className="max-w-md w-full border-border/50 bg-card/50 backdrop-blur-xl shadow-2xl">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold">Welcome!</CardTitle>
                        <CardDescription>Complete your registration to check in to {session?.sessionName}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="firstName">First Name *</Label>
                                <Input
                                    id="firstName"
                                    value={signUpData.firstName}
                                    onChange={(e) => setSignUpData({ ...signUpData, firstName: e.target.value })}
                                    placeholder="John"
                                    className="bg-background/50 h-12"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="lastName">Last Name *</Label>
                                <Input
                                    id="lastName"
                                    value={signUpData.lastName}
                                    onChange={(e) => setSignUpData({ ...signUpData, lastName: e.target.value })}
                                    placeholder="Doe"
                                    className="bg-background/50 h-12"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="phone">Phone Number *</Label>
                            <Input
                                id="phone"
                                type="tel"
                                value={signUpData.phone}
                                onChange={(e) => setSignUpData({ ...signUpData, phone: e.target.value })}
                                className="bg-background/50 h-12"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="language">Preferred Language</Label>
                            <select
                                id="language"
                                className="w-full h-12 p-3 bg-background/50 border border-input rounded-xl focus:ring-2 focus:ring-primary/20 transition-all"
                                value={signUpData.preferredLanguage}
                                onChange={(e) => setSignUpData({ ...signUpData, preferredLanguage: e.target.value })}
                            >
                                <option value="English">English</option>
                                <option value="Tamil">Tamil</option>
                                <option value="Malayalam">Malayalam</option>
                                <option value="Urdu">Urdu</option>
                            </select>
                        </div>

                        <Button onClick={handleSignUp} disabled={submitting} className="w-full h-12 text-lg font-semibold mt-4">
                            {submitting ? <Loader2 className="animate-spin" /> : "Complete Sign Up"}
                        </Button>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background relative overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl -z-10 -mr-64 -mt-64" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-3xl -z-10 -ml-64 -mb-64" />

            <Card className="max-w-md w-full border-primary/20 bg-card/50 backdrop-blur-2xl shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)]">
                <CardHeader className="text-center">
                    <CardTitle className="text-3xl font-extrabold tracking-tight">Check-In</CardTitle>
                    <CardDescription className="text-base">
                        {session ? (
                            <>We welcome you to <span className="text-primary font-bold">{session.sessionName}</span></>
                        ) : (
                            "Please enter your phone number to check in"
                        )}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={onPhoneSubmit} className="space-y-6">
                        <div className="space-y-3">
                            <Label htmlFor="phoneCheck" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                                Phone Number
                            </Label>
                            <div className="relative group">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
                                    <Phone className="w-5 h-5" />
                                </div>
                                <Input
                                    id="phoneCheck"
                                    ref={phoneInputRef}
                                    type="tel"
                                    placeholder="+971 -- --- ----"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    className="h-14 pl-12 bg-background/50 border-border group-hover:border-primary/50 focus:border-primary focus:ring-4 focus:ring-primary/10 rounded-2xl text-lg transition-all"
                                    required
                                />
                            </div>
                        </div>

                        <Button
                            type="submit"
                            disabled={submitting || !session}
                            className="w-full h-14 text-lg font-bold rounded-2xl shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all hover:scale-[1.01] active:scale-[0.98]"
                        >
                            {submitting ? (
                                <div className="flex items-center gap-2">
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    <span>Verifying...</span>
                                </div>
                            ) : (
                                "Confirm Attendance"
                            )}
                        </Button>

                        {!session && !loading && (
                            <p className="text-center text-xs text-red-400 font-medium">
                                No active session found. Please scan a valid QR code.
                            </p>
                        )}
                    </form>
                </CardContent>
            </Card>

            <p className="mt-8 text-sm text-muted-foreground">
                Lighthouse Revival Church International
            </p>
        </div>
    )
}
