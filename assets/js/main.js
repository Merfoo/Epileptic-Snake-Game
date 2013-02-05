// This file conatins all variables used with different variations of the game, and some useful functions

// Map Related
var m_iMapWidth = 60;
var m_iMapHeight = 30;
var m_iTileWidth;
var m_iTileHeight;

// All colors/ borders
var m_iBackgroundBorderWidth = 0;
var m_iSnakeBodyBorderWidth = 2;
var m_iSnakeHeadBorderWidth = 2;
var m_iFoodBorderWidth = 0;
var m_cBackroundColor = "#000";
var m_cScoreColorOne = "#000";

// Snake Related
var m_iOriginalSnakeLengthSingle = 7;
var m_iOriginalSnakeLengthMulti = 12;

// Snake One Related
var m_iSnakeOneID = 1;
var m_cSnakeColorOne = "red";
var m_iSnakeHeadOne = { x: m_iOriginalSnakeLengthSingle - 2, y: 1 };
var m_iSnakeBodyOne = new Array(m_iOriginalSnakeLengthSingle);
var m_iDirectionOne = "right";
var m_bIsSnakeUpdatedOne = false;

// Snake Two Related
var m_iSnakeTwoID = 2;
var m_cSnakeColorTwo = "blue";
var m_iSnakeHeadTwo = { x: m_iMapWidth - m_iOriginalSnakeLengthMulti + 1, y: 1 };
var m_iSnakeBodyTwo = new Array();
var m_iDirectionTwo = "left";
var m_bIsSnakeUpdatedTwo = false;

// Game speed
var m_iGameSpeedOriginal = 80;
var m_iGameSpeedMain = m_iGameSpeedOriginal;
var m_iGameSpeedOne = m_iGameSpeedOriginal;
var m_iGameSpeedTwo = m_iGameSpeedOriginal;
var m_iGameDecrease = 5;
var m_iGameMinuim = 1;

// Scores
var m_iAmountAteOne = 0;
var m_iAmountAteTwo = 0;
var m_iHighestAmount = 0;
var m_iTotalScoreOne = 1;
var m_iTotalScoreTwo = 1;

// Fast Speed
var m_iFastDivider = 4;
var m_iFastSpeed = Math.floor(m_iGameSpeedMain / m_iFastDivider);
var m_bFastMode = false;

// Food
var m_iFoodX = 0;
var m_iFoodY = 0;

// Messages alignment
var m_iLeft;
var m_iMiddle;
var m_iRight;

// Teleporting Blocks
var m_cTeleporterColors = new Array("white", "red", "blue", "yellow", "green");
var m_iTeleporters = new Array()
var m_iTeleporterCheck = 1;
var m_iTeleporteMax = 5;

// Sound Related
var m_sDirectory = "assets/music/";
var m_MusicList = new Array(m_sDirectory + "backgroundMusic.mp3", m_sDirectory + "Noseyuk-ROYALTY FREE DUBSTEP_ DRUM&BASS INSTRUMENTAL.mp3", m_sDirectory + "Portal2-01-Reconstructing_More_Science.mp3", m_sDirectory + "Portal2-04-An_Accent_Beyond.mp3", m_sDirectory + "Portal2-24-Robots_FTW.mp3");
var m_iPrevMusicIndex = getRandomNumber(0, m_MusicList.length - 1);
var m_FoodMusic = new Audio("assets/music/food.mp3");
var m_BackgroundMusic = new Audio(m_MusicList[m_iPrevMusicIndex]);
var m_bSoundOn = true;

// HTML5 Elemtents
var m_CanvasContext;

// Interval ID's
var m_IntervalIDMain;
var m_IntervalIDOne;
var m_IntervalIDTwo;

// Game version related.
var m_iGameVersion = 0;
var m_bGameStarted = false;
var m_bSingle = false;
var m_bMulti = false;
var m_bSingleTeleportic = false;
var m_bMultiTeleportic = false;
var m_bIsPaused = false;

window.addEventListener('keydown', doKeyDown, true);
window.addEventListener('keyup', doKeyUp, true);
document.documentElement.style.overflowX = 'hidden';	 // Horizontal scrollbar will be hidden
document.documentElement.style.overflowY = 'hidden';     // Vertical scrollbar will be hidden

