

import { useEffect, useState, useRef } from "react"

interface VoiceWaveformProps {
  isActive: boolean
  type: "listening" | "speaking" | "idle"
}

export function VoiceWaveform({ isActive, type }: VoiceWaveformProps) {
  const [waveformData, setWaveformData] = useState<number[]>(Array(30).fill(3))
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (isActive) {
      // Different animation patterns based on type
      if (type === "listening") {
        intervalRef.current = setInterval(() => {
          setWaveformData(
            Array(30)
              .fill(0)
              .map(() => Math.floor(Math.random() * 25) + 5),
          )
        }, 100)
      } else if (type === "speaking") {
        intervalRef.current = setInterval(() => {
          setWaveformData(
            Array(30)
              .fill(0)
              .map(() => Math.floor(Math.random() * 20) + 3),
          )
        }, 150)
      }
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
      setWaveformData(Array(30).fill(3))
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [isActive, type])

  return (
    <div className="flex items-center justify-center gap-[2px] h-16 w-full">
      {waveformData.map((height, index) => (
        <div
          key={index}
          className={`w-1 rounded-full transition-all duration-100 ease-in-out ${
            type === "listening" ? "bg-coral" : type === "speaking" ? "bg-teal" : "bg-primary/30"
          }`}
          style={{ height: `${height}px` }}
        ></div>
      ))}
    </div>
  )
}
