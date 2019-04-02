



// window.onload = function() {
//     const element = <Welcome name="Sara"/>
//     ReactDOM.render( element, document.getElementById( 'root' ) );
// }



window.onload = function() {
    function Comment( props )
    {
        return (
            <div className="Comment">
                <UserInfo user={props.author} />
                <div className="Comment-text">
                    {props.text}
                </div>
                <div className="Comment-date">
                    {props.date}
                </div>
            </div>
        );
    }

    function Avatar( props )
    {
        return (
            <img className="Avatar"
                src={props.user.avatarUrl}
                alt={props.user.name}
            />
        );
    }

    function UserInfo( props )
    {
        return(
            <div className="UserInfo">
                <Avatar user={props.user} />
                <div className="UserInfo-name">
                    {props.user.name}
                </div>
            </div>
        );
    }

    function Welcome( props )
    {
        return <h1>Hello, {props.name}</h1>;
    }

    function App()
    {
        const names = {
            first  : "Ambroży",
            second : "Bogusław",
            third  : "Cezary"
        };

        const author = {
            name      : "krymeer",
            avatarUrl : "https://scontent.fwaw3-1.fna.fbcdn.net/v/t1.0-1/c380.52.422.422a/s160x160/44257061_2364761153540030_1212035617697824768_n.jpg?_nc_cat=106&_nc_ht=scontent.fwaw3-1.fna&oh=74d5d123cb9ef6784ab81c1376f61506&oe=5D09BF1E"
        }

        return (
            <div>
                <Welcome name={names.first} />
                <Welcome name={names.second} />
                <Welcome name={names.third} />
                <Comment date="20190402_054621" text="Lorem ipsum dolor sit amet" author={author} />
            </div>
        );
    }

    ReactDOM.render( <App />, document.getElementById( 'root') )
}