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
    const { username, roomID, setRoomID, setRoomUsers, isBoss, restaurants, mostAdvancedRoute, setBackgroundGradient, landingDone, socketError } = useContext(Data);
    const { emit, sub, unsub } = useContext(Socket);
    const { getPlaces, getRoomRestaurants } = useContext(API);

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

        // Reset the most advanced route
        mostAdvancedRoute.current = "home";

        // Inform others in the room
        if (inform) emit("leaveRoom", {});
    };

    // On the restaurants loaded
    const onRestaurantsLoaded = async () => {
        // Get the restaurants
        await getRoomRestaurants(roomID);

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

        // Go home if we arrived here through the back button
        if (mostAdvancedRoute.current === "restaurants" || mostAdvancedRoute.current === "wait" || mostAdvancedRoute.current === "ranking") {
            mostAdvancedRoute.current = "home";
            setRedirectTo("/");
        }

        // Start countdown
        else if (landingDone.current) {
            // Set the most advanced page
            mostAdvancedRoute.current = "loading";

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
                        const placesResponse = await getPlaces(roomID, latitude, longitude, username.current);
                        //const placesResponse = await getPlaces(roomID, 41.390564, 2.162579, username.current);

                        if ("error" in placesResponse) return throwError({ error: "Error getting restaurants" });

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
            <Navbar></Navbar>
            <div className="container">
                <Glass style={glassStyle}>
                    <SVG className="loadingIcon" src={LogoIcon} />
                    <p className="loadingText">Finding restaurants...</p>
                </Glass>
            </div>
        </div>
    );
}
