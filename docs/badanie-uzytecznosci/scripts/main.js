var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

getRealOffsetTop = function getRealOffsetTop(offsetTop) {
    if (offsetTop > globals.headerHeight.static) {
        return offsetTop - globals.headerHeight.fixed;
    }

    return offsetTop;
};

swap = function swap(arr, i, j) {
    var tempVal = void 0;

    tempVal = arr[i];
    arr[i] = arr[j];
    arr[j] = tempVal;

    return arr;
};

shuffle = function shuffle(arr) {
    var currentIndex = arr.length,
        tempVal = void 0,
        randomIndex = void 0;

    if (currentIndex === 2 && Math.random() > 0.5) {
        swap(arr, 0, 1);
    } else if (currentIndex > 2) {
        while (0 !== currentIndex) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            swap(arr, currentIndex, randomIndex);
        }
    }

    return arr;
};

commonSubstring = function commonSubstring(prefix, suffix) {
    var commonSubstr = '';
    var i = 1;

    while (i <= suffix.length) {
        var str = suffix.substring(0, i);
        var index = prefix.indexOf(str);

        if (index !== -1 && index === prefix.length - str.length) {
            commonSubstr = str;
        }

        i++;
    }

    return commonSubstr;
};

longestCommonSubsequence = function longestCommonSubsequence(str1, str2) {
    var lArr = new Array(str1.length + 1);

    for (var _i = 0; _i <= str1.length; _i++) {
        lArr[_i] = new Array(str2.length + 1).fill(0);
    }

    for (var _i2 = 1; _i2 <= str1.length; _i2++) {
        for (var _i3 = 1; _i3 <= str2.length; _i3++) {
            if (str1[_i2 - 1] === str2[_i3 - 1]) {
                lArr[_i2][_i3] = lArr[_i2 - 1][_i3 - 1] + 1;
            } else {
                lArr[_i2][_i3] = Math.max(lArr[_i2][_i3 - 1], lArr[_i2 - 1][_i3]);
            }
        }
    }

    backtrack = function (_backtrack) {
        function backtrack(_x, _x2, _x3, _x4, _x5) {
            return _backtrack.apply(this, arguments);
        }

        backtrack.toString = function () {
            return _backtrack.toString();
        };

        return backtrack;
    }(function (arr, s1, s2, i, j) {
        if (i - 1 < 0 || j - 1 < 0) {
            return '';
        } else if (s1[i - 1] === s2[j - 1]) {
            return backtrack(arr, s1, s2, i - 1, j - 1) + s1[i - 1];
        } else if (arr[i][j - 1] > arr[i - 1][j]) {
            return backtrack(arr, s1, s2, i, j - 1);
        }

        return backtrack(arr, s1, s2, i - 1, j);
    });

    return backtrack(lArr, str1, str2, str1.length, str2.length);
};

longestCommonSubstring = function longestCommonSubstring(str1, str2) {
    var lArr = new Array(str1.length + 1);
    var len = -1;
    var lcs = '';
    var r = 0;
    var c = 0;

    for (i1 = 0; i1 <= str1.length; i1++) {
        lArr[i1] = new Array(str2.length + 1).fill(0);
    }

    for (i1 = 1; i1 <= str1.length; i1++) {
        for (i2 = 1; i2 <= str2.length; i2++) {
            if (str1[i1 - 1] === str2[i2 - 1]) {
                lArr[i1][i2] = lArr[i1 - 1][i2 - 1] + 1;

                if (len < lArr[i1][i2]) {
                    len = lArr[i1][i2];
                    r = i1;
                    c = i2;
                }
            } else {
                lArr[i1][i2] = 0;
            }
        }
    }

    if (len > 0) {
        while (lArr[r][c] !== 0) {
            lcs = str1[r - 1] + lcs;
            r--;
            c--;
        }
    }

    return lcs;
};

merge = function merge(arr, p, q, r, aaa) {
    var t = [];

    for (var kk = p; kk <= r; kk++) {
        t[kk] = arr[kk];
    }

    var i = p,
        j = q + 1,
        k = p;

    while (i <= q && j <= r) {
        if (t[i].value <= t[j].value) {
            arr[k++] = t[i++];
        } else {
            arr[k++] = t[j++];
        }
    }

    while (i <= q) {
        arr[k++] = t[i++];
    }

    return arr;
};

