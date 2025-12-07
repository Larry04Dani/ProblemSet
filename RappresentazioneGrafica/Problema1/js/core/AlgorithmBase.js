/**
 * Abstract base class for all algorithms.
 * Algorithms must implement the generator function *run().
 */
export class AlgorithmBase {
    constructor() {
        this.controls = []; // Custom controls for this algorithm
    }

    /**
     * Initialize the algorithm with data.
     * @param {any} inputData 
     */
    init(inputData) {
        this.data = inputData;
    }

    /**
     * Generator function that yields states.
     * Each yield represents a step in the animation.
     * Yield format: { type: string, data: any, message: string }
     */
    *run() {
        throw new Error("Method 'run()' must be implemented.");
    }

    /**
     * Clean up any resources or DOM elements specific to this algorithm.
     */
    destroy() {
        // Optional cleanup
    }
}
