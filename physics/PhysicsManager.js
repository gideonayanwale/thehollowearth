class PhysicsManager {
    constructor() {
        this.baseGravity = 9.8 * 60; // Scaling for pixels per second squared
    }

    getGravity(entity) {
        if (!entity || !entity.gravityState || entity.gravityState === "normal") {
            return this.baseGravity;
        } else if (entity.gravityState === "inverted") {
            return -this.baseGravity;
        } else if (entity.gravityState === "zero") {
            return 0;
        }
        return this.baseGravity;
    }
}

export default new PhysicsManager();
