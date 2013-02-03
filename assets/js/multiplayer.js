var m_iSnakeOneMultiLength = 12;

// Snake ID's
var m_cSnakeColorOne = "red";
var m_cSnakeColorTwo = "blue";

// Snake ID's
var m_iSnakeOneID = 1;
var m_iSnakeTwoID = 2;

// Snake Two Related
var m_iSnakeStartingLengthTwo = 12;
var m_iSnakeHeadTwo = { x: m_iMapWidth - m_iSnakeStartingLengthTwo + 1, y: 1 };
var m_iSnakeBodyTwo = new Array();
var m_iDirectionTwo = "left";
var m_bIsSnakeUpdatedTwo = false;

var m_iAmountAteOne = 0;
var m_iAmountAteTwo = 0;
var m_iTotalScoreOne = 0;
var m_iTotalScoreTwo = 0;

// Gamespeed 
var m_iGameSpeedOne = m_iGameSpeedOriginal;
var m_iGameSpeedTwo = m_iGameSpeedOriginal;;

var m_IntervalIDOne;
var m_IntervalIDTwo;


function multiplayerInitialize() {

    // Get canvas context for drawing, add events
    m_CanvasContext = document.getElementById("myCanvas").getContext("2d");
    setCanvasSize();
    m_iSnakeStartingLengthOne = m_iSnakeOneMultiLength;
    resetSnakeOne();
    resetSnakeTwo();

    for (var x = 0; x < m_iMapWidth; x++)
        for (var y = 0; y < m_iMapHeight; y++)
            y == 0 ? paintTile(x, y, "#FFF", 0) : paintTile(x, y, m_cBackroundColor, 0);

    showStartMenu(false);
    hideFastPic();
    m_bGameStarted = true;
    m_bMultiplayer = true;
    setFood();
    drawMap();
    gameLoop();

    // Initialize gameloop.
    if (m_IntervalIDMain != null)
        clearInterval(m_IntervalIDMain);

    m_IntervalIDMain = window.setInterval("gameLoop();", m_iGameSpeedMain);
}

// Runs all the functions required for the game to work.
function gameLoop() {

    // Plays music. 
    playBackgroundMusic();

    drawMap();
}

// Draws everything on the canvas.
function drawMap() {
    // Food
    m_cFoodColor = getRandomColor(1, 255);
    paintTile(m_iFoodX, m_iFoodY, m_cFoodColor, m_iFoodBorderWidth);

    // Prints score on top of snake game
    writeMessage(m_iLeft, m_cSnakeColorOne, "Score One: " + m_iAmountAteOne);
    writeMessage(m_iLeft + 10, m_cSnakeColorTwo, "Score Two: " + m_iAmountAteTwo);
    writeMessage(m_iRight - 10, m_cSnakeColorOne, "Total Score One: " + m_iTotalScoreOne);
    writeMessage(m_iRight, m_cSnakeColorTwo, "Total Score Two: " + m_iTotalScoreTwo);
}

// Handles where the snake should be.
function setUpSnakeOne() {
    var tempSnakeData = m_iSnakeBodyOne.pop();
    paintTile(tempSnakeData.x, tempSnakeData.y, m_cBackroundColor, 0);

    if (m_iDirectionOne == "right")
        tempSnakeData = { x: ++m_iSnakeHeadOne.x, y: m_iSnakeHeadOne.y };

    if (m_iDirectionOne == "left")
        tempSnakeData = { x: --m_iSnakeHeadOne.x, y: m_iSnakeHeadOne.y };

    if (m_iDirectionOne == "down")
        tempSnakeData = { x: m_iSnakeHeadOne.x, y: ++m_iSnakeHeadOne.y };

    if (m_iDirectionOne == "up")
        tempSnakeData = { x: m_iSnakeHeadOne.x, y: --m_iSnakeHeadOne.y };

    m_iSnakeBodyOne.unshift(tempSnakeData);

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
            window.clearInterval(m_IntervalIDOne);
            m_IntervalIDOne = window.setInterval("setUpSnakeOne();", m_iGameSpeedOne, false);
        }

        setFood();
    }

    resetASnake(checkCollision());
    m_bIsSnakeUpdatedOne = true;
}

