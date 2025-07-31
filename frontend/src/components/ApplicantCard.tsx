'use client'

import React from 'react'
import type { Applicant } from '../app/types/applicant'

interface ApplicantCardProps {
  applicant: Applicant
  isSelected: boolean
  onSelect: (applicant: Applicant) => void
}

export default function ApplicantCard({ applicant, isSelected, onSelect }: ApplicantCardProps) {
  return (
    <li
      onClick={() => onSelect(applicant)}
      className={`p-2 cursor-pointer rounded ${
        isSelected ? 'bg-gray-200 font-semibold' : 'hover:bg-gray-100'
      }`}
    >
      {applicant.name}
    </li>
  )
}
