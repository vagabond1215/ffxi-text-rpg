import { createCanvasApp } from './text/ui/canvasApp.js';

function init() {
    createCanvasApp({
        canvas: document.getElementById('game-canvas'),
    });
}

document.addEventListener('DOMContentLoaded', init);
