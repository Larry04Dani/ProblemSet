import { AlgorithmBase } from '../core/AlgorithmBase.js';

/**
 * Template for a new Algorithm.
 * Copy this file and rename it to start.
 */
export class TemplateAlgorithm extends AlgorithmBase {

    /**
     * Initialize with data.
     * @param {any} inputData - The data to work on (array, graph object, etc.)
     */
    init(inputData) {
        super.init(inputData);
        // Perform any additional setup here
    }

    /**
     * The core logic.
     * Must be a Generator Function (*).
     */
    *run() {
        // Example: Iterate over an array
        const arr = this.data;

        yield {
            type: 'start',
            data: arr,
            message: 'Starting algorithm...'
        };

        for (let i = 0; i < arr.length; i++) {
            // Perform calculation
            const val = arr[i];

            // Yield a state to update the UI
            yield {
                type: 'highlight', // The renderer decides how to show this 'type'
                data: { index: i, value: val },
                message: `Processing index ${i}, value is ${val}`
            };
        }

        yield {
            type: 'finish',
            data: null,
            message: 'Finished!'
        };
    }
}
