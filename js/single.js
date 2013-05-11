// Single Player 

function initializeSingle()
{
    showStartMenu(false);
    m_bGameStatus.started = true;
    m_bGameStatus.single = true;

    // Game speed
    m_iSpeed.gameMain = m_iSpeed.gameOriginal;

    // Snake 
    m_iSnakeOne.head.x = Math.floor(m_iMap.width / 2) - 1;
    m_iSnakeOne.head.y = 0;
    m_iSnakeOne.body = new Array(m_iSnakeData.lengthSingle);
    m_iSnakeOne.direction = m_sDirection.down;

    // Initialize snake
    for (var index = 0; index < m_iSnakeOne.body.length; index++)
        m_iSnakeOne.body[index] = { x: m_iSnakeOne.head.x, y: -index };

    // Score
    if (m_iScore.one > m_iScore.highestOne)
        m_iScore.highestOne = m_iScore.one;

    m_iScore.one = 0;

    // Food Related
    m_iFood.x = 0;
    m_iFood.y = 0;
    setFood(m_iSnakeOne.body);

    // Initialize gameloop.
    if (m_iIntervalId.main != null)
        clearInterval(m_iIntervalId.main);

    m_iIntervalId.main = window.setInterval("gameLoopSingle();", m_iSpeed.gameMain);
}

// Runs all the functions required for the game to work.
function gameLoopSingle()
{
    // Plays music if mute is not checked.
    playBackgroundMusic();
    setUpSnake(m_iSnakeOne);
    m_iSnakeOne.updated = true;
    drawMapSingle();

    // If true, increase snake length, increase gamespeed.
    if (gotFoodSingle())
    {
        playFoodMusic();
        var tempData = { x: m_iSnakeOne.body[m_iSnakeOne.body.length - 1].x, y: m_iSnakeOne.body[m_iSnakeOne.body.length - 1].y };
        m_iSnakeOne.body.push(tempData);
        m_iScore.one++;
        setFood(m_iSnakeOne.body);
        m_iSpeed.gameMain = increaseSpeed(m_iSpeed.gameMain);
        m_iIntervalId.main = changeGameSpeed(m_iIntervalId.main, "gameLoopSingle();", m_iSpeed.gameMain);
    }

    // If true, reset the game.
    if (checkCollision(m_iSnakeOne))
        initializeSingle();
}

// Draws everything on the canvas.
function drawMapSingle()
{
    // Snake head
    paintTile(m_iSnakeOne.head.x, m_iSnakeOne.head.y, m_iSnakeData.headColor, m_iBorderWidth.snakeHead);

    // Snake body
    for (var index = 1; index < m_iSnakeOne.body.length; index++)
        paintTile(m_iSnakeOne.body[index].x, m_iSnakeOne.body[index].y, getRandomColor(1, 255), m_iBorderWidth.snakeBody);

    // Food
    paintFood();

    // Repaint toolbar
    paintToolbar();

    // Prints score on top of snake game
    writeMessage(m_iTextAlignment.left, m_iScore.color, "Score: " + m_iScore.one);
    writeMessage(m_iTextAlignment.left + 13, m_iScore.color, "Highest Score: " + m_iScore.highestOne);
}

// Checks if the snake got the food
function gotFoodSingle()
{
    if (m_iSnakeOne.head.x == m_iFood.x && m_iSnakeOne.head.y == m_iFood.y)
        return true;

    return false;
}

// Stops loop
function pauseGameSingle(bVisible)
{
    stopBackgroundMusic();
    showPausePic(bVisible);
    window.clearInterval(m_iIntervalId.main);
    m_bGameStatus.paused = true;
}

// Starts loop again
function unPauseGameSingle()
{
    playBackgroundMusic();
    showPausePic(false);
    m_iIntervalId.main = changeGameSpeed(m_iIntervalId.main, "gameLoopSingle();", m_iSpeed.gameMain);
    m_bGameStatus.paused = false;
}

function keyBoardDownSinglePlayer(event)
{
    var keyCode = event.keyCode;

    if (!m_bGameStatus.paused)
    {
        if (!m_iSnakeOne.updated)
            gameLoopSingle();

        if (keyCode == 38 && m_iSnakeOne.direction != m_sDirection.down)   // Up arrow key was pressed.
            m_iSnakeOne.direction = m_sDirection.up;

        else if (keyCode == 40 && m_iSnakeOne.direction != m_sDirection.up)    // Down arrow key was pressed.
            m_iSnakeOne.direction = m_sDirection.down;

        else if (keyCode == 37 && m_iSnakeOne.direction != m_sDirection.right) // Left arrow key was pressed.
            m_iSnakeOne.direction = m_sDirection.left;

        else if (keyCode == 39 && m_iSnakeOne.direction != m_sDirection.left) // Right arrow key was pressed.
            m_iSnakeOne.direction = m_sDirection.right;

        m_iSnakeOne.updated = false;
    }
}

function keyBoardUpSinglePlayer(event)
{
    var keyCode = event.keyCode;

    if (keyCode == 32)    // Space bar was pressed.
        m_bGameStatus.paused ? unPauseGameSingle() : pauseGameSingle(true);

    else if (keyCode == 27)    // Escape was pressed
    {
        pauseGameSingle(false);
        showStartMenu(true);
    }
}