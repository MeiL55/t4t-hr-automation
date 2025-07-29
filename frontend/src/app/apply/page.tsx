"use client";
import dynamic from "next/dynamic";

const SurveyComponent = dynamic(() => import("@/components/SurveyComponent"), {
  ssr: false,
});

export default function SurveyPage() {
  return (
      <div className="max-w-4xl mx-auto">
        <SurveyComponent />
      </div>
  );
}
