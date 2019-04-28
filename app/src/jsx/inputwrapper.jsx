class InputWrapper extends React.Component {
    constructor( props )
    {
        super( props );
        this.state = {
            inputValid : this.props.optional
                            ? true
                            : ( typeof this.props.initialValue !== 'undefined' && typeof this.props.expectedValue !== 'undefined'
                                ? this.props.initialValue === this.props.expectedValue
                                : false )
        };

        this.inputMaxLength = ( typeof this.props.maxLength !== "undefined" )
                            ? this.props.maxLength
                            : ( this.props.type === 'textarea' )
                                ? globals.maxLength.textarea
                                : globals.maxLength.input;

        this.handleLabel    = this.handleLabel.bind( this );

        if( this.props.type === 'inc-dec' )
        {
            this.state = {
                ...this.state,
                chosenIndex : ( typeof this.props.initialValue !== 'undefined' ? this.props.initialValue : this.props.minValue )
            };

            this.handleOption = this.handleOption.bind( this );
        }

        if( this.props.type === 'toggle-switch' || this.props.type === 'toggle-btn' )
        {
            this.state = {
                ...this.state,
                chosenIndex : ( typeof this.props.initialValue !== 'undefined' ? this.props.options.indexOf( this.props.initialValue ) : 0 )
            }
        }

        if( this.props.type === 'mask' || this.props.type === 'textarea' || this.props.type === 'text' || ( this.props.type === 'select' && this.props.otherOption ) )
        {
            this.handleFocus  = this.handleFocus.bind( this );
            this.handleBlur   = this.handleBlur.bind( this );
            this.handleChange = this.handleChange.bind( this );

            this.state = {
                ...this.state,
                inputFocus     : false,
                inputNonEmpty  : false,
                inputValue     : '',
                inputLength    : 0
            };
        }

        if( this.props.type === 'select' )
        {
            this.state = {
                ...this.state,
                selectList : {}
            };

            this.handleClickOutside = this.handleClickOutside.bind( this );
            this.handleSelect       = this.handleSelect.bind( this );
        }
    }

    handleClickOutside( e )
    {
        if( this.props.disabled || this.node.contains( e.target ) )
        {
            return;
        }

        if( this.props.type === 'select' && this.state.selectList.open )
        {
            this.handleSelect();
        }
    }

    handleFocus()
    {
        if( !this.props.disabled )
        {
            this.setState( {
                inputFocus : true
            } );
        }
    }

    handleBlur()
    {
        if( !this.props.disabled )
        {
            this.setState( {
                inputFocus    : false,
                inputNonEmpty : ( this.state.inputValue !== '' )
            } );
        }
    }

    handleLabel()
    {
        if( !this.props.disabled && typeof this.node !== 'undefined' )
        {
            this.node.focus();
        }
    }

    handleChange( event )
    {
        if( !this.props.disabled )
        {
            const eventType   = event.type;
            const inputValue  = event.target.value;
            const inputValid  = this.props.optional
                                ? true
                                : ( ( typeof this.props.expectedValue !== 'undefined' )
                                    ? ( this.props.expectedValue === inputValue )
                                    : ( ( typeof this.props.regex !== 'undefined' )
                                        ? this.props.regex.test( inputValue )
                                        : ( inputValue !== '' ) ) );
            this.setState( {
                inputValue  : inputValue,
                inputValid  : inputValid,
                inputLength : inputValue.length
            }, () => {
                if( eventType === 'triggerChange' )
                {
                    this.handleBlur();
                }
            } );

            this.props.onChange( {
                index : this.props.index,
                value : inputValue,
                valid : inputValid
            } );
        }
    }

    handleOption( optionIndex, optionValue )
    {
        if( !this.props.disabled )
        {
            const otherOptionChosen = ( this.props.type === 'select' && this.props.otherOption && optionIndex === this.props.options.length - 1 );
            const inputValid        = ( typeof this.props.expectedValue !== 'undefined' )
                                        ? ( this.props.expectedValue === optionValue )
                                        : ( otherOptionChosen
                                            ? ( this.state.inputValue !== '' )
                                            : true );

            this.setState( {
                inputValid        : inputValid,
                chosenIndex       : optionIndex
            } );

            if( this.props.type === 'select' )
            {
                this.setState( {
                    otherOptionChosen : otherOptionChosen,
                } );

                this.handleSelect();
            }

            this.props.onChange( {
                index : this.props.index,
                valid : inputValid,
                value : optionValue
            } );
        }
    }

    handleIncDec( increment = true )
    {
        if( !this.props.disabled )
        {
            const value = increment ? ( this.state.chosenIndex + 1 ) : ( this.state.chosenIndex - 1 );

            if( value >= this.props.minValue && value <= this.props.maxValue)
            {
                this.handleOption( value, value );
            }
        }
    }

    handleSelect( event )
    {
        if( !this.props.disabled )
        {
            const bodyScrollHeight = document.body.scrollHeight;
            const currentNode      = ( typeof event !== 'undefined' ) ? event.target : '';

            if( !this.state.selectList.open )
            {
                document.addEventListener( 'click', this.handleClickOutside, false );
            }
            else
            {
                document.removeEventListener( 'click', this.handleClickOutside, false );
            }

            this.setState( state => {
                return {
                    selectList : {
                        ...state.selectList,
                        open     : !state.selectList.open,
                        overflow : undefined
                    }
                };
            }, () => {
                if( this.state.selectList.open )
                {
                    const listNode = currentNode.closest( '.select-current' ).nextElementSibling;

                    if( listNode !== null )
                    {
                        const listNodeOffsetBtm = document.body.parentElement.scrollTop + listNode.getBoundingClientRect().top + listNode.offsetHeight;
                        const overflowDirection = ( listNodeOffsetBtm > bodyScrollHeight ) ? 'top' : 'bottom';

                        this.setState( state => {
                            return {
                                selectList : {
                                    ...state.selectList,
                                    overflow : overflowDirection
                                }
                            };
                        } );
                    }
                }
            } );
        }
    }

    componentDidMount()
    {
        if( this.props.type === 'text' )
        {
            const _self = this;

            this.node.addEventListener( 'triggerChange', function( event ) {
                _self.handleChange( event );
            } );
        }
    }

    render()
    {
        const wrapperClassName = ( 'wrapper' + ' ' + ( this.props.error ? 'on-form-error' : '' ) + ' ' + ( this.state.inputValid ? '' : 'on-input-invalid' ) + ' ' + ( typeof this.props.wrapperClass !== 'undefined' ? this.props.wrapperClass : '' ) ).trim().replace( /\s+/g, ' ' );
        const labelClassName   = ( ( this.props.disabled ? 'on-input-disabled' : '' ) + ' ' + ( this.state.inputFocus ? 'on-input-focus' : '' ) + ' ' + ( this.state.inputNonEmpty ? 'on-input-non-empty' : '' ) ).trim().replace( /\s+/g, ' ' );

        return (
            <div className={ ( wrapperClassName !== "" ) ? wrapperClassName : undefined }>
                <label className={ ( labelClassName !== "" ) ? labelClassName : undefined } onClick={ this.handleLabel }>
                    { this.props.label }
                    { this.props.optional &&
                        " *"
                    }
                </label>
                { this.props.type === 'mask' &&
                    <window.ReactInputMask maxLength={ this.inputMaxLength } type="text" spellCheck="false" autoComplete="off" onFocus={ this.handleFocus } onBlur={ this.handleBlur } onChange={ this.handleChange } disabled={ this.props.disabled } value={ this.state.inputValue } mask={ this.props.mask } maskChar={ null }/>
                }
                { this.props.type === "text" &&
                    <input ref={ node => this.node = node } maxLength={ this.inputMaxLength } type="text" spellCheck="false" autoComplete="off" onFocus={ this.handleFocus } onBlur={ this.handleBlur } onChange={ this.handleChange } disabled={ this.props.disabled } value={ this.state.inputValue }/>
                }
                { this.props.type === "inc-dec" &&
                    <p className="inc-dec">
                        <i className={ "material-icons " + ( ( this.props.disabled || this.state.chosenIndex === this.props.minValue ) ? "disabled" : "" ) } onClick={ this.handleIncDec.bind( this, false ) }>remove</i>
                        <span className={ ( this.props.disabled ? "disabled" : undefined ) }>{ this.state.chosenIndex }</span>
                        <i className={ "material-icons " + ( ( this.props.disabled || this.state.chosenIndex === this.props.maxValue  ) ? "disabled" : "" ) } onClick={ this.handleIncDec.bind( this, true ) }>add</i>
                    </p>
                }
                { this.props.type === "textarea" &&
                    <textarea ref={ node => this.node = node } spellCheck="false" maxLength={ this.inputMaxLength } disabled={ this.props.disabled } onFocus={ this.handleFocus } onChange={ this.handleChange } onBlur={ this.handleBlur } />
                }
                { this.props.type === "toggle-btn" && this.props.options.length === 2 &&
                    <button className={ ( "toggle " + ( this.state.chosenIndex === 1 ? "on" : "off" ) ).trim()  } onClick={ this.handleOption.bind( this, 1 - this.state.chosenIndex, this.props.options[ 1 - this.state.chosenIndex ] ) } disabled={ this.props.disabled }>
                        { this.props.options[ this.state.chosenIndex ] }
                    </button>
                }
                { this.props.type === "toggle-switch" && this.props.options.length === 2 &&
                    <div className={ ( "toggle-switch "  + ( this.state.chosenIndex === 1 ? "on" : "off" ) + " " + ( this.props.disabled ? "disabled" : "" ) ).trim().replace( /\s+/g, " " ) }  onClick={ this.handleOption.bind( this, 1 - this.state.chosenIndex, this.props.options[ 1 - this.state.chosenIndex ] ) }/>
                }
                { this.props.type === "radio" &&
                    <ul className="input-list radio-list">
                    {
                        this.props.options.map( ( option, index ) =>
                            <li className={ ( "radio-item "  +  ( this.state.chosenIndex === index ? "chosen" : "" ) + " " + ( this.props.disabled ? "disabled" : "" ) ).trim().replace( /\s+/g, " " ) } key={ index }>
                                <div className="radio" onClick={ this.handleOption.bind( this, index, option ) } />
                                <span>{ option }</span>
                            </li>
                        )
                    }
                    </ul>
                }
                { this.props.type === "select" &&
                    <div className="select-wrapper">
                        <div className={ ( "select-current " + ( this.props.disabled ? "disabled" : "" ) + " " + ( this.state.selectList.open ? "focus" : "" ) ).trim().replace( /\s+/g, " " ) } onClick={ this.handleSelect }>
                            <span>{ this.state.chosenIndex >= 0 ? this.props.options[ this.state.chosenIndex ] : "" }</span>
                            <i className="material-icons">
                                { ( this.state.selectList.open ) ? "keyboard_arrow_up" : "keyboard_arrow_down" }
                            </i>
                        </div>
                        { this.state.selectList.open &&
                            <ul className={ ( "select-list " + this.state.selectList.overflow ).trim() }  ref={ node => this.node = node }>
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
                                        return "";
                                    }
                                } ) }
                            </ul>
                        }
                        { this.state.otherOptionChosen &&
                            <input ref={ node => this.node = node } className="select-other" maxLength={ this.inputMaxLength } type="text" spellCheck="false" autoComplete="off" disabled={ this.props.disabled } onFocus={ this.handleFocus } onBlur={ this.handleBlur } onChange={ this.handleChange } value={ this.state.inputValue }/>
                        }
                    </div>
                }
                <div className="notes-wrapper">
                    { this.props.type === "textarea" &&
                        <p className="note">
                            Pozostało znaków: <span className="text-important">{ this.inputMaxLength - this.state.inputLength }</span>
                        </p>
                    }
                    { this.props.optional &&
                        <p className="note">* Pole opcjonalne</p>
                    }
                </div>
            </div>
        );
    }
}