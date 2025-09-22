import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

export function frameToTime(frame: number, fps: number = 30): number {
  return frame / fps
}

export function timeToFrame(time: number, fps: number = 30): number {
  return Math.floor(time * fps)
}

export function downloadFile(url: string, filename: string) {
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export function exportCameraPathsJSON(cameraPaths: any[], filename: string = 'camera_paths.json') {
  const dataStr = JSON.stringify(cameraPaths, null, 2)
  const dataBlob = new Blob([dataStr], { type: 'application/json' })
  const url = URL.createObjectURL(dataBlob)
  downloadFile(url, filename)
  URL.revokeObjectURL(url)
}
