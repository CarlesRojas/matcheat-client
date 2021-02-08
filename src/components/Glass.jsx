import React from "react";

export default function Glass({ children, style, onClick, classes }) {
    console.log("%cRender Glass");

    // #################################################
    //   RENDER
    // #################################################

    return (
        <div className={`glass ${classes}`} style={style} onClick={onClick}>
            {children}
        </div>
    );
}
