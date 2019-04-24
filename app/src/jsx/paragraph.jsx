class Paragraph extends React.Component {
    constructor( props )
    {
        super( props );
    }

    render()
    {
        return (
            <p ref={ this.props.nodeRef } className={ this.props.class }>
                { extractTextImportant( this.props.content ) }
            </p>
        );
    }
}