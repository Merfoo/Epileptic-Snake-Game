// This file conatins all variables used with different variations of the game

// Maxwidth is the total pixels across the screen, width is amount of tiles across the screen and tileWidth is the pixel across each tile
var m_iMap = { maxWidth: 0, maxHeight: 0, width: 60, height: 30, tileWidth: 0, tileHeight: 0, backgroundColor: "black", toolbarColor: "white" };

// Credits
var m_Credits = { y: -600, startY: 100, minY: -600, yDecrease: 3, showing: false, interval: null, speed: 33 };

// Border widths
var m_iBorderWidth = { background: 0, snakeBody: 4, snakeHead: 2, food: 0 };

// Snake Related
var m_iSnakeData = { lengthSingle: 7, lengthMulti: 12, headColor: "white" };

// Snake One 
var m_iSnakeOne = { id: 1, color: "red", head: { x: m_iSnakeData.lengthSingle - 2, y: 1 }, body: new Array(), direction: "right", updated: false };

// Snake Two 
var m_iSnakeTwo = { id: 2, color: "blue", head: { x: m_iMap.width - m_iSnakeData.lengthMulti + 1, y: 1 }, body: new Array(), direction: "left", updated: false };

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
var m_Music = { backgroundSrcMp3: "music/Ephixia - Zelda Remix.mp3", backgroundSrcOgg: "music/Ephixia - Zelda Remix.ogg", foodSrcMp3: "music/Food.mp3", foodSrcOgg: "music/Food.ogg", food: null, background: null, soundOn: true };

// Title
var m_iTitle = new Array();

// HTML5 Elemtents
var m_CanvasContext;

// Interval ID's
var m_iIntervalId = { menu: null, main: null, one: null, two: null };

// Game version related.
var m_bGameStatus = { started: false, single: false, multi: false, singleTeleportic: false, multiTeleportic: false, paused: false };

window.addEventListener('keydown', doKeyDown, true);
window.addEventListener('keyup', doKeyUp, true);
document.addEventListener("DOMContentLoaded", initializeGame, false);
document.documentElement.style.overflowX = 'hidden';	 // Horizontal scrollbar will be hidden
document.documentElement.style.overflowY = 'hidden';     // Vertical scrollbar will be hidden

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
    if (bVisible)
    {
        document.getElementById("startMenu").style.zIndex = 1;
        m_iIntervalId.menu = window.setInterval("paintStartMenu();", m_iSpeed.menu);
        m_Credits.showing = false;
        
        if(m_Credits.interval != null)
        {
            window.clearInterval(m_Credits.interval);
            m_Credits.interval = null;
        }
    }

    else
    {
        paintGameScreen();
        document.getElementById("startMenu").style.zIndex = -1;
        window.clearInterval(m_iIntervalId.menu);
    }
}

function paintStartMenu()
{
    paintGameScreen();

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
    m_CanvasContext.fillStyle = "white";
    m_CanvasContext.fillRect(startTile * m_iMap.tileWidth, 0, message.length * 12, m_iMap.tileHeight);
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

// Checks if the snake it a teleporter, if so teleports it
function runTeleporters(snakeHead)
{
    for (var index = 0; index < m_iTeleporters.teleporters.length; index++)
    {
        if (snakeHead.x == m_iTeleporters.teleporters[index].x && snakeHead.y == m_iTeleporters.teleporters[index].y)
        {
            if (index % 2 == 0)
            {
                index++;
                snakeHead.x = m_iTeleporters.teleporters[index].x;
                snakeHead.y = m_iTeleporters.teleporters[index].y;
            }

            else
            {
                index--;
                snakeHead.x = m_iTeleporters.teleporters[index].x;
                snakeHead.y = m_iTeleporters.teleporters[index].y;
            }
        }
    }
}

// Creates a pair of teleporters
function createTeleportingBlocks()
{
    m_iTeleporters.teleporters.length;
    var teleporterColor = m_iTeleporters.color[m_iTeleporters.teleporters.length / 2];
    var newTeleporterA = { x: getRandomNumber(1, m_iMap.width - 1), y: getRandomNumber(1, m_iMap.height - 1), color: teleporterColor };
    m_iTeleporters.teleporters.push(newTeleporterA);
    var newTeleporterB = { x: getRandomNumber(1, m_iMap.width - 1), y: getRandomNumber(1, m_iMap.height - 1), color: teleporterColor };
    m_iTeleporters.teleporters.push(newTeleporterB);
}

// Sets up the snake body based on direction
function setUpSnake(snakeHead, snakeBody, sDirection)
{
    paintTile(snakeHead.x, snakeHead.y, m_iMap.backgroundColor, 0);
    paintTile(snakeBody[snakeBody.length - 1].x, snakeBody[snakeBody.length - 1].y, m_iMap.backgroundColor, 0);
    var tempSnakeData = snakeBody.pop();

    if (sDirection == "right")
        tempSnakeData = { x: ++snakeHead.x, y: snakeHead.y };

    if (sDirection == "left")
        tempSnakeData = { x: --snakeHead.x, y: snakeHead.y };

    if (sDirection == "down")
        tempSnakeData = { x: snakeHead.x, y: ++snakeHead.y };

    if (sDirection == "up")
        tempSnakeData = { x: snakeHead.x, y: --snakeHead.y };

    snakeBody.unshift(tempSnakeData);
}

// Checks if the snake hit the wall or itself
function checkCollision(snakeBody)
{
    // Checks if snake hit the borders
    if (snakeBody[0].x >= m_iMap.width)
        return true;

    if (snakeBody[0].x < 0)
        return true;

    if (snakeBody[0].y >= m_iMap.height)
        return true;

    if (snakeBody[0].y <= 0)
        return true;

    // Checks if the snakes hit themselves
    for (var index = 1; index < snakeBody.length; index++)
        if (snakeBody[0].x == snakeBody[index].x && snakeBody[0].y == snakeBody[index].y)
            return true;

    return false;
}

// Checks if the snakes hit eachother's body
function hitOtherSnakes(snakeBodyOne, snakeBodyTwo, snakeIdOne, snakeIdTwo)
{
    if (snakeBodyOne[0].x == snakeBodyTwo[0].x && snakeBodyOne[0].y == snakeBodyTwo[0].y)
    {
        if (getRandomNumber(0, 10) <= 5)
            return snakeIdOne;

        return snakeIdTwo;
    }

    // Checks if the snakes hit the other snakes
    for (var index = 1; index < snakeBodyTwo.length; index++)
        if (snakeBodyOne[0].x == snakeBodyTwo[index].x && snakeBodyOne[0].y == snakeBodyTwo[index].y)
            return snakeIdOne;

    for (var index = 1; index < snakeBodyOne.length; index++)
        if (snakeBodyTwo[0].x == snakeBodyOne[index].x && snakeBodyTwo[0].y == snakeBodyOne[index].y)
            return snakeIdTwo;

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
            keyBoardDownMultiplayer(event);

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
            keyBoardUpMultiplayer(event);

        else if (m_bGameStatus.multiTeleportic)
            keyBoardUpMultiplayerTeleportic(event);
    }

    if (event.keyCode == 77)    // 'm' was pressed.
        setSoundPicVisible(m_Music.soundOn = !m_Music.soundOn);

    if(m_Credits.showing)
       if (event.keyCode == 27) // Escape was pressed
            showStartMenu(true);
    
    event.preventDefault();
    return false;
}

