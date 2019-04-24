window.onload = function () {
    var node = document.getElementById('root');

    ReactDOM.render(React.createElement("input", { value: "hi" }), node);

    setTimeout(function () {
        ReactDOM.render(React.createElement("input", { value: null }), node);
    }, 5000);
};