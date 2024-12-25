const jsConfetti = new JSConfetti()

let draggedTile = null;
let placeholderTile = null;

let puzzleSolved = false;

const cornerColors = [];

let fixedTileNumList = null;

let cursorX = null;
let cursorY = null;

let swaps = 0;

let timerRunning = false;
let timerSeconds = 0;

let gamePaused = false;

let tileToBeStopped = false;

const colorSimilarityThreshold = 25;

let puzzleReady = false;

var randomTileList = [];
var fixedTileList = [];
var fullTileList = [];

var devMode = false;

var finishingLevel = false;

// Add listeners to report constant cursor position
document.addEventListener('touchmove', onCursorMove);
document.addEventListener('mousemove', onCursorMove);

// Pull existing elements from HTML
const welcomeScreen = document.getElementById('welcome-screen');
const gameScreen = document.getElementById('game-screen');
const grid = document.getElementById('grid');
const swapCounter = document.getElementById('swaps');
const timer = document.getElementById('timer');
const finalOverlay = document.getElementById('final-overlay');
const overlayTime = document.getElementById('overlayTime');
const overlaySwaps = document.getElementById('overlaySwaps');
const pauseScreen = document.getElementById('pause-menu');
const pauseTime = document.getElementById('pauseTime');
const pauseSwaps = document.getElementById('pauseSwaps');

const widthLabel = document.getElementById('widthLabel');
const heightLabel = document.getElementById('heightLabel');
const finalWidthLabel = document.getElementById('finalWidthLabel');
const finalHeightLabel = document.getElementById('finalHeightLabel');

const headerStatsContainer = document.querySelector('#header-stats div');

function addWidth() {
    let width = parseInt(widthLabel.innerHTML);
    if(width < 20) {
        widthLabel.innerHTML = width += 1;
        finalWidthLabel.innerHTML = widthLabel.innerHTML;
    }
}

function subtractWidth() {
    let width = parseInt(widthLabel.innerHTML);
    if(width > 3) {
        widthLabel.innerHTML = width -= 1;
        finalWidthLabel.innerHTML = widthLabel.innerHTML;
    }
}

function addHeight() {
    let height = parseInt(heightLabel.innerHTML);
    if(height < 20) {
        heightLabel.innerHTML = height += 1;
        finalHeightLabel.innerHTML = heightLabel.innerHTML;
    }
}

function subtractHeight() {
    let height = parseInt(heightLabel.innerHTML);
    if(height > 3) {
        heightLabel.innerHTML = height -= 1;
        finalHeightLabel.innerHTML = heightLabel.innerHTML;
    }
}

const widthPlusButton = document.getElementById('widthPlusButton');
widthPlusButton.addEventListener('click', addWidth);
const widthMinusButton = document.getElementById('widthMinusButton');
widthMinusButton.addEventListener('click', subtractWidth);

const heightPlusButton = document.getElementById('heightPlusButton');
heightPlusButton.addEventListener('click', addHeight);
const heightMinusButton = document.getElementById('heightMinusButton');
heightMinusButton.addEventListener('click', subtractHeight);

const finalWidthPlusButton = document.getElementById('finalWidthPlusButton');
finalWidthPlusButton.addEventListener('click', addWidth);
const finalWidthMinusButton = document.getElementById('finalWidthMinusButton');
finalWidthMinusButton.addEventListener('click', subtractWidth);

const finalHeightPlusButton = document.getElementById('finalHeightPlusButton');
finalHeightPlusButton.addEventListener('click', addHeight);
const finalHeightMinusButton = document.getElementById('finalHeightMinusButton');
finalHeightMinusButton.addEventListener('click', subtractHeight);

const createButton = document.getElementById("gridCreateButton");
createButton.addEventListener('click', async () => {
    puzzleSolved = false;
    timerRunning = false;
    timer.innerHTML = "0:00";
    timerSeconds = 0;
    swaps = 0;
    swapCounter.innerHTML = "Swaps: " + swaps;
    generateGrid();
    welcomeScreen.classList.add('fade-out');
    await sleep(500);
    welcomeScreen.style.display = 'none';
    welcomeScreen.classList.remove('fade-out');
    while(!puzzleReady){};
    gameScreen.classList.add('fade-in');
    gameScreen.style.display = '';
    await sleep(500);
    gameScreen.classList.remove('fade-in');
    await sleep(500);
    transitionTiles(insertTilesRandom);
});