function paintWholeScreen(color)
{
    m_CanvasContext.fillStyle = color;
    m_CanvasContext.fillRect(0, 0, m_iMap.maxWidth, m_iMap.maxHeight);
}

function paintGameScreen()
{
    for (var x = 0; x < m_iMap.width; x++)
        for (var y = 0; y < m_iMap.height; y++)
            y == 0 ? paintTile(x, y, m_iMap.toolbarColor, 0) : paintTile(x, y, m_iMap.backgroundColor, 0);
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
    m_iTitle.push({ x: 27, y: 4 });
    m_iTitle.push({ x: 27, y: 5 });    // 5
    m_iTitle.push({ x: 27, y: 6 });
    m_iTitle.push({ x: 27, y: 7 });
    m_iTitle.push({ x: 27, y: 8 });
    m_iTitle.push({ x: 27, y: 9 }); 
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
    m_iTitle.push({ x: 27, y: 8 });
    m_iTitle.push({ x: 27, y: 9 });
    m_iTitle.push({ x: 34, y: 6 });    // 10
    m_iTitle.push({ x: 35, y: 5 });
    m_iTitle.push({ x: 35, y: 7 });
    m_iTitle.push({ x: 36, y: 4 });
    m_iTitle.push({ x: 36, y: 8 });
    m_iTitle.push({ x: 37, y: 3 });
    m_iTitle.push({ x: 37, y: 9 });    // 15

    // E
    m_iTitle.push({ x: 39, y: 3 });
    m_iTitle.push({ x: 40, y: 3 });
    m_iTitle.push({ x: 41, y: 3 });
    m_iTitle.push({ x: 42, y: 3 });
    m_iTitle.push({ x: 43, y: 3 });    // 5
    m_iTitle.push({ x: 39, y: 4 });
    m_iTitle.push({ x: 39, y: 5 });
    m_iTitle.push({ x: 39, y: 6 });
    m_iTitle.push({ x: 39, y: 7 });
    m_iTitle.push({ x: 39, y: 8 });    // 10
    m_iTitle.push({ x: 39, y: 9 });
    m_iTitle.push({ x: 40, y: 6 });
    m_iTitle.push({ x: 41, y: 6 });
    m_iTitle.push({ x: 42, y: 6 });
    m_iTitle.push({ x: 40, y: 9 });
    m_iTitle.push({ x: 41, y: 9 });    // 15
    m_iTitle.push({ x: 42, y: 9 });
    m_iTitle.push({ x: 43, y: 9 });    
} 

function clickedCredits()
{
    showStartMenu(false);
    m_Credits.showing = true;  
    window.clearInterval(m_iIntervalId.menu);
    m_Credits.interval = window.setInterval("showCredits();", m_Credits.speed);
    m_Credits.y = m_Credits.minY;
}

function showCredits()
{
    if(m_Credits.y <= m_Credits.minY)
        m_Credits.y = m_iMap.maxHeight + m_Credits.startY;
    
    paintWholeScreen(m_iMap.backgroundColor);
    m_CanvasContext.fillStyle = "white";
    m_CanvasContext.font = '40px san-serif';
    m_CanvasContext.textBaseline = 'bottom';
    m_CanvasContext.fillText('Head Developer: Fauzi Kliman', Math.floor(m_iMap.maxWidth / 3), m_Credits.y);
    m_CanvasContext.fillText('Assistant Developer: Jacob Payne', Math.floor(m_iMap.maxWidth / 3), m_Credits.y + 200);
    m_CanvasContext.fillText('Beta Tester: Gil Parnon', Math.floor(m_iMap.maxWidth / 3), m_Credits.y + 400);
    m_Credits.y -= m_Credits.yDecrease;
}