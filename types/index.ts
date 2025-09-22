export interface Keyframe {
  frame: number;
  position: [number, number, number];
  rotation: [number, number, number];
}

export interface CameraPath {
  frame: number;
  position: [number, number, number];
  rotation: [number, number, number];
}

export interface SceneMetadata {
  total_frames: number;
  duration: number;
  fps: number;
  resolution: string;
}

export interface ReconstructionResponse {
  artifact: string;
  keyframes: number[];
  camera_paths: CameraPath[];
  scene_metadata: SceneMetadata;
}

export interface VideoPlayerProps {
  videoUrl: string;
  keyframes: number[];
  onTimeUpdate: (currentTime: number) => void;
  onKeyframeClick: (frame: number) => void;
}

export interface SceneViewerProps {
  sceneUrl?: string;
  cameraPaths: CameraPath[];
  showCameraPath: boolean;
  onToggleCameraPath: () => void;
}

export interface ExportData {
  glbUrl?: string;
  cameraPaths: CameraPath[];
  keyframes: number[];
}
