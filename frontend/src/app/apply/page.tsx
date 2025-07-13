"use client";
import dynamic from "next/dynamic";

const SurveyComponent = dynamic(() => import("@/components/SurveyComponent"), {
  ssr: false,
});

export default function SurveyPage() {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Teens 4 Teens Job Application</h1>
      <SurveyComponent />
    </div>
  );
}
