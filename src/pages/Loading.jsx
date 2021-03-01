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

export default function Loading() {
    // Print Render
    if (process.env.REACT_APP_DEBUGG === "true" && process.env.NODE_ENV !== "production") console.log("%cRender Loading", "color: grey; font-size: 11px");

    // Contexts
    const { roomID, setRoomID, setRoomUsers, isBoss, restaurants, setBackgroundGradient, landingDone, socketError } = useContext(Data);
    const { emit, sub, unsub } = useContext(Socket);
    const { getPlaces } = useContext(API);

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
    const onRestaurantsLoaded = () => {
        // Redirect to restaurants
        setRedirectTo("/restaurants");
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
        setBackgroundGradient("red");

        if (landingDone.current) {
            // Subscribe to error and disconnext events
            window.PubSub.sub("onSocketError", throwError);

            // Subscribe to the restaurants loaded event
            sub("restaurantsLoaded", onRestaurantsLoaded);

            // Get the restaurants if it is the boss
            if (isBoss.current) {
                // Get the restaurants
                const getRestaurants = async (position) => {
                    const { coords } = await position;

                    // Throw error if coords are not present
                    if (!coords) return throwError({ error: "Invalid location" });

                    // Deconstruct
                    const { latitude, longitude } = coords;

                    // If the location is wrong -> throw error
                    if (!latitude || !longitude) return throwError({ error: "Invalid location" });

                    try {
                        // Get Places
                        // ROJAS replace with this line
                        //const placesResponse = await getPlaces(roomID, latitude, longitude);
                        const placesResponse = await getPlaces(roomID, 41.390564, 2.162579);

                        if ("error" in placesResponse) return throwError({ error: placesResponse.error });

                        // Inform that the restaurans have been found
                        emit("broadcastMessageToRoom", { message: "restaurantsLoaded", roomID });
                    } catch (error) {
                        return throwError({ error: "Access denied" });
                    }
                };

                // Get the boss location
                const getLocation = async () => {
                    if (navigator.geolocation) navigator.geolocation.getCurrentPosition(getRestaurants, () => throwError({ error: "Geolocation not permitted" }));
                    else return throwError({ error: "Geolocation not supported" });
                };

                getLocation();
            }
        }

        // Unsubscribe on unmount
        return () => {
            unsub("restaurantsLoaded");

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

    return (
        <div className="loading">
            <Navbar prevPage="/home" onBackButtonClicked={onBackButtonClicked}></Navbar>
            <div className="container">
                <Glass style={glassStyle}>
                    <SVG className="loadingIcon" src={LogoIcon} />
                    <p className="loadingText">Finding restaurants...</p>
                </Glass>
            </div>
        </div>
    );
}
