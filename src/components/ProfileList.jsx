import React, { useEffect } from "react";
import { useSpring, animated } from "react-spring";
import SVG from "react-inlinesvg";
import classnames from "classnames";

// Icons
import UserIcon from "resources/icons/user.svg";

// Components
import Glass from "components/Glass";

export default function ProfileList({ image, text, clickable, inverted }) {
    // Print Render
    if (process.env.REACT_APP_DEBUGG === "true" && process.env.NODE_ENV !== "production") console.log("%cRender Profile List", "color: grey; font-size: 11px");

    // Scale spring
    const [{ scale }, setScale] = useSpring(() => ({ scale: 0 }));

    // #################################################
    //   COMPONENT MOUNT
    // #################################################

    // On componente mount
    useEffect(() => {
        setScale({ scale: 1 });

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // #################################################
    //   RENDER
    // #################################################

    // Placeholder image if necessary
    if (image) var profileImage = <img src={image} alt="img" className={classnames("image", { clickable }, { inverted })} />;
    else
        profileImage = (
            <div className="container">
                <SVG className="placeholder" src={UserIcon} />
            </div>
        );

    // Invert odd rows
    if (inverted)
        var content = (
            <Glass classes="inverted" style={{ minHeight: "67%", width: "100%", flexDirection: "row", margin: "0em 1em 1em", justifyContent: "flex-end" }}>
                <p className="name">{text}</p>
                {profileImage}
            </Glass>
        );
    else
        content = (
            <Glass style={{ minHeight: "67%", width: "100%", flexDirection: "row", margin: "0em 1em 1em", justifyContent: "flex-start" }}>
                {profileImage}
                <p className="name">{text}</p>
            </Glass>
        );

    return (
        <animated.div className="profileList" style={{ scale }}>
            {content}
        </animated.div>
    );
}
