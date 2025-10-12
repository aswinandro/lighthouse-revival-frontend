"use client"

import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"

export default function GalleryClient() {
  const [selected, setSelected] = useState<string | null>(null)
  const [images, setImages] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [visibleCount, setVisibleCount] = useState(20) // Number of images to show initially
  const loadMoreRef = React.useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    // Fetch image list from API route
    fetch("/api/gallery-files")
      .then((res) => res.json())
      .then((data) => {
        setImages(data.images || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  // Infinite scroll: load more images when the sentinel is visible
  useEffect(() => {
    if (!loadMoreRef.current) return;
    const observer = new window.IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setVisibleCount((prev) => Math.min(prev + 10, images.length));
      }
    });
    observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [images.length]);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center px-2 pb-16 mt-16">
      <motion.h1
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-5xl font-extrabold mt-10 mb-6 text-center bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 bg-clip-text text-transparent"
      >
        Gallery of Light
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.3 }}
        className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10 text-center"
      >
        Explore moments of joy, hope, and togetherness. Tap any photo to view it in full glory.
      </motion.p>
      {loading ? (
        <div className="text-center text-muted-foreground py-10">Loading gallery...</div>
      ) : (
        <>
          <div className="w-full max-w-5xl mx-auto columns-2 sm:columns-3 md:columns-4 gap-4 space-y-4">
            {images.slice(0, visibleCount).map((img, idx) => (
              <motion.div
                key={img}
                whileHover={{ scale: 1.03 }}
                className="mb-4 break-inside-avoid rounded-xl overflow-hidden shadow-lg cursor-pointer group"
                onClick={() => setSelected(img)}
              >
                <img
                  src={`/assets/gallery/${img}`}
                  alt={`Gallery photo ${idx + 1}`}
                  className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                  style={{ borderRadius: '0.75rem', display: 'block' }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </motion.div>
            ))}
          </div>
          {/* Sentinel for infinite scroll */}
          {visibleCount < images.length && (
            <div ref={loadMoreRef} className="w-full h-10 flex items-center justify-center text-muted-foreground">
              Loading more photos...
            </div>
          )}
        </>
      )}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-lg"
            onClick={() => setSelected(null)}
          >
            <motion.img
              src={`/assets/gallery/${selected}`}
              alt="Gallery fullscreen"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="max-w-full max-h-[80vh] rounded-2xl shadow-2xl border-4 border-white"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
