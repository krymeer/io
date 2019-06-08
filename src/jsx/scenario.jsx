class Scenario extends React.Component {
    constructor( props )
    {
        super( props );

        this.handleStart            = this.handleStart.bind( this );
        this.handleFinish           = this.handleFinish.bind( this );
        this.handleTaskFinish       = this.handleTaskFinish.bind( this );
        this.handleSummaryComment   = this.handleSummaryComment.bind( this );
        this.state                  = {
            scenarioStarted  : false,
            scenarioFinished : false,
            nextScenario     : false,
            currentTaskIndex : 1,
            tasks            : {
                const   : shuffle( this.props.scenario.tasks ),
                results : []
            },
            summary          : {
                currentQuestion : 0,
                questions : [
                    { text : 'Czy treść ćwiczeń była jasna i zrozumiała?', chosenAnswer : -1, answers : [ 'Tak', 'Nie' ] },
                    { text : 'Czy poziom trudności ćwiczeń był zgodny z Twoimi oczekiwaniami?', chosenAnswer : -1, answers : [ 'Tak', 'Nie' ] },
                    { text : 'Czy metody wprowadzania danych zaprezentowane w tym scenariuszu były dla Ciebie intuicyjne?', chosenAnswer : -1, answers : [ 'Tak', 'Nie' ] }
                ],
                comment   : ''
            }
        };
        this.childNodeRef     = child => {
            window.scrollTo( 0, getRealOffsetTop( child.offsetTop ) );
        };

        if( this.props.scenario.extraQuestions )
        {
            this.state.summary.questions = [
                ...this.state.summary.questions,
                ...this.props.scenario.extraQuestions
            ]
        }
    }

    handleStart()
    {
        if( !this.state.scenarioStarted )
        {
            this.setState( {
                scenarioStarted : true
            } );
        }
    }

    handleFinish()
    {
        if( this.state.scenarioStarted && this.state.scenarioFinished )
        {
            this.setState( {
                nextScenario : true
            } );

            const summaryData = {
                comment        : this.state.summary.comment,
                summaryAnswers : this.state.summary.questions.map( ( question ) => {
                        return question.answers[ question.chosenAnswer ];
                } )
            };

            this.props.onFinish( {
                index : this.props.index,
                tasks : this.state.tasks.results,
                ...summaryData
            } );

            summaryData.ip    = globals.ip;
            summaryData.event = 'endOfScenario';

            fetch( globals.backURI + '?do=send&what=partial-results', {
                method  : 'POST',
                body    : JSON.stringify( summaryData ),
                headers : {
                    'Content-Type' : 'application/json'
                }
            } ).then( res => res.json() ).then( response => {
                if( globals.dev )
                {
                    console.log( response );
                }
            } ).catch( error => {
                if( globals.dev )
                {
                    console.error( error );
                }
            } );
        }
    }

    handleTaskFinish( task )
    {
        let { index, ...data } = task;

        if( this.state.scenarioStarted && !this.state.scenarioFinished && this.state.currentTaskIndex === index )
        {
            this.setState( state => {
                const results = state.tasks.results;
                results.push( data );

                return {
                    ...state,
                    tasks : {
                        ...state.tasks,
                        results
                    }
                };
            } );

            if( this.state.currentTaskIndex === this.state.tasks.const.length )
            {
                this.setState( {
                    scenarioFinished : true
                } );
            }
            else
            {
                this.setState( {
                    currentTaskIndex : this.state.currentTaskIndex + 1
                } );
            }
        }
    }

    handleSummaryComment( input )
    {
        if( this.state.scenarioFinished && !this.state.nextScenario )
        {
            this.setState( state => {
                const summary = {
                    ...state.summary,
                    comment : input.value
                }

                return {
                    ...state,
                    summary
                };
            } );
        }
    }

    handleSummaryQuestion( questionIndex, answerIndex )
    {
        if( this.state.scenarioFinished && !this.state.nextScenario )
        {
            this.setState( state => {
                const questions = state.summary.questions.map( ( question, index ) => {
                    if( questionIndex === index )
                    {
                        return {
                            ...question,
                            chosenAnswer : answerIndex
                        };
                    }

                    return question;
                } );

                return {
                    summary : {
                        ...state.summary,
                        currentQuestion : questionIndex + 1,
                        questions
                    }
                };
            } );
        }
    }

    render()
    {
        if( this.props.testStarted && this.props.currentIndex >= this.props.index )
        {
            return (
                <React.Fragment>
                    <section className="scenario-intro" ref={ this.props.nodeRef }>
                        <h1>Scenariusz { this.props.index }.</h1>
                        { typeof this.props.scenario.intro !== "undefined" &&
                            <Paragraph content={ this.props.scenario.intro } />
                        }
                        { typeof this.props.scenario.alert !== 'undefined' &&
                            <Paragraph class="alert" content={ this.props.scenario.alert } />
                        }
                        <button onClick={ this.handleStart } disabled={ this.state.scenarioStarted }>OK, dalej</button>
                    </section>
                    <React.Fragment>
                        { this.state.tasks.const.map( ( task, index, tasks ) =>
                            <Task question={ this.props.scenario.question } nodeRef={ this.childNodeRef } key={ index } index={ index + 1 } currentIndex={ this.state.currentTaskIndex } lastIndex={ tasks.length } onFinish={ this.handleTaskFinish } scenarioIndex={ this.props.index } scenarioStarted={ this.state.scenarioStarted } task={ task } />
                        ) }
                    </React.Fragment>
                    { this.state.scenarioFinished &&
                        <section className="scenario-summary" ref={ this.childNodeRef }>
                            <h2>Podsumowanie</h2>
                            <Paragraph content={ "Udało się! Właśnie ukończyłeś(-aś) **scenariusz " + this.props.index + ".** i możesz przejść do kolejnej części badania. Zanim jednak to zrobisz, proszę, udziel odpowiedzi na poniższe pytania." } />
                            <section className="questions">
                                { this.state.summary.questions.map( ( question, qIndex ) => {
                                    if( this.state.summary.currentQuestion >= qIndex )
                                    {
                                        return ( <div key={ qIndex } className="question-wrapper" ref={ this.childNodeRef }>
                                            <h4>{ question.text }</h4>
                                            <ul>
                                                { question.answers.map( ( answer, aIndex ) =>
                                                    <li className={ ( "radio-item " + ( question.chosenAnswer === aIndex ? "chosen" : "" ) + " " + ( this.state.nextScenario ? "disabled" : "" ) ).trim().replace( /\s+/g, " " ) } key={ aIndex }>
                                                        <div className="radio" onClick={ this.handleSummaryQuestion.bind( this, qIndex, aIndex ) } />
                                                        <span>{ answer }</span>
                                                    </li>
                                                ) }
                                            </ul>
                                        </div> );
                                    }
                                    else
                                    {
                                        return null;
                                    }
                                } ) }
                                { this.state.summary.currentQuestion >= this.state.summary.questions.length &&
                                    <InputWrapper wrapperClass="comment-wrapper" label={ this.props.scenario.openQuestion ? this.props.scenario.openQuestion : "Jaki jest najlepszy sposób na wprowadzanie tego typu danych?" } optional={ true } type="textarea" disabled={ this.state.nextScenario } onChange={ this.handleSummaryComment } />
                                }
                            </section>
                        </section>
                    }
                    { this.state.scenarioFinished && this.state.summary.currentQuestion >= this.state.summary.questions.length &&
                        <section className="button-wrapper">
                            <button onClick={ this.handleFinish } ref={ this.childNodeRef } disabled={ this.state.nextScenario }>OK, dalej</button>
                        </section>
                    }
                </React.Fragment>
            );
        }
        else
        {
            return "";
        }
    }
}