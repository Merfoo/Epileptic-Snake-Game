// Snake ID's
var m_cSnakeColorOne = "red";
var m_cSnakeColorTwo = "blue";

// Snake ID's
var m_iSnakeOneID = 1;
var m_iSnakeTwoID = 2;

// Snake Two Related
var m_iSnakeHeadTwo = { x: m_iMapWidth - m_iOriginalSnakeLengthMulti + 1, y: 1 };
var m_iSnakeBodyTwo = new Array();
var m_iDirectionTwo = "left";
var m_bIsSnakeUpdatedTwo = false;

// For keeping track of the scores
var m_iAmountAteOne = 0;
var m_iAmountAteTwo = 0;
var m_iTotalScoreOne = 1;
var m_iTotalScoreTwo = 1;

// Gamespeed 
var m_iGameSpeedOne = m_iGameSpeedOriginal;
var m_iGameSpeedTwo = m_iGameSpeedOriginal;;

var m_IntervalIDOne;
var m_IntervalIDTwo;

function multiplayerInitialize()
{
    showStartMenu(false);
    hideFastPic();
    m_bGameStarted = true;
    m_bMultiplayer = true;

    // Get canvas context for drawing, add events
    m_CanvasContext = document.getElementById("myCanvas").getContext("2d");
    setCanvasSize();

    for (var x = 0; x < m_iMapWidth; x++)
        for (var y = 0; y < m_iMapHeight; y++)
            y == 0 ? paintTile(x, y, "#FFF", 0) : paintTile(x, y, m_cBackroundColor, 0);

    m_iTotalScoreOne = 1;
    m_iTotalScoreTwo = 1;
    resetSnakeOne();
    resetSnakeTwo();
    setFood(m_iSnakeBodyOne.concat(m_iSnakeBodyTwo));
    drawMap();
    gameLoop();

    // Initialize gameloop.
    if (m_IntervalIDMain != null)
        clearInterval(m_IntervalIDMain);

    m_IntervalIDMain = window.setInterval("gameLoop();", m_iGameSpeedMain);
}

// Runs all the functions required for the game to work.
function gameLoop() 
{
    playBackgroundMusic();
    drawMap();
}

// Draws everything on the canvas.
function drawMap()
{
    // Food
    m_cFoodColor = getRandomColor(1, 255);
    paintTile(m_iFoodX, m_iFoodY, m_cFoodColor, m_iFoodBorderWidth);

    // Prints score on top of snake game
    writeMessage(m_iLeft, m_cSnakeColorOne, "Score One: " + m_iAmountAteOne);
    writeMessage(m_iLeft + 10, m_cSnakeColorTwo, "Score Two: " + m_iAmountAteTwo);
    writeMessage(m_iMiddle + 5, m_cSnakeColorOne, "Total Score One: " + m_iTotalScoreOne);
    writeMessage(m_iMiddle + 15, m_cSnakeColorTwo, "Total Score Two: " + m_iTotalScoreTwo);
    setSoundPicVisible(m_bSoundOn);
}

// Handles where the snake should be.
function setUpSnakeOne()
{
    var newData = setUpSnake(m_iSnakeHeadOne, m_iSnakeBodyOne, m_iDirectionOne);
    m_iSnakeHeadOne = newData.newHead;
    m_iSnakeBodyOne = newData.newBody;

    for (var index = 1; index < m_iSnakeBodyOne.length; index++)
        paintTile(m_iSnakeBodyOne[index].x, m_iSnakeBodyOne[index].y, m_cSnakeColorOne, m_iSnakeBodyBorderWidth);

    paintTile(m_iSnakeHeadOne.x, m_iSnakeHeadOne.y, m_cSnakeColorOne, m_iSnakeHeadBorderWidth);

    if (gotFood() == m_iSnakeOneID) {
        playFoodMusic();
        var tempData = { x: m_iSnakeBodyOne[m_iSnakeBodyOne.length - 1].x, y: m_iSnakeBodyOne[m_iSnakeBodyOne.length - 1].y };
        m_iSnakeBodyOne.push(tempData);
        m_iAmountAteOne++;
        m_iTotalScoreOne++;

        if ((m_iGameSpeedOne - m_iGameDecrease) >= m_iGameMinuim) {
            m_iGameSpeedOne -= m_iGameDecrease;
            m_IntervalIDOne = changeGameSpeed(m_IntervalIDOne, "setUpSnakeOne();", m_iGameSpeedOne);
        }

        setFood(m_iSnakeBodyOne.concat(m_iSnakeBodyTwo));
    }

    if (checkCollision(m_iSnakeBodyOne))
        resetSnakeOne();

    else
        resetASnake(hitOtherSnakes(m_iSnakeBodyOne, m_iSnakeBodyTwo, m_iSnakeOneID, m_iSnakeTwoID));

    m_bIsSnakeUpdatedOne = true;
}

