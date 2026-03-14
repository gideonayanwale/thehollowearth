class AudioManager {
    constructor() {
        this.context = null;
        this.masterGain = null;
        this.ambientTracks = {};
        this.sfxBuffers = {};
        this.currentAmbientNode = null;
        this.bgMusic = null;
        this.bgInterval = null;
    }

    init() {
        if (this.context) return;
        try {
            this.context = new (window.AudioContext || window.webkitAudioContext)();
            this.masterGain = this.context.createGain();
            this.masterGain.gain.value = 0.12;
            this.masterGain.connect(this.context.destination);
        } catch (e) {
            console.warn("Web Audio API not supported");
        }
    }

    unlock() {
        this.init();
        if (!this.context) return false;
        if (this.context.state === 'suspended') {
            this.context.resume();
        }
        return true;
    }

    startBackgroundMusic() {
        if (this.bgMusic) {
            if (this.context && this.context.state === 'suspended') {
                this.context.resume();
            }
            return;
        }
        if (!this.unlock()) return;

        const ctx = this.context;
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 900;

        const gain = ctx.createGain();
        gain.gain.value = 0.04;

        filter.connect(gain);
        gain.connect(this.masterGain || ctx.destination);

        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        osc1.type = 'sine';
        osc2.type = 'triangle';

        osc1.connect(filter);
        osc2.connect(filter);

        const notes = [196, 220, 246.94, 220, 196, 174.61, 196, 220];
        let step = 0;
        const tick = () => {
            const now = ctx.currentTime;
            const base = notes[step % notes.length];
            osc1.frequency.setTargetAtTime(base, now, 0.05);
            osc2.frequency.setTargetAtTime(base * 1.5, now, 0.05);
            step += 1;
        };

        tick();
        osc1.start();
        osc2.start();
        this.bgInterval = setInterval(tick, 600);
        this.bgMusic = { osc1, osc2, filter, gain };
    }

    stopBackgroundMusic() {
        if (!this.bgMusic) return;
        if (this.bgInterval) {
            clearInterval(this.bgInterval);
            this.bgInterval = null;
        }
        try {
            this.bgMusic.osc1.stop();
            this.bgMusic.osc2.stop();
        } catch (e) {
            // Ignore stop errors if already stopped.
        }
        this.bgMusic = null;
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
