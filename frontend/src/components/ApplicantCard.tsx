'use client'

import React from 'react'
import type { Applicant } from '../app/types/applicant'
import '../app/globals.css';

interface ApplicantCardProps {
  applicant: Applicant
  isSelected: boolean
  onSelect: (applicant: Applicant) => void
}

export default function ApplicantCard({ applicant, isSelected, onSelect }: ApplicantCardProps) {
  return (
    <div
      onClick={() => onSelect(applicant)}
      className={`applicant-card-simple ${isSelected ? 'selected' : ''}`}
    >
      {applicant.name}
    </div>
  )
}