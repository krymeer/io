var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// window.onbeforeunload = function() {
//     return '';
// }

var globals = {
    emailRegex: /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/,
    headerHeight: {
        static: 256,
        fixed: 35
    },
    maxLength: {
        input: 64,
        textarea: 255
    },
    backURI: window.location.host === ('front.mgr' || 'localhost' || '127.0.0.1') ? 'https://back.mgr' : 'https://data-entry-handler.herokuapp.com'
};

getRealOffsetTop = function getRealOffsetTop(offsetTop) {
    if (offsetTop > globals.headerHeight.static) {
        return offsetTop - globals.headerHeight.fixed;
    }

    return offsetTop;
};

insertNbsp = function insertNbsp(str) {
    return str.replace(/(^|\s)\w\s/g, function (match, offset, string) {
        var end = match.length > 2 ? 2 : 1;

        return match.substring(0, end) + '\xA0';
    });
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

window.onload = function () {
    var Main = function (_React$Component) {
        _inherits(Main, _React$Component);

        function Main(props) {
            _classCallCheck(this, Main);

            var _this = _possibleConstructorReturn(this, (Main.__proto__ || Object.getPrototypeOf(Main)).call(this, props));

            _this.handleFormChange = _this.handleFormChange.bind(_this);
            _this.handleScroll = _this.handleScroll.bind(_this);
            _this.handleStart = _this.handleStart.bind(_this);
            _this.handleFinish = _this.handleFinish.bind(_this);
            _this.handleScenarioFinish = _this.handleScenarioFinish.bind(_this);
            _this.backToTop = _this.backToTop.bind(_this);
            _this.state = {
                error: null,
                isLoaded: false,
                headerFixed: false,
                testStarted: false,
                testFinished: false,
                scenarios: [],
                currentScenarioIndex: 1,
                allScenariosFinished: false,
                dataSent: false,
                form: {
                    error: false,
                    data: [{
                        type: 'text',
                        label: 'Twoje imię',
                        id: 'firstName',
                        maxLength: 32
                    }, {
                        type: 'text',
                        label: 'Twój adres e-mail',
                        id: 'email',
                        regex: globals.emailRegex,
                        maxLength: 128
                    }, {
                        type: 'text',
                        label: 'Twój rok urodzenia',
                        id: 'birthYear',
                        regex: /^\d{4}$/,
                        maxLength: 4
                    }, {
                        type: 'radio',
                        label: 'Twoja płeć',
                        id: 'sex',
                        options: ['Mężczyzna', 'Kobieta']
                    }, {
                        type: 'select',
                        label: 'Twoje wykształcenie',
                        id: 'education',
                        options: ['Podstawowe', 'Gimnazjalne', 'Zasadnicze zawodowe', 'Zasadnicze branżowe', 'Średnie branżowe', 'Średnie', 'Wyższe', 'Inne (jakie?)'],
                        otherOption: true
                    }, {
                        type: 'select',
                        label: 'Twój zawód',
                        id: 'job',
                        options: ['Uczeń', 'Student', 'Programista', 'Nauczyciel', 'Urzędnik', 'Bezrobotny', 'Inny (jaki?)'],
                        otherOption: true
                    }, {
                        type: 'select',
                        label: 'Jak często przeglądasz strony WWW?',
                        id: 'frequency',
                        options: ['Kilka razy dziennie', 'Raz dziennie', 'Co kilka dni', 'Raz w tygodniu', 'Sporadycznie', 'Trudno powiedzieć']
                    }, {
                        type: 'select',
                        label: 'Główny powód, dla którego przeglądasz strony WWW',
                        id: 'mainReason',
                        options: ['Praca', 'Rozrywka', 'Kontakt ze znajomymi', 'Nauka', 'Zakupy online', 'Inny (jaki?)'],
                        otherOption: true
                    }, {
                        type: 'radio',
                        label: 'Czy prawidłowe wypełnianie formularzy na stronach WWW jest dla Ciebie czymś trudnym?',
                        id: 'difficulties',
                        options: ['Tak', 'Nie']
                    }, {
                        type: 'radio',
                        label: 'Czy Twoim zdaniem formularze na stronach WWW są odpowiednio zaprojektowane?',
                        id: 'usability',
                        options: ['Tak', 'Nie', 'Trudno powiedzieć']
                    }, {
                        type: 'textarea',
                        label: 'Twój komentarz',
                        id: 'comment',
                        optional: true
                    }]
                },
                output: {
                    test: {
                        startTime: 0,
                        endTime: 0,
                        scenarios: []
                    },
                    user: {}
                }
            };

            _this.childNodeRef = function (child) {
                window.scrollTo(0, getRealOffsetTop(child.offsetTop));
            };
            return _this;
        }

        _createClass(Main, [{
            key: 'componentDidMount',
            value: function componentDidMount() {
                var _this2 = this;

                fetch('./json/test-1.json').then(function (res) {
                    return res.json();
                }).then(function (result) {
                    _this2.setState({
                        scenarios: result.scenarios,
                        isLoaded: true
                    }, function () {
                        window.addEventListener('scroll', _this2.handleScroll);
                    });
                }, function (error) {
                    _this2.setState({
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
                var _this3 = this;

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
                        if (_this3.state.form.data.filter(function (item) {
                            return !item.valid;
                        }).length === 0) {
                            _this3.setState(function (state) {
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
                                test: Object.assign({}, state.output.test, {
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
                        var scenarios = state.output.test.scenarios;
                        scenarios.push(data);

                        return Object.assign({}, state, {
                            output: Object.assign({}, state.output, {
                                test: Object.assign({}, state.output.test, {
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
                var _this4 = this;

                if (this.state.allScenariosFinished && !this.state.testFinished) {
                    if (this.state.form.data.filter(function (input) {
                        return !input.valid && !input.optional;
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
                                    test: Object.assign({}, state.output.test, {
                                        endTime: new Date().getTime()
                                    })
                                })
                            });
                        }, function () {
                            var output = _this4.state.output;
                            var userData = {};

                            for (var k = 0; k < _this4.state.form.data.length; k++) {
                                var input = _this4.state.form.data[k];
                                userData[input.id] = input.value;
                            }

                            output = Object.assign({}, output, {
                                user: userData
                            });

                            console.log(output);

                            fetch(globals.backURI + '/?do=send&what=data', {
                                method: 'POST',
                                body: JSON.stringify(output),
                                headers: {
                                    'Content-Type': 'application/json'
                                }
                            }).then(function (res) {
                                return res.json();
                            }).then(function (response) {
                                console.log('fetch()', response);
                            }, function (error) {
                                console.error(error);
                            }).then(function () {
                                _this4.setState({
                                    dataSent: true
                                });
                            });
                        });
                    }
                }
            }
        }, {
            key: 'render',
            value: function render() {
                var _this5 = this;

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
                                    !this.state.allScenariosFinished && "scenariusz " + this.state.currentScenarioIndex + "/" + this.state.scenarios.length,
                                    this.state.allScenariosFinished && "podsumowanie"
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
                                return React.createElement(Scenario, { key: index, index: index + 1, testStarted: _this5.state.testStarted, currentIndex: _this5.state.currentScenarioIndex, lastIndex: _this5.state.scenarios.length, scenario: scenario, onFinish: _this5.handleScenarioFinish, nodeRef: _this5.childNodeRef });
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
                                        return React.createElement(InputWrapper, Object.assign({ key: index, index: index, error: _this5.state.form.error, disabled: _this5.state.testFinished, onChange: _this5.handleFormChange }, item));
                                    }),
                                    this.state.form.error && React.createElement(Paragraph, { 'class': 'on-form-error', content: 'Aby przej\u015B\u0107 dalej, popraw pola wyr\xF3\u017Cnione **tym kolorem.**' })
                                ),
                                React.createElement(
                                    'button',
                                    { onClick: this.handleFinish, disabled: this.state.testFinished },
                                    'Wy\u015Blij'
                                ),
                                this.state.testFinished && React.createElement(Loader, { nodeRef: this.childNodeRef, display: !this.state.dataSent })
                            ),
                            this.state.testFinished && this.state.dataSent && React.createElement(
                                'section',
                                { ref: this.childNodeRef },
                                React.createElement(Paragraph, { content: '**Serdecznie dzi\u0119kuj\u0119 za wzi\u0119cie udzia\u0142u w badaniu!** Twoja pomoc jest naprawd\u0119 nieoceniona i przyczyni si\u0119 do zrealizowania jednego z najwi\u0119kszych moich cel\xF3w w \u017Cyciu -- uko\u0144czenia studi\xF3w na Politechnice Wroc\u0142awskiej.' })
                            )
                        )
                    );
                }
            }
        }]);

        return Main;
    }(React.Component);

    ReactDOM.render(React.createElement(Main, null), document.getElementById('root'));
};