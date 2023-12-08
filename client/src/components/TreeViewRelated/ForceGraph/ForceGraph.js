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
    svg.call(zoom);

    // Replace the input nodes and links with mutable objects for the simulation.
    nodes = d3.map(data.nodes, (_, i) => ({ id: N[i] }));
    links = d3.map(data.links, (_, i) => ({
      source: LS[i],
      target: LT[i]
    }));
    console.log("links: ", links);
    console.log("nodes: ", nodes);

    // -------------------------------------------------------------------------------------
    // draw the svg region 
    svg
      .attr("viewBox", [0, 0, width, height])
      .attr("width", width)
      .attr("height", height)
      .attr("style", "background-color: white");
    // -------------------------------------------------------------------------------------
    // draw link and nodes
    
    // Pre-calculate node positions
    const initialNodePositions = calculateNodePositions(nodes, width, height);

    // Update nodes data with pre-calculated positions
    nodes.forEach((node, index) => {
      node.x = initialNodePositions[index].x;
      node.y = initialNodePositions[index].y;
    });


    const link = g.selectAll(".link")
      .data(links)
      .join("line")
      .attr("x1", d => d.source.x)
      .attr("y1", d => d.source.y)
      .attr("x2", d => d.target.x)
      .attr("y2", d => d.target.y)
      .attr("stroke", 'black');

    const node = g.selectAll(".node")
      .data(nodes)
      .join("circle")
      .attr("cx", d => d.x)
      .attr("cy", d => d.y)
      .attr("r", 12);
    // svg.node();
    // -------------------------------------------------------------------------------------
    // color

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
// -------------------------------------------------------------------------------------
    // drag interaction
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

  function dragstart(event, d) {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  }
  
  function dragged(event, d) {
    d.fx = clamp(event.x, 0, width);
    d.fy = clamp(event.y, 0, height);
  }
  
  function dragend(event, d) {
    if (!event.active) simulation.alphaTarget(0);
    // Optionally, uncomment the following lines if you want nodes to be fixed at their new position after dragging:
    // d.fx = null;
    // d.fy = null;
  }
  });

// -------------------------------------------------------------------------------------

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

// Function to calculate initial node positions
function calculateNodePositions(nodes, width, height) {
  // Implement your logic to calculate positions
  // For example, arrange nodes in a grid or circle
  return nodes.map((node, index) => {
    // Simple example: arrange nodes in a circle
    const angle = (index / nodes.length) * 2 * Math.PI;
    const radius = Math.min(width, height) / 3;
    return {
      x: width / 2 + radius * Math.cos(angle),
      y: height / 2 + radius * Math.sin(angle)
    };
  });
}


export default ForceGraph;