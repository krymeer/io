// window.onbeforeunload = function() {
//     return '';
// }

window.onload = function() {
    const emailRegex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;

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

            this.handleFocus     = this.handleFocus.bind( this );
            this.handleBlur      = this.handleBlur.bind( this );
            this.handleChange    = this.handleChange.bind( this );
            this.state        = {
                inputFocus     : false,
                inputNonEmpty  : false,
                inputValid     : false,
            };

            if( this.props.type === 'select' )
            {
                this.state = {
                    ...this.state,
                    selectList : {}
                };
            }
        }

        handleFocus( e )
        {
            if( !this.props.disabled )
            {
                this.setState( {
                    inputFocus : true
                } );

                // This TEMPORARY call is necessary when filling the inputs programmatically
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

        handleChange( event )
        {
            if( !this.props.disabled )
            {
                const inputValid = ( typeof this.props.defaultValue !== 'undefined' ) ? ( this.props.defaultValue === event.target.value ) : ( this.props.regex.test( event.target.value ) );

                this.setState( {
                    inputValid : inputValid
                } );

                this.props.onChange( {
                    index : this.props.index,
                    valid : inputValid,
                    value : event.target.value
                } );
            }
        }

        handleOption( index, value )
        {
            if( !this.props.disabled )
            {
                const inputValid = ( typeof this.props.defaultValue !== 'undefined' ) ? ( this.props.defaultValue === value ) : true;

                this.setState( {
                    inputValid  : inputValid,
                    chosenIndex : index
                } );

                if( this.props.type === 'select' ) {
                    this.setState( state => {
                        const selectList = {
                            ...state.selectList,
                            open     : false,
                            overflow : undefined
                        };

                        return {
                            selectList
                        };                     
                    } );
                }

                this.props.onChange( {
                    index : this.props.index,
                    valid : inputValid,
                    value
                } );
            }
        }

        handleSelectTop( event )
        {
            // TODO
            // insert all the "not-chosen" list elements into a separate div (in order to be able to give them some shadow)
            // when clicking outside the list, make sure to close it
            // https://stackoverflow.com/questions/32553158/detect-click-outside-react-component

            if( !this.props.disabled )
            {
                const bodyScrollHeight = document.body.scrollHeight;
                const currentNode      = event.target;

                this.setState( state => {
                    const selectList = {
                        ...state.selectList,
                        open : !state.selectList.open
                    };

                    return {
                        selectList
                    };
                }, () => {
                    if( this.state.selectList.open )
                    {
                        const listNode = currentNode.closest( '.select-current' ).nextElementSibling;

                        if( listNode !== null )
                        {
                            const listNodeOffsetBtm = document.body.parentElement.scrollTop + listNode.getBoundingClientRect().top + listNode.offsetHeight;
                            const overflowDirection = listNodeOffsetBtm > bodyScrollHeight ? 'top' : 'bottom';

                            this.setState( state => {
                                const selectList = {
                                    ...state.selectList,
                                    overflow : overflowDirection
                                };

                                return {
                                    selectList
                                }
                            } );
                        }
                    }
                } );
            }
        }

        componentDidMount()
        {
            if( this.props.type === 'select' )
            {
                this.handleSelectTop = this.handleSelectTop.bind( this );
            }
        }

        render()
        {
            const wrapperClassName = ( 'wrapper' + ' ' + ( this.props.error ? 'on-form-error' : '' ) + ' ' + ( this.state.inputValid ? '' : 'on-input-invalid' ) ).trim().replace( /\s+/g, ' ' );
            const labelClassName   = ( ( this.props.disabled ? 'on-input-disabled' : '' ) + ' ' + ( this.state.inputFocus ? 'on-input-focus' : '' ) + ' ' + ( this.state.inputNonEmpty ? 'on-input-non-empty' : '' ) ).trim().replace( /\s+/g, ' ' );

            return (
                <div className={ ( wrapperClassName !== "" ) ? wrapperClassName : undefined }>
                    <label className={ ( labelClassName !== "" ) ? labelClassName : undefined }>{ this.props.label }</label>
                    { this.props.type === 'text' &&
                        <input maxLength={ this.props.maxLength } type="text" spellCheck="false" autoComplete="off" onFocus={ this.handleFocus } onBlur={ this.handleBlur } onChange={ this.handleChange } disabled={ this.props.disabled } />
                    }
                    { this.props.type === 'radio' &&
                        <ul className="input-list radio-list">
                        {
                            this.props.options.map( ( option, index ) =>
                                <li className={ ( "radio-item "  +  ( this.state.chosenIndex === index ? "chosen" : "" ) + " " + ( this.props.disabled ? "disabled" : "" ) ).trim() } key={ index }>
                                    <div className="radio" onClick={ this.handleOption.bind( this, index, option ) } />
                                    <span>{ option }</span>
                                </li>
                            )
                        }
                        </ul>
                    }
                    { this.props.type === 'select' &&
                        <div className="select-wrapper">
                            <div className="select-current" onClick={ this.handleSelectTop.bind( this ) }>
                                <span>{ this.state.chosenIndex >= 0 ? this.props.options[ this.state.chosenIndex ] : '' }</span>
                                <i className="material-icons">
                                    { ( this.state.selectList.open ) ? 'keyboard_arrow_up' : 'keyboard_arrow_down' }
                                </i>
                            </div>
                            { this.props.type === 'select' && this.state.selectList.open &&
                                <ul className={ ( "select-list " + this.state.selectList.overflow ).trim() } >
                                    { this.props.options.map( ( option, index ) => {
                                        if( index !== this.state.chosenIndex )
                                        {
                                            return (
                                                <li key={ index } className="select-option" onClick={ this.handleOption.bind( this, index, option ) }>
                                                    <span>{ option }</span>
                                                </li>
                                            );
                                        }
                                        else
                                        {
                                            return '';
                                        }
                                    } ) }
                                </ul>
                            }
                        </div>
                    }
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
                inputs       : this.props.task.data.map( ( input ) => {
                    return {
                        valid : false
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

                this.props.onFinish( {
                    index : this.props.index,
                    type  : this.props.task.type,
                    stats : this.state.stats
                } );
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
                        comment
                    }

                    return {
                        stats
                    };
                } );
            }
        }

        handleInputChange( input )
        {
            if( this.state.taskStarted && !this.state.taskFinished )
            {
                this.setState( state => {
                    const inputs = state.inputs.map( ( item, itemIndex ) => {
                        if( itemIndex === input.index )
                        {
                            return {
                                ...item,
                                valid: input.valid
                            };
                        }

                        return item;
                    } );

                    return {
                        inputs
                    };
                }, () => {
                    if( this.state.inputs.filter( item => !item.valid ).length === 0 )
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

            for( let k = 0; k < inputs.length; k++ )
            {
                inputs[ k ].value = this.props.task.data[ k ].defaultValue;
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
                                            <td>{ row.label }</td>
                                            <td>{ row.defaultValue }</td>
                                        </tr>
                                    )
                                }
                            </tbody>
                        </table>
                        <button onClick={ this.handleStart } disabled={ this.state.taskStarted }>Rozpocznij ćwiczenie</button>
                        <section className={ "form " + this.props.task.type }>
                            <h3>{ this.props.task.title }</h3>
                            { this.state.taskStarted && !this.state.taskFinished &&
                                <i className="material-icons insert-everything" onClick={ this.insertEverything.bind( this ) }>keyboard</i>
                            }
                            {
                                this.state.inputs.map( ( input, index ) =>
                                    <InputWrapper key={ index } index={ index } error={ this.state.taskError && this.state.taskStarted } disabled={ this.state.taskFinished || !this.state.taskStarted } onChange={ this.handleInputChange } { ...input } {...this.props.task.data[ index ] } />
                                )
                            }
                            { this.state.taskError &&
                                <Paragraph class="on-form-error" content="Aby przejść dalej, popraw pola wyróżnione **tym kolorem.**" />
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
                                        <li className={ ( "seq-item radio-item " + ( this.state.stats.rating === key + 1  ? "chosen" : "" ) + " " + ( this.state.nextTask ? "disabled" : "" ) ).trim().replace( /\s+/g, ' ' ) } key={ key }>
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
                                            <div className="radio" onClick={ this.handleRatingChange.bind( this, key + 1 ) } />
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
                        { typeof this.props.scenario.intro !== 'undefined' &&
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
                                                <h4>{ question.text } *</h4>
                                                <ul>
                                                    { question.answers.map( ( answer, aIndex ) =>
                                                        <li className={ ( "radio-item " + ( question.chosenAnswer === aIndex ? "chosen" : "" ) + " " + ( this.state.nextScenario ? "disabled" : "" ) ).trim().replace( /\s+/g, ' ' ) } key={ aIndex }>
                                                            <div className="radio" onClick={ this.handleSummaryQuestion.bind( this, qIndex, aIndex ) } />
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
                return '';
            }
        }
    }

    class MainComponent extends React.Component {
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
                            type      : 'text',
                            label     : 'Imię',
                            id        : 'firstName',
                            value     : '',
                            regex     : /^[a-ząćęłńóśźż]+$/i,
                            maxLength : 32,
                            valid     : false
                        },
                        {
                            type      : 'text',
                            label     : 'E-mail',
                            id        : 'email',
                            value     : '',
                            regex     : emailRegex,
                            maxLength : 128,
                            valid     : false
                        },
                        {
                            type      : 'text',
                            label     : 'Rok urodzenia',
                            id        : 'birthYear',
                            value     : '',
                            regex     : /^\d{4}$/,
                            maxLength : 4,
                            valid     : false
                        },
                        {
                            type    : 'radio',
                            label   : 'Płeć',
                            id      : 'sex',
                            value   : '',
                            options : [ 'Mężczyzna', 'Kobieta' ],
                            valid     : false
                        },
                        {
                            type    : 'select',
                            label   : 'Wykształcenie',
                            id      : 'education',
                            value   : '',
                            options : [ 'Podstawowe', 'Gimnazjalne', 'Zasadnicze zawodowe', 'Zasadnicze branżowe', 'Średnie branżowe', 'Średnie', 'Wyższe', 'Żadne z powyższych' ],
                            valid   : false
                        }
                    ]
                },
                output : {
                    results : {
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
            fetch( './json/test-all.json' )
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

        backToTop()
        {
            window.scrollTo( 0, 0 );
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

        handleFormChange( input )
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
                            results : {
                                ...state.output.results,
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
                    const scenarios = state.output.results.scenarios;
                    scenarios.push( data );

                    return {
                        ...state,
                        output : {
                            ...state.output,
                            results : {
                                ...state.output.results,
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
            if( this.state.form.data.filter( input => !input.valid ).length > 0 )
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
                            results : {
                                ...state.output.results,
                                endTime : new Date().getTime()
                            }
                        }
                    }
                }, () => {
                    let output     = this.state.output;
                    const userData = this.state.form.data.map( ( input ) => {
                        const item       = {};
                        item[ input.id ] = input.value;

                        return item;
                    } );

                    output = {
                        ...output,
                        user : userData
                    };

                    console.log( output );
                } );
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
                            <section>
                                <Paragraph content="Witaj! Niniejsze badanie ma na celu zbadanie użyteczności wybranych wzorców pól, które możesz na co dzień znaleźć w wielu aplikacjach webowych i na stronach internetowych. Zostaniesz poproszony o wykonanie kilkunastu zadań polegających na uzupełnieniu różnego typu formularzy. **Ten tekst jeszcze się zmieni.**" />
                                <button onClick={ this.handleStart } disabled={ this.state.testStarted }>Rozpocznij badanie</button>
                            </section>
                            { scenarios.map( ( scenario, index ) =>
                                <Scenario key={ index } index={ index + 1 } testStarted={ this.state.testStarted } currentIndex={ this.state.currentScenarioIndex } lastIndex={ this.state.scenarios.length } scenario={ scenario } onFinish={ this.handleScenarioFinish } nodeRef={ this.childNodeRef } />
                            ) }
                            { !this.state.allScenariosFinished &&
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
        <MainComponent />,
        document.getElementById( 'root' )
    );
};