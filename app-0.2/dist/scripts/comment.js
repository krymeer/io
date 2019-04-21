var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Comment = function (_React$Component) {
    _inherits(Comment, _React$Component);

    function Comment(props) {
        _classCallCheck(this, Comment);

        var _this = _possibleConstructorReturn(this, (Comment.__proto__ || Object.getPrototypeOf(Comment)).call(this, props));

        _this.handleChange = _this.handleChange.bind(_this);
        return _this;
    }

    _createClass(Comment, [{
        key: "handleChange",
        value: function handleChange(e) {
            if (!this.props.disabled) {
                this.props.onChange(e.target.value);
            }
        }
    }, {
        key: "render",
        value: function render() {
            return React.createElement(
                "section",
                { className: "comment" },
                React.createElement(
                    "h4",
                    null,
                    this.props.headerText
                ),
                React.createElement("textarea", { spellCheck: "false", maxLength: typeof this.props.maxLength !== "undefined" ? this.props.maxLength : globals.maxLength.textarea, onChange: this.handleChange, disabled: this.props.disabled }),
                React.createElement(
                    "div",
                    null,
                    React.createElement(
                        "p",
                        { className: "note" },
                        "Pozosta\u0142o znak\xF3w: ",
                        React.createElement(
                            "span",
                            { className: "text-important" },
                            this.props.maxLength - this.props.length
                        )
                    ),
                    this.props.noteText && React.createElement(
                        "p",
                        { className: "note" },
                        this.props.noteText
                    )
                )
            );
        }
    }]);

    return Comment;
}(React.Component);