'use client'

import React from 'react'
import type { Applicant } from '../app/types/applicant'
import ActionButtons from './ActionButtons'
import InterviewNotes from './InterviewNotes'


interface ApplicantDetailProps {
  applicant: Applicant | null
  onStageUpdate: (applicationId: number, newStage: string) => void
}

export default function ApplicantDetail({ applicant, onStageUpdate }: ApplicantDetailProps) {
  if (!applicant) {
    return <p style={{ color: '#718096' }}>Select an applicant to view details</p>
  }
  console.log('InterviewNotes is:', InterviewNotes)

  const handleReject = () => {
    const rejectStage =
      applicant.stage === 'interview_1'
        ? 'rejected_interview_1'
        : applicant.stage === 'interview_2'
        ? 'rejected_interview_2'
        : ''
    if (rejectStage) {
      onStageUpdate(applicant.application_id, rejectStage)
    }
  }

  const handleAdvance = () => {
    const nextStage =
      applicant.stage === 'interview_1'
        ? 'interview_2'
        : applicant.stage === 'interview_2'
        ? 'offer_sent'
        : ''
    if (nextStage) {
      onStageUpdate(applicant.application_id, nextStage)
    }
  }

  const handleSaveEvaluation = (rating: number, notes: string) => {
    // TODO: Implement API call to save evaluation
    console.log('Saving evaluation:', { 
      applicantId: applicant.application_id, 
      rating, 
      notes,
      stage: applicant.stage 
    })
  }

  return (
    <div style={{ width: '100%', padding: '1.5rem' }}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
        {applicant.name}
      </h2>
      <p style={{ marginBottom: '0.25rem', color: '#718096' }}>{applicant.email}</p>
      <p style={{ marginBottom: '0.25rem', color: '#718096' }}>📞 {applicant.telephone}</p>
      <p style={{ marginBottom: '0.5rem' }}>
        Stage:{' '}
        <span style={{ textTransform: 'capitalize', color: 'black', fontWeight: '500' }}>
          {applicant.stage.replace('_', ' ')}
        </span>
      </p>
      <p style={{ marginBottom: '1rem' }}>
        Resume:{' '}
        <a
          href={applicant.resume_url}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: '#3182ce', textDecoration: 'underline' }}
        >
          View Resume
        </a>
      </p>

      <ActionButtons
        stage={applicant.stage}
        onReject={handleReject}
        onAdvance={handleAdvance}
      />

      <InterviewNotes
        applicantId={applicant.application_id}
        stage={applicant.stage}
        onSave={handleSaveEvaluation}
      />
    </div>
  )
}