'use client'
import React from 'react'
import styles from '../app/hr_dashboard/HRDashboard.module.css'

interface ActionButtonsProps {
  stage: string
  onReject: () => void
  onAdvance: () => void
  disabled?: boolean
}

export default function ActionButtons({ stage, onReject, onAdvance, disabled = false }: ActionButtonsProps) {
  return (
    <div className="flex gap-4 mt-4"> {/* Using gap for consistent spacing */}
      <button
        onClick={onReject}
        disabled={disabled}
        className={`${styles.button} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        Reject
      </button>
      <button
        onClick={onAdvance}
        disabled={disabled}
        className={`${styles.button} ${
          stage === 'interview_1' ? 'bg-pink-600 hover:bg-pink-700' : 'bg-fuchsia-600 hover:bg-fuchsia-700'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {stage === 'interview_1' ? 'Move to Round 2' : 'Offer Position'}
      </button>
    </div>
  )
}
