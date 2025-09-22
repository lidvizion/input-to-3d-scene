'use client'

import React, { useState, useEffect } from 'react'
import { Play, Camera, Download, Moon, Sun, Upload, Loader2, CheckCircle } from 'lucide-react'
import VideoPlayer from '@/components/VideoPlayer'
import SceneViewer from '@/components/SceneViewer'
import ExportPanel from '@/components/ExportPanel'
import UploadArea from '@/components/UploadArea'
import LoadingState from '@/components/LoadingState'
import ProcessingFlow from '@/components/ProcessingFlow'
import ProcessingComplete from '@/components/ProcessingComplete'
import ErrorBoundary from '@/components/ErrorBoundary'
import { ThemeProvider, useTheme } from '@/components/ThemeProvider'
import { ReconstructionResponse, ExportData } from '@/types'
import { logger } from '@/utils/logger'

function MainContent() {
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [videoUrl, setVideoUrl] = useState<string>('/sample/walkaround.mp4')
  const [reconstructionData, setReconstructionData] = useState<ReconstructionResponse | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [processingComplete, setProcessingComplete] = useState(false)
  const [showCompletion, setShowCompletion] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [showCameraPath, setShowCameraPath] = useState(true)
  const [activeTab, setActiveTab] = useState<'video' | 'scene'>('video')
  const { theme, toggleTheme } = useTheme()

  // Load mock data on component mount
  useEffect(() => {
    const loadMockData = async () => {
      try {
        const response = await fetch('/mock/response.json')
        const data = await response.json()
        setReconstructionData(data)
      } catch (error) {
        console.error('Failed to load mock data:', error)
      }
    }
    loadMockData()
  }, [])

  const handleFileUpload = (file: File) => {
    logger.userAction('video_upload_started', {
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type
    })

    setVideoFile(file)
    setVideoUrl(URL.createObjectURL(file))
    setIsProcessing(true)
    setProcessingComplete(false)
    setShowCompletion(false)
    setReconstructionData(null)
    
    // Simulate processing delay
    setTimeout(() => {
      setIsProcessing(false)
      setShowCompletion(true)
      logger.userAction('video_processing_completed', {
        fileName: file.name
      })
    }, 12000) // 12 seconds for the full processing flow
  }

  const handleProcessingComplete = () => {
    setProcessingComplete(true)
    // Load mock data after processing completes
    loadMockData()
  }

  const handleContinueToScene = () => {
    setShowCompletion(false)
    setProcessingComplete(true)
    setActiveTab('scene')
    // Load mock data
    loadMockData()
  }

  const loadMockData = async () => {
    try {
      logger.info('Loading mock reconstruction data')
      const response = await fetch('/mock/response.json')
      const data = await response.json()
      setReconstructionData(data)
      logger.info('Mock reconstruction data loaded successfully')
    } catch (error) {
      logger.error('Failed to load mock data', error as Error)
    }
  }

  const handleTimeUpdate = (time: number) => {
    setCurrentTime(time)
  }

  const handleKeyframeClick = (frame: number) => {
    // In a real implementation, this would seek to the specific frame
    console.log('Clicked keyframe:', frame)
  }

  const handleToggleCameraPath = () => {
    setShowCameraPath(!showCameraPath)
  }

  const exportData: ExportData = {
    glbUrl: reconstructionData?.artifact,
    cameraPaths: reconstructionData?.camera_paths || [],
    keyframes: reconstructionData?.keyframes || []
  }

  return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
          {/* Header */}
          <header className="sticky top-0 z-50 bg-white/95 dark:bg-slate-950/95 backdrop-blur-sm border-b border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="max-w-7xl mx-auto px-6">
              <div className="flex items-center justify-between h-16">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-xl shadow-sm">
                    <Camera className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h1 className="text-xl font-semibold text-slate-900 dark:text-white tracking-tight">
                      Video to 3D Scene
                    </h1>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Professional scene reconstruction from video
                    </p>
                  </div>
                </div>
            
                <div className="flex items-center space-x-4">
                  {/* Status indicator */}
                  <div className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    <div className={`w-2 h-2 rounded-full ${
                      reconstructionData ? 'bg-emerald-500' : 'bg-amber-500'
                    }`} />
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      {reconstructionData ? 'Ready' : 'Processing'}
                    </span>
                  </div>

                  {/* Theme toggle */}
                  <button
                    onClick={toggleTheme}
                    className="flex items-center justify-center w-10 h-10 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-slate-200 dark:border-slate-700"
                    aria-label="Toggle theme"
                  >
                    {theme === 'light' ? (
                      <Moon className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                    ) : (
                      <Sun className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                    )}
                  </button>
                </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Upload Section */}
        <div className="mb-8">
          <UploadArea 
            onFileSelect={handleFileUpload}
            isProcessing={isProcessing}
          />
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Video Player */}
          <div className="lg:col-span-2 space-y-6">
            {/* Processing Flow */}
            {isProcessing && (
              <ProcessingFlow 
                isProcessing={isProcessing}
                onComplete={handleProcessingComplete}
              />
            )}

            {/* Processing Complete */}
            {showCompletion && (
              <ProcessingComplete 
                onContinue={handleContinueToScene}
              />
            )}

            {/* Tab Navigation - Only show when not processing and not showing completion */}
            {!isProcessing && !showCompletion && (
              <div className="flex space-x-1 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-xl border border-slate-200 dark:border-slate-700">
                <button
                  onClick={() => setActiveTab('video')}
                  className={`flex items-center space-x-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    activeTab === 'video'
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm border border-slate-200 dark:border-slate-600'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                  }`}
                >
                  <Play className="w-4 h-4" />
                  <span>Video</span>
                </button>
                <button
                  onClick={() => setActiveTab('scene')}
                  className={`flex items-center space-x-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    activeTab === 'scene'
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm border border-slate-200 dark:border-slate-600'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                  }`}
                >
                  <Camera className="w-4 h-4" />
                  <span>3D Scene</span>
                </button>
              </div>
            )}

            {/* Content - Only show when not processing and not showing completion */}
            {!isProcessing && !showCompletion && (
              <>
                {activeTab === 'video' ? (
                  <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
                    <VideoPlayer
                      videoUrl={videoUrl}
                      keyframes={reconstructionData?.keyframes || []}
                      onTimeUpdate={handleTimeUpdate}
                      onKeyframeClick={handleKeyframeClick}
                    />
                  </div>
                ) : (
                  <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden h-96 shadow-sm">
                    <SceneViewer
                      sceneUrl={reconstructionData?.artifact}
                      cameraPaths={reconstructionData?.camera_paths || []}
                      showCameraPath={showCameraPath}
                      onToggleCameraPath={handleToggleCameraPath}
                    />
                  </div>
                )}
              </>
            )}
          </div>

          {/* Right Column - Export Panel */}
          <div className="space-y-6">
            {isProcessing || showCompletion ? (
              <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
                <div className="text-center">
                  <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-indigo-100 to-indigo-200 dark:from-indigo-900/50 dark:to-indigo-800/50 rounded-xl shadow-sm mx-auto mb-4">
                    {isProcessing ? (
                      <Loader2 className="w-6 h-6 text-indigo-600 dark:text-indigo-400 animate-spin" />
                    ) : (
                      <CheckCircle className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                    )}
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                    {isProcessing ? 'Preparing Export' : 'Export Ready'}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {isProcessing 
                      ? 'Export options will be available once processing is complete'
                      : 'Your 3D scene is ready for export'
                    }
                  </p>
                </div>
              </div>
            ) : (
              <ExportPanel
                exportData={exportData}
                isProcessing={isProcessing}
              />
            )}

            {/* Scene Information - Only show when not processing, not showing completion, and data is available */}
            {!isProcessing && !showCompletion && reconstructionData && (
              <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">Scene Information</h3>
                <div className="space-y-4 text-sm">
                  <div className="flex justify-between items-center py-2">
                    <span className="text-slate-600 dark:text-slate-400 font-medium">Frames</span>
                    <span className="font-semibold text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-lg">
                      {reconstructionData.scene_metadata.total_frames.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-slate-600 dark:text-slate-400 font-medium">Duration</span>
                    <span className="font-semibold text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-lg">
                      {reconstructionData.scene_metadata.duration}s
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-slate-600 dark:text-slate-400 font-medium">FPS</span>
                    <span className="font-semibold text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-lg">
                      {reconstructionData.scene_metadata.fps}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-slate-600 dark:text-slate-400 font-medium">Resolution</span>
                    <span className="font-semibold text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-lg">
                      {reconstructionData.scene_metadata.resolution}
                    </span>
                  </div>
                  <div className="pt-4 border-t border-slate-200 dark:border-slate-700 space-y-3">
                    <div className="flex justify-between items-center py-2">
                      <span className="text-slate-600 dark:text-slate-400 font-medium">Keyframes</span>
                      <span className="font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 px-3 py-1 rounded-lg">
                        {reconstructionData.keyframes.length}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-slate-600 dark:text-slate-400 font-medium">Camera Points</span>
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-3 py-1 rounded-lg">
                        {reconstructionData.camera_paths.length}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

export default function Home() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <MainContent />
      </ThemeProvider>
    </ErrorBoundary>
  )
}
