"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { useState } from "react"
import { PhoneInput } from "@/components/ui/phone-input"

const welfareText = [
  "We are delighted to extend a warm welcome to you as you join us in our mission to support and uplift members of our community through our church welfare program.",
  "At Lighthouse Revival Church International, we believe in the power of compassion, kindness, and solidarity to make a meaningful difference in the lives of those in need.",
  "Our welfare program is more than just a service; it's a reflection of our commitment to serving others with love and empathy.",
  "Whether you're facing financial challenges, health struggles, emotional difficulties, or simply in need of a helping hand, know that you are not alone. Our church family is here to walk alongside you, offering support, encouragement, and practical assistance every step of the way.",
]

export default function WelfarePageClient() {
  const [phone, setPhone] = useState("")
  const [whatsapp, setWhatsapp] = useState("")

  return (
    <div className="bg-background text-foreground">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <main className="max-w-7xl mx-auto">
          {/* Page Header */}
          <motion.div
            className="text-center mb-12 md:mb-20"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tighter mb-4">
              <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                Church Welfare
              </span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
              Extending love, compassion, and practical help to our community.
            </p>
          </motion.div>

          {/* Content Grid */}
          <div className="grid md:grid-cols-5 gap-12 lg:gap-16 items-start">
            {/* Image */}
            <motion.div
              className="md:col-span-2"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7 }}
            >
              <div className="relative group w-full aspect-[3/4] max-w-sm mx-auto md:max-w-none overflow-hidden rounded-2xl shadow-lg">
                <Image
                  src="/poster.jpg"
                  alt="Church Welfare"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 90vw, 40vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-transparent" />
              </div>
            </motion.div>

            {/* Text + Form */}
            <motion.div
              className="md:col-span-3 space-y-6 text-lg text-muted-foreground leading-relaxed"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              {welfareText.map((p, i) => (
                <p key={i}>{p}</p>
              ))}

              {/* Form */}
              <motion.div
                className="mt-10 bg-muted/30 backdrop-blur-sm p-6 rounded-2xl shadow-lg"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.3 }}
              >
                <h3 className="text-2xl font-bold mb-4 text-foreground">Become a Part of Our Family</h3>
                <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input type="text" placeholder="First Name" className="p-3 rounded-lg border border-border bg-background" />
                  <input type="text" placeholder="Last Name" className="p-3 rounded-lg border border-border bg-background" />
                  <input type="email" placeholder="Email" className="p-3 rounded-lg border border-border bg-background" />
                  <PhoneInput
                    value={phone}
                    onChange={setPhone}
                    placeholder="Phone Number"
                  />
                  <input type="text" placeholder="Welfare" className="p-3 rounded-lg border border-border bg-background md:col-span-2" />
                  <PhoneInput
                    value={whatsapp}
                    onChange={setWhatsapp}
                    placeholder="WhatsApp Number"
                  />
                  <input type="text" placeholder="How to Contact" className="p-3 rounded-lg border border-border bg-background" />
                  <button className="md:col-span-2 py-3 px-6 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all">
                    Submit
                  </button>
                </form>
              </motion.div>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  )
}
