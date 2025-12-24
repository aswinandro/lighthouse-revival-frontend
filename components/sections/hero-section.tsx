"use client"

import { useRef, useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/components/providers/language-provider"
import { ArrowDown, Play } from "lucide-react"
import { motion } from "framer-motion"

// Google Fonts
import { Syne, Baloo_Thambi_2, Hind, Noto_Serif_Malayalam, Noto_Nastaliq_Urdu } from "next/font/google"

// Font instances
const syne = Syne({ subsets: ["latin"], weight: ["400", "600", "700"], display: "swap" })
const balooThambi2 = Baloo_Thambi_2({ subsets: ["tamil"], weight: ["400", "700"], display: "swap" })
const hind = Hind({ subsets: ["latin", "devanagari"], weight: ["400", "600", "700"], display: "swap" })
const notoMalayalam = Noto_Serif_Malayalam({ subsets: ["malayalam"], weight: ["400", "600", "700"], display: "swap" })
const notoUrdu = Noto_Nastaliq_Urdu({ subsets: ["arabic"], weight: ["400", "700"], display: "swap" })

// Helper to pick correct font by language
const getFontClass = (lang: string) => {
  switch (lang) {
    case "ta": // Tamil
      return balooThambi2.className
    case "hi": // Hindi
      return hind.className
    case "ml": // Malayalam
      return notoMalayalam.className
    case "ur": // Urdu
      return notoUrdu.className
    default: // English
      return syne.className
  }
}

export function HeroSection() {
  const { t, isRTL, language } = useLanguage()
  const heroRef = useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <section
      id="home"
      ref={heroRef}
      className="hero-section relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className="absolute z-0 w-auto min-w-full min-h-full max-w-none object-cover scale-105 animate-slow-zoom"
        poster="/poster.jpg"
      >
        <source src="/bg.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent z-10" />

      {/* Content */}
      <div className="relative z-20 container mx-auto px-4 text-center">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.3 } },
          }}
          className="max-w-4xl mx-auto space-y-8"
        >
          <motion.h1
            variants={{
              hidden: { opacity: 0, y: 40 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 1, ease: "easeOut" }}
            className={`${getFontClass(language)} text-4xl md:text-6xl lg:text-7xl font-extrabold leading-tight tracking-tighter`}
          >
            <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-gradient-x">
              {t("hero.title")}
            </span>
          </motion.h1>

          <motion.p
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 1, delay: 0.4 }}
            className={`${getFontClass(language)} text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed`}
          >
            {t("hero.subtitle")}
          </motion.p>

          <motion.div
            variants={{
              hidden: { opacity: 0, scale: 0.95 },
              visible: { opacity: 1, scale: 1 },
            }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Button
              asChild
              size="lg"
              className="px-8 py-3 text-lg relative overflow-hidden group hover:scale-105 transition-transform"
            >
              <Link href="/check-in">
                <span className="relative z-10 flex items-center">
                  Join Our Service
                  <ArrowDown className="ml-2 w-5 h-5 animate-bounce" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              size="lg"
              className="px-8 py-3 text-lg bg-background/50 backdrop-blur-md border-primary/40 hover:scale-105 transition-transform relative group"
            >
              <Link href="/livetv">
                <Play className="mr-2 w-5 h-5 group-hover:rotate-90 transition-transform" />
                Watch Online
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
