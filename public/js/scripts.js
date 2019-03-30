function insertNbsp()
{
    var p = document.querySelectorAll( '.content-wrapper p' );

    for( var k = 0; k < p.length; k++ )
    {
        console.log( p[ k ] );
        p[ k ].innerHTML = p[ k ].innerHTML.replace( /(?<=(\s|>)\w)\s/g, '&nbsp;' );
        console.log( p[ k ].innerText );
    }
}

window.onload = function() {
    insertNbsp();    
}