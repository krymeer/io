window.onload = function() {
    function getTextImportant( string )
    {
        return string.split( /(\*\*[^\*]*\*\*)/gi );
    }

    function insertNbsp()
    {
        var p = document.querySelectorAll( 'p' );

        for( var k = 0; k < p.length; k++ )
        {
            p[k].innerHTML = p[k].innerHTML.replace( /(?<=(\s|>)\w)\s/g, '&nbsp;' );
        }
    }

    class Task extends React.Component {
        constructor( props )
        {
            super( props );
        }

        render()
        {
            return (
                <section className="task" id={ "task-" + this.props.scenarioIndex + "-" + this.props.index }>
                    <h2>Ćwiczenie nr { this.props.index }</h2>
                    <span>{ this.props.html }</span>
                    { typeof this.props.task.description !== 'undefined' &&
                        <p>
                            { getTextImportant( this.props.task.description ).map( ( chunk, index ) =>
                                // TODO
                                // Create a <Paragraph /> component in order to be able to render <span> tags
                                <span>{ chunk }</span>
                            ) }
                        </p>
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
                        <p className="scenario-intro">
                            { this.props.scenario.intro }
                        </p>
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
                return <div>Loading...</div>;
            }
            else
            {
                return (
                    scenarios.map( ( scenario, index ) => 
                        <Scenario key={ index + 1 } index={ index + 1 } scenario={ scenario } />
                    )
                );









                //     <div style={{ fontFamily : 'monospace' }}>{ JSON.stringify( scenarios ) }</div>
                // );
            }
        }
    }

    ReactDOM.render( 
        <MainComponent />,
        document.getElementById( 'root' )
    );

    insertNbsp();
};