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
          
          {/* Added Interview Questions Section */}
          <div className="questions-section">
            <p className="notes-label">Interview Questions</p>
            <div className="question-item">
              <p>1. Tell me about yourself and your background.</p>
            </div>
            <div className="question-item">
              <p>2. Why do you want to be apart of Teens 4 Teens? </p>
            </div>
            <div className="question-item">
              <p>3. What are your strengths and weaknesses?</p>
            </div>
            <div className="question-item">
              <p>4. Tell me about a time you worked on a team.</p>
            </div>
            <div className="question-item">
              <p>5. Do you prefer working independently or on a team.</p>
            </div>
          </div>
          
          {/* Moved Notes Section Up */}
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
          
          {/* Rating Section with Fixed Label Alignment */}
          <div className="rating-section">
            <p className="rating-label">Rate this candidate (1-5)</p>
            
            <div className="rating-buttons-container">
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
                <span className="rating-label-text" style={{ width: '20%', textAlign: 'center' }}>Poor</span>
                <span style={{ width: '60%' }}></span> {/* Spacer */}
                <span className="rating-label-text" style={{ width: '20%', textAlign: 'center' }}>Great</span>
              </div>
            </div>
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
