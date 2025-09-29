"use client"

import Image from "next/image"
import { motion } from "framer-motion"

const aboutText = [
  "The ministry of Pastor Manoj Thomas began humbly in 2006, with a small gathering inside a seven-seater Fortuner on the outskirts of Abu Dhabi. In 2009, he was ordained as a Pastor, continuing to serve with dedication and compassion.",
  "In January 2017, after enduring severe health issues, rejection, and financial struggles, GOD graciously opened a new chapter in his life and strengthened him to overcome these challenges. That same year, the fellowship joined World Wide Missionary Movement, Inc, headquartered in Washington D.C. and Puerto Rico—marking a season of renewal, growth, and global connection.",
  "Even during the COVID-19 pandemic, God’s presence faithfully preserved and strengthened the Church, which continued to grow in numbers.",
  "Today, Lighthouse Revival Church is known for the abiding presence of God and has flourished with services in English, Malayalam, Tamil, Hindi, as well as outreaches in several countries, carrying forward its mission of planting churches across nations and languages. People of all ages, backgrounds, and walks of life are drawn to its message of hope, making the church a shining testimony of faith, resilience, and the enduring power of God’s love.",
]

export default function AboutUsContent() {
  return (
    <div className="bg-background text-foreground">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <main className="max-w-7xl mx-auto">
          {/* Page Header */}
          <motion.div
            className="text-center mb-12 md:mb-20"
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tighter mb-4">
              <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                A Brief History of Our Ministry
              </span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
              The story of Lighthouse Revival Church and Pastor Manoj.
            </p>
          </motion.div>

          {/* Main Content Grid */}
          <div className="flex flex-col md:flex-row gap-12 lg:gap-16 items-stretch">
            {/* Image Section */}
            <motion.div
              className="md:w-2/5 flex flex-col"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="relative group w-full h-full max-w-sm mx-auto md:max-w-none overflow-hidden rounded-2xl shadow-lg">
                <Image
                  src="/pastor.jpg"
                  alt="Pastor Manoj"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 90vw, 40vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-l from-background via-transparent to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-transparent" />
              </div>
              <div className="mt-4 text-center">
                <h3 className="text-2xl font-bold">Pastor Manoj</h3>
                <p className="text-muted-foreground">Founder & Lead Pastor</p>
              </div>
            </motion.div>

            {/* Bio Section */}
            <motion.div
              className="md:w-3/5 flex flex-col justify-center space-y-6 text-lg text-muted-foreground leading-relaxed"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: { staggerChildren: 0.25 },
                },
              }}
            >
              {aboutText.map((paragraph, index) => (
                <motion.p
                  key={index}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 },
                  }}
                  transition={{ duration: 0.6 }}
                >
                  {paragraph}
                </motion.p>
                
              ))}
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  )
}
