import React, { useEffect, useContext, useState, useRef } from "react";
import { Redirect } from "react-router-dom";

// Components
import Navbar from "components/Navbar";

// Contexts
import { Data } from "contexts/Data";
import { Socket } from "contexts/Socket";

export default function Restaurants() {
    // Print Render
    if (process.env.REACT_APP_DEBUGG === "true" && process.env.NODE_ENV !== "production") console.log("%cRender Restaurants", "color: grey; font-size: 11px");

    // Contexts
    const { setRoomID, setRoomUsers, isBoss, setBackgroundGradient, landingDone, socketError } = useContext(Data);
    const { emit, sub, subOnce, unsub } = useContext(Socket);

    // Redirect state
    const [redirectTo, setRedirectTo] = useState(null);

    // Go to landing if not done already
    if (!redirectTo && !landingDone.current) setRedirectTo("/");

    // #################################################
    //   ROOM
    // #################################################

    // Leave the room
    const leaveRoom = (inform) => {
        // Set boss to false
        isBoss.current = false;

        // Delete the room code
        setRoomID(null);

        // Clear the room users array
        setRoomUsers([]);

        // Inform others in the room
        if (inform) emit("leaveRoom", {});
    };

    // Delete room if user leaves this page
    const onBackButtonClicked = () => {
        // Leave room
        leaveRoom(true);
    };

    // #################################################
    //   ERRORS
    // #################################################

    // On socket error
    const onSocketError = ({ error }) => {
        // Set error
        socketError.current = error;

        // Leave room
        leaveRoom(false);

        // Redirect to home
        setRedirectTo("/home");
    };

    // On socket disconnection
    const onSocketDisconnected = () => {
        // Set error
        socketError.current = "Disconnected from the server";

        // Leave room
        leaveRoom(false);

        // Redirect to home
        setRedirectTo("/home");
    };

    // #################################################
    //   COMPONENT MOUNT
    // #################################################

    // On componente mount
    useEffect(() => {
        // Change Color
        setBackgroundGradient("red");

        if (landingDone.current) {
            // Subscribe to error and disconnext events
            window.PubSub.sub("onSocketError", onSocketError);
            window.PubSub.sub("onSocketDisconnected", onSocketDisconnected);
        }

        // Unsubscribe on unmount
        return () => {
            // Unsubscribe to error and disconnext events
            window.PubSub.unsub("onSocketError", onSocketError);
            window.PubSub.unsub("onSocketDisconnected", onSocketDisconnected);
        };

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // #################################################
    //   RENDER
    // #################################################

    // Redirect to new route
    if (redirectTo) return <Redirect to={redirectTo} push={true} />;

    return (
        <div className="restaurants">
            <Navbar prevPage="/home" onBackButtonClicked={onBackButtonClicked}></Navbar>
        </div>
    );
}
