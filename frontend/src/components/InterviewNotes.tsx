'use client'

import React, { useEffect, useState } from 'react'
import axios from 'axios'
import '../app/globals.css'
interface InterviewNotesProps {
  applicantId: number
  stage: string // 'interview_1' | 'interview_2'
}

function InterviewNotes({ applicantId, stage }: InterviewNotesProps) {
  const [selectedRating, setSelectedRating] = useState<number | null>(null)
  const [notes, setNotes] = useState('')
  const [lastUpdated, setLastUpdated] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [previousRating, setPreviousRating] = useState<number | null>(null)
  const [previousNotes, setPreviousNotes] = useState<string | null>(null)

  // Load current evaluation
  useEffect(() => {
    // Clear old data first
    setSelectedRating(null)
    setNotes('')
    setLastUpdated(null)

    if (stage !== 'interview_1' && stage !== 'interview_2') return

    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/api/evaluation/get`, {
        params: {
          application_id: applicantId,
          stage,
        },
      })
      .then((res) => {
        if (res.data.found) {
          setSelectedRating(res.data.rating)
          setNotes(res.data.notes)
          setLastUpdated(res.data.updated_at)
        }
      })
      .catch((err) => {
        console.error('Failed to load evaluation', err)
      })
  }, [applicantId, stage])

  // Load previous round's evaluation (only in interview_2)
  useEffect(() => {
    setPreviousRating(null)
    setPreviousNotes(null)

    if (stage === 'interview_2') {
      axios
        .get(`${process.env.NEXT_PUBLIC_API_URL}/api/evaluation/get`, {
          params: {
            application_id: applicantId,
            stage: 'interview_1',
          },
        })
        .then((res) => {
          if (res.data.found) {
            setPreviousRating(res.data.rating)
            setPreviousNotes(res.data.notes)
          }
        })
        .catch((err) => {
          console.error('Failed to load previous round evaluation', err)
        })
    }
  }, [applicantId, stage])

  const handleRatingClick = (rating: number) => {
    setSelectedRating(rating)
  }

  const handleNotesChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNotes(event.target.value)
  }

  const handleSave = async () => {
    if (!selectedRating) {
      alert('Please select a rating before saving.')
      return
    }

    setIsSubmitting(true)
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/evaluation/save`, {
        application_id: applicantId,
        stage,
        rating: selectedRating,
        notes,
      })

      setLastUpdated(new Date().toISOString())
    } catch (err) {
      alert('Failed to save evaluation.')
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (stage !== 'interview_1' && stage !== 'interview_2') {
    return null
  }

  return (
    <div className="interview-evaluation">
      <h3 className="evaluation-title">Interview Evaluation</h3>
      {/* Read-only feedback from first round */}
      {stage === 'interview_2' && previousRating !== null && (
        <div className="previous-feedback">
          <h4 className="feedback-header">First Round Feedback</h4>
          <div className="feedback-content">
            <div className="rating-info">
              <span>Rating: <strong>{previousRating}</strong></span>
            </div>
            <div className="notes-info">
              <p>{previousNotes}</p>
            </div>
          </div>
        </div>
      )}
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
          <button
            className="save-button"
            onClick={handleSave}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : 'Save Evaluation'}
          </button>
        </div>

        {lastUpdated && (
          <p className="text-xs text-gray-500 mt-2">
            Last saved at {new Date(lastUpdated).toLocaleString()}
          </p>
        )}
      </div>
    </div>
  )
}

export default InterviewNotes
