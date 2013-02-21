// Single Player Teleportic

function initializeTeleportic() {

    showStartMenu(false);
    m_bFastMode = false;
    m_bGameStarted = true;
    m_bSingleTeleportic = true;

    if (m_bDpadControlls)
        showControlls(1);

    m_iGameSpeedMain = m_iGameSpeedOriginal;
    m_iFastSpeed = Math.floor(m_iGameSpeedMain / m_iFastDivider);

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

    m_iTeleporters = new Array();

    // Initialize snake
    for (var index = 0; index < m_iSnakeBodyOne.length; index++)
        m_iSnakeBodyOne[m_iOriginalSnakeLengthSingle - index - 1] = { x: index - 1, y: m_iSnakeHeadOne.y };

    for (var x = 0; x < m_iMapWidth; x++)
        for (var y = 0; y < m_iMapHeight; y++)
            y == 0 ? paintTile(x, y, "#FFF", 0) : paintTile(x, y, m_cBackroundColor, 0);

    createTeleportingBlocks();
    setFood(m_iSnakeBodyOne);
    drawMapTeleportic();
    gameLoopTeleportic();

    // Initialize gameloop.
    if (m_IntervalIDMain != null)
        clearInterval(m_IntervalIDMain);

    m_IntervalIDMain = window.setInterval("gameLoopTeleportic();", m_iGameSpeedMain);
}

// Runs all the functions required for the game to work.
function gameLoopTeleportic()
{
    if (m_bDpadControlls)
        showControlls(1);

    // Plays music if mute is not checked.
    playBackgroundMusic();

    setUpSnake(m_iSnakeHeadOne, m_iSnakeBodyOne, m_iDirectionOne);
    m_bIsSnakeUpdatedOne = true;
    runTeleporters(m_iSnakeHeadOne);
    drawMapTeleportic();

    // If true, increase snake length, increase gamespeed.
    if (gotFoodSingle())
    {
        if (m_bFastMode)
            m_IntervalIDMain = changeGameSpeed(m_IntervalIDMain, "gameLoopTeleportic();", m_iFastSpeed);

        else
            m_IntervalIDMain = changeGameSpeed(m_IntervalIDMain, "gameLoopTeleportic();", m_iGameSpeedMain);

        if (m_iTeleporters.length/2 < m_iTeleporteMax) 
            createTeleportingBlocks();

        playFoodMusic();
        var tempData = { x: m_iSnakeBodyOne[m_iSnakeBodyOne.length - 1].x, y: m_iSnakeBodyOne[m_iSnakeBodyOne.length - 1].y };
        m_iSnakeBodyOne.push(tempData);
        m_iScoreOne++;
        setFood(m_iSnakeBodyOne.concat(m_iTeleporters));
        m_iGameSpeedMain = increaseSpeed(m_iGameSpeedMain);
        m_iFastSpeed = Math.floor(m_iGameSpeedMain / m_iFastDivider);
    }

    // If true, reset the game.
    if (checkCollision(m_iSnakeBodyOne))
        initializeTeleportic();
}

// Draws everything on the canvas.
function drawMapTeleportic() {

    // Snake head
    paintTile(m_iSnakeHeadOne.x, m_iSnakeHeadOne.y, "#FFF", m_iSnakeHeadBorderWidth);

    // Snake body
    for (var index = 1; index < m_iSnakeBodyOne.length; index++)
        paintTile(m_iSnakeBodyOne[index].x, m_iSnakeBodyOne[index].y, getRandomColor(1, 255), m_iSnakeBodyBorderWidth);

    // Teleporting blocks
    for (var index = 0; index < m_iTeleporters.length; index++)
        paintTile(m_iTeleporters[index].x, m_iTeleporters[index].y, m_iTeleporters[index].color, 0);

    // Food
    paintTile(m_iFoodX, m_iFoodY, getRandomColor(1, 255), m_iFoodBorderWidth);

    // Prints score on top of snake game
    writeMessage(m_iLeft, m_cScoreColorOne, "Score: " + m_iScoreOne);
    writeMessage(m_iLeft + 13, m_cScoreColorOne, "Highest Score: " + m_iHighestScoreOne);

    // Sets the pics visible or not.
    setSoundPicVisible(m_bSoundOn);
    setFastPicVisible(m_bFastMode);
}

// Stops loop
function pauseGameTeleportic()
{
    stopBackgroundMusic();
    showPausePic(true);
    window.clearInterval(m_IntervalIDMain);
    m_bIsPaused = true;
}

// Starts loop again
function unPauseGameTeleportic()
{
    playBackgroundMusic();
    showPausePic(false);
    m_IntervalIDMain = window.setInterval("gameLoopTeleportic();", m_iGameSpeedMain);
    m_bIsPaused = false;
}

// Stops loop
function pauseGameTeleportic()
{
    stopBackgroundMusic();
    showPausePic(true);
    window.clearInterval(m_IntervalIDMain);
    m_bIsPaused = true;
}

// Starts loop again
function unPauseGameTeleportic()
{
    playBackgroundMusic();
    showPausePic(false);
    m_IntervalIDMain = (m_bFastMode ? changeGameSpeed(m_IntervalIDMain, "gameLoopTeleportic();", m_iFastSpeed) : changeGameSpeed(m_IntervalIDMain, "gameLoopTeleportic();", m_iGameSpeedMain));
    m_bIsPaused = false;
}

function keyBoardDownTeleportic(event)
{
    var keyCode = event.keyCode;

    if (keyCode == 38 || keyCode == 40 || keyCode == 37 || keyCode == 39 || keyCode == 65)
    {
        if (!m_bIsPaused)
        {
            if (!m_bIsSnakeUpdatedOne)
                gameLoopTeleportic();

            if (keyCode == 38 && m_iDirectionOne != "down")   // Up arrow key was pressed.
                m_iDirectionOne = "up";

            else if (keyCode == 40 && m_iDirectionOne != "up")    // Down arrow key was pressed.
                m_iDirectionOne = "down";

            else if (keyCode == 37 && m_iDirectionOne != "right") // Left arrow key was pressed.
                m_iDirectionOne = "left";

            else if (keyCode == 39 && m_iDirectionOne != "left") // Right arrow key was pressed.
                m_iDirectionOne = "right";

            else if (keyCode == 65)    // The letter 'a' was pressed.
            {
                m_bFastMode = !m_bFastMode;
                m_IntervalIDMain = (m_bFastMode ? changeGameSpeed(m_IntervalIDMain, "gameLoopTeleportic();", m_iFastSpeed) : changeGameSpeed(m_IntervalIDMain, "gameLoopTeleportic();", m_iGameSpeedMain));
                setFastPicVisible(m_bFastMode);
            }

            m_bIsSnakeUpdatedOne = false;
        }
    }
}

function keyBoardUpTeleportic(event)
{
    var keyCode = event.keyCode;

    if (keyCode == 32)    // Space bar was pressed.
        m_bIsPaused ? unPauseGameTeleportic() : pauseGameTeleportic();

    else if (keyCode == 27)    // Escape was pressed, will eventually show start menu ... Jacob!!!
    {
        pauseGameTeleportic(m_IntervalIDMain);
        m_bIsPaused = false;
        showPausePic(false);
        showStartMenu(true);
        showControlls(0);
        hideTouchSettings(false);
        m_bGameStarted = false;
        m_bSingleTeleportic = false;
        m_iScoreOne = 0;
        m_iHighestScoreOne = 0;
    }
}