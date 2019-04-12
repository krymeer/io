window.onload = function() {
    function insertNbsp( str )
    {
        return str.replace( /(?<=(\s|>)\w)\s/g, '\u00a0' );
    }

    function getRandomString()
    {
        return Math.random().toString( 36 ).substring( 2 );
    }

    function extractTextImportant( string )
    {
        const chunks = [];

        string.split( /(\*\*[^\*]*\*\*)/gi ).map( ( chunk, index ) => {
            chunk = insertNbsp( chunk );

            if( chunk.indexOf( '**' ) !== -1 )
            {
                chunk = <span key={ index } className='text-important'>{ chunk.substring( 2, chunk.length - 2 ) }</span>
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
            return(
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

            this.handleFocus = this.handleFocus.bind( this );
            this.handleBlur  = this.handleBlur.bind( this );
            this.state       = {
                inputFocus    : false,
                inputNonEmpty : false,
                inputValid    : false
            }
        }

        handleFocus( e )
        {
            const inputNonEmpty = ( event.target.value !== '' );
            const inputValid    = ( event.target.value === this.props.value );

            this.setState( {
                inputFocus    : true,
                inputNonEmpty : inputNonEmpty,
                inputValid    : inputValid
            } );

            this.props.onInputFocus( this.props.id, inputValid );
        }

        handleBlur( e )
        {
            const inputNonEmpty = ( event.target.value !=='' );
            const inputValid    = ( event.target.value === this.props.value );

            this.setState( {
                inputFocus    : false,
                inputNonEmpty : inputNonEmpty,
                inputValid    : inputValid
            } );

            this.props.onInputBlur( this.props.id, inputValid );
        }

        render()
        {
            const wrapperClassName = ( 'wrapper' + ' ' + ( this.props.taskError ? 'on-task-error' : '' ) + ' ' + ( this.state.inputValid ? '' : 'on-input-invalid' ) ).trim().replace( /\s+/g, ' ' );
            const labelClassName   = ( ( this.props.inputDisabled ? 'on-input-disabled' : '' ) + ' ' + ( this.state.inputFocus ? 'on-input-focus' : '' ) + ' ' + ( this.state.inputNonEmpty ? 'on-input-non-empty' : '' ) ).trim().replace( /\s+/g, ' ' );

            return (
                <div className={ ( wrapperClassName !== '' ) ? wrapperClassName : undefined }>
                    <label className={ ( labelClassName !== '' ) ? labelClassName : undefined } htmlFor={ this.props.id }>{ this.props.label }</label>
                    <input type="text" id={ this.props.id } autoComplete="off" onFocus={ this.handleFocus } onBlur={ this.handleBlur } disabled={ this.props.inputDisabled } />
                </div>
            );
        }
    }

    class Task extends React.Component {
        constructor( props )
        {
            super( props );
            this.handleTaskStart  = this.handleTaskStart.bind( this );
            this.handleTaskFinish = this.handleTaskFinish.bind( this );
            this.handleInputBlur  = this.handleInputBlur.bind( this );
            this.handleInputFocus = this.handleInputFocus.bind( this );
            this.state            = {
                taskStarted  : false,
                taskFinished : false,
                taskError    : false,
                inputs       : this.props.task.data.map( ( item, index ) => {
                    return {
                        id    : this.props.id + '--input-' + index,
                        valid : false,
                        key   : item.key,
                        value : item.value,
                    };
                } )
            }
        }

        handleTaskStart()
        {
            if( !this.state.taskStarted && !this.state.taskFinished )
            {
                this.setState( {
                    taskStarted : true
                } );
            }
        }

        handleTaskFinish()
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

        handleInputFocus( inputId, inputValid )
        {
            // Nothing happens here?
        }

        handleInputBlur( inputId, inputValid )
        {
            this.setState( state => {
                const inputs = state.inputs.map( ( input ) => {
                    if( input.id === inputId )
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
            } );
        }

        render()
        {
            return (
                <section className='task' id={ this.props.id }>
                    <h2>Ćwiczenie nr { this.props.index }</h2>
                    <Paragraph class="task-description" content="Wypełnij formularz, korzystając z danych zawartych **w poniższej tabeli:**" />
                    <table>
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
                    <button className='btn-start-task' id={ 'btn-start-' +  this.props.id } onClick={ this.handleTaskStart } disabled={ this.state.taskStarted }>Rozpocznij ćwiczenie</button>
                    <section className="form-container">
                        <form className={ this.props.task.type }>
                            <h3>{ this.props.task.title }</h3>
                            {
                                this.state.inputs.map( ( input ) =>
                                    <InputWrapper key={ input.id } id={ input.id } taskError={ this.state.taskError && this.state.taskStarted } inputDisabled={ this.state.taskFinished || !this.state.taskStarted } onInputBlur={ this.handleInputBlur } onInputFocus={ this.handleInputFocus } label={ input.key } value={ input.value } />
                                )
                            }
                            { this.state.taskError &&
                                <Paragraph class="on-task-error" content="Aby przejść dalej, popraw pola wyróżnione **tym kolorem.**" />
                            }
                        </form>
                    </section>
                    <button className='btn-finish-task' id={ 'btn-finish-' +  this.props.id } onClick={ this.handleTaskFinish } disabled={ this.state.taskFinished || !this.state.taskStarted }>Zakończ ćwiczenie</button>
                </section>
            );
        }
    }

    class Scenario extends React.Component {
        constructor( props )
        {
            super( props );

            this.state = {
                scenarioStarted  : false,
                scenarioFinished : false,
                currentTaskIndex : 0
            }
        }

        render()
        {
            if( this.props.testStarted && this.props.currentIndex >= this.props.index )
            {
                return (
                    <section className='scenario' id={ this.props.id }>
                        <h1>Scenariusz nr { ( this.props.index + 1 ) }</h1>
                        { typeof this.props.scenario.intro !== 'undefined' &&
                            <Paragraph class='scenario-intro' content={ this.props.scenario.intro } />
                        }
                        <button className='btn-start-scenario' id={ 'btn-start-' + this.props.id }>Rozpocznij scenariusz</button>
                        {
                            this.props.scenario.tasks.map( ( task, index ) =>
                                <Task key={ index } currentIndex={ this.state.currentTaskIndex } index={ index + 1 } id={ 'task-' + this.props.index + '-' + index } task={ task } />
                            )
                        }
                        { this.state.scenarioFinished && typeof this.props.scenario.outro !== 'undefined' &&
                            <Paragraph class='scenario-outro' content={ this.props.scenario.outro } />
                        }
                        { this.state.scenarioFinished &&
                            <button className="btn-finish-scenario" id={ 'btn-finish-' + this.props.id }>Zakończ scenariusz</button>
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

            this.handleTestStart = this.handleTestStart.bind( this );
            this.state = {
                error                : null,
                isLoaded             : false,
                scenarios            : [],
                testStarted          : false,
                testFinished         : false,
                currentScenarioIndex : 0
            }
        }

        handleTestStart()
        {
            this.setState( {
                testStarted : true
            } );
        }

        componentDidMount()
        {
            fetch( './txt/test-simple.json' )
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
                            <button onClick={ this.handleTestStart } disabled={ this.state.testStarted }>Rozpocznij badanie</button>
                            { scenarios.map( ( scenario, index ) =>
                                <Scenario key={ index } id={ 'scenario-' + index } index={ index } testStarted={ this.state.testStarted } currentIndex={ this.state.currentScenarioIndex } scenario={ scenario } />
                            ) }
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