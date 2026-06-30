"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowUp } from "lucide-react"

const ButtonUp: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false)

  const toggleVisibility = () => {
    if (window.scrollY > 300) {
      setIsVisible(true)
    } else {
      setIsVisible(false)
    }
  }

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility)
    return () => {
      window.removeEventListener("scroll", toggleVisibility)
    }
  }, [])

  return (
    <div className={`fixed bottom-21 right-7 z-10 transition-all duration-300 ${ isVisible ? "translate-y-0" : "translate-y-96"} `}>
      {(
        <Button
          onClick={scrollToTop}
          size="xs"
          className="rounded-full hover:cursor-pointer shadow-lg transition-all duration-300 hover:scale-110 size-10"
          aria-label="Volver arriba"
        >
          <ArrowUp className="size-7" />
        </Button>
      )}
    </div>
  )
}

export default ButtonUp
