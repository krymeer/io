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
                    valid : ( typeof input.initialValue !== 'undefined' && typeof input.expectedValue !== 'undefined' ) ? ( input.initialValue === input.expectedValue ) : false
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

    handleGeolocation()
    {
        if( 'geolocation' in navigator )
        {
            navigator.geolocation.getCurrentPosition( position => {
                this.handlePosition( position.coords.latitude, position.coords.longitude );
            } )
        }
        else
        {
            this.setState( {
                alert : {
                    type : 'warning',
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

            if( this.props.task.type === 'geolocation' )
            {
                this.handleGeolocation();
            }
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
                ...this.state.stats
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

    handleCommentChange( input )
    {
        if( this.state.taskFinished && !this.state.nextTask )
        {
            this.setState( state => {
                const stats = {
                    ...state.stats,
                    comment : input.value
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
                <section className="task" onClick={ this.handleClick } ref={ this.props.nodeRef }>
                    <h2>Ćwiczenie nr { this.props.index }</h2>
                    <Paragraph class="task-description" content="Wypełnij formularz, korzystając z danych zawartych **w poniższej tabeli:**" />
                    <table ref={ ( this.state.taskStarted ) ? this.childNodeRef : undefined }>
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
                                        <td>{ row.label }</td>
                                        <td>
                                            { Array.isArray( row.expectedValue ) && typeof row.separator !== "undefined"
                                            ? ( row.expectedValue.join( row.separator ) )
                                            : ( row.anyValue
                                                ? <em>dowolna*</em>
                                                : row.expectedValue ) }
                                        </td>
                                    </tr>
                                )
                            }
                        </tbody>
                        { ( this.props.task.data.filter( row => row.anyValue ).length > 0 ) &&
                            <tfoot>
                                <tr>
                                    <td className="note" colSpan="2">
                                        *) Każda niepusta wartość, która jest zgodna z treścią scenariusza.
                                    </td>
                                </tr>
                            </tfoot>
                        }
                    </table>
                    <button onClick={ this.handleStart } disabled={ this.state.taskStarted }>Rozpocznij ćwiczenie</button>
                    <section ref={ formWrapperNode => this.formWrapperNode = formWrapperNode } className={ "form " + this.props.task.classes }>
                        { this.state.alert &&
                            <Paragraph content={ this.state.alert.msg } class={ "alert " + this.state.alert.type } />
                        }
                        <h3>{ this.props.task.title }</h3>
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
                                Jaki jest, Twoim zdaniem, poziom trudności powyższego ćwiczenia?
                            </h3>
                            <ul className="seq-radios">
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
                            { this.state.stats.rating > 0 &&
                                <InputWrapper wrapperClass="comment-wrapper" label={ ( typeof this.props.question !== "undefined" ) ? insertNbsp( this.props.question )  : "Co sądzisz o wprowadzaniu danych przy użyciu zaprezentowanej metody?" } optional={ true } type="textarea" disabled={ this.state.nextTask } onChange={ this.handleCommentChange } />
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

        return "";
    }
}