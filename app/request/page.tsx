"use client"

import Image from "next/image"
import { useState } from "react"
import { motion } from "framer-motion"
import { useToast } from "@/hooks/use-toast"
import { Label } from "@/components/ui/label" // Assuming you have this component

// Data for church contacts
const churchContacts = [
  {
    name: "Aneesha Munni",
    language: "Hindi",
    mobile: "+971543655672",
  },
   {
    name: "Ashwin Kirupa",
    language: "Tamil",
    mobile: "+971566434774", // Ensure numbers are in international format for WhatsApp
  },
  {
    name: "Shemi Mahfouz Khan",
    language: "English",
    mobile: "+971553262556",
  },
  {
    name: "Gloria Ranjith",
    language: "Malayalam",
    mobile: "+971543791303",
  },
  {
    name: "General Contact", // For a general or "Other" option
    language: "Other",
    mobile: "+971524514800", // Using a general contact number
  },
]
export default function PrayerRequestPage() {
  const { toast } = useToast()
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  })
  const [loading, setLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false) // New state to track successful submission
  const [selectedLanguage, setSelectedLanguage] = useState("")
  const [selectedChurchInfo, setSelectedChurchInfo] = useState<
    (typeof churchContacts)[0] | null
  >(null)

  // Update form state
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  // Send to Google Sheets via Next.js API
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setIsSubmitted(false) // Reset submission status on new attempt
    try {
      const res = await fetch("/api/prayer-front", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })

      if (res.ok) {
        console.log("API call successful, attempting to show toast."); // Debugging: Check if this logs
        toast({
          title: "🙏 Prayer Sent",
          description: "Your prayer request has been saved successfully. We will be praying for you!",
          variant: "success", // Added success variant
        })
        setForm({ name: "", email: "", phone: "", message: "" })
        setIsSubmitted(true) // Set to true on successful submission
      } else {
        toast({
          title: "❌ Error",
          description: "Something went wrong. Please try again.",
          variant: "destructive",
        })
      }
      // No need to set isSubmitted to false here, as it's already reset at the start
    } catch (error) {
      toast({
        title: "⚠️ Network Error",
        description: "Unable to submit request. Check your connection.",
        variant: "destructive",
      })
      setIsSubmitted(false) // Ensure it's false on network error
    } finally {
      setLoading(false)
    }
  }

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const lang = e.target.value
    setSelectedLanguage(lang)
    const church = churchContacts.find((c) => c.language === lang)
    setSelectedChurchInfo(church || null)
  }

  // Send via WhatsApp
  const handleWhatsApp = () => {
    if (!form.name || !form.email || !form.phone || !form.message) {
      toast({
        title: "📝 All fields are required",
        description: "Please fill out all fields to send your prayer request via WhatsApp.",
        variant: "destructive",
      })
      return
    }
    if (!selectedChurchInfo?.mobile) {
      toast({
        title: "⚠️ Select a Contact",
        description: "Please select a church leader to send your prayer request via WhatsApp.",
        variant: "destructive",
      })
      return
    }
    const message = `🙏 Prayer Request - From Web\n\nName: ${form.name}\nEmail: ${form.email}\nPhone: ${form.phone}\n\nMessage:\n${form.message}`
    const url = `https://wa.me/${selectedChurchInfo}?text=${encodeURIComponent(message)}`
    window.open(url, "_blank")
    const cleanMobile = selectedChurchInfo.mobile.replace(/\D/g, "") // Remove non-digits
    window.open(`https://wa.me/${cleanMobile}?text=${encodeURIComponent(message)}`, "_blank")
  }

  return (
    <div className="bg-background text-foreground">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <main className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12 md:mb-20"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tighter mb-4">
              <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                Prayer Request
              </span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
              At Lighthouse Revival Church, we believe in the power of prayer to heal, restore, and
              transform lives. Whatever burden you carry, you don’t have to carry it alone. Share
              your request and allow us to join our faith with yours.
            </p>
          </motion.div>

          {/* Content */}
          <div className="grid md:grid-cols-5 gap-12 lg:gap-16 items-start">
            {/* Image */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="md:col-span-2"
            >
              <div className="relative w-full aspect-[3/4] max-w-sm mx-auto md:max-w-none overflow-hidden rounded-2xl shadow-lg">
                <Image
                  src="/prayer.jpg"
                  alt="Prayer"
                  fill
                  className="object-cover scale-105 hover:scale-110 transition-transform duration-700"
                  sizes="(max-width: 768px) 90vw, 40vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
              </div>
            </motion.div>

            {/* Form */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="md:col-span-3"
            >
              <div className="bg-muted/30 backdrop-blur-md p-8 rounded-2xl shadow-xl border border-border">
                <h3 className="text-2xl font-bold mb-6 text-foreground">
                  Share Your Prayer Request
                </h3>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
                  <input
                    type="text"
                    name="name"
                    placeholder="Your Name"
                    value={form.name}
                    onChange={handleChange}
                    className="p-3 rounded-lg border border-border bg-background"
                    required
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder="Your Email"
                    value={form.email}
                    onChange={handleChange}
                    className="p-3 rounded-lg border border-border bg-background"
                    required
                  />
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Your Phone"
                    value={form.phone}
                    onChange={handleChange}
                    className="p-3 rounded-lg border border-border bg-background"
                    required
                  />
                  <textarea
                    name="message"
                    placeholder="Write your prayer request..."
                    value={form.message}
                    onChange={handleChange}
                    className="p-3 rounded-lg border border-border bg-background h-32 resize-none"
                    required
                  />

                  {/* Dropdown for Church Leader Selection */}
                  <div className="grid gap-2">
                    <Label htmlFor="church-language" className="text-sm font-medium text-foreground">
                      Send to Church Leader
                    </Label>
                    <select
                      id="church-language"
                      value={selectedLanguage}
                      onChange={handleLanguageChange}
                      className="p-3 rounded-lg border border-border bg-background text-foreground"
                    >
                      <option value="">Select Church</option>
                      {churchContacts.map((contact) => (
                        <option key={contact.language} value={contact.language}>
                          {contact.language} ({contact.name})
                        </option>
                      ))}
                    </select>
                  </div>

                  {selectedChurchInfo && (
                    <div className="grid gap-2 p-3 rounded-lg border border-border bg-background">
                      <p className="text-sm text-muted-foreground">
                        Selected Contact:
                      </p>
                      <p className="font-medium text-foreground">
                        {selectedChurchInfo.name}
                      </p>
                      <p className="text-sm text-muted-foreground">Mobile:</p>
                      <p className="font-medium text-foreground">
                        {selectedChurchInfo.mobile}
                      </p>
                    </div>
                  )}

                  {/* Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 mt-4">
                    <button
                      type="submit"
                      disabled={loading || isSubmitted} // Disable if loading or already submitted
                      className="flex-1 py-3 px-6 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition"
                    >
                      {loading ? "Sending..." : (isSubmitted ? "Successfully Sent!" : "Send Request")}
                    </button>
                    <button
                      type="button"
                      disabled={!selectedChurchInfo} // Disable if no leader is selected
                      onClick={handleWhatsApp}
                      className="flex-1 py-3 px-6 rounded-xl bg-green-600 text-white hover:bg-green-700 transition"
                    >
                      Send via WhatsApp
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>

          {/* About Church Section */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="mt-24 text-center max-w-4xl mx-auto space-y-6"
          >
            {/* <h2 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              About Lighthouse Revival Church
            </h2> */}
            {/* <p className="text-lg text-muted-foreground leading-relaxed">
              Lighthouse Revival Church is a place of hope, healing, and restoration. Since its
              humble beginnings in 2006, the church has grown into a vibrant community where people
              of all ages and backgrounds gather to worship, serve, and grow in faith. Under the
              leadership of Pastor Manoj, the church continues to shine as a testimony of God’s
              faithfulness and love across nations.
            </p> */}
          </motion.div>

          {/* Footer */}
          <div className="mt-16 pt-8 border-t border-border text-center text-sm text-muted-foreground">
            <p>
              © {new Date().getFullYear()} Lighthouse Revival Church Ministries. All Rights
              Reserved.
            </p>
          </div>
        </main>
      </div>
    </div>
  )
}
