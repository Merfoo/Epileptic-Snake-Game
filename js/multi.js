// Muliplayer Teleportic

function initializeMulti()
{
    showStartMenu(false);
    m_bGameStatus.started = true;
    m_bGameStatus.multi = true;

    // Scores
    m_iScore.highestOne = 1;
    m_iScore.highestTwo = 1;

    // Snakes
    resetSnakeOneMulti();
    resetSnakeTwoMulti();

    // Food
    setFood(m_iSnakeOne.body.concat(m_iSnakeTwo.body));
}

// Runs all the functions required for the game to work.
function gameLoopMulti() 
{
    playBackgroundMusic();
    drawMapMulti();
}

// Draws everything on the canvas.
function drawMapMulti()
{
    // Food
    paintFood();

    // Repaint toolbar
    paintToolbar();

    // Prints score on top of snake game
    writeMessage(m_iTextAlignment.left, m_iSnakeOne.color, "Score One: " + m_iScore.one);
    writeMessage(m_iTextAlignment.left + 10, m_iSnakeTwo.color, "Score Two: " + m_iScore.two);
    writeMessage(m_iTextAlignment.middle + 5, m_iSnakeOne.color, "Total Score One: " + m_iScore.highestOne);
    writeMessage(m_iTextAlignment.middle + 15, m_iSnakeTwo.color, "Total Score Two: " + m_iScore.highestTwo);
}

// Sets up snake 1
function setUpSnakeOneMulti()
{
    setUpSnake(m_iSnakeOne);

    for (var index = 1; index < m_iSnakeOne.body.length; index++)
        paintTile(m_iSnakeOne.body[index].x, m_iSnakeOne.body[index].y, m_iSnakeOne.color, m_iBorderWidth.snakeBody);

    paintTile(m_iSnakeOne.head.x, m_iSnakeOne.head.y, m_iSnakeOne.color, m_iBorderWidth.snakeHead);

    if (gotFoodMulti() == m_iSnakeOne.id)
    {
        playFoodMusic();
        var tempData = { x: m_iSnakeOne.body[m_iSnakeOne.body.length - 1].x, y: m_iSnakeOne.body[m_iSnakeOne.body.length - 1].y };
        m_iSnakeOne.body.push(tempData);
        m_iScore.one++;
        m_iScore.highestOne++;
        m_iSpeed.gameOne = increaseSpeed(m_iSpeed.gameOne);
        m_iIntervalId.one = changeGameSpeed(m_iIntervalId.one, "setUpSnakeOneMulti();", m_iSpeed.gameOne);
        setFood(m_iSnakeOne.body.concat(m_iSnakeTwo.body));
    }

    if (checkCollision(m_iSnakeOne))
        resetSnakeOneMulti();

    else
        resetASnakeMulti(hitOtherSnakes(m_iSnakeOne, m_iSnakeTwo));

    if (m_iSpeed.gameOne <= m_iSpeed.gameTwo)
        gameLoopMulti();

    m_iSnakeOne.updated = true;
}

// Sets up snake 2
function setUpSnakeTwoMulti()
{
    setUpSnake(m_iSnakeTwo);

    for (var index = 1; index < m_iSnakeTwo.body.length; index++)
        paintTile(m_iSnakeTwo.body[index].x, m_iSnakeTwo.body[index].y, m_iSnakeTwo.color, m_iBorderWidth.snakeBody);

    paintTile(m_iSnakeTwo.head.x, m_iSnakeTwo.head.y, m_iSnakeTwo.color, m_iBorderWidth.snakeHead);

    if (gotFoodMulti() == m_iSnakeTwo.id)
    {
        playFoodMusic();
        var tempData = { x: m_iSnakeTwo.body[m_iSnakeTwo.body.length - 1].x, y: m_iSnakeTwo.body[m_iSnakeTwo.body.length - 1].y };
        m_iSnakeTwo.body.push(tempData);
        m_iScore.two++;
        m_iScore.highestTwo++;
        m_iSpeed.gameTwo = increaseSpeed(m_iSpeed.gameTwo);
        m_iIntervalId.two = changeGameSpeed(m_iIntervalId.two, "setUpSnakeTwoMulti();", m_iSpeed.gameTwo);
        setFood(m_iSnakeOne.body.concat(m_iSnakeTwo.body));

        if (m_iSpeed.gameTwo != m_iSpeed.gameMain && m_iSpeed.gameTwo > m_iSpeed.gameOne)
        {
            m_iSpeed.gameMain = m_iSpeed.gameTwo;
            m_iIntervalId.main = changeGameSpeed(m_iIntervalId.main, "drawMapMulti();", m_iSpeed.gameMain);
        }
    }

    if(checkCollision(m_iSnakeTwo))
        resetSnakeTwoMulti();

    else 
        resetASnakeMulti(hitOtherSnakes(m_iSnakeOne, m_iSnakeTwo));

    if (m_iSpeed.gameTwo <= m_iSpeed.gameOne)
        gameLoopMulti();

    m_iSnakeTwo.updated = true;
}

// Checks if the snake got the food.
function gotFoodMulti()
{
    if (m_iSnakeOne.head.x == m_iFood.x && m_iSnakeOne.head.y == m_iFood.y)
        return m_iSnakeOne.id;

    if (m_iSnakeTwo.head.x == m_iFood.x && m_iSnakeTwo.head.y == m_iFood.y)
        return m_iSnakeTwo.id;

    return false;
}

