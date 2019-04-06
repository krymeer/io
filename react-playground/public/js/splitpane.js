window.onload = function () {
    function SplitPane(props) {
        return React.createElement(
            "div",
            { className: "splitpane" },
            React.createElement(
                "div",
                { className: "splitpane-left" },
                props.left
            ),
            React.createElement(
                "div",
                { className: "splitpane-right" },
                props.right
            )
        );
    }

    function Chat() {
        return React.createElement("textarea", { value: "Lorem ipsum dolor sit amet" });
    }

    function Contacts() {
        return React.createElement(
            "ul",
            null,
            React.createElement(
                "li",
                null,
                "Contact #1"
            ),
            React.createElement(
                "li",
                null,
                "Contact #2"
            )
        );
    }

    function App() {
        return React.createElement(SplitPane, { left: React.createElement(Contacts, null), right: React.createElement(Chat, null) });
    }

    ReactDOM.render(React.createElement(App, null), document.getElementById('root'));
};