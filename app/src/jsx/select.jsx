class Select extends React.Component {
    render()
    {
        return(
            <div className="select-wrapper">
                <div className={ ( "select-current " + ( this.props.disabled ? "disabled" : "" ) + " " + ( this.props.open ? "focus" : "" ) ).trim().replace( /\s+/g, " " ) } onClick={ this.props.onSelect }>
                    <span>{ this.props.chosenIndex >= 0 ? this.props.options[ this.props.chosenIndex ] : "" }</span>
                    <i className="material-icons">
                        { ( this.props.open ) ? "keyboard_arrow_up" : "keyboard_arrow_down" }
                    </i>
                </div>
                { this.props.open &&
                    <ul className={ ( "select-list " + this.props.overflow ).trim() } ref={ this.props.nodeRef }>
                        { this.props.options.map( ( option, index ) => {
                            if( index !== this.props.chosenIndex )
                            {
                                return (
                                    <li key={ index } className="select-option" onClick={ this.props.onOption.bind( this, index, option ) }>
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
                { this.props.otherOptionChosen &&
                    <input className="select-other" ref={ this.props.inputNodeRef } maxLength={ this.props.inputMaxLength } type="text" spellCheck="false" autoComplete="off" disabled={ this.props.disabled } onFocus={ this.props.onInputFocus } onBlur={ this.props.onInputBlur } onChange={ this.props.onInputChange } value={ this.props.inputValue }/>
                }
            </div>
        );
    }
}