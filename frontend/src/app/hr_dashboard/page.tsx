'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'

interface Applicant {
  application_id: number
  user_id: number
  name: string
  email: string
  stage: string
  resume_url: string
}

export default function HRPage() {
  const [applicants, setApplicants] = useState<Applicant[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/hr_dashboard`)
        setApplicants(res.data)
      } catch (error) {
        console.error('Error fetching applicants', error)
      } finally {
        setLoading(false)
      }
    }

    fetchApplicants()
  }, [])

  return (
    <div className="p-8 font-sans">
      <h1 className="text-2xl font-bold text-center mb-6">HR Interview Dashboard</h1>

      {loading ? (
        <p className="text-center text-gray-500">Loading applicants...</p>
      ) : applicants.length === 0 ? (
        <p className="text-center text-gray-500">No applicants currently in interview stages.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow border">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-4 text-left">Name</th>
                <th className="py-3 px-4 text-left">Email</th>
                <th className="py-3 px-4 text-left">Stage</th>
                <th className="py-3 px-4 text-left">Resume</th>
              </tr>
            </thead>
            <tbody>
              {applicants.map((app) => (
                <tr key={app.application_id} className="border-t hover:bg-gray-50">
                  <td className="py-2 px-4">{app.name}</td>
                  <td className="py-2 px-4">{app.email}</td>
                  <td className="py-2 px-4 capitalize">{app.stage.replace('_', ' ')}</td>
                  <td className="py-2 px-4">
                    <a
                      href={app.resume_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline"
                    >
                      View Resume
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}