"use client"

import { useEffect, useRef } from "react"
import { useGSAP } from "@/hooks/use-gsap"
import { Quote } from "lucide-react"
import useSWR from "swr"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

const API_URL = "https://beta.ourmanna.com/api/v1/get/?format=json"

function decodeHtmlEntities(str: string) {
  if (!str) return ""
  const txt = document.createElement("textarea")
  txt.innerHTML = str
  return txt.value
}

export function VerseSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const { fadeIn } = useGSAP()

  const { data, error, isLoading } = useSWR(API_URL, fetcher, {
    revalidateOnFocus: false, // The verse only changes daily
  })

  useEffect(() => {
    if (sectionRef.current && !isLoading) fadeIn(".verse-content", { delay: 0.3 })
  }, [fadeIn, isLoading])

  return (
    <section
      ref={sectionRef}
      className="animate-section relative overflow-hidden bg-muted/30 py-20"
    >
      <div className="container mx-auto px-4 relative z-10">
        <div className="mx-auto max-w-4xl rounded-2xl border border-border/10 bg-card/50 p-8 text-center backdrop-blur-lg md:p-12">
          <div className="verse-content space-y-8">
            <div className="mb-6 flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 ring-4 ring-primary/5">
                <Quote className="h-8 w-8 text-primary" />
              </div>
            </div>

            {isLoading && (
              <div className="space-y-6 animate-pulse">
                <div className="h-8 bg-muted rounded-md w-full"></div>
                <div className="h-8 bg-muted rounded-md w-3/4 mx-auto"></div>
                <div className="h-6 bg-muted rounded-md w-1/3 mx-auto mt-4"></div>
              </div>
            )}
            {error && (
              <blockquote className="text-2xl md:text-3xl text-destructive">
                Unable to load Verse of the Day.
              </blockquote>
            )}
            {data && (
              <>
                {/* The API sometimes wraps the response, so we access it safely. */}
                <blockquote className="text-2xl md:text-3xl lg:text-4xl font-medium leading-relaxed text-foreground">
                  “
                  {decodeHtmlEntities(
                    data.verse?.details?.text || // Handles { verse: { details: { ... } } }
                      data.verse?.votd?.text || // Handles { verse: { votd: { ... } } }
                      data.votd?.text || // Handles { votd: { ... } }
                      "Verse unavailable"
                  )}
                  ”
                </blockquote>
                <cite className="not-italic text-lg md:text-xl text-muted-foreground font-semibold">
                  —{" "}
                  {decodeHtmlEntities(
                    data.verse?.details?.reference || data.verse?.votd?.display_ref || data.votd?.display_ref || ""
                  )}
                </cite>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}