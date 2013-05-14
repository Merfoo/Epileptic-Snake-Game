// This file conatins all variables used with different variations of the game

// Maxwidth is the total pixels across the screen, width is amount of tiles across the screen and tileWidth is the pixel across each tile
var m_iMap = { maxWidth: 0, maxHeight: 0, width: 60, height: 30, tileWidth: 0, tileHeight: 0, backgroundColor: "black", toolbarColor: "white" };

// Directions
var m_sDirection = { left: "left", right: "right", up: "up", down: "down" };

// Border widths
var m_iBorderWidth = { background: 0, snakeBody: 4, snakeHead: 2, food: 0 };

// Snake Related
var m_iSnakeData = { lengthSingle: 7, lengthMulti: 12, headColor: "white" };

// Contains snake starting position
var m_iSnakeStarting = { single: { x: Math.floor(m_iMap.width / 2) - 1, y: 0 }, directionSingle: m_sDirection.down, oneMulti: { x: m_iMap.width - 1, y: 0 }, oneDirection: m_sDirection.down, twoMulti: { x: 0, y: m_iMap.height }, twoDirection: m_sDirection.up };

// Snake One 
var m_iSnakeOne = { id: 1, color: "blue", head: { x: 0, y: 0 }, body: new Array(), direction: "", updated: false };

// Snake Two 
var m_iSnakeTwo = { id: 2, color: "red", head: { x: 0, y: 0 }, body: new Array(), direction: "", updated: false };

// Controls
var m_iControls = { toMenu: 27, pause: 32, mute: 77, snakeOneLeft: 37, snakeOneRight: 39, snakeOneUp: 38, snakeOneDown: 40, snakeTwoLeft: 65, snakeTwoRight: 68, snakeTwoUp: 87, snakeTwoDown: 83 };

// Game speed
var m_iSpeed = { menu: 60, gameOriginal: 80, gameMain: 80, gameOne: 80, gameTwo: 80 };

// Scores
var m_iScore = { one: 0, two: 0, highestOne: 0, highestTwo: 0, color: "black" };

// Food
var m_iFood = { x: 0, y: 0 };

// Messages alignment
var m_iTextAlignment = { left: 0, middle: 0, right: 0 };

// Teleporting Blocks
var m_iTeleporters = { color: new Array("white", "red", "blue", "yellow", "green"), teleporters: new Array(), max: 5 };

// Sound Related
var m_Music = { backgroundSrcMp3: "music/background.mp3", backgroundSrcOgg: "music/background.ogg", foodSrcMp3: "music/Food.mp3", foodSrcOgg: "music/Food.ogg", food: null, background: null, soundOn: true };

// Title
var m_iTitle = new Array();

// HTML5 Elemtents
var m_CanvasContext;

// Interval ID's
var m_iIntervalId = { menu: null, main: null, one: null, two: null };

// Game version related.
var m_bGameStatus = { started: false, single: false, multi: false, singleTeleportic: false, multiTeleportic: false, paused: false, instructions: false };

window.addEventListener('keydown', doKeyDown, true);
window.addEventListener('keyup', doKeyUp, true);
document.addEventListener("DOMContentLoaded", initializeGame, false);
document.documentElement.style.overflowX = 'hidden';	 // Horizontal scrollbar will be hidden
document.documentElement.style.overflowY = 'hidden';     // Vertical scrollbar will be hidden
//
// Initialize canvas
function initializeGame()
{
    setUpMusic();
    setUpCanvas();
    setSoundPicVisible(m_Music.soundOn);
    setUpLetters();
    showStartMenu(true);
}

// Starts game
function startGame(iGameVersion)
{
    if(!m_bGameStatus.started)
    {
        switch(iGameVersion)
        {
            case 0:
                initializeSingle();
                break;

            case 1:
                initializeMulti();
                break;

            case 2:
                initializeTeleportic();
                break;

            case 3:
                initializeMultiTeleportic();
                break;
        }
    }
}

// Changes gamespeed
function changeGameSpeed(intervalID, sFunction,gameSpeed)
{
    window.clearInterval(intervalID);
    intervalID = window.setInterval(sFunction, gameSpeed);

    return intervalID;
}

