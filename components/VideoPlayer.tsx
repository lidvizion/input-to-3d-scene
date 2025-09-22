'use client'

import React, { useRef, useState, useEffect } from 'react'
import { Play, Pause, Volume2, VolumeX } from 'lucide-react'
import { formatTime, frameToTime, timeToFrame } from '@/lib/utils'
import { VideoPlayerProps } from '@/types'

export default function VideoPlayer({ 
  videoUrl, 
  keyframes, 
  onTimeUpdate, 
  onKeyframeClick 
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleTimeUpdate = () => {
      const time = video.currentTime
      setCurrentTime(time)
      setProgress((time / duration) * 100)
      onTimeUpdate(time)
    }

    const handleLoadedMetadata = () => {
      setDuration(video.duration)
    }

    video.addEventListener('timeupdate', handleTimeUpdate)
    video.addEventListener('loadedmetadata', handleLoadedMetadata)

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate)
      video.removeEventListener('loadedmetadata', handleLoadedMetadata)
    }
  }, [duration, onTimeUpdate])

  const togglePlay = () => {
    const video = videoRef.current
    if (!video) return

    if (isPlaying) {
      video.pause()
    } else {
      video.play()
    }
    setIsPlaying(!isPlaying)
  }

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const video = videoRef.current
    if (!video) return

    const rect = e.currentTarget.getBoundingClientRect()
    const clickX = e.clientX - rect.left
    const newTime = (clickX / rect.width) * duration
    video.currentTime = newTime
    setCurrentTime(newTime)
  }

  const toggleMute = () => {
    const video = videoRef.current
    if (!video) return

    video.muted = !isMuted
    setIsMuted(!isMuted)
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current
    if (!video) return

    const newVolume = parseFloat(e.target.value)
    video.volume = newVolume
    setVolume(newVolume)
    setIsMuted(newVolume === 0)
  }

  const getKeyframePosition = (frame: number) => {
    const time = frameToTime(frame)
    return (time / duration) * 100
  }

  return (
    <div className="w-full bg-gray-900 dark:bg-gray-950 rounded-lg overflow-hidden">
      <div className="relative group">
        <video
          ref={videoRef}
          src={videoUrl}
          className="w-full h-auto"
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        />
        
        {/* Keyframe markers overlay */}
        <div className="absolute bottom-16 left-0 right-0 h-1 bg-transparent">
          {keyframes.map((frame) => (
            <button
              key={frame}
              onClick={() => onKeyframeClick(frame)}
              className="absolute w-2 h-2 bg-yellow-400 rounded-full border border-white transform -translate-x-1/2 hover:scale-110 transition-transform"
              style={{ left: `${getKeyframePosition(frame)}%` }}
              title={`Keyframe ${frame}`}
            />
          ))}
        </div>
        
        {/* Play overlay */}
        {!isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="flex items-center justify-center w-12 h-12 bg-white/90 rounded-full">
              <Play className="w-4 h-4 text-gray-900 ml-0.5" />
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="p-4 bg-gray-800 dark:bg-gray-900">
        <div className="flex items-center space-x-3">
          <button
            onClick={togglePlay}
            className="flex items-center justify-center w-8 h-8 text-white hover:bg-gray-700 rounded-md transition-colors"
          >
            {isPlaying ? <Pause size={16} /> : <Play size={16} />}
          </button>

          <div className="flex-1 relative">
            <div
              className="h-1 bg-gray-600 dark:bg-gray-700 rounded-full cursor-pointer"
              onClick={handleSeek}
            >
              <div
                className="h-full bg-blue-500 rounded-full transition-all"
                style={{ width: `${progress}%` }}
              />
              {keyframes.map((frame) => (
                <div
                  key={frame}
                  className="absolute top-0 w-0.5 h-1 bg-yellow-400 transform -translate-x-1/2"
                  style={{ left: `${getKeyframePosition(frame)}%` }}
                />
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-1 text-white text-xs font-mono">
            <span>{formatTime(currentTime)}</span>
            <span className="text-gray-400">/</span>
            <span>{formatTime(duration)}</span>
          </div>

          <button
            onClick={toggleMute}
            className="flex items-center justify-center w-8 h-8 text-white hover:bg-gray-700 rounded-md transition-colors"
          >
            {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>

          <div className="w-16">
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              className="w-full h-1 bg-gray-600 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
