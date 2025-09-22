'use client'

import React from 'react'
import { Loader2 } from 'lucide-react'

interface LoadingStateProps {
  message?: string
  submessage?: string
}

export default function LoadingState({ 
  message = "Processing video...", 
  submessage = "Extracting keyframes and analyzing camera movement" 
}: LoadingStateProps) {
  return (
    <div className="bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 border border-indigo-200 dark:border-indigo-800 rounded-xl p-6 shadow-sm">
      <div className="flex items-center space-x-4">
        <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-indigo-100 to-indigo-200 dark:from-indigo-900/50 dark:to-indigo-800/50 rounded-xl shadow-sm">
          <Loader2 className="w-6 h-6 text-indigo-600 dark:text-indigo-400 animate-spin" />
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-indigo-900 dark:text-indigo-100 text-lg">{message}</h4>
          <p className="text-sm text-indigo-700 dark:text-indigo-300 mt-1">
            {submessage}
          </p>
        </div>
      </div>
    </div>
  )
}