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

    var TaskForm = function (_React$Component2) {
        _inherits(TaskForm, _React$Component2);

        function TaskForm(props) {
            _classCallCheck(this, TaskForm);

            var _this2 = _possibleConstructorReturn(this, (TaskForm.__proto__ || Object.getPrototypeOf(TaskForm)).call(this, props));

            _this2.handleInputFocus = _this2.handleInputFocus.bind(_this2);
            _this2.handleInputBlur = _this2.handleInputBlur.bind(_this2);
            return _this2;
        }

        _createClass(TaskForm, [{
            key: 'handleInputFocus',
            value: function handleInputFocus(event) {
                var inputID = event.target.id;
                var label = event.target.previousElementSibling;

                if (this.props.type.indexOf('labels-float') !== -1 && label !== null) {
                    label.classList.add('on-input-focus');
                }
            }
        }, {
            key: 'handleInputBlur',
            value: function handleInputBlur(event) {
                var inputID = event.target.id;
                var label = event.target.previousElementSibling;

                if (this.props.type.indexOf('labels-float') !== -1 && label !== null) {
                    label.classList.remove('on-input-focus');

                    if (event.target.value !== '') {
                        label.classList.add('on-input-data');
                    } else {
                        label.classList.remove('on-input-data');
                    }
                }
            }
        }, {
            key: 'render',
            value: function render() {
                var _this3 = this;

                var fields = [];

                this.props.fields.map(function (field, index) {
                    var inputID = _this3.props.taskID + '--input-' + (index + 1);
                    fields.push(React.createElement(
                        'div',
                        { key: index, className: 'wrapper' },
                        React.createElement(
                            'label',
                            { htmlFor: inputID },
                            field.key
                        ),
                        React.createElement('input', { type: 'text', id: inputID, autoComplete: 'off', onFocus: _this3.handleInputFocus, onBlur: _this3.handleInputBlur })
                    ));
                });

                return React.createElement(
                    'section',
                    { className: 'form-container' },
                    React.createElement(
                        'form',
                        { className: this.props.type },
                        React.createElement(
                            'h3',
                            null,
                            this.props.taskTitle
                        ),
                        fields
                    )
                );
            }
        }]);

        return TaskForm;
    }(React.Component);

    var Task = function (_React$Component3) {
        _inherits(Task, _React$Component3);

        function Task(props) {
            _classCallCheck(this, Task);

            var _this4 = _possibleConstructorReturn(this, (Task.__proto__ || Object.getPrototypeOf(Task)).call(this, props));

            _this4.finishTask = _this4.finishTask.bind(_this4);
            return _this4;
        }

        _createClass(Task, [{
            key: 'finishTask',
            value: function finishTask(event) {
                alert('click');

                // TODO
                // Make the form disabled after firing this event
            }
        }, {
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
                        { className: 'btn-start-task', id: 'btn-start-' + taskID },
                        'Rozpocznij \u0107wiczenie'
                    ),
                    React.createElement(TaskForm, { taskID: taskID, taskTitle: this.props.task.title, type: this.props.task.formType, fields: this.props.task.data }),
                    React.createElement(
                        'button',
                        { className: 'btn-finish-task', id: 'btn-finish-' + taskID, onClick: this.finishTask },
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

                return React.createElement(
                    'section',
                    { className: 'scenario', id: 'scenario-' + this.props.index },
                    React.createElement(
                        'h1',
                        null,
                        'Scenariusz nr ',
                        this.props.index
                    ),
                    typeof this.props.scenario.intro !== 'undefined' && React.createElement(Paragraph, { pClass: 'scenario-intro', content: this.props.scenario.intro }),
                    React.createElement(
                        'button',
                        { className: 'btn-start-scenario', id: 'btn-start-scenario-' + +this.props.index },
                        'Rozpocznij scenariusz'
                    ),
                    this.props.scenario.tasks.map(function (task, index) {
                        return React.createElement(Task, { key: index + 1, scenarioIndex: _this6.props.index, index: index + 1, task: task });
                    }),
                    React.createElement(Paragraph, { pClass: 'scenario-outro', content: 'Gratulacje! Wykonałeś wszystkie zadania ze **scenariusza nr ' + this.props.index + '.** Naciśnij poniższy przycisk, aby przejść do dalszej części badania:' }),
                    React.createElement(
                        'button',
                        { className: 'btn-finish-scenario', id: 'btn-finish-scenario-' + +this.props.index },
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