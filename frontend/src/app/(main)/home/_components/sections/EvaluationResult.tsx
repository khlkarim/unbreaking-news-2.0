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
import { usePipelineStore } from "@/hooks/use-pipeline-store"
import { Badge } from "@/components/ui/badge"

export const description = "Radar chart showing authenticity evaluation scores"

interface ResultStep {
  score: number
  notes: string[]
}

interface Result {
  metadata: ResultStep
  consistency: ResultStep
  visualForensics: ResultStep
  contentIntegrity: ResultStep
}

interface EvalStepScore {
  title: string
  score: number // expected 0-100
}

const chartConfig = {
  pipeline: {
    label: "Authenticity Score",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

const displayNames: Record<string, string> = {
    metadata: "Metadata",
    contentIntegrity: "Content Integrity",
    visualForensics: "Visual Forensics",
    consistency: "Consistency",
};

export function EvalutionResult() {
  const result = usePipelineStore((state) => state.result as Result | undefined)

  if (!result) {
    return (
      <Card className="w-4xl">
        <CardHeader className="items-center pb-4">
          <CardTitle>Document Authenticity Evaluation</CardTitle>
          <CardDescription>No results available yet</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  // Transform the Result object into an array suitable for RadarChart
  const scores: EvalStepScore[] = Object.entries(result).map(([title, step]) => ({
    title,
    score: step.score,
  }))

  return (
    <>
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
            <CardContent className="pt-6">
                {Object.entries(result).map(([title, step]) => (
                    <Card key={title} className="border shadow-sm hover:shadow-md transition my-5">
                    <CardHeader className="flex items-center justify-between pb-2">
                        <CardTitle className="capitalize">{displayNames[title]}</CardTitle>
                        <div className="ml-2">
                        <Badge variant="secondary">{step.score}</Badge>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {step.notes.length > 0 ? (
                        <ul className="list-disc list-inside text-md space-y-1">
                            {step.notes.map((note: string, idx: number) => (
                            <li key={idx}>{note}</li>
                            ))}
                        </ul>
                        ) : (
                        <p className="text-sm text-gray-400">No notes available</p>
                        )}
                    </CardContent>
                    </Card>
                ))}
                </CardContent>

        </Card>
    </>
  )
}
