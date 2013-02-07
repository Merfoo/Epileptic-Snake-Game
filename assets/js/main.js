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
var m_iMenuSpeed = 50;
var m_iGameSpeedOriginal = 80;
var m_iGameSpeedMain = m_iGameSpeedOriginal;
var m_iGameSpeedOne = m_iGameSpeedOriginal;
var m_iGameSpeedTwo = m_iGameSpeedOriginal;

// Scores
var m_iScoreOne = 0;
var m_iScoreTwo = 0;
var m_iHighestScoreOne = 0;
var m_iHighestScoreTwo = 0;

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
var m_MusicList = new Array(m_sDirectory + "Ephixia - Zelda Remix.mp3", m_sDirectory + "Song One.mp3", m_sDirectory + "Song Two.mp3", m_sDirectory + "Song Three.mp3");
var m_iPrevMusicIndex = getRandomNumber(0, m_MusicList.length - 1);
var m_FoodMusic = new Audio(m_sDirectory + "Food.mp3");
var m_BackgroundMusic = new Audio(m_MusicList[m_iPrevMusicIndex]);
var m_bSoundOn = true;

// Lettering
var m_cS = new Array(20);
var m_cN = new Array(17);
var m_cA = new Array(18);
var m_cK = new Array(15);
var m_cE = new Array(17);

// HTML5 Elemtents
var m_CanvasContext;

// Interval ID's
var m_IntervalMenu;
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
var m_bShownYet = false;

window.addEventListener('keydown', doKeyDown, true);
window.addEventListener('keyup', doKeyUp, true);
document.addEventListener("DOMContentLoaded", initializeCanvas, false);
document.documentElement.style.overflowX = 'hidden';	 // Horizontal scrollbar will be hidden
document.documentElement.style.overflowY = 'hidden';     // Vertical scrollbar will be hidden

// Initialize canvas
function initializeCanvas()
{
    // Get canvas context for drawing, add events
    m_CanvasContext = document.getElementById("myCanvas").getContext("2d");
    setCanvasSize();
    setUpLetters();
    showStartMenu(true);
}

// Starts game
function startGame(iGameVersion)
{
    m_iGameVersion = iGameVersion;

    if (m_iGameVersion == 0)
        initializeSingle();

    else if (m_iGameVersion == 1)
        initializeMulti();

    else if (m_iGameVersion == 2)
        initializeTeleportic();

    else if (m_iGameVersion == 3)
        initializeMultiTeleportic();
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
    if (!m_bShownYet && bVisible)
    {
        document.getElementById("singlePlayer").style.zIndex = 1;
        document.getElementById("multiPlayer").style.zIndex = 1;
        document.getElementById("teleportic").style.zIndex = 1;
        document.getElementById("multiTeleportic").style.zIndex = 1;
        m_IntervalMenu = window.setInterval("paintStartMenu();", m_iMenuSpeed);
        m_bShownYet = true;
    }

    else
    {
        document.getElementById("singlePlayer").style.zIndex = -1;
        document.getElementById("multiPlayer").style.zIndex = -1;
        document.getElementById("teleportic").style.zIndex = -1;
        document.getElementById("multiTeleportic").style.zIndex = -1;
        window.clearInterval(m_IntervalMenu);
        m_bShownYet = false;
    }
}

function paintStartMenu()
{
    // Paints Whole screen black
    for (var x = 0; x < m_iMapWidth; x++)
        for (var y = 0; y < m_iMapHeight; y++)
            paintTile(x, y, m_cBackroundColor, 0);

    var tempArray = m_cS.concat(m_cN, m_cA, m_cK, m_cE);

    for (var index = 0; index < tempArray.length; index++)
        paintTile(tempArray[index].x, tempArray[index].y, getRandomColor(1, 255), 0);
}

//function showStartMenu(bVisible)
//{
//    if (bVisible)
//        document.getElementById("startMenu").style.zIndex = 2;

//    else
//        document.getElementById("startMenu").style.zIndex = -1;
//m_CanvasContext.font = '42pt Verdana Italic';
//m_CanvasContext.fillStyle = "white";
//m_CanvasContext.fillText("SinglePlayer!", 7 * m_iTileWidth, 16 * m_iTileHeight);
//m_CanvasContext.fillText("SinglePlayer Teleportic!", 3 * m_iTileWidth, 26 * m_iTileHeight);
//m_CanvasContext.fillText("Multiplayer!", 37 * m_iTileWidth, 16 * m_iTileHeight);
//m_CanvasContext.fillText("Multiplayer Teleportic!", 33 * m_iTileWidth, 26 * m_iTileHeight);
//}

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

