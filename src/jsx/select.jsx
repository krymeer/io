class Select extends React.Component {
    constructor( props )
    {
        super( props );

        this.currentNodeHeight = 35;

        this.state = {
            list : {}
        };

        this.handleSelect        = this.handleSelect.bind( this );
        this.handleCurrentHeight = this.handleCurrentHeight.bind( this );
        this.handleOverflow      = this.handleOverflow.bind( this );
        this.handleClickOutside  = this.handleClickOutside.bind( this );

        if( this.props.selectFiltered )
        {
            const options = this.props.options;

            if( typeof options !== 'undefined' )
            {
                this.state = {
                    ...this.state,
                    list : {
                        ...this.state.list,
                        filtered : this.props.options
                    }
                };
            }

            this.handleFilterFocus  = this.handleFilterFocus.bind( this );
            this.handleFilterChange = this.handleFilterChange.bind( this );
            this.handleFilterBlur   = this.handleFilterBlur.bind( this );
        }
    }

    handleClickOutside( event )
    {
        if( this.props.disabled || this.listNode.contains( event.target ) )
        {
            return;
        }

        if( this.state.list.open )
        {
            this.handleSelect();
        }
    }

    getListFiltered( eventTarget )
    {
        if( !this.props.disabled && eventTarget )
        {
            const bodyScrollHeight = document.body.scrollHeight;
            const listFiltered     = this.props.options.filter( ( option ) => {
                const optLowerCase = option.toLowerCase();
                const matches      = eventTarget.value.toLowerCase().replace( /\s+/g, ' ' ).split( ' ' ).map( ( str ) => {
                    return optLowerCase.indexOf( str ) !== -1
                } );

                return matches.filter( match => match === false ).length === 0;
            } );

            this.setState( state => {
                return {
                    ...state,
                    list : {
                        ...state.list,
                        filtered : listFiltered
                    }
                };
            }, () => {
                this.handleOverflow( eventTarget, bodyScrollHeight );
            } );
        }
    }

    handleFilterFocus( event )
    {
        if( !this.props.disabled )
        {
            this.props.onInputFocus();
            this.getListFiltered( event.target );
            this.handleSelect( event );
        }
    }

    handleFilterChange( event )
    {
        if( !this.props.disabled )
        {
            this.props.onInputChange( event );
            this.getListFiltered( event.target );
        }
    }

    handleFilterBlur( event )
    {
        if( !this.props.disabled )
        {
            this.props.onInputBlur();
            this.handleSelect( event );
        }
    }

    handleOverflow( eventTarget, bodyScrollHeight )
    {
        if( !this.props.disabled && this.state.list.open && typeof eventTarget !== 'undefined' )
        {
            const listNode = this.props.selectFiltered ? eventTarget.nextElementSibling : eventTarget.closest( '.select-current' ).nextElementSibling;

            if( listNode !== null )
            {
                const listNodeOffsetBtm = document.body.parentElement.scrollTop + eventTarget.getBoundingClientRect().bottom + listNode.offsetHeight;
                const overflowDirection = ( listNodeOffsetBtm > bodyScrollHeight ) ? 'top' : 'bottom';

                this.setState( state => {
                    return {
                        list : {
                            ...state.list,
                            overflow : overflowDirection
                        }
                    };
                } );
            }
        }
    }

    handleCurrentHeight( eventTarget )
    {
        if( !this.props.disabled && this.currentNode )
        {
            const currentNodePadding = 2 * parseFloat( window.getComputedStyle( this.currentNode ).getPropertyValue( 'padding-top' ) );

            this.currentNode.style.height = Math.max(
                this.currentNode.children[ 0 ].offsetHeight + currentNodePadding,
                this.currentNodeHeight
            ) + 'px';
        }
    }

    handleSelect( event )
    {
        if( !this.props.disabled )
        {
            const eventTarget      = ( typeof event !== 'undefined' ) ? event.target : undefined;
            const bodyScrollHeight = document.body.scrollHeight;

            if( !this.props.selectFiltered )
            {
                if( !this.state.list.open )
                {
                    document.addEventListener( 'click', this.handleClickOutside, false );
                }
                else
                {
                    document.removeEventListener( 'click', this.handleClickOutside, false );
                }
            }

            this.setState( state => {
                return {
                    list : {
                        ...state.list,
                        open     : !state.list.open,
                        overflow : ""
                    }
                };
            }, () => {
                if( !this.state.list.open )
                {
                    this.handleCurrentHeight();
                }

                this.handleOverflow( eventTarget, bodyScrollHeight );
            } );
        }
    }

    handleOptionFiltered( option )
    {
        if( !this.props.disabled )
        {
            const inputNode = this.listNode.previousElementSibling;

            if( inputNode !== null )
            {
                inputNode.value = option;
                this.props.onInputChange();
            }
        }
    }

    handleOption( optionIndex, optionValue )
    {
        if( !this.props.disabled )
        {
            const otherOptionChosen = ( this.props.otherOption && optionIndex === this.props.options.length - 1 );
            const selectIndex       = ( this.props.selectIndex !== 'undefined' ) ? this.props.selectIndex : -1;

            this.setState( {
                otherOptionChosen : otherOptionChosen
            } );

            this.handleSelect();
            this.props.onOption( optionIndex, optionValue, otherOptionChosen, selectIndex );
        }
    }

    render()
    {
        return(
            <div className={ ( "select-wrapper " + ( typeof this.props.class !== "undefined" ? this.props.class : "" ) ).trim() }>
                { this.props.selectFiltered &&
                    <input className="select-filter" ref={ this.props.inputNodeRef } maxLength={ this.props.inputMaxLength } type="text" spellCheck="false" autoComplete="off" disabled={ this.props.disabled } onFocus={ this.handleFilterFocus } onChange={ this.handleFilterChange } onBlur={ this.handleFilterBlur } value={ this.props.inputValue } />
                }
                { !this.props.selectFiltered &&
                    <div ref={ currentNode => this.currentNode = currentNode } className={ ( "select-current " + ( this.props.disabled ? "disabled" : "" ) + " " + ( this.state.list.open ? "focus" : "" ) ).trim().replace( /\s+/g, " " ) } onClick={ this.handleSelect }>
                        <span>{ this.props.chosenIndex >= 0 ? this.props.options[ this.props.chosenIndex ] : "" }</span>
                        <i className="material-icons">
                            { ( this.state.list.open ) ? "keyboard_arrow_up" : "keyboard_arrow_down" }
                        </i>
                    </div>
                }
                { this.state.list.open &&
                    <ul className={ ( "select-list " + this.state.list.overflow + " " + ( ( typeof this.state.list.filtered !== "undefined" && this.state.list.filtered.length === 0 ) ? "empty" : "" ) ).trim().replace( /\s+/g, " " ) } ref={ listNode => this.listNode = listNode }>
                        { this.props.options.map( ( option, index ) => {
                            if( this.props.selectFiltered && typeof this.state.list.filtered !== "undefined" && this.state.list.filtered.indexOf( option ) !== -1 )
                            {
                                return (
                                    <li key={ index } className="select-option" onMouseDown={ this.handleOptionFiltered.bind( this, option ) }>
                                        <span>{ option }</span>
                                    </li>
                                );
                            }
                            else if( !this.props.selectFiltered && index !== this.props.chosenIndex )
                            {
                                return (
                                    <li key={ index } className="select-option" onClick={ this.handleOption.bind( this, index, option ) }>
                                        <span>{ option }</span>
                                    </li>
                                );
                            }
                            else
                            {
                                return "";
                            }
                        } ) }
                    </ul>
                }
                { !this.props.selectFiltered && this.state.otherOptionChosen &&
                    <input className="select-other" ref={ this.props.inputNodeRef } maxLength={ this.props.inputMaxLength } type="text" spellCheck="false" autoComplete="off" disabled={ this.props.disabled } onFocus={ this.props.onInputFocus } onBlur={ this.props.onInputBlur } onChange={ this.props.onInputChange } value={ this.props.inputValue }/>
                }
            </div>
        );
    }
}