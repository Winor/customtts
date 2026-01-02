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

  async function updateTransportState() {
    try {
      const { playbackState } = (await browser.runtime.sendMessage({ action: "getPlaybackState" })) || { playbackState: "idle" };
      setTransportButtons(playbackState);
    } catch (e) {
      setTransportButtons("idle");
    }
  }

  function setTransportButtons(state) {
    const playDisabled = state !== "paused";
    const pauseDisabled = state !== "playing";
    const stopDisabled = state === "idle";
    elements.playButton.disabled = playDisabled;
    elements.pauseButton.disabled = pauseDisabled;
    elements.stopButton.disabled = stopDisabled;
  }

  // Stop playback
  elements.stopButton.addEventListener("click", async () => {
    await browser.runtime.sendMessage({ action: "stopPlayback" });
    setTransportButtons("idle");
  });

  // Play (resume)
  elements.playButton.addEventListener("click", async () => {
    await browser.runtime.sendMessage({ action: "resumePlayback" });
    await updateTransportState();
  });

  // Pause
  elements.pauseButton.addEventListener("click", async () => {
    await browser.runtime.sendMessage({ action: "pausePlayback" });
    await updateTransportState();
  });

  // Tab switching
  elements.tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const targetTab = button.dataset.tab;

      elements.tabButtons.forEach((b) => b.classList.toggle("active", b === button));
      elements.tabPanels.forEach((panel) => {
        panel.classList.toggle("active", panel.id === `${targetTab}Tab`);
      });

      if (targetTab === "play") {
        updateTransportState();
      }
    });
  });

  // Initial transport state
  updateTransportState();
});
