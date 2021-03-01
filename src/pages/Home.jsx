import React, { useEffect, useState, useContext } from "react";
import { Redirect } from "react-router-dom";
import classnames from "classnames";
import SVG from "react-inlinesvg";
import gsap from "gsap";

// Components
import Glass from "components/Glass";
import Navbar from "components/Navbar";
import Profile from "components/Profile";

// Icons
import CreateIcon from "resources/icons/create.svg";
import JoinIcon from "resources/icons/join.svg";

// Contexts
import { Utils } from "contexts/Utils";
import { Data } from "contexts/Data";
import { Socket } from "contexts/Socket";

export default function Home() {
    // Print Render
    if (process.env.REACT_APP_DEBUGG === "true" && process.env.NODE_ENV !== "production") console.log("%cRender Home", "color: grey; font-size: 11px");

    // Contexts
    const { useForceUpdate } = useContext(Utils);
    const { setRoomID, setRoomUsers, isBoss, restaurants, setBackgroundGradient, username, image, landingDone, socketError } = useContext(Data);
    const { connect, emit } = useContext(Socket);

    // Redirect state
    const [redirectTo, setRedirectTo] = useState(null);

    // Go to landing if not done already
    if (!redirectTo && !landingDone.current) setRedirectTo("/");

    // Force update
    const forceUpdate = useForceUpdate();

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

        // Clear the restaurants  ROJAS UNCOMMENT
        //restaurants.current = [];

        // Inform others in the room
        if (inform) emit("leaveRoom", {});
    };

    // #################################################
    //   OPTION CLICKED
    // #################################################

    // When the users creates a room
    const onCreateRoomClicked = () => {
        setRedirectTo("/createRoom");
    };

    // When the user wants to join a room
    const onJoinRoomClicked = () => {
        setRedirectTo("/joinRoom");
    };

    // #################################################
    //   ERRORS
    // #################################################

    // Throw an error and go home
    const throwError = ({ error, errorCode }) => {
        // Server reconected
        if (errorCode === 601) {
            // Only update if socketError was not null
            if (socketError.current) {
                socketError.current = null;
                forceUpdate();
            }
        }

        // Other errors
        else if (socketError.current !== error && errorCode !== 621) {
            socketError.current = error;
            forceUpdate();
        }
    };

    // #################################################
    //   COMPONENT MOUNT
    // #################################################

    // On componente mount
    useEffect(() => {
        // Leave room ROJAS change again to true?
        leaveRoom(false);

        // Connect to socket
        connect();

        // Change Color
        setBackgroundGradient("blaugrana");

        // Animate
        if (landingDone.current) {
            const timeline = gsap.timeline({ defaults: { ease: "power1" } });
            timeline.fromTo(".home > .container > .glass", { opacity: 0 }, { opacity: 1, duration: 0.2 }, "+=0.25");
        }

        // Subscribe to error and disconnext events
        window.PubSub.sub("onSocketError", throwError);

        // Info about the landing
        const landingDoneConst = landingDone.current;

        return () => {
            // Remove error message
            if (landingDoneConst) socketError.current = null;

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
        <div className="home">
            <Navbar settings></Navbar>

            <div className="container">
                <Profile image={image.current} text={`Hi, ${username.current}!`} size={"2rem"} clickable={false}></Profile>

                <Glass style={{ minHeight: "20vh", margin: "7% 0 7% 0", padding: "10%" }} onClick={onCreateRoomClicked} classes="clickable">
                    <SVG className="icon" src={CreateIcon} />
                    <p className="text">Create Room</p>
                </Glass>

                <Glass style={{ minHeight: "20vh", marginBottom: "15%", padding: "10%" }} onClick={onJoinRoomClicked} classes="clickable">
                    <SVG className="icon" src={JoinIcon} />
                    <p className="text">Join Room</p>
                </Glass>

                <p className={classnames("errorMessage", { hidden: !socketError.current })}>{socketError.current}</p>
            </div>
        </div>
    );
}
