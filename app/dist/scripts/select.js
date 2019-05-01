var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Select = function (_React$Component) {
    _inherits(Select, _React$Component);

    function Select() {
        _classCallCheck(this, Select);

        return _possibleConstructorReturn(this, (Select.__proto__ || Object.getPrototypeOf(Select)).apply(this, arguments));
    }

    _createClass(Select, [{
        key: "render",
        value: function render() {
            var _this2 = this;

            return React.createElement(
                "div",
                { className: "select-wrapper" },
                React.createElement(
                    "div",
                    { className: ("select-current " + (this.props.disabled ? "disabled" : "") + " " + (this.props.open ? "focus" : "")).trim().replace(/\s+/g, " "), onClick: this.props.onSelect },
                    React.createElement(
                        "span",
                        null,
                        this.props.chosenIndex >= 0 ? this.props.options[this.props.chosenIndex] : ""
                    ),
                    React.createElement(
                        "i",
                        { className: "material-icons" },
                        this.props.open ? "keyboard_arrow_up" : "keyboard_arrow_down"
                    )
                ),
                this.props.open && React.createElement(
                    "ul",
                    { className: ("select-list " + this.props.overflow).trim(), ref: this.props.nodeRef },
                    this.props.options.map(function (option, index) {
                        if (index !== _this2.props.chosenIndex) {
                            return React.createElement(
                                "li",
                                { key: index, className: "select-option", onClick: _this2.props.onOption.bind(_this2, index, option) },
                                React.createElement(
                                    "span",
                                    null,
                                    option
                                )
                            );
                        } else {
                            return "";
                        }
                    })
                ),
                this.props.otherOptionChosen && React.createElement("input", { className: "select-other", ref: this.props.inputNodeRef, maxLength: this.props.inputMaxLength, type: "text", spellCheck: "false", autoComplete: "off", disabled: this.props.disabled, onFocus: this.props.onInputFocus, onBlur: this.props.onInputBlur, onChange: this.props.onInputChange, value: this.props.inputValue })
            );
        }
    }]);

    return Select;
}(React.Component);