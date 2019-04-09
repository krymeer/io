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
                <p className={ typeof this.props.pClass !== 'undefined' ? this.props.pClass : '' }>
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

            this.state = {
                inputFocus : false
            }
        }

        handleFocus()
        {
            this.setState( {
                inputFocus : true
            } );
        }

        handleBlur()
        {
            this.setState( {
                inputFocus : false
            } );
        }

        render()
        {
            const inputID        = this.props.taskID + '--input-' + ( this.props.inputIndex + 1 );
            const labelClassName = ( ( this.props.inputDisabled ? 'on-input-disabled' : '' ) + ' ' + ( this.state.inputFocus ? 'on-input-focus' : '' ) ).trim();
            console.log( labelClassName );

            return (
                <div className="wrapper">
                    <label className={ labelClassName } htmlFor={ inputID }>{ this.props.data.key }</label>
                    <input type="text" id={ inputID } autoComplete="off" onFocus={ this.handleFocus } onBlur={ this.handleBlur } disabled={ this.props.inputDisabled } />
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
            this.state = {
                taskStarted  : false,
                taskFinished : false
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
                this.setState( {
                    taskFinished : true
                } );
            }
        }

        render()
        {
            const taskID = 'task-' + this.props.scenarioIndex + '-' + this.props.index;

            return (
                <section className='task' id={ taskID }>
                    <h2>Ćwiczenie nr { this.props.index }</h2>
                    <Paragraph pClass='task-description' content='Wypełnij formularz, korzystając z danych zawartych **w poniższej tabeli:**' />
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
                    <button className='btn-start-task' id={ 'btn-start-' +  taskID } onClick={ this.handleTaskStart } disabled={ this.state.taskStarted }>Rozpocznij ćwiczenie</button>
                    <section className="form-container">
                        <form className={ this.props.task.type }>
                            <h3>{ this.props.task.title }</h3>
                            {
                                this.props.task.data.map( ( fieldKeyVal, index ) =>
                                    <InputWrapper key={ index } taskID={ taskID } inputIndex={ index } inputDisabled={ this.state.taskFinished || !this.state.taskStarted } data={ fieldKeyVal }/>
                                )
                            }
                        </form>
                    </section>
                    <button className='btn-finish-task' id={ 'btn-finish-' +  taskID } onClick={ this.handleTaskFinish } disabled={ this.state.taskFinished || !this.state.taskStarted }>Zakończ ćwiczenie</button>
                </section>
            );
        }
    }

    class Scenario extends React.Component {
        constructor( props )
        {
            super( props );
        }

        render()
        {
            const scenarioID = 'scenario-' + this.props.index;

            return (
                <section className='scenario' id={ scenarioID }>
                    <h1>Scenariusz nr { this.props.index }</h1>
                    { typeof this.props.scenario.intro !== 'undefined' && 
                        <Paragraph pClass='scenario-intro' content={ this.props.scenario.intro } />
                    }
                    <button className='btn-start-scenario' id={ 'btn-start-' + scenarioID }>Rozpocznij scenariusz</button>
                    {
                        this.props.scenario.tasks.map( ( task, index ) =>
                            <Task key={ index + 1 } scenarioIndex={ this.props.index } index={ index + 1 } task={ task } />
                        )
                    }
                    <Paragraph pClass='scenario-outro' content={ 'Gratulacje! Wykonałeś wszystkie zadania ze **scenariusza nr ' + this.props.index + '.** Naciśnij poniższy przycisk, aby przejść do dalszej części badania:' } />
                    <button className="btn-finish-scenario" id={ 'btn-finish-' + scenarioID }>Zakończ scenariusz</button>
                </section>
            );
        }

    }

    class MainComponent extends React.Component {
        constructor( props )
        {
            super( props );
            this.state = {
                error     : null,
                isLoaded  : false,
                scenarios : []
            }
        }

        componentDidMount()
        {
            fetch( './txt/test-0.1.json' )
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
                const scenarioList = [];

                scenarios.map( ( scenario, index ) => {
                    scenarioList.push(
                        <Scenario key={ index + 1 } index={ index + 1 } scenario={ scenario } />
                    );
                } );

                return (
                    <div id="page-container">
                        <header>
                            <span>Badanie użyteczności</span>
                        </header>
                        <main>
                            <Paragraph content="Witaj! Niniejsze badanie ma na celu zbadanie użyteczności wybranych wzorców pól, które możesz na co dzień znaleźć w wielu aplikacjach webowych i na stronach internetowych. Zostaniesz poproszony o wykonanie kilkunastu zadań polegających na uzupełnieniu różnego typu formularzy. **Ten tekst jeszcze się zmieni.**" />
                            { scenarioList }
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