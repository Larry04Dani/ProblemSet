import { VisualizerCore } from './core/VisualizerCore.js';

// --- Dummy Renderer (Placeholder) ---
class DummyRenderer {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
    }

    render(state) {
        // For now, just print the state to the container
        this.container.innerHTML = `
            <div style="font-size: 2rem; text-align: center; margin-top: 20px;">
                ${state.data}
            </div>
            <div style="text-align: center; color: #94a3b8; margin-top: 10px;">
                ${state.message || ''}
            </div>
        `;
    }
}

// --- Dummy Algorithm (Proof of Concept) ---
import { AlgorithmBase } from './core/AlgorithmBase.js';

class DummyAlgorithm extends AlgorithmBase {
    *run() {
        let count = 0;
        while (count < 10) {
            count++;
            yield {
                type: 'update',
                data: count,
                message: `Counting... ${count}`
            };
        }
        yield {
            type: 'finish',
            data: 'Done!',
            message: 'Algorithm Completed'
        };
    }
}

// --- Main Initialization ---

document.addEventListener('DOMContentLoaded', () => {
    console.log('AlgoViz Initializing...');

    const renderer = new DummyRenderer('visualization-stage');
    const engine = new VisualizerCore(renderer);

    // UI Elements
    const btnPlayPause = document.getElementById('btn-play-pause');
    const btnReset = document.getElementById('btn-reset');
    const btnNext = document.getElementById('btn-next');
    const speedSlider = document.getElementById('speed-slider');
    const algoTitle = document.getElementById('current-algo-title');
    const playIcon = btnPlayPause.querySelector('.material-icons-round');

    // Load Dummy Algo
    const dummyAlgo = new DummyAlgorithm();
    engine.loadAlgorithm(dummyAlgo);
    algoTitle.textContent = "Dummy Counter";

    // UI Updates
    engine.onUpdate = (state) => {
        if (state.status === 'playing') {
            playIcon.textContent = 'pause';
        } else {
            playIcon.textContent = 'play_arrow';
        }

        if (state.status === 'finished') {
            playIcon.textContent = 'replay'; // Or keep play and reset logic
        }
    };

    // Event Listeners
    btnPlayPause.addEventListener('click', () => {
        if (engine.isPlaying) {
            engine.pause();
        } else {
            engine.play();
        }
    });

    btnNext.addEventListener('click', () => {
        engine.pause();
        engine.stepForward();
    });

    btnReset.addEventListener('click', () => {
        engine.reset();
        // Clear stage manually if needed, or let the engine handle it
        document.getElementById('visualization-stage').innerHTML = '<div class="placeholder-text">Ready</div>';
    });

    speedSlider.addEventListener('input', (e) => {
        // Invert logic: higher value = lower delay
        // Range 1-100. 
        // 1 = 1000ms, 100 = 10ms
        const val = parseInt(e.target.value);
        const delay = 1000 - (val * 9.9);
        engine.setSpeed(delay);
    });
});
