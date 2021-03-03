import React, { useEffect, useContext, useState } from "react";
import { Redirect } from "react-router-dom";

// Components
import Navbar from "components/Navbar";

// Contexts
import { Data } from "contexts/Data";
import { Socket } from "contexts/Socket";
import { API } from "contexts/API";

export default function Ranking() {
    // Print Render
    if (process.env.REACT_APP_DEBUGG === "true" && process.env.NODE_ENV !== "production") console.log("%cRender Loading", "color: grey; font-size: 11px");

    // Contexts
    const { roomID, setRoomID, setRoomUsers, isBoss, restaurants, setBackgroundGradient, landingDone, socketError } = useContext(Data);
    const { emit } = useContext(Socket);
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
        setBackgroundGradient("blaugrana");

        if (landingDone.current) {
            // Subscribe to error and disconnext events
            window.PubSub.sub("onSocketError", throwError);

            // Update the restaurants
            const getRestaurantsWithScores = async () => {
                // Get the restaurants
                await getRoomRestaurants(roomID);

                console.log(restaurants.current);
            };
            getRestaurantsWithScores();
        }

        // Unsubscribe on unmount
        return () => {
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

    return (
        <div className="ranking">
            <Navbar prevPage="/home" onBackButtonClicked={onBackButtonClicked}></Navbar>
            <div className="container"></div>
        </div>
    );
}
