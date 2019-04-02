window.onload = function () {
    function UserGreeting(props) {
        return React.createElement(
            'h1',
            null,
            'Welcome back!'
        );
    }

    function GuestGreeting(props) {
        return React.createElement(
            'h1',
            null,
            'Please sign up.'
        );
    }

    function Greeting(props) {
        var isLoggedIn = props.isLoggedIn;

        if (isLoggedIn) {
            return React.createElement(UserGreeting, null);
        }

        return React.createElement(GuestGreeting, null);
    }

    ReactDOM.render(React.createElement(Greeting, { isLoggedIn: true }), document.getElementById('root'));
};