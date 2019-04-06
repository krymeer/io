window.onload = function() {
    function SplitPane( props )
    {
        return (
            <div className="splitpane">
                <div className="splitpane-left">
                    { props.left }
                </div>
                <div className="splitpane-right">
                    { props.right }
                </div>
            </div>
        );
    }

    function Chat()
    {
        return ( 
            <textarea value="Lorem ipsum dolor sit amet" />
        );
    }

    function Contacts()
    {
        return (
            <ul>
                <li>Contact #1</li>
                <li>Contact #2</li>
            </ul>
        );
    }

    function App()
    {
        return (
            <SplitPane left={ <Contacts /> } right={ <Chat/> } />
        );
    }

    ReactDOM.render( 
        <App />,
        document.getElementById( 'root' )
    );
}