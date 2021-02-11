import React, { useEffect, useState, useContext } from "react";
import { Redirect } from "react-router-dom";
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
import { Data } from "contexts/Data";
import { Socket } from "contexts/Socket";

export default function Home() {
    // Print Render
    if (process.env.NODE_ENV !== "production") console.log("%cRender Home", "color: grey; font-size: 11px");

    // Contexts
    const { setBackgroundGradient, username, image, landingDone } = useContext(Data);
    const { connect } = useContext(Socket);

    // Redirect state
    const [redirectTo, setRedirectTo] = useState(null);

    // Go to landing if not done already
    if (!redirectTo && !landingDone.current) setRedirectTo("/");

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
    //   COMPONENT MOUNT
    // #################################################

    // On componente mount
    useEffect(() => {
        // Connect to socket
        connect();

        // Change Color
        setBackgroundGradient("fcb");

        if (landingDone.current) {
            const timeline = gsap.timeline({ defaults: { ease: "power1" } });
            timeline.fromTo(".home > .container > .glass", { opacity: 0 }, { opacity: 1, duration: 0.2 }, "+=0.5");
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // #################################################
    //   RENDER
    // #################################################

    // Redirect to new route
    if (redirectTo) return <Redirect to={redirectTo} push={true} />;

    return (
        <div className="home">
            <Navbar></Navbar>

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
            </div>
        </div>
    );
}
