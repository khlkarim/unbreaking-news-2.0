// app/components/Hero.tsx
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function Hero() {
  return (
    <section className="relative bg-gray-50 dark:bg-gray-900 rounded-sm">
      <div className="container mx-auto px-6 py-20 lg:flex lg:items-center lg:justify-between">
        {/* Text Content */}
        <div className="lg:w-1/2 text-center lg:text-left">
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white sm:text-5xl">
            Alethia
          </h1>
          <p className="mt-4 text-lg text-gray-700 dark:text-gray-300 sm:text-xl">
            Beyond the myth.
            Into the truth.
          </p>
        </div>

        {/* Illustration */}
        <div className="mt-10 lg:mt-0 lg:w-1/2 flex justify-center">
          <Card className="w-full max-w-md p-6 shadow-lg">
            <CardContent className="flex justify-center items-center h-64 bg-gray-100 dark:bg-gray-800">
              <span className="text-gray-400 dark:text-gray-500">
                Illustration / Image
              </span>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
