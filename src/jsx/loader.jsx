class Loader extends React.Component {
    constructor( props )
    {
        super( props );
    }

    render()
    {
        return (
            <div style={{ display : ( this.props.display ? "block" : "none" ) }} ref={ this.props.nodeRef } className="loader"/>
        );
    }
}