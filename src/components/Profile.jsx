import React, { useEffect, useRef } from "react";
import SVG from "react-inlinesvg";
import gsap from "gsap";
import classnames from "classnames";

// Icons
import UserIcon from "resources/icons/user.svg";

export default function Profile({ image, text, size, clickable }) {
    // Print Render
    if (process.env.REACT_APP_DEBUGG === "true" && process.env.NODE_ENV !== "production") console.log("%cRender Profile", "color: grey; font-size: 11px");

    // #################################################
    //   RANDOM CIRCLES
    // #################################################

    // Circle sizes
    const circle1Size = useRef(Math.random() * 0.5 + 3.4);
    const circle2Size = useRef(Math.random() * 0.5 + 3.1);

    // #################################################
    //   COMPONENT MOUNT
    // #################################################

    // On componente mount
    useEffect(() => {
        const timeline = gsap.timeline({ defaults: { ease: "power1" } });
        timeline.fromTo(".profile ", { opacity: 0 }, { opacity: 1, duration: 0.2 }, "+=0.5");

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // #################################################
    //   RENDER
    // #################################################

    // Placeholder image if necessary
    if (image) var profileImage = <img src={image} alt="img" className={classnames("image", { clickable })} />;
    else
        profileImage = (
            <div className="container">
                <SVG className="placeholder" src={UserIcon} />
            </div>
        );

    // Profile style
    const profileStyle = {
        fontSize: size,
        width: `9em`,
        height: `6em`,
    };

    // Circle 1 style
    const styleCircle1 = {
        height: `${circle1Size.current}em`,
        maxHeight: `${circle1Size.current}em`,
        minHeight: `${circle1Size.current}em`,
        width: `${circle1Size.current}em`,
        maxWidth: `${circle1Size.current}em`,
        minWidth: `${circle1Size.current}em`,
    };

    // Circle 2 style
    const styleCircle2 = {
        height: `${circle2Size.current}em`,
        maxHeight: `${circle2Size.current}em`,
        minHeight: `${circle2Size.current}em`,
        width: `${circle2Size.current}em`,
        maxWidth: `${circle2Size.current}em`,
        minWidth: `${circle2Size.current}em`,
    };

    return (
        <div className="profile" style={profileStyle}>
            <div className="circle" style={styleCircle1}></div>
            <div className="circle" style={styleCircle2}></div>
            {profileImage}
            <p className="name">{text}</p>
        </div>
    );
}
