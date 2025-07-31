'use client'

import React from 'react'

interface StageFilterProps {
  stageFilter: string
  onStageChange: (stage: string) => void
  searchTerm: string
  onSearchChange: (term: string) => void
}

export default function StageFilter({
  stageFilter,
  onStageChange,
  searchTerm,
  onSearchChange
}: StageFilterProps) {
  return (
    <div className="mb-4 space-y-2">
      <select
        value={stageFilter}
        onChange={(e) => onStageChange(e.target.value)}
        className="p-1 border w-full"
      >
        <option value="">All Stages</option>
        <option value="interview_1">Interview 1</option>
        <option value="interview_2">Interview 2</option>
        <option value="offered">Offered</option>
        <option value="rejected_interview">Rejected after Interview</option>
      </select>

      <input
        type="text"
        placeholder="Search by name"
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="p-1 border w-full"
      />
    </div>
  )
}
