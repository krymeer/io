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
        _this.handleOverflow = _this.handleOverflow.bind(_this);
        _this.handleClickOutside = _this.handleClickOutside.bind(_this);

        if (_this.props.selectFiltered) {
            var options = _this.props.options;

            if (typeof options !== 'undefined') {
                _this.state = Object.assign({}, _this.state, {
                    list: Object.assign({}, _this.state.list, {
                        filtered: _this.props.options
                    })
                });
            }

            _this.handleFilterFocus = _this.handleFilterFocus.bind(_this);
            _this.handleFilterChange = _this.handleFilterChange.bind(_this);
            _this.handleFilterBlur = _this.handleFilterBlur.bind(_this);
        }
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
        key: 'getListFiltered',
        value: function getListFiltered(eventTarget) {
            var _this2 = this;

            if (!this.props.disabled && eventTarget) {
                var bodyScrollHeight = document.body.scrollHeight;
                var listFiltered = this.props.options.filter(function (option) {
                    var optLowerCase = option.toLowerCase();
                    var matches = eventTarget.value.toLowerCase().replace(/\s+/g, ' ').split(' ').map(function (str) {
                        return optLowerCase.indexOf(str) !== -1;
                    });

                    return matches.filter(function (match) {
                        return match === false;
                    }).length === 0;
                });

                this.setState(function (state) {
                    return Object.assign({}, state, {
                        list: Object.assign({}, state.list, {
                            filtered: listFiltered
                        })
                    });
                }, function () {
                    _this2.handleOverflow(eventTarget, bodyScrollHeight);
                });
            }
        }
    }, {
        key: 'handleFilterFocus',
        value: function handleFilterFocus(event) {
            if (!this.props.disabled) {
                this.props.onInputFocus();
                this.getListFiltered(event.target);
                this.handleSelect(event);
            }
        }
    }, {
        key: 'handleFilterChange',
        value: function handleFilterChange(event) {
            if (!this.props.disabled) {
                this.props.onInputChange(event);
                this.getListFiltered(event.target);
            }
        }
    }, {
        key: 'handleFilterBlur',
        value: function handleFilterBlur(event) {
            if (!this.props.disabled) {
                this.props.onInputBlur();
                this.handleSelect(event);
            }
        }
    }, {
        key: 'handleOverflow',
        value: function handleOverflow(eventTarget, bodyScrollHeight) {
            if (!this.props.disabled && this.state.list.open && typeof eventTarget !== 'undefined') {
                var listNode = this.props.selectFiltered ? eventTarget.nextElementSibling : eventTarget.closest('.select-current').nextElementSibling;

                if (listNode !== null) {
                    var listNodeOffsetBtm = document.body.parentElement.scrollTop + eventTarget.getBoundingClientRect().bottom + listNode.offsetHeight;
                    var overflowDirection = listNodeOffsetBtm > bodyScrollHeight ? 'top' : 'bottom';

                    this.setState(function (state) {
                        return {
                            list: Object.assign({}, state.list, {
                                overflow: overflowDirection
                            })
                        };
                    });
                }
            }
        }
    }, {
        key: 'handleSelect',
        value: function handleSelect(event) {
            var _this3 = this;

            if (!this.props.disabled) {
                var eventTarget = typeof event !== 'undefined' ? event.target : undefined;
                var bodyScrollHeight = document.body.scrollHeight;

                if (!this.props.selectFiltered) {
                    if (!this.state.list.open) {
                        document.addEventListener('click', this.handleClickOutside, false);
                    } else {
                        document.removeEventListener('click', this.handleClickOutside, false);
                    }
                }

                this.setState(function (state) {
                    return {
                        list: Object.assign({}, state.list, {
                            open: !state.list.open,
                            overflow: ""
                        })
                    };
                }, function () {
                    _this3.handleOverflow(eventTarget, bodyScrollHeight);
                });
            }
        }
    }, {
        key: 'handleOptionFiltered',
        value: function handleOptionFiltered(option) {
            if (!this.props.disabled) {
                var inputNode = this.listNode.previousElementSibling;

                if (inputNode !== null) {
                    inputNode.value = option;
                    this.props.onInputChange();
                }
            }
        }
    }, {
        key: 'handleOption',
        value: function handleOption(optionIndex, optionValue) {
            if (!this.props.disabled) {
                var otherOptionChosen = this.props.otherOption && optionIndex === this.props.options.length - 1;
                var selectIndex = this.props.multiSelect && typeof this.props.selectIndex !== 'undefined' ? this.props.selectIndex : -1;

                this.setState({
                    otherOptionChosen: otherOptionChosen
                });

                this.handleSelect();
                this.props.onOption(optionIndex, optionValue, otherOptionChosen, selectIndex);
            }
        }
    }, {
        key: 'render',
        value: function render() {
            var _this4 = this;

            return React.createElement(
                'div',
                { className: ("select-wrapper " + (typeof this.props.class !== "undefined" ? this.props.class : "")).trim() },
                this.props.selectFiltered && React.createElement('input', { className: 'select-filter', ref: this.props.inputNodeRef, maxLength: this.props.inputMaxLength, type: 'text', spellCheck: 'false', autoComplete: 'off', disabled: this.props.disabled, onFocus: this.handleFilterFocus, onChange: this.handleFilterChange, onBlur: this.handleFilterBlur, value: this.props.inputValue }),
                !this.props.selectFiltered && React.createElement(
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
                    { className: ("select-list " + this.state.list.overflow + " " + (typeof this.state.list.filtered !== "undefined" && this.state.list.filtered.length === 0 ? "empty" : "")).trim().replace(/\s+/g, " "), ref: function ref(listNode) {
                            return _this4.listNode = listNode;
                        } },
                    this.props.options.map(function (option, index) {
                        if (_this4.props.selectFiltered && typeof _this4.state.list.filtered !== "undefined" && _this4.state.list.filtered.indexOf(option) !== -1) {
                            return React.createElement(
                                'li',
                                { key: index, className: 'select-option', onMouseDown: _this4.handleOptionFiltered.bind(_this4, option) },
                                React.createElement(
                                    'span',
                                    null,
                                    option
                                )
                            );
                        } else if (!_this4.props.selectFiltered && index !== _this4.props.chosenIndex) {
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
                !this.props.selectFiltered && this.state.otherOptionChosen && React.createElement('input', { className: 'select-other', ref: this.props.inputNodeRef, maxLength: this.props.inputMaxLength, type: 'text', spellCheck: 'false', autoComplete: 'off', disabled: this.props.disabled, onFocus: this.props.onInputFocus, onBlur: this.props.onInputBlur, onChange: this.props.onInputChange, value: this.props.inputValue })
            );
        }
    }]);

    return Select;
}(React.Component);