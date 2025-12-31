/**
 * Configuration constants for TTS extension
 */

const CONFIG = {
  // Text processing
  TEXT_LENGTH_THRESHOLD: 200,
  
  // Audio settings
  PCM_SAMPLE_RATE: 24000,
  PCM_NUM_CHANNELS: 1,
  PCM_BYTES_PER_SAMPLE: 2,
  
  // Queue management
  MAX_QUEUE_SIZE: 10,
  
  // UI feedback
  TOAST_DURATION: 2000,
  ERROR_TOAST_DURATION: 3000,
  
  // Sentence splitting
  SENTENCE_REGEX: /[^.。\n]*[.。\n]|[^.。\n]+$/g,
  
  // API defaults
  DEFAULT_API_URL: 'http://host.docker.internal:8880/v1',
  DEFAULT_API_KEY: 'not-needed',
  DEFAULT_VOICE: 'af_bella+af_sky',
  DEFAULT_MODEL: 'kokoro',
  DEFAULT_SPEED: 1.0,
  DEFAULT_VOLUME: 1.0
};

// Toast notification styles
const TOAST_STYLES = {
  base: 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);color:white;padding:12px 24px;border-radius:4px;z-index:10000;font-family:Arial,sans-serif;font-size:14px;pointer-events:none;',
  success: 'background:#00bcd4;',
  error: 'background:#ff5252;',
  info: 'background:#2196f3;'
};
