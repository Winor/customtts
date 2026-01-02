/**
 * Shared settings management for TTS extension
 * Used by both popup and options pages
 */

/**
 * @typedef {Object} TTSSettings
 * @property {string} apiUrl - The TTS API endpoint URL
 * @property {string} apiKey - API authentication key
 * @property {number} speechSpeed - Speech playback speed (0.1-10.0)
 * @property {string} voice - Voice identifier
 * @property {string} model - TTS model name
 * @property {boolean} streamingMode - Whether to use PCM streaming
 * @property {boolean} downloadMode - Whether to download audio files
 * @property {number} outputVolume - Audio volume (0-1)
 */

const DEFAULT_SETTINGS = {
  apiUrl: 'http://host.docker.internal:8880/v1/',
  apiKey: 'not-needed',
  voice: 'af_bella+bf_emma+af_nicole',
  speechSpeed: 1.0,
  model: 'kokoro',
  streamingMode: false,
  downloadMode: false,
  outputVolume: 1.0
};

const SPEED_LIMITS = {
  min: 0.1,
  max: 10.0
};

const VOLUME_LIMITS = {
  min: 0,
  max: 1
};

/**
 * Load settings from browser storage
 * @returns {Promise<TTSSettings>}
 */
async function loadSettings() {
  try {
    const data = await browser.storage.local.get([
      'apiUrl', 'apiKey', 'speechSpeed', 'voice', 
      'model', 'streamingMode', 'downloadMode', 'outputVolume'
    ]);
    
    return {
      apiUrl: data.apiUrl || DEFAULT_SETTINGS.apiUrl,
      apiKey: data.apiKey || DEFAULT_SETTINGS.apiKey,
      voice: data.voice || DEFAULT_SETTINGS.voice,
      speechSpeed: data.speechSpeed || DEFAULT_SETTINGS.speechSpeed,
      model: data.model || DEFAULT_SETTINGS.model,
      streamingMode: data.streamingMode || DEFAULT_SETTINGS.streamingMode,
      downloadMode: data.downloadMode || DEFAULT_SETTINGS.downloadMode,
      outputVolume: data.outputVolume ?? DEFAULT_SETTINGS.outputVolume
    };
  } catch (error) {
    console.error('Error loading settings:', error);
    return DEFAULT_SETTINGS;
  }
}

/**
 * Save settings to browser storage
 * @param {TTSSettings} settings - Settings to save
 * @returns {Promise<void>}
 */
async function saveSettings(settings) {
  try {
    await browser.storage.local.set(settings);
  } catch (error) {
    console.error('Error saving settings:', error);
    throw new Error('Failed to save settings. Please try again.');
  }
}

/**
 * Validate settings input
 * @param {TTSSettings} settings - Settings to validate
 * @returns {{valid: boolean, errors: string[]}}
 */
function validateSettings(settings) {
  const errors = [];
  
  if (!settings.apiUrl || settings.apiUrl.trim() === '') {
    errors.push('API URL cannot be empty.');
  }
  
  if (isNaN(settings.speechSpeed) || 
      settings.speechSpeed < SPEED_LIMITS.min || 
      settings.speechSpeed > SPEED_LIMITS.max) {
    errors.push(`Speech speed must be between ${SPEED_LIMITS.min} and ${SPEED_LIMITS.max}.`);
  }
  
  if (isNaN(settings.outputVolume) || 
      settings.outputVolume < VOLUME_LIMITS.min || 
      settings.outputVolume > VOLUME_LIMITS.max) {
    errors.push(`Volume must be between ${VOLUME_LIMITS.min} and ${VOLUME_LIMITS.max}.`);
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Initialize settings UI elements
 * @param {Object} elements - DOM elements
 */
async function initializeUI(elements) {
  const settings = await loadSettings();
  
  elements.apiUrlInput.value = settings.apiUrl;
  elements.apiKeyInput.value = settings.apiKey;
  elements.voiceInput.value = settings.voice;
  elements.speedInput.value = settings.speechSpeed;
  elements.modelInput.value = settings.model;
  elements.streamingModeInput.checked = settings.streamingMode;
  elements.downloadModeInput.checked = settings.downloadMode;
  elements.volumeInput.value = settings.outputVolume;
}

/**
 * Setup mutual exclusivity between streaming and download modes
 * @param {Object} elements - DOM elements
 */
function setupModeExclusivity(elements) {
  elements.streamingModeInput.addEventListener('change', () => {
    if (elements.streamingModeInput.checked && elements.downloadModeInput.checked) {
      elements.downloadModeInput.checked = false;
      if (elements.streamingWarning) elements.streamingWarning.style.display = 'none';
      if (elements.downloadWarning) elements.downloadWarning.style.display = 'none';
    }
  });

  elements.downloadModeInput.addEventListener('change', () => {
    if (elements.downloadModeInput.checked && elements.streamingModeInput.checked) {
      elements.streamingModeInput.checked = false;
      if (elements.streamingWarning) elements.streamingWarning.style.display = 'none';
      if (elements.downloadWarning) elements.downloadWarning.style.display = 'none';
    }
  });
}

/**
 * Handle save button click
 * @param {Object} elements - DOM elements
 * @returns {Promise<void>}
 */
async function handleSave(elements) {
  const settings = {
    apiUrl: elements.apiUrlInput.value.trim(),
    apiKey: elements.apiKeyInput.value.trim(),
    speechSpeed: parseFloat(elements.speedInput.value),
    voice: elements.voiceInput.value.trim(),
    model: elements.modelInput.value.trim(),
    streamingMode: elements.streamingModeInput.checked,
    downloadMode: elements.downloadModeInput.checked,
    outputVolume: parseFloat(elements.volumeInput.value)
  };

  const validation = validateSettings(settings);
  
  if (!validation.valid) {
    alert(validation.errors.join('\n'));
    return;
  }

  try {
    await saveSettings(settings);
    alert('Settings saved!');
  } catch (error) {
    alert(error.message || 'Failed to save settings.');
  }
}

/**
 * Handle stop playback button click
 */
function handleStopPlayback() {
  browser.runtime.sendMessage({ action: 'stopPlayback' });
}
