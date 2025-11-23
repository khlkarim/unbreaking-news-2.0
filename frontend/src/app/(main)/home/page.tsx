import { Hero7 } from "@/components/hero7";
import { EvalutionResult } from "./_components/sections/EvaluationResult";
import FileUpload05 from "@/components/file-upload-05";
import AccordionBoxDemo from "@/components/accordion-03";

const backendResults = [
  { title: "Metadata Analysis", score: 90 },
  { title: "Visual Forensics", score: 75 },
  { title: "Preprocessing", score: 80 },
  { title: "Content Integrity", score: 85 },
  { title: "Consistency", score: 95 },
]


export default function Page() {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen gap-6 px-4">
      <Hero7 />
      <FileUpload05 />
      <AccordionBoxDemo />
      <EvalutionResult scores={backendResults} />
    </div>
  );
}
