class Task extends React.Component {
    constructor( props )
    {
        super( props );
        this.handleAbort         = this.handleAbort.bind( this );
        this.handleClick         = this.handleClick.bind( this );
        this.handleStart         = this.handleStart.bind( this );
        this.handleFinish        = this.handleFinish.bind( this );
        this.handleNext          = this.handleNext.bind( this );
        this.handleInputChange   = this.handleInputChange.bind( this );
        this.handleRatingChange  = this.handleRatingChange.bind( this );
        this.handleCommentChange = this.handleCommentChange.bind( this );
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
                comments       : {}
            },
            inputs       : this.props.task.data.map( input => ( {
                    valid : ( typeof input.initialValue !== 'undefined' && typeof input.expectedValue !== 'undefined' ) ? ( input.initialValue === input.expectedValue ) : false
            } ) )
        };

        if( this.props.task.type.indexOf( 'speech-recognition-on' ) !== -1 )
        {
            this.state = {
                ...this.state,
                speechRecognition : {
                    values       : [ ...Array( this.props.task.data.length ) ],
                    currentIndex : -1,
                    timesClicks  : 0
                },
                stats            : {
                    ...this.state.stats,
                    speechRecognition : {
                        clicks : [ ...Array( this.props.task.data.length ) ].map( item => ( { mic : 0, times : 0 } ) )
                    }
                }
            };

            this.handleSpeechRecognitionTimesClick = this.handleSpeechRecognitionTimesClick.bind( this );
            this.handleSpeechRecognitionMicClick   = this.handleSpeechRecognitionMicClick.bind( this );
            this.handleSpeechRecognitionInterface();
        }
    }

    handleSpeechRecognitionInterface()
    {
        const rules                  = this.props.task.rules;
        this.webkitSpeechRecognition = new webkitSpeechRecognition();

        this.webkitSpeechRecognition.lang            = 'pl-PL';
        this.webkitSpeechRecognition.continuous      = true;
        this.webkitSpeechRecognition.interimResults  = true;
        this.webkitSpeechRecognition.maxAlternatives = 1;


        this.webkitSpeechRecognition.onresult = ( event ) => {
            if( this.state.speechRecognition.currentIndex < 0 || !this.state.taskStarted || this.state.taskFinished )
            {
                return false;
            }

            let transcript = event.results[ event.results.length - 1 ][ 0 ].transcript;

            if( rules )
            {
                for( let rule of rules )
                {
                    transcript = transcript.replace( new RegExp( rule.in, "gi" ), rule.out )
                }
            }

            if( this.props.numbersOnly && /^[\d\+]+$/.test( transcript ) === false )
            {
                return false;
            }

            this.setState( state => {
                return {
                    ...state,
                    speechRecognition : {
                        ...state.speechRecognition,
                        values : state.speechRecognition.values.map( ( v, i ) =>
                            ( i === state.speechRecognition.currentIndex )
                                ? transcript
                                : v
                        )
                    }
                };
            } );
        };

        this.webkitSpeechRecognition.onend = ( event ) => {
            if( this.state.speechRecognition.continue )
            {
                this.setState( state => {
                    return {
                        ...state,
                        speechRecognition : {
                            ...state.speechRecognition,
                            continue : false
                        }
                    }
                } );

                this.webkitSpeechRecognition.start();
            }
            else if( this.state.speechRecognition.currentIndex !== -1 )
            {
                this.handleSpeechRecognitionMicClick();
            }
        };
    }

    handleSpeechRecognitionMicClick( event )
    {
        if( this.props.task.type.indexOf( 'speech-recognition-on' ) !== -1 && this.state.taskStarted && !this.state.taskFinished )
        {
            const inputIndex = ( typeof event !== 'undefined' ) ? parseInt( event.target.dataset.inputIndex ) : -1;
            const otherIndex = ( inputIndex !== -1 && this.state.speechRecognition.currentIndex !== inputIndex );

            this.setState( state => {
                if( state.speechRecognition.currentIndex < 0 )
                {
                    this.webkitSpeechRecognition.start();
                }
                else
                {
                    this.webkitSpeechRecognition.abort();
                }

                return {
                    ...state,
                    speechRecognition : {
                        ...state.speechRecognition,
                        currentIndex : otherIndex ? inputIndex : -1,
                        continue     : otherIndex
                    },
                    stats : {
                        ...state.stats,
                        speechRecognition : {
                            ...state.stats.speechRecognition,
                            clicks : state.stats.speechRecognition.clicks.map( ( item, index ) => {
                                if( index !== inputIndex )
                                {
                                    return item;
                                }

                                return {
                                    ...item,
                                    mic : item.mic + 1
                                };
                            } )
                        }
                    }
                }
            } );
        }
    }

    handleSpeechRecognitionTimesClick( event )
    {
        const inputIndex = parseInt( event.target.dataset.inputIndex );

        if( this.state.speechRecognition.currentIndex !== -1 && this.state.speechRecognition.currentIndex === inputIndex && this.state.taskStarted && !this.state.taskFinished )
        {
            this.webkitSpeechRecognition.abort();

            this.setState( state => {
                return {
                    ...state,
                    speechRecognition : {
                        ...state.speechRecognition,
                        continue : true,
                        values   : state.speechRecognition.values.map( ( v, i ) =>
                            ( i === state.speechRecognition.currentIndex )
                                ? ''
                                : v
                        )
                    },
                    stats : {
                        ...state.stats,
                        speechRecognition : {
                            ...state.stats.speechRecognition,
                            clicks : state.stats.speechRecognition.clicks.map( ( item, index ) => {
                                if( index !== inputIndex )
                                {
                                    return item;
                                }

                                return {
                                    ...item,
                                    times : item.times + 1
                                };
                            } )
                        }
                    }
                }
            } );
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

    handleGeolocation()
    {
        if( 'geolocation' in navigator )
        {
            navigator.geolocation.getCurrentPosition( position => {
                this.handlePosition( position.coords.latitude, position.coords.longitude );
            }, error => {
                this.setState( {
                    geolocationError : ( error.code === error.PERMISSION_DENIED ) ? 'permissionDenied' : 'other'
                } );
            } );
        }
        else
        {
            this.setState( {
                alert : {
                    type : 'error',
                    msg  : 'Twoja przeglądarka **uniemożliwia** pobranie informacji na temat Twojej lokalizacji (szerokości i długości geograficznej) Proszę, wpisz swoje dane ręcznie.'
                }
            } );
        }
    }

    handlePosition( lat, lon )
    {
        fetch( 'https://api.opencagedata.com/geocode/v1/json?key=66599c796ba2423db096258e034bf93b&q=' + lat + '+' + lon + '&pretty=1&no_annotations=1' ).then(
            res => res.json()
        ).then( response => {
            const results = response.results ? response.results[ 0 ].components : undefined;

            if( typeof results !== 'undefined' )
            {
                const location = [
                    results.country,
                    results.state.replace( /^województwo\s+/i, '' ),
                    results.county,
                    results.city,
                    results.postcode
                ]

                const inputs = this.formWrapperNode.querySelectorAll( 'input' );

                if( inputs )
                {
                    for( let k = 0; k < inputs.length; k++ )
                    {
                        inputs[ k ].value = location[ k ];
                        inputs[ k ].dispatchEvent( new Event( 'triggerChange' ) );
                    }
                }
            }
        } ).catch( error => {
            console.error( error );
            this.setState( {
                alert : {
                    type : 'error',
                    msg  : '**Przepraszam!** Wystąpił nieznany błąd, który uniemożliwił pobranie danych o miejscu, w którym się znajdujesz. Wpisz swoje dane ręcznie.'
                }
            } );
        } );
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

            if( this.props.task.type === 'geolocation-on' )
            {
                this.handleGeolocation();
            }
        }
    }

    handleAbort()
    {
        this.handleFinish( true );
    }

    handleFinish( abort = false )
    {
        if( this.state.taskStarted && !this.state.taskFinished )
        {
            const taskAborted = ( abort === true );

            if( this.state.inputs.filter( input => !input.valid ).length === 0 || taskAborted )
            {
                if( this.props.task.type.indexOf( 'speech-recognition-on' ) !== -1 )
                {
                    if( this.state.speechRecognition.currentIndex !== -1 )
                    {
                        this.webkitSpeechRecognition.abort();
                    }

                    this.setState( state => {
                        return {
                            ...state,
                            speechRecognition : {
                                ...state.speechRecognition,
                                currentIndex : -1,
                                continue     : false
                            }
                        }
                    } );
                }

                this.setState( state => {
                    const stats = {
                        ...state.stats,
                        endTime : new Date().getTime()
                    };

                    return {
                        stats,
                        taskError    : false,
                        taskFinished : true,
                        taskAborted  : taskAborted
                    };
                } );
            }
            else
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
        }
    }

    handleNext()
    {
        if( this.state.taskStarted && this.state.taskFinished )
        {
            if( this.state.stats.rating <= 0 || ( this.state.taskAborted && !( this.state.stats.comments.taskAborted && this.state.stats.comments.taskAborted.length >= 10 ) ) )
            {
                this.setState( {
                    missingSummaryData : true
                } );
            }
            else
            {
                this.setState( {
                    nextTask           : true,
                    missingSummaryData : false
                } );

                const stats = this.state.stats;

                if( this.state.geolocationError )
                {
                    stats[ 'geolocationError' ] = this.state.geolocationError;
                }

                this.props.onFinish( {
                    index : this.props.index,
                    type  : this.props.task.type,
                    stats
                } );
            }
        }
    }

    handleRatingChange( k )
    {
        if( this.state.taskFinished && !this.state.nextTask )
        {
            if( k !== this.state.rating )
            {
                this.setState( oldState => {
                    const newState = {
                        ...oldState,
                        stats : {
                            ...oldState.stats,
                            rating : k
                        }
                    }

                    if( oldState.missingSummaryData && ( !oldState.taskAborted || ( oldState.stats.comments.taskAborted && oldState.stats.comments.taskAborted.length >= 10 ) ) )
                    {
                        newState.missingSummaryData = false;
                    }

                    return newState;
                } );
            }
        }
    }

    handleCommentChange( input )
    {
        if( this.state.taskFinished && !this.state.nextTask )
        {
            this.setState( oldState => {
                const newState = {
                    ...oldState,
                    stats : {
                        ...oldState.stats,
                        comments : {
                            ...oldState.stats.comments,
                            [ input.context ] : input.value
                        }
                    }
                };

                if( oldState.missingSummaryData && oldState.stats.rating > 0 && oldState.taskAborted && input.context === 'taskAborted' && input.value.length >= 10 )
                {
                    newState.missingSummaryData = false;
                }

                return newState;
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
                            valid : input.valid
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

    insertEverything( e )
    {
        const inputs = e.target.parentElement.querySelectorAll( 'input' );
        const _self  = this;

        for( let k = 0; k < inputs.length; k++ )
        {
            inputs[ k ].value = _self.props.task.data[ k ].expectedValue;
            inputs[ k ].dispatchEvent( new Event( 'triggerChange' ) );
        }
    }

    render()
    {
        if( this.props.scenarioStarted && this.props.currentIndex >= this.props.index )
        {
            return (
                <React.Fragment>
                    <section className="task-intro" ref={ this.props.nodeRef }>
                        <h2>Ćwiczenie { this.props.scenarioIndex }.{ this.props.index }.</h2>
                        <Paragraph class="task-description" content="Wypełnij formularz, korzystając z danych zawartych **w poniższej tabeli:**" />
                    </section>
                    <section className="task-main-container" onClick={ this.handleClick }>
                        { this.props.task.alert &&
                            <Paragraph content={ this.props.task.alert.msg } class={ "alert " + this.props.task.alert.type } />
                        }
                        <table data-for={ this.props.task.type } ref={ ( this.state.taskStarted ) ? this.childNodeRef : undefined }>
                            <thead>
                                <tr>
                                    <th>Nazwa pola</th>
                                    <th>Prawidłowa wartość</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    this.props.task.data.map( ( row, index ) =>
                                        <tr key={ index }>
                                            <td>{ insertNbsp( row.label ) }</td>
                                            <td>
                                                { Array.isArray( row.expectedValue ) && typeof row.separator !== "undefined"
                                                    ? ( row.expectedValue.join( row.separator ) )
                                                    : ( row.anyValue
                                                        ? <em>dowolna*</em>
                                                        : String( row.expectedValue ).split( '\n' ).map( ( line, lineIndex, lineArr ) => {
                                                            line = insertNbsp( line );

                                                            return ( lineIndex < lineArr.length - 1 )
                                                                ? [
                                                                    line,
                                                                    <br key={ index } />
                                                                ]
                                                                : line;
                                                        } ) )
                                                }
                                            </td>
                                        </tr>
                                    )
                                }
                            </tbody>
                            { ( this.props.task.copy || this.props.task.data.filter( row => row.anyValue ).length > 0 ) &&
                                <tfoot>
                                    <tr>
                                        <td className="note" colSpan="2">
                                            { ( this.props.task.copy ? this.props.task.copy : (
                                                "*) Każda niepusta wartość, która jest adekwatna do nazwy danego pola."
                                            ) ) }
                                        </td>
                                    </tr>
                                </tfoot>
                            }
                        </table>
                        <button className="start" onClick={ this.handleStart } disabled={ this.state.taskStarted }>Zaczynam ćwiczenie</button>
                        <section ref={ formWrapperNode => this.formWrapperNode = formWrapperNode } className={ "form " + this.props.task.classes } data-type={ this.props.task.type }>
                            { this.state.alert &&
                                <Paragraph content={ this.state.alert.msg } class={ "alert " + this.state.alert.type } />
                            }
                            <h3>{ this.props.task.title }</h3>
                            {
                                this.state.inputs.map( ( input, index ) => {
                                    const speechRecognitionProps = ( this.props.task.type.indexOf( 'speech-recognition-on' ) !== -1 ) ? {
                                        onSpeechRecognitionTimesClick : this.handleSpeechRecognitionTimesClick,
                                        onSpeechRecognitionMicClick   : this.handleSpeechRecognitionMicClick,
                                        speechRecognition             : {
                                            currentIndex  : this.state.speechRecognition.currentIndex,
                                            inputValue    : this.state.speechRecognition.values[ index ]
                                        }
                                    } : undefined;

                                    return (
                                        <InputWrapper key={ index } index={ index } error={ this.state.taskError && this.state.taskStarted } disabled={ this.state.taskFinished || !this.state.taskStarted } onChange={ this.handleInputChange } { ...input } {...this.props.task.data[ index ] } insideTask={ true } { ...speechRecognitionProps } ignoreCaseAndLines={ this.props.task.ignoreCaseAndLines === true } ignoreAllButLetters={ this.props.task.ignoreAllButLetters === true } />
                                    );
                                } )
                            }
                            { this.state.taskError &&
                                <Paragraph class="on-form-error" content={ "Aby przejść dalej, popraw pol" + ( this.state.inputs.filter( input => !input.valid ).length === 1 ? "e" : "a" ) + " wyróżnione **tym\u00a0kolorem.**" } />
                            }
                        </section>
                        { this.state.taskStarted &&
                            <section className="button-wrapper">
                                { this.props.task.canBeAborted &&
                                    <button className="abort" onClick={ this.handleAbort } disabled={ this.state.taskFinished }>Przerywam ćwiczenie</button>
                                }
                                <button className="okay" onClick={ this.handleFinish } disabled={ this.state.taskFinished }>OK, gotowe</button>
                            </section>
                        }
                    </section>
                    { this.state.taskFinished &&
                        <section className="task-seq" ref={ this.childNodeRef }>
                            <h3 className={ ( this.state.missingSummaryData && this.state.stats.rating <= 0 ) ? "error" : undefined } >Jak byś ocenił poziom trudności powyższego ćwiczenia?</h3>
                            <ul className={ ( "seq-radios " + ( ( this.state.missingSummaryData && this.state.stats.rating <= 0 ) ? "error" : "" ) ).trim() }>
                                { [ ...Array( 7 ) ].map( ( x, key, array ) =>
                                    <li className={ ( "seq-item radio-item " + ( this.state.stats.rating === key + 1  ? "chosen" : "" ) + " " + ( this.state.nextTask ? "disabled" : "" ) ).trim().replace( /\s+/g, " " ) } key={ key }>
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
                            { this.state.taskAborted &&
                                <InputWrapper wrapperClass="comment-wrapper" ignoreValidity={ true } error={ this.state.missingSummaryData && !( this.state.stats.comments.taskAborted && this.state.stats.comments.taskAborted.length >= 10 ) } context="taskAborted" label="Dlaczego przerwałeś(-aś) powyższe ćwiczenie?" type="textarea" disabled={ this.state.nextTask } onChange={ this.handleCommentChange } />
                            }
                            <InputWrapper wrapperClass="comment-wrapper" context="taskFinished" label={ this.props.task.question ? insertNbsp( this.props.task.question ) : ( this.props.question ? insertNbsp( this.props.question ) : "Co sądzisz o wprowadzaniu danych przy użyciu zaprezentowanej metody?" ) } optional={ true } type="textarea" disabled={ this.state.nextTask } onChange={ this.handleCommentChange } />
                            { this.state.missingSummaryData &&
                                <Paragraph class="note error" content={ "Aby przejść dalej, **oceń poziom trudności powyższego ćwiczenia" + ( ( this.state.missingSummaryData && this.state.taskAborted && !( this.state.stats.comments.taskAborted && this.state.stats.comments.taskAborted.length >= 10 ) ) ? ",** a także **wyjaśnij, dlaczego zdecydowałeś(-aś) się je przerwać.**" :  ".**" ) } />
                            }
                        </section>
                    }
                    { this.state.taskFinished &&
                        <section className="button-wrapper">
                            <button onClick={ this.handleNext } disabled={ this.state.nextTask }>OK, dalej</button>
                        </section>
                    }
                </React.Fragment>
            );
        }

        return null;
    }
}