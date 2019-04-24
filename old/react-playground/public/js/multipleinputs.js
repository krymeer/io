var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

window.onload = function () {
    var MultipleInputs = function (_React$Component) {
        _inherits(MultipleInputs, _React$Component);

        function MultipleInputs(props) {
            _classCallCheck(this, MultipleInputs);

            var _this = _possibleConstructorReturn(this, (MultipleInputs.__proto__ || Object.getPrototypeOf(MultipleInputs)).call(this, props));

            _this.state = {
                isGoing: true,
                numberOfGuests: 2
            };

            _this.handleInputChange = _this.handleInputChange.bind(_this);
            _this.handleSubmit = _this.handleSubmit.bind(_this);
            return _this;
        }

        _createClass(MultipleInputs, [{
            key: 'handleInputChange',
            value: function handleInputChange(event) {
                var target = event.target;
                var value = target.type === 'checkbox' ? target.checked : target.value;
                var name = target.name;

                this.setState(_defineProperty({}, name, value));
            }
        }, {
            key: 'handleSubmit',
            value: function handleSubmit(event) {
                event.preventDefault();

                alert('Is going? ' + this.state.isGoing + '\nNumber of guests: ' + this.state.numberOfGuests);
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
                        'Is going:',
                        React.createElement('input', { name: 'isGoing', type: 'checkbox', checked: this.state.isGoing, onChange: this.handleInputChange })
                    ),
                    React.createElement('br', null),
                    React.createElement(
                        'label',
                        null,
                        'Number of guests:',
                        React.createElement('input', { name: 'numberOfGuests', type: 'number', value: this.state.numberOfGuests, onChange: this.handleInputChange })
                    ),
                    React.createElement('input', { type: 'submit', value: 'Submit' })
                );
            }
        }]);

        return MultipleInputs;
    }(React.Component);

    ReactDOM.render(React.createElement(MultipleInputs, null), document.getElementById('root'));
};