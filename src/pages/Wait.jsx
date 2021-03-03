import React, { useEffect, useContext, useState } from "react";
import { Redirect } from "react-router-dom";
import SVG from "react-inlinesvg";

// Components
import Navbar from "components/Navbar";
import Glass from "components/Glass";

// Icons
import LogoIcon from "resources/logo_white.svg";

// Contexts
import { Data } from "contexts/Data";
import { Socket } from "contexts/Socket";
import { API } from "contexts/API";

export default function Wait() {
    // Print Render
    if (process.env.REACT_APP_DEBUGG === "true" && process.env.NODE_ENV !== "production") console.log("%cRender Loading", "color: grey; font-size: 11px");

    // Contexts
    const { username, roomID, setRoomID, setRoomUsers, isBoss, restaurants, setBackgroundGradient, landingDone, socketError } = useContext(Data);
    const { emit, subOnce, unsub } = useContext(Socket);
    const { getRoomRestaurants } = useContext(API);

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

        // Clear the restaurants
        restaurants.current = [];

        // Inform others in the room
        if (inform) emit("leaveRoom", {});
    };

    // Delete room if user leaves this page
    const onBackButtonClicked = () => {
        // Leave room
        leaveRoom(true);
    };

    // On the restaurants loaded
    const onEveryoneFinished = async () => {
        // Get the restaurants
        await getRoomRestaurants(roomID);

        // ROJAS continue here
        console.log(restaurants.current);
    };

    // #################################################
    //   ERRORS
    // #################################################

    // Throw an error and go home
    const throwError = ({ error }) => {
        // Set error
        socketError.current = error;

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
        setBackgroundGradient("blue");

        if (landingDone.current) {
            // Subscribe to error and disconnext events
            window.PubSub.sub("onSocketError", throwError);

            // Subscribe to the restaurants loaded event
            subOnce("everyoneFinished", onEveryoneFinished);

            // Inform that this user has finished scoring restaurants
            emit("finishScoringRestaurants", { roomID, username: username.current });
        }

        // Unsubscribe on unmount
        return () => {
            unsub("everyoneFinished");

            // Unsubscribe to error and disconnext events
            window.PubSub.unsub("onSocketError", throwError);
        };

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // #################################################
    //   RENDER
    // #################################################

    // Redirect to new route
    if (redirectTo) return <Redirect to={redirectTo} push={true} />;

    // Style for the glass
    const glassStyle = {
        minHeight: "8vh",
        padding: "10%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
    };

    // ROJAS change loading to wait
    return (
        <div className="loading">
            <Navbar prevPage="/home" onBackButtonClicked={onBackButtonClicked}></Navbar>
            <div className="container">
                <Glass style={glassStyle}>
                    <SVG className="loadingIcon" src={LogoIcon} />
                    <p className="loadingText">Waiting on all to finish...</p>
                </Glass>
            </div>
        </div>
    );
}
