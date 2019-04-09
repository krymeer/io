var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

window.onload = function () {
    function insertNbsp(str) {
        return str.replace(/(?<=(\s|>)\w)\s/g, '\xA0');
    }

    function getRandomString() {
        return Math.random().toString(36).substring(2);
    }

    function extractTextImportant(string) {
        var chunks = [];

        string.split(/(\*\*[^\*]*\*\*)/gi).map(function (chunk, index) {
            chunk = insertNbsp(chunk);

            if (chunk.indexOf('**') !== -1) {
                chunk = React.createElement(
                    'span',
                    { key: index, className: 'text-important' },
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
                return React.createElement(
                    'p',
                    { className: typeof this.props.pClass !== 'undefined' ? this.props.pClass : '' },
                    extractTextImportant(this.props.content)
                );
            }
        }]);

        return Paragraph;
    }(React.Component);

    var InputWrapper = function (_React$Component2) {
        _inherits(InputWrapper, _React$Component2);

        function InputWrapper(props) {
            _classCallCheck(this, InputWrapper);

            var _this2 = _possibleConstructorReturn(this, (InputWrapper.__proto__ || Object.getPrototypeOf(InputWrapper)).call(this, props));

            _this2.handleFocus = _this2.handleFocus.bind(_this2);
            _this2.handleBlur = _this2.handleBlur.bind(_this2);

            _this2.state = {
                inputFocus: false
            };
            return _this2;
        }

        _createClass(InputWrapper, [{
            key: 'handleFocus',
            value: function handleFocus() {
                this.setState({
                    inputFocus: true
                });
            }
        }, {
            key: 'handleBlur',
            value: function handleBlur() {
                this.setState({
                    inputFocus: false
                });
            }
        }, {
            key: 'render',
            value: function render() {
                var inputID = this.props.taskID + '--input-' + (this.props.inputIndex + 1);
                var labelClassName = ((this.props.inputDisabled ? 'on-input-disabled' : '') + ' ' + (this.state.inputFocus ? 'on-input-focus' : '')).trim();
                console.log(labelClassName);

                return React.createElement(
                    'div',
                    { className: 'wrapper' },
                    React.createElement(
                        'label',
                        { className: labelClassName, htmlFor: inputID },
                        this.props.data.key
                    ),
                    React.createElement('input', { type: 'text', id: inputID, autoComplete: 'off', onFocus: this.handleFocus, onBlur: this.handleBlur, disabled: this.props.inputDisabled })
                );
            }
        }]);

        return InputWrapper;
    }(React.Component);

    var Task = function (_React$Component3) {
        _inherits(Task, _React$Component3);

        function Task(props) {
            _classCallCheck(this, Task);

            var _this3 = _possibleConstructorReturn(this, (Task.__proto__ || Object.getPrototypeOf(Task)).call(this, props));

            _this3.handleTaskStart = _this3.handleTaskStart.bind(_this3);
            _this3.handleTaskFinish = _this3.handleTaskFinish.bind(_this3);
            _this3.state = {
                taskStarted: false,
                taskFinished: false
            };
            return _this3;
        }

        _createClass(Task, [{
            key: 'handleTaskStart',
            value: function handleTaskStart() {
                if (!this.state.taskStarted && !this.state.taskFinished) {
                    this.setState({
                        taskStarted: true
                    });
                }
            }
        }, {
            key: 'handleTaskFinish',
            value: function handleTaskFinish() {
                if (this.state.taskStarted && !this.state.taskFinished) {
                    this.setState({
                        taskFinished: true
                    });
                }
            }
        }, {
            key: 'render',
            value: function render() {
                var _this4 = this;

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
                    React.createElement(Paragraph, { pClass: 'task-description', content: 'Wype\u0142nij formularz, korzystaj\u0105c z danych zawartych **w poni\u017Cszej tabeli:**' }),
                    React.createElement(
                        'table',
                        null,
                        React.createElement(
                            'thead',
                            null,
                            React.createElement(
                                'tr',
                                null,
                                React.createElement(
                                    'th',
                                    null,
                                    'Nazwa pola'
                                ),
                                React.createElement(
                                    'th',
                                    null,
                                    'Warto\u015B\u0107 do wpisania'
                                )
                            )
                        ),
                        React.createElement(
                            'tbody',
                            null,
                            this.props.task.data.map(function (row, index) {
                                return React.createElement(
                                    'tr',
                                    { key: index },
                                    React.createElement(
                                        'td',
                                        null,
                                        row.key
                                    ),
                                    React.createElement(
                                        'td',
                                        null,
                                        row.value
                                    )
                                );
                            })
                        )
                    ),
                    React.createElement(
                        'button',
                        { className: 'btn-start-task', id: 'btn-start-' + taskID, onClick: this.handleTaskStart, disabled: this.state.taskStarted },
                        'Rozpocznij \u0107wiczenie'
                    ),
                    React.createElement(
                        'section',
                        { className: 'form-container' },
                        React.createElement(
                            'form',
                            { className: this.props.task.type },
                            React.createElement(
                                'h3',
                                null,
                                this.props.task.title
                            ),
                            this.props.task.data.map(function (fieldKeyVal, index) {
                                return React.createElement(InputWrapper, { key: index, taskID: taskID, inputIndex: index, inputDisabled: _this4.state.taskFinished || !_this4.state.taskStarted, data: fieldKeyVal });
                            })
                        )
                    ),
                    React.createElement(
                        'button',
                        { className: 'btn-finish-task', id: 'btn-finish-' + taskID, onClick: this.handleTaskFinish, disabled: this.state.taskFinished || !this.state.taskStarted },
                        'Zako\u0144cz \u0107wiczenie'
                    )
                );
            }
        }]);

        return Task;
    }(React.Component);

    var Scenario = function (_React$Component4) {
        _inherits(Scenario, _React$Component4);

        function Scenario(props) {
            _classCallCheck(this, Scenario);

            return _possibleConstructorReturn(this, (Scenario.__proto__ || Object.getPrototypeOf(Scenario)).call(this, props));
        }

        _createClass(Scenario, [{
            key: 'render',
            value: function render() {
                var _this6 = this;

                var scenarioID = 'scenario-' + this.props.index;

                return React.createElement(
                    'section',
                    { className: 'scenario', id: scenarioID },
                    React.createElement(
                        'h1',
                        null,
                        'Scenariusz nr ',
                        this.props.index
                    ),
                    typeof this.props.scenario.intro !== 'undefined' && React.createElement(Paragraph, { pClass: 'scenario-intro', content: this.props.scenario.intro }),
                    React.createElement(
                        'button',
                        { className: 'btn-start-scenario', id: 'btn-start-' + scenarioID },
                        'Rozpocznij scenariusz'
                    ),
                    this.props.scenario.tasks.map(function (task, index) {
                        return React.createElement(Task, { key: index + 1, scenarioIndex: _this6.props.index, index: index + 1, task: task });
                    }),
                    React.createElement(Paragraph, { pClass: 'scenario-outro', content: 'Gratulacje! Wykonałeś wszystkie zadania ze **scenariusza nr ' + this.props.index + '.** Naciśnij poniższy przycisk, aby przejść do dalszej części badania:' }),
                    React.createElement(
                        'button',
                        { className: 'btn-finish-scenario', id: 'btn-finish-' + scenarioID },
                        'Zako\u0144cz scenariusz'
                    )
                );
            }
        }]);

        return Scenario;
    }(React.Component);

    var MainComponent = function (_React$Component5) {
        _inherits(MainComponent, _React$Component5);

        function MainComponent(props) {
            _classCallCheck(this, MainComponent);

            var _this7 = _possibleConstructorReturn(this, (MainComponent.__proto__ || Object.getPrototypeOf(MainComponent)).call(this, props));

            _this7.state = {
                error: null,
                isLoaded: false,
                scenarios: []
            };
            return _this7;
        }

        _createClass(MainComponent, [{
            key: 'componentDidMount',
            value: function componentDidMount() {
                var _this8 = this;

                fetch('./txt/test-0.1.json').then(function (res) {
                    return res.json();
                }).then(function (result) {
                    _this8.setState({
                        scenarios: result.scenarios,
                        isLoaded: true
                    });
                }, function (error) {
                    _this8.setState({
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
                    var scenarioList = [];

                    scenarios.map(function (scenario, index) {
                        scenarioList.push(React.createElement(Scenario, { key: index + 1, index: index + 1, scenario: scenario }));
                    });

                    return React.createElement(
                        'div',
                        { id: 'page-container' },
                        React.createElement(
                            'header',
                            null,
                            React.createElement(
                                'span',
                                null,
                                'Badanie u\u017Cyteczno\u015Bci'
                            )
                        ),
                        React.createElement(
                            'main',
                            null,
                            React.createElement(Paragraph, { content: 'Witaj! Niniejsze badanie ma na celu zbadanie u\u017Cyteczno\u015Bci wybranych wzorc\xF3w p\xF3l, kt\xF3re mo\u017Cesz na co dzie\u0144 znale\u017A\u0107 w wielu aplikacjach webowych i na stronach internetowych. Zostaniesz poproszony o wykonanie kilkunastu zada\u0144 polegaj\u0105cych na uzupe\u0142nieniu r\xF3\u017Cnego typu formularzy. **Ten tekst jeszcze si\u0119 zmieni.**' }),
                            scenarioList
                        )
                    );
                }
            }
        }]);

        return MainComponent;
    }(React.Component);

    ReactDOM.render(React.createElement(MainComponent, null), document.getElementById('root'));
};