var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

window.onload = function () {
    function insertNbsp(str) {
        return str.replace(/(?<=(\s|>)\w)\s/g, '\xA0');
    }

    function extractTextImportant(string) {
        var chunks = [];

        string.split(/(\*\*[^\*]*\*\*)/gi).map(function (chunk, index) {
            chunk = insertNbsp(chunk);

            if (chunk.indexOf('**') !== -1) {
                chunk = React.createElement(
                    'span',
                    { key: Math.random().toString(36).substring(2), className: 'text-important' },
                    chunk.substring(2, chunk.length - 2)
                );
            }

            chunks.push(chunk);
        });

        return chunks;
    }

    var Paragraph = function (_React$Component) {
        _inherits(Paragraph, _React$Component);

        function Paragraph(props) {
            _classCallCheck(this, Paragraph);

            return _possibleConstructorReturn(this, (Paragraph.__proto__ || Object.getPrototypeOf(Paragraph)).call(this, props));
        }

        _createClass(Paragraph, [{
            key: 'render',
            value: function render() {
                var pContent = extractTextImportant(this.props.content);

                return React.createElement(
                    'p',
                    { className: typeof this.props.pClass !== 'undefined' ? this.props.pClass : '' },
                    pContent
                );
            }
        }]);

        return Paragraph;
    }(React.Component);

    var Task = function (_React$Component2) {
        _inherits(Task, _React$Component2);

        function Task(props) {
            _classCallCheck(this, Task);

            return _possibleConstructorReturn(this, (Task.__proto__ || Object.getPrototypeOf(Task)).call(this, props));
        }

        _createClass(Task, [{
            key: 'render',
            value: function render() {
                var taskID = 'task-' + this.props.scenarioIndex + '-' + this.props.index;

                return React.createElement(
                    'section',
                    { className: 'task', id: taskID },
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
                    typeof this.props.task.description !== 'undefined' && React.createElement(Paragraph, { pClass: 'task-description', content: this.props.task.description })
                );
            }
        }]);

        return Task;
    }(React.Component);

    var Scenario = function (_React$Component3) {
        _inherits(Scenario, _React$Component3);

        function Scenario(props) {
            _classCallCheck(this, Scenario);

            return _possibleConstructorReturn(this, (Scenario.__proto__ || Object.getPrototypeOf(Scenario)).call(this, props));
        }

        _createClass(Scenario, [{
            key: 'render',
            value: function render() {
                var _this4 = this;

                return React.createElement(
                    'section',
                    { className: 'scenario', id: "scenario-" + this.props.index },
                    React.createElement(
                        'h1',
                        null,
                        'Scenariusz nr ',
                        this.props.index
                    ),
                    typeof this.props.scenario.intro !== 'undefined' && React.createElement(Paragraph, { pClass: 'scenario-intro', content: this.props.scenario.intro }),
                    React.createElement(
                        'button',
                        { className: 'btn-start-scenario', id: "btn-start-scenario-" + +this.props.index },
                        'Rozpocznij scenariusz'
                    ),
                    this.props.scenario.tasks.map(function (task, index) {
                        return React.createElement(Task, { key: index + 1, scenarioIndex: _this4.props.index, index: index + 1, task: task });
                    })
                );
            }
        }]);

        return Scenario;
    }(React.Component);

    var MainComponent = function (_React$Component4) {
        _inherits(MainComponent, _React$Component4);

        function MainComponent(props) {
            _classCallCheck(this, MainComponent);

            var _this5 = _possibleConstructorReturn(this, (MainComponent.__proto__ || Object.getPrototypeOf(MainComponent)).call(this, props));

            _this5.state = {
                error: null,
                isLoaded: false,
                scenarios: []
            };
            return _this5;
        }

        _createClass(MainComponent, [{
            key: 'componentDidMount',
            value: function componentDidMount() {
                var _this6 = this;

                fetch('./txt/test-0.1.json').then(function (res) {
                    return res.json();
                }).then(function (result) {
                    _this6.setState({
                        scenarios: result.scenarios,
                        isLoaded: true
                    });
                }, function (error) {
                    _this6.setState({
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
                    return '';
                } else {
                    return scenarios.map(function (scenario, index) {
                        return React.createElement(Scenario, { key: index + 1, index: index + 1, scenario: scenario });
                    });
                }
            }
        }]);

        return MainComponent;
    }(React.Component);

    ReactDOM.render(React.createElement(MainComponent, null), document.getElementById('root'));
};