var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// window.onbeforeunload = function() {
//     return '';
// }

window.onload = function () {
    var globals = {
        emailRegex: /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/,
        headerHeight: {
            static: 256,
            fixed: 35
        },
        maxLength: {
            input: 64,
            textarea: 255
        }
    };

    getRealOffsetTop = function getRealOffsetTop(offsetTop) {
        if (offsetTop > globals.headerHeight.static) {
            return offsetTop - globals.headerHeight.fixed;
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

            _this2.state = {
                inputValid: false
            };

            if (_this2.props.type === 'text' || _this2.props.type === 'select' && _this2.props.otherOption) {
                _this2.handleFocus = _this2.handleFocus.bind(_this2);
                _this2.handleBlur = _this2.handleBlur.bind(_this2);
                _this2.handleChange = _this2.handleChange.bind(_this2);

                _this2.state = Object.assign({}, _this2.state, {
                    inputFocus: false,
                    inputNonEmpty: false,
                    inputValue: ''
                });
            }

            if (_this2.props.type === 'select') {
                _this2.state = Object.assign({}, _this2.state, {
                    selectList: {}
                });

                _this2.handleClickOutside = _this2.handleClickOutside.bind(_this2);
                _this2.handleSelect = _this2.handleSelect.bind(_this2);
            }
            return _this2;
        }

        _createClass(InputWrapper, [{
            key: 'handleClickOutside',
            value: function handleClickOutside(e) {
                if (this.props.disabled || this.node.contains(e.target)) {
                    return;
                }

                if (this.props.type === 'select' && this.state.selectList.open) {
                    this.handleSelect();
                }
            }
        }, {
            key: 'handleFocus',
            value: function handleFocus(event) {
                if (!this.props.disabled) {
                    this.setState({
                        inputFocus: true
                    });
                }
            }
        }, {
            key: 'handleBlur',
            value: function handleBlur() {
                if (!this.props.disabled) {
                    this.setState({
                        inputFocus: false,
                        inputNonEmpty: this.state.inputValue !== ''
                    });
                }
            }
        }, {
            key: 'handleChange',
            value: function handleChange(event) {
                var _this3 = this;

                if (!this.props.disabled) {
                    var eventType = event.type;
                    var inputValue = event.target.value;
                    var inputValid = typeof this.props.defaultValue !== 'undefined' ? this.props.defaultValue === inputValue : typeof this.props.regex !== 'undefined' ? this.props.regex.test(inputValue) : inputValue !== '';
                    this.setState({
                        inputValue: inputValue,
                        inputValid: inputValid
                    }, function () {
                        if (eventType === 'triggerChange') {
                            _this3.handleBlur();
                        }
                    });

                    this.props.onChange({
                        index: this.props.index,
                        value: inputValue,
                        valid: inputValid
                    });
                }
            }
        }, {
            key: 'handleOption',
            value: function handleOption(optionIndex, optionValue) {
                if (!this.props.disabled) {
                    var otherOptionChosen = this.props.type === 'select' && this.props.otherOption && optionIndex === this.props.options.length - 1;
                    var inputValid = typeof this.props.defaultValue !== 'undefined' ? this.props.defaultValue === optionValue : otherOptionChosen ? this.state.inputValue !== '' : true;

                    this.setState({
                        inputValid: inputValid,
                        chosenIndex: optionIndex
                    });

                    if (this.props.type === 'select') {
                        this.setState({
                            otherOptionChosen: otherOptionChosen
                        });

                        this.handleSelect();
                    }

                    this.props.onChange({
                        index: this.props.index,
                        valid: inputValid,
                        value: optionValue
                    });
                }
            }
        }, {
            key: 'handleSelect',
            value: function handleSelect(event) {
                var _this4 = this;

                if (!this.props.disabled) {
                    var bodyScrollHeight = document.body.scrollHeight;
                    var currentNode = typeof event !== 'undefined' ? event.target : '';

                    if (!this.state.selectList.open) {
                        document.addEventListener('click', this.handleClickOutside, false);
                    } else {
                        document.removeEventListener('click', this.handleClickOutside, false);
                    }

                    this.setState(function (state) {
                        return {
                            selectList: Object.assign({}, state.selectList, {
                                open: !state.selectList.open,
                                overflow: undefined
                            })
                        };
                    }, function () {
                        if (_this4.state.selectList.open) {
                            var listNode = currentNode.closest('.select-current').nextElementSibling;

                            if (listNode !== null) {
                                var listNodeOffsetBtm = document.body.parentElement.scrollTop + listNode.getBoundingClientRect().top + listNode.offsetHeight;
                                var overflowDirection = listNodeOffsetBtm > bodyScrollHeight ? 'top' : 'bottom';

                                _this4.setState(function (state) {
                                    return {
                                        selectList: Object.assign({}, state.selectList, {
                                            overflow: overflowDirection
                                        })
                                    };
                                });
                            }
                        }
                    });
                }
            }
        }, {
            key: 'componentDidMount',
            value: function componentDidMount() {
                if (this.props.type === 'text') {
                    var _self = this;

                    this.inputNode.addEventListener('triggerChange', function (event) {
                        _self.handleChange(event);
                    });
                }
            }
        }, {
            key: 'render',
            value: function render() {
                var _this5 = this;

                var wrapperClassName = ('wrapper' + ' ' + (this.props.error ? 'on-form-error' : '') + ' ' + (this.state.inputValid ? '' : 'on-input-invalid')).trim().replace(/\s+/g, ' ');
                var labelClassName = ((this.props.disabled ? 'on-input-disabled' : '') + ' ' + (this.state.inputFocus ? 'on-input-focus' : '') + ' ' + (this.state.inputNonEmpty ? 'on-input-non-empty' : '')).trim().replace(/\s+/g, ' ');

                return React.createElement(
                    'div',
                    { className: wrapperClassName !== "" ? wrapperClassName : undefined },
                    React.createElement(
                        'label',
                        { className: labelClassName !== "" ? labelClassName : undefined },
                        this.props.label
                    ),
                    this.props.type === "text" && React.createElement('input', { ref: function ref(node) {
                            return _this5.inputNode = node;
                        }, maxLength: typeof this.props.maxLength !== "undefined" ? this.props.maxLength : globals.maxLength.input, type: 'text', spellCheck: 'false', autoComplete: 'off', onFocus: this.handleFocus, onBlur: this.handleBlur, onChange: this.handleChange, disabled: this.props.disabled, value: this.state.inputValue }),
                    this.props.type === "radio" && React.createElement(
                        'ul',
                        { className: 'input-list radio-list' },
                        this.props.options.map(function (option, index) {
                            return React.createElement(
                                'li',
                                { className: ("radio-item " + (_this5.state.chosenIndex === index ? "chosen" : "") + " " + (_this5.props.disabled ? "disabled" : "")).trim().replace(/\s+/g, " "), key: index },
                                React.createElement('div', { className: 'radio', onClick: _this5.handleOption.bind(_this5, index, option) }),
                                React.createElement(
                                    'span',
                                    null,
                                    option
                                )
                            );
                        })
                    ),
                    this.props.type === "select" && React.createElement(
                        'div',
                        { className: 'select-wrapper' },
                        React.createElement(
                            'div',
                            { className: ("select-current " + (this.props.disabled ? "disabled" : "") + " " + (this.state.selectList.open ? "focus" : "")).trim().replace(/\s+/g, " "), onClick: this.handleSelect },
                            React.createElement(
                                'span',
                                null,
                                this.state.chosenIndex >= 0 ? this.props.options[this.state.chosenIndex] : ""
                            ),
                            React.createElement(
                                'i',
                                { className: 'material-icons' },
                                this.state.selectList.open ? "keyboard_arrow_up" : "keyboard_arrow_down"
                            )
                        ),
                        this.state.selectList.open && React.createElement(
                            'ul',
                            { className: ("select-list " + this.state.selectList.overflow).trim(), ref: function ref(node) {
                                    return _this5.node = node;
                                } },
                            this.props.options.map(function (option, index) {
                                if (index !== _this5.state.chosenIndex) {
                                    return React.createElement(
                                        'li',
                                        { key: index, className: 'select-option', onClick: _this5.handleOption.bind(_this5, index, option) },
                                        React.createElement(
                                            'span',
                                            null,
                                            option
                                        )
                                    );
                                } else {
                                    return "";
                                }
                            })
                        ),
                        this.state.otherOptionChosen && React.createElement('input', { className: 'select-other', maxLength: typeof this.props.maxLength !== "undefined" ? this.props.maxLength : globals.maxLength.input, type: 'text', spellCheck: 'false', autoComplete: 'off', disabled: this.props.disabled, onFocus: this.handleFocus, onBlur: this.handleBlur, onChange: this.handleChange, value: this.state.inputValue })
                    )
                );
            }
        }]);

        return InputWrapper;
    }(React.Component);

    var Comment = function (_React$Component3) {
        _inherits(Comment, _React$Component3);

        function Comment(props) {
            _classCallCheck(this, Comment);

            var _this6 = _possibleConstructorReturn(this, (Comment.__proto__ || Object.getPrototypeOf(Comment)).call(this, props));

            _this6.handleChange = _this6.handleChange.bind(_this6);
            return _this6;
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
                    React.createElement('textarea', { spellCheck: 'false', maxLength: typeof this.props.maxLength !== "undefined" ? this.props.maxLength : globals.maxLength.textarea, onChange: this.handleChange, disabled: this.props.disabled }),
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

            var _this7 = _possibleConstructorReturn(this, (Task.__proto__ || Object.getPrototypeOf(Task)).call(this, props));

            _this7.handleClick = _this7.handleClick.bind(_this7);
            _this7.handleStart = _this7.handleStart.bind(_this7);
            _this7.handleFinish = _this7.handleFinish.bind(_this7);
            _this7.handleNext = _this7.handleNext.bind(_this7);
            _this7.handleInputChange = _this7.handleInputChange.bind(_this7);
            _this7.handleRatingChange = _this7.handleRatingChange.bind(_this7);
            _this7.handleCommentChange = _this7.handleCommentChange.bind(_this7);
            _this7.childNodeRef = function (child) {
                window.scrollTo(0, getRealOffsetTop(child.offsetTop));
            };
            _this7.state = {
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
                inputs: _this7.props.task.data.map(function (input) {
                    return {
                        valid: false
                    };
                })
            };
            return _this7;
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

                    this.props.onFinish({
                        index: this.props.index,
                        type: this.props.task.type,
                        stats: this.state.stats
                    });
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
            value: function handleInputChange(input) {
                var _this8 = this;

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
                        if (_this8.state.inputs.filter(function (item) {
                            return !item.valid;
                        }).length === 0) {
                            _this8.setState({
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
                var _this9 = this;

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
                                return React.createElement(InputWrapper, Object.assign({ key: index, index: index, error: _this9.state.taskError && _this9.state.taskStarted, disabled: _this9.state.taskFinished || !_this9.state.taskStarted, onChange: _this9.handleInputChange }, input, _this9.props.task.data[index]));
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
                                'Jaki jest, Twoim zdaniem, poziom trudno\u015Bci powy\u017Cszego \u0107wiczenia? *'
                            ),
                            React.createElement(
                                'ul',
                                { className: 'seq-radios' },
                                [].concat(_toConsumableArray(Array(7))).map(function (x, key, array) {
                                    return React.createElement(
                                        'li',
                                        { className: ("seq-item radio-item " + (_this9.state.stats.rating === key + 1 ? "chosen" : "") + " " + (_this9.state.nextTask ? "disabled" : "")).trim().replace(/\s+/g, " "), key: key },
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
                                        React.createElement('div', { className: 'radio', onClick: _this9.handleRatingChange.bind(_this9, key + 1) })
                                    );
                                })
                            ),
                            React.createElement(
                                'p',
                                { className: 'note' },
                                '* Pole wymagane'
                            ),
                            this.state.stats.rating > 0 && React.createElement(Comment, { headerText: 'Czy masz jakie\u015B uwagi lub sugestie zwi\u0105zane z powy\u017Cszym \u0107wiczeniem? **', noteText: '** Pole opcjonalne', onChange: this.handleCommentChange, length: this.state.stats.comment.length, maxLength: globals.maxLength.textarea, disabled: this.state.nextTask })
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

    var Scenario = function (_React$Component5) {
        _inherits(Scenario, _React$Component5);

        function Scenario(props) {
            _classCallCheck(this, Scenario);

            var _this10 = _possibleConstructorReturn(this, (Scenario.__proto__ || Object.getPrototypeOf(Scenario)).call(this, props));

            _this10.handleStart = _this10.handleStart.bind(_this10);
            _this10.handleFinish = _this10.handleFinish.bind(_this10);
            _this10.handleTaskFinish = _this10.handleTaskFinish.bind(_this10);
            _this10.handleSummaryComment = _this10.handleSummaryComment.bind(_this10);
            _this10.state = {
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
            _this10.childNodeRef = function (child) {
                window.scrollTo(0, getRealOffsetTop(child.offsetTop));
            };
            return _this10;
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
                        summary: {
                            comment: this.state.summary.comment,
                            answers: this.state.summary.questions.map(function (question) {
                                return question.chosenAnswer;
                            })
                        }
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
                var _this11 = this;

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
                        this.props.scenario.tasks.map(function (task, index, tasks) {
                            return React.createElement(Task, { nodeRef: _this11.childNodeRef, key: index, index: index + 1, currentIndex: _this11.state.currentTaskIndex, lastIndex: tasks.length, onFinish: _this11.handleTaskFinish, scenarioStarted: _this11.state.scenarioStarted, task: task });
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
                                    if (_this11.state.summary.currentQuestion >= qIndex) {
                                        return React.createElement(
                                            'div',
                                            { key: qIndex, className: 'question-wrapper', ref: _this11.childNodeRef },
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
                                                        { className: ("radio-item " + (question.chosenAnswer === aIndex ? "chosen" : "") + " " + (_this11.state.nextScenario ? "disabled" : "")).trim().replace(/\s+/g, " "), key: aIndex },
                                                        React.createElement('div', { className: 'radio', onClick: _this11.handleSummaryQuestion.bind(_this11, qIndex, aIndex) }),
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
                                React.createElement(
                                    'p',
                                    { className: 'note' },
                                    '* Pole wymagane'
                                ),
                                this.state.summary.currentQuestion >= this.state.summary.questions.length && React.createElement(Comment, { headerText: 'Czy masz jakie\u015B uwagi lub sugestie zwi\u0105zane z uko\u0144czonym scenariuszem? **', noteText: '** Pole opcjonalne', onChange: this.handleSummaryComment, length: this.state.summary.comment.length, maxLength: globals.maxLength.textarea, disabled: this.state.nextScenario })
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

    var MainComponent = function (_React$Component6) {
        _inherits(MainComponent, _React$Component6);

        function MainComponent(props) {
            _classCallCheck(this, MainComponent);

            var _this12 = _possibleConstructorReturn(this, (MainComponent.__proto__ || Object.getPrototypeOf(MainComponent)).call(this, props));

            _this12.handleFormChange = _this12.handleFormChange.bind(_this12);
            _this12.handleScroll = _this12.handleScroll.bind(_this12);
            _this12.handleStart = _this12.handleStart.bind(_this12);
            _this12.handleFinish = _this12.handleFinish.bind(_this12);
            _this12.handleScenarioFinish = _this12.handleScenarioFinish.bind(_this12);
            _this12.backToTop = _this12.backToTop.bind(_this12);
            _this12.state = {
                error: null,
                isLoaded: false,
                headerFixed: false,
                testStarted: false,
                testFinished: false,
                scenarios: [],
                currentScenarioIndex: 1,
                allScenariosFinished: false,
                form: {
                    error: false,
                    data: [{
                        type: 'text',
                        label: 'Imię',
                        id: 'firstName',
                        value: '',
                        maxLength: 32,
                        valid: false
                    }, {
                        type: 'text',
                        label: 'E-mail',
                        id: 'email',
                        value: '',
                        regex: globals.emailRegex,
                        maxLength: 128,
                        valid: false
                    }, {
                        type: 'text',
                        label: 'Rok urodzenia',
                        id: 'birthYear',
                        value: '',
                        regex: /^\d{4}$/,
                        maxLength: 4,
                        valid: false
                    }, {
                        type: 'radio',
                        label: 'Płeć',
                        id: 'sex',
                        value: '',
                        options: ['Mężczyzna', 'Kobieta'],
                        valid: false
                    }, {
                        type: 'select',
                        label: 'Wykształcenie',
                        id: 'education',
                        value: '',
                        options: ['Podstawowe', 'Gimnazjalne', 'Zasadnicze zawodowe', 'Zasadnicze branżowe', 'Średnie branżowe', 'Średnie', 'Wyższe', 'Inne (jakie?)'],
                        otherOption: true,
                        valid: false
                    }]
                },
                output: {
                    results: {
                        startTime: 0,
                        endTime: 0,
                        scenarios: []
                    },
                    user: {}
                }
            };

            _this12.childNodeRef = function (child) {
                window.scrollTo(0, getRealOffsetTop(child.offsetTop));
            };
            return _this12;
        }

        _createClass(MainComponent, [{
            key: 'componentDidMount',
            value: function componentDidMount() {
                var _this13 = this;

                fetch('./json/test-all.json').then(function (res) {
                    return res.json();
                }).then(function (result) {
                    _this13.setState({
                        scenarios: result.scenarios,
                        isLoaded: true
                    }, function () {
                        window.addEventListener('scroll', _this13.handleScroll);
                    });
                }, function (error) {
                    _this13.setState({
                        isLoaded: false,
                        error: error
                    });
                });
            }
        }, {
            key: 'backToTop',
            value: function backToTop() {
                window.scrollTo(0, 0);
            }
        }, {
            key: 'handleScroll',
            value: function handleScroll() {
                if (window.scrollY > globals.headerHeight.static) {
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
            key: 'handleFormChange',
            value: function handleFormChange(input) {
                var _this14 = this;

                if (this.state.allScenariosFinished && !this.state.testFinished) {
                    this.setState(function (state) {
                        var data = state.form.data.map(function (item, itemIndex) {
                            if (itemIndex === input.index) {
                                return Object.assign({}, item, {
                                    valid: input.valid,
                                    value: input.value
                                });
                            }

                            return item;
                        });

                        return Object.assign({}, state, {
                            form: Object.assign({}, state.form, {
                                data: data
                            })
                        });
                    }, function () {
                        if (_this14.state.form.data.filter(function (item) {
                            return !item.valid;
                        }).length === 0) {
                            _this14.setState(function (state) {
                                return Object.assign({}, state, {
                                    form: Object.assign({}, state.form, {
                                        error: false
                                    })
                                });
                            });
                        }
                    });
                }
            }
        }, {
            key: 'handleStart',
            value: function handleStart() {
                if (!this.state.testStarted) {
                    this.setState(function (state) {
                        return Object.assign({}, state, {
                            testStarted: true,
                            output: Object.assign({}, state.output, {
                                results: Object.assign({}, state.output.results, {
                                    startTime: new Date().getTime()
                                })
                            })
                        });
                    });
                }
            }
        }, {
            key: 'handleScenarioFinish',
            value: function handleScenarioFinish(scenario) {
                var index = scenario.index,
                    data = _objectWithoutProperties(scenario, ['index']);

                if (this.state.testStarted && this.state.currentScenarioIndex === index) {
                    this.setState(function (state) {
                        var scenarios = state.output.results.scenarios;
                        scenarios.push(data);

                        return Object.assign({}, state, {
                            output: Object.assign({}, state.output, {
                                results: Object.assign({}, state.output.results, {
                                    scenarios: scenarios
                                })
                            })
                        });
                    });

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
            key: 'handleFinish',
            value: function handleFinish() {
                var _this15 = this;

                if (this.state.allScenariosFinished && !this.state.testFinished) {
                    if (this.state.form.data.filter(function (input) {
                        return !input.valid;
                    }).length > 0) {
                        this.setState(function (state) {
                            return Object.assign({}, state, {
                                form: Object.assign({}, state.form, {
                                    error: true
                                })
                            });
                        });
                    } else {
                        this.setState(function (state) {
                            return Object.assign({}, state, {
                                testFinished: true,
                                output: Object.assign({}, state.output, {
                                    results: Object.assign({}, state.output.results, {
                                        endTime: new Date().getTime()
                                    })
                                })
                            });
                        }, function () {
                            var output = _this15.state.output;
                            var userData = {};

                            for (var k = 0; k < _this15.state.form.data.length; k++) {
                                var input = _this15.state.form.data[k];
                                userData[input.id] = input.value;
                            }

                            output = Object.assign({}, output, {
                                user: userData
                            });

                            console.log(output);
                        });
                    }
                }
            }
        }, {
            key: 'render',
            value: function render() {
                var _this16 = this;

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
                    return "";
                } else {
                    return React.createElement(
                        'div',
                        { className: this.state.headerFixed ? "header-fixed" : undefined, id: 'page-container' },
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
                            React.createElement(
                                'section',
                                null,
                                React.createElement(Paragraph, { content: 'Witaj! Niniejsze badanie ma na celu zbadanie u\u017Cyteczno\u015Bci wybranych wzorc\xF3w p\xF3l, kt\xF3re mo\u017Cesz na co dzie\u0144 znale\u017A\u0107 w wielu aplikacjach webowych i na stronach internetowych. Zostaniesz poproszony o wykonanie kilkunastu zada\u0144 polegaj\u0105cych na uzupe\u0142nieniu r\xF3\u017Cnego typu formularzy. **Ten tekst jeszcze si\u0119 zmieni.**' }),
                                React.createElement(
                                    'button',
                                    { onClick: this.handleStart, disabled: this.state.testStarted },
                                    'Rozpocznij badanie'
                                )
                            ),
                            scenarios.map(function (scenario, index) {
                                return React.createElement(Scenario, { key: index, index: index + 1, testStarted: _this16.state.testStarted, currentIndex: _this16.state.currentScenarioIndex, lastIndex: _this16.state.scenarios.length, scenario: scenario, onFinish: _this16.handleScenarioFinish, nodeRef: _this16.childNodeRef });
                            }),
                            this.state.allScenariosFinished && React.createElement(
                                'section',
                                { ref: this.childNodeRef },
                                React.createElement(
                                    'h1',
                                    null,
                                    'Zako\u0144czenie'
                                ),
                                React.createElement(Paragraph, { content: 'Tutaj b\u0119dzie jaki\u015B akapit podsumowuj\u0105cy, jednak na razie nie wiem, co by w nim mog\u0142o si\u0119 znale\u017A\u0107.' }),
                                React.createElement(
                                    'section',
                                    { className: 'form labels-align-top', id: 'user-form' },
                                    React.createElement(
                                        'h3',
                                        null,
                                        'Ankieta uczestnika'
                                    ),
                                    this.state.form.data.map(function (item, index) {
                                        return React.createElement(InputWrapper, Object.assign({ key: index, index: index, error: _this16.state.form.error, disabled: _this16.state.testFinished, onChange: _this16.handleFormChange }, item));
                                    }),
                                    this.state.form.error && React.createElement(Paragraph, { 'class': 'on-form-error', content: 'Aby przej\u015B\u0107 dalej, popraw pola wyr\xF3\u017Cnione **tym kolorem.**' })
                                ),
                                React.createElement(
                                    'button',
                                    { onClick: this.handleFinish, disabled: this.state.testFinished },
                                    'Wy\u015Blij'
                                )
                            ),
                            this.state.testFinished && React.createElement(
                                'section',
                                { ref: this.childNodeRef },
                                React.createElement(Paragraph, { content: '**Serdecznie dzi\u0119kuj\u0119 za wzi\u0119cie udzia\u0142u w badaniu!** Twoja pomoc jest naprawd\u0119 nieoceniona i przyczyni si\u0119 do zrealizowania jednego z najwi\u0119kszych moich cel\xF3w w \u017Cyciu -- uko\u0144czenia studi\xF3w na Politechnice Wroc\u0142awskiej.' })
                            )
                        )
                    );
                }
            }
        }]);

        return MainComponent;
    }(React.Component);

    ReactDOM.render(React.createElement(MainComponent, null), document.getElementById('root'));
};