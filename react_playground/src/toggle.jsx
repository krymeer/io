window.onload = function() {
    class Toggle extends React.Component {
        constructor( props )
        {
            super( props );
            this.state = { isToggleOn : true };
            this.id    = props.id;

            // This binding is necessary to make `this` work in the callback
            this.handleClick = this.handleClick.bind( this );
        }

        handleClick()
        {
            this.setState( state => ( {
                isToggleOn : !state.isToggleOn
            } ) );
        }

        render()
        {
            return(
                <button style={{display : 'block'}} data-btn-id={ this.id } onClick={ this.handleClick }>
                    { this.state.isToggleOn ? 'ON' : 'OFF' }
                </button>
            );
        }
    }

    class App extends React.Component {
        constructor( props )
        {
            super( props );
        }

        render()
        {
            var arr = [];

            for( var k = 0; k < 9; k++ )
            {
                arr.push( <Toggle key={k} id={k} /> );
            }

            return arr;
        }
    }

    ReactDOM.render(
        <App />,
        document.getElementById( 'root' )
    );
}