// Sets the canvas as big as the broswer size.
function setUpCanvas()
{
    m_CanvasContext = document.getElementById("myCanvas").getContext("2d");     // Get canvas context
    m_iMap.maxWidth = window.innerWidth;                                        // Set maxWidth to broswer width
    m_iMap.maxHeight = window.innerHeight;                                      // Set maxHeight to broswer height
    m_iMap.tileWidth = Math.floor(m_iMap.maxWidth / m_iMap.width);
    m_iMap.tileHeight = Math.floor(m_iMap.maxHeight / m_iMap.height);
    m_CanvasContext.canvas.width = (m_iMap.tileWidth * m_iMap.width);
    m_CanvasContext.canvas.height = (m_iMap.tileHeight * m_iMap.height);
    m_iTextAlignment.left = 1;
    m_iTextAlignment.middle = Math.floor((m_iMap.width / 2) - 6);
    m_iTextAlignment.right = Math.floor((m_iMap.width) - 10);
}

// Sets up the music
function setUpMusic()
{
    if(canPlayMp3()) // If true, browser supports mp3
    {
        m_Music.food = new Audio(m_Music.foodSrcMp3); 
        m_Music.background = new Audio(m_Music.backgroundSrcMp3);
    }

    else    // If it doesnt it probably supports ogg
    {
        m_Music.food = new Audio(m_Music.foodSrcOgg); 
        m_Music.background = new Audio(m_Music.backgroundSrcOgg);
    }
}

// Paints a tile on the screen, handles converting pixel to tile.
function paintTile(x, y, color, borderThickness)
{
    m_CanvasContext.fillStyle = color;
    m_CanvasContext.fillRect((x * m_iMap.tileWidth) + borderThickness, (y * m_iMap.tileHeight) + borderThickness, m_iMap.tileWidth - (borderThickness * 2), m_iMap.tileHeight - (borderThickness * 2));
}

// Shows start menu, based on argument.
function showStartMenu(bVisible)
{
    paintGameScreen();

    if (bVisible)
    {
        showInstructions(false);
        resetGame();
        document.getElementById("startMenu").style.zIndex = 1;
        m_iIntervalId.menu = window.setInterval("paintStartMenu();", m_iSpeed.menu);
    }

    else
    {
        document.getElementById("startMenu").style.zIndex = -1;
        window.clearInterval(m_iIntervalId.menu);
    }
}

function showInstructions(bVisible)
{
    m_bGameStatus.instructions = bVisible;

    if (bVisible)
    {
        document.getElementById("instructions").style.zIndex = 1;
        showStartMenu(false);
    }

    else
        document.getElementById("instructions").style.zIndex = -1;
}

function paintStartMenu()
{
    paintGameScreen();
    writeMessage(1, "black", "Background Music: Cluster Block by FoxSynergy");

    for (var index = 0; index < m_iTitle.length; index++)
        paintTile(m_iTitle[index].x, m_iTitle[index].y, getRandomColor(1, 255), 1);
}

// Shows pause pause if true, otherwise hides it.
function showPausePic(bVisible)
{
    if (bVisible)
        document.getElementById("pause").style.zIndex = 1;

    else
        document.getElementById("pause").style.zIndex = -1;
}

// Sets the sound on pause on visible
function setSoundPicVisible(bOn)
{
    m_Music.soundOn = bOn;

    if (m_Music.soundOn)
    {
        document.getElementById("soundOn").style.zIndex = 1;
        document.getElementById("soundOff").style.zIndex = -1;
    }

    else
    {
        document.getElementById("soundOn").style.zIndex = -1;
        document.getElementById("soundOff").style.zIndex = 1;
    }
}

// Writes message to corresponding tile, with specified colour
function writeMessage(startTile, color, message)
{
    m_CanvasContext.font = (m_iMap.tileHeight/2) + 'pt Calibri';
    m_CanvasContext.fillStyle = color;
    m_CanvasContext.fillText(message, startTile * m_iMap.tileWidth, (m_iMap.tileHeight / 2) + 4);
}

// Plays background music if mute is off
function playBackgroundMusic()
{
    if (m_Music.soundOn)
    {
        if (m_Music.background.ended)
            m_Music.background.src = m_Music.background.src;

        m_Music.background.play();
    }

    else
        stopBackgroundMusic();
}

// Stops background music
function stopBackgroundMusic()
{
    m_Music.background.pause();
}

// Plays food music
function playFoodMusic()
{
    if(m_Music.soundOn)
    {
        m_Music.food.src = m_Music.food.src;
        m_Music.food.play();
    }
}

// Checks if the snake is on a teleporter, if so teleports it
function runTeleporters(snake)
{
    for (var index = 0; index < m_iTeleporters.teleporters.length; index++)
    {
        if (snake.head.x == m_iTeleporters.teleporters[index].x && snake.head.y == m_iTeleporters.teleporters[index].y)
        {
            if (index % 2 == 0)
            {
                index++;
                snake.head.x = m_iTeleporters.teleporters[index].x;
                snake.head.y = m_iTeleporters.teleporters[index].y;
            }

            else
            {
                index--;
                snake.head.x = m_iTeleporters.teleporters[index].x;
                snake.head.y = m_iTeleporters.teleporters[index].y;
            }

            break;
        }
    }
}

