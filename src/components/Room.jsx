import React, { useContext } from "react";

// Components
import ProfileList from "components/ProfileList";

// Contexts
import { Data } from "contexts/Data";

export default function Room() {
    // Print Render
    if (process.env.REACT_APP_DEBUGG === "true" && process.env.NODE_ENV !== "production") console.log("%cRender Profile List", "color: grey; font-size: 11px");

    // Contexts
    const { roomUsers } = useContext(Data);

    // #################################################
    //   RENDER
    // #################################################

    // Users
    const users = roomUsers.map(({ username, image }, i) => <ProfileList key={i} image={image} text={username} clickable={false} inverted={i % 2 === 1} />);

    // Num users text
    const numUsers = users.length > 1 ? `${users.length} people` : "only you";

    return (
        <div id="room" className="room">
            <div className="roomContainer">
                <div className="profileContainer">{users}</div>
            </div>
            <div className="numUsers">{numUsers}</div>
        </div>
    );
}
