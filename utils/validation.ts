// File validation utilities for security
export const MAX_VIDEO_SIZE = 100 * 1024 * 1024; // 100MB
export const ALLOWED_VIDEO_TYPES = [
  'video/mp4',
  'video/webm', 
  'video/quicktime',
  'video/x-msvideo', // .avi
  'video/x-ms-wmv'   // .wmv
];

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export const validateVideoFile = (file: File): ValidationResult => {
  // Check file type
  if (!ALLOWED_VIDEO_TYPES.includes(file.type)) {
    return {
      isValid: false,
      error: 'Only MP4, WebM, QuickTime, AVI, and WMV video files are supported'
    };
  }

  // Check file size
  if (file.size > MAX_VIDEO_SIZE) {
    return {
      isValid: false,
      error: `File size must be less than ${Math.round(MAX_VIDEO_SIZE / (1024 * 1024))}MB`
    };
  }

  // Check if file is empty
  if (file.size === 0) {
    return {
      isValid: false,
      error: 'File appears to be empty'
    };
  }

  return { isValid: true };
};

// Input sanitization utilities
export const sanitizeInput = (input: string): string => {
  if (typeof input !== 'string') return '';
  return input.trim().replace(/[<>]/g, ''); // Basic XSS prevention
};

// Scene metadata validation
export interface SceneMetadata {
  title: string;
  description?: string;
  tags?: string[];
}

export const validateSceneMetadata = (data: unknown): SceneMetadata => {
  if (!data || typeof data !== 'object') {
    throw new Error('Invalid metadata format');
  }

  const metadata = data as Record<string, unknown>;

  // Validate title
  if (!metadata.title || typeof metadata.title !== 'string') {
    throw new Error('Title is required and must be a string');
  }

  const title = sanitizeInput(metadata.title);
  if (title.length === 0 || title.length > 100) {
    throw new Error('Title must be between 1 and 100 characters');
  }

  // Validate description (optional)
  let description: string | undefined;
  if (metadata.description) {
    if (typeof metadata.description !== 'string') {
      throw new Error('Description must be a string');
    }
    description = sanitizeInput(metadata.description);
    if (description.length > 500) {
      throw new Error('Description must be less than 500 characters');
    }
  }

  // Validate tags (optional)
  let tags: string[] | undefined;
  if (metadata.tags) {
    if (!Array.isArray(metadata.tags)) {
      throw new Error('Tags must be an array');
    }
    if (metadata.tags.length > 10) {
      throw new Error('Maximum 10 tags allowed');
    }
    tags = metadata.tags
      .filter((tag): tag is string => typeof tag === 'string')
      .map(sanitizeInput)
      .filter(tag => tag.length > 0 && tag.length <= 50);
  }

  return {
    title,
    description,
    tags
  };
};