// Paints teleporters
function paintTeleporters()
{
    for (var index = 0; index < m_iTeleporters.teleporters.length; index++)
        paintTile(m_iTeleporters.teleporters[index].x, m_iTeleporters.teleporters[index].y, m_iTeleporters.teleporters[index].color, 0);
}

// Creates a pair of teleporters
function createTeleporters()
{
    m_iTeleporters.teleporters.length;
    var teleporterColor = m_iTeleporters.color[m_iTeleporters.teleporters.length / 2];
    var newTeleporterA = { x: getRandomNumber(1, m_iMap.width - 1), y: getRandomNumber(1, m_iMap.height - 1), color: teleporterColor };
    m_iTeleporters.teleporters.push(newTeleporterA);
    var newTeleporterB = { x: getRandomNumber(1, m_iMap.width - 1), y: getRandomNumber(1, m_iMap.height - 1), color: teleporterColor };
    m_iTeleporters.teleporters.push(newTeleporterB);
}


// Paints the food
function paintFood()
{
    paintTile(m_iFood.x, m_iFood.y, getRandomColor(1, 255), m_iBorderWidth.food);
}

// Sets up the snake body based on direction
function setUpSnake(snake)
{
    paintTile(snake.head.x, snake.head.y, m_iMap.backgroundColor, 0);
    paintTile(snake.body[snake.body.length - 1].x, snake.body[snake.body.length - 1].y, m_iMap.backgroundColor, 0);
    var tempSnakeData = snake.body.pop();

    if (snake.direction == m_sDirection.right)
        tempSnakeData = { x: ++snake.head.x, y: snake.head.y };

    if (snake.direction == m_sDirection.left)
        tempSnakeData = { x: --snake.head.x, y: snake.head.y };

    if (snake.direction == m_sDirection.down)
        tempSnakeData = { x: snake.head.x, y: ++snake.head.y };

    if (snake.direction == m_sDirection.up)
        tempSnakeData = { x: snake.head.x, y: --snake.head.y };

    snake.body.unshift(tempSnakeData);
}

// Checks if the snake hit the wall or itself
function checkCollision(snake)
{
    // Checks if snake hit the borders
    if (snake.head.x >= m_iMap.width)
        return true;

    if (snake.head.x < 0)
        return true;

    if (snake.head.y >= m_iMap.height)
        return true;

    if (snake.head.y <= 0)
        return true;

    // Checks if the snakes hit themselves
    for (var index = 1; index < snake.body.length; index++)
        if (snake.head.x == snake.body[index].x && snake.head.y == snake.body[index].y)
            return true;

    return false;
}

// Checks if the snakes hit eachother's body
function hitOtherSnakes(snakeOne, snakeTwo)
{
    if (snakeOne.head.x == snakeTwo.head.x && snakeOne.head.y == snakeTwo.head.y)
    {
        if (getRandomNumber(0, 10) <= 5)
            return snakeOne.id;

        return snakeTwo.id;
    }

    // Checks if the snakes hit the other snakes
    for (var index = 1; index < snakeTwo.body.length; index++)
        if (snakeOne.head.x == snakeTwo.body[index].x && snakeOne.head.y == snakeTwo.body[index].y)
            return snakeOne.id;

    for (var index = 1; index < snakeOne.body.length; index++)
        if (snakeTwo.head.x == snakeOne.body[index].x && snakeTwo.head.y == snakeOne.body[index].y)
            return snakeTwo.id;

    return 0;
}

// Sets up food
function setFood(snakeBody)
{
    var bIsFoodOnSnake = true;

    // Makes sure food isn't on snakes
    while (bIsFoodOnSnake)
    {
        bIsFoodOnSnake = false;
        m_iFood.x = getRandomNumber(0, m_iMap.width - 1);
        m_iFood.y = getRandomNumber(1, m_iMap.height - 1);

        for (var index = 0; index < snakeBody.length; index++)
        {
            if (m_iFood.x == snakeBody[index].x && m_iFood.y == snakeBody[index].y)
            {
                bIsFoodOnSnake = true;
                break;
            }
        }

        for (var iPos = 0; iPos < m_iTeleporters.teleporters.length; iPos++) 
        {
            if(m_iTeleporters.teleporters[iPos].x == m_iFood.x && m_iTeleporters.teleporters[iPos].y == m_iFood.y)
            {
                bIsFoodOnSnake = true;
                break;
            }
        }
    }
}

