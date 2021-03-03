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
import { API } from "contexts/API";

// Constants
const COUNTDOWN = 10000;
const NEXT_RESTAURANT_DELAY = 300;

export default function Restaurants() {
    // Print Render
    if (process.env.REACT_APP_DEBUGG === "true" && process.env.NODE_ENV !== "production") console.log("%cRender Restaurants", "color: grey; font-size: 11px");

    // Contexts
    const { username, roomID, setRoomID, roomUsers, setRoomUsers, isBoss, restaurants, timeStart, setBackgroundGradient, landingDone, socketError } = useContext(Data);
    const { emit } = useContext(Socket);
    const { addToRestaurantScore } = useContext(API);

    // Redirect state
    const [redirectTo, setRedirectTo] = useState(null);

    // Go to landing if not done already
    if (!redirectTo && !landingDone.current) setRedirectTo("/");

    // #################################################
    //   GESTURE ACTIONS
    // #################################################

    // When the user likes a restaurant
    const onLike = () => {
        addToRestaurantScore(username.current, roomID, restaurants.current[currRestaurant.current].restaurantID, 1);
        currRestaurant.current++;
    };

    // When the user nopes a restaurant
    const onNope = () => {
        currRestaurant.current++;
    };

    // When the user loves a restaurant
    const onLove = () => {
        addToRestaurantScore(username.current, roomID, restaurants.current[currRestaurant.current].restaurantID, 2);
        currRestaurant.current++;
    };

    // #################################################
    //   COUNTDOWN
    // #################################################

    // Countdown slider
    const countdownSlider = useRef(null);

    // Countdown Timeouts
    const countdownTimeout = useRef(null);

    // Restart Countdown Timeouts
    const restartCountdownTimeout = useRef(null);

    // Too late
    const tooLate = useRef(false);

    // Start the countdown
    const startCountdown = () => {
        // Clear the timeout
        clearTimeout(countdownTimeout.current);

        // Reactivate the countdown animation
        countdownSlider.current.classList.remove("countdownAnim");
        void countdownSlider.current.offsetWidth;
        countdownSlider.current.classList.add("countdownAnim");

        // Next restaurant
        countdownTimeout.current = setTimeout(() => {
            // To late to like
            tooLate.current = true;

            // Set gradient & action
            resetCurrentAction();
            setCurrAction("NOPE");
            setBackgroundGradient("red");

            // Reset gradient & action after a delay
            clearTimeout(gradientTimeout.current);
            gradientTimeout.current = setTimeout(() => {
                resetCurrentAction(false);
                setPopupSpring({ scale: 0 });
                setBackgroundGradient("neutral");
            }, NEXT_RESTAURANT_DELAY);

            // Set the springs the current card
            setSprings((i) => {
                // Don't afect the otherr restaurants
                if (currRestaurant.current !== i) {
                    // Show next restaurant
                    if (i === currRestaurant.current + 1) return { x: 0, y: 0, rotateZ: 0, scale: 1, pointerEvents: "all", delay: 250 };
                    else return;
                }

                // When a restaurant is gone it fles out left or right, otherwise goes back to zero
                var x = (200 + window.innerWidth) * -1;

                // Set the spring
                return { x, y: 0, rotateZ: -20, scale: 1, pointerEvents: "none" };
            });

            // Discard restaurant
            onNope();

            // Restart countdown
            restartCountdown();
        }, COUNTDOWN);
    };

    /// Restart the countdown
    const restartCountdown = () => {
        // Clear the timeouts
        clearTimeout(countdownTimeout.current);
        clearTimeout(restartCountdownTimeout.current);

        // Don't restart if there is more restaurants
        if (currRestaurant.current >= restaurants.current.length) {
            countdownSlider.current.classList.remove("countdownAnim");

            // If there is only one user -> Go directly to ranking
            if (roomUsers.length <= 1) setRedirectTo("ranking");
            // Otherwise -> Go to a waiting screen
            else setRedirectTo("wait");

            return;
        }

        // Start it again after a delay
        restartCountdownTimeout.current = setTimeout(() => {
            tooLate.current = false;
            startCountdown();
        }, NEXT_RESTAURANT_DELAY);
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
            }, NEXT_RESTAURANT_DELAY);
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

    // Index of the restaurant where a gesture is being aplied
    const currIndexGesture = useRef(currRestaurant.current);

    // Horizontal gesture
    const horizontalGestureBind = useDrag(
        ({ args: [index], first, down, vxvy: [vx], movement: [xDelta], direction: [xDir], cancel, canceled }) => {
            // Get the direction
            const dir = xDir < 0 ? -1 : 1;

            // Set gesture direction & index
            if (first) {
                swipingRight.current = dir >= 0;
                currIndexGesture.current = currRestaurant.current;
            }

            // To late
            if (tooLate.current || currIndexGesture.current !== currRestaurant.current) {
                cancel();
                return;
            }

            // Don't continue if canceled
            if (canceled) return;

            // If the gesture is over and it had high velocity -> Flag the restaurant to fly away
            const throwAway = !down && ((swipingRight.current && vx > 0.3) || (!swipingRight.current && vx < -0.3));

            // Set the background gradient & popup when LIKE or NOPE
            setPopupSpring({ scale: 1 });
            if (first && swipingRight.current) {
                resetCurrentAction();
                setCurrAction("LIKE");
                setBackgroundGradient("green");
            } else if (first) {
                resetCurrentAction();
                setCurrAction("NOPE");
                setBackgroundGradient("red");
            }

            // Set gradient & popup back to normal if gesture is canceled
            if (!throwAway && !down) {
                resetCurrentAction(false);
                setPopupSpring({ scale: 0 });
                setBackgroundGradient("neutral");
            }

            // When thrown, turn backgraund gradient & popup back to normal after a delay and restart the countdown
            if (throwAway) {
                clearTimeout(gradientTimeout.current);
                gradientTimeout.current = setTimeout(() => {
                    resetCurrentAction(false);
                    setPopupSpring({ scale: 0 });
                    setBackgroundGradient("neutral");
                }, NEXT_RESTAURANT_DELAY);
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
                if (swipingRight.current) onLike();
                else onNope();

                // Restart countdown
                restartCountdown();
            }
        },
        { filterTaps: true, axis: "x" }
    );

    // Vertical gesture
    const verticalGestureBind = useDrag(
        ({ args: [index], first, down, vxvy: [, vy], movement: [, yDelta], cancel, canceled }) => {
            // Set gesture index
            if (first) currIndexGesture.current = currRestaurant.current;

            // To late
            if (tooLate.current || currIndexGesture.current !== currRestaurant.current) {
                cancel();
                return;
            }

            // Don't continue if canceled
            if (canceled) return;

            // If the gesture is over and it had high velocity -> Flag the restaurant to fly away
            const throwAway = !down && vy < -0.3;

            // Set the background gradient & popup when LOVE
            if (first && yDelta < 0) {
                resetCurrentAction();
                setCurrAction("LOVE");
                setPopupSpring({ scale: 1 });
                setBackgroundGradient("blue");
            }

            // Set gradient & popup back to normal if gesture is canceled
            if (!throwAway && !down) {
                resetCurrentAction(false);
                setPopupSpring({ scale: 0 });
                setBackgroundGradient("neutral");
            }

            // When thrown, turn backgraund gradient to neutral after a delay
            if (throwAway) {
                clearTimeout(gradientTimeout.current);
                gradientTimeout.current = setTimeout(() => {
                    resetCurrentAction(false);
                    setPopupSpring({ scale: 0 });
                    setBackgroundGradient("neutral");
                }, NEXT_RESTAURANT_DELAY);
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
                onLove();

                // Restart countdown
                restartCountdown();
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

        // Clear the restaurants
        restaurants.current = [];

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

            // Set the time when the room started
            timeStart.current = new Date();

            // Start the first countdown
            startCountdown();
        }

        // Unsubscribe on unmount
        return () => {
            // Unsubscribe to error and disconnext events
            window.PubSub.unsub("onSocketError", throwError);

            // Clear timeouts
            clearTimeout(gradientTimeout.current);
            clearTimeout(currActionTimeout.current);
            clearTimeout(countdownTimeout.current);
            clearTimeout(restartCountdownTimeout.current);
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
                <a.div className="actionContainer" style={{ scale: popupSpring.scale }}>
                    <Glass style={{ width: "fit-content" }}>
                        <p className="text">{currAction}</p>
                    </Glass>
                </a.div>

                <div className="countdownContainer">
                    <div className="countdown" ref={countdownSlider}></div>
                </div>
            </div>
        </div>
    );
}
