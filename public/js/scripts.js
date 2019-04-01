function addClassName( element, classNameToAdd )
{
    if( element === null || typeof classNameToAdd !== 'string' )
    {
        return false;
    }

    element.className += ' ' + classNameToAdd;
    element.className = element.className.trim().replace( /\s{2,}/g, '' );
}

function removeClassName( element, classNameToRemove )
{
    if( element === null || typeof classNameToRemove !== 'string' )
    {
        return false;
    }

    element.className = element.className.replace( classNameToRemove, '' );
    element.className = element.className.trim().replace( /\s{2,}/g, '' );
}

function getPrevSibling( element, siblingClassName )
{
    var sibling = element.previousElementSibling;

    while( sibling !== null )
    {
        if( sibling.className.indexOf( siblingClassName ) !== -1 )
        {
            return sibling;
        }

        sibling = sibling.previousElementSibling;
    }

    return sibling;
}

function getNextSibling( element, siblingClassName )
{
    var sibling = element.nextElementSibling;

    while( sibling !== null )
    {
        if( sibling.className.indexOf( siblingClassName ) !== -1 )
        {
            return sibling;
        }

        sibling = sibling.nextElementSibling;
    }

    return sibling;
}

function insertNbsp()
{
    var p = document.querySelectorAll( 'p' );

    for( var k = 0; k < p.length; k++ )
    {
        p[ k ].innerHTML = p[ k ].innerHTML.replace( /(?<=(\s|>)\w)\s/g, '&nbsp;' );
    }
}

function isVisible( elem )
{
    if( elem === null )
    {
        return false;
    }

    if( elem.className.indexOf( 'hidden' ) >= 0 || elem.className.indexOf( 'disabled' ) >= 0 || elem.closest( '.hidden' ) !== null || elem.closest( '.disabled' ) !== null )
    {
        return false;
    }

    return true;
}

function handleScenarioBtn()
{
    var startScenarioBtns  = document.querySelectorAll( '.btn-start-scenario' );
    var finishScenarioBtns = document.querySelectorAll( '.btn-finish-scenario' );

    for( var k = 0; k < startScenarioBtns.length; k++ )
    {
        startScenarioBtns[ k ].addEventListener( 'click', function() {
            if( isVisible( this ) )
            {
                addClassName( this, 'disabled' );
                removeClassName( getNextSibling( this, 'task' ), 'hidden' );
            }
        } );
    }

    for( var k = 0; k < finishScenarioBtns.length; k++ )
    {
        finishScenarioBtns[ k ].addEventListener( 'click', function() {
            if( isVisible( this ) )
            {
                addClassName( this, 'disabled' );
                alert( 'Scenariusz zakończony!' );
            }
        } );
    }
}

function handleTaskBtn()
{
    var startTaskBtns  = document.querySelectorAll( '.btn-start-task' );
    var finishTaskBtns = document.querySelectorAll( '.btn-finish-task' );

    for( var k = 0; k < startTaskBtns.length; k++ )
    {
        var btn = startTaskBtns[ k ];

        btn.addEventListener( 'click', function() {
            if( isVisible( this ) )
            {
                addClassName( this, 'disabled' );
                removeClassName( getNextSibling( this, 'btn-finish-task' ), 'hidden' );
                removeClassName( getNextSibling( this, 'form-container' ), 'hidden' );
            }
        } );
    }

    for( var k = 0; k < finishTaskBtns.length; k++ )
    {
        var btn = finishTaskBtns[ k ];

        btn.addEventListener( 'click', function() {
            if( isVisible( this ) )
            {
                addClassName( this, 'disabled' );

                var inputs = getPrevSibling( this, 'form-container' ).querySelectorAll( 'input' );

                for( var k = 0; k < inputs.length; k++ )
                {
                    inputs[ k ].disabled = true;
                }

                var uncle = this.parentNode.nextElementSibling;

                if( uncle.tagName.toLowerCase() === 'section' && !isVisible( uncle ) )
                {
                    removeClassName( uncle, 'hidden' );
                }
            }
        } );
    }
}

window.onload = function() {
    insertNbsp();
    handleTaskBtn();
    handleScenarioBtn();
}