const viewPuzzleButton = document.getElementById("viewButton");
viewPuzzleButton.addEventListener('click', () => {
    finalOverlay.classList.add('hidden');
});

const shareButton = document.getElementById("shareButton");
shareButton.addEventListener('click', async () => {
    const shareData = {
        text: `Gradient Game (${widthLabel.innerHTML}x${heightLabel.innerHTML})\nFinished in: ${timer.innerHTML}\nTotal swaps: ${swaps}\nPlay: https://gradient.starlightt.xyz`,
    };

    await navigator.share(shareData);
});

const regenerateButton = document.getElementById('regenerateButton');
regenerateButton.addEventListener('click', async () => {
    puzzleSolved = false;
    timerRunning = false;
    gameScreen.classList.add('fade-out');
    finalOverlay.classList.add('hidden');
    await sleep(500);
    timer.innerHTML = "0:00";
    timerSeconds = 0;
    swaps = 0;
    swapCounter.innerHTML = "Swaps: " + swaps;
    grid.innerHTML = "";
    grid.style = "";
    fixedTileNumList = [];
    fixedTileList = [];
    randomTileList = [];
    fullTileList = [];
    generateGrid();
    while(!puzzleReady){};
    gameScreen.classList.remove('fade-out');
    gameScreen.classList.add('fade-in');
    await sleep(500);
    gameScreen.classList.remove('fade-in');
    await sleep(500);
    transitionTiles(insertTilesRandom);
});

const homeButton = document.getElementById('homeButton');
homeButton.addEventListener('click', async () => {
    puzzleSolved = false;
    timerRunning = false;
    gameScreen.classList.add('fade-out');
    finalOverlay.classList.add('hidden');
    await sleep(500);
    gameScreen.style.display = 'none';
    gameScreen.classList.remove('fade-out');
    timer.innerHTML = "0:00";
    timerSeconds = 0;
    swaps = 0;
    swapCounter.innerHTML = "Swaps: " + swaps;
    grid.innerHTML = "";
    grid.style = "";
    fixedTileNumList = [];
    fixedTileList = [];
    randomTileList = [];
    fullTileList = [];
    welcomeScreen.classList.add('fade-in');
    welcomeScreen.style.display = '';
    await sleep(500);
    welcomeScreen.classList.remove('fade-in');
});

const quickRegenerateButton = document.getElementById('header-restart');
quickRegenerateButton.addEventListener('click', async () => {
    if(!finishingLevel && finalOverlay.classList.contains('hidden')) {
        puzzleSolved = false;
        timerRunning = false;
        timer.innerHTML = "0:00";
        timerSeconds = 0;
        swaps = 0;
        swapCounter.innerHTML = "Swaps: " + swaps;
        grid.classList.add('fade-out');
        await sleep(500);
        grid.innerHTML = "";
        grid.style = "";
        fixedTileNumList = [];
        fixedTileList = [];
        randomTileList = [];
        fullTileList = [];
        generateGrid();
        while(!puzzleReady){};
        grid.classList.remove('fade-out');
        grid.classList.add('fade-in');
        await sleep(500);
        grid.classList.remove('fade-in');
        await sleep(500);
        transitionTiles(insertTilesRandom);
    }
});

const menuButton = document.getElementById('header-menu');
menuButton.addEventListener('click', () => {
    if(puzzleSolved) {
        finalOverlay.classList.remove('hidden');
    } else {
        gamePaused = true;

        pauseTime.innerHTML = timer.innerHTML;
        pauseSwaps.innerHTML = swaps;

        pauseScreen.classList.remove('hidden');
    }
});

const pauseResumeButton = document.getElementById('pauseResumeButton');
pauseResumeButton.addEventListener('click', async () => {
    pauseScreen.classList.add('hidden');

    await sleep(500);
    
    gamePaused = false;
});

