'use client'

import React, { useState } from 'react'

interface InterviewNotesProps {
  applicantId: number
  stage: string
  onSave?: (rating: number, notes: string) => void
}

function InterviewNotes({ applicantId, stage, onSave }: InterviewNotesProps) {
  const [selectedRating, setSelectedRating] = useState<number | null>(null)
  const [notes, setNotes] = useState('')

  const handleRatingClick = (rating: number) => {
    setSelectedRating(rating)
  }

  const handleNotesChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNotes(event.target.value)
  }

  const handleSave = () => {
    if (selectedRating && onSave) {
      onSave(selectedRating, notes)
    }
  }

  // Only show for interview stages
  if (stage !== 'interview_1' && stage !== 'interview_2') {
    return null
  }

  return (
    <div className="interview-evaluation">
      <h3 className="evaluation-title">Interview Evaluation</h3>
      
      <div className="evaluation-content">
        <div className="candidate-evaluation-section">
          <h4 className="section-title">Candidate Evaluation</h4>
          <div className="title-underline"></div>
          
          <div className="rating-section">
            <p className="rating-label">Rate this candidate (1-5)</p>
            
            <div className="rating-buttons">
              {[1, 2, 3, 4, 5].map((rating) => (
                <button
                  key={rating}
                  className={`rating-button ${selectedRating === rating ? 'selected' : ''}`}
                  onClick={() => handleRatingClick(rating)}
                >
                  {rating}
                </button>
              ))}
            </div>
            
            <div className="rating-labels">
              <span className="rating-label-text">Poor</span>
              <span className="rating-label-text">Great</span>
            </div>
          </div>
          
          <div className="notes-section">
            <p className="notes-label">Evaluation notes</p>
            <textarea
              className="notes-textarea"
              placeholder="Share your detailed feedback..."
              value={notes}
              onChange={handleNotesChange}
              rows={6}
            />
          </div>
        </div>
        
        <div className="action-buttons">
          <button className="save-button" onClick={handleSave}>
            Save Evaluation
          </button>
        </div>
      </div>
    </div>
  )
}

export default InterviewNotes