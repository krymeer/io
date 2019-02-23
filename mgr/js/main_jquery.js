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

function getDataArray()
{
    var dataArr    = [];
    var dataGroups = $( '.prop-section-items' );

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

                if( dataVal !== '' )
                {
                    var dataObj = {};
                    dataObj[ dataKey ] = dataVal;
                    dataArr.push( { 
                        key     : dataKey, 
                        value   : dataVal
                    } );
                }
            }
        }
    }

    return dataArr;
}

function sendData()
{
    var dataArr = getDataArray();
    var request;

    if( dataArr.length > 0 )
    {
        request = $.ajax( {
            method : 'POST',
            data   :  { results : dataArr },
            url    : '//back.mgr/index.php?do=send&what=data'
            //url    : '//data-entry-handler.herokuapp.com/get_data.php'
        } )
        
        request.done( function( response, textStatus, xhr ) {
            response = JSON.parse( response );

            if( response[ 'type' ] === 'error' )
            {
                console.error( response[ 'msg' ] );
            }
            else
            {
                console.log( response[ 'msg' ] );
            }
         } );

        request.fail( function( xhr, textStatus, errorThrown ) {
            console.error( textStatus + ': ' + errorThrown );
        } );
    }
}

/*
 * Based on:
 * https://stackoverflow.com/questions/3665115/create-a-file-in-memory-for-user-to-download-not-through-server#answer-18197341
 */
function downloadData()
{
    var dataArr = getDataArray();

    if( dataArr.length > 0 )
    {
        var keys     = [];
        var values   = [];
        var elem     = $( '<a/>' );
        var d        = new Date();
        var out      = '';
        var filename = '';

        for( var k = 0; k < dataArr.length; k++ )
        {
            var key = dataArr[ k ][ 'key' ];
            var val = dataArr[ k ][ 'value' ];
            
            if( typeof key !== 'undefined' )
            {
                keys.push( key );
            }
            
            if( typeof val !== 'undefined' )
            {
                values.push( val );
            }
        }

        out    = keys.join( ',' ) + '\n' + values.join( ',' );

        if( out.replace(/\s/g, '' ) === '' )
        {
            return false;
        }

        filename = 'results_' + getCurrentDate() + '.csv';

        elem.attr( {
            href     : 'data:text/csv;charset=ISO-8859-2,' + encodeURIComponent( out ),
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
    var request;

    request = $.ajax( {
        method : 'GET',
        url    : './json/results.json',
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
        sendData();
    } );

    $( '#action-download' ).click( function() {
        downloadData();
    } );
} );