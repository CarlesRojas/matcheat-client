import React from "react";

export default function Glass({ children, style, onClick, classes }) {
    console.log("%cRender Glass", "color: grey; font-size: 11px");

    // #################################################
    //   RENDER
    // #################################################

    return (
        <div className={`glass ${classes}`} style={style} onClick={onClick}>
            {children}
        </div>
    );
}
