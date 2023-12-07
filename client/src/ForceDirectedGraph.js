import React, { useEffect, useRef } from 'react';
import * as d3 from "d3";

const ForceDirectedGraph = ({ width = 640, height = 400 }) => {
    const svgRef = useRef(null);

    useEffect(() => {
        const graph = {
            nodes: [
                { id: 0, name: "Myriel", group: 1 },
                { id: 1, name: "Napoleon", group: 1 },
                { id: 2, name: "Mme.Hucheloup", group: 8 }
            ],
            links: [
                { source: 1, target: 0, value: 1 },
                { source: 2, target: 0, value: 8 },
                { source: 1, target: 2, value: 1 }
            ]
        };


        const force = d3.layout.force()
            .charge(-120)
            .linkDistance(30)
            .size([width, height])
            .nodes(graph.nodes)
            .links(graph.links)
            .start();

        const svg = d3.select(svgRef.current);

        const link = svg.selectAll(".link")
            .data(graph.links)
            .enter().append("line")
            .attr("class", "link")
            .style("stroke-width", d => Math.sqrt(d.value));

        const node = svg.selectAll(".node")
            .data(graph.nodes)
            .enter().append("circle")
            .attr("class", "node")
            .attr("r", 5)
            .call(force.drag);

        node.append("title")
            .text(d => d.name);

        force.on("tick", () => {
            link.attr("x1", d => d.source.x)
                .attr("y1", d => d.source.y)
                .attr("x2", d => d.target.x)
                .attr("y2", d => d.target.y);

            node.attr("cx", d => d.x)
                .attr("cy", d => d.y);
        });
    }, []);

    return <svg ref={svgRef} width={width} height={height} />;
};

export default ForceDirectedGraph;
