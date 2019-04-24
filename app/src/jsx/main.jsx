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
    }
}

getRealOffsetTop = ( offsetTop ) => {
    if( offsetTop > globals.headerHeight.static )
    {
        return offsetTop - globals.headerHeight.fixed;
    }

    return offsetTop;
}

insertNbsp = ( str ) => {
    return str.replace( /(^|\s)\w\s/g, ( match, offset, string ) => {
        const end = ( match.length > 2) ? 2 : 1;

        return match.substring( 0, end ) + '\u00a0';
    } );
}

getRandomString = () => {
    return Math.random().toString( 36 ).substring( 2 );
}

extractTextImportant = ( string ) => {
    const chunks = [];

    string.split( /(\*\*[^\*]*\*\*)/gi ).map( ( chunk, index ) => {
        chunk = insertNbsp( chunk );

        if( chunk.indexOf( '**' ) !== -1 )
        {
            chunk = <span key={ index } className="text-important">{ chunk.substring( 2, chunk.length - 2 ) }</span>
        }

        chunks.push( chunk );
    } );

    return chunks;
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
                            options     : [ 'Uczeń', 'Student', 'Programista', 'Nauczyciel', 'Urzędnik', 'Bezrobotny', 'Inny (jaki?)' ],
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
                            optional    : true
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
            fetch( './json/test-2.json' )
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

                        fetch( 'https://back.mgr/?do=send&what=data', {
                            method  : 'POST',
                            body    : JSON.stringify( output ),
                            headers : {
                                'Content-Type' : 'application/json'
                            }
                        } )
                            .then( res  => res.json() )
                            .then( ( response ) => {
                                console.log( 'fetch()', response )
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
                                <Paragraph content="Witaj! Niniejsze badanie ma na celu zbadanie użyteczności wybranych wzorców pól, które możesz na co dzień znaleźć w wielu aplikacjach webowych i na stronach internetowych. Zostaniesz poproszony o wykonanie kilkunastu zadań polegających na uzupełnieniu różnego typu formularzy. **Ten tekst jeszcze się zmieni.**" />
                                <button onClick={ this.handleStart } disabled={ this.state.testStarted }>Rozpocznij badanie</button>
                            </section>
                            { scenarios.map( ( scenario, index ) =>
                                <Scenario key={ index } index={ index + 1 } testStarted={ this.state.testStarted } currentIndex={ this.state.currentScenarioIndex } lastIndex={ this.state.scenarios.length } scenario={ scenario } onFinish={ this.handleScenarioFinish } nodeRef={ this.childNodeRef } />
                            ) }
                            { this.state.allScenariosFinished &&
                                <section ref={ this.childNodeRef }>
                                    <h1>Zakończenie</h1>
                                    <Paragraph content="Tutaj będzie jakiś akapit podsumowujący, jednak na razie nie wiem, co by w nim mogło się znaleźć." />
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
                                </section>
                            }
                            { this.state.testFinished &&
                                <section ref={ this.childNodeRef }>
                                    <Paragraph content="**Serdecznie dziękuję za wzięcie udziału w badaniu!** Twoja pomoc jest naprawdę nieoceniona i przyczyni się do zrealizowania jednego z największych moich celów w życiu -- ukończenia studiów na Politechnice Wrocławskiej." />
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