var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

window.onload = function () {
    var NameForm = function (_React$Component) {
        _inherits(NameForm, _React$Component);

        function NameForm(props) {
            _classCallCheck(this, NameForm);

            var _this = _possibleConstructorReturn(this, (NameForm.__proto__ || Object.getPrototypeOf(NameForm)).call(this, props));

            _this.state = { nameVal: '' };

            _this.handleIDChange = _this.handleIDChange.bind(_this);
            _this.handleNameChange = _this.handleNameChange.bind(_this);
            _this.handleSubmit = _this.handleSubmit.bind(_this);
            return _this;
        }

        _createClass(NameForm, [{
            key: 'handleNameChange',
            value: function handleNameChange(event) {
                this.setState({ nameVal: event.target.value });
            }
        }, {
            key: 'handleIDChange',
            value: function handleIDChange(event) {
                this.setState({ ID: event.target.value.toUpperCase() });
            }
        }, {
            key: 'handleSubmit',
            value: function handleSubmit(event) {
                alert('A name was submitted: ' + this.state.nameVal);
                event.preventDefault();
            }
        }, {
            key: 'render',
            value: function render() {
                return React.createElement(
                    'form',
                    { onSubmit: this.handleSubmit },
                    React.createElement(
                        'label',
                        null,
                        'Name:',
                        React.createElement('input', { type: 'text', value: this.state.nameVal, onChange: this.handleNameChange })
                    ),
                    React.createElement(
                        'label',
                        null,
                        'ID:',
                        React.createElement('input', { type: 'text', value: this.state.ID, onChange: this.handleIDChange })
                    ),
                    React.createElement('input', { type: 'submit', value: 'Submit' })
                );
            }
        }]);

        return NameForm;
    }(React.Component);

    ReactDOM.render(React.createElement(NameForm, null), document.getElementById('root'));
};