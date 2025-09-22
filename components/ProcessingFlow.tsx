'use client'

import React, { useState, useEffect } from 'react'
import { CheckCircle, Loader2, Video, Camera, Zap, Download } from 'lucide-react'
import { logger } from '@/utils/logger'

interface ProcessingStep {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  duration: number
}

interface ProcessingFlowProps {
  isProcessing: boolean
  onComplete?: () => void
}

export default function ProcessingFlow({ isProcessing, onComplete }: ProcessingFlowProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [progress, setProgress] = useState(0)

  const steps: ProcessingStep[] = [
    {
      id: 'upload',
      title: 'Processing Video',
      description: 'Analyzing video frames and extracting metadata',
      icon: <Video className="w-5 h-5" />,
      duration: 2000
    },
    {
      id: 'keyframes',
      title: 'Extracting Keyframes',
      description: 'Identifying optimal frames for 3D reconstruction',
      icon: <Camera className="w-5 h-5" />,
      duration: 3000
    },
    {
      id: 'reconstruction',
      title: '3D Reconstruction',
      description: 'Generating 3D scene using neural radiance fields',
      icon: <Zap className="w-5 h-5" />,
      duration: 4000
    },
    {
      id: 'optimization',
      title: 'Scene Optimization',
      description: 'Optimizing geometry and preparing for export',
      icon: <Download className="w-5 h-5" />,
      duration: 2000
    }
  ]

  useEffect(() => {
    if (!isProcessing) {
      setCurrentStep(0)
      setProgress(0)
      return
    }

    let stepIndex = 0
    let stepProgress = 0
    const totalDuration = steps.reduce((sum, step) => sum + step.duration, 0)

    const interval = setInterval(() => {
      stepProgress += 50
      const currentStepDuration = steps[stepIndex]?.duration || 0
      
      if (stepProgress >= currentStepDuration && stepIndex < steps.length - 1) {
        stepIndex++
        stepProgress = 0
        setCurrentStep(stepIndex)
      }

      const overallProgress = ((stepIndex * 1000 + stepProgress) / totalDuration) * 100
      setProgress(Math.min(overallProgress, 100))

      if (overallProgress >= 100) {
        clearInterval(interval)
        logger.processingStep('completed', 'all', { progress: 100 })
        setTimeout(() => {
          onComplete?.()
        }, 500)
      }
    }, 50)

    return () => clearInterval(interval)
  }, [isProcessing, onComplete])

  if (!isProcessing) return null

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-8 shadow-sm">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-100 to-indigo-200 dark:from-indigo-900/50 dark:to-indigo-800/50 rounded-2xl shadow-sm mx-auto mb-4">
            <Zap className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            Creating 3D Scene
          </h3>
          <p className="text-slate-600 dark:text-slate-400">
            Transforming your video into a detailed 3D reconstruction
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm font-medium text-slate-600 dark:text-slate-400 mb-3">
            <span>Processing Progress</span>
            <span className="text-indigo-600 dark:text-indigo-400">{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden border border-slate-200 dark:border-slate-700">
            <div 
              className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 dark:from-indigo-400 dark:to-emerald-400 rounded-full transition-all duration-500 ease-out shadow-sm"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Steps */}
        <div className="space-y-4">
          {steps.map((step, index) => {
            const isActive = index === currentStep
            const isCompleted = index < currentStep
            const isPending = index > currentStep

            return (
              <div
                key={step.id}
                className={`flex items-center space-x-4 p-4 rounded-lg transition-all duration-300 border ${
                  isActive
                    ? 'bg-indigo-50 dark:bg-indigo-900/20 shadow-sm border-indigo-200 dark:border-indigo-700'
                    : isCompleted
                    ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-700'
                    : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700'
                }`}
              >
                {/* Icon */}
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-300 shadow-sm ${
                    isActive
                      ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400'
                      : isCompleted
                      ? 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-400 dark:text-slate-500'
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : isActive ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    step.icon
                  )}
                </div>

                {/* Content */}
                <div className="flex-1">
                  <h4
                    className={`font-semibold transition-colors ${
                      isActive
                        ? 'text-slate-900 dark:text-white'
                        : isCompleted
                        ? 'text-emerald-900 dark:text-emerald-100'
                        : 'text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    {step.title}
                  </h4>
                  <p
                    className={`text-sm transition-colors ${
                      isActive
                        ? 'text-slate-600 dark:text-slate-300'
                        : isCompleted
                        ? 'text-emerald-700 dark:text-emerald-300'
                        : 'text-slate-400 dark:text-slate-500'
                    }`}
                  >
                    {step.description}
                  </p>
                </div>

                {/* Status */}
                {isActive && (
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-indigo-500 dark:bg-indigo-400 rounded-full animate-pulse"></div>
                      <div className="w-2 h-2 bg-indigo-500 dark:bg-indigo-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-2 h-2 bg-indigo-500 dark:bg-indigo-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                    <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400">Processing...</span>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
            <div className="w-2 h-2 bg-amber-500 dark:bg-amber-400 rounded-full animate-pulse"></div>
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
              This process typically takes 30-60 seconds depending on video complexity
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
