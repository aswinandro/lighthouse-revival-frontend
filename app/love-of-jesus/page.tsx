
"use client"

import { motion } from "framer-motion"
import React from "react"

const sections = [
  {
  title: "Love That Shines on Everyone",
    verse: "Romans 8:38-39",
    text: "For I am convinced that neither death nor life, neither angels nor demons, neither the present nor the future, nor any powers... will be able to separate us from the love of God that is in Christ Jesus our Lord.",
    analogy: "Like the sun that shines on all, regardless of who they are, God's love is not earned or lost. It simply is—constant, radiant, and free.",
    svg: (
      <motion.div
        initial={{ scale: 0.7, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1 }}
        className="flex items-center justify-center w-full h-full"
      >
        <img
          src="/sun-people.png"
          alt="Sun shining on all people"
          width={160}
          height={160}
          style={{ objectFit: 'contain' }}
          loading="lazy"
        />
      </motion.div>
    ),
  },
  {
  title: "Love That Gives Everything",
    verse: "John 15:13",
    text: "Greater love has no one than this: to lay down one’s life for one’s friends.",
    analogy: "Imagine a parent running into danger to save their child. Jesus gave Himself for us, not because we deserved it, but because love chooses sacrifice.",
    svg: (
      <motion.div
        initial={{ scale: 0.7, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1 }}
        className="flex items-center justify-center w-full h-full"
      >
        <img
          src="/sacrifice.svg"
          alt="Jesus showing sacrificial love"
          width={160}
          height={160}
          style={{ objectFit: 'contain' }}
          loading="lazy"
        />
      </motion.div>
    ),
  },
  {
  title: "Love That Changes Lives",
    verse: "2 Corinthians 5:17",
    text: "Therefore, if anyone is in Christ, the new creation has come: The old has gone, the new is here!",
    analogy: "Like a seed that becomes a tree, God's love transforms brokenness into beauty, despair into hope, and emptiness into purpose.",
    svg: (
      <motion.div
        initial={{ scale: 0.7, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1 }}
        className="flex items-center justify-center w-full h-full"
      >
        <img
          src="/tree.png"
          alt="Tree (If you see this text, the image is missing from /public)"
          width={160}
          height={160}
          style={{ objectFit: 'contain' }}
          loading="lazy"
        />
      </motion.div>
    ),
  },
  {
  title: "Love That Chooses You",
    verse: "John 15:13",
    text: "Greater love has no one than this: to lay down one’s life for one’s friends.",
    analogy: "Love is always a choice, and sometimes it means giving up what we want for someone else.",
    svg: (
      <motion.div
        initial={{ scale: 0.7, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1 }}
        className="flex items-center justify-center w-full h-full"
      >
        <img
          src="/double-hearts.png"
          alt="Two hearts intertwined"
          width={160}
          height={160}
          style={{ objectFit: 'contain' }}
          loading="lazy"
        />
      </motion.div>
    ),
  },
  {
  title: "Love That Never Gives Up",
    verse: "Luke 15:4-7",
    text: "Suppose one of you has a hundred sheep and loses one of them. Doesn’t he leave the ninety-nine in the open country and go after the lost sheep until he finds it?",
    analogy: "God’s love chases after us, even when we run away. Like a shepherd searching for a lost sheep, He never gives up on anyone.",
    svg: (
      <motion.div
        initial={{ scale: 0.7, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1 }}
        className="flex items-center justify-center w-full h-full"
      >
        <img
          src="/sheep.png"
          alt="Sheep (If you see this text, the image is missing from /public)"
          width={160}
          height={160}
          style={{ objectFit: 'contain' }}
          loading="lazy"
        />
      </motion.div>
    ),
  },
  {
  title: "Love That Heals Every Wound",
    verse: "Psalm 147:3",
    text: "He heals the brokenhearted and binds up their wounds.",
    analogy: "Like a gentle doctor tending to wounds, God’s love brings healing to the deepest hurts, restoring what was lost.",
    svg: (
      <motion.div
        initial={{ scale: 0.7, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1 }}
        className="flex items-center justify-center w-full h-full"
      >
        <img
          src="/healing.png"
          alt="Healing love illustration"
          width={160}
          height={160}
          style={{ objectFit: 'contain' }}
          loading="lazy"
        />
      </motion.div>
    ),
  },
]