const pauseSolutionButton = document.getElementById('pauseSolutionButton');
pauseSolutionButton.addEventListener('click', async () => {
    if(!devMode) {
        puzzleSolved = true;
        timerRunning = false;
    }

    pauseScreen.classList.add('hidden');

    await sleep(500);
    gamePaused = false;

    transitionTiles(insertTilesOrdered);
});

const pauseHomeButton = document.getElementById('pauseHomeButton');
pauseHomeButton.addEventListener('click', async () => {
    puzzleSolved = false;
    timerRunning = false;
    gamePaused = false;
    gameScreen.classList.add('fade-out');
    pauseScreen.classList.add('hidden');
    await sleep(500);
    gameScreen.style.display = 'none';
    gameScreen.classList.remove('fade-out');
    timer.innerHTML = "0:00";
    timerSeconds = 0;
    swaps = 0;
    swapCounter.innerHTML = "Swaps: " + swaps;
    grid.innerHTML = "";
    grid.style = "";
    fixedTileNumList = [];
    fixedTileList = [];
    randomTileList = [];
    fullTileList = [];
    welcomeScreen.classList.add('fade-in');
    welcomeScreen.style.display = '';
    await sleep(500);
    welcomeScreen.classList.remove('fade-in');
});


function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

function deltaE(rgbA, rgbB) {
    let labA = rgb2lab(rgbA);
    let labB = rgb2lab(rgbB);
    let deltaL = labA[0] - labB[0];
    let deltaA = labA[1] - labB[1];
    let deltaB = labA[2] - labB[2];
    let c1 = Math.sqrt(labA[1] * labA[1] + labA[2] * labA[2]);
    let c2 = Math.sqrt(labB[1] * labB[1] + labB[2] * labB[2]);
    let deltaC = c1 - c2;
    let deltaH = deltaA * deltaA + deltaB * deltaB - deltaC * deltaC;
    deltaH = deltaH < 0 ? 0 : Math.sqrt(deltaH);
    let sc = 1.0 + 0.045 * c1;
    let sh = 1.0 + 0.015 * c1;
    let deltaLKlsl = deltaL / (1.0);
    let deltaCkcsc = deltaC / (sc);
    let deltaHkhsh = deltaH / (sh);
    let i = deltaLKlsl * deltaLKlsl + deltaCkcsc * deltaCkcsc + deltaHkhsh * deltaHkhsh;
    return i < 0 ? 0 : Math.sqrt(i);
}
  
function rgb2lab(rgb){
    let r = rgb[0] / 255, g = rgb[1] / 255, b = rgb[2] / 255, x, y, z;
    r = (r > 0.04045) ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92;
    g = (g > 0.04045) ? Math.pow((g + 0.055) / 1.055, 2.4) : g / 12.92;
    b = (b > 0.04045) ? Math.pow((b + 0.055) / 1.055, 2.4) : b / 12.92;
    x = (r * 0.4124 + g * 0.3576 + b * 0.1805) / 0.95047;
    y = (r * 0.2126 + g * 0.7152 + b * 0.0722) / 1.00000;
    z = (r * 0.0193 + g * 0.1192 + b * 0.9505) / 1.08883;
    x = (x > 0.008856) ? Math.pow(x, 1/3) : (7.787 * x) + 16/116;
    y = (y > 0.008856) ? Math.pow(y, 1/3) : (7.787 * y) + 16/116;
    z = (z > 0.008856) ? Math.pow(z, 1/3) : (7.787 * z) + 16/116;
    return [(116 * y) - 16, 500 * (x - y), 200 * (y - z)]
}

// Helper sleep function
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Helper clamp function
function clamp(num, lower, upper) {
    return Math.min(Math.max(num, lower), upper);
}

// Reports the position of the cursor every time it moves
function onCursorMove(event) {
    cursorX = event.pageX;
    cursorY = event.pageY;
}

// Moves an item to the proper cursor position when dragged
function onItemDrag() {
    moveAt(cursorX, cursorY);
}

function moveAt(pageX, pageY) {
    draggedTile.style.left = pageX - draggedTile.offsetWidth / 2 + 'px';
    draggedTile.style.top = pageY - draggedTile.offsetHeight / 2 + 'px';
}

// Adds listeners to start dragging when tile is selected
document.body.addEventListener('touchstart', (e) => {
    if(e.touches.length === 1){
        startDrag(e, true);
    }
});
document.body.addEventListener('mousedown', (e) => {startDrag(e, false);});

