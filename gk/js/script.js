var canvas              = document.getElementById( 'game-canvas' );
var ctx                 = canvas.getContext( '2d' );
var x                   = canvas.width / 2;
var y                   = canvas.height - 30;
var dx                  = 2;
var dy                  = -2;
var gameColor           = '#0095dd';
var gameColorContrast   = '#ff3500';
var ballRadius          = 10;
var paddleWidth         = 75;
var paddleHeight        = 10;
var paddleX             = ( canvas.width - paddleWidth ) / 2;
var leftPressed         = false;
var rightPressed        = false;
var gameOver            = false;
var gameCompleted       = false;
var brickRowCount       = 3;
var brickColumnCount    = 5;
var brickWidth          = 75;
var brickHeight         = 20;
var brickPadding        = 10;
var brickOffsetTop      = 30;
var brickOffsetLeft     = 30;
var bricks              = [];
var score               = 0;
var lives               = 3;

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

function onCollisionDetect()
{
    for( var c = 0; c < brickColumnCount; c++ )
    {
        for( var r = 0; r < brickRowCount; r++ )
        {
            var b = bricks[ c ][ r ];

            if( b.status === 1 && x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight )
            {
                dy = -dy;
                b.status = 0;
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
    var relativeX = e.clientX - canvas.offsetLeft;

    if( relativeX > 0 && relativeX < canvas.width )
    {
        paddleX = relativeX - paddleWidth / 2;
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
    if( e.key === 'Right' || e.key === 'ArrowRight')
    {
        rightPressed = false;
    }
    else if( e.key === 'Left' || e.key === 'ArrowLeft')
    {
        leftPressed = false;
    }
}

function drawLives() {
    ctx.font        = '16px Roboto';
    ctx.fillStyle   = gameColor;
    ctx.fillText( 'Lives: ' + lives, canvas.width - 65, 20 );
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
                ctx.fillStyle = gameColor;
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

function drawScore()
{
    ctx.font        = '16px Roboto';
    ctx.fillStyle   = gameColor;
    ctx.fillText( 'Score: ' + score, 8, 20 ); 
}


function drawPaddle()
{
    ctx.beginPath();
    ctx.rect( paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight );
    ctx.fillStyle = gameColor;
    ctx.fill();
    ctx.closePath();
}

function drawBall()
{
    ctx.beginPath();
    ctx.arc( x, y, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = gameColorContrast;
    ctx.fill();
    ctx.closePath();
}

function draw()
{
    ctx.clearRect( 0, 0, canvas.width, canvas.height );
    drawBricks();
    drawBall();
    drawPaddle();
    drawLives();
    drawScore();
    onCollisionDetect();
;
    if( y + dy < ballRadius )
    {
        dy = -dy;
    }
    else if ( x > paddleX && x < paddleX + paddleWidth && y + ballRadius === canvas.height - paddleHeight )
    {
        dy = -dy;
    }
    else if( y === canvas.height - ballRadius )
    {
        if( !lives)
        {
            gameOver = true;
        }
        else
        {
            lives--;
            // Default values
            x       = canvas.width / 2;
            y       = canvas.height - 30;
            dx      = 2;
            dy      = -2;
            paddleX = ( canvas.width - paddleWidth ) / 2;
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

    if( !gameOver && !gameCompleted )
    {
        requestAnimationFrame( draw );
    }
    else
    {
        if( gameOver )
        {
            alert( 'GAME OVER' );
        }
        else
        {
            alert( 'YOU WIN!');
        }
    }
}

document.addEventListener( 'mousemove', onMouseMove, false );
document.addEventListener( 'keydown', onKeyDown, false );
document.addEventListener( 'keyup', onKeyUp, false );

draw();

/*
 * May be useful
 */

//    document.location.reload();
