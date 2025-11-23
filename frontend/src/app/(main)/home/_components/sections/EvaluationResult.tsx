"use client"

import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

export const description = "Radar chart showing authenticity evaluation scores"

// Define a type for the backend scores
interface EvalStepScore {
  title: string
  score: number // expected 0-100
}

interface EvalutionResultProps {
  scores: EvalStepScore[]
}

const chartConfig = {
  pipeline: {
    label: "Authenticity Score",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

export function EvalutionResult({ scores }: EvalutionResultProps) {
  return (
    <Card className="w-4xl">
      <CardHeader className="items-center pb-4">
        <CardTitle>Document Authenticity Evaluation</CardTitle>
        <CardDescription>
          Scores for each step in the evaluation pipeline
        </CardDescription>
      </CardHeader>

      <CardContent className="pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto w-full max-w-[400px] aspect-square"
        >
          <RadarChart
            data={scores}
            className="w-full"
            margin={{ top: 40, right: 40, bottom: 40, left: 40 }}
          >
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <PolarGrid stroke="var(--color-pipeline)" strokeOpacity={0.2} />
            <PolarAngleAxis
              dataKey="title"
              tick={{ fontSize: 12 }}
            //   angle={-15}
              dy={5}
            />
            <Radar
              dataKey="score"
              fill="var(--color-pipeline)"
              fillOpacity={0.5}
            />
          </RadarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

