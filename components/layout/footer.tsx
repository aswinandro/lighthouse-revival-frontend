"use client"

import { useLanguage } from "@/components/providers/language-provider"
import { CHURCH_INFO } from "@/lib/constants"
import { Church, Mail, Phone, MapPin, Youtube, Facebook, Instagram } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"

export function Footer() {
  const { t } = useLanguage()



  const socialLinks = [
    { icon: Youtube, href: "https://www.youtube.com/c/LIGHTHOUSEREVIVALCHURCH", label: "YouTube" },
    { icon: Facebook, href: "https://www.facebook.com/lighthouserevivalabudhabi", label: "Facebook" },
    { icon: Instagram, href: "https://www.instagram.com/lighthouserevivalchurch", label: "Instagram" },
  ]

  return (
    <footer id="contact" className="bg-muted/50 border-t border-border">
      <div className="container mx-auto px-4 py-10">
        <div className="flex flex-wrap gap-8 justify-between">
          {/* Church Info */}
          <div className="w-full sm:w-[45%] lg:w-[22%] space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <Church className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-lg">Lighthouse Revival</span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Multi-lingual church serving the diverse community of Abu Dhabi since 2006.
            </p>
            <div className="flex gap-2">
              {socialLinks.map((social) => {
                const IconComponent = social.icon
                return (
                  <Button
                    key={social.label}
                    asChild
                    variant="outline"
                    size="icon"
                    className="rounded-full h-8 w-8 bg-transparent hover:bg-primary/10 hover:text-primary"
                  >
                    <a href={social.href} aria-label={social.label}>
                      <IconComponent className="w-4 h-4" />
                    </a>
                  </Button>
                )
              })}
            </div>
          </div>

          {/* ✅ Menu & Get in Touch side by side on mobile */}
          <div className="flex w-full sm:w-[45%] lg:w-[44%] gap-6">
            {/* Quick Links */}
            <div className="w-1/2">
              <h3 className="font-semibold text-base mb-3">Menu</h3>
              <div className="space-y-1">
                {[
                  { key: "nav.home", href: "#home" },
                  { key: "nav.about", href: "/about" },
                  { key: "nav.services", href: "#services" },
                  { key: "nav.events", href: "#events" },
                ].map((link) => (
                  <a
                    key={link.key}
                    href={link.href}
                    className="block text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {t(link.key)}
                  </a>
                ))}
              </div>
            </div>

            {/* Contact Info */}
            <div className="w-1/2">
              <h3 className="font-semibold text-base mb-3">Get in Touch</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Abu Dhabi, UAE</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{CHURCH_INFO.contact.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{CHURCH_INFO.contact.phone}</span>
                </div>
              </div>

              <Link href="/request" passHref>
                <Button className="w-full mt-3 h-9 text-sm rounded-lg">
                  Need Prayer?
                </Button>
              </Link>
            </div>
          </div>

          {/* Service Times */}
          <div className="w-full sm:w-[45%] lg:w-[22%]">
            <h3 className="font-semibold text-base mb-3">Services</h3>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">English</span>
                <span>{t("services.time.english")}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tamil</span>
                <span>{t("services.time.tamil")}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Hindi</span>
                <span>{t("services.time.hindi")}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Malayalam</span>
                <span>{t("services.time.malayalam")}</span>
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} Lighthouse Revival Church Ministries. All Rights Reserved.</p>
          <div className="flex gap-3">
            <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
