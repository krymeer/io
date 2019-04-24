window.onload = function () {
    function ActionLink() {
        function handleClick(e) {
            e.preventDefault();
            alert('The link was clicked');
        }

        return React.createElement(
            'button',
            { onClick: handleClick },
            'Click me'
        );
    }

    ReactDOM.render(React.createElement(ActionLink, null), document.getElementById('root'));
};