import React, { useEffect, useContext, useState, useRef } from "react";
import { Redirect } from "react-router-dom";
import { CountdownCircleTimer } from "react-countdown-circle-timer";

// Components
import Navbar from "components/Navbar";
import Glass from "components/Glass";

// Contexts
import { Data } from "contexts/Data";
import { Socket } from "contexts/Socket";

// Constants
const NUM_RESTAURANTS = 5;
const TIME_PER_RESTAURANT = 10;

export default function Wait() {
    // Print Render
    if (process.env.REACT_APP_DEBUGG === "true" && process.env.NODE_ENV !== "production") console.log("%cRender Loading", "color: grey; font-size: 11px");

    // Contexts
    const { username, roomID, setRoomID, setRoomUsers, isBoss, restaurants, timeStart, setBackgroundGradient, landingDone, socketError } = useContext(Data);
    const { emit, subOnce, unsub } = useContext(Socket);

    // Redirect state
    const [redirectTo, setRedirectTo] = useState(null);

    // Go to landing if not done already
    if (!redirectTo && !landingDone.current) setRedirectTo("/");

    // #################################################
    //   COUNTDOWN
    // #################################################

    // Countdown duration
    const countDownDuration = useRef(
        timeStart.current ? Math.abs(NUM_RESTAURANTS * TIME_PER_RESTAURANT - Math.abs(new Date().getTime() - timeStart.current.getTime()) / 1000) + NUM_RESTAURANTS * 0.3 : 0
    );

    const renderTime = (timeLeft) => {
        var dimension = timeLeft > 1 ? "seconds" : timeLeft > 0 ? "second" : "";

        return (
            <div className="timeWrapper">
                <div className="time">{timeLeft}</div>
                <div className="dimension">{dimension}</div>
            </div>
        );
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

        // Inform others in the room
        if (inform) emit("leaveRoom", {});
    };

    // On the restaurants loaded
    const onEveryoneFinished = async () => {
        // Go to the ranking
        setRedirectTo("/ranking");
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

    // ROJAS Prevent back button in loading, restaurants & waiting

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

    const timerProps = {
        isPlaying: true,
        size: window.innerWidth * 0.35,
        strokeWidth: 10,
        trailColor: "rgba(255, 255, 255, 0.2)",
    };

    return (
        <div className="wait">
            <Navbar></Navbar>
            <div className="container">
                <Glass style={glassStyle}>
                    <CountdownCircleTimer {...timerProps} colors={[["#ffffff"]]} duration={countDownDuration.current}>
                        {({ remainingTime }) => renderTime(Math.ceil(remainingTime))}
                    </CountdownCircleTimer>

                    <p className="waitingText">Waiting for everyone</p>
                </Glass>
            </div>
        </div>
    );
}
