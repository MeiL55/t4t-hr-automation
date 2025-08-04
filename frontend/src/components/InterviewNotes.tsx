'use client'
import React from 'react'
import styles from '../app/hr_dashboard/HRDashboard.module.css'
import { useState } from 'react'

type DecisionType = 'rejected' | 'secondRound' | 'accepted'

interface InterviewNotesProps {
  applicantId: string
  currentStage: 'interview_1' | 'interview_2'
  onDecision: (decision: DecisionType, notes: string) => void
}

export default function InterviewNotes({ 
  applicantId, 
  currentStage, 
  onDecision 
}: InterviewNotesProps) {
  const [notes, setNotes] = useState('')
  const [rating, setRating] = useState<number | null>(null)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleRatingClick = (selectedRating: number) => {
    if (!isSubmitted) {
      setRating(selectedRating)
    }
  }

  const handleSubmit = async () => {
    if (rating === null) {
      alert('Please select a rating before submitting')
      return
    }

    // Determine decision based on rating
    const decision: DecisionType = 
      rating <= 2 ? 'rejected' :
      rating === 3 && currentStage === 'interview_1' ? 'secondRound' :
      'accepted'

    setIsSubmitting(true)
    
    try {
      await onDecision(decision, notes)
      setIsSubmitted(true)
    } catch (error) {
      console.error('Error submitting interview evaluation:', error)
      alert('Failed to submit evaluation. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className={styles.container}>
      <h3 className={styles.header}>Candidate Evaluation</h3>
      
      <label className={styles.ratingLabel}>Rate this candidate (1-5)</label>
      <div className={styles.ratingContainer}>
  {[1, 2, 3, 4, 5].map((num) => (
    <div key={num} className="flex flex-col items-center">
      <button
        type="button"
        onClick={() => handleRatingClick(num)}
        className={`${styles.ratingButton} ${rating === num ? styles.selected : ''}`}
        disabled={isSubmitted}
        aria-label={`Rate ${num} out of 5`}
      >
        {num}
      </button>
      {num === 1 && (
        <span className="text-xs text-gray-400 mt-1">Poor</span>
      )}
      {num === 5 && (
        <span className="text-xs text-gray-400 mt-1">Great</span>
      )}
    </div>
  ))}
</div>

      <label htmlFor="interview-notes" className={styles.notesLabel}>Evaluation notes</label>
      <textarea
        id="interview-notes"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        className={styles.textarea}
        placeholder="Share your detailed feedback..."
        rows={4}
        disabled={isSubmitted}
      />

      {isSubmitted ? (
        <div className={styles.successMessage}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
          Evaluation submitted successfully!
        </div>
      ) : (
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isSubmitting || isSubmitted}
          className={styles.submitButton}
        >
          {isSubmitting ? (
            <>
              <svg className={styles.spinner} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M12 2v4"></path>
                <path d="M12 18v4"></path>
                <path d="M4.93 4.93l2.83 2.83"></path>
                <path d="M16.24 16.24l2.83 2.83"></path>
                <path d="M2 12h4"></path>
                <path d="M18 12h4"></path>
                <path d="M4.93 19.07l2.83-2.83"></path>
                <path d="M16.24 7.76l2.83-2.83"></path>
              </svg>
              Processing...
            </>
          ) : 'Submit Evaluation'}
        </button>
      )}
    </div>
  )
}
