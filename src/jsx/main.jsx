// window.onbeforeunload = function() {
//     return '';
// }

getRealOffsetTop = ( offsetTop ) => {
    if( offsetTop > globals.headerHeight.static )
    {
        return offsetTop - globals.headerHeight.fixed;
    }

    return offsetTop;
}

swap = ( arr, i, j ) => {
    let tempVal;

    tempVal  = arr[ i ];
    arr[ i ] = arr[ j ];
    arr[ j ] = tempVal;

    return arr;
}

shuffle = ( arr ) => {
    let currentIndex = arr.length, tempVal, randomIndex;

    if( currentIndex === 2 && Math.random() > 0.5 )
    {
        swap( arr, 0, 1 );
    }
    else if( currentIndex > 2 )
    {
        while( 0 !== currentIndex )
        {
            randomIndex = Math.floor( Math.random() * currentIndex );
            currentIndex -= 1;

            swap( arr, currentIndex, randomIndex );
        }
    }

    return arr;
}

merge = ( arr, p, q, r, aaa ) => {
    const t = [];

    for( let kk = p; kk <= r; kk++ )
    {
        t[ kk ] = arr[ kk ];
    }

    let i = p, j = q + 1, k = p;

    while( i <= q && j <= r )
    {
        if( t[ i ].value <= t[ j ].value )
        {
            arr[ k++ ] = t[ i++ ];
        }
        else
        {
            arr[ k++ ] = t[ j++ ];
        }
    }

    while( i <= q )
    {
        arr[ k++ ] = t[ i++ ];
    }

    return arr;
}

longestCommonSubsequence = ( str1, str2 ) => {
    const lArr = new Array( str1.length + 1 );

    for( let i1 = 0; i1 <= str1.length; i1++ )
    {
        lArr[ i1 ] = new Array( str2.length + 1 ).fill( 0 );
    }

    for( let i1 = 1; i1 <= str1.length; i1++ )
    {
        for( let i2 = 1; i2 <= str2.length; i2++ )
        {
            if( str1.charAt( i1 - 1 ) ===  str2.charAt( i2 - 1 ) )
            {
                lArr[ i1 ][ i2 ] = lArr[ i1 - 1 ][ i2 - 1 ] + 1;
            }
            else
            {
                lArr[ i1 ][ i2 ] = Math.max( lArr[ i1 ][ i2 - 1 ], lArr[ i1 - 1 ][ i2 ] );
            }
        }
    }

    backtrack = ( arr, s1, s2, i, j ) => {
        if( i - 1 < 0 || j - 1 < 0 )
        {
            return '';
        }
        else if( s1[ i - 1 ] === s2[ j - 1 ] )
        {
            return backtrack( arr, s1, s2, i - 1, j - 1 ) + s1[ i - 1 ];
        }
        else if( arr[ i ][ j - 1 ] > arr[ i - 1 ][ j ] )
        {
            return backtrack( arr, s1, s2, i, j - 1 );
        }

        return backtrack( arr, s1, s2, i - 1, j );
    }

    return backtrack( lArr, str1, str2, str1.length, str2.length );
}

longestCommonSubstring = ( str1, str2 ) => {
    const lArr = Array( str1.length );
    let z      = 0;
    let lcs    = '';

    for( let i1 = 0; i1 < str1.length; i1++ )
    {
        lArr[ i1 ] = new Array( str2.length ).fill( 0 );
    }

    for( let i = 0; i < str1.length; i++ )
    {
        for( let j = 0; j < str2.length; j++ )
        {
            if( str1[ i ] === str2[ j ] )
            {
                if( i === 0 || j === 0 )
                {
                    lArr[ i ][ j ] = 1
                }
                else
                {
                    lArr[ i ][ j ] = lArr[ i - 1 ][ j - 1 ] + 1;
                }

                const str1str2 = str1.substring( i - z, i + 1 );

                if( lArr[ i ][ j ] > z )
                {
                    z   = lArr[ i ][ j ];
                    lcs = str1str2;
                }
                else if( lArr[ i ][ j ] === z )
                {
                    lcs += str1str2;
                }
            }
        }
    }

    return lcs;
}

