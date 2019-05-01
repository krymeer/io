var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Select = function (_React$Component) {
    _inherits(Select, _React$Component);

    function Select(props) {
        _classCallCheck(this, Select);

        var _this = _possibleConstructorReturn(this, (Select.__proto__ || Object.getPrototypeOf(Select)).call(this, props));

        _this.state = {
            list: {}
        };

        _this.handleSelect = _this.handleSelect.bind(_this);
        _this.handleClickOutside = _this.handleClickOutside.bind(_this);
        return _this;
    }

    _createClass(Select, [{
        key: 'handleClickOutside',
        value: function handleClickOutside(event) {
            if (this.props.disabled || this.listNode.contains(event.target)) {
                return;
            }

            if (this.state.list.open) {
                this.handleSelect();
            }
        }
    }, {
        key: 'handleSelect',
        value: function handleSelect(event) {
            var _this2 = this;

            if (!this.props.disabled) {
                var bodyScrollHeight = document.body.scrollHeight;
                var currentNode = typeof event !== 'undefined' ? event.target : '';

                if (!this.state.list.open) {
                    document.addEventListener('click', this.handleClickOutside, false);
                } else {
                    document.removeEventListener('click', this.handleClickOutside, false);
                }

                this.setState(function (state) {
                    return {
                        list: Object.assign({}, state.list, {
                            open: !state.list.open,
                            overflow: undefined
                        })
                    };
                }, function () {
                    if (_this2.state.list.open) {
                        var listNode = currentNode.closest('.select-current').nextElementSibling;

                        if (listNode !== null) {
                            var listNodeOffsetBtm = document.body.parentElement.scrollTop + listNode.getBoundingClientRect().top + listNode.offsetHeight;
                            var overflowDirection = listNodeOffsetBtm > bodyScrollHeight ? 'top' : 'bottom';

                            _this2.setState(function (state) {
                                return {
                                    list: Object.assign({}, state.list, {
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
        key: 'handleOption',
        value: function handleOption(optionIndex, optionValue) {
            var otherOptionChosen = this.props.otherOption && optionIndex === this.props.options.length - 1;

            this.setState({
                otherOptionChosen: otherOptionChosen
            });

            this.handleSelect();
            this.props.onOption(optionIndex, optionValue, otherOptionChosen);
        }
    }, {
        key: 'render',
        value: function render() {
            var _this3 = this;

            return React.createElement(
                'div',
                { className: 'select-wrapper' },
                React.createElement(
                    'div',
                    { className: ("select-current " + (this.props.disabled ? "disabled" : "") + " " + (this.state.list.open ? "focus" : "")).trim().replace(/\s+/g, " "), onClick: this.handleSelect },
                    React.createElement(
                        'span',
                        null,
                        this.props.chosenIndex >= 0 ? this.props.options[this.props.chosenIndex] : ""
                    ),
                    React.createElement(
                        'i',
                        { className: 'material-icons' },
                        this.state.list.open ? "keyboard_arrow_up" : "keyboard_arrow_down"
                    )
                ),
                this.state.list.open && React.createElement(
                    'ul',
                    { className: ("select-list " + this.props.overflow).trim(), ref: function ref(listNode) {
                            return _this3.listNode = listNode;
                        } },
                    this.props.options.map(function (option, index) {
                        if (index !== _this3.props.chosenIndex) {
                            return React.createElement(
                                'li',
                                { key: index, className: 'select-option', onClick: _this3.handleOption.bind(_this3, index, option) },
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
                this.state.otherOptionChosen && React.createElement('input', { className: 'select-other', ref: this.props.inputNodeRef, maxLength: this.props.inputMaxLength, type: 'text', spellCheck: 'false', autoComplete: 'off', disabled: this.props.disabled, onFocus: this.props.onInputFocus, onBlur: this.props.onInputBlur, onChange: this.props.onInputChange, value: this.props.inputValue })
            );
        }
    }]);

    return Select;
}(React.Component);