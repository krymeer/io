var persons = [];

function getPerson( id ) {
    return persons.find( x => x.id === id );
}

function mergePersonNames( firstName, lastName ) {
    if( typeof firstName !== 'string' || typeof lastName !== 'string' )
    {
        return '';
    }

    return firstName.replace( ' ', '&' ) + ',' + lastName;
}

function getPersonByName( firstName, lastName )
{
    return persons.find( x => x.firstName === firstName && x.lastName === lastName );
}

function getPersonDetails( id ) {
    var person = getPerson( id );

    if( typeof person !== 'undefined' )
    {
        var father = 'NN';
        var mother = 'NN';

        if( person.father >= 0 )
        {
            father = persons[ person.father ].firstName + ' ' + persons[ person.father ].lastName;
        }

        if( person.mother >= 0 )
        {
            mother = persons[ person.mother ].firstName + ' ' + persons[ person.mother ].lastName;
        }

        $( '#person-details-box' ).html( '' ).append(
            $( '<div/>' ).text(  person.firstName + ' ' + person.lastName + ' (' + person.sex + ')' ),
            $( '<div/>' ).html( '<b>Ojciec:</b> ' + father  ),
            $( '<div/>' ).html( '<b>Matka:</b> ' + mother  )
        ).show();
    }
}

function getAllRelationships() {
    var data = '';

    for( var k = 0; k < persons.length; k++ )
    {
        var personName  = persons[ k ].firstName.replace( ' ', '&' ) + ',' + persons[ k ].lastName;

        data += 'ClassAssertion( ';

        if( persons[ k ].sex === 'M' )
        {
            data += ':Male';
        }
        else
        {
            data += ':Female';
        }

        data += ' :' + personName + ' )\n';
    }

    for( var k = 0; k < persons.length; k++ )
    {
        var personName  = mergePersonNames( persons[ k ].firstName, persons[ k ].lastName );
        var father      = getPerson( persons[ k ].father );
        var mother      = getPerson( persons[ k ].mother );

        if( typeof father !== 'undefined' )
        {
            data += 'ObjectPropertyAssertion( :';

            if( persons[ k ].sex === 'M' )
            {
                data += 'hasSon'
            }
            else
            {
                data += 'hasDaughter'
            }

            data += ' :' + mergePersonNames( father.firstName, father.lastName ) + ' :' + personName + ' )\n';
        }

        if( typeof mother !== 'undefined' )
        {
            data += 'ObjectPropertyAssertion( :';

            if( persons[ k ].sex === 'M' )
            {
                data += 'hasSon'
            }
            else
            {
                data += 'hasDaughter'
            }

            data += ' :' + mergePersonNames( mother.firstName, mother.lastName ) + ' :' + personName + ' )\n';
        }

        for( var i = 0; i < persons[ k ].children.length; i++ )
        {
            // List all the children of the given parent
            // I am not sure if I even need this
        }
    }

    return data;
}

function addNewRelation( relationName, relationArray ) {
    var personOne = getPersonByName( relationArray[ 0 ].firstName, relationArray[ 0 ].lastName );
    var personTwo = getPersonByName( relationArray[ 1 ].firstName, relationArray[ 1 ].lastName );

    if( typeof personOne !== 'undefined' && typeof personTwo !== 'undefined' )
    {
        personOne.children.push( personTwo.id );

        if( personOne.sex === 'M' )
        {
            personTwo.father = personOne.id;
        }
        else
        {
            personTwo.mother = personOne.id;
        }
    }
}

function addNewPerson( pSex, pFirstName, pLastName, pFatherId = -1, pMotherId = -1 ) {
    var pId = 0;

    if( persons.length > 0 )
    {
        pId = 1 + Math.max.apply( Math, persons.map( function( o ) { return o.id } ) );
    }

    persons.push( {
        firstName : pFirstName,
        lastName  : pLastName,
        sex       : pSex,
        father    : pFatherId,
        mother    : pMotherId,
        id        : pId,
        children  : []
    } );

    if( pFatherId >= 0 )
    {
        getPerson( pFatherId ).children.push( pId );

    }

    if( pMotherId >= 0 )
    {
        getPerson( pMotherId ).children.push( pId );
    }

    //console.log( persons );

    $( '<li/>' ).addClass( 'person' ).attr( 'data-person-id', pId ).text( pFirstName + ' ' + pLastName + ' (' + pSex + '/' + pId + ')' ).appendTo( $( '#list-of-persons' ) );

    updateSelectLists();
    cleanForm();
    checkListEmptiness();
}

