"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  FileSearch,
  Workflow,
  Settings,
  ShieldCheck,
  FileCheck,
} from "lucide-react"
import { useState } from "react"
import { pipelineSteps, PipelineStep } from "@/config/pipeline-steps"

export function PipelineSteps() {
  const [configValues, setConfigValues] = useState<Record<string, any>>({})

  const handleChange = (stepTitle: string, paramName: string, value: any) => {
    setConfigValues(prev => ({
      ...prev,
      [stepTitle]: {
        ...prev[stepTitle],
        [paramName]: value,
      },
    }))
  }

  const handleSubmit = (e: React.FormEvent, step: PipelineStep) => {
    e.preventDefault()
    console.log("Saved config for", step.title, configValues[step.title] || {})
  }

  const icons = [FileSearch, Workflow, Settings, ShieldCheck, FileCheck]

  return (
    <Accordion type="single" collapsible className="w-full" defaultValue="item-0">
      {pipelineSteps.map((step, index) => {
        const Icon = icons[index]
        return (
          <AccordionItem key={index} value={`item-${index}`}>
            <AccordionTrigger className="flex items-center gap-2">
              <Icon className="w-4 h-4" />
              {step.title}
            </AccordionTrigger>
            <AccordionContent className="flex flex-col gap-4">
              {step.description && <p className="text-sm text-gray-600">{step.description}</p>}

              {step.parameters && step.parameters.length > 0 ? (
                <form
                  className="flex flex-col gap-2 p-2 border rounded"
                  onSubmit={e => handleSubmit(e, step)}
                >
                  {step.parameters.map(param => {
                    const value =
                      configValues[step.title]?.[param.name] ?? param.default ?? ""

                    const label = param.displayName
                    console.log(label);

                    switch (param.type) {
                      case "string":
                        return (
                          <label key={param.name} className="flex flex-col gap-1">
                            {label}
                            {param.description && (
                              <span className="text-xs text-gray-500">{param.description}</span>
                            )}
                            <input
                              type="text"
                              value={value}
                              onChange={e => handleChange(step.title, param.name, e.target.value)}
                              className="p-1 border rounded w-full"
                            />
                          </label>
                        )

                      case "number":
                        return (
                          <label key={param.name} className="flex flex-col gap-1">
                            {label}
                            {param.description && (
                              <span className="text-xs text-gray-500">{param.description}</span>
                            )}
                            <input
                              type="number"
                              value={value}
                              onChange={e =>
                                handleChange(step.title, param.name, Number(e.target.value))
                              }
                              className="p-1 border rounded w-full"
                            />
                          </label>
                        )

                      case "boolean":
                        return (
                          <label key={param.name} className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={!!value}
                              onChange={e =>
                                handleChange(step.title, param.name, e.target.checked)
                              }
                              className="w-4 h-4"
                            />
                            <span>
                              {label}
                              {param.description && (
                                <span className="text-xs text-gray-500"> - {param.description}</span>
                              )}
                            </span>
                          </label>
                        )

                      case "array":
                        return (
                          <label key={param.name} className="flex flex-col gap-1">
                            {label} (comma separated)
                            {param.description && (
                              <span className="text-xs text-gray-500">{param.description}</span>
                            )}
                            <input
                              type="text"
                              value={Array.isArray(value) ? value.join(", ") : ""}
                              onChange={e =>
                                handleChange(
                                  step.title,
                                  param.name,
                                  e.target.value.split(",").map(v => v.trim())
                                )
                              }
                              className="p-1 border rounded w-full"
                            />
                          </label>
                        )

                      default:
                        return null
                    }
                  })}

                  <button
                    type="submit"
                    className="mt-2 bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600"
                  >
                    Save
                  </button>
                </form>
              ) : (
                <p className="text-sm text-gray-500">No configurable parameters for this step.</p>
              )}
            </AccordionContent>
          </AccordionItem>
        )
      })}
    </Accordion>
  )
}
