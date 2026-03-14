class AudioManager {
    constructor() {
        this.context = null;
        this.ambientTracks = {};
        this.sfxBuffers = {};
        this.currentAmbientNode = null;
    }

    init() {
        if (this.context) return;
        try {
            this.context = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.warn("Web Audio API not supported");
        }
    }

    playAmbientForLayer(layerIndex) {
        if (!this.context) return;
        // console.log(`Playing ambient track for layer ${layerIndex}`);
    }

    playSound(fxName) {
        if (!this.context) return;
        // console.log(`Playing SFX: ${fxName}`);
    }
}

export default new AudioManager();
