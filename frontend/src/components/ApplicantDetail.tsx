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
    return (
      <div className="applicant-detail-empty">
        <p>Select an applicant to view details</p>
      </div>
    )
  }

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
    console.log('Saving evaluation:', { 
      applicantId: applicant.application_id, 
      rating, 
      notes,
      stage: applicant.stage 
    })
  }

  const formatStage = (stage: string) => {
    return stage.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())
  }

  return (
    <div className="applicant-detail-simple">
      <h1 className="applicant-name-title">{applicant.name}</h1>
      
      <div className="applicant-info-section">
        <div className="info-row">
          <span className="info-label">Email:</span>
          <span className="info-text">{applicant.email}</span>
        </div>
        
        <div className="info-row">
          <span className="info-label">Telephone:</span>
          <span className="info-text">{applicant.telephone}</span>
        </div>
        
        <div className="info-row">
          <span className="info-label">Stage:</span>
          <span className="info-text">{formatStage(applicant.stage)}</span>
        </div>
        
        <div className="info-row">
          <span className="info-label">Resume:</span>
          <a
            href={applicant.resume_url}
            target="_blank"
            rel="noopener noreferrer"
            className="resume-link-simple"
          >
            View Resume
          </a>
        </div>
      </div>

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