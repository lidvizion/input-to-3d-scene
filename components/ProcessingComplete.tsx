'use client'

import React, { useEffect, useState } from 'react'
import { CheckCircle, Sparkles, ArrowRight } from 'lucide-react'

interface ProcessingCompleteProps {
  onContinue?: () => void
}

export default function ProcessingComplete({ onContinue }: ProcessingCompleteProps) {
  const [showAnimation, setShowAnimation] = useState(false)

  useEffect(() => {
    // Trigger animation after component mounts
    const timer = setTimeout(() => {
      setShowAnimation(true)
    }, 100)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-8 shadow-sm">
      <div className="max-w-2xl mx-auto text-center">
        {/* Success Icon */}
        <div className={`flex items-center justify-center w-20 h-20 bg-gradient-to-br from-emerald-100 to-emerald-200 dark:from-emerald-900/50 dark:to-emerald-800/50 rounded-full shadow-lg mx-auto mb-6 transition-all duration-500 ${
          showAnimation ? 'scale-100 opacity-100' : 'scale-75 opacity-0'
        }`}>
          <CheckCircle className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
        </div>

        {/* Success Message */}
        <div className={`transition-all duration-700 delay-200 ${
          showAnimation ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
        }`}>
          <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
            Processing Complete!
          </h3>
          <p className="text-lg text-slate-600 dark:text-slate-400 mb-6">
            Your video has been successfully transformed into a 3D scene
          </p>
        </div>

        {/* Features */}
        <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 transition-all duration-700 delay-400 ${
          showAnimation ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
        }`}>
          <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4 shadow-sm border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-indigo-100 to-indigo-200 dark:from-indigo-900/50 dark:to-indigo-800/50 rounded-lg mx-auto mb-3 shadow-sm">
              <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-1">3D Scene</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400">Interactive 3D model</p>
          </div>
          
          <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4 shadow-sm border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-emerald-100 to-emerald-200 dark:from-emerald-900/50 dark:to-emerald-800/50 rounded-lg mx-auto mb-3 shadow-sm">
              <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-1">Keyframes</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400">Optimized frames</p>
          </div>
          
          <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4 shadow-sm border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-amber-100 to-amber-200 dark:from-amber-900/50 dark:to-amber-800/50 rounded-lg mx-auto mb-3 shadow-sm">
              <ArrowRight className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            </div>
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-1">Camera Path</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400">Trajectory data</p>
          </div>
        </div>

        {/* Continue Button */}
        <div className={`transition-all duration-700 delay-600 ${
          showAnimation ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
        }`}>
          <button
            onClick={onContinue}
            className="inline-flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-xl hover:from-indigo-700 hover:to-indigo-800 transition-all duration-200 shadow-lg hover:shadow-xl font-semibold text-lg"
          >
            <span>View 3D Scene</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        {/* Floating particles animation */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className={`absolute w-2 h-2 bg-indigo-400 dark:bg-indigo-500 rounded-full opacity-40 animate-pulse ${
                showAnimation ? 'animate-bounce' : ''
              }`}
              style={{
                left: `${20 + i * 15}%`,
                top: `${30 + (i % 2) * 40}%`,
                animationDelay: `${i * 0.5}s`,
                animationDuration: '2s'
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
