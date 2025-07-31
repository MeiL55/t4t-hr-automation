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
      <div className="space-x-3 mt-4">
        <button
          onClick={onReject}
          className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded"
        >
          Reject
        </button>
        <button
          onClick={onAdvance}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          Move to Round 2
        </button>
      </div>
    )
  }

  if (stage === 'interview_2') {
    return (
      <div className="space-x-3 mt-4">
        <button
          onClick={onReject}
          className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded"
        >
          Reject
        </button>
        <button
          onClick={onAdvance}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
        >
          Offer Position
        </button>
      </div>
    )
  }

  return null
}