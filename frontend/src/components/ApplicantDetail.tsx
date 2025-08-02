'use client'

import React from 'react'
import type { Applicant } from '../app/types/applicant'
import ActionButtons from './ActionButtons'

interface ApplicantDetailProps {
  applicant: Applicant | null
  onStageUpdate: (applicationId: number, newStage: string) => void
}

export default function ApplicantDetail({ applicant, onStageUpdate }: ApplicantDetailProps) {
  if (!applicant) {
    return <p className="text-gray-500">Select an applicant to view details</p>
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

  return (
    <div className="w-full p-6">
      <h2 className="text-2xl font-bold mb-2">{applicant.name}</h2>
      <p className="mb-1 text-gray-600">{applicant.email}</p>
      <p className="mb-1 text-gray-600">📞 {applicant.telephone}</p>
      <p className="mb-2">
        Stage:{' '}
        <span className="capitalize text-black font-medium">
          {applicant.stage.replace('_', ' ')}
        </span>
      </p>
      <p className="mb-4">
        Resume:{' '}
        <a
          href={applicant.resume_url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 underline"
        >
          View Resume
        </a>
      </p>

      <ActionButtons
        stage={applicant.stage}
        onReject={handleReject}
        onAdvance={handleAdvance}
      />
    </div>
  )
}
