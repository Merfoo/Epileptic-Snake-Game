// Single Player Teleportic

function initializeTeleportic() {

    showStartMenu(false);
    m_bGameStatus.started = true;
    m_bGameStatus.singleTeleportic = true;
    
    // Game speed
    m_iSpeed.gameMain = m_iSpeed.gameOriginal;

    // Snake 
    m_iSnakeOne.head.x = m_iSnakeData.lengthSingle - 2;
    m_iSnakeOne.head.y = 1;
    m_iSnakeOne.body = new Array(m_iSnakeData.lengthSingle);
    m_iSnakeOne.direction = "right";

    if (m_iScore.one > m_iScore.highestOne)
        m_iScore.highestOne = m_iScore.one;

    m_iScore.one = 0;

    // Food Related
    m_iFood.x = 0;
    m_iFood.y = 0;

    m_iTeleporters.teleporters = new Array();

    // Initialize snake
    for (var index = 0; index < m_iSnakeOne.body.length; index++)
        m_iSnakeOne.body[m_iSnakeData.lengthSingle - index - 1] = { x: index - 1, y: m_iSnakeOne.head.y };

    createTeleportingBlocks();
    setFood(m_iSnakeOne.body);
    drawMapTeleportic();
    gameLoopTeleportic();

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

    setUpSnake(m_iSnakeOne.head, m_iSnakeOne.body, m_iSnakeOne.direction);
    m_iSnakeOne.updated = true;
    runTeleporters(m_iSnakeOne.head);
    drawMapTeleportic();

    // If true, increase snake length, increase gamespeed.
    if (gotFoodSingle())
    {
        m_iIntervalId.main = changeGameSpeed(m_iIntervalId.main, "gameLoopTeleportic();", m_iSpeed.gameMain);

        if (m_iTeleporters.teleporters.length/2 < m_iTeleporters.max) 
            createTeleportingBlocks();

        playFoodMusic();
        var tempData = { x: m_iSnakeOne.body[m_iSnakeOne.body.length - 1].x, y: m_iSnakeOne.body[m_iSnakeOne.body.length - 1].y };
        m_iSnakeOne.body.push(tempData);
        m_iScore.one++;
        setFood(m_iSnakeOne.body.concat(m_iTeleporters.teleporters));
        m_iSpeed.gameMain = increaseSpeed(m_iSpeed.gameMain);
    }

    // If true, reset the game.
    if (checkCollision(m_iSnakeOne.body))
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
    for (var index = 0; index < m_iTeleporters.teleporters.length; index++)
        paintTile(m_iTeleporters.teleporters[index].x, m_iTeleporters.teleporters[index].y, m_iTeleporters.teleporters[index].color, 0);

    // Food
    paintTile(m_iFood.x, m_iFood.y, getRandomColor(1, 255), m_iBorderWidth.food);

    // Prints score on top of snake game
    writeMessage(m_iTextAlignment.left, m_iScore.color, "Score: " + m_iScore.one);
    writeMessage(m_iTextAlignment.left + 13, m_iScore.color, "Highest Score: " + m_iScore.highestOne);
}

// Stops loop
function pauseGameTeleportic()
{
    stopBackgroundMusic();
    showPausePic(true);
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

// Stops loop
function pauseGameTeleportic()
{
    stopBackgroundMusic();
    showPausePic(true);
    window.clearInterval(m_iIntervalId.main);
    m_bGameStatus.paused = true;
}

// Starts loop again
function unPauseGameTeleportic()
{
    playBackgroundMusic();
    showPausePic(false);
    m_iIntervalId.main = changeGameSpeed(m_iIntervalId.main, "gameLoopTeleportic();", m_iSpeed.gameMain);
    m_bGameStatus.paused = false;
}

function keyBoardDownTeleportic(event)
{
    var keyCode = event.keyCode;

    if (keyCode == 38 || keyCode == 40 || keyCode == 37 || keyCode == 39 || keyCode == 65)
    {
        if (!m_bGameStatus.paused)
        {
            if (!m_iSnakeOne.updated)
                gameLoopTeleportic();

            if (keyCode == 38 && m_iSnakeOne.direction != "down")   // Up arrow key was pressed.
                m_iSnakeOne.direction = "up";

            else if (keyCode == 40 && m_iSnakeOne.direction != "up")    // Down arrow key was pressed.
                m_iSnakeOne.direction = "down";

            else if (keyCode == 37 && m_iSnakeOne.direction != "right") // Left arrow key was pressed.
                m_iSnakeOne.direction = "left";

            else if (keyCode == 39 && m_iSnakeOne.direction != "left") // Right arrow key was pressed.
                m_iSnakeOne.direction = "right";

            m_iSnakeOne.updated = false;
        }
    }
}

function keyBoardUpTeleportic(event)
{
    var keyCode = event.keyCode;

    if (keyCode == 32)    // Space bar was pressed.
        m_bGameStatus.paused ? unPauseGameTeleportic() : pauseGameTeleportic();

    else if (keyCode == 27)    // Escape was pressed, will eventually show start menu ... Jacob!!!
    {
        pauseGameTeleportic(m_iIntervalId.main);
        m_bGameStatus.paused = false;
        showPausePic(false);
        showStartMenu(true);
        m_bGameStatus.started = false;
        m_bGameStatus.singleTeleportic = false;
        m_iScore.one = 0;
        m_iScore.highestOne = 0;
    }
}