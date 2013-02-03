
var m_iSnakeSingleLength = 7;

// Scores
var m_iAmountAte = 0;
var m_iPrevAmount = 0;
var m_iHighestAmount = 0;

// Fast Speed
var m_iFastDivider = 4;
var m_iFastSpeed = Math.floor(m_iGameSpeedMain / m_iFastDivider);
var m_bFastMode = false;

function initializeSingle() {

    // Get canvas context for drawing, add events
    m_CanvasContext = document.getElementById("myCanvas").getContext("2d");
    setCanvasSize();

    showStartMenu(false);
    m_bGameStarted = true;
    m_bSingle = true;
    m_bFastMode = false;

    // Game speed
    m_iGameSpeedMain = m_iGameSpeedOriginal;
    m_iFastSpeed = Math.floor(m_iGameSpeedMain / m_iFastDivider);
    m_iSnakeStartingLengthOne = m_iSnakeSingleLength;

    // Snake 
    m_iSnakeHeadOne.x = m_iSnakeStartingLengthOne - 2;
    m_iSnakeHeadOne.y = 1;
    m_iSnakeBodyOne = new Array(m_iSnakeStartingLengthOne);
    m_iDirectionOne = "right";
    m_iPrevAmount = m_iAmountAte;

    if (m_iPrevAmount > m_iHighestAmount)
        m_iHighestAmount = m_iPrevAmount;

    m_iAmountAte = 0;

    // Food Related
    m_iFoodX = 0;
    m_iFoodY = 0;

    // Initialize snake
    for (var index = 0; index < m_iSnakeStartingLengthOne; index++)
        m_iSnakeBodyOne[m_iSnakeStartingLengthOne - index - 1] = { x: index - 1, y: m_iSnakeHeadOne.y };

    for (var x = 0; x < m_iMapWidth; x++)
        for (var y = 0; y < m_iMapHeight; y++)
            y == 0 ? paintTile(x, y, "#FFF", 0) : paintTile(x, y, m_cBackroundColor, 0);

    setFoodSingle();
    drawMapSingle();
    gameLoopSingle();

    // Initialize gameloop.
    if (m_IntervalIDMain != null)
        clearInterval(m_IntervalIDMain);

    m_IntervalIDMain = window.setInterval("gameLoopSingle();", m_iGameSpeedMain);
}

// Runs all the functions required for the game to work.
function gameLoopSingle() {

    // Plays music if mute is not checked.
    playBackgroundMusic();

    setUpSnakeSingle();
    drawMapSingle();

    // If true, increase snake length, increase gamespeed.
    if (gotFoodSingle()) {
        
        playFoodMusic();

        var tempData = { x: m_iSnakeBodyOne[m_iSnakeBodyOne.length - 1].x, y: m_iSnakeBodyOne[m_iSnakeBodyOne.length - 1].y };
        m_iSnakeBodyOne.push(tempData);
        m_iAmountAte++;
        setFoodSingle();

        if ((m_iGameSpeedMain - m_iGameDecrease) >= m_iGameMinuim) {
            m_iGameSpeedMain -= m_iGameDecrease;
            m_iFastSpeed = Math.floor(m_iGameSpeedMain / m_iFastDivider);

            if (m_bFastMode)
                m_IntervalIDMain = changeGameSpeed(m_IntervalIDMain, "gameLoopSingle();", m_iFastSpeed);

            else
                m_IntervalIDMain = changeGameSpeed(m_IntervalIDMain, "gameLoopSingle();", m_iGameSpeedMain);
        }
    }

    // If true, reset the game.
    if (checkCollisionSingle())
        initializeSingle();
}

// Draws everything on the canvas.
function drawMapSingle() {

    // Generates random food color
    m_cFoodColor = getRandomColor(1, 255);

    // Snake head
    paintTile(m_iSnakeHeadOne.x, m_iSnakeHeadOne.y, "#FFF", m_iSnakeHeadBorderWidth);

    // Snake body
    for (var index = 1; index < m_iSnakeBodyOne.length; index++)
        paintTile(m_iSnakeBodyOne[index].x, m_iSnakeBodyOne[index].y, getRandomColor(1, 255), m_iSnakeBodyBorderWidth);

    // Food
    paintTile(m_iFoodX, m_iFoodY, m_cFoodColor, m_iFoodBorderWidth);

    // Prints score on top of snake game
    writeMessage(m_iLeft, m_cScoreColor, "Score: " + m_iAmountAte);
    writeMessage(m_iLeft + 5, m_cPrevScoreColor, "Previous Score: " + m_iPrevAmount);
    writeMessage(m_iLeft + 13, m_cHighestScoreColor, "Highest Score: " + m_iHighestAmount);

    // Sets the pics visible or not.
    setSoundPicVisible(m_bSoundOn);
    setFastPicVisible(m_bFastMode);
}

// Handles where the snake should be.
function setUpSnakeSingle() {
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
    m_bIsSnakeUpdatedOne = true;
}

// Checks if the snake hit the wall or itself.
function checkCollisionSingle() {
    // Checks if snake hit the borders
    if (m_iSnakeHeadOne.x >= m_iMapWidth)
        return true;

    if (m_iSnakeHeadOne.x < 0)
        return true;

    if (m_iSnakeHeadOne.y >= m_iMapHeight)
        return true;

    if (m_iSnakeHeadOne.y <= 0)
        return true;

    // Checks if the snakes hit themselves
    for (var index = 1; index < m_iSnakeBodyOne.length; index++)
        if (m_iSnakeHeadOne.x == m_iSnakeBodyOne[index].x && m_iSnakeHeadOne.y == m_iSnakeBodyOne[index].y)
            return true;

    return false;
}

// Chooses the next position for the food.
function setFoodSingle() {
    var bIsFoodOnSnake = true;

    while (bIsFoodOnSnake) {
        m_iFoodX = getRandomNumber(0, m_iMapWidth - 1);
        m_iFoodY = getRandomNumber(1, m_iMapHeight - 1);

        for (var index = 0; index < m_iSnakeBodyOne.length; index++)
            if (m_iFoodX == m_iSnakeBodyOne[index].x && m_iFoodY == m_iSnakeBodyOne[index].y)
                continue;

        bIsFoodOnSnake = false;
    }
}

// Checks if the snake got the food, so make it longer.
function gotFoodSingle() {
    if (m_iSnakeHeadOne.x == m_iFoodX && m_iSnakeHeadOne.y == m_iFoodY)
        return true;

    return false;
}

// Stops loop
function pauseGameSingle() {

    stopBackgroundMusic();
    showPausePic(true);
    window.clearInterval(m_IntervalIDMain);
    m_bIsPaused = true;
}

// Starts loop again
function unPauseGameSingle() {

    playBackgroundMusic();
    showPausePic(false);
    m_bIsPaused = false;
    m_IntervalIDMain = window.setInterval("gameLoopSingle();", m_iGameSpeedMain);
}