"use client"

import { useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useLanguage } from "@/components/providers/language-provider"
import { useGSAP } from "@/hooks/use-gsap"
import { CHURCH_INFO } from "@/lib/constants"
import { Clock, MapPin, Phone, MessageCircle, ExternalLink } from "lucide-react"
import { useState } from "react"
import localFont from "next/font/local"

// Google Fonts (self-hosted or via next/font/google)
import { Baloo_Thambi_2, Hind, Noto_Serif_Malayalam, Noto_Nastaliq_Urdu } from "next/font/google"

const tamilFont = Baloo_Thambi_2({ subsets: ["tamil"], weight: ["400", "700"] })
const hindiFont = Hind({ subsets: ["latin"], weight: ["400", "700"] })
const malayalamFont = Noto_Serif_Malayalam({ subsets: ["malayalam"], weight: ["400", "700"] })
const urduFont = Noto_Nastaliq_Urdu({ subsets: ["arabic"], weight: ["400", "700"] })

export function ServicesSection() {
  const { t, isRTL } = useLanguage()
  const sectionRef = useRef<HTMLDivElement>(null)
  const { staggerAnimation } = useGSAP()
  const [openService, setOpenService] = useState<null | string>(null)

  useEffect(() => {
    if (sectionRef.current) {
      staggerAnimation(".service-block", { delay: 0.1 })
    }
  }, [staggerAnimation])

  const services = [
    {
      key: "english",
      label: "English Service",
      font: "",
      timeKey: "services.time.english",
      contact: "+971501234567",
      
    },
    {
      key: "tamil",
      label: "தமிழ் ஆராதனை",
      font: tamilFont.className,
      timeKey: "services.time.tamil",
      contact: "+971509876543",
    },
    {
      key: "hindi",
      label: "हिंदी आराधना",
      font: hindiFont.className,
      timeKey: "services.time.hindi",
      contact: "+971523456789",
    },
    {
      key: "malayalam",
      label: "മലയാളം ആരാധന",
      font: malayalamFont.className,
      timeKey: "services.time.malayalam",
      contact: "+971502468135",
    },
    {
      key: "urdu",
      label: "اردو عبادت",
      font: urduFont.className,
      timeKey: "services.time.urdu",
      contact: "+971507654321",
    },
  ]

  const handleOpen = (key: string) => setOpenService(key)
  const handleClose = () => setOpenService(null)

  return (
    <section
      id="services"
      ref={sectionRef}
      className="animate-section py-20 bg-gradient-to-b from-background to-muted/30"
    >
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Services</h2>
          <p className="text-base md:text-lg text-muted-foreground leading-relaxed tracking-wide">
            Join us in worship across languages — each service uniquely expresses faith and culture, yet united in one Spirit.
          </p>
        </div>

        {/* Services Row */}
        <div className="flex flex-wrap justify-center gap-6">
          {services.map((service) => {
            const serviceInfo = CHURCH_INFO.services[service.key as keyof typeof CHURCH_INFO.services]
            const isOpen = openService === service.key

            return (
              <div
                key={service.key}
                onClick={() => handleOpen(service.key)}
                className={`service-block cursor-pointer px-6 py-4 rounded-xl bg-white/70 dark:bg-black/40 backdrop-blur-md border border-border/30 shadow-sm hover:shadow-md transition-transform hover:-translate-y-1 hover:bg-primary/10 text-center w-[220px]`}
              >
                <h3 className={`text-lg font-semibold mb-2 ${service.font}`}>
                  {service.label}
                </h3>
                <div className="flex justify-center items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span>{t(service.timeKey)}</span>
                </div>
                <div className="mt-2 text-xs text-primary font-medium">
                  Every {serviceInfo.day}
                </div>
              </div>
            )
          })}
        </div>

        {/* Modals */}
        {services.map((service) => {
          const serviceInfo = CHURCH_INFO.services[service.key as keyof typeof CHURCH_INFO.services]
          const isOpen = openService === service.key

          return (
            isOpen && (
              <Dialog key={service.key} open={isOpen} onOpenChange={handleClose}>
                <DialogContent className="sm:max-w-md rounded-2xl p-6">
                  <DialogHeader>
                    <DialogTitle className={`text-xl font-bold ${service.font}`}>
                      {service.label}
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 mt-4">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span>{t(service.timeKey)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      <span>{serviceInfo.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Phone className="w-4 h-4" />
                      <span>{service.contact}</span>
                    </div>

                    {/* Actions */}
                    <div className="grid grid-cols-2 gap-3 pt-3">
                      <Button
                        className="w-full"
                        onClick={() => (window.location.href = `tel:${service.contact}`)}
                      >
                        <Phone className="w-4 h-4 mr-1" /> Call
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() =>
                          window.open(`https://wa.me/${service.contact.replace(/\D/g, "")}`, "_blank")
                        }
                      >
                        <MessageCircle className="w-4 h-4 mr-1" /> WhatsApp
                      </Button>
                      <Button
                        variant="outline"
                        className="col-span-2"
                        onClick={() =>
                          window.open(
                            `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                              serviceInfo.location
                            )}`,
                            "_blank"
                          )
                        }
                      >
                        <ExternalLink className="w-4 h-4 mr-1" /> Open in Maps
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            )
          )
        })}
      </div>
    </section>
  )
}
