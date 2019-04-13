var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

window.onload = function () {
    insertNbsp = function insertNbsp(str) {
        return str.replace(/(?<=(\s|>)\w)\s/g, '\xA0');
    };

    getRandomString = function getRandomString() {
        return Math.random().toString(36).substring(2);
    };

    extractTextImportant = function extractTextImportant(string) {
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
    };

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
                    { className: typeof this.props.class !== 'undefined' ? this.props.class : undefined },
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
            _this2.handleChange = _this2.handleChange.bind(_this2);
            _this2.state = {
                inputFocus: false,
                inputNonEmpty: false,
                inputValid: false
            };
            return _this2;
        }

        _createClass(InputWrapper, [{
            key: 'handleFocus',
            value: function handleFocus(e) {
                this.setState({
                    inputFocus: true
                });
            }
        }, {
            key: 'handleBlur',
            value: function handleBlur(e) {
                this.setState({
                    inputFocus: false,
                    inputNonEmpty: event.target.value !== ''
                });
            }
        }, {
            key: 'handleChange',
            value: function handleChange(e) {
                var inputValid = event.target.value === this.props.value;

                this.setState({
                    inputValid: inputValid
                });

                this.props.onInputChange(this.props.id, inputValid);
            }
        }, {
            key: 'render',
            value: function render() {
                var wrapperClassName = ('wrapper' + ' ' + (this.props.taskError ? 'on-task-error' : '') + ' ' + (this.state.inputValid ? '' : 'on-input-invalid')).trim().replace(/\s+/g, ' ');
                var labelClassName = ((this.props.inputDisabled ? 'on-input-disabled' : '') + ' ' + (this.state.inputFocus ? 'on-input-focus' : '') + ' ' + (this.state.inputNonEmpty ? 'on-input-non-empty' : '')).trim().replace(/\s+/g, ' ');

                return React.createElement(
                    'div',
                    { className: wrapperClassName !== '' ? wrapperClassName : undefined },
                    React.createElement(
                        'label',
                        { className: labelClassName !== '' ? labelClassName : undefined, htmlFor: this.props.id },
                        this.props.label
                    ),
                    React.createElement('input', { type: 'text', id: this.props.id, autoComplete: 'off', onFocus: this.handleFocus, onBlur: this.handleBlur, onChange: this.handleChange, disabled: this.props.inputDisabled })
                );
            }
        }]);

        return InputWrapper;
    }(React.Component);

    var SEQ = function (_React$Component3) {
        _inherits(SEQ, _React$Component3);

        function SEQ(props) {
            _classCallCheck(this, SEQ);

            var _this3 = _possibleConstructorReturn(this, (SEQ.__proto__ || Object.getPrototypeOf(SEQ)).call(this, props));

            _this3.maxCommentLength = 255;
            _this3.handleStarClick = _this3.handleStarClick.bind(_this3);
            _this3.handleCommentChange = _this3.handleCommentChange.bind(_this3);
            _this3.state = {
                rating: 0,
                commentLength: 0
            };
            return _this3;
        }

        _createClass(SEQ, [{
            key: 'handleStarClick',
            value: function handleStarClick(e) {
                var index = parseInt(e.target.getAttribute('data-index'));

                if (index !== this.state.rating) {
                    this.setState({
                        rating: index
                    });
                }
            }
        }, {
            key: 'handleCommentChange',
            value: function handleCommentChange(e) {
                var comment = e.target.value;

                this.setState({
                    commentLength: comment.length
                });
            }
        }, {
            key: 'render',
            value: function render() {
                var seqItems = [];

                for (var k = 1; k <= 5; k++) {
                    seqItems.push(React.createElement(
                        'li',
                        { className: 'seq-item', key: k },
                        React.createElement(
                            'i',
                            { className: 'material-icons', 'data-index': k, onClick: this.handleStarClick },
                            this.state.rating < k && 'star_border',
                            this.state.rating >= k && 'star'
                        )
                    ));
                }

                return React.createElement(
                    'section',
                    { className: 'seq' },
                    React.createElement(
                        'h3',
                        null,
                        'Jaki jest, Twoim zdaniem, poziom trudno\u015Bci powy\u017Cszego \u0107wiczenia?'
                    ),
                    React.createElement(
                        'ul',
                        { className: 'seq-stars' },
                        React.createElement(
                            'li',
                            null,
                            'bardzo trudne'
                        ),
                        seqItems,
                        React.createElement(
                            'li',
                            null,
                            'bardzo \u0142atwe'
                        )
                    ),
                    this.state.rating > 0 && React.createElement(
                        'section',
                        { className: 'comment' },
                        React.createElement(
                            'h4',
                            null,
                            'Dlaczego zdecydowa\u0142e\u015B si\u0119 na tak\u0105 ocen\u0119? *'
                        ),
                        React.createElement('textarea', { maxLength: this.maxCommentLength.toString(), onChange: this.handleCommentChange }),
                        React.createElement(
                            'div',
                            null,
                            React.createElement(
                                'p',
                                { className: 'note' },
                                'Pozosta\u0142o znak\xF3w: ',
                                React.createElement(
                                    'span',
                                    { 'class': 'text-important' },
                                    this.maxCommentLength - this.state.commentLength
                                )
                            ),
                            React.createElement(
                                'p',
                                { className: 'note' },
                                '* Pole opcjonalne'
                            )
                        )
                    )
                );
            }
        }]);

        return SEQ;
    }(React.Component);

    var Task = function (_React$Component4) {
        _inherits(Task, _React$Component4);

        function Task(props) {
            _classCallCheck(this, Task);

            var _this4 = _possibleConstructorReturn(this, (Task.__proto__ || Object.getPrototypeOf(Task)).call(this, props));

            _this4.handleStart = _this4.handleStart.bind(_this4);
            _this4.handleFinish = _this4.handleFinish.bind(_this4);
            _this4.handleSummary = _this4.handleSummary.bind(_this4);
            _this4.handleInputChange = _this4.handleInputChange.bind(_this4);
            _this4.state = {
                taskStarted: false,
                taskFinished: false,
                taskError: false,
                inputs: _this4.props.task.data.map(function (item, index) {
                    return {
                        id: _this4.props.id + '--input-' + index,
                        valid: false,
                        key: item.key,
                        value: item.value
                    };
                })
            };
            return _this4;
        }

        _createClass(Task, [{
            key: 'handleStart',
            value: function handleStart() {
                if (!this.state.taskStarted && !this.state.taskFinished) {
                    this.setState({
                        taskStarted: true
                    });
                }
            }
        }, {
            key: 'handleFinish',
            value: function handleFinish() {
                if (this.state.taskStarted && !this.state.taskFinished) {
                    if (this.state.inputs.filter(function (input) {
                        return !input.valid;
                    }).length > 0) {
                        this.setState({
                            taskError: true
                        });
                    } else {
                        this.setState({
                            taskError: false,
                            taskFinished: true
                        });

                        //this.props.onTaskFinish( this.props.index );
                    }
                }
            }
        }, {
            key: 'handleSummary',
            value: function handleSummary() {}
        }, {
            key: 'handleInputChange',
            value: function handleInputChange(inputId, inputValid) {
                this.setState(function (state) {
                    var inputs = state.inputs.map(function (input) {
                        if (input.id === inputId) {
                            return Object.assign({}, input, {
                                valid: inputValid
                            });
                        }

                        return input;
                    });

                    return {
                        inputs: inputs
                    };
                });
            }
        }, {
            key: 'render',
            value: function render() {
                var _this5 = this;

                if (this.props.scenarioStarted && this.props.currentIndex >= this.props.index) {
                    return React.createElement(
                        'section',
                        { className: 'task', id: this.props.id, ref: this.props.nodeRef },
                        React.createElement(
                            'h2',
                            null,
                            '\u0106wiczenie nr ',
                            this.props.index + 1
                        ),
                        React.createElement(Paragraph, { 'class': 'task-description', content: 'Wype\u0142nij formularz, korzystaj\u0105c z danych zawartych **w poni\u017Cszej tabeli:**' }),
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
                            { className: 'btn-start-task', id: 'btn-start-' + this.props.id, onClick: this.handleStart, disabled: this.state.taskStarted },
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
                                this.state.inputs.map(function (input) {
                                    return React.createElement(InputWrapper, { key: input.id, id: input.id, taskError: _this5.state.taskError && _this5.state.taskStarted, inputDisabled: _this5.state.taskFinished || !_this5.state.taskStarted, label: input.key, value: input.value, onInputChange: _this5.handleInputChange });
                                }),
                                this.state.taskError && React.createElement(Paragraph, { 'class': 'on-task-error', content: 'Aby przej\u015B\u0107 dalej, popraw pola wyr\xF3\u017Cnione **tym kolorem.**' })
                            )
                        ),
                        this.state.taskStarted && React.createElement(
                            'button',
                            { className: 'btn-finish-task', id: 'btn-finish-' + this.props.id, onClick: this.handleFinish, disabled: this.state.taskFinished },
                            'Zako\u0144cz \u0107wiczenie'
                        ),
                        this.state.taskFinished && React.createElement(SEQ, null),
                        this.state.taskFinished && React.createElement(
                            'button',
                            { onClick: this.handleSummary },
                            'Nast\u0119pne \u0107wiczenie'
                        )
                    );
                }

                return '';
            }
        }]);

        return Task;
    }(React.Component);

    var Scenario = function (_React$Component5) {
        _inherits(Scenario, _React$Component5);

        function Scenario(props) {
            _classCallCheck(this, Scenario);

            var _this6 = _possibleConstructorReturn(this, (Scenario.__proto__ || Object.getPrototypeOf(Scenario)).call(this, props));

            _this6.handleStart = _this6.handleStart.bind(_this6);
            _this6.handleFinish = _this6.handleFinish.bind(_this6);
            _this6.handleTaskFinish = _this6.handleTaskFinish.bind(_this6);
            _this6.state = {
                allTasksFinished: false,
                scenarioStarted: false,
                scenarioFinished: false,
                currentTaskIndex: 0
            };

            _this6.childNodeRef = function (child) {
                window.scrollTo(0, child.offsetTop);
            };
            return _this6;
        }

        _createClass(Scenario, [{
            key: 'handleStart',
            value: function handleStart() {
                this.setState({
                    scenarioStarted: true
                });
            }
        }, {
            key: 'handleFinish',
            value: function handleFinish() {
                if (this.state.scenarioStarted && this.state.allTasksFinished && !this.state.scenarioFinished) {
                    this.setState({
                        scenarioFinished: true
                    });

                    this.props.onScenarioFinish(this.props.index);
                }
            }
        }, {
            key: 'handleTaskFinish',
            value: function handleTaskFinish(taskIndex) {
                if (this.state.currentTaskIndex === taskIndex) {
                    if (this.state.currentTaskIndex === this.props.scenario.tasks.length - 1) {
                        this.setState({
                            allTasksFinished: true
                        });
                    } else {
                        this.setState({
                            currentTaskIndex: this.state.currentTaskIndex + 1
                        });
                    }
                }
            }
        }, {
            key: 'render',
            value: function render() {
                var _this7 = this;

                if (this.props.testStarted && this.props.currentIndex >= this.props.index) {
                    return React.createElement(
                        'section',
                        { className: 'scenario', id: this.props.id, ref: this.props.nodeRef },
                        React.createElement(
                            'h1',
                            null,
                            'Scenariusz nr ',
                            this.props.index + 1
                        ),
                        typeof this.props.scenario.intro !== 'undefined' && React.createElement(Paragraph, { 'class': 'scenario-intro', content: this.props.scenario.intro }),
                        React.createElement(
                            'button',
                            { className: 'btn-start-scenario', id: 'btn-start-' + this.props.id, onClick: this.handleStart, disabled: this.state.scenarioStarted },
                            'Rozpocznij scenariusz'
                        ),
                        this.props.scenario.tasks.map(function (task, index) {
                            return React.createElement(Task, { key: index, currentIndex: _this7.state.currentTaskIndex, onTaskFinish: _this7.handleTaskFinish, index: index, id: 'task-' + _this7.props.index + '-' + index, scenarioStarted: _this7.state.scenarioStarted, task: task, nodeRef: _this7.childNodeRef });
                        }),
                        this.state.allTasksFinished && typeof this.props.scenario.outro !== 'undefined' && React.createElement(Paragraph, { 'class': 'scenario-outro', content: this.props.scenario.outro }),
                        this.state.allTasksFinished && React.createElement(
                            'button',
                            { className: 'btn-finish-scenario', id: 'btn-finish-' + this.props.id, onClick: this.handleFinish, disabled: this.state.scenarioFinished },
                            'Zako\u0144cz scenariusz'
                        )
                    );
                }

                return '';
            }
        }]);

        return Scenario;
    }(React.Component);

    var MainComponent = function (_React$Component6) {
        _inherits(MainComponent, _React$Component6);

        function MainComponent(props) {
            _classCallCheck(this, MainComponent);

            var _this8 = _possibleConstructorReturn(this, (MainComponent.__proto__ || Object.getPrototypeOf(MainComponent)).call(this, props));

            _this8.handleStart = _this8.handleStart.bind(_this8);
            _this8.handleFinish = _this8.handleFinish.bind(_this8);
            _this8.handleScenarioFinish = _this8.handleScenarioFinish.bind(_this8);
            _this8.state = {
                error: null,
                isLoaded: false,
                scenarios: [],
                allScenariosFinished: false,
                testStarted: false,
                testFinished: false,
                currentScenarioIndex: 0
            };

            _this8.childNodeRef = function (child) {
                window.scrollTo(0, child.offsetTop);
            };
            return _this8;
        }

        _createClass(MainComponent, [{
            key: 'handleStart',
            value: function handleStart() {
                this.setState({
                    testStarted: true
                });
            }
        }, {
            key: 'handleFinish',
            value: function handleFinish() {}
        }, {
            key: 'handleScenarioFinish',
            value: function handleScenarioFinish(scenarioIndex) {
                if (this.state.currentScenarioIndex === scenarioIndex) {
                    if (this.state.currentScenarioIndex === this.state.scenarios.length - 1) {
                        this.setState({
                            allScenariosFinished: true
                        });
                    } else {
                        this.setState({
                            currentScenarioIndex: this.state.currentScenarioIndex + 1
                        });
                    }
                }
            }
        }, {
            key: 'componentDidMount',
            value: function componentDidMount() {
                var _this9 = this;

                fetch('./txt/test-1.json').then(function (res) {
                    return res.json();
                }).then(function (result) {
                    _this9.setState({
                        scenarios: result.scenarios,
                        isLoaded: true
                    });
                }, function (error) {
                    _this9.setState({
                        isLoaded: false,
                        error: error
                    });
                });
            }
        }, {
            key: 'render',
            value: function render() {
                var _this10 = this;

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
                            React.createElement(
                                'button',
                                { onClick: this.handleStart, disabled: this.state.testStarted },
                                'Rozpocznij badanie'
                            ),
                            scenarios.map(function (scenario, index) {
                                return React.createElement(Scenario, { key: index, id: 'scenario-' + index, index: index, testStarted: _this10.state.testStarted, currentIndex: _this10.state.currentScenarioIndex, scenario: scenario, onScenarioFinish: _this10.handleScenarioFinish, nodeRef: _this10.childNodeRef });
                            }),
                            this.state.allScenariosFinished && React.createElement(Paragraph, { content: '**To ju\u017C koniec!** Dzi\u0119kuj\u0119 za po\u015Bwi\u0119cony czas i dotarcie do samego ko\u0144ca badania!' })
                        )
                    );
                }
            }
        }]);

        return MainComponent;
    }(React.Component);

    ReactDOM.render(React.createElement(MainComponent, null), document.getElementById('root'));
};