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
            tasks            : [],
            summary          : {
                currentQuestion : 0,
                questions : [
                    { text : 'Czy treść ćwiczeń była jasna i zrozumiała?', chosenAnswer : -1, answers : [ 'Tak', 'Nie' ] },
                    { text : 'Czy poziom trudności ćwiczeń był zgodny z Twoimi oczekiwaniami?', chosenAnswer : -1, answers : [ 'Tak', 'Nie' ] },
                    { text : 'Czy podczas wykonywania ćwiczeń wystąpiły jakieś problemy?', chosenAnswer : -1, answers : [ 'Tak', 'Nie' ] }
                ],
                comment   : ''
            }
        };
        this.childNodeRef     = child => {
            window.scrollTo( 0, getRealOffsetTop( child.offsetTop ) );
        };
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

            this.props.onFinish( {
                index   : this.props.index,
                tasks   : this.state.tasks,
                summary : {
                    comment : this.state.summary.comment,
                    answers : this.state.summary.questions.map( ( question ) => {
                        return question.chosenAnswer;
                    } )
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
                const tasks = state.tasks;
                tasks.push( data );

                return {
                    ...state,
                    tasks
                };
            } );

            if( this.state.currentTaskIndex === this.props.scenario.tasks.length )
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

    handleSummaryComment( comment )
    {
        if( this.state.scenarioFinished && !this.state.nextScenario )
        {
            this.setState( state => {
                const summary = {
                    ...state.summary,
                    comment : comment
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
                <section className="scenario" ref={ this.props.nodeRef }>
                    <h1>Scenariusz nr { ( this.props.index ) }</h1>
                    { typeof this.props.scenario.intro !== "undefined" &&
                        <Paragraph content={ this.props.scenario.intro } />
                    }
                    <button onClick={ this.handleStart } disabled={ this.state.scenarioStarted }>Rozpocznij scenariusz</button>
                    {
                        this.props.scenario.tasks.map( ( task, index, tasks ) =>
                            <Task nodeRef={ this.childNodeRef } key={ index } index={ index + 1 } currentIndex={ this.state.currentTaskIndex } lastIndex={ tasks.length } onFinish={ this.handleTaskFinish } scenarioStarted={ this.state.scenarioStarted } task={ task } />
                        )
                    }
                    { this.state.scenarioFinished &&
                        <section className="summary" ref={ this.childNodeRef }>
                            <h2>Podsumowanie</h2>
                            <Paragraph content={ "Gratulacje! Wszystko wskazuje na to, że udało Ci się ukończyć **scenariusz nr " + this.props.index + ".** Zanim przejdziesz dalej, udziel odpowiedzi na poniższe pytania." } />
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
                                        return "";
                                    }
                                } ) }
                                { this.state.summary.currentQuestion >= this.state.summary.questions.length &&
                                    <Comment headerText="Czy masz jakieś uwagi lub sugestie związane z ukończonym scenariuszem? *" noteText="* Pole opcjonalne" onChange={ this.handleSummaryComment } length={ this.state.summary.comment.length } maxLength={ globals.maxLength.textarea } disabled={ this.state.nextScenario } />
                                }
                            </section>
                        </section>
                    }
                    { this.state.scenarioFinished && this.state.summary.currentQuestion >= this.state.summary.questions.length &&
                        <button onClick={ this.handleFinish } ref={ this.childNodeRef } disabled={ this.state.nextScenario }>
                            { this.props.index < this.props.lastIndex &&
                                "Następny scenariusz"
                            }
                            { this.props.index === this.props.lastIndex &&
                                "Zakończ badanie"
                            }
                        </button>
                    }
                </section>
            );
        }
        else
        {
            return "";
        }
    }
}