function startGame()
{
    if (m_iGameVersion == 0)
        initializeSingle();

    else if (m_iGameVersion == 1)
        initializeMulti();

    else if (m_iGameVersion == 2)
        initializeTeleportic();

    else if (m_iGameVersion == 3)
        initializeMultiTeleportic();

    m_iGameVersion = 0;
}

function setGameSingle()
{
    m_iGameVersion = 0;
}

function setGameMulti()
{
    m_iGameVersion = 1;
}

function setGameSingleTeleportic()
{
    m_iGameVersion = 2;
}

function setGameMultiTeleportic()
{
    m_iGameVersion = 3;
}

// Changes gamespeed
function changeGameSpeed(intervalID, sFunction,gameSpeed)
{
    window.clearInterval(intervalID);
    intervalID = window.setInterval(sFunction, gameSpeed);

    return intervalID;
}

// Sets the canvas as big as the broswer size.
function setCanvasSize()
{
    m_iTileWidth = Math.floor((window.innerWidth / m_iMapWidth));
    m_iTileHeight = Math.floor((window.innerHeight / m_iMapHeight)) - 1;
    m_CanvasContext.canvas.width = (m_iTileWidth * m_iMapWidth);
    m_CanvasContext.canvas.height = (m_iTileHeight * m_iMapHeight);
    m_iLeft = 1;
    m_iMiddle = Math.floor((m_iMapWidth / 2) - 6);
    m_iRight = Math.floor((m_iMapWidth) - 10);
}

// Paints a tile on the screen, handles converting pixel to tile.
function paintTile(x, y, color, borderThickness)
{
    m_CanvasContext.fillStyle = color;
    m_CanvasContext.fillRect((x * m_iTileWidth) + borderThickness, (y * m_iTileHeight) + borderThickness, m_iTileWidth - (borderThickness * 2), m_iTileHeight - (borderThickness * 2));
}