// Starts dragging the selected tile
function startDrag(e, touch) {
    // Ensures the tile should be dragged
    if (e.target.classList.contains('tile') && e.target.classList.contains('draggable') && !puzzleSolved && !draggedTile && !gamePaused) {
        if(!timerRunning) {
            timerRunning = true;
            var x = setInterval(function() {
                if (timerRunning) {
                    if (!gamePaused) {
                        timerSeconds++;

                        let minutes = Math.floor(timerSeconds/60);
                        let seconds = timerSeconds%60;

                        timer.innerHTML = minutes + ":" + seconds.toString().padStart(2, '0');
                    }
                } else {
                    clearInterval(x);
                }
            }, 1000);
        }

        cursorX = e.pageX
        cursorY = e.pageY
        
        draggedTile = e.target;
        draggedTile.classList.add('dragging');
        moveAt(e.pageX, e.pageY);

        // Inserts placeholder tile where tile was dragged from
        placeholderTile = document.createElement('div');
        placeholderTile.classList.add('tile', 'placeholder');
        placeholderTile.style.backgroundColor = "#fff9e7";
        grid.insertBefore(placeholderTile, draggedTile.nextSibling)

        // Adds listener to move the tile with the cursor
        if(touch) {
            document.addEventListener('touchmove', onItemDrag);
        } else {
            document.addEventListener('mousemove', onItemDrag);
        }

        tileToBeStopped = true;
    }
}

// Inserts listeners to stop dragging when tile is released
document.body.addEventListener('touchend', () => {stopDrag(true)});
document.body.addEventListener('mouseup', () => {stopDrag(false)});

// Stops dragging the selected tile
async function stopDrag(touch) {
    // Ensures a tile is being dragged
    if (tileToBeStopped) {
        tileToBeStopped = false;
        // Gets the nearest tile to swap with
        let element = document.elementsFromPoint(cursorX, cursorY)[0];
        if(element.classList.contains('tile') && element.classList.contains('draggable')) {
            swaps++;

            swapCounter.innerHTML = "Swaps: " + swaps;

            if(window.innerWidth < 600) {
                headerStatsContainer.style.width = swapCounter.innerHTML.length + 'ch'
            }

            newTile = element;

            // Gets coordinates of tiles to swap
            let oldTilePos = placeholderTile.getBoundingClientRect();
            let newTilePos = newTile.getBoundingClientRect();

            // Animates dragged tile into new position
            draggedTile.classList.add('swapping');
            draggedTile.style.transform = "translate(" + (newTilePos.left - parseInt(draggedTile.style.left.slice(0, -2))) + "px," + (newTilePos.top - parseInt(draggedTile.style.top.slice(0, -2))) + "px)";

            // Animates swapped tile to the dragged tile's old position
            newTile.classList.add('swapping');
            newTile.style.transform = "translate(" + (oldTilePos.left - newTilePos.left) + "px," + (oldTilePos.top - newTilePos.top) + "px)";

            // Waits for the animation to finish
            await sleep(180);

            // Swaps actual tile element positions after animation is finished
            draggedTile.classList.remove('swapping');
            newTile.classList.remove('swapping');

            draggedTile.classList.remove('dragging');

            const temp = document.createElement('div');
            
            grid.insertBefore(temp, draggedTile);

            grid.replaceChild(draggedTile, newTile);
            grid.replaceChild(newTile, temp);

            temp.remove();

            newTile.style.left = null;
            newTile.style.top = null;
            newTile.style.transform = null;

            placeholderTile.remove();
            placeholderTile = null;

            // Finalizes the dragged tile back to a stationary position
            draggedTile.style.left = null;
            draggedTile.style.top = null;
            draggedTile.style.transform = null;
            draggedTile = null;

            // Evaluates if player has solved the puzzle
            var gridChildren = grid.children;
            var totalSquares = gridChildren.length - 1;

            // If each tile in the grid is in ascending order, then the player wins
            winCheck: for(var i = 0; i < gridChildren.length; i++) {
                if(parseInt(gridChildren[i].getAttribute('tile-num')) != i) {
                    break winCheck;
                }
                if(i === totalSquares) {
                    finishingLevel = true;
                    puzzleSolved = true;
                    timerRunning = false;
                    jsConfetti.addConfetti();
                    await sleep(1800);

                    overlayTime.innerHTML = timer.innerHTML;

                    overlaySwaps.innerHTML = swaps;
                    finalOverlay.classList.remove('hidden');
                    finishingLevel = false;
                }
            }

        } else {
            // If the dragged tile is not released on top of another tile, snap it back to the home position
            let oldTilePos = placeholderTile.getBoundingClientRect();

            draggedTile.classList.add('swapping');
            draggedTile.style.transform = "translate(" + (oldTilePos.left - parseInt(draggedTile.style.left.slice(0, -2))) + "px," + (oldTilePos.top - parseInt(draggedTile.style.top.slice(0, -2))) + "px)";

            await sleep(180);

            draggedTile.classList.remove('swapping');

            placeholderTile.remove();
            placeholderTile = null;

            // Finalizes the dragged tile back to a stationary position
            draggedTile.classList.remove('dragging');

            draggedTile.style.left = null;
            draggedTile.style.top = null;
            draggedTile.style.transform = null;
            draggedTile = null;
        }

        // Removes listener moving tile with cursor
        if(touch) {
            document.removeEventListener('touchmove', onItemDrag);
        } else {
            document.removeEventListener('mousemove', onItemDrag);
        }
    }
}

