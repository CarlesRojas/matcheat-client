import React, { useEffect, useContext, useState, useRef } from "react";
import { Redirect } from "react-router-dom";
import { useSprings, useSpring, a } from "react-spring";
import { useDrag } from "react-use-gesture";

// Components
import Navbar from "components/Navbar";
import Restaurant from "components/Restaurant";

// Contexts
import { Data } from "contexts/Data";
import { Socket } from "contexts/Socket";

export default function Restaurants() {
    // Print Render
    if (process.env.REACT_APP_DEBUGG === "true" && process.env.NODE_ENV !== "production") console.log("%cRender Restaurants", "color: grey; font-size: 11px");

    // Contexts
    const { setRoomID, setRoomUsers, isBoss, restaurants, setBackgroundGradient, landingDone, socketError, currGradient, setGradient } = useContext(Data);
    const { emit /*, sub, subOnce, unsub*/ } = useContext(Socket);

    // Redirect state
    const [redirectTo, setRedirectTo] = useState(null);

    // Go to landing if not done already
    if (!redirectTo && !landingDone.current) setRedirectTo("/");

    // #################################################
    //   GESTURES
    // #################################################

    // Currently shown restaurant
    const currRestaurant = useRef(0);

    // Restaurants movement spring
    const [springProps, setSprings] = useSprings(restaurants.current.length, (i) => ({
        x: 0,
        y: 0,
        rotateZ: 0,
        scale: i === currRestaurant.current ? 1 : 0,
        pointerEvents: i === currRestaurant.current ? "all" : "none",
        from: { x: 0, y: 0, rotateZ: 0, scale: 0, pointerEvents: "none" },
        delay: 250,
    }));

    // Horizontal gesture
    const horizontalGestureBind = useDrag(
        ({ args: [index], down, vxvy: [vx], movement: [xDelta], direction: [xDir] }) => {
            // Get the direction
            const dir = xDir < 0 ? -1 : 1;

            // If the gesture is over and it had high velocity -> Flag the restaurant to fly away
            const throwAway = !down && Math.abs(vx) > 0.3;

            // Set the springs the current card
            setSprings((i) => {
                // Don't afect the otherr restaurants
                if (index !== i) {
                    // Show next restaurant
                    if (throwAway && i === currRestaurant.current + 1) return { x: 0, y: 0, rotateZ: 0, scale: 1, pointerEvents: "all", delay: 250 };
                    else return;
                }

                // When a card is gone it flys out left or right, otherwise goes back to zero
                const x = throwAway ? (200 + window.innerWidth) * dir : down ? xDelta : 0;

                // Rotate while flying away -> Scales with velocity
                const rotateZ = down || throwAway ? xDelta / 100 + (throwAway ? dir * 10 * Math.abs(vx) : 0) : 0;

                // Set the spring
                return { x, y: 0, rotateZ, scale: 1, pointerEvents: throwAway ? "none" : "all" };
            });

            // Show next picture
            if (throwAway) currRestaurant.current++;
        },
        { filterTaps: true, axis: "x" }
    );

    // Vertical gesture
    const verticalGestureBind = useDrag(
        ({ args: [index], down, vxvy: [, vy], movement: [, yDelta] }) => {
            // If the gesture is over and it had high velocity -> Flag the restaurant to fly away
            const throwAway = !down && vy < -0.3;

            // Set the springs the current card
            setSprings((i) => {
                // Don't afect the otherr restaurants
                if (index !== i) {
                    // Show next restaurant
                    if (throwAway && i === currRestaurant.current + 1) return { x: 0, y: 0, rotateZ: 0, scale: 1, pointerEvents: "all" };
                    else return;
                }

                // When a card is gone it flys out left or right, otherwise goes back to zero
                const y = Math.min(0, throwAway ? -200 - window.innerHeight : down ? yDelta : 0);

                // Set the spring
                return { x: 0, y, rotateZ: 0, scale: 1, pointerEvents: throwAway ? "none" : "all" };
            });

            // Show next picture
            if (throwAway) currRestaurant.current++;
        },
        { filterTaps: true, axis: "y" }
    );

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

        // Clear the restaurants ROJAS UNCOMMENT
        //restaurants.current = [];

        // Inform others in the room
        if (inform) emit("leaveRoom", {});
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
        setBackgroundGradient("neutral");

        if (landingDone.current) {
            // Subscribe to error and disconnext events
            window.PubSub.sub("onSocketError", throwError);
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
        <div className="restaurants">
            <Navbar style={{ position: "absolute", top: 0, left: 0 }}></Navbar>
            <div className="container">
                {springProps.map(({ x, y, rotateZ, scale, pointerEvents }, i) => {
                    return (
                        <a.div className="restaurantContainer" key={i} style={{ x, y, scale, pointerEvents, rotateZ }}>
                            <Restaurant data={restaurants.current[i]} verticalGestureBind={verticalGestureBind(i)} horizontalGestureBind={horizontalGestureBind(i)} />
                        </a.div>
                    );
                })}
                <div className="controlsContainer"></div>
            </div>
        </div>
    );
}
