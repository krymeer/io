class Select extends React.Component {
    constructor( props )
    {
        super( props );

        this.state = {
            list : {}
        }

        this.handleSelect       = this.handleSelect.bind( this );
        this.handleClickOutside = this.handleClickOutside.bind( this );
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

    handleSelect( event )
    {
        if( !this.props.disabled )
        {
            const bodyScrollHeight = document.body.scrollHeight;
            const currentNode      = ( typeof event !== 'undefined' ) ? event.target : '';

            if( !this.state.list.open )
            {
                document.addEventListener( 'click', this.handleClickOutside, false );
            }
            else
            {
                document.removeEventListener( 'click', this.handleClickOutside, false );
            }

            this.setState( state => {
                return {
                    list : {
                        ...state.list,
                        open     : !state.list.open,
                        overflow : undefined
                    }
                };
            }, () => {
                if( this.state.list.open )
                {
                    const listNode = currentNode.closest( '.select-current' ).nextElementSibling;

                    if( listNode !== null )
                    {
                        const listNodeOffsetBtm = document.body.parentElement.scrollTop + listNode.getBoundingClientRect().top + listNode.offsetHeight;
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
            } );
        }
    }

    handleOption( optionIndex, optionValue )
    {
        const otherOptionChosen = ( this.props.otherOption && optionIndex === this.props.options.length - 1 );
        const selectIndex       = ( this.props.multiSelect && typeof this.props.selectIndex !== 'undefined ' ) ? this.props.selectIndex : -1;

        this.setState( {
            otherOptionChosen : otherOptionChosen
        } );

        this.handleSelect();
        this.props.onOption( optionIndex, optionValue, otherOptionChosen, selectIndex );
    }

    render()
    {
        return(
            <div className={ ( 'select-wrapper ' + this.props.class ).trim() }>
                <div className={ ( "select-current " + ( this.props.disabled ? "disabled" : "" ) + " " + ( this.state.list.open ? "focus" : "" ) ).trim().replace( /\s+/g, " " ) } onClick={ this.handleSelect }>
                    <span>{ this.props.chosenIndex >= 0 ? this.props.options[ this.props.chosenIndex ] : "" }</span>
                    <i className="material-icons">
                        { ( this.state.list.open ) ? "keyboard_arrow_up" : "keyboard_arrow_down" }
                    </i>
                </div>
                { this.state.list.open &&
                    <ul className={ ( "select-list " + this.state.list.overflow ).trim() } ref={ listNode => this.listNode = listNode }>
                        { this.props.options.map( ( option, index ) => {
                            if( index !== this.props.chosenIndex )
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
                { this.state.otherOptionChosen &&
                    <input className="select-other" ref={ this.props.inputNodeRef } maxLength={ this.props.inputMaxLength } type="text" spellCheck="false" autoComplete="off" disabled={ this.props.disabled } onFocus={ this.props.onInputFocus } onBlur={ this.props.onInputBlur } onChange={ this.props.onInputChange } value={ this.props.inputValue }/>
                }
            </div>
        );
    }
}