function addPersonFromInput() {
    var inputFirstName  = $( '#person-first-name' ).val();
    var inputLastName   = $( '#person-last-name' ).val();
    var chosenSex       = $( '#person-sex option:selected' ).attr( 'data-person-sex' );
    var chosenFatherId  = parseInt( $( '#person-parent-M option:selected' ).attr( 'data-person-id' ) );
    var chosenMotherId  = parseInt( $( '#person-parent-F option:selected' ).attr( 'data-person-id' ) );

    if( inputFirstName !== "" && inputLastName !== "" )
    {
        addNewPerson( chosenSex, inputFirstName, inputLastName, chosenFatherId, chosenMotherId );
    }
    else
    {
        alert( 'Wprowadzone dane są niepełne lub nieprawidłowe.' );
    }
}

function handleInputData( fileData ) {
    var lines = fileData.split( '\n' );

    for( var k = 0; k < lines.length; k++ )
    {
        var line = lines[ k ].replace( /\s+/g, '' );

        if( line.length <= 0 )
        {
            continue;
        }

        var statement   = line.substring( 0, line.indexOf( '(' ) );
        var values      = line.substring( line.indexOf( '(' ) + 1, line.indexOf( ')' ) ).match( /:[\wąćęłóńźż&,]+/gi );

        if( values.length === 2 && statement === 'ClassAssertion' )
        {
            var className = values[ 0 ].substring( 1 );
            var personName = values[ 1 ].substring( 1 ).split( ',' );

            if( personName.length !== 2 )
            {
                continue;
            }

            if( className === 'Male' || className === 'Female' )
            {
                addNewPerson( className.charAt( 0 ), personName[ 0 ].split( '&' ).join( ' ' ), personName[ 1 ] );
            }
        }
        else if( values.length === 3 && statement === 'ObjectPropertyAssertion' )
        {
            var propName    = values[ 0 ].substring( 1 );
            var propPersons = [];

            
            for( var j = 1; j < 3; j++ )
            {
                var personName = values[ j ].substring( 1 ).split( ',' );

                if( personName.length !== 2)
                {
                    break;
                }

                propPersons.push( {
                    firstName   : personName[ 0 ].split( '&' ).join( ' ' ),
                    lastName    : personName[ 1 ]
                } );
            }

            if( propPersons.length === 2 && ( propName === 'hasDaughter' || propName === 'hasSon' ) )
            {
                addNewRelation( propName, propPersons );
            }
        }
    }

    updateSelectLists();
    cleanForm();
    checkListEmptiness();
}

function updateSelectLists() {
    $( 'select[id^="person-parent"] option:not([data-person-id="-1"])' ).remove();

    for( var k = 0; k < persons.length; k++ )
    {
        $( '<option/>' ).attr( 'data-person-id', persons[ k ].id ).text( persons[ k ].firstName + ' ' + persons[ k ].lastName ).prependTo( $( 'select#person-parent-' + persons[k].sex ) );
    }
}

function saveData() {
    var filename = prompt( 'Proszę wpisać nazwę pliku:', '' );
    if( filename !== null )
    {
        var data        = getAllRelationships();
        var encodedData = encodeURIComponent( data );
        var link        = document.createElement( 'a' );

        filename += '.genotology.txt';
        link.setAttribute( 'href', 'data:,' + encodedData );
        link.setAttribute( 'download', filename );
        document.body.appendChild( link );
        link.click();
        document.body.removeChild( link );
    }
}

function checkListEmptiness() {
    if( persons.length === 0 && $( '#list-of-persons > li' ).length === 0 )
    {
        $( '#list-empty' ).show();
        $( '#save-data-box' ).hide();
    }
    else
    {
        $( '#list-empty' ).hide();
        $( '#save-data-box' ).show();
    }
}

function cleanForm() {
    $( '#add-person-form input' ).val( '' );
    $( '#person-sex option[data-person-sex="M"], select[id^="person-parent"] option[data-person-id="-1"]' ).prop( 'selected', true );
    $( '#person-first-name' ).focus();
}

function attachClicks() {   
    $( '#open-file' ).click( function() {
        $( '#open-file-input' ).trigger( 'click' );
    } );

    $( '#add-person' ).click( function() {
        $( this ).hide();    
        $( '#add-person-form' ).show();
    } );

    $( '#list-of-persons' ).on( 'click', '.person', function() {
            getPersonDetails( parseInt( $( this ).attr( 'data-person-id') ) );
        }
    );

    $( '#save-data' ).click( saveData )

    $( '#save-person' ).click( addPersonFromInput );

    $( '#person-first-name, #person-last-name' ).keypress( function( e ) {
        if( e.keyCode === 13 )
        {
            addPersonFromInput();
        }
    } );
}

function onFileInput() {
    $( '#open-file-input' ).change( function( event ) {
        var file    = event.target.files[ 0 ];
        var fr      = new FileReader(); 

        if ( !file )
        {
            return;
        }

        fr.onload = function( e ) {
            handleInputData( e.target.result );
        }
        fr.readAsText( file );
    } );


}

$( function() {
    onFileInput();
    attachClicks();
} );