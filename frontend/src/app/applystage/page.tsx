export default function ApplyStagePage() {
  return (
    <div className="application-container">
      <div className="application-card">
        <div className="success-icon">
          <svg className="checkmark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        
        <h1 className="application-title">Application Submitted!</h1>
        
        <p className="application-message">
          You have submitted your application and will be hearing back from us soon!
        </p>
        
        <div className="email-reminder">
          <p className="reminder-text">
            Remember to check your email inbox (and junk email)
          </p>
        </div>
      </div>
    </div>
  )
}