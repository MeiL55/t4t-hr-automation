"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { Survey } from "survey-react-ui"
import { Model, FunctionFactory } from "survey-core"
import "survey-core/survey-core.min.css"
import "@/app/globals.css"
import { surveyJson } from "@/data/applyForm"
import rolesByTeam from "@/data/rolesByTeam.json"

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
  const [model, setModel] = useState(() => new Model(surveyJson))

  // Hot reload workaround for dev
  const [modelKey, setModelKey] = useState("prod")
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      setModelKey(Date.now().toString())
    }
  }, [])
   useEffect(() => {
    if (typeof window !== "undefined" && (import.meta as any).hot) {
      (import.meta as any).hot.accept(() => {
        window.location.reload()
      })
    }
  }, [])

  // Pre-fill telephone using cookie authentication
  useEffect(() => {
    async function fetchAndInjectTelephone() {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/user_info`, {
          withCredentials: true  // Use cookie authentication
        })
        const { telephone } = res.data
        model.data = {
          ...model.data,
          telephone
        }
      } catch (err: any) {
        console.error("Failed to load user telephone", err)
        if (err.response?.status === 401) {
          // Redirect to login if unauthorized
          window.location.href = '/login'
        }
      }
    }
    fetchAndInjectTelephone()
  }, [model])

  useEffect(() => {
    const handleValueChange = async (sender: any, options: any) => {
      // Handle team selection change to update role dropdown
      if (options.name === "team_applied") {
        const selectedTeam = options.value
        const roleQuestion = sender.getQuestionByName("role_applied")
        if (!roleQuestion) {
          console.error("Role question not found in survey model")
          return
        }
        if (selectedTeam && Object.prototype.hasOwnProperty.call(rolesByTeam, selectedTeam)) {
          // Create choices array from the roles for the selected team
          const roleChoices = (rolesByTeam as any)[selectedTeam].map((role: string) => ({
            value: role,
            text: role
          }))
          // Update the role dropdown choices
          roleQuestion.setPropertyValue("choices", roleChoices)
          // Clear the current role selection since team changed
          sender.setValue("role_applied", undefined)
          // Make the role question visible
          roleQuestion.visible = true
        } else {
          // Hide role question if no valid team selected
          roleQuestion.setPropertyValue("choices", [])
          roleQuestion.visible = false
          sender.setValue("role_applied", undefined)
        }
      }

      if (options.name === "resume") {
        const resumeList = options.value
        if (!resumeList || !resumeList.length) return
        const resume = resumeList[0]
        try {
          const uploadRes = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/api/upload_resume`,
            { resume },
            { withCredentials: true }  // Use cookie authentication
          )
          const resume_filename = uploadRes.data.resume_filename
          sender.setValue("resume_filename", resume_filename)
          sender.setValue("resume", { name: "uploaded.pdf", uploaded: true })
          const q = sender.getQuestionByName("resume")
          q.readOnly = true
          q.description = "Resume uploaded successfully."
        } catch (err: any) {
          console.error("Resume upload failed", err)
          if (err.response?.status === 401) {
            alert("Session expired. Please log in again.")
            window.location.href = '/login'
          } else {
            alert("Resume upload failed. Try again.")
          }
        }
      }
    }

    const handleComplete = async (sender: any) => {
      const data = sender.data
      try {
        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/api/application`,
          data,
          { withCredentials: true }  // Use cookie authentication
        )
        console.log("Application submitted:", res.data)
        // Optionally redirect to success page or dashboard
        // window.location.href = '/application-success'
      } catch (err: any) {
        console.error("Failed to submit application:", err)
        if (err.response?.status === 401) {
          alert("Session expired. Please log in again.")
          window.location.href = '/login'
        } else {
          alert("Failed to submit application")
        }
      }
    }

    model.onValueChanged.add(handleValueChange)
    model.onComplete.add(handleComplete)

    return () => {
      model.onValueChanged.remove(handleValueChange)
      model.onComplete.remove(handleComplete)
    }
  }, [model])

  return (
    <div className="max-w-3xl mx-auto my-10 p-8 rounded-3xl shadow-2xl bg-gradient-to-br from-fuchsia-600 via-purple-600 to-indigo-600">
      <Survey model={model} key={modelKey} />
    </div>
  )
}