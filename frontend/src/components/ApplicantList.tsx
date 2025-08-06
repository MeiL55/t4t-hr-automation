'use client'

import React from 'react'
import type { Applicant } from '../app/types/applicant'
import ApplicantCard from './ApplicantCard'

interface ApplicantListProps {
  applicants: Applicant[]
  selected: Applicant | null
  onSelect: (applicant: Applicant) => void
}

export default function ApplicantList({
  applicants,
  selected,
  onSelect
}: ApplicantListProps) {
  return (
    <div className="applicant-list-container">
      {applicants.map((app) => (
        <ApplicantCard
          key={app.application_id}
          applicant={app}
          isSelected={selected?.application_id === app.application_id}
          onSelect={onSelect}
        />
      ))}
    </div>
  )
}