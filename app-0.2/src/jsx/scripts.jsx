// window.onbeforeunload = function() {
//     return '';
// }

window.onload = function() {
    insertNbsp = ( str ) => {
        return str.replace( /(?<=(\s|>)\w)\s/g, '\u00a0' );
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

    class Paragraph extends React.Component {
        constructor( props )
        {
            super( props );
        }

        render()
        {
            return (
                <p className={ typeof this.props.class !== 'undefined' ? this.props.class : undefined }>
                    { extractTextImportant( this.props.content ) }
                </p>
            );
        }
    }

    class InputWrapper extends React.Component {
        constructor( props )
        {
            super( props );

            this.handleFocus  = this.handleFocus.bind( this );
            this.handleBlur   = this.handleBlur.bind( this );
            this.handleChange = this.handleChange.bind( this );
            this.state        = {
                inputFocus    : false,
                inputNonEmpty : false,
                inputValid    : false
            }
        }

        handleFocus( e )
        {
            this.setState( {
                inputFocus : true
            } );

            // TEMPORARY
            // This call is necessary when filling the inputs programmatically
            this.handleChange( e );
        }

        handleBlur( e )
        {
            this.setState( {
                inputFocus    : false,
                inputNonEmpty : ( e.target.value !== '' )
            } );
        }

        handleChange( e )
        {
            const inputValid = ( e.target.value === this.props.value );

            this.setState( {
                inputValid : inputValid
            } );

            this.props.onInputChange( this.props.index, inputValid )
        }

        render()
        {
            const wrapperClassName = ( 'wrapper' + ' ' + ( this.props.taskError ? 'on-task-error' : '' ) + ' ' + ( this.state.inputValid ? '' : 'on-input-invalid' ) ).trim().replace( /\s+/g, ' ' );
            const labelClassName   = ( ( this.props.inputDisabled ? 'on-input-disabled' : '' ) + ' ' + ( this.state.inputFocus ? 'on-input-focus' : '' ) + ' ' + ( this.state.inputNonEmpty ? 'on-input-non-empty' : '' ) ).trim().replace( /\s+/g, ' ' );

            return (
                <div className={ ( wrapperClassName !== '' ) ? wrapperClassName : undefined }>
                    <label className={ ( labelClassName !== '' ) ? labelClassName : undefined }>{ this.props.label }</label>
                    <input type="text" spellCheck="false" autoComplete="off" onFocus={ this.handleFocus } onBlur={ this.handleBlur } onChange={ this.handleChange } disabled={ this.props.inputDisabled } />
                </div>
            );
        }
    }

    class SEQ extends React.Component {
        constructor( props )
        {
            super( props );

            this.handleComment = this.handleComment.bind( this )
        }

        handleRating( k )
        {
            this.props.onRatingChange( k );
        }

        handleComment( e )
        {
            this.props.onCommentChange( e.target.value );
        }

        render()
        {
            return (
                <section className="seq" ref={ this.props.nodeRef }>
                    <h3>
                        Jaki jest, Twoim zdaniem, poziom trudności powyższego ćwiczenia?
                    </h3>
                    <ul className={ ( "seq-stars" + ' ' + ( this.props.disabled ? "disabled" : "" ) ).trim() }>
                        <li>bardzo trudne</li>
                        { [ ...Array( 5 ) ].map( ( x, key ) =>
                            <li className="seq-item" key={ key }>
                                <i className="material-icons" onClick={ this.handleRating.bind( this, key + 1 ) } disabled={ this.props.disabled }>
                                    { this.props.rating <= key &&
                                        'star_border'
                                    }
                                    { this.props.rating > key &&
                                        'star'
                                    }
                                </i>
                            </li>
                        ) }
                        <li>bardzo łatwe</li>
                    </ul>
                    { this.props.rating > 0 &&
                        <section className="comment">
                            <h4>
                                Czy masz jakieś uwagi lub sugestie związane z powyższym ćwiczeniem? *
                            </h4>
                            <textarea spellCheck="false" maxLength={ this.props.maxCommentLength } onChange={ this.handleComment } disabled={ this.props.disabled } />
                            <div>
                                <p className="note">
                                    Pozostało znaków: <span className="text-important">{ this.props.maxCommentLength - this.props.commentLength }</span>
                                </p>
                                <p className="note">
                                    * Pole opcjonalne
                                </p>
                            </div>
                        </section>
                    }
                </section>
            );
        }
    }

    class Task extends React.Component {
        constructor( props )
        {
            super( props );
            this.handleStart         = this.handleStart.bind( this );
            this.handleFinish        = this.handleFinish.bind( this );
            this.handleNext          = this.handleNext.bind( this );
            this.handleInputChange   = this.handleInputChange.bind( this );
            this.handleRatingChange  = this.handleRatingChange.bind( this );
            this.handleCommentChange = this.handleCommentChange.bind( this );
            this.maxCommentLength    = 255;
            this.tableRef            = React.createRef();
            this.nextTaskRef         = React.createRef();
            this.seqRef              = node => {
                window.scrollTo( 0, node.offsetTop );
            }
            this.state               = {
                taskStarted  : false,
                taskFinished : false,
                taskError    : false,
                nextTask     : false,
                stats        : {
                    rating  : 0,
                    comment : ''
                },
                inputs       : this.props.task.data.map( ( item ) => {
                    return {
                        valid : false,
                        key   : item.key,
                        value : item.value,
                    };
                } )
            }
        }

        handleStart()
        {
            if( !this.state.taskStarted && !this.state.taskFinished )
            {
                this.setState( {
                    taskStarted : true
                } );

                window.scrollTo( 0, this.tableRef.current.offsetTop );
            }
        }

        handleFinish()
        {
            if( this.state.taskStarted && !this.state.taskFinished )
            {
                if( this.state.inputs.filter( input => !input.valid ).length > 0 )
                {
                    this.setState( {
                        taskError : true
                    } );
                }
                else
                {
                    this.setState( {
                        taskError    : false,
                        taskFinished : true
                    } );
                }
            }
        }

        handleNext()
        {
            if( this.state.taskStarted && this.state.taskFinished )
            {
                // TODO
                // Send the data wherever you'd like to
                // Note: the comment has to be sanitized before send

                this.setState( {
                    nextTask : true
                } );

                this.props.onTaskFinish( this.props.index );
            }
        }

        handleRatingChange( k )
        {
            if( k !== this.state.rating )
            {
                this.setState( state => {
                    const stats = {
                        ...state.stats,
                        rating : k
                    }

                    return {
                        stats
                    };
                }, () => {
                    if( k > 0 )
                    {
                        window.scrollTo( 0, this.nextTaskRef.current.offsetTop );
                    }
                } );
            }
        }

        handleCommentChange( comment )
        {
            this.setState( state => {
                const stats = {
                    ...state.stats,
                    comment : comment
                }

                return {
                    stats
                };
            } );
        }

        handleInputChange( inputIndex, inputValid )
        {
            this.setState( state => {
                const inputs = state.inputs.map( ( input, index ) => {
                    if( inputIndex === index )
                    {
                        return {
                            ...input,
                            valid : inputValid
                        };
                    }

                    return input;
                } );

                return {
                    inputs
                };
            }, () => {
                if( this.state.inputs.filter( input => !input.valid ).length === 0 )
                {
                    this.setState( {
                        taskError : false
                    } );
                }
            } );
        }

        // TEMPORARY
        // Insert all the data by clicking only one button
        insertEverything( e )
        {
            const inputs = e.target.parentElement.querySelectorAll( 'input' );

            for( var k = 0; k < inputs.length; k++ )
            {
                inputs[ k ].value = this.props.task.data[ k ].value;
                inputs[ k ].dispatchEvent( new Event( 'focus' ) );
                inputs[ k ].dispatchEvent( new Event( 'blur' ) );
            }
        }

        render()
        {
            if( this.props.scenarioStarted && this.props.currentIndex >= this.props.index )
            {
                return (
                    <section className="task" ref={ this.props.nodeRef }>
                        <h2>Ćwiczenie nr { this.props.index + 1 }</h2>
                        <Paragraph class="task-description" content="Wypełnij formularz, korzystając z danych zawartych **w poniższej tabeli:**" />
                        <table ref={ this.tableRef }>
                            <thead>
                                <tr>
                                    <th>Nazwa pola</th>
                                    <th>Wartość do wpisania</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    this.props.task.data.map( ( row, index ) =>
                                        <tr key={ index }>
                                            <td>{ row.key }</td>
                                            <td>{ row.value }</td>
                                        </tr>
                                    )
                                }
                            </tbody>
                        </table>
                        <button onClick={ this.handleStart } disabled={ this.state.taskStarted }>Rozpocznij ćwiczenie</button>
                        <section className={ "task-form " + this.props.task.type }>
                            <h3>{ this.props.task.title }</h3>
                            { this.state.taskStarted && !this.state.taskFinished &&
                                <i className="material-icons insert-everything" onClick={ this.insertEverything.bind( this ) }>keyboard</i>
                            }
                            {
                                this.state.inputs.map( ( input, index ) =>
                                    <InputWrapper key={ index } index={ index } taskError={ this.state.taskError && this.state.taskStarted } inputDisabled={ this.state.taskFinished || !this.state.taskStarted } label={ input.key } value={ input.value } onInputChange={ this.handleInputChange } simulation={ this.state.simulation }/>
                                )
                            }
                            { this.state.taskError &&
                                <Paragraph class="on-task-error" content="Aby przejść dalej, popraw pola wyróżnione **tym kolorem.**" />
                            }
                        </section>
                        { this.state.taskStarted &&
                            <button onClick={ this.handleFinish } disabled={ this.state.taskFinished }>Zakończ ćwiczenie</button>
                        }
                        { this.state.taskFinished &&
                            <SEQ nodeRef={ this.seqRef } rating={ this.state.stats.rating } onRatingChange={ this.handleRatingChange } onCommentChange={ this.handleCommentChange } maxCommentLength={ this.maxCommentLength } commentLength={ this.state.stats.comment.length } disabled={ this.state.nextTask } />
                        }
                        { this.state.stats.rating > 0 &&
                            <button onClick={ this.handleNext } ref={ this.nextTaskRef } disabled={ this.state.nextTask }>Następne ćwiczenie</button>
                        }
                    </section>
                );
            }

            return '';
        }
    }

    class Scenario extends React.Component {
        constructor( props )
        {
            super( props );

            this.handleStart      = this.handleStart.bind( this );
            this.handleTaskFinish = this.handleTaskFinish.bind( this );
            this.state            = {
                scenarioStarted  : false,
                scenarioFinished : false,
                currentTaskIndex : 0
            }
            this.childNodeRef     = child => {
                window.scrollTo( 0, child.offsetTop );
            }
        }

        handleStart()
        {
            this.setState( {
                scenarioStarted : true
            } );
        }

        handleTaskFinish( taskIndex )
        {
            if( this.state.currentTaskIndex === taskIndex )
            {
                if( this.state.currentTaskIndex === this.props.scenario.tasks.length - 1 )
                {
                    if( this.state.scenarioStarted && !this.state.scenarioFinished )
                    {
                        this.setState( {
                            scenarioFinished : true
                        } );

                        this.props.onScenarioFinish( this.props.index );
                    }
                }
                else
                {
                    this.setState( {
                        currentTaskIndex : this.state.currentTaskIndex + 1
                    } );
                }
            }
        }

        render()
        {
            if( this.props.testStarted && this.props.currentIndex >= this.props.index )
            {
                return (
                    <section className="scenario" ref={ this.props.nodeRef }>
                        <h1>Scenariusz nr { ( this.props.index + 1 ) }</h1>
                        { typeof this.props.scenario.intro !== 'undefined' &&
                            <Paragraph content={ this.props.scenario.intro } />
                        }
                        <button onClick={ this.handleStart } disabled={ this.state.scenarioStarted }>Rozpocznij scenariusz</button>
                        {
                            this.props.scenario.tasks.map( ( task, index ) =>
                                <Task key={ index } index={ index } currentIndex={ this.state.currentTaskIndex } onTaskFinish={ this.handleTaskFinish } scenarioStarted={ this.state.scenarioStarted } task={ task } nodeRef={ this.childNodeRef } />
                            )
                        }
                    </section>
                );
            }

            return '';
        }
    }

    class MainComponent extends React.Component {
        constructor( props )
        {
            super( props );

            this.handleStart          = this.handleStart.bind( this );
            this.handleScenarioFinish = this.handleScenarioFinish.bind( this );
            this.state                = {
                error                : null,
                isLoaded             : false,
                scenarios            : [],
                allScenariosFinished : false,
                testStarted          : false,
                testFinished         : false,
                currentScenarioIndex : 0
            }

            this.childNodeRef = child => {
                window.scrollTo( 0, child.offsetTop );
            }
        }

        handleStart()
        {
            this.setState( {
                testStarted : true
            } );
        }

        handleScenarioFinish( scenarioIndex )
        {
            if( this.state.currentScenarioIndex === scenarioIndex )
            {
                if( this.state.currentScenarioIndex === this.state.scenarios.length - 1 )
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

        componentDidMount()
        {
            fetch( './txt/test-all.json' )
                .then( res => res.json() )
                .then(
                    ( result ) => {
                        this.setState( {
                            scenarios : result.scenarios,
                            isLoaded  : true
                        } );
                    },
                    ( error ) => {
                        this.setState( {
                            isLoaded : false,
                            error
                        } );
                    }
                );
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
                return '';
            }
            else
            {
                return (
                    <div id="page-container">
                        <header>
                            <span>Badanie użyteczności</span>
                        </header>
                        <main>
                            <Paragraph content="Witaj! Niniejsze badanie ma na celu zbadanie użyteczności wybranych wzorców pól, które możesz na co dzień znaleźć w wielu aplikacjach webowych i na stronach internetowych. Zostaniesz poproszony o wykonanie kilkunastu zadań polegających na uzupełnieniu różnego typu formularzy. **Ten tekst jeszcze się zmieni.**" />
                            <button onClick={ this.handleStart } disabled={ this.state.testStarted }>Rozpocznij badanie</button>
                            { scenarios.map( ( scenario, index ) =>
                                <Scenario key={ index } index={ index } testStarted={ this.state.testStarted } currentIndex={ this.state.currentScenarioIndex } scenario={ scenario } onScenarioFinish={ this.handleScenarioFinish } nodeRef={ this.childNodeRef } />
                            ) }
                            { this.state.allScenariosFinished &&
                                <Paragraph content="**To już koniec!** Dziękuję za poświęcony czas i dotarcie do samego końca badania!" />
                            }
                        </main>
                    </div>
                );
            }
        }
    }

    ReactDOM.render( 
        <MainComponent />,
        document.getElementById( 'root' )
    );
};