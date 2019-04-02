

// window.onload = function() {
//     const element = <Welcome name="Sara"/>
//     ReactDOM.render( element, document.getElementById( 'root' ) );
// }


window.onload = function () {
    function Comment(props) {
        return React.createElement(
            "div",
            { className: "Comment" },
            React.createElement(UserInfo, { user: props.author }),
            React.createElement(
                "div",
                { className: "Comment-text" },
                props.text
            ),
            React.createElement(
                "div",
                { className: "Comment-date" },
                props.date
            )
        );
    }

    function Avatar(props) {
        return React.createElement("img", { className: "Avatar",
            src: props.user.avatarUrl,
            alt: props.user.name
        });
    }

    function UserInfo(props) {
        return React.createElement(
            "div",
            { className: "UserInfo" },
            React.createElement(Avatar, { user: props.user }),
            React.createElement(
                "div",
                { className: "UserInfo-name" },
                props.user.name
            )
        );
    }

    function Welcome(props) {
        return React.createElement(
            "h1",
            null,
            "Hello, ",
            props.name
        );
    }

    function App() {
        var names = {
            first: "Ambroży",
            second: "Bogusław",
            third: "Cezary"
        };

        var author = {
            name: "krymeer",
            avatarUrl: "https://scontent.fwaw3-1.fna.fbcdn.net/v/t1.0-1/c380.52.422.422a/s160x160/44257061_2364761153540030_1212035617697824768_n.jpg?_nc_cat=106&_nc_ht=scontent.fwaw3-1.fna&oh=74d5d123cb9ef6784ab81c1376f61506&oe=5D09BF1E"
        };

        return React.createElement(
            "div",
            null,
            React.createElement(Welcome, { name: names.first }),
            React.createElement(Welcome, { name: names.second }),
            React.createElement(Welcome, { name: names.third }),
            React.createElement(Comment, { date: "20190402_054621", text: "Lorem ipsum dolor sit amet", author: author })
        );
    }

    ReactDOM.render(React.createElement(App, null), document.getElementById('root'));
};