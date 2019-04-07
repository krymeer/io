window.onload = function() {
    function insertNbsp( str )
    {
        return str.replace( /(?<=(\s|>)\w)\s/g, '\u00a0' );
    }

    function extractTextImportant( string )
    {
        var chunks = [];

        string.split( /(\*\*[^\*]*\*\*)/gi ).map( ( chunk, index ) => {
            chunk = insertNbsp( chunk );

            if( chunk.indexOf( '**' ) !== -1 )
            {
                chunk = <span key={ Math.random().toString( 36 ).substring( 2 ) } className="text-important">{ chunk.substring( 2, chunk.length - 2 ) }</span>
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
            var pContent = extractTextImportant( this.props.content );

            return(
                <p className={ typeof this.props.pClass !== 'undefined' ? this.props.pClass : '' }>
                    { pContent }
                </p>
            );
        }
    }

    class Task extends React.Component {
        constructor( props )
        {
            super( props );
        }

        render()
        {
            var taskID = 'task-' + this.props.scenarioIndex + '-' + this.props.index;

            return (
                <section className="task" id={ taskID }>
                    <h2>Ćwiczenie nr { this.props.index }</h2>
                    <span>{ this.props.html }</span>
                    { typeof this.props.task.description !== 'undefined' &&
                        <Paragraph pClass="task-description" content={ this.props.task.description } />
                    }
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
                <section className="scenario" id={ "scenario-" + this.props.index }>
                    <h1>Scenariusz nr { this.props.index }</h1>
                    { typeof this.props.scenario.intro !== 'undefined' && 
                        <Paragraph pClass="scenario-intro" content={ this.props.scenario.intro } />
                    }
                    <button className="btn-start-scenario" id={ "btn-start-scenario-" +  + this.props.index }>Rozpocznij scenariusz</button>
                    {
                        this.props.scenario.tasks.map( ( task, index ) =>
                            <Task key={ index + 1 } scenarioIndex={ this.props.index } index={ index + 1 } task={ task } />
                        )
                    }
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
                return (
                    scenarios.map( ( scenario, index ) => 
                        <Scenario key={ index + 1 } index={ index + 1 } scenario={ scenario } />
                    )
                );
            }
        }
    }

    ReactDOM.render( 
        <MainComponent />,
        document.getElementById( 'root' )
    );
};