// Selects random colors for the corners which will be used to generate the gradient
function randomizeCornerColors() {
    let suitableColors = false;

    while(!suitableColors) {
        const colorDeltas = [];

        for(let i = 0; i < 4; i++) {
            cornerColors[i] = getRandomColor();
        }

        for(let i = 0; i < 4; i++) {
            let rgb1 = hexToRgb(cornerColors[i])
            for(let j = 1+i; j < 4; j++) {
                let rgb2 = hexToRgb(cornerColors[j]);
                colorDeltas.push(deltaE([rgb1.r, rgb1.g, rgb1.b], [rgb2.r, rgb2.g, rgb2.b]));
            }
        }

        if(Math.min(...colorDeltas) > colorSimilarityThreshold) {
            suitableColors = true;
        }
    }
}

// Generate a random hex code
function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

// Function to interpolate between two colors
function interpolateColor(color1, color2, factor) {
    const result = color1.slice(1).match(/.{2}/g).map((hex, i) => {
        return Math.round(parseInt(hex, 16) + factor * (parseInt(color2.slice(1).match(/.{2}/g)[i], 16) - parseInt(hex, 16)));
    });
    return `#${result.map(x => x.toString(16).padStart(2, '0')).join('')}`;
}

// Function to generate the gradient grid
function generateGradientGrid(c1, c2, c3, c4, width, height) {
    const grid = [];
    for (let y = 0; y < height; y++) {
        const row = [];
        for (let x = 0; x < width; x++) {
            // Interpolate between the top and bottom edges
            const colorTop = interpolateColor(c1, c2, x / (width - 1));
            const colorBottom = interpolateColor(c3, c4, x / (width - 1));
            // Interpolate between the result of the top and bottom
            const color = interpolateColor(colorTop, colorBottom, y / (height - 1));
            row.push(color);
        }
        grid.push(row);
    }
    return grid;
}

