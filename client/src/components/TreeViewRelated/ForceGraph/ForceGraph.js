import { useD3 } from "./useD3";
import React, {useState} from "react";
import * as d3 from "d3";

function clamp(x, lo, hi) {
  return x < lo ? lo : x > hi ? hi : x;
}

const ForceGraph = ({data}) => {
  const width = 640; // outer width, in pixels
  const height = 400; // outer height, in pixels
  let nodes = data.nodes;
  let links = data.links;


  const ref = useD3((svg) => {
    const nodeId = (d) => d.id;
    const linkSource = ({ source }) => source; // given d in links, returns a node identifier string
    const linkTarget = ({ target }) => target; // given d in links, returns a node identifier string
    const N = d3.map(nodes, nodeId).map(intern);
    const LS = d3.map(links, linkSource).map(intern);
    const LT = d3.map(links, linkTarget).map(intern);
    const nodeGroup = (d) => d.group;
    const G = nodeGroup == null ? null : d3.map(nodes, nodeGroup).map(intern);
    const colors = d3.schemeTableau10; // an array of color strings, for the node groups

    // Create a group element that will hold our graph elements
    const g = svg.append("g");

    // Define the zoom behavior
    const zoom = d3.zoom()
      .scaleExtent([1 / 2, 8])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
      });

    // Apply the zoom behavior to the SVG element
    svg.call(zoom);

    // Replace the input nodes and links with mutable objects for the simulation.
    nodes = d3.map(data.nodes, (_, i) => ({ id: N[i] }));
    links = d3.map(data.links, (_, i) => ({
      source: LS[i],
      target: LT[i]
    }));

    console.log("links: ", links);
    console.log("nodes: ", nodes);

    svg
      .attr("viewBox", [0, 0, width, height])
      .attr("width", width)
      .attr("height", height)
      .attr("style", "background-color: lightgray");



    const link = g.selectAll(".link")
      .data(links)
      .join("line")
      .attr("stroke", 'black')
      .classed("link", true);
    
    const node = g.selectAll(".node")
      .data(nodes)
      .join("circle")
      .attr("r", 12)
      .classed("node", true)
      .classed("fixed", (d) => d.fx !== undefined);


    svg.node();


    // Construct the scales.
    let nodeGroups = d3.sort(G);
    console.log(nodeGroups);
    const color =
      nodeGroup == null ? null : d3.scaleOrdinal(nodeGroups, colors);

    // Construct the forces.
    const forceNode = d3.forceManyBody();
    const forceLink = d3.forceLink(links).id(({ index: i }) => N[i]);

    const simulation = d3
      .forceSimulation(nodes)
      .force("link", forceLink)
      .force("charge", d3.forceManyBody())
      .force("center", d3.forceCenter(width / 2, height / 2))
      .on("tick", tick);

    if (G)
      node.attr("fill", ({ index: i }) => {
        console.log("index: ", i);
        return color(G[i]);
      });

    const drag = d3
      .drag()
      .on("start", dragstart)
      .on("drag", dragged)
      .on("end", dragend);

    node.call(drag);

    function tick() {
      link
        .attr("x1", (d) => d.source.x)
        .attr("y1", (d) => d.source.y)
        .attr("x2", (d) => d.target.x)
        .attr("y2", (d) => d.target.y);
      node.attr("cx", (d) => d.x).attr("cy", (d) => d.y);
    }

    function intern(value) {
      return value !== null && typeof value === "object"
        ? value.valueOf()
        : value;
    }

    function dragstart() {
      d3.select(this).classed("fixed", true);
    }

    function dragend(event, d) {
      if (event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }

    function dragged(event, d) {
      d.fx = clamp(event.x, 0, width);
      d.fy = clamp(event.y, 0, height);
      simulation.alpha(1).restart();
    }
  });

  return (
    <svg
      ref={ref}
      style={{
        marginRight: "0px",
        marginLeft: "0px",
        backgroundColor: "green"
      }}
    >
      <text x="5" y="20">
        d3-react-force-graph-les-miserables
      </text>
      <text x="5" y="40">
        {`${width}x${height}`}
      </text>
    </svg>
  );
};

export default ForceGraph;
