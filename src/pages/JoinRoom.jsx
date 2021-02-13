import React, { useEffect, useContext, useState } from "react";
import { Redirect } from "react-router-dom";

// Components
import Navbar from "components/Navbar";

// Contexts
import { Data } from "contexts/Data";
import { Socket } from "contexts/Socket";

export default function JoinRoom() {
    // Print Render
    if (process.env.NODE_ENV !== "production") console.log("%cRender Join Room", "color: grey; font-size: 11px");

    // Contexts
    const { roomID, setBackgroundGradient, landingDone, username } = useContext(Data);
    const { emit, sub, unsub } = useContext(Socket);

    // Redirect state
    const [redirectTo, setRedirectTo] = useState(null);

    // Go to landing if not done already
    if (!redirectTo && !landingDone.current) setRedirectTo("/");

    // Delete room if user leaves this page
    const leaveRoom = () => {
        roomID.current = null;
    };

    // #################################################
    //   ROOM
    // #################################################

    // On a user joining the room
    const onUserJoinedRoom = (newUser) => {
        console.log(`${newUser.username} joined the room.`);
    };

    // On a user joining the room
    const onUserLeftRoom = (oldUser) => {
        console.log(`${oldUser.username} left the room.`);
    };

    // #################################################
    //   COMPONENT MOUNT
    // #################################################

    // On componente mount
    useEffect(() => {
        // Change Color
        setBackgroundGradient("blue");

        if (landingDone.current) {
            // Create amd join the room ROJAS change testing to inputed number
            emit("joinRoom", { roomID: "testing", username: username.current });

            // Subscribe to a user joining the room
            sub("userJoinedRoom", onUserJoinedRoom);

            // Subscribe to a user leaving the room
            sub("userLeftRoom", onUserLeftRoom);
        }
        // Unsubscribe on unmount
        return () => {
            unsub("userJoinedRoom", onUserJoinedRoom);
        };

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // #################################################
    //   RENDER
    // #################################################

    // Redirect to new route
    if (redirectTo) return <Redirect to={redirectTo} push={true} />;

    return (
        <div className="joinRoom">
            <Navbar prevPage="/home" onBackButtonClicked={leaveRoom}></Navbar>
            <div className="container"></div>
        </div>
    );
}