function resetASnakeMulti(snakeID)
{

    if (snakeID != 0)
    {
        if (snakeID == m_iSnakeOne.id)
            resetSnakeOneMulti();

        else if (snakeID == m_iSnakeTwo.id)
            resetSnakeTwoMulti();
    }
}

// Resets all values related to snake one
function resetSnakeOneMulti()
{
    if (m_iSnakeOne.body[0] != null)
        for (var index = 0; index < m_iSnakeOne.body.length; index++)
            paintTile(m_iSnakeOne.body[index].x, m_iSnakeOne.body[index].y, m_iMap.backgroundColor, m_iBorderWidth.background);

    m_iSnakeOne.head.x = 0;
    m_iSnakeOne.head.y = m_iMap.height;
    m_iSnakeOne.direction = m_sDirection.up;
    m_iSpeed.gameOne = m_iSpeed.gameMain;
    m_iSnakeOne.body = new Array(m_iSnakeData.lengthMulti);
    m_iScore.one = 0;
    m_iScore.highestOne--;

    if (m_iIntervalId.one != null)
        clearInterval(m_iIntervalId.one);

    m_iIntervalId.one = window.setInterval("setUpSnakeOneMulti();", m_iSpeed.gameOne);

    for (var index = 0; index < m_iSnakeOne.body.length; index++)
        m_iSnakeOne.body[index] = { x: m_iSnakeOne.head.x, y: m_iMap.height + index };
}

// Resets all values related to snake two
function resetSnakeTwoMulti()
{
    if (m_iSnakeTwo.body[0] != null)
        for (var index = 0; index < m_iSnakeTwo.body.length; index++)
            paintTile(m_iSnakeTwo.body[index].x, m_iSnakeTwo.body[index].y, m_iMap.backgroundColor, m_iBorderWidth.background);

    m_iSnakeTwo.head.x = m_iMap.width - 1;
    m_iSnakeTwo.head.y = 0;
    m_iSnakeTwo.direction = m_sDirection.down;
    m_iSpeed.gameTwo = m_iSpeed.gameMain;
    m_iSnakeTwo.body = new Array(m_iSnakeData.lengthMulti);
    m_iScore.two = 0;
    m_iScore.highestTwo--;

    if (m_iIntervalId.two != null)
        clearInterval(m_iIntervalId.two);

    m_iIntervalId.two = window.setInterval("setUpSnakeTwoMulti();", m_iSpeed.gameTwo);

    for (var index = 0; index < m_iSnakeTwo.body.length; index++)
        m_iSnakeTwo.body[index] = { x: m_iSnakeTwo.head.x, y: -index };
}

// Stops loop
function pauseGameMulti(bVisible)
{
    stopBackgroundMusic();
    showPausePic(bVisible);
    window.clearInterval(m_iIntervalId.main);
    window.clearInterval(m_iIntervalId.one);
    window.clearInterval(m_iIntervalId.two);
    m_bGameStatus.paused = true;
}

// Starts loop again
function unPauseGameMulti()
{
    playBackgroundMusic();
    showPausePic(false);
    m_iIntervalId.main = window.setInterval("gameLoopMulti();", m_iSpeed.gameMain);
    m_iIntervalId.one = window.setInterval("setUpSnakeOneMulti();", m_iSpeed.gameOne);
    m_iIntervalId.two = window.setInterval("setUpSnakeTwoMulti();", m_iSpeed.gameTwo);
    m_bGameStatus.paused = false;
}

// Handle keyboard events for multiplayer
function keyBoardDownMulti(event)
{
    var keyCode = event.keyCode;

    if (keyCode == 87 || keyCode == 83 || keyCode == 65 || keyCode == 68)
    {
        if (!m_iSnakeOne.updated)
            setUpSnakeOneMulti();

        // Snake 1
        if (keyCode == 87 && m_iSnakeOne.direction != "down")   // Up arrow key was pressed.
            m_iSnakeOne.direction = "up";

        else if (keyCode == 83 && m_iSnakeOne.direction != "up")    // Down arrow key was pressed.
            m_iSnakeOne.direction = "down";

        else if (keyCode == 65 && m_iSnakeOne.direction != "right") // Left arrow key was pressed.
            m_iSnakeOne.direction = "left";

        else if (keyCode == 68 && m_iSnakeOne.direction != "left") // Right arrow key was pressed.
            m_iSnakeOne.direction = "right";

        m_iSnakeOne.updated = false;
    }

    if (keyCode == 38 || keyCode == 40 || keyCode == 37 || keyCode == 39)
    {
        if (!m_iSnakeTwo.updated)
            setUpSnakeTwoMulti();

        // Snake 2
        if (keyCode == 38 && m_iSnakeTwo.direction != "down")   // Up arrow key was pressed.
            m_iSnakeTwo.direction = "up";

        else if (keyCode == 40 && m_iSnakeTwo.direction != "up")    // Down arrow key was pressed.
            m_iSnakeTwo.direction = "down";

        else if (keyCode == 37 && m_iSnakeTwo.direction != "right") // Left arrow key was pressed.
            m_iSnakeTwo.direction = "left";

        else if (keyCode == 39 && m_iSnakeTwo.direction != "left") // Right arrow key was pressed.
            m_iSnakeTwo.direction = "right";

        m_iSnakeTwo.updated = false;
    }
}

function keyBoardUpMulti(event)
{
    var keyCode = event.keyCode;

    if (keyCode == 32)
        m_bGameStatus.paused ? unPauseGameMulti() : pauseGameMulti(true);

    else if (keyCode == 27) // Escape was pressed
    {
        pauseGameMulti(false);
        showStartMenu(true);
    }
}