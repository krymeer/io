// window.onbeforeunload = function() {
//     return '';
// }

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
    backURI        : ( window.location.host === ( 'front.mgr' || 'localhost' || '127.0.0.1' ) ? 'https://back.mgr' : 'https://data-entry-handler.herokuapp.com' )
}

getRealOffsetTop = ( offsetTop ) => {
    if( offsetTop > globals.headerHeight.static )
    {
        return offsetTop - globals.headerHeight.fixed;
    }

    return offsetTop;
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

parseText = ( string ) => {
    const chunks = [];

    string = insertQuotes( string );
    string = insertNbsp( string );
    string = insertNdash( string );

    string.split( /(\*\*[^\*]*\*\*)/gi ).map( ( chunk, index ) => {
        if( chunk.indexOf( '\\\*\\\*' ) !== -1 )
        {
            chunk = chunk.replace( /\\\*\\\*/g, '**' );
        }

        if( chunk.indexOf( '**' ) === 0 && chunk.lastIndexOf( '**' ) === chunk.length - 2 )
        {
            chunk = <span key={ index } className="text-important">{ chunk.substring( 2, chunk.length - 2 ) }</span>
        }

        chunks.push( chunk );
    } );

    return chunks;
}

getRandomString = () => {
    return Math.random().toString( 36 ).substring( 2 );
}

window.onload = function() {
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
                            type        : 'text',
                            label       : 'Twoje imię',
                            id          : 'firstName',
                            maxLength   : 32
                        },
                        {
                            type        : 'text',
                            label       : 'Twój adres e-mail',
                            id          : 'email',
                            regex       : globals.emailRegex,
                            maxLength   : 128
                        },
                        {
                            type        : 'text',
                            label       : 'Twój rok urodzenia',
                            id          : 'birthYear',
                            regex       : /^\d{4}$/,
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
                            options     : [ 'Podstawowe', 'Gimnazjalne', 'Zasadnicze zawodowe', 'Zasadnicze branżowe', 'Średnie branżowe', 'Średnie', 'Wyższe', 'Inne (jakie?)' ],
                            otherOption : true
                        },
                        {
                            type        : 'select',
                            label       : 'Twój zawód',
                            id          : 'job',
                            options     : [ 'Bezrobotny', 'Dziennikarz', 'Ekonomista', 'Inżynier', 'Lekarz', 'Pedagog', 'Pracownik biurowy', 'Programista', 'Student', 'Uczeń', 'Urzędnik', 'Inny (jaki?)' ],
                            otherOption : true
                        },
                        {
                            type        : 'select',
                            label       : 'Jak często przeglądasz strony WWW?',
                            id          : 'frequency',
                            options     : [ 'Kilka razy dziennie', 'Raz dziennie', 'Co kilka dni', 'Raz w tygodniu', 'Sporadycznie', 'Trudno powiedzieć' ]
                        },
                        {
                            type        : 'select',
                            label       : 'Główny powód, dla którego przeglądasz strony WWW',
                            id          : 'mainReason',
                            options     : [ 'Praca', 'Rozrywka', 'Kontakt ze znajomymi', 'Nauka', 'Zakupy online', 'Inny (jaki?)' ],
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
                            label       : 'Czy Twoim zdaniem formularze na stronach WWW są odpowiednio zaprojektowane?',
                            id          : 'usability',
                            options     : [ 'Tak', 'Nie', 'Trudno powiedzieć' ]
                        },
                        {
                            type        : 'textarea',
                            label       : 'Twój komentarz',
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

        componentDidMount()
        {
            fetch( './json/test-1.json' )
                .then( res => res.json() )
                .then( ( result ) => {
                        this.setState( {
                            scenarios : result.scenarios,
                            isLoaded  : true
                        }, () => {
                            window.addEventListener( 'scroll', this.handleScroll );
                        } );
                    }, ( error ) => {
                        this.setState( {
                            isLoaded : false,
                            error
                        } );
                    } );
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
                    if( this.state.form.data.filter( item => !item.valid ).length === 0 )
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
                        let userData = {};

                        for( let k = 0; k < this.state.form.data.length; k++ )
                        {
                            const input = this.state.form.data[ k ];
                            userData[ input.id ] = input.value;
                        }

                        output = {
                            ...output,
                            user : userData
                        };

                        console.log( output );

                        fetch( globals.backURI + '/?do=send&what=data', {
                            method  : 'POST',
                            body    : JSON.stringify( output ),
                            headers : {
                                'Content-Type' : 'application/json'
                            }
                        } )
                            .then( res  => res.json() )
                            .then( ( response ) => {
                                console.log( 'fetch()', response )
                            }, ( error ) => {
                                console.error( error );
                            } )
                            .then( () => {
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
                return "";
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
                                <Paragraph content="**Co będziesz robił?** Zostaniesz poproszony(-a) o wykonanie kilkunastu ćwiczeń polegających na uzupełnieniu różnego typu formularzy.\n**Ile to potrwa?** Jeśli korzystanie z klawiatury nie jest dla Ciebie wyzwaniem, to przejście przez wszystkie etapy badania powinno zająć nie więcej niż 15 min Twojego cennego czasu.\n**Czy będę musiał(-a) podawać jakieś dane?** Absolutnie nie!* Potraktuj to badanie jako pewnego rodzaju zabawę. Każde ćwiczenie poprzedzone jest tabelą zawierającą nazwy pól w formularzu i dane, którymi te pola powinny zostać uzupełnione -- Ty zaś będziesz mógł/mogła się na tym, aby wstawić te informacje we właściwe miejsca!\n**Na co mam zwrócić uwagę?** Odstępy, znaki pisarskie, interpunkcyjne są niezwykle istotne w tym badaniu. Ćwiczenie jest uznane za poprawnie rozwiązane wtedy i tylko wtedy, gdy wprowadzone dane odpowiadają danym wzorcowym.\n**Ctrl+C, Ctrl+V? Nie tutaj!** Kopiowanie danych z tabeli poprzedzającej ćwiczenie jest zablokowane. Jasne jest, że przy odrobinie sprytu i wiedzy z dziedziny informatyki był(a)byś w stanie to zrobić, jednak nie rób tego, proszę. Celem tego badania jest zebranie relewantnych i wiarygodnych danych, które będę mógł przedstawić w swojej pracy, a będzie to możliwe tylko wtedy, gdy wszystkie pola wypełnisz ręcznie.\n**Nie musisz być gadatliwy.** Po każdym ćwiczeniu będziesz miał(a) możliwość pozostawienia komentarza. Nie jednak na siłę -- możesz pozostawić takie pole bez treści i po prostu przejść dalej." />
                                <Paragraph content="**Wszystko jasne?** Naciśnij przycisk ,,Rozpocznij badanie'', aby zmierzyć się ze stojącym przed Tobą wyzwaniem!" />
                                <Paragraph class="text-smaller" content="*) Badanie kończy się ankietą użytkownika, w której podasz pewne dane osobowe (imię, adres e-mail, rok urodzenia itd.). Bez obaw -- **informacje te nie zostaną przekazane osobom trzecim,** a ich gromadzenie wynika wyłącznie z potrzeby identyfikacji użytkowników oraz konieczności zbudowania statystyk. Twoje dane zostaną usunięte niezwłocznie po zamknięciu badania użyteczności i ukończeniu przeze mnie pracy dyplomowej.\n**Masz dodatkowe pytania?** Skontaktuj się ze mną -- mój adres e-mail to **krzysztof.radoslaw.osada@gmail.com.**"/>
                                <button onClick={ this.handleStart } disabled={ this.state.testStarted }>Rozpocznij badanie</button>
                            </section>
                            { scenarios.map( ( scenario, index ) =>
                                <Scenario key={ index } index={ index + 1 } testStarted={ this.state.testStarted } currentIndex={ this.state.currentScenarioIndex } lastIndex={ this.state.scenarios.length } scenario={ scenario } onFinish={ this.handleScenarioFinish } nodeRef={ this.childNodeRef } />
                            ) }
                            { this.state.allScenariosFinished &&
                                <section ref={ this.childNodeRef }>
                                    <h1>Zakończenie</h1>
                                    <Paragraph content="Gratulacje! **Udało Ci się ukończyć badanie użyteczności.** Zanim zamkniesz tę kartę i wrócisz do swoich zajęć, wypełnij, proszę, poniższą ankietę -- podaj podstawowe informacje na swój temat\*\* oraz podziel się odczuciami związanymi z formularzami na stronach internetowych." />
                                    <Paragraph class="text-smaller" content="\*\*) Administratorem danych osobowych jestem ja -- Krzysztof Osada. Informacje na Twój temat **nie zostaną** przekazane osobom trzecim i posłużą jedynie w celach identyfikacyjnych oraz statystycznych. Wprowadzone poniżej dane zostaną usunięte z bazy danych niezwłocznie po tym, gdy przestaną być potrzebne, tj. **nie później** niż po ukończeniu przeze mnie kursu ,,Praca dyplomowa II''. Jeśli masz jakieś pytania, uwagi bądź wątpliwości, skontaktuj się ze mną -- mój adres e-mail to **krzysztof.radoslaw.osada@gmail.com.**" />
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
                                    <Paragraph content="**To już jest koniec!** Serdecznie dziękuję za udział w badaniu -- Twoja pomoc jest dla mnie naprawdę nieoceniona. Na podany wyżej adres e-mail otrzymasz **automatycznie wygenerowaną** wiadomość będącą potwierdzeniem zapisania Twoich danych i wyników badania przez aplikację." />
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