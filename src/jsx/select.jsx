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
        this.handleHover         = this.handleHover.bind( this );
        this.handleKey           = this.handleKey.bind( this );

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

            this.handleFilterFocus    = this.handleFilterFocus.bind( this );
            this.handleFilterChange   = this.handleFilterChange.bind( this );
            this.handleFilterBlur     = this.handleFilterBlur.bind( this );
            this.handleFilterOption = this.handleFilterOption.bind( this );
        }
        else
        {
            this.handleOption = this.handleOption.bind( this );
            this.handleFocus  = this.handleFocus.bind( this );
            this.handleBlur   = this.handleBlur.bind( this );
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
            const eventTargetValue = eventTarget.value.toLowerCase().replace( /\s+/g, ' ' );
            const listFiltered     = ( eventTargetValue.trim() !== '' )
                                        ? this.props.options.filter( option => {
                                            const optLowerCase = option.toLowerCase();
                                            const matches      = eventTargetValue.split( ' ' ).map( ( str ) => {
                                                return optLowerCase.indexOf( str ) !== -1;
                                            } );

                                            return matches.filter( match => match === false ).length === 0;
                                        } )
                                        : undefined;

            // TODO
            // implement LCS or something similar

            this.setState( state => {
                return {
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

    handleKey( event )
    {
        if( !this.props.disabled )
        {
            if( event.key === 'Escape' || event.key === 'Enter' )
            {
                event.target.blur();
            }
            else if( event.key === 'ArrowUp' || event.key === 'ArrowDown' )
            {
                this.handleHover( event );
            }

            if( !this.props.selectFiltered )
            {
                if( event.key === 'Tab' )
                {
                    this.handleSelect( event );
                }
            }
        }

        return false;
    }

    handleHover( event )
    {
        let newHoverIndex = this.state.list.hoverIndex;
        const onHover     = event.type === 'mouseover';
        const node        = event.target.closest( 'li' );

        if( !this.props.disabled && typeof newHoverIndex !== 'undefined' )
        {

            if( event.key === 'ArrowUp' )
            {
                newHoverIndex -= 1;
            }
            else if( event.key === 'ArrowDown' )
            {
                newHoverIndex += 1;
            }
            else if( onHover && node )
            {
                newHoverIndex = Array.from( node.parentElement.children ).indexOf( node );
            }

            if( newHoverIndex < 0 )
            {
                newHoverIndex = this.props.selectFiltered ? ( this.state.list.filtered.length - 1 ) : ( this.props.options.length - 1 ) ;
            }
            else if( ( this.props.selectFiltered && newHoverIndex > this.state.list.filtered.length - 1 ) || ( !this.props.selectFiltered && newHoverIndex > this.props.options.length - 1 ) )
            {
                newHoverIndex = 0;
            }

            if( newHoverIndex !== this.state.list.hoverIndex )
            {
                if( this.props.selectFiltered )
                {
                    this.handleFilterOption( null, newHoverIndex );
                }
                else
                {
                    this.handleOption( newHoverIndex );
                }

                this.setState( state => {
                    return {
                        ...state,
                        list : {
                            ...state.list,
                            hoverIndex : newHoverIndex
                        }
                    }
                }, () => {
                    this.handleCurrentHeight();
                } );
            }
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
                    const list = {
                        ...state.list,
                        overflow : overflowDirection
                    };

                    list.hoverIndex = ( overflowDirection === 'bottom'
                                        ? -1
                                        : ( this.props.selectFiltered
                                            ? this.state.list.filtered.length
                                            : this.props.options.length )
                                        );

                    return {
                        list
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

    handleFocus( event )
    {
        if( !this.state.list.open )
        {
            this.handleSelect( event );
        }
    }

    handleBlur( event )
    {
        if( this.state.list.open )
        {
            this.handleSelect( event );
        }
    }

    handleSelect( event )
    {
        if( !this.props.disabled )
        {
            const eventTarget      = ( typeof event !== 'undefined' ) ? event.target : undefined;
            const bodyScrollHeight = document.body.scrollHeight;

            this.setState( state => {
                return {
                    list : {
                        ...state.list,
                        open     : !state.list.open,
                        overflow : ''
                    }
                };
            }, () => {
                this.handleOverflow( eventTarget, bodyScrollHeight );
            } );
        }
    }

    handleFilterOption( event, index = -1 )
    {
        if( !this.props.disabled )
        {
            // TO CHECK
            // if the event is really needed
            const inputNode = this.listNode.previousElementSibling;
            const value     = ( index !== -1 )
                                ? this.listNode.children[ index ].children[ 0 ].innerText
                                : event.target.closest( '.select-option' ).querySelector( 'span' ).innerText;

            if( inputNode && value )
            {
                inputNode.value = value;
                this.props.onInputChange();
            }
        }
    }

    handleOption( optionIndex )
    {
        if( !this.props.disabled )
        {
            const optionValue       = this.listNode.children[ optionIndex ].children[ 0 ].innerText;
            const otherOptionChosen = ( this.props.otherOption && optionIndex === this.props.options.length - 1 );
            const selectIndex       = ( this.props.selectIndex !== 'undefined' ) ? this.props.selectIndex : -1;

            this.setState( {
                otherOptionChosen : otherOptionChosen
            } );

            this.props.onOption( optionIndex, optionValue, otherOptionChosen, selectIndex );
        }
    }

    render()
    {
        return(
            <div className={ ( "select-wrapper " + ( typeof this.props.class !== "undefined" ? this.props.class : "" ) ).trim() }>
                { this.props.selectFiltered &&
                    <input onKeyDown={ this.handleKey } className="select-filter" ref={ this.props.inputNodeRef } maxLength={ this.props.inputMaxLength } type="text" spellCheck="false" autoComplete="off" disabled={ this.props.disabled } onFocus={ this.handleFilterFocus } onChange={ this.handleFilterChange } onBlur={ this.handleFilterBlur } value={ this.props.inputValue } />
                }
                { !this.props.selectFiltered &&
                    <div tabIndex="0" ref={ currentNode => this.currentNode = currentNode } className={ ( "select-current " + ( this.props.disabled ? "disabled" : "" ) + " " + ( this.state.list.open ? "focus" : "" ) ).trim().replace( /\s+/g, " " ) } onFocus={ this.handleFocus } onBlur={ this.handleBlur } onKeyDown={ this.handleKey } >
                        <span>{ this.props.chosenIndex >= 0 ? this.props.options[ this.props.chosenIndex ] : "" }</span>
                        <i className="material-icons">
                            { ( this.state.list.open ) ? "keyboard_arrow_up" : "keyboard_arrow_down" }
                        </i>
                    </div>
                }
                { this.state.list.open &&
                    <ul className={ ( "select-list " + this.state.list.overflow + " " + ( this.props.selectFiltered ? "select-list-filtered" : "" ) + " " + ( ( this.props.selectFiltered && ( typeof this.state.list.filtered === "undefined" || this.state.list.filtered ).length === 0 ) ? "empty" : "" ) ).trim().replace( /\s+/g, " " ) } ref={ listNode => this.listNode = listNode }>
                        { this.props.options.map( ( option, index ) => {
                            const realIndex = ( this.state.list.filtered ? this.state.list.filtered.indexOf( option ) : index );
                            let attrs       = {};

                            if( this.props.selectFiltered && optionFilteredIndex >= 0 )
                            {
                                attrs = {
                                    onMouseDown : this.handleFilterOption
                                };
                            }
                            else if( !this.props.selectFiltered )
                            {
                                attrs = {
                                    onClick : this.handleSelect
                                };
                            }
                            else
                            {
                                return null;
                            }

                            return (
                                <li key={ index } className={ ( "select-option " + ( this.state.list.hoverIndex === realIndex ? "hover" : "" ) ).trim() } onMouseOver={ this.handleHover } { ...attrs }>
                                    <span>{ option }</span>
                                </li>
                            );
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