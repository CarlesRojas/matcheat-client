import React, { useEffect } from "react";
import SVG from "react-inlinesvg";
import gsap from "gsap";
import classnames from "classnames";

// Icons
import UserIcon from "resources/icons/user.svg";

// Components
import Glass from "components/Glass";

export default function ProfileList({ image, text, clickable }) {
    // Print Render
    if (process.env.REACT_APP_DEBUGG === "true" && process.env.NODE_ENV !== "production") console.log("%cRender Profile List", "color: grey; font-size: 11px");

    // #################################################
    //   COMPONENT MOUNT
    // #################################################

    // On componente mount
    useEffect(() => {
        const timeline = gsap.timeline({ defaults: { ease: "power1" } });
        timeline.fromTo(".profileList ", { opacity: 0 }, { opacity: 1, duration: 0.2 }, "+=0.25");

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

    return (
        <div className="profileList">
            <Glass style={{ minHeight: "67%", width: "100%", flexDirection: "row", margin: "0em 1em 1em", justifyContent: "flex-start" }}>
                {profileImage}
                <p className="name">{text}</p>
            </Glass>
        </div>
    );
}
