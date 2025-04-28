

interface GlucoseChartProps {
  data: Array<{
    date: string
    value: number
  }>
}

export function GlucoseChart({ data }: GlucoseChartProps) {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="text-center">
        <p className="text-lg text-muted-foreground mb-4">
          Chart visualization will be implemented with a charting library.
        </p>
        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-green-500"></div>
            <span>Normal (100-140 mg/dL)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-amber-500"></div>
            <span>Low (&lt;100 mg/dL)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-red-500"></div>
            <span>High (&gt;140 mg/dL)</span>
          </div>
        </div>
      </div>
    </div>
  )
}
