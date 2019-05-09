var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Scenario = function (_React$Component) {
    _inherits(Scenario, _React$Component);

    function Scenario(props) {
        _classCallCheck(this, Scenario);

        var _this = _possibleConstructorReturn(this, (Scenario.__proto__ || Object.getPrototypeOf(Scenario)).call(this, props));

        _this.handleStart = _this.handleStart.bind(_this);
        _this.handleFinish = _this.handleFinish.bind(_this);
        _this.handleTaskFinish = _this.handleTaskFinish.bind(_this);
        _this.handleSummaryComment = _this.handleSummaryComment.bind(_this);
        _this.state = {
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
        _this.childNodeRef = function (child) {
            window.scrollTo(0, getRealOffsetTop(child.offsetTop));
        };
        _this.randTasks = shuffle(_this.props.scenario.tasks);
        return _this;
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
        key: 'handleFinish',
        value: function handleFinish() {
            if (this.state.scenarioStarted && this.state.scenarioFinished) {
                this.setState({
                    nextScenario: true
                });

                this.props.onFinish({
                    index: this.props.index,
                    tasks: this.state.tasks,
                    comment: this.state.summary.comment,
                    summaryAnswers: this.state.summary.questions.map(function (question) {
                        return question.answers[question.chosenAnswer];
                    })
                });
            }
        }
    }, {
        key: 'handleTaskFinish',
        value: function handleTaskFinish(task) {
            var index = task.index,
                data = _objectWithoutProperties(task, ['index']);

            if (this.state.scenarioStarted && !this.state.scenarioFinished && this.state.currentTaskIndex === index) {
                this.setState(function (state) {
                    var tasks = state.tasks;
                    tasks.push(data);

                    return Object.assign({}, state, {
                        tasks: tasks
                    });
                });

                if (this.state.currentTaskIndex === this.randTasks.length) {
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
        value: function handleSummaryComment(input) {
            if (this.state.scenarioFinished && !this.state.nextScenario) {
                this.setState(function (state) {
                    var summary = Object.assign({}, state.summary, {
                        comment: input.value
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
            var _this2 = this;

            if (this.props.testStarted && this.props.currentIndex >= this.props.index) {
                return React.createElement(
                    'section',
                    { className: 'scenario', ref: this.props.nodeRef },
                    React.createElement(
                        'h1',
                        null,
                        'Scenariusz nr ',
                        this.props.index
                    ),
                    typeof this.props.scenario.intro !== "undefined" && React.createElement(Paragraph, { content: this.props.scenario.intro }),
                    React.createElement(
                        'button',
                        { onClick: this.handleStart, disabled: this.state.scenarioStarted },
                        'Rozpocznij scenariusz'
                    ),
                    this.randTasks.map(function (task, index, tasks) {
                        return React.createElement(Task, { nodeRef: _this2.childNodeRef, key: index, index: index + 1, currentIndex: _this2.state.currentTaskIndex, lastIndex: tasks.length, onFinish: _this2.handleTaskFinish, scenarioStarted: _this2.state.scenarioStarted, task: task });
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
                                if (_this2.state.summary.currentQuestion >= qIndex) {
                                    return React.createElement(
                                        'div',
                                        { key: qIndex, className: 'question-wrapper', ref: _this2.childNodeRef },
                                        React.createElement(
                                            'h4',
                                            null,
                                            question.text
                                        ),
                                        React.createElement(
                                            'ul',
                                            null,
                                            question.answers.map(function (answer, aIndex) {
                                                return React.createElement(
                                                    'li',
                                                    { className: ("radio-item " + (question.chosenAnswer === aIndex ? "chosen" : "") + " " + (_this2.state.nextScenario ? "disabled" : "")).trim().replace(/\s+/g, " "), key: aIndex },
                                                    React.createElement('div', { className: 'radio', onClick: _this2.handleSummaryQuestion.bind(_this2, qIndex, aIndex) }),
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
                                    return "";
                                }
                            }),
                            this.state.summary.currentQuestion >= this.state.summary.questions.length && React.createElement(InputWrapper, { wrapperClass: 'comment-wrapper', label: 'Czy masz jakie\u015B uwagi lub sugestie zwi\u0105zane z uko\u0144czonym scenariuszem?', optional: true, type: 'textarea', disabled: this.state.nextScenario, onChange: this.handleSummaryComment })
                        )
                    ),
                    this.state.scenarioFinished && this.state.summary.currentQuestion >= this.state.summary.questions.length && React.createElement(
                        'button',
                        { onClick: this.handleFinish, ref: this.childNodeRef, disabled: this.state.nextScenario },
                        this.props.index < this.props.lastIndex && "Następny scenariusz",
                        this.props.index === this.props.lastIndex && "Zakończ badanie"
                    )
                );
            } else {
                return "";
            }
        }
    }]);

    return Scenario;
}(React.Component);