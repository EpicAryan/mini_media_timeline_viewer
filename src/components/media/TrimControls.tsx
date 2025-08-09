'use client'

import React, { useState, useEffect } from 'react'
import { Scissors, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useAppSelector, useAppDispatch } from '@/store'
import { updateTrimRange } from '@/store/slices/mediaSlice'
import { formatTime } from '@/utils/mediaUtils'

export const TrimControls = () => {
  const dispatch = useAppDispatch()
  const { files, selectedFileId } = useAppSelector(state => state.media)
  
  const selectedFile = files.find(file => file.id === selectedFileId)
  
  const [trimStart, setTrimStart] = useState('')
  const [trimEnd, setTrimEnd] = useState('')
  const [errors, setErrors] = useState<{ start?: string; end?: string }>({})


  useEffect(() => {
    if (selectedFile) {
      setTrimStart(selectedFile.trimStart.toString())
      setTrimEnd(selectedFile.trimEnd.toString())
      setErrors({})
    } else {
      setTrimStart('')
      setTrimEnd('')
      setErrors({})
    }
  }, [selectedFile])

  const validateTrimValues = (startStr: string, endStr: string) => {
    const newErrors: { start?: string; end?: string } = {}
    
    const start = parseFloat(startStr)
    const end = parseFloat(endStr)
    
    if (isNaN(start) || start < 0) {
      newErrors.start = 'Start time must be a positive number'
    }
    
    if (isNaN(end) || end <= 0) {
      newErrors.end = 'End time must be greater than 0'
    }
    
    if (selectedFile) {
      if (start >= selectedFile.duration) {
        newErrors.start = 'Start time cannot exceed file duration'
      }
      
      if (end > selectedFile.duration) {
        newErrors.end = 'End time cannot exceed file duration'
      }
      
      if (!newErrors.start && !newErrors.end && end <= start) {
        newErrors.end = 'End time must be greater than start time'
      }
    }
    
    return newErrors
  }

  const handleApplyTrim = () => {
    if (!selectedFile) return
    
    const newErrors = validateTrimValues(trimStart, trimEnd)
    setErrors(newErrors)
    
    if (Object.keys(newErrors).length === 0) {
      dispatch(updateTrimRange({
        id: selectedFile.id,
        trimStart: parseFloat(trimStart),
        trimEnd: parseFloat(trimEnd)
      }))
    }
  }

  const handleResetTrim = () => {
    if (!selectedFile) return
    
    setTrimStart('0')
    setTrimEnd(selectedFile.duration.toString())
    setErrors({})
    
    dispatch(updateTrimRange({
      id: selectedFile.id,
      trimStart: 0,
      trimEnd: selectedFile.duration
    }))
  }

  if (!selectedFile) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-semibold text-primary mb-2">Trim Controls</h2>
          <p className="text-sm text-secondary">
            Select a media file to edit trim settings
          </p>
        </div>
        
        <div className="text-center py-12">
          <Scissors size={48} className="mx-auto text-muted mb-4" />
          <p className="text-secondary">No file selected</p>
          <p className="text-sm text-muted mt-2">
            Click on a timeline block or select from the player
          </p>
        </div>
      </div>
    )
  }

  if (selectedFile.type === 'image') {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-semibold text-primary mb-2">File Info</h2>
          <p className="text-sm text-secondary">
            Image files don&apos;t support trimming
          </p>
        </div>
        
        <div className="bg-surface border border-primary rounded-lg p-4">
          <h3 className="font-medium text-primary mb-3">{selectedFile.name}</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-secondary">Type:</span>
              <span className="text-primary">Image</span>
            </div>
            <div className="flex justify-between">
              <span className="text-secondary">Size:</span>
              <span className="text-primary">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const currentDuration = parseFloat(trimEnd) - parseFloat(trimStart)
  const isValidTrim = currentDuration > 0 && Object.keys(errors).length === 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-lg font-semibold text-primary mb-2">Trim Controls</h2>
        <p className="text-sm text-secondary">
          Adjust the start and end times for your media
        </p>
      </div>

      {/* File Info */}
      <div className="bg-surface border border-primary rounded-lg p-4">
        <h3 className="font-medium text-primary mb-3">{selectedFile.name}</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-secondary">Duration:</span>
            <span className="text-primary font-mono">{formatTime(selectedFile.duration)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-secondary">Current Trim:</span>
            <span className="text-primary font-mono">
              {isValidTrim ? formatTime(currentDuration) : '--:--'}
            </span>
          </div>
        </div>
      </div>

      {/* Trim Inputs */}
      <div className="space-y-4">
        <Input
          label="Start Time (seconds)"
          type="number"
          step="0.1"
          min="0"
          max={selectedFile.duration}
          value={trimStart}
          onChange={(e) => setTrimStart(e.target.value)}
          error={errors.start}
          placeholder="0"
        />
        
        <Input
          label="End Time (seconds)"
          type="number"
          step="0.1"
          min="0"
          max={selectedFile.duration}
          value={trimEnd}
          onChange={(e) => setTrimEnd(e.target.value)}
          error={errors.end}
          placeholder={selectedFile.duration.toString()}
        />
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <Button
          variant="primary"
          onClick={handleApplyTrim}
          disabled={!isValidTrim}
          className="w-full"
        >
          <Scissors size={16} />
          Apply Trim
        </Button>
        
        <Button
          variant="secondary"
          onClick={handleResetTrim}
          className="w-full"
        >
          <RotateCcw size={16} />
          Reset to Original
        </Button>
      </div>

      {/* Trim Preview */}
      {isValidTrim && (
        <div className="bg-surface border border-primary rounded-lg p-4">
          <h4 className="text-sm font-medium text-primary mb-3">Trim Preview</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-secondary">Start:</span>
              <span className="text-primary font-mono">{formatTime(parseFloat(trimStart))}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-secondary">End:</span>
              <span className="text-primary font-mono">{formatTime(parseFloat(trimEnd))}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-secondary">New Duration:</span>
              <span className="text-primary font-mono">{formatTime(currentDuration)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
