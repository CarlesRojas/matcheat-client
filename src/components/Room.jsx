import React, { useRef, useEffect } from "react";
import * as d3 from "d3";

// Components
import Profile from "components/Profile";

// Constants
const SCREEN_WIDTH = window.innerWidth;

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

    const roomRef = useRef(null);
    const simulation = useRef(null);

    function dragstarted(event, d) {
        simulation.current.alphaTarget(0.03).restart();
        d.fx = d.x;
        d.fy = d.y;
    }

    function dragged(event, d) {
        d.fx = event.x;
        d.fy = event.y;
    }

    function dragended(event, d) {
        simulation.current.alphaTarget(0.03);
        d.fx = null;
        d.fy = null;
    }

    // #################################################
    //   COMPONENT MOUNT
    // #################################################

    // On componente mount
    useEffect(() => {
        const roomSize = roomRef.current.getBoundingClientRect();

        simulation.current = d3
            .forceSimulation()
            .velocityDecay(0.2)
            .force("x", d3.forceX().strength((roomSize.height * 0.1) / roomSize.width))
            .force("y", d3.forceY().strength(0.1))
            .force(
                "collide",
                d3
                    .forceCollide()
                    .radius(SCREEN_WIDTH * 0.12)
                    .iterations(10)
            )
            .force(
                "center",
                d3
                    .forceCenter()
                    .x(roomSize.width * 0.5)
                    .y(roomSize.height * 0.5)
            )
            .force(
                "charge",
                d3.forceManyBody().strength((d, i) => (i ? 0 : (-roomSize.width * 2) / 3))
            );

        var nodes = d3
            .selectAll(".profileContainer")
            .data(data.current)
            .style("transform", function (d) {
                var size = this.getBoundingClientRect();
                return `translate(${d.x - size.width * 0.5}px, ${d.y - size.height * 0.5}px)`;
            })
            .call(d3.drag().on("start", dragstarted).on("drag", dragged).on("end", dragended));

        simulation.current.nodes(data.current).on("tick", function (d) {
            nodes.style("transform", function (d) {
                var size = this.getBoundingClientRect();
                return `translate(${d.x - size.width * 0.5}px, ${d.y - size.height * 0.5}px)`;
            });
        });

        return () => {};

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // #################################################
    //   RENDER
    // #################################################

    const profiles = data.current.map((elem, i) => (
        <div className="profileContainer" key={i}>
            <Profile image={elem.image} text={elem.username} size={SCREEN_WIDTH * 0.05} clickable={false} />
        </div>
    ));
    return (
        <div id="room" className="room" ref={roomRef}>
            {profiles}
        </div>
    );
}
