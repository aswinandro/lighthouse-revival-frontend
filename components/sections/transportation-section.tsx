"use client"

import { useEffect, useRef, useState } from "react"
import { useLanguage } from "@/components/providers/language-provider"
import { useGSAP } from "@/hooks/use-gsap"
import { gsap } from "gsap"
import { MotionPathPlugin } from "gsap/MotionPathPlugin"
import { CHURCH_INFO } from "@/lib/constants"

gsap.registerPlugin(MotionPathPlugin)

type Pt = {
  x: number
  y: number
  lx: number
  ly: number
  w: number
  label: string
}

export function TransportationSection() {
  const { t, isRTL } = useLanguage()
  const sectionRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const pathRef = useRef<SVGPathElement>(null)
  const busRef = useRef<SVGGElement>(null)
  const { fadeIn } = useGSAP()

  const [points, setPoints] = useState<Pt[]>([])

  const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v))

  const placePoints = () => {
    if (!pathRef.current) return
    const path = pathRef.current
    const length = path.getTotalLength()
    const locs = CHURCH_INFO.transportation.locations
    const n = locs.length
    const isSmall = typeof window !== "undefined" && window.innerWidth < 640
    const labelOffset = isSmall ? 22 : 30

    const nextPoints: Pt[] = locs.map((label, idx) => {
      const ratio = (idx + 1) / (n + 1)
      const L = ratio * length

      const p = path.getPointAtLength(L)
      const pPrev = path.getPointAtLength(Math.max(0, L - 1))
      const pNext = path.getPointAtLength(Math.min(length, L + 1))

      const dx = pNext.x - pPrev.x
      const dy = pNext.y - pPrev.y
      const angle = Math.atan2(dy, dx)

      const nx = -Math.sin(angle)
      const ny = Math.cos(angle)
      const sign = idx % 2 === 0 ? 1 : -1

      const lx = clamp(p.x + nx * labelOffset * sign, 40, 960)
      const ly = clamp(p.y + ny * labelOffset * sign, 30, 190)
      const approxWidth = clamp(70 + label.length * 6, 72, 180)

      return { x: p.x, y: p.y, lx, ly, w: approxWidth, label }
    })

    setPoints(nextPoints)
  }

  const initBus = () => {
    if (!busRef.current || !pathRef.current) return
    gsap.killTweensOf(busRef.current)

    gsap.to(busRef.current, {
      duration: 12,
      repeat: -1,
      yoyo: true,
      ease: "power1.inOut",
      motionPath: {
        path: pathRef.current,
        align: pathRef.current,
        autoRotate: true,
        alignOrigin: [0.5, 0.5],
      },
    })
  }

  useEffect(() => {
    fadeIn(".transport-title", { delay: 0.2 })
  }, [fadeIn])

  useEffect(() => {
    placePoints()
    initBus()

    let ticking = false
    const onResize = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        placePoints()
        initBus()
        ticking = false
      })
    }

    window.addEventListener("resize", onResize)
    return () => window.removeEventListener("resize", onResize)
  }, [])

  return (
    <section ref={sectionRef} className="py-16 md:py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10 md:mb-12">
          <h2
            className={`transport-title text-3xl md:text-4xl font-bold mb-3 ${
              isRTL ? "rtl:text-right" : ""
            }`}
          >
            {t("transportation.title")}
          </h2>
          <p
            className={`text-base md:text-lg text-muted-foreground max-w-2xl mx-auto ${
              isRTL ? "rtl:text-right" : ""
            }`}
          >
            {t("transportation.subtitle")}
          </p>
        </div>

        {/* Map */}
        <div className="relative w-full h-[320px] sm:h-[360px] md:h-[420px] rounded-2xl overflow-hidden shadow-inner bg-gradient-to-br from-primary/10 via-background to-accent/10">
          <svg
            ref={svgRef}
            viewBox="0 0 1000 220"
            className="absolute inset-0 w-full h-full"
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              <linearGradient id="roadGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#0ea5e9" />
                <stop offset="100%" stopColor="#9333ea" />
              </linearGradient>

              <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Realistic Road: main road + dashed lane divider */}
            <path
              ref={pathRef}
              d="M 40 150 Q 250 40, 500 150 T 960 150"
              stroke="#222"
              strokeWidth="14"
              fill="none"
              strokeLinecap="round"
              opacity="0.7"
            />
            <path
              d="M 40 150 Q 250 40, 500 150 T 960 150"
              stroke="url(#roadGradient)"
              strokeWidth="4"
              fill="none"
              strokeDasharray="16 12"
              filter="url(#glow)"
              opacity="0.95"
            />

            {/* Realistic Points: add pin icon and glow */}
            <g>
              {points.map((p, idx) => (
                <g
                  key={`${p.label}-${idx}`}
                  className="cursor-pointer select-none"
                  onClick={() => {
                    const q = encodeURIComponent(p.label)
                    window.open(
                      `https://www.google.com/maps/search/?api=1&query=${q}`,
                      "_blank"
                    )
                  }}
                >
                  {/* Pin shadow */}
                  <ellipse cx={p.x} cy={p.y + 10} rx="7" ry="3" fill="rgba(0,0,0,0.18)" />
                  {/* Pin icon */}
                  <g>
                    <circle cx={p.x} cy={p.y} r="7" fill="#fff" stroke="var(--primary)" strokeWidth="2" filter="url(#glow)" />
                    <circle cx={p.x} cy={p.y} r="3" fill="var(--primary)" />
                  </g>
                  {/* Label connector */}
                  <line x1={p.x} y1={p.y} x2={p.lx} y2={p.ly} stroke="var(--primary)" strokeOpacity="0.45" strokeWidth="2" />
                  {/* Label box */}
                  <g transform={`translate(${p.lx}, ${p.ly})`}>
                    <rect
                      x={-p.w / 2}
                      y={-14}
                      rx="8"
                      ry="8"
                      width={p.w}
                      height="28"
                      fill="rgba(30,30,30,0.92)"
                      stroke="var(--primary)"
                      strokeOpacity="0.2"
                      filter="url(#glow)"
                    />
                    <text
                      textAnchor="middle"
                      alignmentBaseline="middle"
                      fontSize="13"
                      fill="#fff"
                      fontWeight="bold"
                    >
                      {p.label}
                    </text>
                  </g>
                </g>
              ))}
            </g>

            {/* Realistic Bus: shadow, wheels, body */}
            <g ref={busRef} className="drop-shadow">
              <ellipse cx="0" cy="18" rx="14" ry="5" fill="rgba(0,0,0,0.18)" />
              <g transform="scale(1)">
                {/* Bus body */}
                <rect x="-10" y="0" width="40" height="18" rx="7" fill="#ffe066" stroke="#222" strokeWidth="2" />
                {/* Windows */}
                <rect x="-6" y="4" width="10" height="7" rx="2" fill="#fff" />
                <rect x="6" y="4" width="10" height="7" rx="2" fill="#fff" />
                {/* Door */}
                <rect x="18" y="4" width="6" height="10" rx="1.5" fill="#fff" />
                {/* Wheels */}
                <circle cx="2" cy="18" r="3" fill="#222" />
                <circle cx="28" cy="18" r="3" fill="#222" />
                {/* Headlights */}
                <circle cx="-8" cy="8" r="1.5" fill="#ffd700" />
                <circle cx="30" cy="8" r="1.5" fill="#ffd700" />
              </g>
            </g>
          </svg>

          <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-border/20" />
        </div>
      </div>
    </section>
  )
}
