# How to Add a New Algorithm

The infrastructure is designed to be modular. To add a new algorithm, follow these 3 steps:

## 1. Create the Algorithm Class
Create a new file in `js/algorithms/`, e.g., `MyNewAlgo.js`.
It must extend `AlgorithmBase` and implement the `*run()` generator.

```javascript
import { AlgorithmBase } from '../core/AlgorithmBase.js';

export class MyNewAlgo extends AlgorithmBase {
    constructor() {
        super();
    }

    *run() {
        // 1. Setup
        let myData = this.data;

        // 2. Loop and Yield States
        for (let i = 0; i < myData.length; i++) {
            
            // YIELD: Pauses execution and sends state to the Renderer
            yield {
                type: 'highlight',  // You define these types
                data: { index: i, value: myData[i] },
                message: `Checking index ${i}`
            };

            // Logic
            if (myData[i] > 10) {
                yield {
                    type: 'found',
                    data: { index: i },
                    message: `Found value > 10!`
                };
            }
        }
    }
}
```

## 2. Handle Rendering (Optional but Recommended)
If your algorithm needs specific visuals (like bars for sorting, nodes for graphs), you might need to update the `Renderer` or create a specific one.
For now, the `DummyRenderer` in `main.js` just prints text. You will likely want to create a `D3Renderer` or similar.

## 3. Register in `main.js`
Import your class and load it into the engine.

```javascript
import { MyNewAlgo } from './algorithms/MyNewAlgo.js';

// ... inside init ...
const myAlgo = new MyNewAlgo();
myAlgo.init([10, 5, 20, 8]); // Pass initial data

// When user selects this algo:
engine.loadAlgorithm(myAlgo);
```
