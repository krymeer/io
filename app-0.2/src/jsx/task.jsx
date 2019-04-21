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

    // TEMPORARY: Insert all the data by clicking only one button
    insertEverything( e )
    {
        const inputs = e.target.parentElement.querySelectorAll( 'input' );
        const _self  = this;

        for( let k = 0; k < inputs.length; k++ )
        {
            inputs[ k ].value = _self.props.task.data[ k ].defaultValue;
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
                                <InputWrapper wrapperClass="comment-wrapper" label="Czy masz jakieś uwagi lub sugestie związane z powyższym ćwiczeniem?" optional={ true } type="textarea" disabled={ this.state.nextTask } onChange={ this.handleCommentChange } />
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