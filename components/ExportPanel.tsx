'use client'

import React, { useState } from 'react'
import { Download, FileJson, Package, Loader2 } from 'lucide-react'
import { exportCameraPathsJSON, downloadFile } from '@/lib/utils'
import { ExportData } from '@/types'

interface ExportPanelProps {
  exportData: ExportData
  isProcessing?: boolean
}

export default function ExportPanel({ exportData, isProcessing = false }: ExportPanelProps) {
  const [isExporting, setIsExporting] = useState(false)

  const handleExportGLB = async () => {
    if (!exportData.glbUrl) {
      // Simulate GLB generation for demo
      setIsExporting(true)
      await new Promise(resolve => setTimeout(resolve, 2000))
      setIsExporting(false)
      
      // In a real implementation, this would download the actual GLB file
      alert('GLB export simulated - in production this would download the actual 3D model file')
      return
    }

    try {
      downloadFile(exportData.glbUrl, 'reconstructed_scene.glb')
    } catch (error) {
      console.error('Failed to export GLB:', error)
      alert('Failed to export GLB file')
    }
  }

  const handleExportCameraPaths = () => {
    try {
      exportCameraPathsJSON(exportData.cameraPaths, 'camera_paths.json')
    } catch (error) {
      console.error('Failed to export camera paths:', error)
      alert('Failed to export camera paths')
    }
  }

  const handleExportAll = async () => {
    setIsExporting(true)
    
    try {
      // Export camera paths
      exportCameraPathsJSON(exportData.cameraPaths, 'camera_paths.json')
      
      // Simulate GLB export
      if (!exportData.glbUrl) {
        await new Promise(resolve => setTimeout(resolve, 2000))
        alert('GLB export simulated - in production this would download the actual 3D model file')
      } else {
        downloadFile(exportData.glbUrl, 'reconstructed_scene.glb')
      }
    } catch (error) {
      console.error('Failed to export files:', error)
      alert('Failed to export files')
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Export</h3>
        {isProcessing && (
          <div className="flex items-center text-sm text-indigo-600 dark:text-indigo-400 font-medium">
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Processing
          </div>
        )}
      </div>

      <div className="space-y-4">
        {/* GLB Export */}
        <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
          <div className="flex items-center space-x-4">
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-indigo-100 to-indigo-200 dark:from-indigo-900/30 dark:to-indigo-800/30 rounded-lg shadow-sm">
              <Package className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-slate-900 dark:text-white">3D Scene (GLB)</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Export 3D scene file
              </p>
            </div>
          </div>
          <button
            onClick={handleExportGLB}
            disabled={isExporting || isProcessing}
            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-lg hover:from-indigo-700 hover:to-indigo-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 text-sm font-medium shadow-sm hover:shadow-md"
          >
            {isExporting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            <span>Export</span>
          </button>
        </div>

        {/* Camera Paths Export */}
        <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
          <div className="flex items-center space-x-4">
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-emerald-100 to-emerald-200 dark:from-emerald-900/30 dark:to-emerald-800/30 rounded-lg shadow-sm">
              <FileJson className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Camera Paths (JSON)</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Export camera trajectory data
              </p>
            </div>
          </div>
          <button
            onClick={handleExportCameraPaths}
            disabled={isExporting || isProcessing || exportData.cameraPaths.length === 0}
            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-lg hover:from-emerald-700 hover:to-emerald-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 text-sm font-medium shadow-sm hover:shadow-md"
          >
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>

        {/* Export All */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
          <button
            onClick={handleExportAll}
            disabled={isExporting || isProcessing}
            className="w-full flex items-center justify-center space-x-3 px-4 py-3 bg-gradient-to-r from-slate-800 to-slate-900 dark:from-slate-100 dark:to-slate-200 text-white dark:text-slate-900 rounded-lg hover:from-slate-700 hover:to-slate-800 dark:hover:from-slate-200 dark:hover:to-slate-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 text-sm font-semibold shadow-lg hover:shadow-xl"
          >
            {isExporting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            <span>Export All</span>
          </button>
        </div>
      </div>
    </div>
  )
}
