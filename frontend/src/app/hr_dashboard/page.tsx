'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import axios from 'axios'
import { Applicant } from '../types/applicant'
import StageFilter from '../../components/StageFilter'
import ApplicantList from '../../components/ApplicantList'
import ApplicantDetail from '../../components/ApplicantDetail'

export default function HRDashboard() {
  const [applicants, setApplicants] = useState<Applicant[]>([])
  const [selected, setSelected] = useState<Applicant | null>(null)
  const [stageFilter, setStageFilter] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [sidebarWidth, setSidebarWidth] = useState(33)
  const [isResizing, setIsResizing] = useState(false)
  
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetchApplicants()
  }, [])

  const fetchApplicants = async () => {
    try {
      const token = localStorage.getItem("token")
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/hr_dashboard`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
      })
      setApplicants(res.data)
    } catch (err) {
      console.error('Error fetching applicants:', err)
    }
  }

  const updateStage = async (applicationId: number, newStage: string) => {
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/update_stage`, {
        application_id: applicationId,
        new_stage: newStage,
      })
      await fetchApplicants()
      setSelected(null)
    } catch (err) {
      console.error('Stage update failed:', err)
    }
  }

  const handleMouseDown = useCallback(() => {
    setIsResizing(true)
  }, [])

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isResizing || !containerRef.current) return

    const containerRect = containerRef.current.getBoundingClientRect()
    const newWidth = ((e.clientX - containerRect.left) / containerRect.width) * 100
    
    // Constrain between 25% and 60%
    if (newWidth >= 25 && newWidth <= 60) {
      setSidebarWidth(newWidth)
    }
  }, [isResizing])

  const handleMouseUp = useCallback(() => {
    setIsResizing(false)
  }, [])

  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      document.body.style.cursor = 'ew-resize'
      document.body.style.userSelect = 'none'
    } else {
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }
  }, [isResizing, handleMouseMove, handleMouseUp])

  const filtered = applicants.filter(
    (app) =>
      (stageFilter === '' || app.stage === stageFilter) &&
      app.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div 
      ref={containerRef}
      className={`resizable-dashboard ${isResizing ? 'resizing' : ''}`}
    >
      {/* Sidebar */}
      <div 
        className="sidebar-resizable"
        style={{ width: `${sidebarWidth}%` }}
      >
        <div className="sidebar-header">
          <h2 className="sidebar-title">
            Applicants
            <span className="applicant-count">{filtered.length}</span>
          </h2>
        </div>
        
        <div className="sidebar-content">
          <StageFilter
            stageFilter={stageFilter}
            onStageChange={setStageFilter}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
          />
          <ApplicantList
            applicants={filtered}
            selected={selected}
            onSelect={setSelected}
          />
        </div>
      </div>

      {/* Resizable Divider */}
      <div 
        className="resize-handle"
        onMouseDown={handleMouseDown}
      >
        <div className="resize-handle-line"></div>
        <div className="resize-handle-dots">
          <div className="resize-dot"></div>
          <div className="resize-dot"></div>
          <div className="resize-dot"></div>
        </div>
      </div>

      {/* Detail Panel */}
      <div 
        className="detail-panel-resizable"
        style={{ width: `${100 - sidebarWidth}%` }}
      >
        <ApplicantDetail applicant={selected} onStageUpdate={updateStage} />
      </div>
    </div>
  )
}