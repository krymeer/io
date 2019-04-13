var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// window.onbeforeunload = function() {
//     return '';
// }

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

                // TEMPORARY
                // This call is necessary when filling the inputs programmatically
                this.handleChange(e);
            }
        }, {
            key: 'handleBlur',
            value: function handleBlur(e) {
                this.setState({
                    inputFocus: false,
                    inputNonEmpty: e.target.value !== ''
                });
            }
        }, {
            key: 'handleChange',
            value: function handleChange(e) {
                var inputValid = e.target.value === this.props.value;

                this.setState({
                    inputValid: inputValid
                });

                this.props.onInputChange(this.props.index, inputValid);
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
                        { className: labelClassName !== '' ? labelClassName : undefined },
                        this.props.label
                    ),
                    React.createElement('input', { type: 'text', autoComplete: 'off', onFocus: this.handleFocus, onBlur: this.handleBlur, onChange: this.handleChange, disabled: this.props.inputDisabled })
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

            _this3.handleComment = _this3.handleComment.bind(_this3);
            return _this3;
        }

        _createClass(SEQ, [{
            key: 'handleRating',
            value: function handleRating(k) {
                this.props.onRatingChange(k);
            }
        }, {
            key: 'handleComment',
            value: function handleComment(e) {
                this.props.onCommentChange(e.target.value);
            }
        }, {
            key: 'render',
            value: function render() {
                var _this4 = this;

                return React.createElement(
                    'section',
                    { className: 'seq', ref: this.props.nodeRef },
                    React.createElement(
                        'h3',
                        null,
                        'Jaki jest, Twoim zdaniem, poziom trudno\u015Bci powy\u017Cszego \u0107wiczenia?'
                    ),
                    React.createElement(
                        'ul',
                        { className: ("seq-stars" + ' ' + (this.props.disabled ? "disabled" : "")).trim() },
                        React.createElement(
                            'li',
                            null,
                            'bardzo trudne'
                        ),
                        [].concat(_toConsumableArray(Array(5))).map(function (x, key) {
                            return React.createElement(
                                'li',
                                { className: 'seq-item', key: key },
                                React.createElement(
                                    'i',
                                    { className: 'material-icons', onClick: _this4.handleRating.bind(_this4, key + 1), disabled: _this4.props.disabled },
                                    _this4.props.rating <= key && 'star_border',
                                    _this4.props.rating > key && 'star'
                                )
                            );
                        }),
                        React.createElement(
                            'li',
                            null,
                            'bardzo \u0142atwe'
                        )
                    ),
                    this.props.rating > 0 && React.createElement(
                        'section',
                        { className: 'comment' },
                        React.createElement(
                            'h4',
                            null,
                            'Czy masz jakie\u015B uwagi lub sugestie zwi\u0105zane z powy\u017Cszym \u0107wiczeniem? *'
                        ),
                        React.createElement('textarea', { maxLength: this.props.maxCommentLength, onChange: this.handleComment, disabled: this.props.disabled }),
                        React.createElement(
                            'div',
                            null,
                            React.createElement(
                                'p',
                                { className: 'note' },
                                'Pozosta\u0142o znak\xF3w: ',
                                React.createElement(
                                    'span',
                                    { className: 'text-important' },
                                    this.props.maxCommentLength - this.props.commentLength
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

            var _this5 = _possibleConstructorReturn(this, (Task.__proto__ || Object.getPrototypeOf(Task)).call(this, props));

            _this5.handleStart = _this5.handleStart.bind(_this5);
            _this5.handleFinish = _this5.handleFinish.bind(_this5);
            _this5.handleNext = _this5.handleNext.bind(_this5);
            _this5.handleInputChange = _this5.handleInputChange.bind(_this5);
            _this5.handleRatingChange = _this5.handleRatingChange.bind(_this5);
            _this5.handleCommentChange = _this5.handleCommentChange.bind(_this5);
            _this5.maxCommentLength = 255;
            _this5.tableRef = React.createRef();
            _this5.nextTaskRef = React.createRef();
            _this5.seqRef = function (node) {
                window.scrollTo(0, node.offsetTop);
            };
            _this5.state = {
                taskStarted: false,
                taskFinished: false,
                taskError: false,
                nextTask: false,
                stats: {
                    rating: 0,
                    comment: ''
                },
                inputs: _this5.props.task.data.map(function (item) {
                    return {
                        valid: false,
                        key: item.key,
                        value: item.value
                    };
                })
            };
            return _this5;
        }

        _createClass(Task, [{
            key: 'handleStart',
            value: function handleStart() {
                if (!this.state.taskStarted && !this.state.taskFinished) {
                    this.setState({
                        taskStarted: true
                    });

                    window.scrollTo(0, this.tableRef.current.offsetTop);
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
                    }
                }
            }
        }, {
            key: 'handleNext',
            value: function handleNext() {
                if (this.state.taskStarted && this.state.taskFinished) {
                    // TODO
                    // Send the data wherever you'd like to
                    // Note: the comment has to be sanitized before send

                    this.setState({
                        nextTask: true
                    });

                    this.props.onTaskFinish(this.props.index);
                }
            }
        }, {
            key: 'handleRatingChange',
            value: function handleRatingChange(k) {
                var _this6 = this;

                if (k !== this.state.rating) {
                    this.setState(function (state) {
                        var stats = Object.assign({}, state.stats, {
                            rating: k
                        });

                        return {
                            stats: stats
                        };
                    }, function () {
                        if (k > 0) {
                            window.scrollTo(0, _this6.nextTaskRef.current.offsetTop);
                        }
                    });
                }
            }
        }, {
            key: 'handleCommentChange',
            value: function handleCommentChange(comment) {
                this.setState(function (state) {
                    var stats = Object.assign({}, state.stats, {
                        comment: comment
                    });

                    return {
                        stats: stats
                    };
                });
            }
        }, {
            key: 'handleInputChange',
            value: function handleInputChange(inputIndex, inputValid) {
                var _this7 = this;

                this.setState(function (state) {
                    var inputs = state.inputs.map(function (input, index) {
                        if (inputIndex === index) {
                            return Object.assign({}, input, {
                                valid: inputValid
                            });
                        }

                        return input;
                    });

                    return {
                        inputs: inputs
                    };
                }, function () {
                    if (_this7.state.inputs.filter(function (input) {
                        return !input.valid;
                    }).length === 0) {
                        _this7.setState({
                            taskError: false
                        });
                    }
                });
            }

            // TEMPORARY
            // Insert all the data by clicking only one button

        }, {
            key: 'insertEverything',
            value: function insertEverything(e) {
                var inputs = e.target.parentElement.querySelectorAll('input');

                for (var k = 0; k < inputs.length; k++) {
                    inputs[k].value = this.props.task.data[k].value;
                    inputs[k].dispatchEvent(new Event('focus'));
                }
            }
        }, {
            key: 'render',
            value: function render() {
                var _this8 = this;

                if (this.props.scenarioStarted && this.props.currentIndex >= this.props.index) {
                    return React.createElement(
                        'section',
                        { className: 'task', ref: this.props.nodeRef },
                        React.createElement(
                            'h2',
                            null,
                            '\u0106wiczenie nr ',
                            this.props.index + 1
                        ),
                        React.createElement(Paragraph, { 'class': 'task-description', content: 'Wype\u0142nij formularz, korzystaj\u0105c z danych zawartych **w poni\u017Cszej tabeli:**' }),
                        React.createElement(
                            'table',
                            { ref: this.tableRef },
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
                            { onClick: this.handleStart, disabled: this.state.taskStarted },
                            'Rozpocznij \u0107wiczenie'
                        ),
                        React.createElement(
                            'section',
                            { className: "task-form " + this.props.task.type },
                            React.createElement(
                                'h3',
                                null,
                                this.props.task.title
                            ),
                            this.state.taskStarted && !this.state.taskFinished && React.createElement(
                                'i',
                                { className: 'material-icons insert-everything', onClick: this.insertEverything.bind(this) },
                                'keyboard'
                            ),
                            this.state.inputs.map(function (input, index) {
                                return React.createElement(InputWrapper, { key: index, index: index, taskError: _this8.state.taskError && _this8.state.taskStarted, inputDisabled: _this8.state.taskFinished || !_this8.state.taskStarted, label: input.key, value: input.value, onInputChange: _this8.handleInputChange, simulation: _this8.state.simulation });
                            }),
                            this.state.taskError && React.createElement(Paragraph, { 'class': 'on-task-error', content: 'Aby przej\u015B\u0107 dalej, popraw pola wyr\xF3\u017Cnione **tym kolorem.**' })
                        ),
                        this.state.taskStarted && React.createElement(
                            'button',
                            { onClick: this.handleFinish, disabled: this.state.taskFinished },
                            'Zako\u0144cz \u0107wiczenie'
                        ),
                        this.state.taskFinished && React.createElement(SEQ, { nodeRef: this.seqRef, rating: this.state.stats.rating, onRatingChange: this.handleRatingChange, onCommentChange: this.handleCommentChange, maxCommentLength: this.maxCommentLength, commentLength: this.state.stats.comment.length, disabled: this.state.nextTask }),
                        this.state.stats.rating > 0 && React.createElement(
                            'button',
                            { onClick: this.handleNext, ref: this.nextTaskRef, disabled: this.state.nextTask },
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

            var _this9 = _possibleConstructorReturn(this, (Scenario.__proto__ || Object.getPrototypeOf(Scenario)).call(this, props));

            _this9.handleStart = _this9.handleStart.bind(_this9);
            _this9.handleFinish = _this9.handleFinish.bind(_this9);
            _this9.handleTaskFinish = _this9.handleTaskFinish.bind(_this9);
            _this9.state = {
                allTasksFinished: false,
                scenarioStarted: false,
                scenarioFinished: false,
                currentTaskIndex: 0
            };
            _this9.childNodeRef = function (child) {
                window.scrollTo(0, child.offsetTop);
            };
            return _this9;
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
                var _this10 = this;

                if (this.props.testStarted && this.props.currentIndex >= this.props.index) {
                    return React.createElement(
                        'section',
                        { className: 'scenario', ref: this.props.nodeRef },
                        React.createElement(
                            'h1',
                            null,
                            'Scenariusz nr ',
                            this.props.index + 1
                        ),
                        typeof this.props.scenario.intro !== 'undefined' && React.createElement(Paragraph, { content: this.props.scenario.intro }),
                        React.createElement(
                            'button',
                            { onClick: this.handleStart, disabled: this.state.scenarioStarted },
                            'Rozpocznij scenariusz'
                        ),
                        this.props.scenario.tasks.map(function (task, index) {
                            return React.createElement(Task, { key: index, index: index, currentIndex: _this10.state.currentTaskIndex, onTaskFinish: _this10.handleTaskFinish, scenarioStarted: _this10.state.scenarioStarted, task: task, nodeRef: _this10.childNodeRef });
                        }),
                        this.state.allTasksFinished && typeof this.props.scenario.outro !== 'undefined' && React.createElement(Paragraph, { content: this.props.scenario.outro }),
                        this.state.allTasksFinished && React.createElement(
                            'button',
                            { onClick: this.handleFinish, disabled: this.state.scenarioFinished },
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

            var _this11 = _possibleConstructorReturn(this, (MainComponent.__proto__ || Object.getPrototypeOf(MainComponent)).call(this, props));

            _this11.handleStart = _this11.handleStart.bind(_this11);
            _this11.handleFinish = _this11.handleFinish.bind(_this11);
            _this11.handleScenarioFinish = _this11.handleScenarioFinish.bind(_this11);
            _this11.state = {
                error: null,
                isLoaded: false,
                scenarios: [],
                allScenariosFinished: false,
                testStarted: false,
                testFinished: false,
                currentScenarioIndex: 0
            };

            _this11.childNodeRef = function (child) {
                window.scrollTo(0, child.offsetTop);
            };
            return _this11;
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
                var _this12 = this;

                fetch('./txt/test-1.json').then(function (res) {
                    return res.json();
                }).then(function (result) {
                    _this12.setState({
                        scenarios: result.scenarios,
                        isLoaded: true
                    });
                }, function (error) {
                    _this12.setState({
                        isLoaded: false,
                        error: error
                    });
                });
            }
        }, {
            key: 'render',
            value: function render() {
                var _this13 = this;

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
                                return React.createElement(Scenario, { key: index, index: index, testStarted: _this13.state.testStarted, currentIndex: _this13.state.currentScenarioIndex, scenario: scenario, onScenarioFinish: _this13.handleScenarioFinish, nodeRef: _this13.childNodeRef });
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