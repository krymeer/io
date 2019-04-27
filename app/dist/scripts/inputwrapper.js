var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

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

        _this.inputMaxLength = typeof _this.props.maxLength !== "undefined" ? _this.props.maxLength : _this.props.type === 'textarea' ? globals.maxLength.textarea : globals.maxLength.input;

        _this.handleLabel = _this.handleLabel.bind(_this);

        if (_this.props.type === 'toggle-switch' || _this.props.type === 'toggle-btn') {
            _this.state = Object.assign({}, _this.state, {
                chosenIndex: typeof _this.props.initialValue !== 'undefined' ? _this.props.options.indexOf(_this.props.initialValue) : 0
            });
        }

        if (_this.props.type === 'textarea' || _this.props.type === 'text' || _this.props.type === 'select' && _this.props.otherOption) {
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

        if (_this.props.type === 'select') {
            _this.state = Object.assign({}, _this.state, {
                selectList: {}
            });

            _this.handleClickOutside = _this.handleClickOutside.bind(_this);
            _this.handleSelect = _this.handleSelect.bind(_this);
        }
        return _this;
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
            if (!this.props.disabled && typeof this.node !== 'undefined') {
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
        key: 'handleOption',
        value: function handleOption(optionIndex, optionValue) {
            if (!this.props.disabled) {
                var otherOptionChosen = this.props.type === 'select' && this.props.otherOption && optionIndex === this.props.options.length - 1;
                var inputValid = typeof this.props.expectedValue !== 'undefined' ? this.props.expectedValue === optionValue : otherOptionChosen ? this.state.inputValue !== '' : true;

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
            var _this3 = this;

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
                    if (_this3.state.selectList.open) {
                        var listNode = currentNode.closest('.select-current').nextElementSibling;

                        if (listNode !== null) {
                            var listNodeOffsetBtm = document.body.parentElement.scrollTop + listNode.getBoundingClientRect().top + listNode.offsetHeight;
                            var overflowDirection = listNodeOffsetBtm > bodyScrollHeight ? 'top' : 'bottom';

                            _this3.setState(function (state) {
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
                this.props.type === "text" && React.createElement('input', { ref: function ref(node) {
                        return _this4.node = node;
                    }, maxLength: this.inputMaxLength, type: 'text', spellCheck: 'false', autoComplete: 'off', onFocus: this.handleFocus, onBlur: this.handleBlur, onChange: this.handleChange, disabled: this.props.disabled, value: this.state.inputValue }),
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
                                return _this4.node = node;
                            } },
                        this.props.options.map(function (option, index) {
                            if (index !== _this4.state.chosenIndex) {
                                return React.createElement(
                                    'li',
                                    { key: index, className: 'select-option', onClick: _this4.handleOption.bind(_this4, index, option) },
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
                    this.state.otherOptionChosen && React.createElement('input', { ref: function ref(node) {
                            return _this4.node = node;
                        }, className: 'select-other', maxLength: this.inputMaxLength, type: 'text', spellCheck: 'false', autoComplete: 'off', disabled: this.props.disabled, onFocus: this.handleFocus, onBlur: this.handleBlur, onChange: this.handleChange, value: this.state.inputValue })
                ),
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