import React, { useEffect, useContext, useState } from "react";
import { Redirect } from "react-router-dom";
import { getDistance } from "geolib";

// Components
import Navbar from "components/Navbar";
import Winner from "components/Winner";
import Loser from "components/Loser";

// Contexts
import { Data } from "contexts/Data";
import { Socket } from "contexts/Socket";
import { API } from "contexts/API";

export default function Ranking() {
    // Print Render
    if (process.env.REACT_APP_DEBUGG === "true" && process.env.NODE_ENV !== "production") console.log("%cRender Loading", "color: grey; font-size: 11px");

    // Contexts
    const { roomID, setRoomID, setRoomUsers, isBoss, restaurants, mostAdvancedRoute, setBackgroundGradient, landingDone, socketError } = useContext(Data);
    const { emit } = useContext(Socket);
    const { getRoomRestaurants } = useContext(API);

    // Redirect state
    const [redirectTo, setRedirectTo] = useState(null);

    // Go to landing if not done already
    if (!redirectTo && !landingDone.current) setRedirectTo("/");

    // #################################################
    //   RESTAURANTS
    // #################################################

    const [restaurantsRanking, setRestaurantsRanking] = useState(null);

    // Sort dunction for restaurants
    const sortRestaurants = (restaurantA, restaurantB) => {
        // Deconstruct
        const { loves: lovesA, likes: likesA, rating: ratingA, lat: latA, latBoss: latBossA, lon: lonA, lonBoss: lonBossA, price: priceA } = restaurantA;
        const { loves: lovesB, likes: likesB, rating: ratingB, lat: latB, latBoss: latBossB, lon: lonB, lonBoss: lonBossB, price: priceB } = restaurantB;

        // Return if the data is incomplete
        if (!lovesA || !likesA || !lovesB || !likesB) return 0;

        // Get scores
        const scoreA = likesA.length + lovesA.length * 2;
        const scoreB = likesB.length + lovesB.length * 2;

        // If scores are different return the result
        if (scoreA > scoreB) return -1;
        else if (scoreB > scoreA) return 1;

        // Sort by rating
        if (ratingA > ratingB) return -1;
        else if (ratingB > ratingA) return 1;

        // Get distances to boss
        const distanceA = Math.round(getDistance({ latitude: latA, longitude: lonA }, { latitude: latBossA, longitude: lonBossA }));
        const distanceB = Math.round(getDistance({ latitude: latB, longitude: lonB }, { latitude: latBossB, longitude: lonBossB }));

        // Sort by distance
        if (distanceA > distanceB) return -1;
        else if (distanceB > distanceA) return 1;

        // Sort by price
        if (priceA > priceB) return -1;
        else if (priceB > priceA) return 1;

        // Don't alter order
        return 0;
    };

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

    // Delete room if user leaves this page
    const onExitRoom = () => {
        // Leave room
        leaveRoom(true);

        // Redirect to home
        setRedirectTo("/home");
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

        // Go home if we arrived here through the back button
        if (mostAdvancedRoute.current === "home") {
            mostAdvancedRoute.current = "home";
            setRedirectTo("/");
        }

        // Start countdown
        else if (landingDone.current) {
            // Set the most advanced page
            mostAdvancedRoute.current = "ranking";

            // Subscribe to error and disconnext events
            window.PubSub.sub("onSocketError", throwError);

            // Update the restaurants
            const getRestaurantsWithScores = async () => {
                // Get the restaurants
                await getRoomRestaurants(roomID);

                // Sort the restaurants with the most liked on top
                restaurants.current.sort(sortRestaurants);

                // Create restaurant objects
                setRestaurantsRanking(restaurants.current.map((data, i) => (i === 0 ? <Winner data={data} position={i} key={i} /> : <Loser data={data} position={i} key={i} />)));
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
            <Navbar></Navbar>

            <div className="button lower closer" onClick={onExitRoom}>
                Exit Room
            </div>

            <div className="container">
                <div className="overflowContainer">
                    <div className="restaurantsContainer">{restaurantsRanking}</div>
                </div>
            </div>
        </div>
    );
}
