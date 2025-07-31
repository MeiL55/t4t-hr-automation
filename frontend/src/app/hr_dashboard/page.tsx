'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'
import { Applicant } from '../types/applicant'
import StageFilter from '../../components/StageFilter'
import ApplicantList from '../../components/ApplicantList'
import ApplicantDetail from '../../components/ApplicantDetail'

export default function HRDashboard() {
  const [applicants, setApplicants] = useState<Applicant[]>([])
  const [selected, setSelected] = useState<Applicant | null>(null)
  const [stageFilter, setStageFilter] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchApplicants()
  }, [])

  const fetchApplicants = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/hr_dashboard`)
      setApplicants(res.data)
    } catch (err) {
      console.error('Error fetching applicants:', err)
    }
  }

  const updateStage = async (applicationId: number, newStage: string) => {
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/update_stage`, {
        application_id: applicationId,
        new_stage: newStage,
      })
      await fetchApplicants()
      setSelected(null)
    } catch (err) {
      console.error('Stage update failed:', err)
    }
  }

  const filtered = applicants.filter(
    (app) =>
      (stageFilter === '' || app.stage === stageFilter) &&
      app.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="flex h-screen font-sans">
      {/* Sidebar */}
      <div className="w-1/3 border-r p-4">
        <h2 className="text-xl font-bold mb-4">Applicants</h2>
        <StageFilter
          stageFilter={stageFilter}
          onStageChange={setStageFilter}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />
        <ApplicantList
          applicants={filtered}
          selected={selected}
          onSelect={setSelected}
        />
      </div>

      {/* Detail Panel */}
      <div className="w-2/3 p-6">
        <ApplicantDetail applicant={selected} onStageUpdate={updateStage} />
      </div>
    </div>
  )
}
