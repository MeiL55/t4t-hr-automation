'use client'

import React from 'react'
interface ActionButtonsProps {
  stage: string
  onReject: () => void
  onAdvance: () => void
}

export default function ActionButtons({ stage, onReject, onAdvance }: ActionButtonsProps) {
  if (stage === 'interview_1') {
    return (
      <div className="action-buttons">
        <button
          onClick={onReject}
          className="action-btn action-btn-reject"
        >
          Reject
        </button>
        <button
          onClick={onAdvance}
          className="action-btn action-btn-advance"
        >
          Move to Round 2
        </button>
      </div>
    )
  }

  if (stage === 'interview_2') {
    return (
      <div className="action-buttons">
        <button
          onClick={onReject}
          className="action-btn action-btn-reject"
        >
          Reject
        </button>
        <button
          onClick={onAdvance}
          className="action-btn action-btn-offer"
        >
          Offer Position
        </button>
      </div>
    )
  }

  return null
}