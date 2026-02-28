export default class ScreenShake {
    constructor() {
        this.intensity = 0;
        this.duration = 0;
        this.timer = 0;
        this.offsetX = 0;
        this.offsetY = 0;
    }

    apply(intensity, duration) {
        this.intensity = intensity;
        this.duration = duration;
        this.timer = duration;
    }

    update(dt) {
        if (this.timer > 0) {
            this.timer -= dt;
            const currentIntensity = this.intensity * (this.timer / this.duration);
            this.offsetX = (Math.random() - 0.5) * 2 * currentIntensity;
            this.offsetY = (Math.random() - 0.5) * 2 * currentIntensity;
        } else {
            this.offsetX = 0;
            this.offsetY = 0;
            this.intensity = 0;
        }
    }
}
