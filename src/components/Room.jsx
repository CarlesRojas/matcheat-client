import React, { useRef, useEffect } from "react";

// Components
import ProfileList from "components/ProfileList";

export default function Room() {
    const data = useRef([
        {
            username: "carles",
            image: "https://matcheat.s3.amazonaws.com/2021-02-10T20:17:51.705Z_Pinya.png",
        },
        {
            username: "carles",
            image: "https://matcheat.s3.amazonaws.com/2021-02-10T20:17:51.705Z_Pinya.png",
        },
        {
            username: "carles",
            image: "https://matcheat.s3.amazonaws.com/2021-02-10T20:17:51.705Z_Pinya.png",
        },
        {
            username: "carles",
            image: "https://matcheat.s3.amazonaws.com/2021-02-10T20:17:51.705Z_Pinya.png",
        },
        {
            username: "carles",
            image: "https://matcheat.s3.amazonaws.com/2021-02-10T20:17:51.705Z_Pinya.png",
        },
        {
            username: "carles",
            image: "https://matcheat.s3.amazonaws.com/2021-02-10T20:17:51.705Z_Pinya.png",
        },
        {
            username: "carles",
            image: "https://matcheat.s3.amazonaws.com/2021-02-10T20:17:51.705Z_Pinya.png",
        },
        {
            username: "carles",
            image: "https://matcheat.s3.amazonaws.com/2021-02-10T20:17:51.705Z_Pinya.png",
        },
        {
            username: "carles",
            image: "https://matcheat.s3.amazonaws.com/2021-02-10T20:17:51.705Z_Pinya.png",
        },
        {
            username: "carles",
            image: "https://matcheat.s3.amazonaws.com/2021-02-10T20:17:51.705Z_Pinya.png",
        },
    ]);
    // #################################################
    //   COMPONENT MOUNT
    // #################################################

    // On componente mount
    useEffect(() => {
        return () => {};

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // #################################################
    //   RENDER
    // #################################################

    const users = data.current.map(({ username, image }, i) => <ProfileList key={i} image={image} text={username} clickable={false} />);

    return (
        <div id="room" className="room">
            <div className="profileContainer">{users}</div>
        </div>
    );
}
