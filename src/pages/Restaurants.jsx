import React, { useEffect, useContext, useState, useRef } from "react";
import { Redirect } from "react-router-dom";
import { useSprings, useSpring, a } from "react-spring";
import { useDrag } from "react-use-gesture";

// Components
import Navbar from "components/Navbar";
import Restaurant from "components/Restaurant";
import Glass from "components/Glass";

// Contexts
import { Data } from "contexts/Data";
import { Socket } from "contexts/Socket";

// Constants
const GRADIENT_DELAY = 300;
const GRADIENTS = {
    neutral: ["#484848", "#747474"],
    red: ["#ff8a5f", "#be4242"],
    blue: ["#232b62", "#69acff"],
    green: ["#335e23", "#a4c73a"],
};

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
    //   GESTURE ACTIONS
    // #################################################

    // When the user likes a restaurant
    const onLike = () => {
        console.log("LIKE");
    };

    // When the user nopes a restaurant
    const onNope = () => {
        console.log("NOPE");
    };

    // When the user loves a restaurant
    const onLove = () => {
        console.log("LOVE");
    };

    // #################################################
    //   GESTURES
    // #################################################

    // Currently shown restaurant
    const currRestaurant = useRef(0);

    // Current action
    const [currAction, setCurrAction] = useState("");
    const currActionTimeout = useRef(null);

    // Reset current action
    const resetCurrentAction = (onlyClear = true) => {
        clearTimeout(currActionTimeout.current);

        if (!onlyClear) {
            currActionTimeout.current = setTimeout(() => {
                setCurrAction("");
            }, GRADIENT_DELAY);
        }
    };

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

    // Current horizontal direction
    const swipingRight = useRef(true);

    // Text popup spring
    const [popupSpring, setPopupSpring] = useSpring(() => ({ scale: 0, config: { friction: 30 } }));

    // Gradient timeout
    const gradientTimeout = useRef(null);

    // Horizontal gesture
    const horizontalGestureBind = useDrag(
        ({ args: [index], first, down, vxvy: [vx], movement: [xDelta], direction: [xDir] }) => {
            // Get the direction
            const dir = xDir < 0 ? -1 : 1;

            // Set gesture direction
            if (first) swipingRight.current = dir >= 0;

            // If the gesture is over and it had high velocity -> Flag the restaurant to fly away
            const throwAway = !down && ((swipingRight.current && vx > 0.3) || (!swipingRight.current && vx < -0.3));

            // Set the background gradient & popup when LIKE or NOPE
            setPopupSpring({ scale: 1 });
            if (swipingRight.current) {
                resetCurrentAction();
                setCurrAction("LIKE");
                setGradient({ gradient: `linear-gradient(60deg, ${GRADIENTS["green"][0]} 0%, ${GRADIENTS["green"][1]} 100%)` });
            } else {
                resetCurrentAction();
                setCurrAction("NOPE");
                setGradient({ gradient: `linear-gradient(60deg, ${GRADIENTS["red"][0]} 0%, ${GRADIENTS["red"][1]} 100%)` });
            }

            // Set gradient & popup back to normal if gesture is canceled
            if (!throwAway && !down) {
                resetCurrentAction(false);
                setPopupSpring({ scale: 0 });
                setGradient({ gradient: `linear-gradient(60deg, ${GRADIENTS["neutral"][0]} 0%, ${GRADIENTS["neutral"][1]} 100%)` });
            }

            // When thrown, turn backgraund gradient & popup back to normal after a delay
            if (throwAway) {
                clearTimeout(gradientTimeout.current);
                gradientTimeout.current = setTimeout(() => {
                    resetCurrentAction(false);
                    setPopupSpring({ scale: 0 });
                    setGradient({ gradient: `linear-gradient(60deg, ${GRADIENTS["neutral"][0]} 0%, ${GRADIENTS["neutral"][1]} 100%)` });
                }, GRADIENT_DELAY);
            }

            // Set the springs the current card
            setSprings((i) => {
                // Don't afect the otherr restaurants
                if (index !== i) {
                    // Show next restaurant
                    if (throwAway && i === currRestaurant.current + 1) return { x: 0, y: 0, rotateZ: 0, scale: 1, pointerEvents: "all", delay: 250 };
                    else return;
                }

                // When a restaurant is gone it fles out left or right, otherwise goes back to zero
                if (swipingRight.current) var x = Math.max(0, throwAway ? (200 + window.innerWidth) * dir : down ? xDelta : 0);
                else x = Math.min(0, throwAway ? (200 + window.innerWidth) * dir : down ? xDelta : 0);

                // Rotate while flying away -> Scales with velocity
                if (swipingRight.current) var rotateZ = Math.max(0, down || throwAway ? xDelta / 100 + (throwAway ? dir * 10 * Math.abs(vx) : 0) : 0);
                else rotateZ = Math.min(0, down || throwAway ? xDelta / 100 + (throwAway ? dir * 10 * Math.abs(vx) : 0) : 0);

                // Set the spring
                return { x, y: 0, rotateZ, scale: 1, pointerEvents: throwAway ? "none" : "all" };
            });

            // Show next picture
            if (throwAway) {
                currRestaurant.current++;

                if (swipingRight.current) onLike();
                else onNope();
            }
        },
        { filterTaps: true, axis: "x" }
    );

    // Vertical gesture
    const verticalGestureBind = useDrag(
        ({ args: [index], down, vxvy: [, vy], movement: [, yDelta] }) => {
            // If the gesture is over and it had high velocity -> Flag the restaurant to fly away
            const throwAway = !down && vy < -0.3;

            // Set the background gradient & popup when LOVE
            resetCurrentAction();
            setCurrAction("LOVE");
            setPopupSpring({ scale: 1 });
            setGradient({ gradient: `linear-gradient(60deg, ${GRADIENTS["blue"][0]} 0%, ${GRADIENTS["blue"][1]} 100%)` });

            // Set gradient & popup back to normal if gesture is canceled
            if (!throwAway && !down) {
                resetCurrentAction(false);
                setPopupSpring({ scale: 0 });
                setGradient({ gradient: `linear-gradient(60deg, ${GRADIENTS["neutral"][0]} 0%, ${GRADIENTS["neutral"][1]} 100%)` });
            }

            // When thrown, turn backgraund gradient to neutral after a delay
            if (throwAway) {
                clearTimeout(gradientTimeout.current);
                gradientTimeout.current = setTimeout(() => {
                    resetCurrentAction(false);
                    setPopupSpring({ scale: 0 });
                    setGradient({ gradient: `linear-gradient(60deg, ${GRADIENTS["neutral"][0]} 0%, ${GRADIENTS["neutral"][1]} 100%)` });
                }, GRADIENT_DELAY);
            }

            // Set the springs the current card
            setSprings((i) => {
                // Don't afect the otherr restaurants
                if (index !== i) {
                    // Show next restaurant
                    if (throwAway && i === currRestaurant.current + 1) return { x: 0, y: 0, rotateZ: 0, scale: 1, pointerEvents: "all" };
                    else return;
                }

                // When a restaurant is gone it fles out left or right, otherwise goes back to zero
                const y = Math.min(0, throwAway ? -200 - window.innerHeight : down ? yDelta : 0);

                // Set the spring
                return { x: 0, y, rotateZ: 0, scale: 1, pointerEvents: throwAway ? "none" : "all" };
            });

            // Show next picture
            if (throwAway) {
                currRestaurant.current++;
                onLove();
            }
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
                <a.div className="controlsContainer" style={{ scale: popupSpring.scale }}>
                    <Glass style={{ width: "fit-content" }}>
                        <p className="text">{currAction}</p>
                    </Glass>
                </a.div>
            </div>
        </div>
    );
}