// Resets all variables
function resetGame()
{
    m_bGameStatus.paused = false;
    m_bGameStatus.started = false;
    m_bGameStatus.single = false;
    m_bGameStatus.singleTeleportic = false;
    m_bGameStatus.multi = false;
    m_bGameStatus.multiTeleportic = false;
    m_iScore.one = 0;
    m_iScore.highestOne = 0;
    m_iScore.two = 0;
    m_iScore.highestTwo = 0;
}

// Initializes snake
function initializeSnake(snake, x, y, direction, length)
{
    // Set snake head, direction
    snake.head.x = x;
    snake.head.y = y;
    snake.body = new Array(length);
    snake.direction = direction;

    // Set snake body
    for (var index = 0; index < snake.body.length; index++)
    {
        switch (direction)
        {
            case m_sDirection.left:
                snake.body[index] = { x: snake.head.x + index, y: snake.head.y };
                continue;

            case m_sDirection.right:
                snake.body[index] = { x: snake.head.x - index, y: snake.head.y };
                continue;

            case m_sDirection.up:
                snake.body[index] = { x: snake.head.x, y: snake.head.y + index };
                continue;

            case m_sDirection.down:
                snake.body[index] = { x: snake.head.x, y: snake.head.y - index };
                continue;
        }
    }
}

// Handles increasing the speed variable
function increaseSpeed(iGameSpeed)
{
    return (1.0 / ((1.0 / iGameSpeed) + 0.002));
}

// Handles the changing direction of the snake.
function doKeyDown(event)
{
    if (m_bGameStatus.started && !m_bGameStatus.paused)
    {
        if (m_bGameStatus.single)
            keyBoardDownSinglePlayer(event);

        else if (m_bGameStatus.singleTeleportic)
            keyBoardDownTeleportic(event);

        else if (m_bGameStatus.multi)
            keyBoardDownMulti(event);

        else if(m_bGameStatus.multiTeleportic)
            keyBoardDownMultiplayerTeleportic(event);
    }

    event.preventDefault();
    return false;
}

// Handles key up events
function doKeyUp(event)
{
    if (m_bGameStatus.started)
    {
        if (m_bGameStatus.single)
            keyBoardUpSinglePlayer(event);

        else if (m_bGameStatus.singleTeleportic)
            keyBoardUpTeleportic(event);

        else if (m_bGameStatus.multi)
            keyBoardUpMulti(event);

        else if (m_bGameStatus.multiTeleportic)
            keyBoardUpMultiplayerTeleportic(event);
    }

    if (event.keyCode == m_iControls.mute)    // 'm' was pressed.
        setSoundPicVisible(m_Music.soundOn = !m_Music.soundOn);

    if (m_bGameStatus.instructions)
        showStartMenu(true);
    
    event.preventDefault();
    return false;
}

function paintGameScreen()
{
    paintToolbar();
    m_CanvasContext.fillStyle = m_iMap.backgroundColor;
    m_CanvasContext.fillRect(0, m_iMap.tileHeight, m_iMap.maxWidth, m_iMap.maxHeight - m_iMap.tileHeight);
}

function paintToolbar()
{
    m_CanvasContext.fillStyle = "white";
    m_CanvasContext.fillRect(0, 0, m_iMap.maxWidth, m_iMap.tileHeight);
}

