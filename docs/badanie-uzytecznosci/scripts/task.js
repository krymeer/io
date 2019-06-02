var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Task = function (_React$Component) {
    _inherits(Task, _React$Component);

    function Task(props) {
        _classCallCheck(this, Task);

        var _this = _possibleConstructorReturn(this, (Task.__proto__ || Object.getPrototypeOf(Task)).call(this, props));

        _this.handleAbort = _this.handleAbort.bind(_this);
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
                comments: {}
            },
            inputs: _this.props.task.data.map(function (input) {
                return {
                    valid: typeof input.initialValue !== 'undefined' && typeof input.expectedValue !== 'undefined' ? input.initialValue === input.expectedValue : false
                };
            })
        };

        if (_this.props.task.type.indexOf('speech-recognition') !== -1) {
            _this.state = Object.assign({}, _this.state, {
                speechRecognition: {
                    values: [].concat(_toConsumableArray(Array(_this.props.task.data.length))),
                    currentIndex: -1,
                    timesClicks: 0
                },
                stats: Object.assign({}, _this.state.stats, {
                    speechRecognition: {
                        micClicks: 0,
                        timesClicks: 0
                    }
                })
            });

            _this.handleSpeechRecognitionTimesClick = _this.handleSpeechRecognitionTimesClick.bind(_this);
            _this.handleSpeechRecognitionMicClick = _this.handleSpeechRecognitionMicClick.bind(_this);
            _this.handleSpeechRecognitionInterface();
        }
        return _this;
    }

    // ONLY FOR DEVELOPMENT

    // componentDidMount()
    // {
    //     this.handleStart();
    // }

    _createClass(Task, [{
        key: 'handleSpeechRecognitionInterface',
        value: function handleSpeechRecognitionInterface() {
            var _this2 = this;

            var rules = this.props.task.rules;
            this.webkitSpeechRecognition = new webkitSpeechRecognition();

            this.webkitSpeechRecognition.lang = 'pl-PL';
            this.webkitSpeechRecognition.continuous = true;
            this.webkitSpeechRecognition.interimResults = true;
            this.webkitSpeechRecognition.maxAlternatives = 1;

            this.webkitSpeechRecognition.onresult = function (event) {
                if (_this2.state.speechRecognition.currentIndex < 0 || !_this2.state.taskStarted || _this2.state.taskFinished) {
                    return false;
                }

                var transcript = event.results[event.results.length - 1][0].transcript;

                if (rules) {
                    var _iteratorNormalCompletion = true;
                    var _didIteratorError = false;
                    var _iteratorError = undefined;

                    try {
                        for (var _iterator = rules[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                            var rule = _step.value;

                            transcript = transcript.replace(new RegExp(rule.in, "gi"), rule.out);
                        }
                    } catch (err) {
                        _didIteratorError = true;
                        _iteratorError = err;
                    } finally {
                        try {
                            if (!_iteratorNormalCompletion && _iterator.return) {
                                _iterator.return();
                            }
                        } finally {
                            if (_didIteratorError) {
                                throw _iteratorError;
                            }
                        }
                    }
                }

                _this2.setState(function (state) {
                    return Object.assign({}, state, {
                        speechRecognition: Object.assign({}, state.speechRecognition, {
                            values: state.speechRecognition.values.map(function (v, i) {
                                return i === state.speechRecognition.currentIndex ? transcript : v;
                            })
                        })
                    });
                });
            };

            this.webkitSpeechRecognition.onend = function (event) {
                if (_this2.state.speechRecognition.continue) {
                    _this2.setState(function (state) {
                        return Object.assign({}, state, {
                            speechRecognition: Object.assign({}, state.speechRecognition, {
                                continue: false
                            })
                        });
                    });

                    _this2.webkitSpeechRecognition.start();
                } else if (_this2.state.speechRecognition.currentIndex !== -1) {
                    _this2.handleSpeechRecognitionMicClick();
                }
            };
        }
    }, {
        key: 'handleSpeechRecognitionMicClick',
        value: function handleSpeechRecognitionMicClick(event) {
            var _this3 = this;

            if (this.props.task.type.indexOf('speech-recognition') !== -1 && this.state.taskStarted && !this.state.taskFinished) {
                var inputIndex = typeof event !== 'undefined' ? parseInt(event.target.dataset.inputIndex) : -1;
                var otherIndex = inputIndex !== -1 && this.state.speechRecognition.currentIndex !== inputIndex;

                this.setState(function (state) {
                    if (state.speechRecognition.currentIndex < 0) {
                        _this3.webkitSpeechRecognition.start();
                    } else {
                        _this3.webkitSpeechRecognition.abort();
                    }

                    return Object.assign({}, state, {
                        speechRecognition: Object.assign({}, state.speechRecognition, {
                            currentIndex: otherIndex ? inputIndex : -1,
                            continue: otherIndex
                        }),
                        stats: Object.assign({}, state.stats, {
                            speechRecognition: Object.assign({}, state.stats.speechRecognition, {
                                micClicks: state.stats.speechRecognition.micClicks + 1
                            })
                        })
                    });
                });
            }
        }
    }, {
        key: 'handleSpeechRecognitionTimesClick',
        value: function handleSpeechRecognitionTimesClick(event) {
            if (this.state.speechRecognition.currentIndex !== -1 && this.state.speechRecognition.currentIndex === parseInt(event.target.dataset.inputIndex) && this.state.taskStarted && !this.state.taskFinished) {
                this.webkitSpeechRecognition.abort();

                this.setState(function (state) {
                    return Object.assign({}, state, {
                        speechRecognition: Object.assign({}, state.speechRecognition, {
                            continue: true,
                            values: state.speechRecognition.values.map(function (v, i) {
                                return i === state.speechRecognition.currentIndex ? '' : v;
                            })
                        }),
                        stats: Object.assign({}, state.stats, {
                            speechRecognition: Object.assign({}, state.stats.speechRecognition, {
                                timesClicks: state.stats.speechRecognition.micClicks + 1
                            })
                        })
                    });
                });
            }
        }
    }, {
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
        key: 'handleGeolocation',
        value: function handleGeolocation() {
            var _this4 = this;

            if ('geolocation' in navigator) {
                navigator.geolocation.getCurrentPosition(function (position) {
                    _this4.handlePosition(position.coords.latitude, position.coords.longitude);
                });
            } else {
                this.setState({
                    alert: {
                        type: 'warning',
                        msg: 'Twoja przeglądarka **uniemożliwia** pobranie informacji na temat Twojej lokalizacji (szerokości i długości geograficznej) Proszę, wpisz swoje dane ręcznie.'
                    }
                });
            }
        }
    }, {
        key: 'handlePosition',
        value: function handlePosition(lat, lon) {
            var _this5 = this;

            fetch('https://api.opencagedata.com/geocode/v1/json?key=66599c796ba2423db096258e034bf93b&q=' + lat + '+' + lon + '&pretty=1&no_annotations=1').then(function (res) {
                return res.json();
            }).then(function (response) {
                var results = response.results ? response.results[0].components : undefined;

                if (typeof results !== 'undefined') {
                    var location = [results.country, results.state.replace(/^województwo\s+/i, ''), results.county, results.city, results.postcode];

                    var inputs = _this5.formWrapperNode.querySelectorAll('input');

                    if (inputs) {
                        for (var k = 0; k < inputs.length; k++) {
                            inputs[k].value = location[k];
                            inputs[k].dispatchEvent(new Event('triggerChange'));
                        }
                    }
                }
            }).catch(function (error) {
                console.error(error);
                _this5.setState({
                    alert: {
                        type: 'error',
                        msg: '**Przepraszam!** Wystąpił nieznany błąd, który uniemożliwił pobranie danych o miejscu, w którym się znajdujesz. Wpisz swoje dane ręcznie.'
                    }
                });
            });
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

                if (this.props.task.type === 'geolocation') {
                    this.handleGeolocation();
                }
            }
        }
    }, {
        key: 'handleAbort',
        value: function handleAbort() {
            this.handleFinish(true);
        }
    }, {
        key: 'handleFinish',
        value: function handleFinish() {
            var abort = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

            if (this.state.taskStarted && !this.state.taskFinished) {
                var taskAborted = abort === true;

                if (this.state.inputs.filter(function (input) {
                    return !input.valid;
                }).length === 0 || taskAborted) {
                    if (this.props.task.type.indexOf('speech-recognition') !== -1) {
                        if (this.state.speechRecognition.currentIndex !== -1) {
                            this.webkitSpeechRecognition.abort();
                        }

                        this.setState(function (state) {
                            return Object.assign({}, state, {
                                speechRecognition: Object.assign({}, state.speechRecognition, {
                                    currentIndex: -1,
                                    continue: false
                                })
                            });
                        });
                    }

                    this.setState(function (state) {
                        var stats = Object.assign({}, state.stats, {
                            endTime: new Date().getTime()
                        });

                        return {
                            stats: stats,
                            taskError: false,
                            taskFinished: true,
                            taskAborted: taskAborted
                        };
                    });
                } else {
                    this.setState(function (state) {
                        var stats = Object.assign({}, state.stats, {
                            numberOfErrors: state.stats.numberOfErrors + 1
                        });

                        return {
                            stats: stats,
                            taskError: true
                        };
                    });
                }
            }
        }
    }, {
        key: 'handleNext',
        value: function handleNext() {
            if (this.state.taskStarted && this.state.taskFinished) {
                if (this.state.stats.rating <= 0 || this.state.taskAborted && !(this.state.stats.comments.taskAborted && this.state.stats.comments.taskAborted.length >= 10)) {
                    this.setState({
                        missingSummaryData: true
                    });
                } else {
                    this.setState({
                        nextTask: true,
                        missingSummaryData: false
                    });

                    this.props.onFinish({
                        index: this.props.index,
                        type: this.props.task.type,
                        stats: this.state.stats
                    });
                }
            }
        }
    }, {
        key: 'handleRatingChange',
        value: function handleRatingChange(k) {
            if (this.state.taskFinished && !this.state.nextTask) {
                if (k !== this.state.rating) {
                    this.setState(function (oldState) {
                        var newState = Object.assign({}, oldState, {
                            stats: Object.assign({}, oldState.stats, {
                                rating: k
                            })
                        });

                        if (oldState.missingSummaryData && (!oldState.taskAborted || oldState.stats.comments.taskAborted && oldState.stats.comments.taskAborted.length >= 10)) {
                            newState.missingSummaryData = false;
                        }

                        return newState;
                    });
                }
            }
        }
    }, {
        key: 'handleCommentChange',
        value: function handleCommentChange(input) {
            if (this.state.taskFinished && !this.state.nextTask) {
                this.setState(function (oldState) {
                    var newState = Object.assign({}, oldState, {
                        stats: Object.assign({}, oldState.stats, {
                            comments: Object.assign({}, oldState.stats.comments, _defineProperty({}, input.context, input.value))
                        })
                    });

                    if (oldState.missingSummaryData && oldState.stats.rating > 0 && oldState.taskAborted && input.context === 'taskAborted' && input.value.length >= 10) {
                        newState.missingSummaryData = false;
                    }

                    return newState;
                });
            }
        }
    }, {
        key: 'handleInputChange',
        value: function handleInputChange(input) {
            var _this6 = this;

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
                    if (_this6.state.inputs.filter(function (item) {
                        return !item.valid;
                    }).length === 0) {
                        _this6.setState({
                            taskError: false
                        });
                    }
                });
            }
        }
    }, {
        key: 'insertEverything',
        value: function insertEverything(e) {
            var inputs = e.target.parentElement.querySelectorAll('input');
            var _self = this;

            for (var k = 0; k < inputs.length; k++) {
                inputs[k].value = _self.props.task.data[k].expectedValue;
                inputs[k].dispatchEvent(new Event('triggerChange'));
            }
        }
    }, {
        key: 'render',
        value: function render() {
            var _this7 = this;

            if (this.props.scenarioStarted && this.props.currentIndex >= this.props.index) {
                return React.createElement(
                    'section',
                    { className: 'task', onClick: this.handleClick, ref: this.props.nodeRef },
                    React.createElement(
                        'h2',
                        null,
                        '\u0106wiczenie ',
                        this.props.scenarioIndex,
                        '.',
                        this.props.index,
                        '.'
                    ),
                    React.createElement(Paragraph, { 'class': 'task-description', content: 'Wype\u0142nij formularz, korzystaj\u0105c z danych zawartych **w poni\u017Cszej tabeli:**' }),
                    React.createElement(
                        'table',
                        { 'data-for': this.props.task.type, ref: this.state.taskStarted ? this.childNodeRef : undefined },
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
                                    'Prawid\u0142owa warto\u015B\u0107'
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
                                        Array.isArray(row.expectedValue) && typeof row.separator !== "undefined" ? row.expectedValue.join(row.separator) : row.anyValue ? React.createElement(
                                            'em',
                                            null,
                                            'dowolna*'
                                        ) : String(row.expectedValue).split('\n').map(function (line, lineIndex, lineArr) {
                                            line = insertNbsp(line);

                                            return lineIndex < lineArr.length - 1 ? [line, React.createElement('br', { key: index })] : line;
                                        })
                                    )
                                );
                            })
                        ),
                        this.props.task.data.filter(function (row) {
                            return row.anyValue;
                        }).length > 0 && React.createElement(
                            'tfoot',
                            null,
                            React.createElement(
                                'tr',
                                null,
                                React.createElement(
                                    'td',
                                    { className: 'note', colSpan: '2' },
                                    '*) Ka\u017Cda niepusta warto\u015B\u0107, kt\xF3ra jest zgodna z tre\u015Bci\u0105 scenariusza.'
                                )
                            )
                        )
                    ),
                    this.props.task.alert && React.createElement(Paragraph, { content: this.props.task.alert.msg, 'class': "alert " + this.props.task.alert.type }),
                    React.createElement(
                        'button',
                        { className: 'start', onClick: this.handleStart, disabled: this.state.taskStarted },
                        'Zaczynam \u0107wiczenie'
                    ),
                    React.createElement(
                        'section',
                        { ref: function ref(formWrapperNode) {
                                return _this7.formWrapperNode = formWrapperNode;
                            }, className: "form " + this.props.task.classes },
                        this.state.alert && React.createElement(Paragraph, { content: this.state.alert.msg, 'class': "alert " + this.state.alert.type }),
                        React.createElement(
                            'h3',
                            null,
                            this.props.task.title
                        ),
                        this.state.inputs.map(function (input, index) {
                            var speechRecognitionProps = _this7.props.task.type.indexOf('speech-recognition') !== -1 ? {
                                onSpeechRecognitionTimesClick: _this7.handleSpeechRecognitionTimesClick,
                                onSpeechRecognitionMicClick: _this7.handleSpeechRecognitionMicClick,
                                speechRecognition: {
                                    currentIndex: _this7.state.speechRecognition.currentIndex,
                                    inputValue: _this7.state.speechRecognition.values[index]
                                }
                            } : undefined;

                            return React.createElement(InputWrapper, Object.assign({ key: index, index: index, error: _this7.state.taskError && _this7.state.taskStarted, disabled: _this7.state.taskFinished || !_this7.state.taskStarted, onChange: _this7.handleInputChange }, input, _this7.props.task.data[index], { insideTask: true }, speechRecognitionProps, { ignoreCaseAndLines: _this7.props.task.ignoreCaseAndLines === true }));
                        }),
                        this.state.taskError && React.createElement(Paragraph, { 'class': 'on-form-error', content: 'Aby przej\u015B\u0107 dalej, popraw pola wyr\xF3\u017Cnione **tym kolorem.**' })
                    ),
                    this.state.taskStarted && React.createElement(
                        'section',
                        { className: 'button-wrapper' },
                        this.props.task.canBeAborted && React.createElement(
                            'button',
                            { className: 'abort', onClick: this.handleAbort, disabled: this.state.taskFinished },
                            'Przerywam \u0107wiczenie'
                        ),
                        React.createElement(
                            'button',
                            { className: 'okay', onClick: this.handleFinish, disabled: this.state.taskFinished },
                            'OK, gotowe'
                        )
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
                            { className: ("seq-radios " + (this.state.missingSummaryData && this.state.stats.rating <= 0 ? "error" : "")).trim() },
                            [].concat(_toConsumableArray(Array(7))).map(function (x, key, array) {
                                return React.createElement(
                                    'li',
                                    { className: ("seq-item radio-item " + (_this7.state.stats.rating === key + 1 ? "chosen" : "") + " " + (_this7.state.nextTask ? "disabled" : "")).trim().replace(/\s+/g, " "), key: key },
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
                                    React.createElement('div', { className: 'radio', onClick: _this7.handleRatingChange.bind(_this7, key + 1) })
                                );
                            })
                        ),
                        this.state.taskAborted && React.createElement(InputWrapper, { wrapperClass: 'comment-wrapper', ignoreValidity: true, error: this.state.missingSummaryData && !(this.state.stats.comments.taskAborted && this.state.stats.comments.taskAborted.length >= 10), context: 'taskAborted', label: 'Dlaczego nie wykona\u0142e\u015B(-a\u015B) tego \u0107wiczenia do ko\u0144ca?', type: 'textarea', disabled: this.state.nextTask, onChange: this.handleCommentChange }),
                        React.createElement(InputWrapper, { wrapperClass: 'comment-wrapper', context: 'taskFinished', label: typeof this.props.question !== "undefined" ? insertNbsp(this.props.question) : "Co sądzisz o wprowadzaniu danych przy użyciu zaprezentowanej metody?", optional: true, type: 'textarea', disabled: this.state.nextTask, onChange: this.handleCommentChange }),
                        this.state.missingSummaryData && React.createElement(Paragraph, { 'class': 'note', content: "Aby przejść dalej, **oceń poziom trudności powyższego ćwiczenia" + (this.state.taskAborted && this.state.stats.comments.taskAborted && this.state.stats.comments.taskAborted.length < 10 ? ",** a także **wyjaśnij, dlaczego zdecydowałeś(-aś) się je przerwać.**" : ".**") })
                    ),
                    this.state.taskFinished && React.createElement(
                        'button',
                        { onClick: this.handleNext, disabled: this.state.nextTask },
                        'OK, dalej'
                    )
                );
            }

            return "";
        }
    }]);

    return Task;
}(React.Component);