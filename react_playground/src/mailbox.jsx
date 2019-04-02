window.onload = function() {
    function Mailbox( props )
    {
        const unreadMessages = props.unreadMessages;
        return (
            <div>
                <h1>Hello!</h1>
                {unreadMessages.length > 0 &&
                    <h2>
                        You have {unreadMessages.length} unread messages.

                    </h2>
                }
            </div>
        );
    }

    const messages = [ 'Alpha', 'Bravo', 'Charlie', 'Delta' ];

    ReactDOM.render(
        <Mailbox unreadMessages={ messages } />,
        document.getElementById( 'root' )
    );
}