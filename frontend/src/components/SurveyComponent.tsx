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
    // --- START: FIX ---
    // The submission logic is moved inside useEffect to prevent
    // it from being added twice by React's Strict Mode.
    const onComplete = async (sender: any) => {
      const data = sender.data
      console.log("Survey submitted:", data)

      try {
        const token = localStorage.getItem("token")

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
    }

    model.onComplete.add(onComplete)
    // --- END: FIX ---

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

    // It's best practice to clean up the listener when the component unmounts
    return () => {
      model.onComplete.remove(onComplete)
    }
  }, [model])

  return (
    <div className="max-w-2xl mx-auto my-10">
      <Survey model={model} />
    </div>
  )
}