// Hides fast pic, show slow pic
function hideFastPic()
{
    document.getElementById("fastMode").style.zIndex = -1;
    document.getElementById("slowMode").style.zIndex = -1;
}

// Writes message to corresponding tile, with specified colour
function writeMessage(startTile, color, message)
{
    m_CanvasContext.fillStyle = 'white';
    m_CanvasContext.fillRect(startTile * m_iTileWidth, 0, message.length * 12, m_iTileHeight);
    m_CanvasContext.font = '16pt Calibri';
    m_CanvasContext.fillStyle = color;
    m_CanvasContext.fillText(message, startTile * m_iTileWidth, 20);
}

// Plays background music if mute is off
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

// Resets background music to zero
function resetBackgroundMusic()
{
    m_BackgroundMusic.currentTime = 0;
}

// Stops background music
function stopBackgroundMusic()
{
    m_BackgroundMusic.pause();
}

// Plays food music
function playFoodMusic()
{
    if(m_bSoundOn)
        m_FoodMusic.play();
}

// Checks if the snake it a teleporter, if so teleports it
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

// Creates a pair of teleporters
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

// Checks if the snake hit the wall or itself
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

// Checks if the snakes hit eachother's body
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

// Handles increasing the speed variable
function increaseSpeed(iGameSpeed)
{
    return (1.0 / ((1.0 / iGameSpeed) + 0.002));
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

// Returns random color between iMin and iMax.
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

// Returns random number between iMin and iMax.
function getRandomNumber(iMin, iMax)
{
    return Math.floor((Math.random() * (iMax - iMin)) + iMin);
}

// Capitalizes first leter of string.
function capitalizeFirst(sArg)
{
    return sArg.charAt(0).toUpperCase() + sArg.slice(1);
}

function setUpLetters()
{
    var index = 0;

    // S
    m_cS[index++] = {x: 19, y: 3};
    m_cS[index++] = {x: 18, y: 3};
    m_cS[index++] = {x: 17, y: 3};
    m_cS[index++] = {x: 16, y: 3};      
    m_cS[index++] = { x: 15, y: 3 };    // 5
    m_cS[index++] = { x: 15, y: 4 };
    m_cS[index++] = { x: 15, y: 5 };
    m_cS[index++] = { x: 15, y: 6 };
    m_cS[index++] = { x: 19, y: 6 };
    m_cS[index++] = { x: 18, y: 6 };    // 10
    m_cS[index++] = { x: 17, y: 6 };
    m_cS[index++] = { x: 16, y: 6 };
    m_cS[index++] = { x: 19, y: 7 };
    m_cS[index++] = { x: 19, y: 8 };
    m_cS[index++] = { x: 19, y: 9 };    // 15
    m_cS[index++] = { x: 15, y: 9 };
    m_cS[index++] = { x: 16, y: 9 };
    m_cS[index++] = { x: 17, y: 9 };
    m_cS[index++] = { x: 18, y: 9 };
    m_cS[index++] = { x: 19, y: 9 };    // 20
    index = 0;

    // N
    m_cN[index++] = { x: 21, y: 3 };
    m_cN[index++] = { x: 22, y: 3 };
    m_cN[index++] = { x: 23, y: 3 };
    m_cN[index++] = { x: 24, y: 3 };
    m_cN[index++] = { x: 25, y: 3 };    // 5
    m_cN[index++] = { x: 21, y: 4 };
    m_cN[index++] = { x: 21, y: 5 };
    m_cN[index++] = { x: 21, y: 6 };
    m_cN[index++] = { x: 21, y: 7 };
    m_cN[index++] = { x: 21, y: 8 };    // 10
    m_cN[index++] = { x: 21, y: 9 };
    m_cN[index++] = { x: 25, y: 4 };
    m_cN[index++] = { x: 25, y: 5 };
    m_cN[index++] = { x: 25, y: 6 };
    m_cN[index++] = { x: 25, y: 7 };    // 15
    m_cN[index++] = { x: 25, y: 8 };
    m_cN[index++] = { x: 25, y: 9 };
    index = 0;

    // A
    m_cA[index++] = { x: 30, y: 3 };
    m_cA[index++] = { x: 29, y: 3 };
    m_cA[index++] = { x: 28, y: 3 };
    m_cA[index++] = { x: 27, y: 4 };
    m_cA[index++] = { x: 27, y: 5 };    // 5
    m_cA[index++] = { x: 27, y: 6 };
    m_cA[index++] = { x: 27, y: 7 };
    m_cA[index++] = { x: 27, y: 8 };
    m_cA[index++] = { x: 27, y: 9 }; 
    m_cA[index++] = { x: 31, y: 4 };    // 10
    m_cA[index++] = { x: 31, y: 5 };
    m_cA[index++] = { x: 31, y: 6 };
    m_cA[index++] = { x: 31, y: 7 };
    m_cA[index++] = { x: 31, y: 8 };
    m_cA[index++] = { x: 31, y: 9 };    // 15
    m_cA[index++] = { x: 28, y: 6 };
    m_cA[index++] = { x: 29, y: 6 };
    m_cA[index++] = { x: 30, y: 6 };
    index = 0;

    // K
    m_cK[index++] = { x: 33, y: 3 };
    m_cK[index++] = { x: 33, y: 4 };
    m_cK[index++] = { x: 33, y: 5 };
    m_cK[index++] = { x: 33, y: 6 };
    m_cK[index++] = { x: 33, y: 7 };    // 5
    m_cK[index++] = { x: 33, y: 8 };
    m_cK[index++] = { x: 33, y: 9 };
    m_cK[index++] = { x: 27, y: 8 };
    m_cK[index++] = { x: 27, y: 9 };
    m_cK[index++] = { x: 34, y: 6 };    // 10
    m_cK[index++] = { x: 35, y: 5 };
    m_cK[index++] = { x: 35, y: 7 };
    m_cK[index++] = { x: 36, y: 4 };
    m_cK[index++] = { x: 36, y: 8 };
    m_cK[index++] = { x: 37, y: 3 };
    m_cK[index++] = { x: 37, y: 9 };    // 15
    index = 0;

    // E
    m_cE[index++] = { x: 39, y: 3 };
    m_cE[index++] = { x: 40, y: 3 };
    m_cE[index++] = { x: 41, y: 3 };
    m_cE[index++] = { x: 42, y: 3 };
    m_cE[index++] = { x: 43, y: 3 };    // 5
    m_cE[index++] = { x: 39, y: 4 };
    m_cE[index++] = { x: 39, y: 5 };
    m_cE[index++] = { x: 39, y: 6 };
    m_cE[index++] = { x: 39, y: 7 };
    m_cE[index++] = { x: 39, y: 8 };    // 10
    m_cE[index++] = { x: 39, y: 9 };
    m_cE[index++] = { x: 40, y: 6 };
    m_cE[index++] = { x: 41, y: 6 };
    m_cE[index++] = { x: 42, y: 6 };
    m_cE[index++] = { x: 40, y: 9 };
    m_cE[index++] = { x: 41, y: 9 };    // 15
    m_cE[index++] = { x: 42, y: 9 };
    m_cE[index++] = { x: 43, y: 9 };    
    index = 0;
} 

function handleClickLocation(x, y)
{

}
//// S
//m_cS[index++] = { x: 19, y: 3 };
//m_cS[index++] = { x: 18, y: 3 };
//m_cS[index++] = { x: 17, y: 3 };
//m_cS[index++] = { x: 16, y: 3 };
//m_cS[index++] = { x: 15, y: 3 };    // 5
//m_cS[index++] = { x: 15, y: 4 };
//m_cS[index++] = { x: 15, y: 5 };
//m_cS[index++] = { x: 15, y: 6 };
//m_cS[index++] = { x: 19, y: 6 };
//m_cS[index++] = { x: 18, y: 6 };    // 10
//m_cS[index++] = { x: 17, y: 6 };
//m_cS[index++] = { x: 16, y: 6 };
//m_cS[index++] = { x: 19, y: 7 };
//m_cS[index++] = { x: 19, y: 8 };
//m_cS[index++] = { x: 19, y: 9 };    // 15
//m_cS[index++] = { x: 15, y: 9 };
//m_cS[index++] = { x: 16, y: 9 };
//m_cS[index++] = { x: 17, y: 9 };
//m_cS[index++] = { x: 18, y: 9 };
//m_cS[index++] = { x: 19, y: 9 };    // 20
//index = 0;

//// N
//m_cN[index++] = { x: 21, y: 3 };
//m_cN[index++] = { x: 22, y: 3 };
//m_cN[index++] = { x: 23, y: 3 };
//m_cN[index++] = { x: 24, y: 3 };
//m_cN[index++] = { x: 25, y: 3 };    // 5
//m_cN[index++] = { x: 21, y: 4 };
//m_cN[index++] = { x: 21, y: 5 };
//m_cN[index++] = { x: 21, y: 6 };
//m_cN[index++] = { x: 21, y: 7 };
//m_cN[index++] = { x: 21, y: 8 };    // 10
//m_cN[index++] = { x: 21, y: 9 };
//m_cN[index++] = { x: 25, y: 4 };
//m_cN[index++] = { x: 25, y: 5 };
//m_cN[index++] = { x: 25, y: 6 };
//m_cN[index++] = { x: 25, y: 7 };    // 15
//m_cN[index++] = { x: 25, y: 8 };
//m_cN[index++] = { x: 25, y: 9 };
//index = 0;

//// A
//m_cA[index++] = { x: 30, y: 3 };
//m_cA[index++] = { x: 29, y: 3 };
//m_cA[index++] = { x: 28, y: 3 };
//m_cA[index++] = { x: 27, y: 4 };
//m_cA[index++] = { x: 27, y: 5 };    // 5
//m_cA[index++] = { x: 27, y: 6 };
//m_cA[index++] = { x: 27, y: 7 };
//m_cA[index++] = { x: 27, y: 8 };
//m_cA[index++] = { x: 27, y: 9 };
//m_cA[index++] = { x: 31, y: 4 };    // 10
//m_cA[index++] = { x: 31, y: 5 };
//m_cA[index++] = { x: 31, y: 6 };
//m_cA[index++] = { x: 31, y: 7 };
//m_cA[index++] = { x: 31, y: 8 };
//m_cA[index++] = { x: 31, y: 9 };    // 15
//m_cA[index++] = { x: 28, y: 6 };
//m_cA[index++] = { x: 29, y: 6 };
//m_cA[index++] = { x: 30, y: 6 };
//index = 0;

//// K
//m_cK[index++] = { x: 33, y: 3 };
//m_cK[index++] = { x: 33, y: 4 };
//m_cK[index++] = { x: 33, y: 5 };
//m_cK[index++] = { x: 33, y: 6 };
//m_cK[index++] = { x: 33, y: 7 };    // 5
//m_cK[index++] = { x: 33, y: 8 };
//m_cK[index++] = { x: 33, y: 9 };
//m_cK[index++] = { x: 27, y: 8 };
//m_cK[index++] = { x: 27, y: 9 };
//m_cK[index++] = { x: 34, y: 6 };    // 10
//m_cK[index++] = { x: 35, y: 5 };
//m_cK[index++] = { x: 35, y: 7 };
//m_cK[index++] = { x: 36, y: 4 };
//m_cK[index++] = { x: 36, y: 8 };
//m_cK[index++] = { x: 37, y: 3 };
//m_cK[index++] = { x: 37, y: 9 };    // 15
//index = 0;

//// E
//m_cE[index++] = { x: 39, y: 3 };
//m_cE[index++] = { x: 40, y: 3 };
//m_cE[index++] = { x: 41, y: 3 };
//m_cE[index++] = { x: 42, y: 3 };
//m_cE[index++] = { x: 43, y: 3 };    // 5
//m_cE[index++] = { x: 39, y: 4 };
//m_cE[index++] = { x: 39, y: 5 };
//m_cE[index++] = { x: 39, y: 6 };
//m_cE[index++] = { x: 39, y: 7 };
//m_cE[index++] = { x: 39, y: 8 };    // 10
//m_cE[index++] = { x: 39, y: 9 };
//m_cE[index++] = { x: 40, y: 6 };
//m_cE[index++] = { x: 41, y: 6 };
//m_cE[index++] = { x: 42, y: 6 };
//m_cE[index++] = { x: 40, y: 9 };
//m_cE[index++] = { x: 41, y: 9 };    // 15
//m_cE[index++] = { x: 42, y: 9 };
//m_cE[index++] = { x: 43, y: 9 };
//index = 0;
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
//    m_cS[0].x = 19;
//    m_cS[0].y = 3;
//    m_cS[1].x = 18;
//    m_cS[1].y = 3;
//    m_cS[2].x = 17;
//    m_cS[2].y = 3;
//    m_cS[3].x = 16;
//    m_cS[3].y = 3;
//    m_cS[4].x = 15;
//    m_cS[4].y = 3;
//    m_cS[5].x = 15;
//    m_cS[5].y = 4;
//    m_cS[6].x = 15;
//    m_cS[6].y = 5;
//    m_cS[7].x = 15;
//    m_cS[7].y = 6;
//    m_cS[8].x = 16;
//    m_cS[8].y = 6;
//    m_cS[9].x = 17;
//    m_cS[9].y = 6;
//    m_cS[10].x = 18;
//    m_cS[10].y = 6;
//    m_cS[11].x = 19;
//    m_cS[11].y = 6;
//    m_cS[12].x = 19;
//    m_cS[12].y = 7;
//    m_cS[13].x = 19;
//    m_cS[13].y = 8;
//    m_cS[14].x = 19;
//    m_cS[14].y = 9;
//    m_cS[15].x = 18;
//    m_cS[15].y = 9;
//    m_cS[16].x = 17;
//    m_cS[16].y = 9;
//    m_cS[17].x = 16;
//    m_cS[17].y = 9;
//    m_cS[18].x = 15;
//    m_cS[18].y = 9;

//    // N
//    m_cN[0].x = 25
//    m_cN[0].y = 3;
//    m_cN[1].x = 24
//    m_cN[1].y = 3;
//    m_cN[2].x = 23
//    m_cN[2].y = 3;
//    m_cN[3].x = 22
//    m_cN[3].y = 3;
//    m_cN[4].x = 21
//    m_cN[4].y = 3;
//    m_cN[5].x = 21
//    m_cN[5].y = 4;
//    m_cN[6].x = 21
//    m_cN[6].y = 5;
//    m_cN[7].x = 21
//    m_cN[7].y = 6;
//    m_cN[8].x = 21
//    m_cN[8].y = 7;
//    m_cN[9].x = 21
//    m_cN[9].y = 8;
//    m_cN[10].x = 21
//    m_cN[10].y = 9;
//    m_cN[11].x = 25
//    m_cN[11].y = 3;
//    m_cN[12].x = 25
//    m_cN[12].y = 4;
//    m_cN[13].x = 25
//    m_cN[13].y = 5;
//    m_cN[14].x = 25
//    m_cN[14].y = 6;
//    m_cN[15].x = 25
//    m_cN[15].y = 7;
//    m_cN[16].x = 25
//    m_cN[16].y = 8;
//    m_cN[17].x = 25
//    m_cN[17].y = 9;

//    // A
//    m_cA[0].x = 28;
//    m_cA[0].y = 3;
//    m_cA[1].x = 29;
//    m_cA[1].y = 3;
//    m_cA[2].x = 30;
//    m_cA[2].y = 3;
//    m_cA[3].x = 27;
//    m_cA[3].y = 4;
//    m_cA[4].x = 27;
//    m_cA[4].y = 5;
//    m_cA[5].x = 27;
//    m_cA[5].y = 6;
//    m_cA[6].x = 27;
//    m_cA[6].y = 7;
//    m_cA[7].x = 27;
//    m_cA[7].y = 8;
//    m_cA[8].x = 27;
//    m_cA[8].y = 9;
//    m_cA[9].x = 31;
//    m_cA[9].y = 4;
//    m_cA[10].x = 31;
//    m_cA[10].y = 5;
//    m_cA[12].x = 31;
//    m_cA[12].y = 6;
//    m_cA[13].x = 31;
//    m_cA[13].y = 7;
//    m_cA[14].x = 31;
//    m_cA[14].y = 8;
//    m_cA[15].x = 31;
//    m_cA[15].y = 9;
//    m_cA[16].x = 28;
//    m_cA[16].y = 6;
//    m_cA[17].x = 29;
//    m_cA[17].y = 6;
//    m_cA[18].x = 30;
//    m_cA[18].y = 6;

//    // K
//    m_cK[0].x =
//}