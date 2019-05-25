var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var InputWrapper = function (_React$Component) {
    _inherits(InputWrapper, _React$Component);

    function InputWrapper(props) {
        _classCallCheck(this, InputWrapper);

        var _this = _possibleConstructorReturn(this, (InputWrapper.__proto__ || Object.getPrototypeOf(InputWrapper)).call(this, props));

        _this.state = {
            inputValid: _this.props.optional ? true : typeof _this.props.initialValue !== 'undefined' && typeof _this.props.expectedValue !== 'undefined' ? _this.props.initialValue === _this.props.expectedValue : typeof _this.props.ignoreValidity !== 'undefined' && _this.props.ignoreValidity
        };
        _this.multiPartInput = typeof _this.props.options !== 'undefined' && _this.props.options.filter(function (array) {
            return !Array.isArray(array);
        }).length === 0 && typeof _this.props.separator !== 'undefined' && Array.isArray(_this.props.expectedValue);
        _this.handleLabel = _this.handleLabel.bind(_this);
        _this.inputMaxLength = typeof _this.props.maxLength !== 'undefined' ? _this.props.maxLength : _this.props.type === 'textarea' ? globals.maxLength.textarea : globals.maxLength.input;

        if (_this.multiPartInput) {
            _this.state = Object.assign({}, _this.state, {
                inputPartsValid: [].concat(_toConsumableArray(Array(_this.props.options.length))),
                chosenIndexes: [].concat(_toConsumableArray(Array(_this.props.options.length)))
            });
        }

        if (_this.props.type === 'calendar') {
            _this.state = Object.assign({}, _this.state, {
                calendar: {}
            });

            _this.handleCalendarState = _this.handleCalendarState.bind(_this);
            _this.handleCalendarDate = _this.handleCalendarDate.bind(_this);
            _this.handleClickOutside = _this.handleClickOutside.bind(_this);
        }

        if (_this.props.type === 'timetable') {
            _this.state = Object.assign({}, _this.state, {
                timetable: {}
            });

            _this.handleClickOutside = _this.handleClickOutside.bind(_this);
            _this.handleOption = _this.handleOption.bind(_this);
        }

        if (_this.props.type === 'inc-dec' || _this.props.type === 'range') {
            _this.state = Object.assign({}, _this.state, {
                chosenIndex: typeof _this.props.initialValue !== 'undefined' ? _this.props.initialValue : _this.props.minValue
            });

            _this.handleOption = _this.handleOption.bind(_this);
        }

        if (_this.props.type === 'toggle-switch' || _this.props.type === 'toggle-btn') {
            _this.state = Object.assign({}, _this.state, {
                chosenIndex: typeof _this.props.initialValue !== 'undefined' ? _this.props.options.indexOf(_this.props.initialValue) : 0
            });
        }

        if (_this.props.type === 'text-select-text') {
            _this.state = Object.assign({}, _this.state, {
                inputValue: [].concat(_toConsumableArray(Array(_this.props.expectedValue.length))),
                inputPartsValid: [].concat(_toConsumableArray(Array(_this.props.expectedValue.length)))
            });
        }

        if (_this.props.type === 'multi-text') {
            _this.state = Object.assign({}, _this.state, {
                inputPartsValid: [].concat(_toConsumableArray(Array(_this.props.expectedValue.length))),
                inputFocus: false,
                inputNonEmpty: [].concat(_toConsumableArray(Array(_this.props.expectedValue.length))),
                inputValue: [].concat(_toConsumableArray(Array(_this.props.expectedValue.length)))
            });
        }

        if (_this.props.type === 'mask' || _this.props.type === 'textarea' || _this.props.type === 'text-arrows' || _this.props.type === 'text' || _this.props.type === 'select-filtered' || _this.props.type === 'select' && _this.props.otherOption) {
            _this.handleFocus = _this.handleFocus.bind(_this);
            _this.handleBlur = _this.handleBlur.bind(_this);
            _this.handleChange = _this.handleChange.bind(_this);

            _this.state = Object.assign({}, _this.state, {
                inputFocus: false,
                inputNonEmpty: false,
                inputValue: '',
                inputLength: 0
            });
        }

        if (_this.props.type === 'text-arrows' && typeof _this.props.initialValue !== 'undefined') {
            _this.state = Object.assign({}, _this.state, {
                inputValue: _this.props.initialValue
            });
        }
        return _this;
    }

    _createClass(InputWrapper, [{
        key: 'handleFocus',
        value: function handleFocus() {
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
        key: 'handleLabel',
        value: function handleLabel() {
            if (!this.props.disabled && this.node) {
                this.node.focus();
            }
        }
    }, {
        key: 'handleChange',
        value: function handleChange(event) {
            var _this2 = this;

            var index = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : -1;

            if (!this.props.disabled) {
                var eventType = typeof event !== 'undefined' ? event.type : undefined;
                var inputValue = typeof event !== 'undefined' ? this.props.type === 'multi-text' || this.props.type === 'text-select-text' ? this.state.inputValue.map(function (chunkStr, chunkIndex) {
                    return index === chunkIndex ? event.target.value : chunkStr;
                }) : event.target.value : this.node && this.node.tagName.toLowerCase() === 'input' && this.node.type === 'text' ? this.node.value : typeof this.props.speechRecognition !== 'undefined' ? this.props.speechRecognition.inputValue : undefined;

                if (typeof inputValue === 'undefined') {
                    return false;
                }

                var inputValid = this.props.optional ? true : typeof this.props.expectedValue !== 'undefined' ? this.props.type === 'multi-text' || this.props.type === 'text-select-text' ? this.props.expectedValue.join(this.props.separator) === inputValue.join(this.props.separator) : this.props.expectedValue === inputValue : typeof this.props.regex !== 'undefined' ? this.props.regex.test(inputValue) : typeof this.props.regexp !== 'undefined' ? new (Function.prototype.bind.apply(RegExp, [null].concat(_toConsumableArray(this.props.regexp))))().test(inputValue) : inputValue !== '';

                var inputLength = this.props.type === 'multi-text' ? inputValue.reduce(function (a, b) {
                    return a + (b ? b.length : 0);
                }, 0) : inputValue.length;

                if (this.props.type === 'multi-text' || this.props.type === 'text-select-text') {
                    var inputPartsValid = inputValue.map(function (chunkStr, chunkIndex) {
                        return chunkStr === _this2.props.expectedValue[chunkIndex];
                    });

                    this.setState({
                        inputPartsValid: inputPartsValid
                    });
                }

                this.setState({
                    inputValue: inputValue,
                    inputValid: inputValid,
                    inputLength: inputLength
                }, function () {
                    if (eventType === 'triggerChange') {
                        _this2.handleBlur();
                    }
                });

                var dataPassed = {
                    value: inputValue,
                    valid: inputValid
                };

                if (typeof this.props.index !== 'undefined') {
                    dataPassed.index = this.props.index;
                }

                if (_typeof(this.props.context)) {
                    dataPassed.context = this.props.context;
                }

                this.props.onChange(dataPassed);
            }
        }
    }, {
        key: 'handleRange',
        value: function handleRange(event) {
            if (!this.props.disabled) {
                var rangeValue = parseInt(event.target.value);

                this.handleOption(rangeValue, rangeValue);
            }
        }
    }, {
        key: 'handleOption',
        value: function handleOption(optionIndex, optionValue) {
            var _this3 = this;

            var otherOptionChosen = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
            var inputIndex = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : -1;

            if (!this.props.disabled) {
                var inputValue = this.props.type === 'text-select-text' ? this.state.inputValue.map(function (chunkStr, chunkIndex) {
                    return inputIndex === chunkIndex ? optionValue : chunkStr;
                }) : undefined;
                var inputValid = this.multiPartInput && inputIndex !== -1 ? this.props.options.map(function (optionsList, optionsListIndex) {
                    if (optionsListIndex === inputIndex) {
                        return optionsList[optionIndex];
                    } else {
                        return optionsList[_this3.state.chosenIndexes[optionsListIndex]];
                    }
                }).join(this.props.separator) === this.props.expectedValue.join(this.props.separator) : typeof this.props.expectedValue !== 'undefined' ? this.props.type === 'text-select-text' ? this.props.expectedValue.join(this.props.separator) === inputValue.join(this.props.separator) : this.props.expectedValue === optionValue : otherOptionChosen !== true ? true : this.state.inputValue !== '';

                this.setState({
                    inputValid: inputValid
                });

                if (this.props.type === 'text-select-text') {
                    this.setState(function (state) {
                        return Object.assign({}, state, {
                            chosenIndex: optionIndex,
                            inputValue: inputValue,
                            inputPartsValid: state.inputPartsValid.map(function (chunkBool, chunkIndex) {
                                if (chunkIndex === 1) {
                                    return _this3.props.expectedValue[chunkIndex] === optionValue;
                                }

                                return chunkBool;
                            })
                        });
                    });
                } else if (this.multiPartInput) {
                    var formerlyUndefined = typeof this.state.chosenIndexes[inputIndex] === 'undefined';

                    this.setState(function (state) {
                        var chosenIndexes = state.chosenIndexes.map(function (item, index) {
                            return index === inputIndex ? optionIndex : item;
                        });

                        var inputPartsValid = chosenIndexes.map(function (item, index) {
                            return typeof item !== 'undefined' ? _this3.props.expectedValue[index] === _this3.props.options[index][item] : false;
                        });

                        return Object.assign({}, state, {
                            inputPartsValid: inputPartsValid,
                            chosenIndexes: chosenIndexes
                        });
                    });

                    if (this.props.type === 'timetable' && (inputIndex === 1 && typeof this.state.chosenIndexes[0] !== 'undefined' || inputIndex === 0 && formerlyUndefined && typeof this.state.chosenIndexes[1] !== 'undefined')) {
                        this.handleTimetableWrapper();
                    }
                } else {
                    this.setState({
                        chosenIndex: optionIndex
                    });
                }

                this.props.onChange({
                    index: this.props.index,
                    valid: inputValid,
                    value: otherOptionChosen !== true ? optionValue : this.state.inputValue
                });
            }
        }
    }, {
        key: 'handleClickOutside',
        value: function handleClickOutside(event) {
            if (this.props.disabled || this.node.contains(event.target)) {
                return;
            }

            if (this.props.type === 'timetable') {
                this.handleTimetableWrapper();
            } else if (this.props.type === 'calendar') {
                this.handleCalendarState();
            }
        }
    }, {
        key: 'handleTimeTableList',
        value: function handleTimeTableList(optionIndex, optionValue, listIndex) {
            this.handleOption(optionIndex, optionValue, false, listIndex);
        }
    }, {
        key: 'handleTimetableWrapper',
        value: function handleTimetableWrapper() {
            if (!this.props.disabled) {
                if (!this.state.timetable.open) {
                    document.addEventListener('click', this.handleClickOutside, false);
                } else {
                    document.removeEventListener('click', this.handleClickOutside, false);
                }

                this.setState({
                    timetable: Object.assign({}, this.state.timetable, {
                        open: !this.state.timetable.open
                    })
                });
            }
        }
    }, {
        key: 'handleArrow',
        value: function handleArrow() {
            var arrowRight = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

            if (!this.props.disabled && this.node && this.node.tagName.toLowerCase() === 'input' && this.node.type === 'text') {
                var value = this.node.value;

                if (value.match(/\d{1,2}\:\d{2}/) !== null) {
                    var hoursMinutes = value.split(':');
                    var sgn = arrowRight ? 1 : -1;
                    var currDate = new Date(1970, 1, 1, hoursMinutes[0], hoursMinutes[1]);
                    var newDate = new Date(currDate.getTime() + sgn * 600000);

                    this.node.value = ('0' + newDate.getHours()).slice(-2) + ':' + ('0' + newDate.getMinutes()).slice(-2);
                    this.handleChange();
                }
            }
        }
    }, {
        key: 'handleIncDec',
        value: function handleIncDec() {
            var increment = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

            if (!this.props.disabled) {
                var value = increment ? this.state.chosenIndex + 1 : this.state.chosenIndex - 1;

                if (value >= this.props.minValue && value <= this.props.maxValue) {
                    this.handleOption(value, value);
                }
            }
        }
    }, {
        key: 'handleCalendarState',
        value: function handleCalendarState() {
            if (!this.props.disabled) {
                if (!this.state.calendar.open) {
                    document.addEventListener('click', this.handleClickOutside, false);
                } else {
                    document.removeEventListener('click', this.handleClickOutside, false);
                }

                this.setState(function (state) {
                    return Object.assign({}, state, {
                        calendar: Object.assign({}, state.calendar, {
                            open: !state.calendar.open
                        })
                    });
                });
            }
        }
    }, {
        key: 'handleCalendarDate',
        value: function handleCalendarDate(calendar, date) {
            if (!this.props.disabled && calendar) {
                calendar.set(date);

                var inputValue = date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2);
                var inputValid = inputValue === this.props.expectedValue;

                this.setState({
                    inputValue: inputValue
                });

                this.handleCalendarState();

                this.setState({
                    inputValue: inputValue,
                    inputValid: inputValid
                });

                this.props.onChange({
                    index: this.props.index,
                    value: inputValue,
                    valid: inputValid
                });
            }
        }
    }, {
        key: 'componentDidMount',
        value: function componentDidMount() {
            var _this4 = this;

            if (this.props.type === 'text') {
                var _self = this;

                this.node.addEventListener('triggerChange', function (event) {
                    _self.handleChange(event);
                });
            } else if (this.props.type === 'calendar') {
                if (jsCalendar && this.node) {
                    var calendar = jsCalendar.new(this.node);

                    calendar.onDateClick(function (event, date) {
                        _this4.handleCalendarDate(calendar, date);
                    });
                }
            }
        }
    }, {
        key: 'componentDidUpdate',
        value: function componentDidUpdate(prevProps) {
            if (typeof this.props.speechRecognition !== 'undefined' && prevProps.speechRecognition.inputValue !== this.props.speechRecognition.inputValue) {
                this.handleChange();
            }
        }
    }, {
        key: 'render',
        value: function render() {
            var _this5 = this;

            var wrapperClassName = ('wrapper' + ' ' + (this.props.error ? 'on-form-error' : '') + ' ' + (this.state.inputValid ? '' : 'on-input-invalid') + ' ' + (typeof this.props.wrapperClass !== 'undefined' ? this.props.wrapperClass : '')).trim().replace(/\s+/g, ' ');
            var labelClassName = ((this.props.disabled ? 'on-input-disabled' : '') + ' ' + (this.state.inputFocus ? 'on-input-focus' : '') + ' ' + (this.state.inputNonEmpty ? 'on-input-non-empty' : '')).trim().replace(/\s+/g, ' ');

            return React.createElement(
                'div',
                { className: wrapperClassName !== "" ? wrapperClassName : undefined },
                React.createElement(
                    'label',
                    { className: labelClassName !== "" ? labelClassName : undefined, onClick: this.handleLabel },
                    this.props.label,
                    this.props.optional && " *"
                ),
                this.props.type === "calendar" && React.createElement(
                    'div',
                    { className: 'calendar-wrapper' },
                    React.createElement(
                        'div',
                        { className: ("calendar-input " + (this.props.disabled ? "disabled" : "")).trim(), onClick: this.handleCalendarState },
                        this.state.inputValue ? this.state.inputValue : "---"
                    ),
                    React.createElement('div', { ref: function ref(node) {
                            return _this5.node = node;
                        }, className: ("jsCalendar calendar-jsCalendar material-theme " + (!this.state.calendar.open ? "hidden" : "")).trim(), 'data-first-day-of-the-week': '2', 'data-language': 'pl', 'data-month-format': 'month YYYY' })
                ),
                this.props.type === "timetable" && this.state.timetable.open && React.createElement(
                    'ul',
                    { className: 'timetable-list', ref: function ref(node) {
                            return _this5.node = node;
                        } },
                    this.props.options.map(function (list, listIndex) {
                        return React.createElement(
                            'li',
                            { key: listIndex },
                            typeof _this5.props.optionNames !== 'undefined' && React.createElement(
                                'h4',
                                null,
                                _this5.props.optionNames[listIndex]
                            ),
                            React.createElement(
                                'ul',
                                { className: _this5.state.inputPartsValid[listIndex] ? "on-input-part-valid" : undefined },
                                list.map(function (optionValue, optionIndex) {
                                    return React.createElement(
                                        'li',
                                        { key: optionIndex },
                                        React.createElement(
                                            'p',
                                            { className: _this5.state.chosenIndexes[listIndex] === optionIndex ? "chosen" : undefined, onClick: _this5.handleTimeTableList.bind(_this5, optionIndex, optionValue, listIndex) },
                                            optionValue
                                        )
                                    );
                                })
                            )
                        );
                    })
                ),
                this.props.type === "timetable" && React.createElement(
                    'p',
                    { className: "timetable-wrapper " + (this.props.disabled ? "disabled" : "").trim(), onClick: this.handleTimetableWrapper.bind(this) },
                    React.createElement(
                        'span',
                        null,
                        typeof this.state.chosenIndexes[0] !== "undefined" ? this.props.options[0][this.state.chosenIndexes[0]] : '\u2013',
                        ':',
                        typeof this.state.chosenIndexes[1] !== "undefined" ? this.props.options[1][this.state.chosenIndexes[1]] : '\u2013'
                    )
                ),
                this.props.type === "range" && React.createElement(
                    'p',
                    { className: 'range-wrapper' },
                    React.createElement('input', { min: this.props.minValue, type: 'range', max: this.props.maxValue, value: this.state.chosenIndex, onChange: this.handleRange.bind(this), disabled: this.props.disabled }),
                    React.createElement(
                        'span',
                        null,
                        this.state.chosenIndex
                    )
                ),
                this.props.type === "mask" && React.createElement(window.ReactInputMask, { maxLength: this.inputMaxLength, type: 'text', spellCheck: 'false', autoComplete: 'off', onFocus: this.handleFocus, onBlur: this.handleBlur, onChange: this.handleChange, disabled: this.props.disabled, value: this.state.inputValue, mask: this.props.mask, maskChar: null }),
                this.props.type === 'text-arrows' && React.createElement(
                    'i',
                    { className: ("material-icons arrow-left " + (this.props.disabled ? "disabled" : "")).trim(), onClick: this.handleArrow.bind(this, false) },
                    'keyboard_arrow_left'
                ),
                (this.props.type === "text" || this.props.type === 'text-arrows') && React.createElement('input', { ref: function ref(node) {
                        return _this5.node = node;
                    }, maxLength: this.inputMaxLength, type: 'text', spellCheck: 'false', autoComplete: 'off', onFocus: this.handleFocus, onBlur: this.handleBlur, onChange: this.handleChange, disabled: this.props.disabled, value: this.state.inputValue }),
                this.props.type === "multi-text" && Array.isArray(this.props.expectedValue) && React.createElement(
                    'div',
                    { className: 'multi-text-wrapper' },
                    [].concat(_toConsumableArray(Array(this.props.expectedValue.length))).map(function (x, index, array) {
                        var separator = typeof _this5.props.separator !== 'undefined' && index < array.length - 1 ? React.createElement(
                            'span',
                            { className: 'separator', key: index + "-span" },
                            _this5.props.separator
                        ) : "";
                        return [React.createElement('input', { className: _this5.state.inputPartsValid[index] ? "on-input-part-valid" : "", key: index + "-input", maxLength: _this5.inputMaxLength[index], type: 'text', spellCheck: 'false', autoComplete: 'off', disabled: _this5.props.disabled, onChange: _this5.handleChange.bind(_this5, event, index) }), separator];
                    })
                ),
                this.props.type === 'text-arrows' && React.createElement(
                    'i',
                    { className: ("material-icons arrow-right " + (this.props.disabled ? "disabled" : "")).trim(), onClick: this.handleArrow.bind(this) },
                    'keyboard_arrow_right'
                ),
                this.props.type === "inc-dec" && React.createElement(
                    'p',
                    { className: 'inc-dec' },
                    React.createElement(
                        'i',
                        { className: "material-icons " + (this.props.disabled || this.state.chosenIndex === this.props.minValue ? "disabled" : ""), onClick: this.handleIncDec.bind(this, false) },
                        'remove'
                    ),
                    React.createElement(
                        'span',
                        { className: this.props.disabled ? "disabled" : undefined },
                        this.state.chosenIndex
                    ),
                    React.createElement(
                        'i',
                        { className: "material-icons " + (this.props.disabled || this.state.chosenIndex === this.props.maxValue ? "disabled" : ""), onClick: this.handleIncDec.bind(this, true) },
                        'add'
                    )
                ),
                this.props.type === "textarea" && React.createElement('textarea', { ref: function ref(node) {
                        return _this5.node = node;
                    }, spellCheck: 'false', maxLength: this.inputMaxLength, disabled: this.props.disabled, onFocus: this.handleFocus, onChange: this.handleChange, onBlur: this.handleBlur }),
                this.props.type === "toggle-btn" && this.props.options.length === 2 && React.createElement(
                    'button',
                    { className: ("toggle " + (this.state.chosenIndex === 1 ? "on" : "off")).trim(), onClick: this.handleOption.bind(this, 1 - this.state.chosenIndex, this.props.options[1 - this.state.chosenIndex]), disabled: this.props.disabled },
                    this.props.options[this.state.chosenIndex]
                ),
                this.props.type === "toggle-switch" && this.props.options.length === 2 && React.createElement('div', { className: ("toggle-switch " + (this.state.chosenIndex === 1 ? "on" : "off") + " " + (this.props.disabled ? "disabled" : "")).trim().replace(/\s+/g, " "), onClick: this.handleOption.bind(this, 1 - this.state.chosenIndex, this.props.options[1 - this.state.chosenIndex]) }),
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
                this.props.type === "text-select-text" && React.createElement(
                    'div',
                    { className: 'text-select-text-wrapper' },
                    this.props.miniLabels.map(function (miniLabel, index) {
                        return React.createElement(
                            'span',
                            { key: index, className: ("mini-label " + (_this5.props.disabled ? "disabled" : "") + (_this5.state.inputPartsValid[index] ? "on-input-part-valid" : "")).trim().replace(/\s+/g, " ") },
                            miniLabel
                        );
                    }),
                    React.createElement('input', { type: 'text', spellCheck: 'false', autoComplete: 'off', className: this.state.inputPartsValid[0] ? "on-input-part-valid" : undefined, disabled: this.props.disabled, maxLength: this.props.maxLength[0], onChange: this.handleChange.bind(this, event, 0) }),
                    React.createElement(Select, { 'class': this.state.inputPartsValid[1] ? "on-input-part-valid" : undefined, disabled: this.props.disabled, options: this.props.selectOptions, chosenIndex: this.state.chosenIndex, onOption: this.handleOption.bind(this), selectIndex: 1 }),
                    React.createElement('input', { type: 'text', spellCheck: 'false', autoComplete: 'off', className: this.state.inputPartsValid[2] ? "on-input-part-valid" : undefined, disabled: this.props.disabled, maxLength: this.props.maxLength[2], onChange: this.handleChange.bind(this, event, 2) })
                ),
                this.props.type === "select-filtered" && React.createElement(Select, _defineProperty({ selectFiltered: true, disabled: this.props.disabled, options: this.props.options, inputNodeRef: function inputNodeRef(inputNode) {
                        return _this5.node = inputNode;
                    }, inputMaxLength: this.inputMaxLength, inputValue: this.state.inputValue, onInputFocus: this.handleFocus, onInputBlur: this.handleBlur, onInputChange: this.handleChange }, 'inputValue', this.state.inputValue)),
                this.props.type === "multi-select" && Array.isArray(this.props.options) && this.props.options.map(function (options, index) {
                    return React.createElement(Select, { 'class': _this5.state.inputPartsValid[index] ? "on-input-part-valid" : "", key: index, multiSelect: true, selectIndex: index, disabled: _this5.props.disabled, options: options, chosenIndex: _this5.state.chosenIndexes[index], onOption: _this5.handleOption.bind(_this5) });
                }),
                this.props.type === "select" && React.createElement(Select, { disabled: this.props.disabled, otherOption: this.props.otherOption, options: this.props.options, onOption: this.handleOption.bind(this), chosenIndex: this.state.chosenIndex, inputNodeRef: function inputNodeRef(inputNode) {
                        return _this5.node = inputNode;
                    }, inputMaxLength: this.inputMaxLength, inputValue: this.state.inputValue, onInputFocus: this.handleFocus, onInputBlur: this.handleBlur, onInputChange: this.handleChange }),
                (this.props.optional || this.props.type === "textarea" && !this.props.insideTask) && React.createElement(
                    'div',
                    { className: 'notes-wrapper' },
                    this.props.type === "textarea" && React.createElement(
                        'p',
                        { className: 'note' },
                        'Pozosta\u0142o znak\xF3w: ',
                        React.createElement(
                            'span',
                            { className: 'text-important' },
                            this.inputMaxLength - this.state.inputLength
                        )
                    ),
                    this.props.optional && React.createElement(
                        'p',
                        { className: 'note' },
                        '* Pole opcjonalne'
                    )
                ),
                this.props.speechRecognition && React.createElement(
                    'div',
                    { className: ("sr-wrapper " + (this.props.disabled ? "disabled" : "") + " " + (this.props.speechRecognition.currentIndex === this.props.index ? "active" : "")).trim().replace(/\s+/g, " ") },
                    React.createElement(
                        'i',
                        { onClick: this.props.onSpeechRecognitionTimesClick, 'data-input-index': this.props.index, className: 'material-icons' },
                        'close'
                    ),
                    React.createElement(
                        'span',
                        null,
                        this.props.speechRecognition.inputValue
                    ),
                    React.createElement(
                        'i',
                        { onClick: this.props.onSpeechRecognitionMicClick, 'data-input-index': this.props.index, className: 'material-icons' },
                        'mic'
                    )
                )
            );
        }
    }]);

    return InputWrapper;
}(React.Component);