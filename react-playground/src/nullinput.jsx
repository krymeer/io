window.onload = function() {
    var node = document.getElementById( 'root' );

    ReactDOM.render(
        <input value="hi" />,
        node
    );

    setTimeout( function() {
        ReactDOM.render(
            <input value={ null } />,
            node
        );        
    }, 5000 );
}