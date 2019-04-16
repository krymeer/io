// window.onbeforeunload = function() {
//     return '';
// }

window.onload = function() {
    const headerHeight = {
        static : 256,
        fixed  : 35
    }

    getRealOffsetTop = ( offsetTop ) => {
        if( offsetTop > headerHeight.static )
        {
            return offsetTop - headerHeight.fixed;
        }

        return offsetTop;
    }

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
                <p ref={ this.props.nodeRef } className={ this.props.class }>
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
            if( !this.props.disabled )
            {
                this.setState( {
                    inputFocus : true
                } );

                // TEMPORARY
                // This call is necessary when filling the inputs programmatically
                this.handleChange( e );
            }
        }

        handleBlur( e )
        {
            if( !this.props.disabled )
            {
                this.setState( {
                    inputFocus    : false,
                    inputNonEmpty : ( e.target.value !== '' )
                } );
            }
        }

        handleChange( e )
        {
            if( !this.props.disabled )
            {
                const inputValid = ( e.target.value === this.props.value );

                this.setState( {
                    inputValid : inputValid
                } );

                this.props.onInputChange( this.props.index, inputValid );
            }
        }

        render()
        {
            const wrapperClassName = ( 'wrapper' + ' ' + ( this.props.taskError ? 'on-task-error' : '' ) + ' ' + ( this.state.inputValid ? '' : 'on-input-invalid' ) ).trim().replace( /\s+/g, ' ' );
            const labelClassName   = ( ( this.props.disabled ? 'on-input-disabled' : '' ) + ' ' + ( this.state.inputFocus ? 'on-input-focus' : '' ) + ' ' + ( this.state.inputNonEmpty ? 'on-input-non-empty' : '' ) ).trim().replace( /\s+/g, ' ' );

            return (
                <div className={ ( wrapperClassName !== "" ) ? wrapperClassName : undefined }>
                    <label className={ ( labelClassName !== "" ) ? labelClassName : undefined }>{ this.props.label }</label>
                    <input type="text" spellCheck="false" autoComplete="off" onFocus={ this.handleFocus } onBlur={ this.handleBlur } onChange={ this.handleChange } disabled={ this.props.disabled } />
                </div>
            );
        }
    }

    class Comment extends React.Component {
        constructor( props )
        {
            super( props );

            this.handleChange = this.handleChange.bind( this );
        }

        handleChange( e )
        {
            if( !this.props.disabled )
            {
                this.props.onChange( e.target.value );
            }
        }

        render()
        {
            return (
                <section className="comment">
                    <h4>
                        { this.props.headerText }
                    </h4>
                    <textarea spellCheck="false" maxLength={ this.props.maxLength } onChange={ this.handleChange } disabled={ this.props.disabled } />
                    <div>
                        <p className="note">
                            Pozostało znaków: <span className="text-important">{ this.props.maxLength - this.props.length }</span>
                        </p>
                        { this.props.noteText &&
                            <p className="note">
                                { this.props.noteText }
                            </p>
                        }
                    </div>
                </section>

            );
        }
    }

    class Task extends React.Component {
        constructor( props )
        {
            super( props );
            this.handleClick         = this.handleClick.bind( this );
            this.handleStart         = this.handleStart.bind( this );
            this.handleFinish        = this.handleFinish.bind( this );
            this.handleNext          = this.handleNext.bind( this );
            this.handleInputChange   = this.handleInputChange.bind( this );
            this.handleRatingChange  = this.handleRatingChange.bind( this );
            this.handleCommentChange = this.handleCommentChange.bind( this );
            this.maxCommentLength    = 255;
            this.childNodeRef        = child => {
                window.scrollTo( 0, getRealOffsetTop( child.offsetTop ) );
            }
            this.state               = {
                taskStarted  : false,
                taskFinished : false,
                taskError    : false,
                nextTask     : false,
                stats        : {
                    startTime      : 0,
                    endTime        : 0,
                    numberOfClicks : 0,
                    numberOfErrors : 0,
                    rating         : 0,
                    comment        : ''
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

        handleClick()
        {
            if( this.state.taskStarted && !this.state.taskFinished )
            {
                this.setState( state => {
                    const stats = {
                        ...state.stats,
                        numberOfClicks : state.stats.numberOfClicks + 1
                    };

                    return {
                        stats
                    };
                } );
            }
        }

        handleStart()
        {
            if( !this.state.taskStarted && !this.state.taskFinished )
            {
                this.setState( state => {
                    const stats = {
                        ...state.stats,
                        startTime : new Date().getTime()
                    };

                    return {
                        stats,
                        taskStarted  : true
                    };
                } );
            }
        }

        handleFinish()
        {
            if( this.state.taskStarted && !this.state.taskFinished )
            {
                if( this.state.inputs.filter( input => !input.valid ).length > 0 )
                {
                    this.setState( state => {
                        const stats = {
                            ...state.stats,
                            numberOfErrors : state.stats.numberOfErrors + 1
                        };

                        return {
                            stats,
                            taskError : true
                        }
                    } );
                }
                else
                {
                    this.setState( state => {
                        const stats = {
                            ...state.stats,
                            endTime : new Date().getTime()
                        };

                        return {
                            stats,
                            taskError    : false,
                            taskFinished : true
                        };
                    } );
                }
            }
        }

        handleNext()
        {
            if( this.state.taskStarted && this.state.taskFinished )
            {
                this.setState( {
                    nextTask : true
                } );

                this.props.onTaskFinish( this.props.index, this.props.task.type, this.state.stats );
            }
        }

        handleRatingChange( k )
        {
            if( this.state.taskFinished && !this.state.nextTask )
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
                    } );
                }
            }
        }

        handleCommentChange( comment )
        {
            if( this.state.taskFinished && !this.state.nextTask )
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
        }

        handleInputChange( inputIndex, inputValid )
        {
            if( this.state.taskStarted && !this.state.taskFinished )
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
                    <section className="task" onClick={ this.handleClick } ref={ this.props.nodeRef }>
                        <h2>Ćwiczenie nr { this.props.index }</h2>
                        <Paragraph class="task-description" content="Wypełnij formularz, korzystając z danych zawartych **w poniższej tabeli:**" />
                        <table ref={ ( this.state.taskStarted ) ? this.childNodeRef : undefined }>
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
                                    <InputWrapper key={ index } index={ index } taskError={ this.state.taskError && this.state.taskStarted } disabled={ this.state.taskFinished || !this.state.taskStarted } label={ input.key } value={ input.value } onInputChange={ this.handleInputChange } simulation={ this.state.simulation }/>
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
                            <section className="seq" ref={ this.childNodeRef }>
                                <h3>
                                    Jaki jest, Twoim zdaniem, poziom trudności powyższego ćwiczenia? *
                                </h3>
                                <ul className="seq-radios">
                                    { [ ...Array( 7 ) ].map( ( x, key, array ) =>
                                        <li className="seq-item" key={ key }>
                                            { key === 0 &&
                                                <div>
                                                    Bardzo trudne
                                                </div>
                                            }
                                            { key === array.length - 1 &&
                                                <div>
                                                    Bardzo latwe
                                                </div>
                                            }
                                            <div>{ key + 1 }</div>
                                            <div className={ ( "radio " + ( this.state.stats.rating === key + 1  ? "chosen" : "" ) + " " + ( this.state.nextTask ? "disabled" : "" ) ).trim().replace( /\s+/g, ' ' ) } onClick={ this.handleRatingChange.bind( this, key + 1 ) }>
                                                <div/>
                                            </div>
                                        </li>
                                    ) }
                                </ul>
                                <p className="note">
                                    * Pole wymagane
                                </p>
                                { this.state.stats.rating > 0 &&
                                    <Comment headerText="Czy masz jakieś uwagi lub sugestie związane z powyższym ćwiczeniem? **" noteText="** Pole opcjonalne" onChange={ this.handleCommentChange } length={ this.state.stats.comment.length } maxLength={ this.maxCommentLength } disabled={ this.state.nextTask } />
                                }
                            </section>
                        }
                        { this.state.stats.rating > 0 &&
                            <button onClick={ this.handleNext } ref={ this.childNodeRef } disabled={ this.state.nextTask }>
                                { this.props.index < this.props.lastIndex &&
                                    "Następne ćwiczenie"
                                }
                                { this.props.index === this.props.lastIndex &&
                                    "Zakończ scenariusz"
                                }
                            </button>
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

            this.handleStart            = this.handleStart.bind( this );
            this.handleNext             = this.handleNext.bind( this );
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

        handleNext()
        {
            if( this.state.scenarioStarted && this.state.scenarioFinished )
            {
                this.setState( {
                    nextScenario : true
                } );

                this.props.onScenarioFinish( {
                    index   : this.props.index,
                    tasks   : this.state.tasks,
                    summary : this.state.summary
                } );
            }
        }

        handleTaskFinish( taskIndex, taskType, taskStats )
        {
            if( this.state.scenarioStarted && !this.state.scenarioFinished && this.state.currentTaskIndex === taskIndex )
            {
                this.setState( state => {
                    const tasks = state.tasks;
                    tasks.push( {
                        index : taskIndex,
                        type  : taskType,
                        stats : taskStats
                    } );

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
                    <section className="scenario">
                        <h1>Scenariusz nr { ( this.props.index ) }</h1>
                        { typeof this.props.scenario.intro !== 'undefined' &&
                            <Paragraph content={ this.props.scenario.intro } />
                        }
                        <button onClick={ this.handleStart } disabled={ this.state.scenarioStarted }>Rozpocznij scenariusz</button>
                        {
                            this.props.scenario.tasks.map( ( task, index, tasks ) =>
                                <Task nodeRef={ this.childNodeRef } key={ index } index={ index + 1 } currentIndex={ this.state.currentTaskIndex } lastIndex={ tasks.length } onTaskFinish={ this.handleTaskFinish } scenarioStarted={ this.state.scenarioStarted } task={ task } />
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
                                                <h4>{ question.text } *</h4>
                                                <ul>
                                                    { question.answers.map( ( answer, aIndex ) =>
                                                        <li key={ aIndex }>
                                                            <div className={ ( "radio " + ( question.chosenAnswer === aIndex ? "chosen" : "" ) + " " + ( this.state.nextScenario ? "disabled" : "" ) ).trim().replace( /\s+/g, ' ' ) } onClick={ this.handleSummaryQuestion.bind( this, qIndex, aIndex ) }>
                                                                <div />
                                                            </div>
                                                            <span>{ answer }</span>
                                                        </li>
                                                    ) }
                                                </ul>
                                            </div> );
                                        }
                                        else
                                        {
                                            return '';
                                        }
                                    } ) }
                                    <p className="note">* Pole wymagane</p>
                                    { this.state.summary.currentQuestion >= this.state.summary.questions.length &&
                                        <Comment headerText="Czy masz jakieś uwagi lub sugestie związane z ukończonym scenariuszem? **" noteText="** Pole opcjonalne" onChange={ this.handleSummaryComment } length={ this.state.summary.comment.length } maxLength="255" disabled={ this.state.nextScenario } />
                                    }
                                </section>
                            </section>
                        }
                        { this.state.scenarioFinished && this.state.summary.currentQuestion >= this.state.summary.questions.length &&
                            <button onClick={ this.handleNext } ref={ this.childNodeRef } disabled={ this.state.nextScenario }>
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
                return '';
            }
        }
    }

    class MainComponent extends React.Component {
        constructor( props )
        {
            super( props );

            this.handleScroll         = this.handleScroll.bind( this );
            this.handleStart          = this.handleStart.bind( this );
            this.handleScenarioFinish = this.handleScenarioFinish.bind( this );
            this.backToTop            = this.backToTop.bind( this );
            this.state                = {
                error                : null,
                isLoaded             : false,
                scenarios            : [],
                allScenariosFinished : false,
                testStarted          : false,
                testFinished         : false,
                headerFixed          : false,
                currentScenarioIndex : 1,
            }

            this.childNodeRef = child => {
                window.scrollTo( 0, getRealOffsetTop( child.offsetTop ) );
            }
        }

        backToTop()
        {
            window.scrollTo( 0, 0 );
        }

        handleStart()
        {
            if( !this.state.testStarted )
            {
                this.setState( {
                    testStarted : true
                } );
            }
        }

        handleScenarioFinish( scenario )
        {
            if( this.state.testStarted && this.state.currentScenarioIndex === scenario.index )
            {
                console.log( scenario );

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

        handleScroll()
        {
            if( window.scrollY > 256 )
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

        componentDidMount()
        {
            fetch( './txt/test-one-task.json' )
                .then( res => res.json() )
                .then(
                    ( result ) => {
                        this.setState( {
                            scenarios : result.scenarios,
                            isLoaded  : true
                        }, () => {
                            window.addEventListener( 'scroll', this.handleScroll );
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
                    <div className={ this.state.headerFixed ? 'header-fixed' : undefined } id="page-container">
                        <header>
                            <p>
                                <span>Badanie użyteczności</span>
                                { this.state.headerFixed &&
                                    <span>scenariusz { this.state.currentScenarioIndex }/{ this.state.scenarios.length }</span>
                                }
                                { this.state.headerFixed &&
                                    <i className="material-icons" onClick={ this.backToTop }>
                                        arrow_upward
                                    </i>
                                }
                            </p>
                        </header>
                        <main>
                            <Paragraph content="Witaj! Niniejsze badanie ma na celu zbadanie użyteczności wybranych wzorców pól, które możesz na co dzień znaleźć w wielu aplikacjach webowych i na stronach internetowych. Zostaniesz poproszony o wykonanie kilkunastu zadań polegających na uzupełnieniu różnego typu formularzy. **Ten tekst jeszcze się zmieni.**" />
                            <button onClick={ this.handleStart } disabled={ this.state.testStarted }>Rozpocznij badanie</button>
                            { scenarios.map( ( scenario, index ) =>
                                <Scenario key={ index } index={ index + 1 } testStarted={ this.state.testStarted } currentIndex={ this.state.currentScenarioIndex } lastIndex={ this.state.scenarios.length } scenario={ scenario } onScenarioFinish={ this.handleScenarioFinish } ref={ this.childNodeRef } />
                            ) }
                            { this.state.allScenariosFinished &&
                                <Paragraph nodeRef={ this.childNodeRef } content="**To już koniec!** Dziękuję za poświęcony czas i dotarcie do samego końca badania!" />
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