function chooseFixedTiles(rows, columns) {
    var fixedTileNumList = [];
    fixedTileNumList.push(0);
    fixedTileNumList.push(columns-1);
    fixedTileNumList.push(columns*(rows-1));
    fixedTileNumList.push((rows*columns)-1);

    function genFullVertical(fixedTileNumList, rows, columns) {
        let column = (columns/2) - 1;
        if (columns & 1) {
            for(let i = 0; i < rows; i++) {
                fixedTileNumList.push((columns*i)+Math.ceil(column));
            }
        } else {
            for(let i = 0; i < rows; i++) {
                for(let j = 0; j < 2; j++) {
                    fixedTileNumList.push((columns*i)+(column+j));
                }
            }
        }
    }

    function genFullHorizontal(fixedTileNumList, rows, columns) {
        let row = (rows/2) - 1;
        if (rows & 1) {
            for(let i = 0; i < columns; i++) {
                fixedTileNumList.push((columns*Math.ceil(row))+i);
            }
        } else {
            for(let i = 0; i < 2; i++) {
                for(let j = 0; j < columns; j++) {
                    fixedTileNumList.push((columns*(row+i))+j);
                }
            }
        }
    }

    function genSides(fixedTileNumList, rows, columns, sides) {
        const sideFunctions = {
            0: () => {
                for (let i = 1; i < columns - 1; i++) {
                    fixedTileNumList.push(i); // Top
                }
            },
            1: () => {
                for (let i = 1; i < rows - 1; i++) {
                    fixedTileNumList.push(i * columns); // Left
                }
            },
            2: () => {
                for (let i = 1; i < columns - 1; i++) {
                    fixedTileNumList.push(columns * (rows - 1) + i); // Bottom
                }
            },
            3: () => {
                for (let i = 1; i < rows - 1; i++) {
                    fixedTileNumList.push((i + 1) * columns - 1); // Right
                }
            }
        };
    
        sides.forEach(side => sideFunctions[side]());
    }
    
    function getCenterTiles(rows, columns) {
        var centerTiles = [];

        let row = rows/2
        let column = columns/2
        if ((columns*rows) & 1) {
            centerTiles.push((columns*Math.ceil(row))-Math.ceil(column));
        } else if(!(columns & 1) && !(rows & 1)) {
            for(let i = 0; i < 2; i++) {
                for(let j = 0; j < 2; j++) {
                    centerTiles.push((columns*(row+i))-(column+j));
                }
            }
        } else {
            if(!(columns & 1)) {
                for(let i = 0; i < 2; i++) {
                    centerTiles.push((columns*(Math.ceil(row)))-(column+i));
                }
            } else {
                for(let i = 0; i < 2; i++) {
                    centerTiles.push((columns*(row+i))-Math.ceil(column));
                }
            }
        }

        return centerTiles;
    }

    var fixedTilePatterns =  [
        // Random full sides [0]
        (fixedTileNumList, rows, columns, sidePattern) => {
            let totalPatterns = 15
            if (rows < 4 && columns < 4) {
                if (sidePattern == 14) {
                    return false;
                }
                totalPatterns = 14;
            }

            if(!sidePattern) {
                sidePattern = Math.floor(Math.random() * totalPatterns);
            }
            
            const sidePatterns = [
                [0],
                [1],
                [2],
                [3],   
                [0, 1],
                [0, 2],
                [0, 3],
                [1, 2],
                [1, 3],
                [2, 3],
                [0, 1, 2],
                [0, 1, 3],
                [0, 2, 3],
                [1, 2, 3],
                [0, 1, 2, 3]
            ];

            genSides(fixedTileNumList, rows, columns, sidePatterns[sidePattern]);

            return true;
        },
        // Every other square [1]
        (fixedTileNumList, rows, columns) => {
            if (((columns*rows) & 1) && !(columns == 3 && rows == 3)) {
                for(let i = 2; i < ((columns*rows) - 1); i+=2) {
                    if(!fixedTileNumList.includes(i)) {
                        fixedTileNumList.push(i);
                    }
                }
                return true;
            } else {
                return false;
            }
        },
        // Center [2]
        (fixedTileNumList, rows, columns) => {
            let centerTiles = getCenterTiles(rows, columns);
            for(let i = 0; i < centerTiles.length; i++) {
                fixedTileNumList.push(centerTiles[i]);
            }
            return true;
        },
        // Vertical line [3]
        (fixedTileNumList, rows, columns) => {
            genFullVertical(fixedTileNumList, rows, columns);
            return true;
        },
        // Horizontal line [4]
        (fixedTileNumList, rows, columns) => {
            genFullHorizontal(fixedTileNumList, rows, columns);
            return true;
        },
        // Cross [5]
        (fixedTileNumList, rows, columns) => {
            if (rows > 6 && columns > 6) {
                genFullVertical(fixedTileNumList, rows, columns);

                let centerTiles = getCenterTiles(rows, columns);
                for(let i = 0; i < centerTiles.length; i++) {
                    fixedTileNumList.splice(fixedTileNumList.indexOf(centerTiles[i]), 1);
                }

                genFullHorizontal(fixedTileNumList, rows, columns);
                return true;
            } else {
                return false;
            }
        },
        // Just corners [6]
        () => {return true;}
    ]

    let pattern = null;

    do {
        pattern = Math.floor(Math.random() * fixedTilePatterns.length)
    } while (!fixedTilePatterns[pattern](fixedTileNumList, rows, columns));


    return fixedTileNumList.sort(function(a, b){return a - b});
}