// Shows start menu, based on argument.
function showStartMenu(bVisible)
{
    if (bVisible)
        document.getElementById("startMenu").style.zIndex = 2;

    else
        document.getElementById("startMenu").style.zIndex = -1;
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
    m_bSoundOn = bOn;

    if (m_bSoundOn)
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

// Sets the fast pause visible
function setFastPicVisible(bVisible)
{
    m_bFastMode = bVisible;

    if (m_bFastMode)
    {
        document.getElementById("fastMode").style.zIndex = 1;
        document.getElementById("slowMode").style.zIndex = -1;
    }

    else {
        document.getElementById("fastMode").style.zIndex = -1;
        document.getElementById("slowMode").style.zIndex = 1;
    }
}

function hideFastPic()
{
    document.getElementById("fastMode").style.zIndex = -1;
    document.getElementById("slowMode").style.zIndex = -1;
}

function writeMessage(startTile, color, message) {
    m_CanvasContext.fillStyle = 'white';
    m_CanvasContext.fillRect(startTile * m_iTileWidth, 0, message.length * 12, m_iTileHeight);
    m_CanvasContext.font = '16pt Calibri';
    m_CanvasContext.fillStyle = color;
    m_CanvasContext.fillText(message, startTile * m_iTileWidth, 20);
}

function playBackgroundMusic()
{
    if (m_bSoundOn)
    {
        if (m_BackgroundMusic.ended)
        {
            var  iNewMusicIndex = getRandomNumber(0, m_MusicList.length - 1);

            while(iNewMusicIndex == m_iPrevMusicIndex)
                iNewMusicIndex = getRandomNumber(0, m_MusicList.length - 1);

            m_iPrevMusicIndex = iNewMusicIndex;
            m_BackgroundMusic.src = m_MusicList[m_iPrevMusicIndex];
        }

        m_BackgroundMusic.play();
    }

    else
        m_BackgroundMusic.pause();
}

function resetBackgroundMusic()
{
    m_BackgroundMusic.currentTime = 0;
}

function stopBackgroundMusic()
{
    m_BackgroundMusic.pause();
}

function playFoodMusic()
{
    if(m_bSoundOn)
    {
        m_FoodMusic.currentTime = 0;
        m_FoodMusic.play();
    }
}

function runTeleporters(snakeHead)
{
    for (var index = 0; index < m_iTeleporters.length; index++)
    {
        if (snakeHead.x == m_iTeleporters[index].x && snakeHead.y == m_iTeleporters[index].y)
        {
            if (index % 2 == 0)
            {
                index++;
                snakeHead.x = m_iTeleporters[index].x;
                snakeHead.y = m_iTeleporters[index].y;
            }

            else
            {
                index--;
                snakeHead.x = m_iTeleporters[index].x;
                snakeHead.y = m_iTeleporters[index].y;
            }
        }
    }
}

function createTeleportingBlocks()
{
    var teleporterColor = m_cTeleporterColors[m_iTeleporters.length / 2];
    var newTeleporterA = { x: getRandomNumber(1, m_iMapWidth - 1), y: getRandomNumber(1, m_iMapHeight - 1), color: teleporterColor };
    m_iTeleporters.push(newTeleporterA);
    var newTeleporterB = { x: getRandomNumber(1, m_iMapWidth - 1), y: getRandomNumber(1, m_iMapHeight - 1), color: teleporterColor };
    m_iTeleporters.push(newTeleporterB);
}

// Sets up the snake body based on direction
function setUpSnake(snakeHead, snakeBody, sDirection)
{
    var tempSnakeData = snakeBody.pop();
    paintTile(tempSnakeData.x, tempSnakeData.y, m_cBackroundColor, 0);

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

function checkCollision(snakeBody)
{
    // Checks if snake hit the borders
    if (snakeBody[0].x >= m_iMapWidth)
        return true;

    if (snakeBody[0].x < 0)
        return true;

    if (snakeBody[0].y >= m_iMapHeight)
        return true;

    if (snakeBody[0].y <= 0)
        return true;

    // Checks if the snakes hit themselves
    for (var index = 1; index < snakeBody.length; index++)
        if (snakeBody[0].x == snakeBody[index].x && snakeBody[0].y == snakeBody[index].y)
            return true;

    return false;
}

function hitOtherSnakes(snakeBodyOne, snakeBodyTwo, snakeIdOne, snakeIdTwo)
{
    if (snakeBodyOne[0].x == snakeBodyTwo[0].x && snakeBodyOne[0].y == snakeBodyTwo[0].y)
    {
        if (getRandomNumber(0, 10) <= 4)
            return snakeIdOne

        else
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
        m_iFoodX = getRandomNumber(0, m_iMapWidth - 1);
        m_iFoodY = getRandomNumber(1, m_iMapHeight - 1);

        for (var index = 0; index < snakeBody.length; index++)
        {
            if (m_iFoodX == snakeBody[index].x && m_iFoodY == snakeBody[index].y)
            {
                bIsFoodOnSnake = true;
                break;
            }
        }
    }
}

// Handles the changing direction of the snake.
function doKeyDown(event) {

    if (m_bGameStarted && !m_bIsPaused)
    {
        if (m_bSingle)
            keyBoardDownSinglePlayer();

        else if (m_bSingleTeleportic)
            keyBoardDownTeleportic();

        else if (m_bMulti)
            keyBoardDownMultiplayer();

        else if(m_bMultiTeleportic)
            keyBoardDownMultiplayerTeleportic();
    }
}

// Handles key up events
function doKeyUp(event)
{
    if (m_bGameStarted)
    {
        if (m_bSingle)
            keyBoardUpSinglePlayer();

        else if (m_bSingleTeleportic)
            keyBoardUpTeleportic();

        else if (m_bMulti)
            keyBoardUpMultiplayer();

        else if (m_bMultiTeleportic)
            keyBoardUpMultiplayerTeleportic();

        if (event.keyCode == 77)    // 'm' was pressed.
            m_bSoundOn = !m_bSoundOn;
    }
}

function getRandomColor(iMin, iMax)
{
    // creating a random number between iMin and iMax
    var r = getRandomNumber(iMin, iMax)
    var g = getRandomNumber(iMin, iMax)
    var b = getRandomNumber(iMin, iMax)

    // going from decimal to hex
    var hexR = r.toString(16);
    var hexG = g.toString(16);
    var hexB = b.toString(16);

    // making sure single character values are prepended with a "0"
    if (hexR.length == 1)
        hexR = "0" + hexR;

    if (hexG.length == 1)
        hexG = "0" + hexG;

    if (hexB.length == 1)
        hexB = "0" + hexB;

    // creating the hex value by concatenatening the string values
    var hexColor = "#" + hexR + hexG + hexB;
    return hexColor.toUpperCase();
}

function getRandomNumber(iMin, iMax)
{
    return Math.floor((Math.random() * (iMax - iMin)) + iMin);
}

function capitalizeFirst(sArg)
{
    return sArg.charAt(0).toUpperCase() + sArg.slice(1);
}