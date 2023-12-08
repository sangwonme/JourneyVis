import React, { useRef, useEffect } from 'react';
import styles from './TreeDiagram.module.scss';
import * as d3 from 'd3';

const GROUP_NODE = -99

const TreeDiagram = ({ data }) => {
    const d3Container = useRef(null);

    const colormap = {
      'advanced_search': 'red',
      'cited_by': 'blue',
      'same_author': 'green',
      '': 'black'
    }

    useEffect(() => {
        if (data && d3Container.current) {
            const margin = { top: 10, right: 120, bottom: 10, left: 40 },
                  width = 960 - margin.left - margin.right,
                  height = 500 - margin.top - margin.bottom;

            const tree = d3.tree().size([height, width]);
            const root = d3.hierarchy(data, d => d.children);

            tree(root);

            const svg = d3.select(d3Container.current)
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            // Links
            const drawlink = (d) => {
              const sx = d.parent.x
              const sy = d.parent.y
              const ex = d.x
              const ey = d.y
              return `M${sy},${sx}
                   C${sy*(1/2)+ey*(1/2)},${sx}  
                    ${sy*(1/2)+ey*(1/2)},${ex}  
                    ${ey},${ex}`;
            }

            svg.selectAll(".link")
                .data(root.descendants().slice(1))
                .enter().append("path")
                .attr("class", "link")
                .attr("d", drawlink)
                .attr("opacity", (d) => d.parent.data.name == GROUP_NODE ? 0 : 1)
                .attr("stroke", "lightgray")
                .attr("fill", "none")

            // Nodes
            const node = svg.selectAll(".node")
                .data(root.descendants())
                .enter().append("g")
                .attr("class", "node")
                .attr("opacity", (d) => d.data.name == GROUP_NODE ? 0 : 1)
                .attr("stroke", (d) => colormap[d.data.attributes.link_type])
                .attr("fill", "white")
                .attr("transform", function(d) { 
                    return "translate(" + d.y + "," + d.x + ")"; 
                });

            node.append("circle")
                .attr("r", 10);

            // node.append("text")
            //     .attr("dy", ".35em")
            //     .attr("x", d => d.children ? -13 : 13)
            //     .style("text-anchor", d => d.children ? "end" : "start")
            //     .text(d => d.data.name);
        }
    }, [data, d3Container.current]);

    return (
        <svg ref={d3Container} />
    );
}

export default TreeDiagram;
