'use client'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { Applicant } from '../types/applicant'
import StageFilter from '../../components/StageFilter'
import ApplicantList from '../../components/ApplicantList'
import ApplicantDetail from '../../components/ApplicantDetail'
import InterviewNotes from '../../components/InterviewNotes'
import styles from './HRDashboard.module.css'

export default function HRDashboard() {
  const [applicants, setApplicants] = useState<Applicant[]>([])
  const [selected, setSelected] = useState<Applicant | null>(null)
  const [stageFilter, setStageFilter] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const getAuthHeader = () => {
    const token = localStorage.getItem("token")
    return {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  }

  useEffect(() => {
    fetchApplicants()
  }, [])

  const fetchApplicants = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/hr_dashboard`,
        getAuthHeader()
      )
      setApplicants(res.data)
    } catch (err) {
      console.error('Error fetching applicants:', err)
      setError('Failed to load applicants. Please try again later.')
    } finally {
      setIsLoading(false)
    }
  }

  const updateStage = async (applicationId: number, newStage: string) => {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/update_stage`,
        {
          application_id: applicationId,
          new_stage: newStage,
        },
        getAuthHeader()
      )
      await fetchApplicants()
      setSelected(null)
    } catch (err) {
      console.error('Stage update failed:', err)
      setError('Failed to update applicant stage. Please try again.')
    }
  }

  const saveInterviewNotes = async (applicantId: string, notes: string, decision: string) => {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/save_interview_notes`,
        {
          application_id: parseInt(applicantId),
          interview_notes: notes,
          decision: decision
        },
        getAuthHeader()
      )
      await fetchApplicants()
      setSelected(null)
    } catch (err) {
      console.error('Error saving interview notes:', err)
      setError('Failed to save interview notes. Please try again.')
    }
  }

  const filtered = applicants.filter(
    (app) =>
      (stageFilter === '' || app.stage === stageFilter) &&
      app.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className={styles.dashboard}>
      {/* Sidebar */}
      <div className={styles.sidebar}>
        <h2 className={styles.sidebarHeader}>Applicants</h2>
        {error && <div className="text-red-500 p-2 mb-2">{error}</div>}
        <StageFilter
          stageFilter={stageFilter}
          onStageChange={setStageFilter}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />
        {isLoading ? (
          <div className="p-4 text-center">Loading applicants...</div>
        ) : (
          <ApplicantList
            applicants={filtered}
            selected={selected}
            onSelect={setSelected}
          />
        )}
      </div>

      {/* Detail Panel */}
      <div className={styles.detailPanel}>
        {isLoading ? (
          <div className={styles.emptyState}>Loading applicant details...</div>
        ) : selected ? (
          <div className={styles.detailContainer}>
            <ApplicantDetail applicant={selected} onStageUpdate={updateStage} />
            
            {(selected.stage === 'Interview' || selected.interview_stage) && (
              <div className={styles.interviewSection}>
                <h3>Interview Evaluation</h3>
                <InterviewNotes
                  applicantId={selected.application_id.toString()}
                  currentStage={selected.interview_stage || 'interview_1'}
                  onDecision={(decision, notes) => {
                    saveInterviewNotes(
                      selected.application_id.toString(),
                      notes,
                      decision
                    )
                  }}
                />
              </div>
            )}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <h3>Select an applicant</h3>
            <p>Choose an applicant from the list to view details</p>
          </div>
        )}
      </div>
    </div>
  )
}
