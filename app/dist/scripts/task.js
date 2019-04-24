var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Task = function (_React$Component) {
    _inherits(Task, _React$Component);

    function Task(props) {
        _classCallCheck(this, Task);

        var _this = _possibleConstructorReturn(this, (Task.__proto__ || Object.getPrototypeOf(Task)).call(this, props));

        _this.handleClick = _this.handleClick.bind(_this);
        _this.handleStart = _this.handleStart.bind(_this);
        _this.handleFinish = _this.handleFinish.bind(_this);
        _this.handleNext = _this.handleNext.bind(_this);
        _this.handleInputChange = _this.handleInputChange.bind(_this);
        _this.handleRatingChange = _this.handleRatingChange.bind(_this);
        _this.handleCommentChange = _this.handleCommentChange.bind(_this);
        _this.childNodeRef = function (child) {
            window.scrollTo(0, getRealOffsetTop(child.offsetTop));
        };
        _this.state = {
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
            inputs: _this.props.task.data.map(function (input) {
                return {
                    valid: false
                };
            })
        };
        return _this;
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

                this.props.onFinish(Object.assign({
                    index: this.props.index,
                    type: this.props.task.type
                }, this.state.stats));
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
        value: function handleCommentChange(input) {
            if (this.state.taskFinished && !this.state.nextTask) {
                this.setState(function (state) {
                    var stats = Object.assign({}, state.stats, {
                        comment: input.value
                    });

                    return {
                        stats: stats
                    };
                });
            }
        }
    }, {
        key: 'handleInputChange',
        value: function handleInputChange(input) {
            var _this2 = this;

            if (this.state.taskStarted && !this.state.taskFinished) {
                this.setState(function (state) {
                    var inputs = state.inputs.map(function (item, itemIndex) {
                        if (itemIndex === input.index) {
                            return Object.assign({}, item, {
                                valid: input.valid
                            });
                        }

                        return item;
                    });

                    return {
                        inputs: inputs
                    };
                }, function () {
                    if (_this2.state.inputs.filter(function (item) {
                        return !item.valid;
                    }).length === 0) {
                        _this2.setState({
                            taskError: false
                        });
                    }
                });
            }
        }

        // TEMPORARY: Insert all the data by clicking only one button

    }, {
        key: 'insertEverything',
        value: function insertEverything(e) {
            var inputs = e.target.parentElement.querySelectorAll('input');
            var _self = this;

            for (var k = 0; k < inputs.length; k++) {
                inputs[k].value = _self.props.task.data[k].defaultValue;
                inputs[k].dispatchEvent(new Event('triggerChange'));
            }
        }
    }, {
        key: 'render',
        value: function render() {
            var _this3 = this;

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
                                        row.label
                                    ),
                                    React.createElement(
                                        'td',
                                        null,
                                        row.defaultValue
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
                        { className: "form " + this.props.task.type },
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
                            return React.createElement(InputWrapper, Object.assign({ key: index, index: index, error: _this3.state.taskError && _this3.state.taskStarted, disabled: _this3.state.taskFinished || !_this3.state.taskStarted, onChange: _this3.handleInputChange }, input, _this3.props.task.data[index]));
                        }),
                        this.state.taskError && React.createElement(Paragraph, { 'class': 'on-form-error', content: 'Aby przej\u015B\u0107 dalej, popraw pola wyr\xF3\u017Cnione **tym kolorem.**' })
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
                            'Jaki jest, Twoim zdaniem, poziom trudno\u015Bci powy\u017Cszego \u0107wiczenia?'
                        ),
                        React.createElement(
                            'ul',
                            { className: 'seq-radios' },
                            [].concat(_toConsumableArray(Array(7))).map(function (x, key, array) {
                                return React.createElement(
                                    'li',
                                    { className: ("seq-item radio-item " + (_this3.state.stats.rating === key + 1 ? "chosen" : "") + " " + (_this3.state.nextTask ? "disabled" : "")).trim().replace(/\s+/g, " "), key: key },
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
                                    React.createElement('div', { className: 'radio', onClick: _this3.handleRatingChange.bind(_this3, key + 1) })
                                );
                            })
                        ),
                        this.state.stats.rating > 0 && React.createElement(InputWrapper, { wrapperClass: 'comment-wrapper', label: 'Czy masz jakie\u015B uwagi lub sugestie zwi\u0105zane z powy\u017Cszym \u0107wiczeniem?', optional: true, type: 'textarea', disabled: this.state.nextTask, onChange: this.handleCommentChange })
                    ),
                    this.state.stats.rating > 0 && React.createElement(
                        'button',
                        { onClick: this.handleNext, ref: this.childNodeRef, disabled: this.state.nextTask },
                        this.props.index < this.props.lastIndex && "Następne ćwiczenie",
                        this.props.index === this.props.lastIndex && "Zakończ scenariusz"
                    )
                );
            }

            return "";
        }
    }]);

    return Task;
}(React.Component);