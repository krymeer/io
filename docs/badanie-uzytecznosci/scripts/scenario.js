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
            tasks: {
                const: shuffle(_this.props.scenario.tasks),
                results: []
            },
            summary: {
                currentQuestion: 0,
                questions: [{ text: 'Czy treść ćwiczeń była jasna i zrozumiała?', chosenAnswer: -1, answers: ['Tak', 'Nie'] }, { text: 'Czy poziom trudności ćwiczeń był zgodny z Twoimi oczekiwaniami?', chosenAnswer: -1, answers: ['Tak', 'Nie'] }, { text: 'Czy metody wprowadzania danych zaprezentowane w tym scenariuszu były dla Ciebie intuicyjne?', chosenAnswer: -1, answers: ['Tak', 'Nie'] }],
                comment: ''
            }
        };
        _this.childNodeRef = function (child) {
            window.scrollTo(0, getRealOffsetTop(child.offsetTop));
        };
        return _this;
    }

    // ONLY FOR DEVELOPMENT

    // componentDidMount()
    // {
    //     this.handleStart();
    // }

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
                    tasks: this.state.tasks.results,
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
                    var results = state.tasks.results;
                    results.push(data);

                    return Object.assign({}, state, {
                        tasks: Object.assign({}, state.tasks, {
                            results: results
                        })
                    });
                });

                if (this.state.currentTaskIndex === this.state.tasks.const.length) {
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
                    React.Fragment,
                    null,
                    React.createElement(
                        'section',
                        { className: 'scenario-intro', ref: this.props.nodeRef },
                        React.createElement(
                            'h1',
                            null,
                            'Scenariusz ',
                            this.props.index,
                            '.'
                        ),
                        typeof this.props.scenario.intro !== "undefined" && React.createElement(Paragraph, { content: this.props.scenario.intro }),
                        typeof this.props.scenario.alert !== 'undefined' && React.createElement(Paragraph, { 'class': 'alert', content: this.props.scenario.alert }),
                        React.createElement(
                            'button',
                            { onClick: this.handleStart, disabled: this.state.scenarioStarted },
                            'OK, dalej'
                        )
                    ),
                    React.createElement(
                        React.Fragment,
                        null,
                        this.state.tasks.const.map(function (task, index, tasks) {
                            return React.createElement(Task, { question: _this2.props.scenario.question, nodeRef: _this2.childNodeRef, key: index, index: index + 1, currentIndex: _this2.state.currentTaskIndex, lastIndex: tasks.length, onFinish: _this2.handleTaskFinish, scenarioIndex: _this2.props.index, scenarioStarted: _this2.state.scenarioStarted, task: task });
                        })
                    ),
                    this.state.scenarioFinished && React.createElement(
                        'section',
                        { className: 'scenario-summary', ref: this.childNodeRef },
                        React.createElement(
                            'h2',
                            null,
                            'Podsumowanie'
                        ),
                        React.createElement(Paragraph, { content: "Udało się! Właśnie ukończyłeś(-aś) **scenariusz " + this.props.index + ".** i możesz przejść do kolejnej części badania. Zanim jednak to zrobisz, proszę, udziel odpowiedzi na poniższe pytania." }),
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
                                    return null;
                                }
                            }),
                            this.state.summary.currentQuestion >= this.state.summary.questions.length && React.createElement(InputWrapper, { wrapperClass: 'comment-wrapper', label: this.props.scenario.seqQuestion ? this.props.scenario.seqQuestion : "Jaki jest, Twoim zdaniem, najlepszy sposób na wprowadzanie tego typu danych?", optional: true, type: 'textarea', disabled: this.state.nextScenario, onChange: this.handleSummaryComment })
                        )
                    ),
                    this.state.scenarioFinished && this.state.summary.currentQuestion >= this.state.summary.questions.length && React.createElement(
                        'section',
                        { className: 'button-wrapper' },
                        React.createElement(
                            'button',
                            { onClick: this.handleFinish, ref: this.childNodeRef, disabled: this.state.nextScenario },
                            'OK, dalej'
                        )
                    )
                );
            } else {
                return "";
            }
        }
    }]);

    return Scenario;
}(React.Component);