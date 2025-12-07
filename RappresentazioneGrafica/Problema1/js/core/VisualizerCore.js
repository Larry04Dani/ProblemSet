/**
 * VisualizerCore: The Engine.
 * Handles the animation loop, playback controls, and interaction with the algorithm generator.
 */
export class VisualizerCore {
    constructor(renderer) {
        this.renderer = renderer;
        this.algorithm = null;
        this.generator = null;
        this.isPlaying = false;
        this.speed = 500; // ms per step
        this.timer = null;
        this.history = []; // To support stepping back (optional/advanced)
        this.stepCount = 0;

        // UI Callbacks
        this.onUpdate = null; // Function to update UI (progress, message)
    }

    /**
     * Load a new algorithm instance.
     * @param {AlgorithmBase} algorithmInstance 
     */
    loadAlgorithm(algorithmInstance) {
        this.stop();
        this.algorithm = algorithmInstance;
        this.reset();
    }

    /**
     * Reset the visualization to the initial state.
     */
    reset() {
        if (!this.algorithm) return;
        this.stop();
        this.generator = this.algorithm.run();
        this.stepCount = 0;
        this.history = [];

        // Render initial state (we might need a specific method for this)
        // For now, we assume the first yield or a separate init call handles it.
        // Ideally, the algorithm should yield its initial state immediately or we call a render method.
        if (this.onUpdate) this.onUpdate({ status: 'ready', step: 0 });
    }

    /**
     * Start or resume playback.
     */
    play() {
        if (this.isPlaying || !this.algorithm) return;
        this.isPlaying = true;
        this.loop();
        if (this.onUpdate) this.onUpdate({ status: 'playing' });
    }

    /**
     * Pause playback.
     */
    pause() {
        this.isPlaying = false;
        clearTimeout(this.timer);
        if (this.onUpdate) this.onUpdate({ status: 'paused' });
    }

    /**
     * Stop playback and reset timer.
     */
    stop() {
        this.pause();
    }

    /**
     * Execute the next step of the algorithm.
     */
    stepForward() {
        if (!this.algorithm || !this.generator) return;

        const result = this.generator.next();

        if (result.done) {
            this.pause();
            if (this.onUpdate) this.onUpdate({ status: 'finished' });
            return;
        }

        const state = result.value;
        this.stepCount++;

        // Delegate rendering to the renderer
        // The renderer knows how to handle the specific 'type' of the state
        this.renderer.render(state);

        if (this.onUpdate) this.onUpdate({ status: 'playing', step: this.stepCount, message: state.message });
    }

    /**
     * The animation loop.
     */
    loop() {
        if (!this.isPlaying) return;

        this.stepForward();

        // Schedule next loop based on speed
        // We use setTimeout instead of requestAnimationFrame to control speed easily
        this.timer = setTimeout(() => {
            this.loop();
        }, this.speed);
    }

    /**
     * Set animation speed.
     * @param {number} ms Delay in milliseconds
     */
    setSpeed(ms) {
        this.speed = ms;
    }
}
