// Single Player Teleportic

function initializeTeleportic() {

    showStartMenu(false);
    m_bGameStatus.started = true;
    m_bGameStatus.singleTeleportic = true;
    
    // Game speed
    m_iSpeed.gameMain = m_iSpeed.gameOriginal;

    // Snake 
    initializeSnake(m_iSnakeOne, m_iSnakeStarting.single.x, m_iSnakeStarting.single.y, m_iSnakeStarting.directionSingle, m_iSnakeData.lengthSingle);

    // Score
    if (m_iScore.one > m_iScore.highestOne)
        m_iScore.highestOne = m_iScore.one;

    m_iScore.one = 0;

    // Food Related
    m_iFood.x = 0;
    m_iFood.y = 0;
    setFood(m_iSnakeOne.body);

    // Teleporters
    m_iTeleporters.teleporters = new Array();
    createTeleporters();

    // Initialize gameloop.
    if (m_iIntervalId.main != null)
        clearInterval(m_iIntervalId.main);

    m_iIntervalId.main = window.setInterval("gameLoopTeleportic();", m_iSpeed.gameMain);
}

// Runs all the functions required for the game to work.
function gameLoopTeleportic()
{
    // Plays music if mute is not checked.
    playBackgroundMusic();

    setUpSnake(m_iSnakeOne);
    m_iSnakeOne.updated = true;
    runTeleporters(m_iSnakeOne);
    drawMapTeleportic();

    // If true, increase snake length, increase gamespeed.
    if (gotFoodSingle())
    {
        m_iIntervalId.main = changeGameSpeed(m_iIntervalId.main, "gameLoopTeleportic();", m_iSpeed.gameMain);

        if (m_iTeleporters.teleporters.length/2 < m_iTeleporters.max) 
            createTeleporters();

        playFoodMusic();
        var tempData = { x: m_iSnakeOne.body[m_iSnakeOne.body.length - 1].x, y: m_iSnakeOne.body[m_iSnakeOne.body.length - 1].y };
        m_iSnakeOne.body.push(tempData);
        m_iScore.one++;
        setFood(m_iSnakeOne.body.concat(m_iTeleporters.teleporters));
        m_iSpeed.gameMain = increaseSpeed(m_iSpeed.gameMain);
    }

    // If true, reset the game.
    if (checkCollision(m_iSnakeOne))
        initializeTeleportic();
}

// Draws everything on the canvas.
function drawMapTeleportic()
{
    // Snake head
    paintTile(m_iSnakeOne.head.x, m_iSnakeOne.head.y, m_iSnakeData.headColor, m_iBorderWidth.snakeHead);

    // Snake body
    for (var index = 1; index < m_iSnakeOne.body.length; index++)
        paintTile(m_iSnakeOne.body[index].x, m_iSnakeOne.body[index].y, getRandomColor(1, 255), m_iBorderWidth.snakeBody);

    // Teleporting blocks
    paintTeleporters();

    // Food
    paintFood();

    // Repaint toolbar
    paintToolbar();

    // Prints score on top of snake game
    writeMessage(m_iTextAlignment.left, m_iScore.color, "Score: " + m_iScore.one);
    writeMessage(m_iTextAlignment.left + 13, m_iScore.color, "Highest Score: " + m_iScore.highestOne);
}

// Stops loop
function pauseGameTeleportic(bVisible)
{
    stopBackgroundMusic();
    showPausePic(bVisible);
    window.clearInterval(m_iIntervalId.main);
    m_bGameStatus.paused = true;
}

// Starts loop again
function unPauseGameTeleportic()
{
    playBackgroundMusic();
    showPausePic(false);
    m_iIntervalId.main = window.setInterval("gameLoopTeleportic();", m_iSpeed.gameMain);
    m_bGameStatus.paused = false;
}

function keyBoardDownTeleportic(event)
{
    var keyCode = event.keyCode;

    if (!m_bGameStatus.paused)
    {
        if (!m_iSnakeOne.updated)
            gameLoopTeleportic();

        if (keyCode == m_iControls.snakeOneUp && m_iSnakeOne.direction != m_sDirection.down)   // Up arrow key was pressed.
            m_iSnakeOne.direction = m_sDirection.up;

        else if (keyCode == m_iControls.snakeOneDown && m_iSnakeOne.direction != m_sDirection.up)    // Down arrow key was pressed.
            m_iSnakeOne.direction = m_sDirection.down;

        else if (keyCode == m_iControls.snakeOneLeft && m_iSnakeOne.direction != m_sDirection.right) // Left arrow key was pressed.
            m_iSnakeOne.direction = m_sDirection.left;

        else if (keyCode == m_iControls.snakeOneRight && m_iSnakeOne.direction != m_sDirection.left) // Right arrow key was pressed.
            m_iSnakeOne.direction = m_sDirection.right;

        m_iSnakeOne.updated = false;
    }
}

function keyBoardUpTeleportic(event)
{
    var keyCode = event.keyCode;

    if (keyCode == m_iControls.pause)    // Space bar was pressed.
        m_bGameStatus.paused ? unPauseGameTeleportic() : pauseGameTeleportic(true);

    else if (keyCode == m_iControls.toMenu)    // Escape was pressed
    {
        pauseGameTeleportic(false);
        showStartMenu(true);
    }
}