mergeSort = ( arr, p, r ) => {
    if( p < r )
    {
        const q = Math.floor( ( p + r ) / 2 );
        arr = mergeSort( arr, p, q );
        arr = mergeSort( arr, q + 1, r );

        return merge( arr, p, q, r );
    }

    return arr;
}

editDistance = ( str1, str2 ) => {
    const dist    = [];
    const str1len = str1.length + 1;
    const str2len = str2.length + 1;

    for( let i1 = 0; i1 < str1len; i1++ )
    {
        dist.push( [ i1 ] );

        for( let i2 = 1; i2 < str2len; i2++ )
        {
            const v = ( i1 > 0 ) ? 0 : i2;

            dist[ i1 ].push( v );
        }
    }

    for( let i2 = 1; i2 < str2len; i2++ )
    {
        for( let i1 = 1; i1 < str1len; i1++ )
        {
            if( str1[ i1 - 1 ] === str2[ i2 - 1 ] )
            {
                dist[ i1 ][ i2 ] = dist[ i1 - 1 ][ i2 - 1 ];
            }
            else
            {
                dist[ i1 ][ i2 ] = Math.min(
                    dist[ i1 - 1 ][ i2 ] + 1,
                    dist[ i1 ][ i2 - 1 ] + 1,
                    dist[ i1 - 1 ][ i2 - 1 ] + 1,
                );
            }
        }
    }

    return dist[ str1len - 1 ][ str2len - 1 ];
}

insertQuotes = ( str ) => {
    return str.replace( /,,/g, '\u201e' ).replace( /''/g, '\u201d' );
}

insertNbsp = ( str ) => {
    return str.replace( /(^|\s)\w\s/g, ( match, offset, string ) => {
        const end = ( match.length > 2) ? 2 : 1;

        return match.substring( 0, end ) + '\u00a0';
    } );
}

insertNdash = ( str ) => {
    return str.replace( /\-\-/g, '\u2013' );
}

insertLinks = ( string ) => {
    return string.split( /(\[.*?\]\(.*?\))/gi ).map( ( chunk, index ) => {
        if( chunk.indexOf( '[' ) === 0 && chunk.lastIndexOf( ')' ) === chunk.length - 1 )
        {
            const linkHref = chunk.substring( 1, chunk.lastIndexOf( ']' ) );
            const linkName = chunk.substring( chunk.indexOf( '(' ) + 1, chunk.length - 1 );
            return <a key={ index } target="_blank" href={ linkHref }>{ linkName }</a>;
        }

        return chunk;
    } );
}

parseText = ( string ) => {
    const chunks = [];

    string = insertQuotes( string );
    string = insertNbsp( string );
    string = insertNdash( string );

    return string.split( /(\*\*[^\*]*\*\*)/gi ).map( ( chunk, index ) => {
        if( chunk.indexOf( '\\\*\\\*' ) !== -1 )
        {
            chunk = chunk.replace( /\\\*\\\*/g, '**' );
        }

        chunk = insertLinks( chunk );
        chunk = chunk.map( ( smallerChunk, smallerChunkIndex ) => {
            const jsxElem  = ( typeof smallerChunk !== 'string' );
            const childStr = jsxElem ? smallerChunk.props.children : smallerChunk;

            if( childStr.indexOf( '**' ) === 0 && childStr.lastIndexOf( '**' ) === childStr.length - 2 )
            {
                const jsxChildElem = <span key={ smallerChunkIndex } className="text-important">{ childStr.substring( 2, smallerChunk.length - 2 ) }</span>

                return jsxElem ? {
                    ...jsxElem,
                    props : {
                        ...jsxElem.props,
                        children : jsxChildElem
                    }
                } : jsxChildElem
            }

            return smallerChunk;
        } );

        return chunk;
    } );
}

getRandomString = () => {
    return Math.random().toString( 36 ).substring( 2 );
}

