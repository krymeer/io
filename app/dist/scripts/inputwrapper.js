var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

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
            inputValid: _this.props.optional ? true : typeof _this.props.initialValue !== 'undefined' && typeof _this.props.expectedValue !== 'undefined' ? _this.props.initialValue === _this.props.expectedValue : false
        };
        _this.multiPartInput = typeof _this.props.options !== 'undefined' && _this.props.options.filter(function (array) {
            return !Array.isArray(array);
        }).length === 0 && typeof _this.props.separator !== 'undefined' && Array.isArray(_this.props.expectedValue);
        _this.handleLabel = _this.handleLabel.bind(_this);
        _this.inputMaxLength = typeof _this.props.maxLength !== 'undefined' ? _this.props.maxLength : _this.props.type === 'textarea' ? globals.maxLength.textarea : globals.maxLength.input;

        if (_this.multiPartInput) {
            _this.state = Object.assign({}, _this.state, {
                chosenIndexes: [].concat(_toConsumableArray(Array(_this.props.options.length))),
                inputPartsValid: [].concat(_toConsumableArray(Array(_this.props.options.length)))
            });
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

        if (_this.props.type === 'mask' || _this.props.type === 'textarea' || _this.props.type === 'text' || _this.props.type === 'select' && _this.props.otherOption) {
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

            if (!this.props.disabled) {
                var eventType = event.type;
                var inputValue = event.target.value;
                var inputValid = this.props.optional ? true : typeof this.props.expectedValue !== 'undefined' ? this.props.expectedValue === inputValue : typeof this.props.regex !== 'undefined' ? this.props.regex.test(inputValue) : inputValue !== '';
                this.setState({
                    inputValue: inputValue,
                    inputValid: inputValid,
                    inputLength: inputValue.length
                }, function () {
                    if (eventType === 'triggerChange') {
                        _this2.handleBlur();
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
                var inputValid = this.multiPartInput && inputIndex !== -1 ? this.props.options.map(function (optionsList, optionsListIndex) {
                    if (optionsListIndex === inputIndex) {
                        return optionsList[optionIndex];
                    } else {
                        return optionsList[_this3.state.chosenIndexes[optionsListIndex]];
                    }
                }).join(this.props.separator) === this.props.expectedValue.join(this.props.separator) : typeof this.props.expectedValue !== 'undefined' ? this.props.expectedValue === optionValue : otherOptionChosen ? this.state.inputValue !== '' : true;

                this.setState({
                    inputValid: inputValid
                });

                if (this.multiPartInput) {
                    this.setState(function (state) {

                        var chosenIndexes = state.chosenIndexes.map(function (item, index) {
                            return index === inputIndex ? optionIndex : item;
                        });

                        var inputPartsValid = chosenIndexes.map(function (item, index) {
                            return item ? _this3.props.expectedValue[index] === _this3.props.options[index][item] : false;
                        });

                        return Object.assign({}, state, {
                            inputPartsValid: inputPartsValid,
                            chosenIndexes: chosenIndexes
                        });
                    });
                } else {
                    this.setState({
                        chosenIndex: optionIndex
                    });
                }

                this.props.onChange({
                    index: this.props.index,
                    valid: inputValid,
                    value: optionValue
                });
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
        key: 'componentDidMount',
        value: function componentDidMount() {
            if (this.props.type === 'text') {
                var _self = this;

                this.node.addEventListener('triggerChange', function (event) {
                    _self.handleChange(event);
                });
            }
        }
    }, {
        key: 'render',
        value: function render() {
            var _this4 = this;

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
                this.props.type === "text" && React.createElement('input', { ref: function ref(node) {
                        return _this4.node = node;
                    }, maxLength: this.inputMaxLength, type: 'text', spellCheck: 'false', autoComplete: 'off', onFocus: this.handleFocus, onBlur: this.handleBlur, onChange: this.handleChange, disabled: this.props.disabled, value: this.state.inputValue }),
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
                        return _this4.node = node;
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
                            { className: ("radio-item " + (_this4.state.chosenIndex === index ? "chosen" : "") + " " + (_this4.props.disabled ? "disabled" : "")).trim().replace(/\s+/g, " "), key: index },
                            React.createElement('div', { className: 'radio', onClick: _this4.handleOption.bind(_this4, index, option) }),
                            React.createElement(
                                'span',
                                null,
                                option
                            )
                        );
                    })
                ),
                this.props.type === "multi-select" && Array.isArray(this.props.options) && this.props.options.map(function (options, index) {
                    return React.createElement(Select, { 'class': _this4.state.inputPartsValid[index] ? 'on-input-part-valid' : '', key: index, multiSelect: true, selectIndex: index, disabled: _this4.props.disabled, options: options, chosenIndex: _this4.state.chosenIndexes[index], onOption: _this4.handleOption.bind(_this4) });
                }),
                this.props.type === "select" && React.createElement(Select, { disabled: this.props.disabled, otherOption: this.props.otherOption, options: this.props.options, onOption: this.handleOption.bind(this), chosenIndex: this.state.chosenIndex, inputNodeRef: function inputNodeRef(inputNode) {
                        return _this4.node = inputNode;
                    }, inputMaxLength: this.inputMaxLength, inputValue: this.state.inputValue, onInputFocus: this.handleFocus, onInputBlur: this.handleBlur, onInputChange: this.handleChange }),
                React.createElement(
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
                )
            );
        }
    }]);

    return InputWrapper;
}(React.Component);