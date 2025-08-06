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
    <div className="filter-section">
      {/* Search Input */}
      <div className="search-container">
        <div className="search-icon">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.35-4.35"/>
          </svg>
        </div>
        <input
          type="text"
          placeholder="Search applicants..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="search-input"
        />
        {searchTerm && (
          <button 
            onClick={() => onSearchChange('')}
            className="clear-search"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        )}
      </div>

      {/* Stage Filter */}
      <div className="filter-container">
        <div className="filter-icon">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="22,3 2,3 10,12.46 10,19 14,21 14,12.46 22,3"/>
          </svg>
        </div>
        <select
          value={stageFilter}
          onChange={(e) => onStageChange(e.target.value)}
          className="filter-select"
        >
          <option value="">All Stages</option>
          <option value="interview_1">Interview 1</option>
          <option value="interview_2">Interview 2</option>
          <option value="offer_sent">Offered</option>
          <option value="rejected_interview_1">Rejected after 1st Interview</option>
          <option value="rejected_interview_2">Rejected after 2nd Interview</option>
        </select>
      </div>
    </div>
  )
}