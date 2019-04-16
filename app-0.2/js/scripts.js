var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// window.onbeforeunload = function() {
//     return '';
// }

window.onload = function () {
    var headerHeight = {
        static: 256,
        fixed: 35
    };

    getRealOffsetTop = function getRealOffsetTop(offsetTop) {
        if (offsetTop > headerHeight.static) {
            return offsetTop - headerHeight.fixed;
        }

        return offsetTop;
    };

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
                    { ref: this.props.nodeRef, className: this.props.class },
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
                if (!this.props.disabled) {
                    this.setState({
                        inputFocus: true
                    });

                    // TEMPORARY
                    // This call is necessary when filling the inputs programmatically
                    this.handleChange(e);
                }
            }
        }, {
            key: 'handleBlur',
            value: function handleBlur(e) {
                if (!this.props.disabled) {
                    this.setState({
                        inputFocus: false,
                        inputNonEmpty: e.target.value !== ''
                    });
                }
            }
        }, {
            key: 'handleChange',
            value: function handleChange(e) {
                if (!this.props.disabled) {
                    var inputValid = e.target.value === this.props.value;

                    this.setState({
                        inputValid: inputValid
                    });

                    this.props.onInputChange(this.props.index, inputValid);
                }
            }
        }, {
            key: 'render',
            value: function render() {
                var wrapperClassName = ('wrapper' + ' ' + (this.props.taskError ? 'on-task-error' : '') + ' ' + (this.state.inputValid ? '' : 'on-input-invalid')).trim().replace(/\s+/g, ' ');
                var labelClassName = ((this.props.disabled ? 'on-input-disabled' : '') + ' ' + (this.state.inputFocus ? 'on-input-focus' : '') + ' ' + (this.state.inputNonEmpty ? 'on-input-non-empty' : '')).trim().replace(/\s+/g, ' ');

                return React.createElement(
                    'div',
                    { className: wrapperClassName !== "" ? wrapperClassName : undefined },
                    React.createElement(
                        'label',
                        { className: labelClassName !== "" ? labelClassName : undefined },
                        this.props.label
                    ),
                    React.createElement('input', { type: 'text', spellCheck: 'false', autoComplete: 'off', onFocus: this.handleFocus, onBlur: this.handleBlur, onChange: this.handleChange, disabled: this.props.disabled })
                );
            }
        }]);

        return InputWrapper;
    }(React.Component);

    var Comment = function (_React$Component3) {
        _inherits(Comment, _React$Component3);

        function Comment(props) {
            _classCallCheck(this, Comment);

            var _this3 = _possibleConstructorReturn(this, (Comment.__proto__ || Object.getPrototypeOf(Comment)).call(this, props));

            _this3.handleChange = _this3.handleChange.bind(_this3);
            return _this3;
        }

        _createClass(Comment, [{
            key: 'handleChange',
            value: function handleChange(e) {
                if (!this.props.disabled) {
                    this.props.onChange(e.target.value);
                }
            }
        }, {
            key: 'render',
            value: function render() {
                return React.createElement(
                    'section',
                    { className: 'comment' },
                    React.createElement(
                        'h4',
                        null,
                        this.props.headerText
                    ),
                    React.createElement('textarea', { spellCheck: 'false', maxLength: this.props.maxLength, onChange: this.handleChange, disabled: this.props.disabled }),
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
                                this.props.maxLength - this.props.length
                            )
                        ),
                        this.props.noteText && React.createElement(
                            'p',
                            { className: 'note' },
                            this.props.noteText
                        )
                    )
                );
            }
        }]);

        return Comment;
    }(React.Component);

    var Task = function (_React$Component4) {
        _inherits(Task, _React$Component4);

        function Task(props) {
            _classCallCheck(this, Task);

            var _this4 = _possibleConstructorReturn(this, (Task.__proto__ || Object.getPrototypeOf(Task)).call(this, props));

            _this4.handleClick = _this4.handleClick.bind(_this4);
            _this4.handleStart = _this4.handleStart.bind(_this4);
            _this4.handleFinish = _this4.handleFinish.bind(_this4);
            _this4.handleNext = _this4.handleNext.bind(_this4);
            _this4.handleInputChange = _this4.handleInputChange.bind(_this4);
            _this4.handleRatingChange = _this4.handleRatingChange.bind(_this4);
            _this4.handleCommentChange = _this4.handleCommentChange.bind(_this4);
            _this4.maxCommentLength = 255;
            _this4.childNodeRef = function (child) {
                window.scrollTo(0, getRealOffsetTop(child.offsetTop));
            };
            _this4.state = {
                taskStarted: false,
                taskFinished: false,
                taskError: false,
                nextTask: false,
                stats: {
                    startTime: 0,
                    endTime: 0,
                    numberOfClicks: 0,
                    numberOfErrors: 0,
                    rating: 0,
                    comment: ''
                },
                inputs: _this4.props.task.data.map(function (item) {
                    return {
                        valid: false,
                        key: item.key,
                        value: item.value
                    };
                })
            };
            return _this4;
        }

        _createClass(Task, [{
            key: 'handleClick',
            value: function handleClick() {
                if (this.state.taskStarted && !this.state.taskFinished) {
                    this.setState(function (state) {
                        var stats = Object.assign({}, state.stats, {
                            numberOfClicks: state.stats.numberOfClicks + 1
                        });

                        return {
                            stats: stats
                        };
                    });
                }
            }
        }, {
            key: 'handleStart',
            value: function handleStart() {
                if (!this.state.taskStarted && !this.state.taskFinished) {
                    this.setState(function (state) {
                        var stats = Object.assign({}, state.stats, {
                            startTime: new Date().getTime()
                        });

                        return {
                            stats: stats,
                            taskStarted: true
                        };
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
                        this.setState(function (state) {
                            var stats = Object.assign({}, state.stats, {
                                numberOfErrors: state.stats.numberOfErrors + 1
                            });

                            return {
                                stats: stats,
                                taskError: true
                            };
                        });
                    } else {
                        this.setState(function (state) {
                            var stats = Object.assign({}, state.stats, {
                                endTime: new Date().getTime()
                            });

                            return {
                                stats: stats,
                                taskError: false,
                                taskFinished: true
                            };
                        });
                    }
                }
            }
        }, {
            key: 'handleNext',
            value: function handleNext() {
                if (this.state.taskStarted && this.state.taskFinished) {
                    this.setState({
                        nextTask: true
                    });

                    this.props.onTaskFinish(this.props.index, this.props.task.type, this.state.stats);
                }
            }
        }, {
            key: 'handleRatingChange',
            value: function handleRatingChange(k) {
                if (this.state.taskFinished && !this.state.nextTask) {
                    if (k !== this.state.rating) {
                        this.setState(function (state) {
                            var stats = Object.assign({}, state.stats, {
                                rating: k
                            });

                            return {
                                stats: stats
                            };
                        });
                    }
                }
            }
        }, {
            key: 'handleCommentChange',
            value: function handleCommentChange(comment) {
                if (this.state.taskFinished && !this.state.nextTask) {
                    this.setState(function (state) {
                        var stats = Object.assign({}, state.stats, {
                            comment: comment
                        });

                        return {
                            stats: stats
                        };
                    });
                }
            }
        }, {
            key: 'handleInputChange',
            value: function handleInputChange(inputIndex, inputValid) {
                var _this5 = this;

                if (this.state.taskStarted && !this.state.taskFinished) {
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
                        if (_this5.state.inputs.filter(function (input) {
                            return !input.valid;
                        }).length === 0) {
                            _this5.setState({
                                taskError: false
                            });
                        }
                    });
                }
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
                    inputs[k].dispatchEvent(new Event('blur'));
                }
            }
        }, {
            key: 'render',
            value: function render() {
                var _this6 = this;

                if (this.props.scenarioStarted && this.props.currentIndex >= this.props.index) {
                    return React.createElement(
                        'section',
                        { className: 'task', onClick: this.handleClick, ref: this.props.nodeRef },
                        React.createElement(
                            'h2',
                            null,
                            '\u0106wiczenie nr ',
                            this.props.index
                        ),
                        React.createElement(Paragraph, { 'class': 'task-description', content: 'Wype\u0142nij formularz, korzystaj\u0105c z danych zawartych **w poni\u017Cszej tabeli:**' }),
                        React.createElement(
                            'table',
                            { ref: this.state.taskStarted ? this.childNodeRef : undefined },
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
                                return React.createElement(InputWrapper, { key: index, index: index, taskError: _this6.state.taskError && _this6.state.taskStarted, disabled: _this6.state.taskFinished || !_this6.state.taskStarted, label: input.key, value: input.value, onInputChange: _this6.handleInputChange, simulation: _this6.state.simulation });
                            }),
                            this.state.taskError && React.createElement(Paragraph, { 'class': 'on-task-error', content: 'Aby przej\u015B\u0107 dalej, popraw pola wyr\xF3\u017Cnione **tym kolorem.**' })
                        ),
                        this.state.taskStarted && React.createElement(
                            'button',
                            { onClick: this.handleFinish, disabled: this.state.taskFinished },
                            'Zako\u0144cz \u0107wiczenie'
                        ),
                        this.state.taskFinished && React.createElement(
                            'section',
                            { className: 'seq', ref: this.childNodeRef },
                            React.createElement(
                                'h3',
                                null,
                                'Jaki jest, Twoim zdaniem, poziom trudno\u015Bci powy\u017Cszego \u0107wiczenia? *'
                            ),
                            React.createElement(
                                'ul',
                                { className: 'seq-radios' },
                                [].concat(_toConsumableArray(Array(7))).map(function (x, key, array) {
                                    return React.createElement(
                                        'li',
                                        { className: 'seq-item', key: key },
                                        key === 0 && React.createElement(
                                            'div',
                                            null,
                                            'Bardzo trudne'
                                        ),
                                        key === array.length - 1 && React.createElement(
                                            'div',
                                            null,
                                            'Bardzo latwe'
                                        ),
                                        React.createElement(
                                            'div',
                                            null,
                                            key + 1
                                        ),
                                        React.createElement(
                                            'div',
                                            { className: ("radio " + (_this6.state.stats.rating === key + 1 ? "chosen" : "") + " " + (_this6.state.nextTask ? "disabled" : "")).trim().replace(/\s+/g, ' '), onClick: _this6.handleRatingChange.bind(_this6, key + 1) },
                                            React.createElement('div', null)
                                        )
                                    );
                                })
                            ),
                            React.createElement(
                                'p',
                                { className: 'note' },
                                '* Pole wymagane'
                            ),
                            this.state.stats.rating > 0 && React.createElement(Comment, { headerText: 'Czy masz jakie\u015B uwagi lub sugestie zwi\u0105zane z powy\u017Cszym \u0107wiczeniem? **', noteText: '** Pole opcjonalne', onChange: this.handleCommentChange, length: this.state.stats.comment.length, maxLength: this.maxCommentLength, disabled: this.state.nextTask })
                        ),
                        this.state.stats.rating > 0 && React.createElement(
                            'button',
                            { onClick: this.handleNext, ref: this.childNodeRef, disabled: this.state.nextTask },
                            this.props.index < this.props.lastIndex && "Następne ćwiczenie",
                            this.props.index === this.props.lastIndex && "Zakończ scenariusz"
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

            var _this7 = _possibleConstructorReturn(this, (Scenario.__proto__ || Object.getPrototypeOf(Scenario)).call(this, props));

            _this7.handleStart = _this7.handleStart.bind(_this7);
            _this7.handleNext = _this7.handleNext.bind(_this7);
            _this7.handleTaskFinish = _this7.handleTaskFinish.bind(_this7);
            _this7.handleSummaryComment = _this7.handleSummaryComment.bind(_this7);
            _this7.state = {
                scenarioStarted: false,
                scenarioFinished: false,
                nextScenario: false,
                currentTaskIndex: 1,
                tasks: [],
                summary: {
                    currentQuestion: 0,
                    questions: [{ text: 'Czy treść ćwiczeń była jasna i zrozumiała?', chosenAnswer: -1, answers: ['Tak', 'Nie'] }, { text: 'Czy poziom trudności ćwiczeń był zgodny z Twoimi oczekiwaniami?', chosenAnswer: -1, answers: ['Tak', 'Nie'] }, { text: 'Czy podczas wykonywania ćwiczeń wystąpiły jakieś problemy?', chosenAnswer: -1, answers: ['Tak', 'Nie'] }],
                    comment: ''
                }
            };
            _this7.childNodeRef = function (child) {
                window.scrollTo(0, getRealOffsetTop(child.offsetTop));
            };
            return _this7;
        }

        _createClass(Scenario, [{
            key: 'handleStart',
            value: function handleStart() {
                if (!this.state.scenarioStarted) {
                    this.setState({
                        scenarioStarted: true
                    });
                }
            }
        }, {
            key: 'handleNext',
            value: function handleNext() {
                if (this.state.scenarioStarted && this.state.scenarioFinished) {
                    this.setState({
                        nextScenario: true
                    });

                    this.props.onScenarioFinish({
                        index: this.props.index,
                        tasks: this.state.tasks,
                        summary: this.state.summary
                    });
                }
            }
        }, {
            key: 'handleTaskFinish',
            value: function handleTaskFinish(taskIndex, taskType, taskStats) {
                if (this.state.scenarioStarted && !this.state.scenarioFinished && this.state.currentTaskIndex === taskIndex) {
                    this.setState(function (state) {
                        var tasks = state.tasks;
                        tasks.push({
                            index: taskIndex,
                            type: taskType,
                            stats: taskStats
                        });

                        return Object.assign({}, state, {
                            tasks: tasks
                        });
                    });

                    if (this.state.currentTaskIndex === this.props.scenario.tasks.length) {
                        this.setState({
                            scenarioFinished: true
                        });
                    } else {
                        this.setState({
                            currentTaskIndex: this.state.currentTaskIndex + 1
                        });
                    }
                }
            }
        }, {
            key: 'handleSummaryComment',
            value: function handleSummaryComment(comment) {
                if (this.state.scenarioFinished && !this.state.nextScenario) {
                    this.setState(function (state) {
                        var summary = Object.assign({}, state.summary, {
                            comment: comment
                        });

                        return Object.assign({}, state, {
                            summary: summary
                        });
                    });
                }
            }
        }, {
            key: 'handleSummaryQuestion',
            value: function handleSummaryQuestion(questionIndex, answerIndex) {
                if (this.state.scenarioFinished && !this.state.nextScenario) {
                    this.setState(function (state) {
                        var questions = state.summary.questions.map(function (question, index) {
                            if (questionIndex === index) {
                                return Object.assign({}, question, {
                                    chosenAnswer: answerIndex
                                });
                            }

                            return question;
                        });

                        return {
                            summary: Object.assign({}, state.summary, {
                                currentQuestion: questionIndex + 1,
                                questions: questions
                            })
                        };
                    });
                }
            }
        }, {
            key: 'render',
            value: function render() {
                var _this8 = this;

                if (this.props.testStarted && this.props.currentIndex >= this.props.index) {
                    return React.createElement(
                        'section',
                        { className: 'scenario' },
                        React.createElement(
                            'h1',
                            null,
                            'Scenariusz nr ',
                            this.props.index
                        ),
                        typeof this.props.scenario.intro !== 'undefined' && React.createElement(Paragraph, { content: this.props.scenario.intro }),
                        React.createElement(
                            'button',
                            { onClick: this.handleStart, disabled: this.state.scenarioStarted },
                            'Rozpocznij scenariusz'
                        ),
                        this.props.scenario.tasks.map(function (task, index, tasks) {
                            return React.createElement(Task, { nodeRef: _this8.childNodeRef, key: index, index: index + 1, currentIndex: _this8.state.currentTaskIndex, lastIndex: tasks.length, onTaskFinish: _this8.handleTaskFinish, scenarioStarted: _this8.state.scenarioStarted, task: task });
                        }),
                        this.state.scenarioFinished && React.createElement(
                            'section',
                            { className: 'summary', ref: this.childNodeRef },
                            React.createElement(
                                'h2',
                                null,
                                'Podsumowanie'
                            ),
                            React.createElement(Paragraph, { content: "Gratulacje! Wszystko wskazuje na to, że udało Ci się ukończyć **scenariusz nr " + this.props.index + ".** Zanim przejdziesz dalej, udziel odpowiedzi na poniższe pytania." }),
                            React.createElement(
                                'section',
                                { className: 'questions' },
                                this.state.summary.questions.map(function (question, qIndex) {
                                    if (_this8.state.summary.currentQuestion >= qIndex) {
                                        return React.createElement(
                                            'div',
                                            { key: qIndex, className: 'question-wrapper', ref: _this8.childNodeRef },
                                            React.createElement(
                                                'h4',
                                                null,
                                                question.text,
                                                ' *'
                                            ),
                                            React.createElement(
                                                'ul',
                                                null,
                                                question.answers.map(function (answer, aIndex) {
                                                    return React.createElement(
                                                        'li',
                                                        { key: aIndex },
                                                        React.createElement(
                                                            'div',
                                                            { className: ("radio " + (question.chosenAnswer === aIndex ? "chosen" : "") + " " + (_this8.state.nextScenario ? "disabled" : "")).trim().replace(/\s+/g, ' '), onClick: _this8.handleSummaryQuestion.bind(_this8, qIndex, aIndex) },
                                                            React.createElement('div', null)
                                                        ),
                                                        React.createElement(
                                                            'span',
                                                            null,
                                                            answer
                                                        )
                                                    );
                                                })
                                            )
                                        );
                                    } else {
                                        return '';
                                    }
                                }),
                                React.createElement(
                                    'p',
                                    { className: 'note' },
                                    '* Pole wymagane'
                                ),
                                this.state.summary.currentQuestion >= this.state.summary.questions.length && React.createElement(Comment, { headerText: 'Czy masz jakie\u015B uwagi lub sugestie zwi\u0105zane z uko\u0144czonym scenariuszem? **', noteText: '** Pole opcjonalne', onChange: this.handleSummaryComment, length: this.state.summary.comment.length, maxLength: '255', disabled: this.state.nextScenario })
                            )
                        ),
                        this.state.scenarioFinished && this.state.summary.currentQuestion >= this.state.summary.questions.length && React.createElement(
                            'button',
                            { onClick: this.handleNext, ref: this.childNodeRef, disabled: this.state.nextScenario },
                            this.props.index < this.props.lastIndex && "Następny scenariusz",
                            this.props.index === this.props.lastIndex && "Zakończ badanie"
                        )
                    );
                } else {
                    return '';
                }
            }
        }]);

        return Scenario;
    }(React.Component);

    var MainComponent = function (_React$Component6) {
        _inherits(MainComponent, _React$Component6);

        function MainComponent(props) {
            _classCallCheck(this, MainComponent);

            var _this9 = _possibleConstructorReturn(this, (MainComponent.__proto__ || Object.getPrototypeOf(MainComponent)).call(this, props));

            _this9.handleScroll = _this9.handleScroll.bind(_this9);
            _this9.handleStart = _this9.handleStart.bind(_this9);
            _this9.handleScenarioFinish = _this9.handleScenarioFinish.bind(_this9);
            _this9.backToTop = _this9.backToTop.bind(_this9);
            _this9.state = {
                error: null,
                isLoaded: false,
                scenarios: [],
                allScenariosFinished: false,
                testStarted: false,
                testFinished: false,
                headerFixed: false,
                currentScenarioIndex: 1
            };

            _this9.childNodeRef = function (child) {
                window.scrollTo(0, getRealOffsetTop(child.offsetTop));
            };
            return _this9;
        }

        _createClass(MainComponent, [{
            key: 'backToTop',
            value: function backToTop() {
                window.scrollTo(0, 0);
            }
        }, {
            key: 'handleStart',
            value: function handleStart() {
                if (!this.state.testStarted) {
                    this.setState({
                        testStarted: true
                    });
                }
            }
        }, {
            key: 'handleScenarioFinish',
            value: function handleScenarioFinish(scenario) {
                if (this.state.testStarted && this.state.currentScenarioIndex === scenario.index) {
                    console.log(scenario);

                    if (this.state.currentScenarioIndex === this.state.scenarios.length) {
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
            key: 'handleScroll',
            value: function handleScroll() {
                if (window.scrollY > 256) {
                    this.setState({
                        headerFixed: true
                    });
                } else {
                    this.setState({
                        headerFixed: false
                    });
                }
            }
        }, {
            key: 'componentDidMount',
            value: function componentDidMount() {
                var _this10 = this;

                fetch('./txt/test-one-task.json').then(function (res) {
                    return res.json();
                }).then(function (result) {
                    _this10.setState({
                        scenarios: result.scenarios,
                        isLoaded: true
                    }, function () {
                        window.addEventListener('scroll', _this10.handleScroll);
                    });
                }, function (error) {
                    _this10.setState({
                        isLoaded: false,
                        error: error
                    });
                });
            }
        }, {
            key: 'render',
            value: function render() {
                var _this11 = this;

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
                        { className: this.state.headerFixed ? 'header-fixed' : undefined, id: 'page-container' },
                        React.createElement(
                            'header',
                            null,
                            React.createElement(
                                'p',
                                null,
                                React.createElement(
                                    'span',
                                    null,
                                    'Badanie u\u017Cyteczno\u015Bci'
                                ),
                                this.state.headerFixed && React.createElement(
                                    'span',
                                    null,
                                    'scenariusz ',
                                    this.state.currentScenarioIndex,
                                    '/',
                                    this.state.scenarios.length
                                ),
                                this.state.headerFixed && React.createElement(
                                    'i',
                                    { className: 'material-icons', onClick: this.backToTop },
                                    'arrow_upward'
                                )
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
                                return React.createElement(Scenario, { key: index, index: index + 1, testStarted: _this11.state.testStarted, currentIndex: _this11.state.currentScenarioIndex, lastIndex: _this11.state.scenarios.length, scenario: scenario, onScenarioFinish: _this11.handleScenarioFinish, ref: _this11.childNodeRef });
                            }),
                            this.state.allScenariosFinished && React.createElement(Paragraph, { nodeRef: this.childNodeRef, content: '**To ju\u017C koniec!** Dzi\u0119kuj\u0119 za po\u015Bwi\u0119cony czas i dotarcie do samego ko\u0144ca badania!' })
                        )
                    );
                }
            }
        }]);

        return MainComponent;
    }(React.Component);

    ReactDOM.render(React.createElement(MainComponent, null), document.getElementById('root'));
};