getParameterByName = ( name, url ) => {
    if( !url )
    {
        url = window.location.href;
    }

    name = name.replace( /[\[\]]/g, '\\$&' );

    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);

    if( !results )
    {
        return null;
    }

    if( !results[ 2 ] )
    {
        return '';
    }

    return decodeURIComponent( results[ 2 ].replace( /\+/g, ' ' ) );
}

removeScenario = ( scenarios, type ) => {
    return scenarios.filter( scenario => {
        return scenario.tasks.filter( task => task.type === type ).length === 0;
    } );
}

const globals = {
    emailRegex     : /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/,
    headerHeight   : {
        static : 256,
        fixed  : 35
    },
    maxLength      : {
        input    : 64,
        textarea : 255
    },
    backURI        : ( window.location.host === ( 'front.mgr' || 'localhost' || '127.0.0.1' ) ? 'https://back.mgr' : 'https://data-entry-handler.herokuapp.com' ),
    dev            : getParameterByName( 'dev' ) !== null
}

window.onload = function() {
    document.onkeydown = event => {
        event = event || window.event;

        if( event.key === 'ArrowUp' || event.key === 'ArrowDown' )
        {
            return false;
        }
    };

    class Main extends React.Component {
        constructor( props )
        {
            super( props );

            this.handleFormChange     = this.handleFormChange.bind( this );
            this.handleScroll         = this.handleScroll.bind( this );
            this.handleStart          = this.handleStart.bind( this );
            this.handleFinish         = this.handleFinish.bind( this );
            this.handleScenarioFinish = this.handleScenarioFinish.bind( this );
            this.backToTop            = this.backToTop.bind( this );
            this.state                = {
                error                : null,
                isLoaded             : false,
                headerFixed          : false,
                testStarted          : false,
                testFinished         : false,
                scenarios            : [],
                currentScenarioIndex : 1,
                allScenariosFinished : false,
                dataSent             : false,
                form                 : {
                    error : false,
                    data  : [
                        {
                            type        : 'mask',
                            label       : 'Twój rok urodzenia',
                            id          : 'birthYear',
                            regex       : /^\d{4}$/,
                            mask        : '9999',
                            maxLength   : 4
                        },
                        {
                            type        : 'radio',
                            label       : 'Twoja płeć',
                            id          : 'sex',
                            options     : [ 'Mężczyzna', 'Kobieta' ]
                        },
                        {
                            type        : 'select',
                            label       : 'Twoje wykształcenie',
                            id          : 'education',
                            options     : [ 'Podstawowe lub gimnazjalne', 'Średnie', 'Wyższe' ]
                        },
                        {
                            type        : 'select',
                            label       : 'Twój zawód',
                            id          : 'job',
                            options     : [ 'Bezrobotny', 'Ekonomista', 'Informatyk', 'Lekarz', 'Pedagog', 'Pracownik biurowy', 'Prawnik', 'Student', 'Uczeń', 'Inny (jaki?)' ],
                            otherOption : true
                        },
                        {
                            type        : 'select',
                            label       : 'Jak często przeglądasz strony WWW?',
                            id          : 'frequency',
                            options     : [ '1 raz dziennie lub więcej', '1 raz w tygodniu lub więcej', 'Rzadziej niż 1 raz w tygodniu lub sporadycznie', 'Trudno powiedzieć' ]
                        },
                        {
                            type        : 'select',
                            label       : 'Główny powód, dla którego przeglądasz strony WWW',
                            id          : 'mainReason',
                            options     : [ 'Lektura wiadomości i artykułów w serwisach informacyjnych, branżowych lub specjalistycznych', 'Hobby', 'Kontakt ze znajomymi', 'Nauka', 'Praca', 'Rozrywka', 'Szybkie wyszukiwanie informacji', 'Zakupy online', 'Inny (jaki?)' ],
                            otherOption : true
                        },
                        {
                            type        : 'radio',
                            label       : 'Czy prawidłowe wypełnianie formularzy na stronach WWW jest dla Ciebie czymś trudnym?',
                            id          : 'difficulties',
                            options     : [ 'Tak', 'Nie' ]
                        },
                        {
                            type        : 'radio',
                            label       : 'Czy, Twoim zdaniem, formularze na stronach WWW są odpowiednio zaprojektowane?',
                            id          : 'usability',
                            options     : [ 'Tak', 'Nie', 'Trudno powiedzieć' ]
                        },
                        {
                            type        : 'textarea',
                            label       : 'Czy którakolwiek z zaprezentowanych metod wprowadzania danych była dla Ciebie wyjątkowo uciążliwa lub niepraktyczna?',
                            id          : 'comment',
                            optional    : true,
                            value       : ''
                        }
                    ]
                },
                output : {
                    test : {
                        startTime : 0,
                        endTime   : 0,
                        scenarios : []
                    },
                    user : {}
                }
            }

            this.childNodeRef = child => {
                window.scrollTo( 0, getRealOffsetTop( child.offsetTop ) );
            }
        }

        getTestVersion()
        {
            return fetch( globals.backURI + '?do=get&what=count' ).then(
                res => res.json()
            ).then( response => {
                let count;

                for( let k = 0; k < response.length; k++ )
                {
                    if( typeof response[ k ].count !== 'undefined' )
                    {
                        count = response[ k ].count;
                        break;
                    }
                }

                if( count.A > count.B )
                {
                    return 'B';
                }
                else if( count.B > count.A )
                {
                    return 'A';
                }

                return ( ( Math.random() > 0.5 ) ? 'A' : 'B' );
            } ).catch( error => {
                console.error( error );

                return false;
            } );
        }

        getIPAddress()
        {
            return fetch( 'https://api.ipify.org/?format=json' ).then(
                res => res.json()
            ).then( response => {
                if( typeof response.ip !== 'undefined' )
                {
                    return response.ip;
                }

                return false;
            } ).catch( error => {
                return false;
            } );
        }

        loadTest( version )
        {
            const fileURI = './json/test-' + version + '.json';

            fetch( fileURI ).then(
                res => res.json()
            ).then( result => {
                this.setState( oldState => {
                    const newState = {
                        ...oldState,
                        scenarios : shuffle( result.scenarios ),
                        isLoaded  : true,
                        output    : {
                            ...oldState.output,
                            test : {
                                ...oldState.output.test,
                                version : version
                            }
                        }
                    }

                    const isChrome           = ( navigator.userAgent.toLowerCase().indexOf( 'opr' ) === -1 ) && !!window.chrome && ( !!window.chrome.webstore || !!window.chrome.runtime );
                    const noSpeechRecogniton = !( isChrome && window.hasOwnProperty( 'webkitSpeechRecognition' ) );
                    const noGeolocation      = !( 'geolocation' in navigator );

                    if( noSpeechRecogniton )
                    {
                        newState.scenarios = removeScenario( newState.scenarios, 'speech-recognition' );
                    }

                    if( noGeolocation )
                    {
                        newState.scenarios = removeScenario( newState.scenarios, 'geolocation' );
                    }

                    if( noSpeechRecogniton || noGeolocation )
                    {
                        const alertMsg = 'Przeglądarka internetowa, której właśnie używasz, nie posiada funkcjonalności' + ( noSpeechRecogniton || noGeolocation ? ' ' : '' ) + ( noSpeechRecogniton ? 'rozpoznawania mowy' : '' ) + ( noSpeechRecogniton && noGeolocation ? ' i ' : '' ) + ( noGeolocation ? 'pobierania lokalizacji użytkownika' : '' ) + ( !noSpeechRecogniton || !noGeolocation ? ' wykorzystywanej ' : ' wykorzystywanych ' )  + 'w części ćwiczeń. Jeśli istnieje taka możliwość, uruchom, proszę, tę stronę w przeglądarce Google Chrome -- możesz ją pobrać [https://www.google.com/intl/pl/chrome/](tutaj).';

                        newState.alert = {
                            type : 'warning',
                            msg  : alertMsg
                        }
                    }

                    return newState;
                }, () => {
                    window.addEventListener( 'scroll', this.handleScroll );

                    // ONLY FOR DEVELOPMENT
                    // this.handleStart();
                } );
            }, error => {
                this.setState( {
                    isLoaded : false,
                    error
                } );
            } );
        }

        componentDidMount()
        {
            this.getIPAddress().then( ip => {
                if( ip )
                {
                    this.setState( state => {
                        return {
                            ...state,
                            output    : {
                                ...state.output,
                                user : {
                                    ...state.output.user,
                                    ip : ip
                                }
                            }
                        }
                    } );
                }
            } );

            if( !globals.dev )
            {
                this.getTestVersion().then( version => {
                    if( version !== false )
                    {
                        console.log( 'Chosen version of the test: ' + version );
                        this.loadTest( version );
                    }
                } );
            }
            else
            {
                const searchValue = getParameterByName( 'ver' );
                const version     = ( ( searchValue === 'A' || searchValue === 'B' || searchValue === 'dev' ) ? searchValue : 'A' )

                this.loadTest( version );
            }
        }

        backToTop()
        {
            window.scrollTo( 0, 0 );
        }

        handleScroll()
        {
            if( window.scrollY > globals.headerHeight.static )
            {
                this.setState( {
                    headerFixed : true
                } );
            }
            else
            {
                this.setState( {
                    headerFixed : false
                } );
            }
        }

        handleFormChange( input )
        {
            if( this.state.allScenariosFinished && !this.state.testFinished )
            {
                this.setState( state => {
                    const data = state.form.data.map( ( item, itemIndex ) => {
                        if( itemIndex === input.index )
                        {
                            return {
                                ...item,
                                valid : input.valid,
                                value : input.value
                            };
                        }

                        return item;
                    } );

                    return {
                        ...state,
                        form : {
                            ...state.form,
                            data
                        }
                    };
                }, () => {
                    if( this.state.form.data.filter( item => !item.optional && !item.valid ).length === 0 )
                    {
                        this.setState( state => {
                            return {
                                ...state,
                                form : {
                                    ...state.form,
                                    error : false
                                }
                            };
                        } );
                    }
                } );
            }
        }

        handleStart()
        {
            if( !this.state.testStarted )
            {
                this.setState( state => {
                    return {
                        ...state,
                        testStarted : true,
                        output      : {
                            ...state.output,
                            test : {
                                ...state.output.test,
                                startTime : new Date().getTime()
                            }
                        }
                    }
                } );
            }
        }

        handleScenarioFinish( scenario )
        {
            let { index, ...data } = scenario;

            if( this.state.testStarted && this.state.currentScenarioIndex === index )
            {
                this.setState( state => {
                    const scenarios = state.output.test.scenarios;
                    scenarios.push( data );

                    return {
                        ...state,
                        output : {
                            ...state.output,
                            test : {
                                ...state.output.test,
                                scenarios
                            }
                        }
                    }
                } );

                if( this.state.currentScenarioIndex === this.state.scenarios.length )
                {
                    this.setState( {
                        allScenariosFinished : true
                    } );
                }
                else
                {
                    this.setState( {
                        currentScenarioIndex : this.state.currentScenarioIndex + 1
                    } );
                }
            }
        }

        handleFinish()
        {
            if( this.state.allScenariosFinished && !this.state.testFinished )
            {
                if( this.state.form.data.filter( input => !input.valid && !input.optional ).length > 0 )
                {
                    this.setState( state => {
                        return {
                            ...state,
                            form : {
                                ...state.form,
                                error : true
                            }
                        };
                    } );
                }
                else
                {
                    this.setState( state => {
                        return {
                            ...state,
                            testFinished : true,
                            output      : {
                                ...state.output,
                                test : {
                                    ...state.output.test,
                                    endTime : new Date().getTime()
                                }
                            }
                        }
                    }, () => {
                        let output   = this.state.output;
                        let userData = output.user;

                        for( let k = 0; k < this.state.form.data.length; k++ )
                        {
                            const input = this.state.form.data[ k ];
                            userData[ input.id ] = input.value;
                        }

                        output = {
                            ...output,
                            user : userData
                        };

                        if( globals.dev )
                        {
                            console.log( output );
                        }

                        fetch( globals.backURI + '/?do=send&what=data', {
                            method  : 'POST',
                            body    : JSON.stringify( output ),
                            headers : {
                                'Content-Type' : 'application/json'
                            }
                        } ).then(
                            res => res.json()
                        ).then( response => {
                            if( globals.dev )
                            {
                                console.log( 'fetch()', response )
                            }
                        } ).catch( error => {
                            console.error( error );
                        } ).then( () => {
                            this.setState( {
                                dataSent : true
                            } );
                        } );
                    } );
                }
            }
        }

        render()
        {
            const { error, isLoaded, scenarios } = this.state;

            if( error )
            {
                return <div>Error: { error.message }</div>;
            }
            else if( !isLoaded )
            {
                return <Loader display={ true } big={ true } alignCenter={ true } />;
            }
            else
            {
                return (
                    <div className={ this.state.headerFixed ? "header-fixed" : undefined } id="page-container">
                        <header>
                            <p>
                                <span>Badanie użyteczności</span>
                                { this.state.headerFixed &&
                                    <span>
                                        { !this.state.allScenariosFinished &&
                                            "scenariusz " + this.state.currentScenarioIndex + "/" + this.state.scenarios.length

                                        }
                                        { this.state.allScenariosFinished &&
                                            "podsumowanie"
                                        }
                                    </span>
                                }
                                { this.state.headerFixed &&
                                    <i className="material-icons" onClick={ this.backToTop }>
                                        arrow_upward
                                    </i>
                                }
                            </p>
                        </header>
                        <main>
                            <section>
                                <Paragraph content="Witaj! Niniejsze badanie jest częścią mojej pracy dyplomowej i ma na celu zbadanie użyteczności wybranych wzorców pól, które możesz na co dzień znaleźć w wielu aplikacjach webowych i na stronach internetowych." />
                                <Paragraph content="**Co będziesz robił?** Zostaniesz poproszony(-a) o wykonanie kilkunastu ćwiczeń polegających na uzupełnieniu różnego typu formularzy.\n**Ile to potrwa?** Jeśli korzystanie z klawiatury nie jest dla Ciebie wyzwaniem, to przejście przez wszystkie etapy badania powinno zająć nie więcej niż 15 min Twojego cennego czasu.\n**Czy będę musiał(-a) podawać jakieś dane?** Absolutnie nie!* Potraktuj to badanie jako pewnego rodzaju zabawę. Każde ćwiczenie poprzedzone jest tabelą zawierającą nazwy pól w formularzu i dane, którymi te pola powinny zostać uzupełnione -- Ty zaś będziesz mógł/mogła się na tym, aby wstawić te informacje we właściwe miejsca!\n**Na co mam zwrócić uwagę?** Odstępy, znaki pisarskie, interpunkcyjne są niezwykle istotne w tym badaniu. Ćwiczenie jest uznane za poprawnie rozwiązane wtedy i tylko wtedy, gdy wprowadzone dane odpowiadają danym wzorcowym.\n**Ctrl+C, Ctrl+V? Nie tutaj!** Kopiowanie danych z tabeli poprzedzającej ćwiczenie jest zablokowane. Jasne jest, że przy odrobinie sprytu i wiedzy z dziedziny informatyki był(a)byś w stanie to zrobić, jednak nie rób tego, proszę. Celem tego badania jest zebranie relewantnych i wiarygodnych danych, które będę mógł przedstawić w swojej pracy, a będzie to możliwe tylko wtedy, gdy wszystkie pola wypełnisz ręcznie.\n**Twoja opinia ma znaczenie.** Po każdym ćwiczeniu będziesz miał(a) możliwość pozostawienia komentarza odnoszącego się do właśnie wypróbowanej metody wprowadzania danych. Komentarz nie jest obowiązkowy, jednak dzięki niemu będę mógł poznać Twój punkt widzenia." />
                                <Paragraph content="**Wszystko jasne?** Naciśnij przycisk ,,Rozpocznij badanie'', aby zmierzyć się ze stojącym przed Tobą wyzwaniem!" />
                                <Paragraph class="text-smaller" content="*) Badanie kończy się ankietą użytkownika, w której podasz dane związane z Twoją osobą, m.in. rok urodzenia, wykształcenie, zawód itd. Informacje te umożliwią przypisanie Twojej osoby pod względem uzyskanych wyników do poszczególnych grup całej populacji uczestników badania. Jeżeli masz jakieś uwagi, pytania lub sugestie związane z gromadzeniem tych danych, napisz do mnie na adres [mailto:krzysztof.radoslaw.osada@gmail.com](krzysztof.radoslaw.osada@gmail.com)."/>
                                { this.state.alert &&
                                    <Paragraph content={ this.state.alert.msg } class={ "alert " + this.state.alert.type } />
                                }
                                <button onClick={ this.handleStart } disabled={ this.state.testStarted }>Rozpocznij badanie</button>
                            </section>
                            { scenarios.map( ( scenario, index ) =>
                                <Scenario key={ index } index={ index + 1 } testStarted={ this.state.testStarted } currentIndex={ this.state.currentScenarioIndex } lastIndex={ this.state.scenarios.length } scenario={ scenario } onFinish={ this.handleScenarioFinish } nodeRef={ this.childNodeRef } />
                            ) }
                            { this.state.allScenariosFinished &&
                                <section ref={ this.childNodeRef }>
                                    <h1>Zakończenie</h1>
                                    <Paragraph content="Świetnie! **Właśnie zakończyłeś badanie użyteczności.** Zanim jednak zamkniesz tę kartę i wrócisz do swoich zajęć, wypełnij, proszę, poniższą ankietę -- podaj podstawowe informacje na swój temat* oraz podziel się odczuciami związanymi z formularzami na stronach internetowych." />
                                    <Paragraph class="text-smaller" content="*) **W badaniu nie są rejestrowane żadne informacje umożliwiające jednoznaczne zidentyfikowane danej osoby.** Celem niniejszej ankiety jest kategoryzacja uczestników badania według cech mogących mieć wpływ na szybkość, poprawność i dokładność wprowadzania danych w formularzach internetowych. Poniższe informacje pozwolą więc na dostrzeżenie zależności między wynikami uzyskanymi przez Ciebie w badaniu a parametrami dotyczącymi Twojego wykształcenia, wieku, Twoich doświadczeń ze stronami internetowymi itp. Jeżeli masz jakieś pytania lub uwagi związane z poniższą ankietą, wyślij do mnie wiadomość na adres  **krzysztof.radoslaw.osada@gmail.com.**" />
                                    <section className="form labels-align-top" id="user-form">
                                        <h3>Ankieta uczestnika</h3>
                                        {
                                            this.state.form.data.map( ( item, index ) =>
                                                <InputWrapper key={ index } index={ index } error={ this.state.form.error } disabled={ this.state.testFinished } onChange={ this.handleFormChange } { ...item }/>
                                            )
                                        }
                                        { this.state.form.error &&
                                            <Paragraph class="on-form-error" content="Aby przejść dalej, popraw pola wyróżnione **tym kolorem.**" />
                                        }
                                    </section>
                                    <button onClick={ this.handleFinish } disabled={ this.state.testFinished }>Wyślij</button>
                                    { this.state.testFinished &&
                                        <Loader nodeRef={ this.childNodeRef } display={ !this.state.dataSent }/>
                                    }
                                </section>
                            }
                            { this.state.testFinished && this.state.dataSent &&
                                <section ref={ this.childNodeRef }>
                                    <Paragraph content="**To już jest koniec!** Serdecznie dziękuję za udział w badaniu -- Twoja pomoc jest dla mnie naprawdę nieoceniona. Uzyskane przez Ciebie wyniki zostaną uwzględnione w części badawczej mojej pracy dyplomowej ,,Badanie użyteczności metod wprowadzania danych w aplikacjach webowych'', którą piszę pod kierunkiem dr. hab. inż. Bogdana Trawińskiego, prof. PWr." />
                                </section>
                            }
                        </main>
                    </div>
                );
            }
        }
    }

    ReactDOM.render(
        <Main />,
        document.getElementById( 'root' )
    );
};