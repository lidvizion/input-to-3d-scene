'use client'

import React, { Suspense, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { CameraPath, SceneViewerProps } from '@/types'
import * as THREE from 'three'

// Camera path visualization component
function CameraPathVisualization({ cameraPaths, showCameraPath }: { cameraPaths: CameraPath[], showCameraPath: boolean }) {
  if (!showCameraPath || cameraPaths.length === 0) return null

  return (
    <group>
      {/* Camera path line */}
      <line>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={cameraPaths.length}
            array={new Float32Array(cameraPaths.flatMap(path => path.position))}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#10b981" linewidth={2} />
      </line>
      
      {/* Camera positions as small spheres */}
      {cameraPaths.map((path, index) => (
        <mesh key={index} position={path.position}>
          <sphereGeometry args={[0.05, 8, 6]} />
          <meshBasicMaterial color="#f43f5e" />
        </mesh>
      ))}
    </group>
  )
}

// Placeholder scene object
function SceneObject() {
  const meshRef = useRef<THREE.Mesh>(null)
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.2
    }
  })

  return (
    <group>
      {/* Main object - a stylized building/room */}
      <mesh ref={meshRef} position={[0, 0, 0]}>
        <boxGeometry args={[2, 2, 2]} />
        <meshBasicMaterial color="#6366f1" wireframe />
      </mesh>
      
      {/* Additional scene elements */}
      <mesh position={[3, 0, 0]}>
        <sphereGeometry args={[0.5, 16, 12]} />
        <meshBasicMaterial color="#f43f5e" />
      </mesh>
      
      <mesh position={[-3, 0, 0]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial color="#10b981" />
      </mesh>
      
      {/* Ground plane */}
      <mesh position={[0, -1, 0]}>
        <boxGeometry args={[10, 0.1, 10]} />
        <meshBasicMaterial color="#64748b" />
      </mesh>
    </group>
  )
}

// Loading fallback
function LoadingFallback() {
  return (
    <mesh position={[0, 0, 0]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshBasicMaterial color="#ffffff" />
    </mesh>
  )
}

export default function SceneViewer({ 
  sceneUrl, 
  cameraPaths, 
  showCameraPath, 
  onToggleCameraPath 
}: SceneViewerProps) {
  return (
    <div className="w-full h-full bg-slate-900 dark:bg-slate-950 rounded-xl overflow-hidden relative shadow-inner">
      <div className="h-full">
        <Canvas
          camera={{ position: [5, 5, 5], fov: 75 }}
          style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' }}
        >
          <Suspense fallback={<LoadingFallback />}>
            {/* Lighting */}
            <ambientLight intensity={0.4} />
            <directionalLight position={[10, 10, 5]} intensity={1} />
            <pointLight position={[-10, -10, -5]} intensity={0.5} />
            
            {/* Scene objects */}
            <SceneObject />
            
            {/* Camera path visualization */}
            <CameraPathVisualization 
              cameraPaths={cameraPaths} 
              showCameraPath={showCameraPath} 
            />
            
            {/* Controls */}
            <OrbitControls 
              enablePan={true}
              enableZoom={true}
              enableRotate={true}
              minDistance={2}
              maxDistance={20}
            />
          </Suspense>
        </Canvas>
      </div>
      
      {/* Toggle button */}
      <div className="absolute top-4 right-4">
        <button
          onClick={onToggleCameraPath}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 shadow-lg ${
            showCameraPath
              ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-500/25'
              : 'bg-slate-600/90 text-white hover:bg-slate-700/90 backdrop-blur-sm'
          }`}
        >
          {showCameraPath ? 'Hide Path' : 'Show Path'}
        </button>
      </div>
      
      {/* Info panel */}
      <div className="absolute bottom-4 left-4 bg-slate-900/80 backdrop-blur-sm rounded-lg p-4 text-white text-sm border border-slate-700/50 shadow-lg">
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
            <span className="font-medium">Camera Paths: {cameraPaths.length}</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${sceneUrl ? 'bg-indigo-500' : 'bg-amber-500'}`}></div>
            <span>Status: {sceneUrl ? 'Loaded' : 'Placeholder'}</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${showCameraPath ? 'bg-emerald-500' : 'bg-slate-500'}`}></div>
            <span>Mode: {showCameraPath ? 'Visible' : 'Hidden'}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
