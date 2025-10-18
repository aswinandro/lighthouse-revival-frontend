"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { apiClient } from "@/lib/api-client"
import { useToast } from "@/hooks/use-toast"

export default function QRScanPage() {
  const [qrCode, setQrCode] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
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

  const handleScan = async () => {
    if (!qrCode) {
      toast({
        title: "Error",
        description: "Please enter QR code data",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      const response = await apiClient.scanQRCode({ qrCode, phone, email }) as any;
      setResult(response.data)

      if (response.data.type === "new_visitor") {
        setShowSignUp(true)
        setSignUpData((prev) => ({ ...prev, phone, email }))
      } else {
        toast({
          title: "Success",
          description: response.data.message,
        })
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to scan QR code",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSignUp = async () => {
    if (!signUpData.firstName || !signUpData.lastName || !signUpData.phone) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      const response = await apiClient.quickSignUp({
        qrCode,
        newcomerData: signUpData,
      }) as any;

      toast({
        title: "Welcome!",
        description: response.data.message,
      })

      setResult(response.data)
      setShowSignUp(false)
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to sign up",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (result && result.type !== "new_visitor") {
    return (
      <div className="container mx-auto py-8 px-4">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl text-center">
              {result.type === "success" ? "✅ Check-in Successful!" : "👋 Welcome Back!"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center space-y-2">
              <p className="text-lg font-medium">{result.message}</p>
              {result.member && (
                <div className="mt-4 p-4 bg-muted rounded-lg">
                  <p className="font-semibold">
                    {result.member.first_name} {result.member.last_name}
                  </p>
                  <p className="text-sm text-muted-foreground">{result.member.email}</p>
                  <p className="text-sm text-muted-foreground">{result.member.phone}</p>
                </div>
              )}
              {result.session && (
                <div className="mt-4 p-4 bg-primary/10 rounded-lg">
                  <p className="font-semibold">{result.session.session_name}</p>
                  <p className="text-sm">{result.session.church_name}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(result.session.session_date).toLocaleDateString()} at {result.session.session_time}
                  </p>
                </div>
              )}
            </div>
            <Button onClick={() => router.push("/")} className="w-full">
              Return to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (showSignUp) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Welcome! Please Sign Up</CardTitle>
            <CardDescription>Complete your registration to check in</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {result?.session && (
              <div className="p-4 bg-primary/10 rounded-lg mb-4">
                <p className="font-semibold">{result.session.session_name}</p>
                <p className="text-sm">{result.session.church_name}</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  value={signUpData.firstName}
                  onChange={(e) => setSignUpData({ ...signUpData, firstName: e.target.value })}
                  placeholder="John"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  value={signUpData.lastName}
                  onChange={(e) => setSignUpData({ ...signUpData, lastName: e.target.value })}
                  placeholder="Doe"
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
                placeholder="+971 50 123 4567"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email (Optional)</Label>
              <Input
                id="email"
                type="email"
                value={signUpData.email}
                onChange={(e) => setSignUpData({ ...signUpData, email: e.target.value })}
                placeholder="john@example.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="language">Preferred Language</Label>
              <select
                id="language"
                className="w-full p-2 border rounded-md"
                value={signUpData.preferredLanguage}
                onChange={(e) => setSignUpData({ ...signUpData, preferredLanguage: e.target.value })}
              >
                <option value="English">English</option>
                <option value="Tamil">Tamil</option>
                <option value="Malayalam">Malayalam</option>
                <option value="Urdu">Urdu</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="howDidYouHear">How did you hear about us?</Label>
              <Input
                id="howDidYouHear"
                value={signUpData.howDidYouHear}
                onChange={(e) => setSignUpData({ ...signUpData, howDidYouHear: e.target.value })}
                placeholder="Friend, Social Media, etc."
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={handleSignUp} disabled={loading} className="flex-1">
                {loading ? "Signing Up..." : "Complete Sign Up"}
              </Button>
              <Button variant="outline" onClick={() => setShowSignUp(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>QR Code Check-In</CardTitle>
          <CardDescription>Scan the QR code to mark your attendance</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="qrCode">QR Code Data *</Label>
            <Input
              id="qrCode"
              value={qrCode}
              onChange={(e) => setQrCode(e.target.value)}
              placeholder="Paste QR code data here"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number (Optional)</Label>
            <Input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+971 50 123 4567"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email (Optional)</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
            />
          </div>

          <Button onClick={handleScan} disabled={loading} className="w-full">
            {loading ? "Scanning..." : "Check In"}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