function setUpSnakeTwo()
{
    // Snake 2
    var newData = setUpSnake(m_iSnakeHeadTwo, m_iSnakeBodyTwo, m_iDirectionTwo);
    m_iSnakeHeadTwo = newData.newHead;
    m_iSnakeBodyTwo = newData.newBody;

    for (var index = 1; index < m_iSnakeBodyTwo.length; index++)
        paintTile(m_iSnakeBodyTwo[index].x, m_iSnakeBodyTwo[index].y, m_cSnakeColorTwo, m_iSnakeBodyBorderWidth);

    paintTile(m_iSnakeHeadTwo.x, m_iSnakeHeadTwo.y, m_cSnakeColorTwo, m_iSnakeHeadBorderWidth);

    if (gotFood() == m_iSnakeTwoID)
    {
        playFoodMusic();
        var tempData = { x: m_iSnakeBodyTwo[m_iSnakeBodyTwo.length - 1].x, y: m_iSnakeBodyTwo[m_iSnakeBodyTwo.length - 1].y };
        m_iSnakeBodyTwo.push(tempData);
        m_iAmountAteTwo++;
        m_iTotalScoreTwo++;

        if ((m_iGameSpeedTwo - m_iGameDecrease) >= m_iGameMinuim)
        {
            m_iGameSpeedTwo -= m_iGameDecrease;
            m_IntervalIDTwo = changeGameSpeed(m_IntervalIDTwo, "setUpSnakeTwo();", m_iGameSpeedTwo);
        }

        setFood(m_iSnakeBodyOne.concat(m_iSnakeBodyTwo));
    }

    if(checkCollision(m_iSnakeBodyTwo))
        resetSnakeTwo();

    else 
        resetASnake(hitOtherSnakes(m_iSnakeBodyOne, m_iSnakeBodyTwo, m_iSnakeOneID, m_iSnakeTwoID));

    m_bIsSnakeUpdatedTwo = true;
}

// Checks if the snake got the food.
function gotFood()
{
    if (m_iSnakeHeadOne.x == m_iFoodX && m_iSnakeHeadOne.y == m_iFoodY)
        return m_iSnakeOneID;

    if (m_iSnakeHeadTwo.x == m_iFoodX && m_iSnakeHeadTwo.y == m_iFoodY)
        return m_iSnakeTwoID;

    return false;
}

function resetASnake(snakeID) {

    if (snakeID != 0)
    {
        if (snakeID == m_iSnakeOneID)
            resetSnakeOne();

        else if (snakeID == m_iSnakeTwoID)
            resetSnakeTwo();
    }
}