mergeSort = function (_mergeSort) {
    function mergeSort(_x6, _x7, _x8) {
        return _mergeSort.apply(this, arguments);
    }

    mergeSort.toString = function () {
        return _mergeSort.toString();
    };

    return mergeSort;
}(function (arr, p, r) {
    if (p < r) {
        var q = Math.floor((p + r) / 2);
        arr = mergeSort(arr, p, q);
        arr = mergeSort(arr, q + 1, r);

        return merge(arr, p, q, r);
    }

    return arr;
});

editDistance = function editDistance(str1, str2) {
    var dist = [];
    var str1len = str1.length + 1;
    var str2len = str2.length + 1;

    for (var _i4 = 0; _i4 < str1len; _i4++) {
        dist.push([_i4]);

        for (var _i5 = 1; _i5 < str2len; _i5++) {
            var v = _i4 > 0 ? 0 : _i5;

            dist[_i4].push(v);
        }
    }

    for (var _i6 = 1; _i6 < str2len; _i6++) {
        for (var _i7 = 1; _i7 < str1len; _i7++) {
            if (str1[_i7 - 1] === str2[_i6 - 1]) {
                dist[_i7][_i6] = dist[_i7 - 1][_i6 - 1];
            } else {
                dist[_i7][_i6] = Math.min(dist[_i7 - 1][_i6] + 1, dist[_i7][_i6 - 1] + 1, dist[_i7 - 1][_i6 - 1] + 1);
            }
        }
    }

    return dist[str1len - 1][str2len - 1];
};

insertQuotes = function insertQuotes(str) {
    return str.replace(/,,/g, '\u201E').replace(/''/g, '\u201D');
};

insertNbsp = function insertNbsp(str) {
    return str.replace(/(^|\s)\w\s/g, function (match, offset, string) {
        var end = match.length > 2 ? 2 : 1;
        return match.substring(0, end) + '\xA0';
    });
};

insertNdash = function insertNdash(str) {
    return str.replace(/\-\-/g, '\u2013');
};

insertLinks = function insertLinks(string) {
    return string.split(/(\[.*?\]\(.*?\))/gi).map(function (chunk, index) {
        if (chunk.indexOf('[') === 0 && chunk.lastIndexOf(')') === chunk.length - 1) {
            var linkHref = chunk.substring(1, chunk.lastIndexOf(']'));
            var linkName = chunk.substring(chunk.indexOf('(') + 1, chunk.length - 1);
            return React.createElement(
                'a',
                { key: index, target: '_blank', href: linkHref },
                linkName
            );
        }

        return chunk;
    });
};

parseText = function parseText(string) {
    var chunks = [];

    string = insertQuotes(string);
    string = insertNbsp(string);
    string = insertNdash(string);

    return string.split(/(\*\*[^\*]*\*\*)/gi).map(function (chunk, index) {
        if (chunk.indexOf('\\\*\\\*') !== -1) {
            chunk = chunk.replace(/\\\*\\\*/g, '**');
        }

        chunk = insertLinks(chunk);
        chunk = chunk.map(function (smallerChunk, smallerChunkIndex) {
            var jsxElem = typeof smallerChunk !== 'string';
            var childStr = jsxElem ? smallerChunk.props.children : smallerChunk;

            if (childStr.indexOf('**') === 0 && childStr.lastIndexOf('**') === childStr.length - 2) {
                var jsxChildElem = React.createElement(
                    'span',
                    { key: smallerChunkIndex, className: 'text-important' },
                    childStr.substring(2, smallerChunk.length - 2)
                );

                return jsxElem ? Object.assign({}, jsxElem, {
                    props: Object.assign({}, jsxElem.props, {
                        children: jsxChildElem
                    })
                }) : jsxChildElem;
            }

            return smallerChunk;
        });

        return chunk;
    });
};

getRandomString = function getRandomString() {
    return Math.random().toString(36).substring(2);
};

getParameterByName = function getParameterByName(name, url) {
    if (!url) {
        url = window.location.href;
    }

    name = name.replace(/[\[\]]/g, '\\$&');

    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);

    if (!results) {
        return null;
    }

    if (!results[2]) {
        return '';
    }

    return decodeURIComponent(results[2].replace(/\+/g, ' '));
};

