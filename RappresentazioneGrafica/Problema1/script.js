// --- CONFIGURAZIONE GLOBALE ---
const CONTAINER_ID = 'visualizer-container';
const CELL_WIDTH = 50;
const CELL_HEIGHT = 50;
const CELL_MARGIN = 5;
const INITIAL_ARRAY_SIZE = 12; // Un po' più piccolo per stare bene nei box

// Variabili di stato
let data = [];
let animationSpeed = 100; // In millisecondi
let isSorting = false;

// Elementi DOM
const container = document.getElementById(CONTAINER_ID);
const arrayRepresentation = document.getElementById('array-representation');
const startButton = document.getElementById('start-button');
const resetButton = document.getElementById('reset-button');
const speedSlider = document.getElementById('speed-slider');

// --- FUNZIONI DI UTILITÀ ---

/**
 * Genera un array di numeri casuali.
 */
function generateRandomArray(size) {
    return Array.from({length: size}, () => Math.floor(Math.random() * 99) + 1); // Numeri fino a 99
}

/**
 * Funzione di pausa asincrona.
 */
function sleep() {
    return new Promise(resolve => setTimeout(resolve, animationSpeed));
}

// --- FUNZIONE PRINCIPALE DI DISEGNO DELL'ARRAY ---

/**
 * Disegna/Aggiorna la visualizzazione delle celle.
 */
function drawArray(currentData, highlightIndices = [], swapIndices = [], isFinished = false) {
    // 1. PRIMA COSA: Calcoliamo la larghezza totale e impostiamo la larghezza del contenitore Flexbox
    const totalWidth = currentData.length * (CELL_WIDTH + CELL_MARGIN);
    
    // Impostiamo la larghezza del contenitore interno
    arrayRepresentation.style.width = `${totalWidth}px`; 


    // 2. Usiamo D3.js per gestire l'aggiornamento dei DIV
    const cells = d3.select(arrayRepresentation) // <-- QUI: Seleziona il contenitore interno!
        .selectAll(".array-cell")
        .data(currentData, (d, i) => i);

    // 3. FASE ENTER (Creazione di nuove celle)
    const enterSelection = cells.enter()
        .append("div")
        .attr("class", "array-cell")
        .style("background-color", "#f0f8ff")
        // Applica il margine a destra per creare spazio tra le celle
        .style("margin-right", `${CELL_MARGIN}px`) 
        .html(d => d);

    // 4. FASE UPDATE (Aggiornamento e animazione delle celle esistenti)
    const updateSelection = cells.merge(enterSelection);
    
    updateSelection
        // Transizione (animazione)
        .transition() 
        .duration(animationSpeed * 0.8)
        
        // Colori: in base allo stato
        .style("background-color", (d, i) => {
            if (isFinished) return "#4CAF50"; 
            if (swapIndices.includes(i)) return "#FF5733"; 
            if (highlightIndices.includes(i)) return "#FFC300"; 
            return "#f0f8ff"; 
        })
        
        // Aggiorna il testo (valore della cella)
        .tween("text", function(d) {
             d3.select(this).html(d);
        });

    // 5. FASE EXIT (Rimuovi le celle in eccesso)
    cells.exit().remove();
}


// --- ALGORITMO DI VISUALIZZAZIONE (Bubble Sort modificato) ---

async function bubbleSort(arr) {
    isSorting = true;
    let n = arr.length;
    
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n - i - 1; j++) {
            
            // 1. Visualizza la comparazione (giallo)
            drawArray(arr, [j, j + 1], []);
            await sleep();

            if (arr[j] > arr[j + 1]) {
                // Scambio
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];

                // 2. Visualizza lo scambio (rosso)
                // L'uso di D3.js con .style("left") e .transition() gestisce l'animazione del movimento
                drawArray(arr, [], [j, j + 1]); 
                await sleep();
            }
        }
    }
    
    // 3. Ordinamento completato (verde)
    drawArray(arr, [], [], true);
    isSorting = false;
    startButton.disabled = false;
    startButton.textContent = "Ordinamento Completato!";
}


// --- GESTIONE EVENTI ---

function init() {
    data = generateRandomArray(INITIAL_ARRAY_SIZE);
    // Avviamo il disegno
    drawArray(data); 
    startButton.textContent = "Avvia Algoritmo (Bubble Sort)";
    startButton.disabled = false;
}

// Avvio dell'algoritmo
startButton.addEventListener('click', () => {
    if (isSorting) return;
    startButton.disabled = true;
    startButton.textContent = "In Esecuzione...";
    // Usa una COPIA dell'array per non modificare l'originale durante l'ordinamento
    bubbleSort([...data]); 
});

// Generazione di un nuovo array casuale
resetButton.addEventListener('click', () => {
    if (isSorting) return;
    init();
});

// Controllo della velocità
speedSlider.addEventListener('input', (e) => {
    // Mappa l'input dello slider (più è alto, più l'animazione è veloce, quindi invertiamo)
    animationSpeed = 500 - (e.target.value - 10); 
});


// Avvia il setup iniziale
init();