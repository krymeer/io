'use strict';

class Header extends React.Component {
    constructor( props )
    {
        super( props );
    }

    render()
    {
        return (
            <header>
                <h1>Hello World!</h1>
            </header>
        );
    }
}

class Main extends React.Component {
    constructor( props )
    {
        super( props );
    }

    render()
    {
        return (
            <main>
                <p>This page is only a stub, yet it is going to be my home page in the future.</p>
                <p><span className="text-blue">Stay tuned.</span> Nifty stuff will come soon.</p>
            </main>
        );
    }
}


class Footer extends React.Component {
    constructor( props )
    {
        super( props );
    }

    render()
    {
        return (
            <footer>
                <p>&copy; 2021 Krzysztof R. Osada</p>
            </footer>
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
        return (
            <div class="container">
                <Header />
                <Main />
                <Footer />
            </div>
        );
    }
}

window.addEventListener( 'load', () => {
    let wrapper = document.getElementById( 'wrapper' );

    if( wrapper !== null )
    {
        ReactDOM.render( <App/>, wrapper );
    }
} );