removeScenario = function removeScenario(scenarios, type) {
    return scenarios.filter(function (scenario) {
        return scenario.tasks.filter(function (task) {
            return task.type.indexOf(type) !== -1;
        }).length === 0;
    });
};

var globals = {
    emailRegex: /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/,
    headerHeight: {
        static: 256,
        fixed: 35
    },
    keyDownDisabled: false,
    maxLength: {
        input: 64,
        textarea: 255
    },
    backURI: window.location.host === ('front.mgr' || 'localhost' || '127.0.0.1') ? 'https://back.mgr' : 'https://data-entry-handler.herokuapp.com',
    dev: getParameterByName('dev') !== null
};

window.onload = function () {
    document.onkeydown = function (event) {
        event = event || window.event;

        if (globals.keyDownDisabled && (event.key === 'ArrowUp' || event.key === 'ArrowDown')) {
            return false;
        }
    };

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
                        type: 'mask',
                        label: 'Twój rok urodzenia',
                        id: 'birthYear',
                        regex: /^\d{4}$/,
                        mask: '9999',
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
                        options: ['Podstawowe lub gimnazjalne', 'Średnie', 'Wyższe']
                    }, {
                        type: 'select',
                        label: 'Twój zawód',
                        id: 'job',
                        options: ['Bezrobotny', 'Ekonomista', 'Informatyk', 'Lekarz', 'Pedagog', 'Pracownik biurowy', 'Prawnik', 'Student', 'Uczeń', 'Inny (jaki?)'],
                        otherOption: true
                    }, {
                        type: 'select',
                        label: 'Jak często przeglądasz strony WWW?',
                        id: 'frequency',
                        options: ['1 raz dziennie lub więcej', '1 raz w tygodniu lub więcej', 'Rzadziej niż 1 raz w tygodniu lub sporadycznie', 'Trudno powiedzieć']
                    }, {
                        type: 'select',
                        label: 'Główny powód, dla którego przeglądasz strony WWW',
                        id: 'mainReason',
                        options: ['Lektura wiadomości i artykułów w serwisach informacyjnych, branżowych lub specjalistycznych', 'Hobby', 'Kontakt ze znajomymi', 'Nauka', 'Praca', 'Rozrywka', 'Szybkie wyszukiwanie informacji', 'Zakupy online', 'Inny (jaki?)'],
                        otherOption: true
                    }, {
                        type: 'select',
                        label: 'Którego urządzenia wskazującego używasz najczęściej do obsługi komputera stacjonarnego lub laptopa?',
                        id: 'pointingDevice',
                        options: ['Myszy', 'Touchpada (gładzika)', 'Ekranu dotykowego', 'Pióra świetlnego', 'Innego (jakiego?)'],
                        otherOption: true
                    }, {
                        type: 'radio',
                        label: 'Czy przełączasz się między kolejnymi polami w formularzu przy użyciu klawisza Tab (o ile jest to możliwe)?',
                        id: 'usingTab',
                        options: ['Tak', 'Nie']
                    }, {
                        type: 'radio',
                        label: 'Czy prawidłowe wypełnianie formularzy na stronach WWW jest dla Ciebie czymś trudnym?',
                        id: 'difficulties',
                        options: ['Tak', 'Nie']
                    }, {
                        type: 'radio',
                        label: 'Czy, Twoim zdaniem, formularze na stronach WWW są odpowiednio zaprojektowane?',
                        id: 'properDesign',
                        options: ['Tak', 'Nie', 'Trudno powiedzieć']
                    }, {
                        type: 'textarea',
                        label: 'Czy którakolwiek z zaprezentowanych metod wprowadzania danych była dla Ciebie wyjątkowo uciążliwa lub niepraktyczna?',
                        id: 'comment',
                        optional: true,
                        value: ''
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
            key: 'getTestVersion',
            value: function getTestVersion() {
                return fetch(globals.backURI + '?do=get&what=count').then(function (res) {
                    return res.json();
                }).then(function (response) {
                    var count = void 0;

                    for (var k = 0; k < response.length; k++) {
                        if (typeof response[k].count !== 'undefined') {
                            count = response[k].count;
                            break;
                        }
                    }

                    if (count.A > count.B) {
                        return 'B';
                    } else if (count.B > count.A) {
                        return 'A';
                    }

                    return Math.random() > 0.5 ? 'A' : 'B';
                }).catch(function (error) {
                    console.error(error);

                    return false;
                });
            }
        }, {
            key: 'getIPAddress',
            value: function getIPAddress() {
                return fetch('https://api.ipify.org/?format=json').then(function (res) {
                    return res.json();
                }).then(function (response) {
                    if (typeof response.ip !== 'undefined') {
                        return response.ip;
                    }

                    return false;
                }).catch(function (error) {
                    return false;
                });
            }
        }, {
            key: 'loadTest',
            value: function loadTest(version) {
                var _this2 = this;

                var fileURI = './json/test-' + version + '.json';

                fetch(fileURI).then(function (res) {
                    return res.json();
                }).then(function (result) {
                    _this2.setState(function (oldState) {
                        var newState = Object.assign({}, oldState, {
                            scenarios: shuffle(result.scenarios),
                            isLoaded: true,
                            output: Object.assign({}, oldState.output, {
                                test: Object.assign({}, oldState.output.test, {
                                    version: version
                                })
                            })
                        });

                        var speechRecognitionScenario = result.scenarios.filter(function (scenario) {
                            return scenario.tasks.filter(function (task) {
                                return task.type.indexOf('speech-recognition-on') !== -1;
                            }).length > 0;
                        }).length > 0;
                        var geolocationScenario = result.scenarios.filter(function (scenario) {
                            return scenario.tasks.filter(function (task) {
                                return task.type.indexOf('geolocation-on') !== -1;
                            }).length > 0;
                        }).length > 0;

                        if (geolocationScenario || speechRecognitionScenario) {
                            var isChrome = navigator.userAgent.toLowerCase().indexOf('opr') === -1 && navigator.userAgent.toLowerCase().indexOf('vivaldi') === -1 && !!window.chrome && (!!window.chrome.webstore || !!window.chrome.runtime);
                            var noSpeechRecogniton = !(isChrome && window.hasOwnProperty('webkitSpeechRecognition'));
                            var noGeolocation = !('geolocation' in navigator);

                            if (geolocationScenario) {
                                _this2.setState({
                                    showGeolocationNote: true
                                });
                            }

                            if (speechRecognitionScenario) {
                                _this2.setState({
                                    showSpeechRecognitionNote: true
                                });
                            }

                            if (noSpeechRecogniton) {
                                newState.scenarios = removeScenario(newState.scenarios, 'speech-recognition-on');
                            }

                            if (noGeolocation) {
                                newState.scenarios = removeScenario(newState.scenarios, 'geolocation-on');
                            }

                            if (noSpeechRecogniton || noGeolocation) {
                                var alertMsg = 'Przeglądarka internetowa, której właśnie używasz, nie posiada funkcjonalności' + (noSpeechRecogniton || noGeolocation ? ' ' : '') + (noSpeechRecogniton ? 'rozpoznawania mowy' : '') + (noSpeechRecogniton && noGeolocation ? ' i ' : '') + (noGeolocation ? 'pobierania lokalizacji użytkownika' : '') + (!noSpeechRecogniton || !noGeolocation ? ' wykorzystywanej ' : ' wykorzystywanych ') + 'w części ćwiczeń. Jeśli istnieje taka możliwość, uruchom, proszę, tę stronę w przeglądarce Google Chrome -- możesz ją pobrać [https://www.google.com/intl/pl/chrome/](tutaj).';

                                newState.alert = {
                                    type: 'warning',
                                    msg: alertMsg
                                };
                            }
                        }

                        return newState;
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
            key: 'componentDidMount',
            value: function componentDidMount() {
                var _this3 = this;

                window.onbeforeunload = function (event) {
                    if (!(_this3.state.testStarted && _this3.state.testFinished && _this3.state.dataSent)) {
                        event.preventDefault();
                        event.returnValue = '';
                    }
                };

                this.getIPAddress().then(function (ip) {
                    if (ip) {
                        _this3.setState(function (state) {
                            return Object.assign({}, state, {
                                output: Object.assign({}, state.output, {
                                    user: Object.assign({}, state.output.user, {
                                        ip: ip
                                    })
                                })
                            });
                        });

                        globals.ip = ip;
                    } else {
                        globals.ip = 'N/A_' + new Date.getTime();
                    }
                });

                if (!globals.dev) {
                    this.getTestVersion().then(function (version) {
                        if (version !== false) {
                            _this3.loadTest(version);
                        }
                    });
                } else {
                    var searchValue = getParameterByName('ver');
                    var version = searchValue === 'A' || searchValue === 'B' || searchValue === 'dev' ? searchValue : 'A';

                    this.loadTest(version);
                }
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
                var _this4 = this;

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
                        if (_this4.state.form.data.filter(function (item) {
                            return !item.optional && !item.valid;
                        }).length === 0) {
                            _this4.setState(function (state) {
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
                var _this5 = this;

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
                            var output = _this5.state.output;
                            var userData = output.user;

                            for (var k = 0; k < _this5.state.form.data.length; k++) {
                                var input = _this5.state.form.data[k];
                                userData[input.id] = input.value;
                            }

                            output = Object.assign({}, output, {
                                user: userData
                            });

                            if (globals.dev) {
                                console.log(output);
                            }

                            fetch(globals.backURI + '/?do=send&what=data', {
                                method: 'POST',
                                body: JSON.stringify(output),
                                headers: {
                                    'Content-Type': 'application/json'
                                }
                            }).then(function (res) {
                                return res.json();
                            }).then(function (response) {
                                if (globals.dev) {
                                    console.log('fetch()', response);
                                }
                            }).catch(function (error) {
                                console.error(error);
                            }).then(function () {
                                _this5.setState({
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
                var _this6 = this;

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
                    return React.createElement(Loader, { display: true, big: true, alignCenter: true });
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
                                { className: 'test-intro' },
                                React.createElement(
                                    'p',
                                    null,
                                    'Witaj! Niniejsze badanie jest cz\u0119\u015Bci\u0105 mojej pracy dyplomowej i\xA0ma na celu zbadanie ',
                                    React.createElement(
                                        'span',
                                        { className: 'text-important' },
                                        'u\u017Cyteczno\u015Bci'
                                    ),
                                    ' wybranych wzorc\xF3w p\xF3l i\xA0metod wprowadzania danych, z\xA0kt\xF3rymi masz na co dzie\u0144 styczno\u015B\u0107 w\xA0wielu aplikacjach webowych i\xA0na stronach internetowych.'
                                ),
                                React.createElement(
                                    'p',
                                    null,
                                    React.createElement(
                                        'span',
                                        { className: 'text-important' },
                                        'Co b\u0119d\u0119 robi\u0142?'
                                    ),
                                    ' Zostaniesz poproszony(-a) o\xA0wykonanie ',
                                    React.createElement(
                                        'span',
                                        { className: 'text-important' },
                                        '18 \u0107wicze\u0144'
                                    ),
                                    ' zawartych w\xA0',
                                    React.createElement(
                                        'span',
                                        { className: 'text-important' },
                                        '9 scenariuszach'
                                    ),
                                    ' i\xA0polegaj\u0105cych na uzupe\u0142nieniu r\xF3\u017Cnego typu formularzy.',
                                    React.createElement('br', null),
                                    React.createElement(
                                        'span',
                                        { className: 'text-important' },
                                        'Ile to potrwa?'
                                    ),
                                    ' Je\u015Bli korzystanie z\xA0klawiatury i\xA0myszy nie jest dla Ciebie wielkim wyzwaniem, to przej\u015Bcie przez wszystkie etapy badania powinno zaj\u0105\u0107 nie wi\u0119cej ni\u017C ',
                                    React.createElement(
                                        'span',
                                        { className: 'text-important' },
                                        'oko\u0142o 20 min'
                                    ),
                                    ' Twojego cennego czasu.',
                                    React.createElement('br', null),
                                    React.createElement(
                                        'span',
                                        { className: 'text-important' },
                                        'Czy b\u0119d\u0119 musia\u0142(-a) podawa\u0107 jakie\u015B dane?'
                                    ),
                                    ' Wi\u0119kszo\u015B\u0107 \u0107wicze\u0144 polega na wprowadzeniu ca\u0142kowicie fikcyjnych danych',
                                    this.state.showGeolocationNote ? "*" : "",
                                    '. Potraktuj wi\u0119c ca\u0142e badanie jako pewnego rodzaju zabaw\u0119, w\xA0kt\xF3rej wypr\xF3bowujesz r\xF3\u017Cne rozwi\u0105zania! W\xA0ka\u017Cdym \u0107wiczeniu zobaczysz dwie kolumny: pierwsza zawiera dane, kt\xF3re masz za zadanie wprowadzi\u0107, i\xA0jest wyr\xF3\u017Cniona ',
                                    React.createElement(
                                        'span',
                                        { className: 'text-important text-alert' },
                                        'tym kolorem,'
                                    ),
                                    ' natomiast druga to formularz, wyr\xF3\u017Cniaj\u0105cy si\u0119 ',
                                    React.createElement(
                                        'span',
                                        { className: 'text-important text-okay' },
                                        'tym kolorem,'
                                    ),
                                    ' do kt\xF3rego te dane wprowadzisz. Sp\xF3jrz na poni\u017Cszy przyk\u0142ad:'
                                )
                            ),
                            React.createElement(
                                'section',
                                { className: 'task-main-container test-intro' },
                                React.createElement(
                                    'table',
                                    null,
                                    React.createElement(
                                        'thead',
                                        null,
                                        React.createElement(
                                            'tr',
                                            null,
                                            React.createElement(
                                                'th',
                                                null,
                                                'Nazwa pola'
                                            ),
                                            React.createElement(
                                                'th',
                                                null,
                                                'Prawid\u0142owa warto\u015B\u0107'
                                            )
                                        )
                                    ),
                                    React.createElement(
                                        'tbody',
                                        null,
                                        React.createElement(
                                            'tr',
                                            null,
                                            React.createElement(
                                                'td',
                                                null,
                                                'Pole I'
                                            ),
                                            React.createElement(
                                                'td',
                                                null,
                                                'Warto\u015B\u0107 I'
                                            )
                                        ),
                                        React.createElement(
                                            'tr',
                                            null,
                                            React.createElement(
                                                'td',
                                                null,
                                                'Pole II'
                                            ),
                                            React.createElement(
                                                'td',
                                                null,
                                                'Warto\u015B\u0107 II'
                                            )
                                        )
                                    )
                                ),
                                React.createElement(
                                    'p',
                                    { className: 'note' },
                                    'Przyk\u0142adowa tabela z danymi.'
                                ),
                                React.createElement(
                                    'section',
                                    { className: 'form labels-align-left' },
                                    React.createElement(
                                        'h3',
                                        null,
                                        'Wz\xF3r formularza'
                                    ),
                                    React.createElement(InputWrapper, { disabled: true, type: 'text', insideTask: true, label: 'Pole I' }),
                                    React.createElement(InputWrapper, { disabled: true, type: 'text', insideTask: true, label: 'Pole II' })
                                ),
                                React.createElement(
                                    'p',
                                    { className: 'note' },
                                    'Przyk\u0142adowy formularz.'
                                )
                            ),
                            React.createElement(
                                'section',
                                { className: 'test-intro' },
                                React.createElement(
                                    'p',
                                    null,
                                    'Nic trudnego, prawda? Wystarczy, \u017Ce przeniesiesz warto\u015Bci z tabeli do formularza w stosunku 1:1.',
                                    React.createElement('br', null),
                                    React.createElement(
                                        'span',
                                        { className: 'text-important' },
                                        'Na co mam zwr\xF3ci\u0107 uwag\u0119?'
                                    ),
                                    ' Odst\u0119py, znaki pisarskie, interpunkcyjne s\u0105 niezwykle istotne w\xA0tym badaniu. \u0106wiczenie jest uznane za poprawnie rozwi\u0105zane wtedy i\xA0tylko wtedy, gdy wprowadzone dane odpowiadaj\u0105 danym wzorcowym',
                                    this.state.showSpeechRecognitionNote ? this.state.showGeolocationNote ? "**" : "*" : "",
                                    '. Je\u015Bli zatem wpisane przez Ciebie warto\u015Bci b\u0119d\u0105 zawiera\u0107 b\u0142\u0119dy, to dane pole wraz z\xA0odpowiadaj\u0105c\u0105 mu etykiet\u0105 zostan\u0105 wyr\xF3\u017Cnione ',
                                    React.createElement(
                                        'span',
                                        { className: 'text-important text-error' },
                                        'tym kolorem.'
                                    ),
                                    React.createElement('br', null),
                                    React.createElement(
                                        'span',
                                        { className: 'text-important' },
                                        'Czy nie mog\u0119 po prostu kopiowa\u0107 i\xA0wkleja\u0107?'
                                    ),
                                    ' Zaznaczanie (a co za tym idzie \u2013 kopiowanie) danych w\xA0tej aplikacji jest z\xA0zasady zablokowane. Jasne jest, \u017Ce przy odrobinie sprytu i\xA0wiedzy z\xA0dziedziny informatyki by\u0142(a)by\u015B w\xA0stanie to zrobi\u0107, jednak nie r\xF3b tego, prosz\u0119. Celem tego badania jest zebranie relewantnych i\xA0wiarygodnych danych, kt\xF3re b\u0119d\u0119 m\xF3g\u0142 przedstawi\u0107 w\xA0swojej pracy, a\xA0b\u0119dzie to mo\u017Cliwe tylko wtedy, gdy wszystkie pola wype\u0142nisz r\u0119cznie.',
                                    React.createElement('br', null),
                                    React.createElement(
                                        'span',
                                        { className: 'text-important' },
                                        'A m\xF3g\u0142bym napisa\u0107, co o tym wszystkim my\u015Bl\u0119?'
                                    ),
                                    ' Po ka\u017Cdym \u0107wiczeniu b\u0119dziesz mia\u0142(a) mo\u017Cliwo\u015B\u0107 pozostawienia komentarza odnosz\u0105cego si\u0119 do w\u0142a\u015Bnie wypr\xF3bowanej metody wprowadzania danych. Komentarz nie jest obowi\u0105zkowy, jednak dzi\u0119ki niemu b\u0119d\u0119 m\xF3g\u0142 pozna\u0107 Tw\xF3j punkt widzenia.'
                                ),
                                React.createElement(
                                    'p',
                                    null,
                                    React.createElement(
                                        'span',
                                        { className: 'text-important' },
                                        'Co dalej?'
                                    ),
                                    ' Naci\u015Bnij przycisk ',
                                    React.createElement(
                                        'button',
                                        { className: 'smaller inline dummy' },
                                        'OK, zaczynajmy'
                                    ),
                                    ' i\xA0zmierz si\u0119 ze stoj\u0105cym przed Tob\u0105 wyzwaniem!'
                                ),
                                React.createElement(
                                    'p',
                                    { className: 'text-smaller' },
                                    this.state.showGeolocationNote && React.createElement(
                                        React.Fragment,
                                        null,
                                        '*) Jedno z\xA0\u0107wicze\u0144 zak\u0142ada r\u0119czne lub zautomatyzowane wprowadzenie podstawowych informacji na temat Twojej lokalizacji (kraj, wojew\xF3dztwo, powiat, miasto, kod pocztowy). Je\u015Bli nie wyrazisz na to zgody, b\u0119dziesz m\xF3g\u0142 poda\u0107 inne, maj\u0105ce podobn\u0105 form\u0119 dane.',
                                        React.createElement('br', null)
                                    ),
                                    this.state.showSpeechRecognitionNote && React.createElement(
                                        React.Fragment,
                                        null,
                                        '*',
                                        this.state.showGeolocationNote ? "*" : "",
                                        ') Jedno z\xA0\u0107wicze\u0144 jest skonstruowane w\xA0taki spos\xF3b, \u017Ce nie b\u0119dziesz musia\u0142 przejmowa\u0107 si\u0119 ani odst\u0119pami, ani wielko\u015Bci\u0105 znak\xF3w. Dlaczego? Przekonasz si\u0119 sam!',
                                        React.createElement('br', null)
                                    ),
                                    React.createElement(
                                        'span',
                                        { className: 'text-important' },
                                        'Uwaga!'
                                    ),
                                    ' Badanie ko\u0144czy si\u0119 ankiet\u0105 u\u017Cytkownika, w\xA0kt\xF3rej podasz dane zwi\u0105zane z\xA0Twoj\u0105 osob\u0105, m.in. rok urodzenia, wykszta\u0142cenie, zaw\xF3d itd. Informacje te umo\u017Cliwi\u0105 przypisanie Twojej osoby pod wzgl\u0119dem uzyskanych wynik\xF3w do poszczeg\xF3lnych grup ca\u0142ej populacji uczestnik\xF3w badania. Je\u017Celi masz jakie\u015B uwagi, pytania lub sugestie zwi\u0105zane z\xA0gromadzeniem tych danych, napisz do mnie na adres ',
                                    React.createElement(
                                        'a',
                                        { href: 'mailto:krzysztof.radoslaw.osada@gmail.com' },
                                        'krzysztof.radoslaw.osada@gmail.com'
                                    ),
                                    '.'
                                ),
                                this.state.alert && React.createElement(Paragraph, { content: this.state.alert.msg, 'class': "alert " + this.state.alert.type }),
                                React.createElement(
                                    'button',
                                    { onClick: this.handleStart, disabled: this.state.testStarted },
                                    'OK, zaczynajmy'
                                )
                            ),
                            scenarios.map(function (scenario, index) {
                                return React.createElement(Scenario, { key: index, index: index + 1, testStarted: _this6.state.testStarted, currentIndex: _this6.state.currentScenarioIndex, lastIndex: _this6.state.scenarios.length, scenario: scenario, onFinish: _this6.handleScenarioFinish, nodeRef: _this6.childNodeRef });
                            }),
                            this.state.allScenariosFinished && React.createElement(
                                'section',
                                { ref: this.childNodeRef },
                                React.createElement(
                                    'h1',
                                    null,
                                    'Zako\u0144czenie'
                                ),
                                React.createElement(Paragraph, { content: '\u015Awietnie! **W\u0142a\u015Bnie zako\u0144czy\u0142e\u015B(-a\u015B) badanie u\u017Cyteczno\u015Bci.** Zanim jednak zamkniesz t\u0119 kart\u0119 i wr\xF3cisz do swoich zaj\u0119\u0107, wype\u0142nij, prosz\u0119, poni\u017Csz\u0105 ankiet\u0119 -- podaj podstawowe informacje na sw\xF3j temat* oraz podziel si\u0119 odczuciami zwi\u0105zanymi z formularzami na stronach internetowych.' }),
                                React.createElement(Paragraph, { 'class': 'text-smaller', content: '*) **Informacje gromadzone w badaniu u\u017Cyteczno\u015Bci nie pozwalaj\u0105 na jednoznaczne zidentyfikowanie danej osoby.** Celem niniejszej ankiety jest z kolei kategoryzacja uczestnik\xF3w badania wed\u0142ug cech mog\u0105cych mie\u0107 wp\u0142yw na szybko\u015B\u0107, poprawno\u015B\u0107 i dok\u0142adno\u015B\u0107 wprowadzania danych w formularzach internetowych. Poni\u017Csze informacje pozwol\u0105 wi\u0119c na dostrze\u017Cenie zale\u017Cno\u015Bci mi\u0119dzy wynikami uzyskanymi przez Ciebie w badaniu a parametrami dotycz\u0105cymi Twojego wykszta\u0142cenia, wieku, Twoich do\u015Bwiadcze\u0144 ze stronami internetowymi itp. Je\u017Celi masz jakie\u015B pytania lub uwagi zwi\u0105zane z poni\u017Csz\u0105 ankiet\u0105, wy\u015Blij do mnie wiadomo\u015B\u0107 na adres [mailto:krzysztof.radoslaw.osada@gmail.com](krzysztof.radoslaw.osada@gmail.com).' }),
                                React.createElement(
                                    'section',
                                    { className: 'form labels-align-top', id: 'user-form' },
                                    React.createElement(
                                        'h3',
                                        null,
                                        'Ankieta uczestnika'
                                    ),
                                    this.state.form.data.map(function (item, index) {
                                        return React.createElement(InputWrapper, Object.assign({ key: index, index: index, error: _this6.state.form.error, disabled: _this6.state.testFinished, onChange: _this6.handleFormChange }, item));
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
                                React.createElement(Paragraph, { content: '**I tak doszli\u015Bmy do ko\u0144ca!** Serdecznie dzi\u0119kuj\u0119 za udzia\u0142 w badaniu -- Twoja pomoc jest dla mnie naprawd\u0119 nieoceniona. Uzyskane przez Ciebie wyniki zostan\u0105 uwzgl\u0119dnione w cz\u0119\u015Bci badawczej mojej pracy dyplomowej ,,Badanie u\u017Cyteczno\u015Bci metod wprowadzania danych w aplikacjach webowych\'\', kt\xF3r\u0105 pisz\u0119 pod kierunkiem dr. hab. in\u017C. Bogdana Trawi\u0144skiego, prof. PWr.' })
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