// Generate a new tile grid
function generateGrid() {
    puzzleReady = false;

    const columns = parseInt(widthLabel.innerHTML);
    const rows = parseInt(heightLabel.innerHTML);

    randomizeCornerColors();

    // Generate gradient colors for grid
    let colorGrid = generateGradientGrid(cornerColors[0], cornerColors[1], cornerColors[2], cornerColors[3], columns, rows);

    // Create fixed tile pattern, setting corners as fixed
    fixedTileNumList = chooseFixedTiles(rows, columns);

    const availableScreenWidth = window.innerWidth - 40;
    const availableScreenHeight = window.innerHeight - 120;

    const tileWidth = clamp((availableScreenWidth / columns), 0, 100);
    const tileHeight = clamp((availableScreenHeight / rows), 0, 100);
    
    // Update grid template
    grid.style.gridTemplateColumns = `repeat(${columns}, ${tileWidth}px)`;
    grid.style.gridTemplateRows = `repeat(${rows}, ${tileHeight}px)`;

    let counter = 0;

    // Generate new grid of tiles
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < columns; j++) {
            // Create new tile
            const tile = document.createElement('div');
            tile.classList.add('tile');
            tile.style.backgroundColor = colorGrid[i][j];
            tile.style.width = tileWidth + 'px';
            tile.style.height = tileHeight + 'px';
            tile.setAttribute('tile-num', counter);

            // If tile is fixed, add additional properties
            if(fixedTileNumList.includes(counter)) {
                tile.classList.add('fixed');
                 
                const centerDot = document.createElement('div');
                centerDot.classList.add('dot');
                const dotSize = (((tileWidth / 10) + (tileHeight / 10)) / 2);
                centerDot.style.width = dotSize + 'px';
                centerDot.style.height = dotSize + 'px';
                centerDot.style.transform = "translate(" + ((tileWidth-dotSize)/2) + "px," + ((tileHeight-dotSize)/2) + "px)";

                tile.appendChild(centerDot);
            }

            fullTileList.push(tile);

            // Separate fixed and unfixed tiles
            if(tile.classList.contains('fixed')) {
                fixedTileList.push(tile);
            } else {
                randomTileList.push(tile);
            }
            counter++;
        }
    }

    insertTilesOrdered();

    puzzleReady = true;
}

function insertTilesRandom() {
    // Clear existing grid
    grid.innerHTML = '';

    for (let i = 0; i < fullTileList.length; i++) {
        if (fixedTileNumList.includes(i)) {
            grid.appendChild(fixedTileList[fixedTileNumList.indexOf(i)]);
        } else {
            let randomIndex = Math.floor(Math.random() * randomTileList.length);
            grid.appendChild(randomTileList[randomIndex]);
            randomTileList.splice(randomIndex, 1);
        }
    }
}

function insertTilesOrdered() {
    // Clear existing grid
    grid.innerHTML = '';

    for (let i = 0; i < fullTileList.length; i++) {
        grid.appendChild(fullTileList[i]);
    }
}

function transitionTiles(reorderTiles) {
    var gridChildren = grid.children;
    for(let i = 0; i < fullTileList.length; i++) {
        if(!gridChildren[i].classList.contains('fixed')) {
            gridChildren[i].classList.remove('draggable');

            gridChildren[i].classList.add("scaling");

            gridChildren[i].style.transform = "scale(0)";

            setTimeout(() => {
                gridChildren[i].style.transform = "scale(1)";
            }, 800);

            setTimeout(() => {
                gridChildren[i].classList.remove("scaling");
            }, 1700);

            if(!puzzleSolved) {
                setTimeout(() => {
                    gridChildren[i].classList.add('draggable');
                }, 1700);
            }
        }
    }

    setTimeout(() => {
        reorderTiles();
    }, 700);
}