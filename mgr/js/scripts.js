function getCurrentDate()
{
    var date = new Date();
    var y    = date.getFullYear();
    var m    = ( '0' + ( date.getMonth() + 1 ) ).slice( -2 );
    var d    = ( '0' + date.getDate() ).slice( -2 );
    var h    = ( '0' + date.getHours() ).slice( -2 );
    var i    = ( '0' + date.getMinutes() ).slice( -2 );
    var s    = ( '0' + date.getSeconds() ).slice( -2 );

    date     = y + m + d + '_' + h + i + s;

    return date;
}

function getDataObject()
{
    var dataGroups = $( '.prop-section-items' );
    var dataKeys   = [];
    var dataVals   = [];

    for( var i = 0; i < dataGroups.length; i++ )
    {
        var dataGroup = dataGroups.eq( i );
        var dataItems = dataGroup.children( '.prop-item-value' );

        for( var j = 0; j < dataItems.length; j++ )
        {
            var dataItem = dataItems.eq( j );
            var dataKey  = dataItem.attr( 'id' );
            var dataVal  = dataItem.text();

            if( typeof dataKey !== 'undefined' )
            {
                dataKey = dataKey.replace( 'prop-item-value-', '' );

                if( dataKey !== '' && dataVal !== '' )
                {
                    dataKeys.push( dataKey );
                    dataVals.push( dataVal );
                }
            }
        }
    }

    return { 'keys' : dataKeys, 'values' : dataVals };
}

function sendData( btn )
{
    var dataObj = getDataObject();
    var requestURL;
    var request;

    btn.addClass( 'disabled' );
    btn.children( '.btn-loader' ).css( 'opacity', 1 );
    btn.children( 'span' ).css( 'opacity', 0 );


    if( typeof dataObj[ 'keys' ] !== 'undefined' && typeof dataObj[ 'values' ] !== 'undefined' )
    {
        if( location.hostname === 'front.mgr' )
        {
            requestURL = '//back.mgr';
        }
        else
        {
            requestURL = 'https://data-entry-handler.herokuapp.com';
        }

        requestURL += '/?do=send&what=data';

        request = $.ajax( {
            method : 'POST',
            data   : { results : dataObj },
            url    : requestURL
        } );
        
        request.done( function( response, textStatus, xhr ) {
            response = JSON.parse( response );

            for( var k = 0; k < response.length; k++ )
            {
                if( response[ k ][ 'type' ] === 'error' )
                {
                    console.error( response[ k ][ 'msg' ] );
                }
                else
                {
                    console.log( response[ k ][ 'msg' ] );
                }
            }
         } );

        request.fail( function( xhr, textStatus, errorThrown ) {
            console.error( textStatus + ': ' + errorThrown );
        } );

        request.always( function( a, textStatus, b ) {
            btn.removeClass( 'disabled' );
            btn.children( '.btn-loader' ).css( 'opacity', 0 );
            btn.children( 'span' ).css( 'opacity', 1 );
        } );
    }
}

/*
 * Based on:
 * https://stackoverflow.com/questions/3665115/create-a-file-in-memory-for-user-to-download-not-through-server#answer-18197341
 */
function downloadData()
{
    var dataObj = getDataObject();
    var keys    = dataObj[ 'keys' ];
    var values  = dataObj[ 'values' ];

    if( typeof keys !== 'undefined' && typeof values !== 'undefined' )
    {
        var filename = '';
        var elem     = $( '<a/>' );
        var out      = keys.join( ',' ) + '\n' + values.join( ',' );
        var d        = new Date();

        if( out.replace(/\s/g, '' ) === '' )
        {
            return false;
        }

        filename = 'results_' + getCurrentDate() + '.txt';

        elem.attr( {
            href     : 'data:text/plain;charset=utf-8,' + encodeURIComponent( out ),
            download : filename
        } );

        elem.css( {
            display : 'none'
        } );

        elem.appendTo( $( 'body' ) );
        elem[ 0 ].click();
        elem.remove();
    }
}

$( function() {
    var userIds = [ 25, 51, 89, 92, 95 ];
    var userId  = userIds[ Math.floor( Math.random() * userIds.length ) ];

    var request = $.ajax( {
        method : 'GET',
        url    : './json/results_' + userId + '.json',
    } );
    
    request.done( function( data, textStatus, xhr ) {
        var dataContainer = $( '#data-container' );
        
        if( typeof data[ 'sections' ] !== 'undefined' && dataContainer.length > 0 )
        {
            for( var i = 0; i < data[ 'sections' ].length; i++ )
            {
                var sectionObj  = data[ 'sections' ][ i ];
                var sectionDiv  = $( '<div/>' ).addClass( 'prop-section' );

                if( typeof sectionObj[ 'id' ] !== 'undefined' )
                {
                    sectionDiv.attr( {
                        id : 'prop-section-' + sectionObj[ 'id' ]
                    } );
                }

                if( typeof sectionObj[ 'name' ] !== 'undefined' )
                {
                    $( '<div/>' ).addClass( 'prop-section-header line-below' ).html( $( '<div/>' ).text( sectionObj[ 'name' ] ) ).appendTo( sectionDiv );
                }

                if( typeof sectionObj[ 'values' ] !== 'undefined' )
                {
                    var propDiv = $( '<div/>' ).addClass( 'prop-section-items' );

                    for( var j = 0; j < sectionObj[ 'values' ].length; j++ )
                    {
                        var propObj  = sectionObj[ 'values' ][ j ];
                        var propName = $( '<div/>' );
                        var propVal  = $( '<div/>' );

                        if( typeof propObj[ 'name' ] !== 'undefined' )
                        {
                            propName.addClass( 'prop-item-name' ).text( propObj[ 'name' ] + ':' );

                            if( typeof propObj[ 'id' ] !== 'undefined' )
                            {
                                propName.attr( {
                                    id : 'prop-item-name-' +  propObj[ 'id' ]
                                } );
                            }

                            propName.appendTo( propDiv );
                        }

                        if( typeof propObj[ 'value' ] !== 'undefined' )
                        {
                            propVal.addClass( 'prop-item-value' ).text( propObj[ 'value' ] );

                            if( typeof propObj[ 'id' ] !== 'undefined' )
                            {
                                propVal.attr( {
                                    id : 'prop-item-value-' +  propObj[ 'id' ]
                                } );
                            }

                            propVal.appendTo( propDiv );
                        }

                        propDiv.appendTo( sectionDiv ); 
                    }
                }

                sectionDiv.appendTo( dataContainer );
            }

            if( sectionDiv.html() !== '' )
            {
                dataContainer.append( $( '#hidden-content #action-btns' ) );
            }
        }
    } );

    request.fail( function( xhr, textStatus, errorThrown ) {
        console.error( textStatus + ': ' + errorThrown );
    } );

    $( '#action-send' ).click( function() {
        if( !$( this ).hasClass( 'disabled' ) )
        {
            sendData( $( this ) );
        }
    } );

    $( '#action-download' ).click( function() {
        downloadData();
    } );
} );