window.onload = function () {
    function FancyBorder(props) {
        return React.createElement(
            'div',
            { className: 'fancyborder', style: { border: '2px solid ' + props.color } },
            props.children
        );
    }

    function Dialog(props) {
        return React.createElement(
            FancyBorder,
            { color: 'magenta' },
            React.createElement(
                'h1',
                { className: 'dialog-title' },
                props.title
            ),
            React.createElement(
                'p',
                { className: 'dialog-message' },
                props.message
            )
        );
    }

    function WelcomeDialog() {
        return React.createElement(Dialog, {
            title: 'Welcome',
            message: 'Thank you for visiting our spacecraft!' });
    }

    ReactDOM.render(React.createElement(WelcomeDialog, null), document.getElementById('root'));
};