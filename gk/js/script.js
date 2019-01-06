window.onload = function() {
    /*
     * Variables related to the canvas (UI)
     */
    const canvas            = document.getElementById( 'game-canvas' );
    const ctx               = canvas.getContext( '2d' );
    const colors            = {
        accentAlt   : '#95ff00',
        accentDark  : '#61892f',
        accent      : '#86c232',
        black       : '#222629',
        gray        : '#474b4f',
        grayLight   : '#6b6e70',
        white       : '#fafafa',
        red         : '#c70000',
        alert       : '#f3de2c'
    };
    const fontStyle         = 'bold 16px Ubuntu Mono';
    const fontHeaderStyle   = 'bold 32px Ubuntu Mono';

    /*
     * Booleans
     */
    var leftPressed     = false;
    var rightPressed    = false;
    var gameOver        = false;
    var gameCompleted   = false;
    var gameStarted     = false;
    var liveLost        = false;

    /*
     * Variables related to the ball
     */
    const ballRadius = 10;

    /*
     * Variables related to the ball's movement
     */
    var x, y, dx, dy;

    /*
     * Variables related to bricks
     */
    const brickPadding      = 10;
    const brickOffsetTop    = 49;
    const brickOffsetLeft   = 15;
    const brickColumnCount  = 8;
    const brickRowCount     = 5;
    const brickWidth        = ( canvas.width - 2 * brickOffsetLeft - brickPadding * ( brickColumnCount - 1 ) ) / brickColumnCount;
    const brickHeight       = 20;
    var bricks;

    /*
     * Variables related to the paddle
     */
    var paddleWidth     = 75;
    var paddleHeight    = 10;
    var paddleX; 

    /*
     * Miscellaneous variables
     */
    var score, lives;

    /**
     * Restore the original values of some of the variables
     */
    function setInitState()
    {
        if( ( typeof score === 'undefined' && typeof lives === 'undefined' ) || gameOver || gameCompleted )
        {
            score = 0;
            lives = 2;

            if( gameOver || gameCompleted )
            {
                makeAllBricksVisible();
            }
        }

        gameOver        = false;
        gameCompleted   = false;
        gameStarted     = true;
        liveLost        = false;
        paddleX         = ( canvas.width - paddleWidth ) / 2;
        x               = canvas.width / 2;
        y               = canvas.height - 30;
        dx              = 2;
        dy              = -2;
    }

    function onCollisionDetect()
    {
        for( var c = 0; c < brickColumnCount; c++ )
        {
            for( var r = 0; r < brickRowCount; r++ )
            {
                var brick = bricks[ c ][ r ];

                /*
                 * This condition has to be changed since it is too easy to hit the brick
                 */
                if( brick.status === 1 && x > brick.x && x < brick.x + brickWidth && y > brick.y && y < brick.y + brickHeight )
                {
                    dy              = -dy;
                    brick.status    = 0;
                    score++;

                    if( score === brickRowCount * brickColumnCount )
                    {
                        gameCompleted = true;
                    }
                }
            }
        }
    }

    function onMouseMove( e )
    {
        var relativeX = e.clientX - canvas.offsetLeft;;

        if( relativeX > 0 && relativeX < canvas.width )
        {
            paddleX = relativeX - paddleWidth / 2;

            if( paddleX < 0 )
            {
                paddleX = 0;
            }
            else if( paddleX + paddleWidth > canvas.width )
            {
                paddleX = canvas.width - paddleWidth;
            }
        }
    }

    function onKeyDown( e )
    {
        if( e.key === 'Right' || e.key === 'ArrowRight')
        {
            rightPressed = true;
        }
        else if( e.key === 'Left' || e.key === 'ArrowLeft')
        {
            leftPressed = true;
        }
    }

    function onKeyUp( e )
    {
        if( e.keyCode === 32 && !gameStarted )
        {
            startGame();
        }
        else if( e.keyCode === 39 )
        {
            rightPressed = false;
        }
        else if( e.keyCode === 37 )
        {
            leftPressed = false;
        }
    }

    function drawBackground()
    {
        ctx.fillStyle = colors.grayLight;
        ctx.fillRect( 0, 0, canvas.width, canvas.height );
    }

    function drawEndingText( type )
    {
        var headerText, normalText, headerColor, secondLineText;
        var thirdLineText = 'Press Space';

        if( type === 'whoops' )
        {
            headerText      = 'Whoops!';
            headerColor     = colors.alert;
            secondLineText  = 'You lost this time!';
            thirdLineText   += ' to play an another round!'
        }
        else if( type == 'gameOver')
        {
            headerText      = 'Game Over';
            headerColor     = colors.red;
            secondLineText  = 'Number of points scored: ';
        }
        else if( type == 'gameCompleted' )
        {
            headerText      = 'You Win!';
            headerColor     = colors.accentAlt;
            secondLineText  = 'Congrats! Your score is: ';
        }

        if( type == 'gameOver' || type === 'gameCompleted' )
        {
            secondLineText  += score + '.';
            thirdLineText   += ' to play again.';
        }

        if ( typeof headerText !== 'undefined' && typeof headerColor !== 'undefined' && typeof secondLineText !== 'undefined' && typeof thirdLineText !== 'undefined' )
        {
            ctx.textAlign   = 'center';

            ctx.font        = fontHeaderStyle;
            ctx.fillStyle   = headerColor;
            ctx.fillText( headerText, canvas.width / 2, canvas.height / 2 + 20 );

            ctx.font        = fontStyle;
            ctx.fillStyle   = colors.white;
            ctx.fillText( secondLineText, canvas.width / 2, canvas.height / 2 + 50 );
            ctx.fillText( thirdLineText, canvas.width / 2, canvas.height / 2 + 70 );
        }
    }

    function drawWelcome()
    {
        ctx.font        = fontStyle;
        ctx.fillStyle   = colors.white;
        ctx.textAlign   = 'center';
        ctx.fillText( 'Press Space to start the game!', canvas.width / 2, canvas.height / 2 );
        ctx.strokeStyle = colors.white;
        ctx.stroke();
    }

    function drawLives()
    {
        ctx.font        = fontStyle;
        ctx.fillStyle   = colors.white;
        ctx.textAlign   = 'end';
        ctx.fillText( 'Lives: ' + lives, canvas.width - 10, 21 );
    }

    function drawScore()
    {
        ctx.font        = fontStyle;
        ctx.fillStyle   = colors.white;
        ctx.textAlign   = 'start';
        ctx.fillText( 'Score: ' + score, 10, 21 ); 
    }

    function drawTopBar()
    {
        ctx.beginPath();
        ctx.rect( 0, 0, canvas.width, 34 );
        ctx.fillStyle = colors.black;
        ctx.fill();
        ctx.closePath();
    }

    function makeAllBricksVisible()
    {
        for( var c = 0; c < brickColumnCount; c++ )
        {
            for( var r = 0; r < brickRowCount; r++ )
            {
                bricks[ c ][ r ] = {
                    status : 1
                }
            }
        }
    }

    function buildBricks()
    {
        bricks = [];

        for( var c = 0; c < brickColumnCount; c++ )
        {
            bricks[ c ] = [];

            for( var r = 0; r < brickRowCount; r++ )
            {
                bricks[ c ][ r ] = {
                    x       : 0,
                    y       : 0,
                    status  : 1
                }
            }
        }
    }

    function drawBricks()
    {
        for( var c = 0; c < brickColumnCount; c++ )
        {
            for( var r = 0; r < brickRowCount; r++ )
            {
                if( bricks[ c ][ r ].status === 1 )
                {
                    var brickX          = ( c * ( brickWidth + brickPadding ) ) + brickOffsetLeft;
                    var brickY          = ( r * ( brickHeight + brickPadding ) ) + brickOffsetTop;

                    bricks[ c ][ r ].x  = brickX;
                    bricks[ c ][ r ].y  = brickY;

                    ctx.beginPath();
                    ctx.rect( brickX, brickY, brickWidth, brickHeight );
                    ctx.fillStyle = colors.accent;
                    ctx.fill();
                    ctx.closePath();
                }
            }
        }
    }

    function drawPaddle()
    {
        ctx.beginPath();
        ctx.rect( paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight );
        ctx.fillStyle = colors.accent;
        ctx.fill();
        ctx.closePath();
    }

    function drawBall()
    {
        ctx.beginPath();
        ctx.arc( x, y, ballRadius, 0, Math.PI * 2);
        ctx.fillStyle = colors.black;
        ctx.fill();
        ctx.closePath();
    }

    function draw()
    {
        ctx.clearRect( 0, 0, canvas.width, canvas.height );
        drawBackground();
        drawTopBar();
        drawBricks();
        drawBall();
        drawPaddle();
        drawLives();
        drawScore();
        onCollisionDetect();

        if( y + dy < ballRadius + 34 )
        {
            dy = -dy;
        }
        else if ( x > paddleX && x < paddleX + paddleWidth && y + ballRadius === canvas.height - paddleHeight )
        {
            dy = -dy;
        }
        else if( y === canvas.height - ballRadius )
        {
            gameStarted = false;

            if( !lives )
            {
                gameOver = true;
            }
            else
            {
                lives--;
                liveLost = true;
            }
        }

        if( x + dx < ballRadius || x + dx > canvas.width - ballRadius )
        {
            dx = -dx;
        }

        if( rightPressed && paddleX < canvas.width - paddleWidth )
        {
            paddleX += 7;
        }
        else if( leftPressed && paddleX > 0 )
        {
            paddleX -= 7;
        }

        x += dx;
        y += dy;

        if( gameStarted && !gameOver && !gameCompleted && !liveLost )
        {
            requestAnimationFrame( draw );
        }
        else
        {
            gameStarted = false;

            if( liveLost )
            {
                drawEndingText( 'whoops' );
            }
            else if( gameOver )
            {
                drawEndingText( 'gameOver' );
            }
            else if( gameCompleted )
            {
                drawEndingText( 'gameCompleted' );
            }
        }
    }

    document.addEventListener( 'mousemove', onMouseMove, false );
    document.addEventListener( 'keydown', onKeyDown, false );
    document.addEventListener( 'keyup', onKeyUp, false );

    drawBackground();
    drawWelcome();

    function startGame()
    {
        if( typeof bricks === 'undefined' )
        {
            buildBricks();
        }

        setInitState();
        draw();
    }
}