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
var m_cBorderColor = "#000";
var m_cSnakeColor = "#000";
var m_cFoodColor = "#000";
var m_cScoreColor = "#000";
var m_cPrevScoreColor = "#000";
var m_cHighestScoreColor = "#000";

// Snake Related
var m_iSnakeStartingLengthOne = 7;
var m_iSnakeHeadOne = { x: m_iSnakeStartingLengthOne - 2, y: 1 };
var m_iSnakeBodyOne = new Array(m_iSnakeStartingLengthOne);
var m_bIsSnakeUpdatedOne = false;
var m_iDirectionOne = "right";

// Game speed
var m_iGameSpeedOriginal = 80;
var m_iGameSpeedMain = m_iGameSpeedOriginal;
var m_iGameDecrease = 5;
var m_iGameMinuim = 1;

// Food
var m_iFoodX = 0;
var m_iFoodY = 0;

// Messages alignment
var m_iLeft;
var m_iMiddle;
var m_iRight;

// Sound Related
var m_FoodMusic = new Audio("assets/music/food.mp3");
var m_BackgroundMusic = new Audio("assets/music/backgroundMusic.mp3");
var m_bSoundOn = true;

// HTML5 Elemtents
var m_CanvasContext;

// Interval ID's
var m_IntervalIDMain;

var m_iGameVersion = 0;

var m_bGameStarted = false;
var m_bMultiplayer = false;
var m_bSingle = false;
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
        multiplayerInitialize();

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

function giveFocus(ID)
{
    if (ID == 1) 
    {
        document.getElementById("singlePlayer").focus();
        document.getElementById("multiPlayer").blur();
    }

    if (ID == 2)
    {
        document.getElementById("singlePlayer").blur();
        document.getElementById("multiPlayer").focus();
    }
}

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

// Shows pause pic if true, otherwise hides it.
function showPausePic(bVisible)
{
    if (bVisible)
        document.getElementById("pic").style.zIndex = 1;

    else
        document.getElementById("pic").style.zIndex = -1;
}

// Sets the sound on pic on visible
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

// Sets the fast pic visible
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
        m_BackgroundMusic.play();

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

// Handles the changing direction of the snake.
function doKeyDown(event) {

    if (m_bGameStarted) {

        // For single player
        if (m_bSingle) {
            if (event.keyCode == 38 || event.keyCode == 40 || event.keyCode == 37 || event.keyCode == 39 || event.keyCode == 65) {
                if (!m_bIsPaused) {
                    if (!m_bIsSnakeUpdatedOne)
                        gameLoopSingle();

                    if (event.keyCode == 38 && m_iDirectionOne != "down")   // Up arrow key was pressed.
                        m_iDirectionOne = "up";

                    else if (event.keyCode == 40 && m_iDirectionOne != "up")    // Down arrow key was pressed.
                        m_iDirectionOne = "down";

                    else if (event.keyCode == 37 && m_iDirectionOne != "right") // Left arrow key was pressed.
                        m_iDirectionOne = "left";

                    else if (event.keyCode == 39 && m_iDirectionOne != "left") // Right arrow key was pressed.
                        m_iDirectionOne = "right";

                    else if (event.keyCode == 65)    // The letter 'a' was pressed.
                    {
                        m_bFastMode = !m_bFastMode;

                        if (m_bFastMode) {
                            m_IntervalIDMain = changeGameSpeed(m_IntervalIDMain, "gameLoopSingle();", m_iFastSpeed);
                            setFastPicVisible(true);
                        }

                        else {
                            m_IntervalIDMain = changeGameSpeed(m_IntervalIDMain, "gameLoopSingle();", m_iGameSpeedMain);
                            setFastPicVisible(false);
                        }
                    }

                    m_bIsSnakeUpdatedOne = false;
                }
            }
        }

        // For Multiplayer
        else if (m_bMultiplayer) {
            if (!m_bIsPaused) {
                if (event.keyCode == 87 || event.keyCode == 83 || event.keyCode == 65 || event.keyCode == 68) {
                    if (!m_bIsSnakeUpdatedOne)
                        setUpSnakeOne();

                    // Snake 1
                    if (event.keyCode == 87 && m_iDirectionOne != "down")   // Up arrow key was pressed.
                        m_iDirectionOne = "up";

                    else if (event.keyCode == 83 && m_iDirectionOne != "up")    // Down arrow key was pressed.
                        m_iDirectionOne = "down";

                    else if (event.keyCode == 65 && m_iDirectionOne != "right") // Left arrow key was pressed.
                        m_iDirectionOne = "left";

                    else if (event.keyCode == 68 && m_iDirectionOne != "left") // Right arrow key was pressed.
                        m_iDirectionOne = "right";

                    m_bIsSnakeUpdatedOne = false;
                }

                if (event.keyCode == 38 || event.keyCode == 40 || event.keyCode == 37 || event.keyCode == 39) {
                    if (!m_bIsSnakeUpdatedTwo)
                        setUpSnakeTwo();

                    // Snake 2
                    if (event.keyCode == 38 && m_iDirectionTwo != "down")   // Up arrow key was pressed.
                        m_iDirectionTwo = "up";

                    else if (event.keyCode == 40 && m_iDirectionTwo != "up")    // Down arrow key was pressed.
                        m_iDirectionTwo = "down";

                    else if (event.keyCode == 37 && m_iDirectionTwo != "right") // Left arrow key was pressed.
                        m_iDirectionTwo = "left";

                    else if (event.keyCode == 39 && m_iDirectionTwo != "left") // Right arrow key was pressed.
                        m_iDirectionTwo = "right";

                    m_bIsSnakeUpdatedTwo = false;
                }
            }

            if (event.keyCode != 38 && event.keyCode != 40 && event.keyCode != 37 && event.keyCode != 39 &&
                event.keyCode != 87 && event.keyCode != 83 && event.keyCode != 65 && event.keyCode != 68)
                m_bIsPaused ? unPauseGameMulti() : pauseGameMulti();

            if (event.keyCode == 27) // Escape was pressed
            {
                pauseGameMulti();
                m_bIsPaused = false;
                showPausePic(false);
                showStartMenu(true);
                m_bMultiplayer = false
                m_bGameStarted = false;
                m_iTotalScoreOne = 0;
                m_iTotalScoreTwo = 0;
            }
        }
    }
}


function doKeyUp(event) {

    if (m_bGameStarted) {
        if (m_bSingle) {
            if (event.keyCode == 32)    // Space bar was pressed.
                m_bIsPaused ? unPauseGameSingle() : pauseGameSingle();

            else if (event.keyCode == 77)    // 'm' was pressed.
                m_bSoundOn = !m_bSoundOn;

            else if (event.keyCode == 27)    // Escape was pressed, will eventually show start menu ... Jacob!!!
            {
                pauseGameSingle(m_IntervalIDMain);
                m_bIsPaused = false;
                showPausePic(false);
                showStartMenu(true);
                m_bGameStarted = false;
                m_bSingle = false;
                m_iPrevAmount = 0;
                m_iHighestAmount = 0;
            }
        }
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