function setUpSnakeTwo() {
    // Snake 2
    var tempSnakeData = m_iSnakeBodyTwo.pop();
    paintTile(tempSnakeData.x, tempSnakeData.y, m_cBackroundColor, 0);

    if (m_iDirectionTwo == "right")
        tempSnakeData = { x: ++m_iSnakeHeadTwo.x, y: m_iSnakeHeadTwo.y };

    if (m_iDirectionTwo == "left")
        tempSnakeData = { x: --m_iSnakeHeadTwo.x, y: m_iSnakeHeadTwo.y };

    if (m_iDirectionTwo == "down")
        tempSnakeData = { x: m_iSnakeHeadTwo.x, y: ++m_iSnakeHeadTwo.y };

    if (m_iDirectionTwo == "up")
        tempSnakeData = { x: m_iSnakeHeadTwo.x, y: --m_iSnakeHeadTwo.y };

    m_iSnakeBodyTwo.unshift(tempSnakeData);

    for (var index = 1; index < m_iSnakeBodyTwo.length; index++)
        paintTile(m_iSnakeBodyTwo[index].x, m_iSnakeBodyTwo[index].y, m_cSnakeColorTwo, m_iSnakeBodyBorderWidth);

    paintTile(m_iSnakeHeadTwo.x, m_iSnakeHeadTwo.y, m_cSnakeColorTwo, m_iSnakeHeadBorderWidth);

    if (gotFood() == m_iSnakeTwoID) {

        playFoodMusic();
        var tempData = { x: m_iSnakeBodyTwo[m_iSnakeBodyTwo.length - 1].x, y: m_iSnakeBodyTwo[m_iSnakeBodyTwo.length - 1].y };
        m_iSnakeBodyTwo.push(tempData);
        m_iAmountAteTwo++;
        m_iTotalScoreTwo++;

        if ((m_iGameSpeedTwo - m_iGameDecrease) >= m_iGameMinuim) {
            m_iGameSpeedTwo -= m_iGameDecrease;
            window.clearInterval(m_IntervalIDTwo);
            m_IntervalIDTwo = window.setInterval("setUpSnakeTwo();", m_iGameSpeedTwo);
        }

        setFood();
    }

    resetASnake(checkCollision());
    m_bIsSnakeUpdatedTwo = true;
}

// Checks if the snake hit the wall or itself.
function checkCollision() {
    // Checks if the snake head hit another snake head
    if (m_iSnakeHeadOne.x == m_iSnakeHeadTwo.x && m_iSnakeHeadOne.y == m_iSnakeHeadTwo.y) {
        if (getRandomNumber(0, 10) <= 4)
            return m_iSnakeOneID

        else
            return m_iSnakeTwoID;
    }

    // Checks if snake hit the borders
    if (m_iSnakeHeadOne.x >= m_iMapWidth)
        return m_iSnakeOneID;

    if (m_iSnakeHeadOne.x < 0)
        return m_iSnakeOneID;

    if (m_iSnakeHeadOne.y >= m_iMapHeight)
        return m_iSnakeOneID;

    if (m_iSnakeHeadOne.y <= 0)
        return m_iSnakeOneID;

    // Checks if the snakes hit themselves
    for (var index = 1; index < m_iSnakeBodyOne.length; index++)
        if (m_iSnakeHeadOne.x == m_iSnakeBodyOne[index].x && m_iSnakeHeadOne.y == m_iSnakeBodyOne[index].y)
            return m_iSnakeOneID;

    // Checks if the snakes hit the other snakes
    for (var index = 1; index < m_iSnakeBodyTwo.length; index++)
        if (m_iSnakeHeadOne.x == m_iSnakeBodyTwo[index].x && m_iSnakeHeadOne.y == m_iSnakeBodyTwo[index].y)
            return m_iSnakeOneID;

    // Snake 2
    // Checks if snake hit the borders
    if (m_iSnakeHeadTwo.x >= m_iMapWidth)
        return m_iSnakeTwoID;

    if (m_iSnakeHeadTwo.x < 0)
        return m_iSnakeTwoID;

    if (m_iSnakeHeadTwo.y >= m_iMapHeight)
        return m_iSnakeTwoID;

    if (m_iSnakeHeadTwo.y <= 0)
        return m_iSnakeTwoID;

    // Checks if the snakes hit themselves
    for (var index = 1; index < m_iSnakeBodyTwo.length; index++)
        if (m_iSnakeHeadTwo.x == m_iSnakeBodyTwo[index].x && m_iSnakeHeadTwo.y == m_iSnakeBodyTwo[index].y)
            return m_iSnakeTwoID;

    // Checks if the snakes hit the other snakes
    for (var index = 1; index < m_iSnakeBodyOne.length; index++)
        if (m_iSnakeHeadTwo.x == m_iSnakeBodyOne[index].x && m_iSnakeHeadTwo.y == m_iSnakeBodyOne[index].y)
            return m_iSnakeTwoID;

    return false;
}

