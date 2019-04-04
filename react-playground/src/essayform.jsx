window.onload = function() {
    class EssayForm extends React.Component {
        constructor( props )
        {
            super( props );
            this.state = {
                value : 'Please write an essay about your favorite DOM element.'
            };

            this.handleChange = this.handleChange.bind( this );
            this.handleSubmit = this.handleSubmit.bind( this );
        }

        handleChange( event )
        {
            this.setState( { value : event.target.value } );
        }

        handleSubmit( event )
        {
            event.preventDefault();
            alert( 'An essay was submitted: ' + this.state.value );
        }

        render()
        {
            return (
                <form onSubmit={ this.handleSubmit }>
                    <label>
                        Essay:
                        <textarea style={{width : '300px', height: '200px', display: 'block', resize: 'none'}} value={ this.state.value } onChange={ this.handleChange } />
                    </label>
                    <input type="submit" value="Submit" />
                </form>
            );
        }
    }

    ReactDOM.render(
        <EssayForm />,
        document.getElementById( 'root' )
    );
}