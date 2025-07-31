'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'

export default function ApplyStagePage() {
  const [status, setStatus] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const searchParams = useSearchParams()

  useEffect(() => {
    const queryStatus = searchParams.get('status')
    console.log(queryStatus)

    if (queryStatus) {
      setStatus(queryStatus)
      setLoading(false)
    } else {
      // fallback: fetch from backend
      async function fetchStatus() {
        try {
          const res = await fetch('/api/application_status', {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          })
          if (!res.ok) throw new Error('Failed to fetch')

          const data = await res.json()
          setStatus(data.status)
        } catch (err) {
          console.error('Error fetching status:', err)
          setStatus('unknown')
        } finally {
          setLoading(false)
        }
      }

      fetchStatus()
    }
  }, [searchParams])

  return (
  <div className="flex flex-col justify-center items-center h-screen text-center px-4 font-sans">
    <h1 className="text-2xl font-bold mb-4">Don’t worry!</h1>

    {loading ? (
      <p className="text-gray-500">Loading your application status...</p>
    ) : (
      <>
        <p className="text-lg text-gray-700 mb-2">
          Your application is currently at the stage of:{' '}
          <span className="font-semibold text-blue-600">{status}</span>
        </p>
        <p className="text-md text-gray-600">
          You will be hearing from us soon via email.
        </p>
      </>
    )}
  </div>
)

}