// Chooses the next position for the food.
function setFood() {
    var bIsFoodOnSnake = true;

    while (bIsFoodOnSnake) {
        m_iFoodX = getRandomNumber(0, m_iMapWidth - 1);
        m_iFoodY = getRandomNumber(1, m_iMapHeight - 1);

        for (var index = 0; index < m_iSnakeBodyOne.length; index++)
            if (m_iFoodX == m_iSnakeBodyOne[index].x && m_iFoodY == m_iSnakeBodyOne[index].y)
                continue;

        for (var index = 0; index < m_iSnakeBodyTwo.length; index++)
            if (m_iFoodX == m_iSnakeBodyTwo[index].x && m_iFoodY == m_iSnakeBodyTwo[index].y)
                continue;

        bIsFoodOnSnake = false;
    }
}

// Checks if the snake got the food.
function gotFood() {
    if (m_iSnakeHeadOne.x == m_iFoodX && m_iSnakeHeadOne.y == m_iFoodY)
        return m_iSnakeOneID;

    if (m_iSnakeHeadTwo.x == m_iFoodX && m_iSnakeHeadTwo.y == m_iFoodY)
        return m_iSnakeTwoID;

    return false;
}

function resetASnake(snakeID) {

    if (snakeID == m_iSnakeOneID)
        resetSnakeOne();

    else if (snakeID == m_iSnakeTwoID)
        resetSnakeTwo();
}

function resetSnakeOne() {

    for (var x = 0; x < m_iMapWidth; x++)
        for (var y = 0; y < 1; y++)
            paintTile(x, y, "#FFF", 0)

    if (m_iSnakeBodyOne[0] != null)
        for (var index = 0; index < m_iSnakeBodyOne.length; index++)
            paintTile(m_iSnakeBodyOne[index].x, m_iSnakeBodyOne[index].y, m_cBackroundColor, m_iBackgroundBorderWidth);

    m_iSnakeHeadOne.x = m_iSnakeStartingLengthOne - 2;
    m_iSnakeHeadOne.y = 1;
    m_iDirectionOne = "right";
    m_iGameSpeedOne = m_iGameSpeedMain;
    m_iSnakeBodyOne = new Array(m_iSnakeStartingLengthOne);
    m_iAmountAteOne = 0;
    m_iTotalScoreOne--;

    if (m_IntervalIDOne != null)
        clearInterval(m_IntervalIDOne);

    m_IntervalIDOne = window.setInterval("setUpSnakeOne();", m_iGameSpeedOne);

    for (var index = 0; index < m_iSnakeStartingLengthOne; index++)
        m_iSnakeBodyOne[m_iSnakeStartingLengthOne - index - 1] = { x: index - 1, y: m_iSnakeHeadOne.y };
}

function resetSnakeTwo() {

    for (var x = 0; x < m_iMapWidth; x++)
        for (var y = 0; y < 1; y++)
            paintTile(x, y, "#FFF", 0)

    if (m_iSnakeBodyTwo[0] != null)
        for (var index = 0; index < m_iSnakeBodyTwo.length; index++)
            paintTile(m_iSnakeBodyTwo[index].x, m_iSnakeBodyTwo[index].y, m_cBackroundColor, m_iBackgroundBorderWidth);

    m_iSnakeHeadTwo.x = m_iMapWidth - m_iSnakeStartingLengthTwo + 1;
    m_iSnakeHeadTwo.y = 1;
    m_iDirectionTwo = "left";
    m_iGameSpeedTwo = m_iGameSpeedMain;
    m_iSnakeBodyTwo = new Array(m_iSnakeStartingLengthTwo);
    m_iAmountAteTwo = 0;
    m_iTotalScoreTwo--;

    if (m_IntervalIDTwo != null)
        clearInterval(m_IntervalIDTwo);

    m_IntervalIDTwo = window.setInterval("setUpSnakeTwo();", m_iGameSpeedTwo);

    for (var index = 0; index < m_iSnakeStartingLengthTwo; index++)
        m_iSnakeBodyTwo[m_iSnakeStartingLengthTwo - index - 1] = { x: m_iMapWidth - index, y: m_iSnakeHeadTwo.y };
}

// Stops loop
function pauseGameMulti() {

    stopBackgroundMusic();

    // For pause pic to show up
    showPausePic(true);

    window.clearInterval(m_IntervalIDMain);
    window.clearInterval(m_IntervalIDOne);
    window.clearInterval(m_IntervalIDTwo);
    m_bIsPaused = true;

}

// Starts loop again
function unPauseGameMulti() {

    playBackgroundMusic();
    m_bIsPaused = false;
    m_IntervalIDMain = window.setInterval("gameLoop();", m_iGameSpeedMain);
    m_IntervalIDOne = window.setInterval("setUpSnakeOne();", m_iGameSpeedOne);
    m_IntervalIDTwo = window.setInterval("setUpSnakeTwo();", m_iGameSpeedTwo);
    showPausePic(false);
}