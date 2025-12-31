document.addEventListener("DOMContentLoaded", async () => {
  const elements = {
    apiUrlInput: document.getElementById("apiUrl"),
    apiKeyInput: document.getElementById("apiKey"),
    speedInput: document.getElementById("speed"),
    voiceInput: document.getElementById("voice"),
    modelInput: document.getElementById("model"),
    streamingModeInput: document.getElementById("streamingMode"),
    downloadModeInput: document.getElementById("downloadMode"),
    volumeInput: document.getElementById("volume"),
    streamingWarning: document.getElementById("streamingWarning"),
    downloadWarning: document.getElementById("downloadWarning"),
    saveButton: document.getElementById("saveButton"),
    stopButton: document.getElementById("stopButton"),
    playButton: document.getElementById("playButton"),
    pauseButton: document.getElementById("pauseButton"),
    tabButtons: document.querySelectorAll(".tab-button"),
    tabPanels: document.querySelectorAll(".tab-panel")
  };

  // Initialize UI with saved settings
  await initializeUI(elements);

  // Setup mode exclusivity
  setupModeExclusivity(elements);

  // Save settings
  elements.saveButton.addEventListener("click", () => handleSave(elements));

  // Stop playback
  elements.stopButton.addEventListener("click", handleStopPlayback);

  // Dummy controls for play/pause (not implemented yet)
  elements.playButton.addEventListener("click", () => {
    console.info("Play not implemented yet.");
  });

  elements.pauseButton.addEventListener("click", () => {
    console.info("Pause not implemented yet.");
  });

  // Tab switching
  elements.tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const targetTab = button.dataset.tab;

      elements.tabButtons.forEach((b) => b.classList.toggle("active", b === button));
      elements.tabPanels.forEach((panel) => {
        panel.classList.toggle("active", panel.id === `${targetTab}Tab`);
      });
    });
  });
});