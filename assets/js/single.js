// Single Player 

function initializeSingle()
{
    showStartMenu(false);
    m_bGameStarted = true;
    m_bSingle = true;

    // Game speed
    m_iGameSpeedMain = m_iGameSpeedOriginal;

    // Snake 
    m_iSnakeHeadOne.x = m_iOriginalSnakeLengthSingle - 2;
    m_iSnakeHeadOne.y = 1;
    m_iSnakeBodyOne = new Array(m_iOriginalSnakeLengthSingle);
    m_iDirectionOne = "right";

    if (m_iScoreOne > m_iHighestScoreOne)
        m_iHighestScoreOne = m_iScoreOne;

    m_iScoreOne = 0;

    // Food Related
    m_iFoodX = 0;
    m_iFoodY = 0;

    // Initialize snake
    for (var index = 0; index < m_iSnakeBodyOne.length; index++)
        m_iSnakeBodyOne[m_iOriginalSnakeLengthSingle - index - 1] = { x: index - 1, y: m_iSnakeHeadOne.y };

    for (var x = 0; x < m_iMapWidth; x++)
        for (var y = 0; y < m_iMapHeight; y++)
            y == 0 ? paintTile(x, y, "#FFF", 0) : paintTile(x, y, m_cBackroundColor, 0);

    setFood(m_iSnakeBodyOne);
    drawMapSingle();
    gameLoopSingle();

    // Initialize gameloop.
    if (m_IntervalIDMain != null)
        clearInterval(m_IntervalIDMain);

    m_IntervalIDMain = window.setInterval("gameLoopSingle();", m_iGameSpeedMain);
}

// Runs all the functions required for the game to work.
function gameLoopSingle()
{
    // Plays music if mute is not checked.
    playBackgroundMusic();
    setUpSnake(m_iSnakeHeadOne, m_iSnakeBodyOne, m_iDirectionOne);
    m_bIsSnakeUpdatedOne = true;
    drawMapSingle();

    // If true, increase snake length, increase gamespeed.
    if (gotFoodSingle())
    {
        playFoodMusic();
        var tempData = { x: m_iSnakeBodyOne[m_iSnakeBodyOne.length - 1].x, y: m_iSnakeBodyOne[m_iSnakeBodyOne.length - 1].y };
        m_iSnakeBodyOne.push(tempData);
        m_iScoreOne++;
        setFood(m_iSnakeBodyOne);
        m_iGameSpeedMain = increaseSpeed(m_iGameSpeedMain);
        m_IntervalIDMain = changeGameSpeed(m_IntervalIDMain, "gameLoopSingle();", m_iGameSpeedMain);
    }

    // If true, reset the game.
    if (checkCollision(m_iSnakeBodyOne))
        initializeSingle();
}

// Draws everything on the canvas.
function drawMapSingle()
{
    // Generates random food color
    m_cFoodColor = getRandomColor(1, 255);

    // Snake head
    paintTile(m_iSnakeHeadOne.x, m_iSnakeHeadOne.y, "#FFF", m_iSnakeHeadBorderWidth);

    // Snake body
    for (var index = 1; index < m_iSnakeBodyOne.length; index++)
        paintTile(m_iSnakeBodyOne[index].x, m_iSnakeBodyOne[index].y, getRandomColor(m_iSnakeColorLow, m_iSnakeColorHigh), m_iSnakeBodyBorderWidth);

    // Food
    paintTile(m_iFoodX, m_iFoodY, m_cFoodColor, m_iFoodBorderWidth);

    // Prints score on top of snake game
    writeMessage(m_iLeft, m_cScoreColorOne, "Score: " + m_iScoreOne);
    writeMessage(m_iLeft + 13, m_cScoreColorOne, "Highest Score: " + m_iHighestScoreOne);

    // Sets the pics visible or not.
    setSoundPicVisible(m_bSoundOn);
}

// Checks if the snake got the food, so make it longer.
function gotFoodSingle()
{
    if (m_iSnakeHeadOne.x == m_iFoodX && m_iSnakeHeadOne.y == m_iFoodY)
        return true;

    return false;
}

// Stops loop
function pauseGameSingle()
{
    stopBackgroundMusic();
    showPausePic(true);
    window.clearInterval(m_IntervalIDMain);
    m_bIsPaused = true;
}

// Starts loop again
function unPauseGameSingle()
{
    playBackgroundMusic();
    showPausePic(false);
    m_IntervalIDMain = changeGameSpeed(m_IntervalIDMain, "gameLoopSingle();", m_iGameSpeedMain);
    m_bIsPaused = false;
}

function keyBoardDownSinglePlayer(event)
{
    var keyCode = event.keyCode;

    if (keyCode == 38 || keyCode == 40 || keyCode == 37 || keyCode == 39 || keyCode == 65)
    {
        if (!m_bIsPaused)
        {
            if (!m_bIsSnakeUpdatedOne)
                gameLoopSingle();

            if (keyCode == 38 && m_iDirectionOne != "down")   // Up arrow key was pressed.
                m_iDirectionOne = "up";

            else if (keyCode == 40 && m_iDirectionOne != "up")    // Down arrow key was pressed.
                m_iDirectionOne = "down";

            else if (keyCode == 37 && m_iDirectionOne != "right") // Left arrow key was pressed.
                m_iDirectionOne = "left";

            else if (keyCode == 39 && m_iDirectionOne != "left") // Right arrow key was pressed.
                m_iDirectionOne = "right";

            m_bIsSnakeUpdatedOne = false;
        }
    }
}

function keyBoardUpSinglePlayer(event)
{
    var keyCode = event.keyCode;

    if (keyCode == 32)    // Space bar was pressed.
        m_bIsPaused ? unPauseGameSingle() : pauseGameSingle();

    else if (keyCode == 27)    // Escape was pressed, will eventually show start menu ... Jacob!!!
    {
        pauseGameSingle(m_IntervalIDMain);
        m_bIsPaused = false;
        showPausePic(false);
        showStartMenu(true);
        m_bGameStarted = false;
        m_bSingle = false;
        m_iScoreOne = 0;
        m_iHighestScoreOne = 0;
    }
}