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
                <textarea spellCheck="false" maxLength={ ( typeof this.props.maxLength !== "undefined" ) ? this.props.maxLength : globals.maxLength.textarea } onChange={ this.handleChange } disabled={ this.props.disabled } />
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