"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { pipelineSteps, PipelineStep } from "@/config/pipeline-steps";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePipelineStore } from "@/hooks/use-pipeline-store";

export default function PipelineAccordion() {
  const { config, setParam } = usePipelineStore();

  const handleEvaluate = () => {
    console.log("Pipeline config:", config);
  };

  return (
    <>
      <Accordion type="single" collapsible className="max-w-4xl my-4 w-full">
        {pipelineSteps.map((step, index) => (
          <AccordionItem
            key={index}
            value={`item-${index}`}
            className="border border-b-0 last:border-b first:rounded-t-md last:rounded-b-md px-4"
          >
            <AccordionTrigger>{step.title}</AccordionTrigger>
            <AccordionContent>
              {step.description && (
                <p className="text-sm text-gray-600 mb-2">{step.description}</p>
              )}

              {step.parameters && step.parameters.length > 0 ? (
                <div className="flex flex-col gap-2 p-2 border rounded">
                  {step.parameters.map(param => {
                    const value =
                      config[step.title]?.[param.name] ?? param.default ?? "";
                    const label = param.displayName || param.name;

                    if (param.options && param.options.length > 0) {
                      return (
                        <div key={param.name} className="flex flex-col gap-1">
                          <span>{label}</span>
                          {param.description && (
                            <span className="text-xs text-gray-500">{param.description}</span>
                          )}
                          <Select
                            value={value}
                            onValueChange={val =>
                              setParam(step.title, param.name, val)
                            }
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder={`Select ${label}`} />
                            </SelectTrigger>
                            <SelectContent>
                              {param.options.map(option => (
                                <SelectItem key={option as string} value={option as string}>
                                  {option as string}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      );
                    }

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
                              onChange={e =>
                                setParam(step.title, param.name, e.target.value)
                              }
                              className="p-1 border rounded w-full"
                            />
                          </label>
                        );

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
                                setParam(step.title, param.name, Number(e.target.value))
                              }
                              className="p-1 border rounded w-full"
                            />
                          </label>
                        );

                      case "boolean":
                        return (
                          <label key={param.name} className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={!!value}
                              onChange={e =>
                                setParam(step.title, param.name, e.target.checked)
                              }
                              className="w-4 h-4"
                            />
                            <span>
                              {label}
                              {param.description && (
                                <span className="text-xs text-gray-500">
                                  {" - " + param.description}
                                </span>
                              )}
                            </span>
                          </label>
                        );

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
                                setParam(
                                  step.title,
                                  param.name,
                                  e.target.value.split(",").map(v => v.trim())
                                )
                              }
                              className="p-1 border rounded w-full"
                            />
                          </label>
                        );

                      default:
                        return null;
                    }
                  })}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No configurable parameters for this step.</p>
              )}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <button
        onClick={handleEvaluate}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Evaluate
      </button>
    </>
  );
}
