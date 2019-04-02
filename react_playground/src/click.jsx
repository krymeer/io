window.onload = function() {
    function ActionLink()
    {
        function handleClick( e )
        {
            e.preventDefault();
            alert( 'The link was clicked' );
        }

        return (
            <button onClick={handleClick}>
                Click me
            </button>
        );
    }

    ReactDOM.render(
        <ActionLink />,
        document.getElementById( 'root' )
    );
}