// Resets all values related to snake one
function resetSnakeOne()
{
    if (m_iSnakeBodyOne[0] != null)
        for (var index = 0; index < m_iSnakeBodyOne.length; index++)
            paintTile(m_iSnakeBodyOne[index].x, m_iSnakeBodyOne[index].y, m_cBackroundColor, m_iBackgroundBorderWidth);

    // Repaint white toolbar
    if(m_iSnakeHeadOne.y == 0)
        paintTile(m_iSnakeHeadOne.x, m_iSnakeHeadOne.y, "#FFF", 0);

    m_iSnakeHeadOne.x = m_iOriginalSnakeLengthMulti - 2;
    m_iSnakeHeadOne.y = 1;
    m_iDirectionOne = "right";
    m_iGameSpeedOne = m_iGameSpeedMain;
    m_iSnakeBodyOne = new Array(m_iOriginalSnakeLengthMulti);
    m_iAmountAteOne = 0;
    m_iTotalScoreOne--;

    if (m_IntervalIDOne != null)
        clearInterval(m_IntervalIDOne);

    m_IntervalIDOne = window.setInterval("setUpSnakeOne();", m_iGameSpeedOne);

    for (var index = 0; index < m_iSnakeBodyOne.length; index++)
        m_iSnakeBodyOne[m_iOriginalSnakeLengthMulti - index - 1] = { x: index - 1, y: m_iSnakeHeadOne.y };
}

// Resets all values related to snake two
function resetSnakeTwo()
{
    if (m_iSnakeBodyTwo[0] != null)
        for (var index = 0; index < m_iSnakeBodyTwo.length; index++)
            paintTile(m_iSnakeBodyTwo[index].x, m_iSnakeBodyTwo[index].y, m_cBackroundColor, m_iBackgroundBorderWidth);

    // Repaint white toolbar
    if (m_iSnakeHeadTwo.y == 0)
        paintTile(m_iSnakeHeadTwo.x, m_iSnakeHeadTwo.y, "#FFF", 0);

    m_iSnakeHeadTwo.x = m_iMapWidth - m_iOriginalSnakeLengthMulti + 1;
    m_iSnakeHeadTwo.y = 1;
    m_iDirectionTwo = "left";
    m_iGameSpeedTwo = m_iGameSpeedMain;
    m_iSnakeBodyTwo = new Array(m_iOriginalSnakeLengthMulti);
    m_iAmountAteTwo = 0;
    m_iTotalScoreTwo--;

    if (m_IntervalIDTwo != null)
        clearInterval(m_IntervalIDTwo);

    m_IntervalIDTwo = window.setInterval("setUpSnakeTwo();", m_iGameSpeedTwo);

    for (var index = 0; index < m_iSnakeBodyTwo.length; index++)
        m_iSnakeBodyTwo[m_iOriginalSnakeLengthMulti - index - 1] = { x: m_iMapWidth - index, y: m_iSnakeHeadTwo.y };
}

// Stops loop
function pauseGameMulti()
{
    stopBackgroundMusic();
    showPausePic(true);
    window.clearInterval(m_IntervalIDMain);
    window.clearInterval(m_IntervalIDOne);
    window.clearInterval(m_IntervalIDTwo);
    m_bIsPaused = true;
}

// Starts loop again
function unPauseGameMulti()
{
    playBackgroundMusic();
    showPausePic(false);
    m_IntervalIDMain = window.setInterval("gameLoop();", m_iGameSpeedMain);
    m_IntervalIDOne = window.setInterval("setUpSnakeOne();", m_iGameSpeedOne);
    m_IntervalIDTwo = window.setInterval("setUpSnakeTwo();", m_iGameSpeedTwo);
    m_bIsPaused = false;
}

// Handle keyboard events for multiplayer
function keyBoardDownMultiplayer()
{
    if (event.keyCode == 87 || event.keyCode == 83 || event.keyCode == 65 || event.keyCode == 68)
    {
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

    if (event.keyCode == 38 || event.keyCode == 40 || event.keyCode == 37 || event.keyCode == 39)
    {
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

function keyBoardUpMultiplayer()
{
    if (event.keyCode == 32)
        m_bIsPaused ? unPauseGameMulti() : pauseGameMulti();

    else if (event.keyCode == 27) // Escape was pressed
    {
        pauseGameMulti();
        m_bIsPaused = false;
        showPausePic(false);
        showStartMenu(true);
        m_bMultiplayer = false
        m_bGameStarted = false;
    }
}