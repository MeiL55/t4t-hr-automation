"use client"

import { useEffect, useState} from "react"
import axios from "axios"
import { Survey } from "survey-react-ui"
import { Model, FunctionFactory } from "survey-core"
import "survey-core/survey-core.min.css"
import { surveyJson } from "@/data/applyForm"

FunctionFactory.Instance.register("getAge", function (params: any[]): number {
  const birthdateStr = params[0]
  if (!birthdateStr) return 100
  const birth = new Date(birthdateStr)
  const today = new Date()
  let age = today.getFullYear() - birth.getFullYear()
  const m = today.getMonth() - birth.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
    age--
  }
  return age
})

export default function SurveyComponent() {
  const [model] = useState(() => new Model(surveyJson))

  useEffect(() => {
    async function fetchAndInjectTelephone() {
      try {
        const token = localStorage.getItem("token")
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/user_info`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        const { telephone } = res.data
        model.data = {
          ...model.data,
          telephone
        }
      } catch (err) {
        console.error("Failed to load user telephone", err)
      }
    }
    fetchAndInjectTelephone()
  }, [model])
  model.onValueChanged.add(async (sender, options) => {
    if (options.name === "resume") {
      const token = localStorage.getItem("token");
      const resumeList = options.value;
      if (!resumeList || !resumeList.length) return;
      const resume = resumeList[0];
      console.log(resume);
      try {
        const uploadRes = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/api/upload_resume`,
          { resume },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const resume_filename = uploadRes.data.resume_filename;
        sender.setValue("resume_filename", resume_filename);
        sender.setValue("resume", { name: "uploaded.pdf", uploaded: true });
        console.log("Resume uploaded:", resume_filename);
        const q = sender.getQuestionByName("resume");
        q.readOnly = true;
        q.description = "Resume uploaded successfully.";
      } catch (err) {
        console.error("Resume upload failed", err);
        alert("Resume upload failed. Try again.");
      }
    }
  });
  model.onComplete.add(async (sender) => {
    const data = sender.data
    console.log("Survey submitted:", data)
    const token = localStorage.getItem("token")
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/application`, data,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      console.log("Application submitted:", res.data)
    } catch (err) {
      console.error("Failed to submit application:", err)
      alert("Failed to submit application")
    }
 })
  return (
    <div className="max-w-2xl mx-auto my-10">
      <Survey model={model} />
    </div>
  )
}
