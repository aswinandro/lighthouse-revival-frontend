"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { LanguageSelector } from "@/components/ui/language-selector"
import { useLanguage } from "@/components/providers/language-provider"
import { Menu, X, Church } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const { t, isRTL } = useLanguage()

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navItems = [
    { key: "nav.home", href: "/" },
    { key: "nav.about", href: "/about" },
    { key: "nav.donate", href: "/welfare" },
    { key: "nav.services", href: "/#services" },
    { key: "nav.events", href: "/#events" },
    { key: "nav.contact", href: "/request" },
    { key: "nav.livetv", href: "/livetv" },
  ]

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out",
        isScrolled
          ? "bg-background/70 backdrop-blur-lg border-b border-border/50 shadow-sm"
          : "bg-transparent",
        isRTL && "rtl:text-right"
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            {/* <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center shadow-md transition-transform group-hover:scale-105">
              <Church className="w-5 h-5 text-primary-foreground" />
            </div> */}
            <div className="font-bold text-base sm:text-lg tracking-tight text-foreground">
              <span className="hidden lg:inline">Lighthouse Revival</span>
              <span className="inline lg:hidden">Lighthouse</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                className="relative text-sm font-medium text-muted-foreground hover:text-primary transition-colors group"
              >
                {t(item.key)}
                <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-primary transition-all group-hover:w-full"></span>
              </Link>
            ))}
          </div>

          {/* Language Selector & Mobile Menu */}
          <div className="flex items-center gap-2">
            <LanguageSelector />
            <div className="hidden sm:flex">
              <Button asChild variant="ghost" className="hover:bg-primary/10">
                <Link href="/login">{t("nav.signin")}</Link>
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation with animation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="md:hidden bg-background/95 backdrop-blur-xl border-t border-border/50 rounded-b-xl shadow-lg overflow-hidden"
            >
              <div className="px-4 pt-4 pb-6 space-y-2">
                {navItems.map((item) => (
                  <Link
                    key={item.key}
                    href={item.href}
                    className="block px-3 py-2 rounded-lg text-base font-medium text-foreground hover:text-primary hover:bg-muted/50 transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    {t(item.key)}
                  </Link>
                ))}
                <div className="pt-4 border-t border-border/50">
                  <Button asChild className="w-full rounded-lg shadow-md">
                    <Link href="/login">{t("nav.signin")}</Link>
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  )
}
