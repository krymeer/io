window.onload = function() {
    class NameForm extends React.Component {
        constructor( props )
        {
            super( props );
            this.state = { nameVal : '' };

            this.handleIDChange   = this.handleIDChange.bind( this );
            this.handleNameChange = this.handleNameChange.bind( this );
            this.handleSubmit     = this.handleSubmit.bind( this );
        }

        handleNameChange( event )
        {
            this.setState( { nameVal : event.target.value } );
        }

        handleIDChange( event )
        {
            this.setState( { ID : event.target.value.toUpperCase() })
        }

        handleSubmit( event )
        {
            alert( 'A name was submitted: ' + this.state.nameVal );
            event.preventDefault();
        }

        render()
        {
            return (
                <form onSubmit={ this.handleSubmit }>
                    <label>
                        Name:
                        <input type="text" value={ this.state.nameVal } onChange={ this.handleNameChange } />
                    </label>
                    <label>
                        ID:
                        <input type="text" value={ this.state.ID } onChange={ this.handleIDChange } />
                    </label>
                    <input type="submit" value="Submit" />
                </form>
            );
        }
    }

    ReactDOM.render(
        <NameForm />,
        document.getElementById( 'root' )
    );
}