export default function LoveOfJesusPage() {
  return (
    <div className="bg-background text-foreground min-h-screen">
      <main className="max-w-5xl mx-auto py-16 px-4 space-y-24">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-center"
        >
          <h1 className="text-6xl font-extrabold mb-6 mt-16 bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 bg-clip-text text-transparent">
            The Love of Jesus
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Even the hardest heart can be moved by a love so raw, so relentless, so real. Scroll and experience a journey through the infinite ways God loves you—no matter who you are.
          </p>
        </motion.div>

        {/* Section for Atheists */}
        <motion.section
          initial={{ opacity: 0, y: 80, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 1 }}
          className="relative flex flex-col md:flex-row items-center gap-8 bg-muted/40 rounded-2xl shadow-2xl p-8 border border-accent"
        >
          <div className="flex-shrink-0 w-[120px] h-[80px] flex flex-col items-center justify-center">
            <svg width="120" height="80" viewBox="0 0 120 80" fill="none" xmlns="http://www.w3.org/2000/svg">
              <motion.path
                d="M20 60 Q60 10 100 60"
                stroke="#888"
                strokeWidth="4"
                initial={{ pathLength: 0, opacity: 0 }}
                whileInView={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 1.2 }}
              />
              <motion.circle
                cx="60" cy="60" r="12"
                fill="#FFF"
                stroke="#888"
                strokeWidth="3"
                initial={{ scale: 0.7, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1, delay: 0.5 }}
              />
            </svg>
            {/* Add badge below image for label */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1 }}
              className="mt-2 text-sm font-semibold px-4 py-1 rounded-full bg-accent text-accent-foreground shadow"
            >
              Question
            </motion.div>
          </div>
          <div className="flex-1">
            <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
              For Those Who Doubt
            </h2>
            <blockquote className="text-lg italic mb-2">“What if love is just a chemical? What if meaning is just a story we tell ourselves?”</blockquote>
            <p className="text-base text-muted-foreground mb-2">
              If you’re skeptical, you’re not alone. Many have asked, “Is there more?” This page isn’t here to force belief, but to invite honest exploration. Even if you don’t believe in God, you know the ache for love, the longing for meaning, the beauty in sacrifice. These are universal. What if—just maybe—the love you seek is seeking you?
            </p>
            <p className="text-base text-muted-foreground mb-2">
              Like a question mark in the night sky, God’s love is not afraid of your doubts. It welcomes them. It meets you where you are, and whispers: “You are seen. You are loved. You matter.”
            </p>
          </div>
        </motion.section>

        {sections.map((section, idx) => (
          <motion.section
            key={section.title}
            initial={{ opacity: 0, y: idx % 2 === 0 ? 80 : -80, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 1, delay: idx * 0.2 }}
            className={`relative flex flex-col md:flex-row items-center gap-8 bg-muted/30 rounded-2xl shadow-xl p-8 ${idx % 2 === 0 ? '' : 'md:flex-row-reverse'}`}
          >
            <div className="flex-shrink-0 w-[120px] h-[80px] flex items-center justify-center">
              {section.svg}
            </div>
            <div className="flex-1">
              <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                {section.title}
              </h2>
              <blockquote className="text-lg italic mb-2">“{section.text}”</blockquote>
              <span className="text-pink-600 font-bold block mb-2">{section.verse}</span>
              <p className="text-base text-muted-foreground mb-2">{section.analogy}</p>
            </div>
          </motion.section>
        ))}

        <motion.section
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 1 }}
          className="text-center py-16"
        >
          <motion.div
            initial={{ rotate: -10 }}
            animate={{ rotate: 10 }}
            transition={{ repeat: Infinity, duration: 2, repeatType: "reverse" }}
            className="inline-block"
          >
            <motion.div
              initial={{ scale: 0.7, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1 }}
              className="flex items-center justify-center w-full h-full"
            >
              <img
                src="/love.png"
                alt="Love illustration"
                width={100}
                height={100}
                style={{ objectFit: 'contain' }}
                loading="lazy"
              />
            </motion.div>
          </motion.div>
          <h2 className="text-4xl font-bold mt-8 mb-4">God's Love Never Fails</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            No matter where you are, what you believe, or what you’ve done, the love of Jesus reaches you. His love is unconditional, sacrificial, and eternal. It is the one thing that can truly change a heart.
          </p>
        </motion.section>
      </main>
    </div>
  )
}