function setUpLetters()
{
    // S
    m_iTitle.push({ x: 19, y: 3 });
    m_iTitle.push({ x: 18, y: 3 });
    m_iTitle.push({ x: 17, y: 3 });
    m_iTitle.push({ x: 16, y: 3 });      
    m_iTitle.push({ x: 15, y: 3 });    // 5
    m_iTitle.push({ x: 15, y: 4 });
    m_iTitle.push({ x: 15, y: 5 });
    m_iTitle.push({ x: 15, y: 6 });
    m_iTitle.push({ x: 19, y: 6 });
    m_iTitle.push({ x: 18, y: 6 });    // 10
    m_iTitle.push({ x: 17, y: 6 });
    m_iTitle.push({ x: 16, y: 6 });
    m_iTitle.push({ x: 19, y: 7 });
    m_iTitle.push({ x: 19, y: 8 });
    m_iTitle.push({ x: 19, y: 9 });    // 15
    m_iTitle.push({ x: 15, y: 9 });
    m_iTitle.push({ x: 16, y: 9 });
    m_iTitle.push({ x: 17, y: 9 });
    m_iTitle.push({ x: 18, y: 9 });
    m_iTitle.push({ x: 19, y: 9 });    // 20

    // N
    m_iTitle.push({ x: 21, y: 3 });
    m_iTitle.push({ x: 22, y: 3 });
    m_iTitle.push({ x: 23, y: 3 });
    m_iTitle.push({ x: 24, y: 3 });
    m_iTitle.push({ x: 25, y: 3 });    // 5
    m_iTitle.push({ x: 21, y: 4 });
    m_iTitle.push({ x: 21, y: 5 });
    m_iTitle.push({ x: 21, y: 6 });
    m_iTitle.push({ x: 21, y: 7 });
    m_iTitle.push({ x: 21, y: 8 });    // 10
    m_iTitle.push({ x: 21, y: 9 });
    m_iTitle.push({ x: 25, y: 4 });
    m_iTitle.push({ x: 25, y: 5 });
    m_iTitle.push({ x: 25, y: 6 });
    m_iTitle.push({ x: 25, y: 7 });    // 15
    m_iTitle.push({ x: 25, y: 8 });
    m_iTitle.push({ x: 25, y: 9 });

    // A
    m_iTitle.push({ x: 30, y: 3 });
    m_iTitle.push({ x: 29, y: 3 });
    m_iTitle.push({ x: 28, y: 3 });
    m_iTitle.push({ x: m_iControls.toMenu, y: 4 });
    m_iTitle.push({ x: m_iControls.toMenu, y: 5 });    // 5
    m_iTitle.push({ x: m_iControls.toMenu, y: 6 });
    m_iTitle.push({ x: m_iControls.toMenu, y: 7 });
    m_iTitle.push({ x: m_iControls.toMenu, y: 8 });
    m_iTitle.push({ x: m_iControls.toMenu, y: 9 }); 
    m_iTitle.push({ x: 31, y: 4 });    // 10
    m_iTitle.push({ x: 31, y: 5 });
    m_iTitle.push({ x: 31, y: 6 });
    m_iTitle.push({ x: 31, y: 7 });
    m_iTitle.push({ x: 31, y: 8 });
    m_iTitle.push({ x: 31, y: 9 });    // 15
    m_iTitle.push({ x: 28, y: 6 });
    m_iTitle.push({ x: 29, y: 6 });
    m_iTitle.push({ x: 30, y: 6 });

    // K
    m_iTitle.push({ x: 33, y: 3 });
    m_iTitle.push({ x: 33, y: 4 });
    m_iTitle.push({ x: 33, y: 5 });
    m_iTitle.push({ x: 33, y: 6 });
    m_iTitle.push({ x: 33, y: 7 });    // 5
    m_iTitle.push({ x: 33, y: 8 });
    m_iTitle.push({ x: 33, y: 9 });
    m_iTitle.push({ x: m_iControls.toMenu, y: 8 });
    m_iTitle.push({ x: m_iControls.toMenu, y: 9 });
    m_iTitle.push({ x: 34, y: 6 });    // 10
    m_iTitle.push({ x: 35, y: 5 });
    m_iTitle.push({ x: 35, y: 7 });
    m_iTitle.push({ x: 36, y: 4 });
    m_iTitle.push({ x: 36, y: 8 });
    m_iTitle.push({ x: m_iControls.snakeOneLeft, y: 3 });
    m_iTitle.push({ x: m_iControls.snakeOneLeft, y: 9 });    // 15

    // E
    m_iTitle.push({ x: m_iControls.snakeOneRight, y: 3 });
    m_iTitle.push({ x: m_iControls.snakeOneDown, y: 3 });
    m_iTitle.push({ x: 41, y: 3 });
    m_iTitle.push({ x: 42, y: 3 });
    m_iTitle.push({ x: 43, y: 3 });    // 5
    m_iTitle.push({ x: m_iControls.snakeOneRight, y: 4 });
    m_iTitle.push({ x: m_iControls.snakeOneRight, y: 5 });
    m_iTitle.push({ x: m_iControls.snakeOneRight, y: 6 });
    m_iTitle.push({ x: m_iControls.snakeOneRight, y: 7 });
    m_iTitle.push({ x: m_iControls.snakeOneRight, y: 8 });    // 10
    m_iTitle.push({ x: m_iControls.snakeOneRight, y: 9 });
    m_iTitle.push({ x: m_iControls.snakeOneDown, y: 6 });
    m_iTitle.push({ x: 41, y: 6 });
    m_iTitle.push({ x: 42, y: 6 });
    m_iTitle.push({ x: m_iControls.snakeOneDown, y: 9 });
    m_iTitle.push({ x: 41, y: 9 });    // 15
    m_iTitle.push({ x: 42, y: 9 });
    m_iTitle.push({ x: 43, y: 9 });    
} 