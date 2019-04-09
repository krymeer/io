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

    class TaskForm extends React.Component {
        constructor( props )
        {
            super( props );
            this.handleInputFocus = this.handleInputFocus.bind( this );
            this.handleInputBlur  = this.handleInputBlur.bind( this );
        }

        handleInputFocus( event )
        {
            const inputID = event.target.id;
            const label   = event.target.previousElementSibling;

            if( this.props.type.indexOf( 'labels-float' ) !== -1 && label !== null )
            {
                label.classList.add( 'on-input-focus' );
            }
        }

        handleInputBlur( event )
        {
            const inputID = event.target.id;
            const label   = event.target.previousElementSibling;

            if( this.props.type.indexOf( 'labels-float' ) !== -1 && label !== null )
            {
                label.classList.remove( 'on-input-focus' );

                if( event.target.value !== '' )
                {
                    label.classList.add( 'on-input-data' );
                }
                else
                {
                    label.classList.remove( 'on-input-data' );
                }
            }
        }

        render()
        {
            const fields = [];

            this.props.fields.map( ( field, index ) => {
                const inputID = this.props.taskID + '--input-' + ( index + 1 );
                fields.push(
                    <div key={ index } className="wrapper">
                        <label htmlFor={ inputID }>{ field.key }</label>
                        <input type="text" id={ inputID } autoComplete="off" onFocus={ this.handleInputFocus } onBlur={ this.handleInputBlur }/>
                    </div>
                )
            } );

            return (
                <section className="form-container">
                    <form className={ this.props.type }>
                        <h3>{ this.props.taskTitle }</h3>
                        { fields }
                    </form>
                </section>
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
                    <TaskForm taskID={ taskID } taskTitle={ this.props.task.title } type={ this.props.task.type } fields={ this.props.task.data } />
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
            return (
                <section className='scenario' id={ 'scenario-' + this.props.index }>
                    <h1>Scenariusz nr { this.props.index }</h1>
                    { typeof this.props.scenario.intro !== 'undefined' && 
                        <Paragraph pClass='scenario-intro' content={ this.props.scenario.intro } />
                    }
                    <button className='btn-start-scenario' id={ 'btn-start-scenario-' +  + this.props.index }>Rozpocznij scenariusz</button>
                    {
                        this.props.scenario.tasks.map( ( task, index ) =>
                            <Task key={ index + 1 } scenarioIndex={ this.props.index } index={ index + 1 } task={ task } />
                        )
                    }
                    <Paragraph pClass='scenario-outro' content={ 'Gratulacje! Wykonałeś wszystkie zadania ze **scenariusza nr ' + this.props.index + '.** Naciśnij poniższy przycisk, aby przejść do dalszej części badania:' } />
                    <button className="btn-finish-scenario" id={ 'btn-finish-scenario-' +  + this.props.index }>Zakończ scenariusz</button>
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