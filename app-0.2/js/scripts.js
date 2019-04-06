var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

window.onload = function () {
    function getTextImportant(string) {
        return string.split(/(\*\*[^\*]*\*\*)/gi);
    }

    function insertNbsp() {
        var p = document.querySelectorAll('p');

        for (var k = 0; k < p.length; k++) {
            p[k].innerHTML = p[k].innerHTML.replace(/(?<=(\s|>)\w)\s/g, '&nbsp;');
        }
    }

    var Task = function (_React$Component) {
        _inherits(Task, _React$Component);

        function Task(props) {
            _classCallCheck(this, Task);

            return _possibleConstructorReturn(this, (Task.__proto__ || Object.getPrototypeOf(Task)).call(this, props));
        }

        _createClass(Task, [{
            key: 'render',
            value: function render() {
                return React.createElement(
                    'section',
                    { className: 'task', id: "task-" + this.props.scenarioIndex + "-" + this.props.index },
                    React.createElement(
                        'h2',
                        null,
                        '\u0106wiczenie nr ',
                        this.props.index
                    ),
                    React.createElement(
                        'span',
                        null,
                        this.props.html
                    ),
                    typeof this.props.task.description !== 'undefined' && React.createElement(
                        'p',
                        null,
                        getTextImportant(this.props.task.description).map(function (chunk, index) {
                            return (
                                // TODO
                                // Create a <Paragraph /> component in order to be able to render <span> tags
                                React.createElement(
                                    'span',
                                    null,
                                    chunk
                                )
                            );
                        })
                    )
                );
            }
        }]);

        return Task;
    }(React.Component);

    var Scenario = function (_React$Component2) {
        _inherits(Scenario, _React$Component2);

        function Scenario(props) {
            _classCallCheck(this, Scenario);

            return _possibleConstructorReturn(this, (Scenario.__proto__ || Object.getPrototypeOf(Scenario)).call(this, props));
        }

        _createClass(Scenario, [{
            key: 'render',
            value: function render() {
                var _this3 = this;

                return React.createElement(
                    'section',
                    { className: 'scenario', id: "scenario-" + this.props.index },
                    React.createElement(
                        'h1',
                        null,
                        'Scenariusz nr ',
                        this.props.index
                    ),
                    typeof this.props.scenario.intro !== 'undefined' && React.createElement(
                        'p',
                        { className: 'scenario-intro' },
                        this.props.scenario.intro
                    ),
                    React.createElement(
                        'button',
                        { className: 'btn-start-scenario', id: "btn-start-scenario-" + +this.props.index },
                        'Rozpocznij scenariusz'
                    ),
                    this.props.scenario.tasks.map(function (task, index) {
                        return React.createElement(Task, { key: index + 1, scenarioIndex: _this3.props.index, index: index + 1, task: task });
                    })
                );
            }
        }]);

        return Scenario;
    }(React.Component);

    var MainComponent = function (_React$Component3) {
        _inherits(MainComponent, _React$Component3);

        function MainComponent(props) {
            _classCallCheck(this, MainComponent);

            var _this4 = _possibleConstructorReturn(this, (MainComponent.__proto__ || Object.getPrototypeOf(MainComponent)).call(this, props));

            _this4.state = {
                error: null,
                isLoaded: false,
                scenarios: []
            };
            return _this4;
        }

        _createClass(MainComponent, [{
            key: 'componentDidMount',
            value: function componentDidMount() {
                var _this5 = this;

                fetch('./txt/test-0.1.json').then(function (res) {
                    return res.json();
                }).then(function (result) {
                    _this5.setState({
                        scenarios: result.scenarios,
                        isLoaded: true
                    });
                }, function (error) {
                    _this5.setState({
                        isLoaded: false,
                        error: error
                    });
                });
            }
        }, {
            key: 'render',
            value: function render() {
                var _state = this.state,
                    error = _state.error,
                    isLoaded = _state.isLoaded,
                    scenarios = _state.scenarios;


                if (error) {
                    return React.createElement(
                        'div',
                        null,
                        'Error: ',
                        error.message
                    );
                } else if (!isLoaded) {
                    return React.createElement(
                        'div',
                        null,
                        'Loading...'
                    );
                } else {
                    return scenarios.map(function (scenario, index) {
                        return React.createElement(Scenario, { key: index + 1, index: index + 1, scenario: scenario });
                    });

                    //     <div style={{ fontFamily : 'monospace' }}>{ JSON.stringify( scenarios ) }</div>
                    // );
                }
            }
        }]);

        return MainComponent;
    }(React.Component);

    ReactDOM.render(React.createElement(MainComponent, null), document.getElementById('root'));

    insertNbsp();
};