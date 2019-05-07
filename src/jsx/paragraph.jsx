class Paragraph extends React.Component {
    constructor( props )
    {
        super( props );
    }

    render()
    {
        return (
            <p ref={ this.props.nodeRef } className={ this.props.class }>
                { this.props.content.split( '\\n' ).map( ( line, index ) => [
                    parseText( line ),
                    <br key={ index } />
                ] ) }
            </p>
        );
    }
}