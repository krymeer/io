window.onload = function() {
    function FancyBorder( props ) {
        return (
            <div className={ 'fancyborder' } style={{ border : '2px solid ' + props.color }} >
                { props.children }
            </div>
        )
    }

    function Dialog( props )
    {
        return (
            <FancyBorder color="magenta">
                <h1 className="dialog-title">
                    { props.title }
                </h1>
                <p className="dialog-message">
                    { props.message }
                </p>
            </FancyBorder>
        );
    }

    function WelcomeDialog()
    {
        return (
            <Dialog 
              title="Welcome"
              message="Thank you for visiting our spacecraft!" />
        );
    }

    ReactDOM.render(
        <WelcomeDialog />,
        document.getElementById( 'root' )
    );


}