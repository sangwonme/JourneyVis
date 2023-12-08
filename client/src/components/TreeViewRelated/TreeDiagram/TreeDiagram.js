import React, { useRef, useEffect, useState} from 'react';
import styles from './TreeDiagram.module.scss';
import * as d3 from 'd3';

const GROUP_NODE = -99

const TreeDiagram = ({ data }) => {
    const d3Container = useRef(null);
    const containerRef = useRef(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    const [selNodeID, setSelNodeID] = useState([]);

    const colormap = {
      'advanced_search': 'red',
      'cited_by': 'blue',
      'same_author': 'green',
      '': 'black'
    }

    const [selNum, setSelNum] = useState(0);

    useEffect(() => {
      console.log("Selected Node IDs:", selNodeID);
    }, [selNodeID]);

    useEffect(() => {
        if (containerRef.current) {
            // Get the dimensions of the parent div
            const { width, height } = containerRef.current.getBoundingClientRect();
            setDimensions({ width, height });
        }
    }, []);

    useEffect(() => {
        if (data && d3Container.current && dimensions.width && dimensions.height) {
          
          const root = d3.hierarchy(data, d => d.children);

          const rootNum = root.children.length;
          
          // TODO
          const margin = { top: 0, right: 120, bottom: 200, left: 0 },
          width = dimensions.width - margin.left - margin.right,
          height = 300*rootNum - margin.top - margin.bottom;
          const tree = d3.tree().size([height/2, width]);
          tree(root);
          
          const svg = d3.select(d3Container.current)
              .attr("width", width + margin.left + margin.right)
              .attr("height", height + margin.top + margin.bottom)
              .append("g")
              .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


          // Calculate the actual position of the nodes, including margin
          root.each(d => {
            d.x = d.x + margin.top;
            d.y = d.y + margin.left;
          });
          
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

          // brush
          const circle = d3.selectAll('circle');
          console.log(circle)
          const brush = d3.brush()
                    .extent([[0, 0], [dimensions.width, dimensions.height]])
                    .on("start brush end", brushed);
          svg.append('g')
              .attr('transform', `translate(${margin.top}, ${margin.left})`)
              .call(brush);
          
          function brushed({selection}){
            if(selection === null){
              circle.attr("fill", 'white')
              setSelNum(0);
              setSelNodeID([]);
            }else{
              let [[x0, y0], [x1, y1]] = selection;
              circle.classed("selected", d => {
                let xCoord = d.y;
                let yCoord = d.x;
                return x0 <= xCoord && xCoord <= x1
                    && y0 <= yCoord && yCoord <= y1;
              })
              circle.attr("fill", 'white')
              const newSelNodeIDs = [];
              d3.selectAll('.selected')
                    .attr("fill", (d) => colormap[d.data.attributes.link_type])
                    .each(function(d){
                      newSelNodeIDs.push(d.data.attributes.id);
                    })
              setSelNodeID(newSelNodeIDs);
              
              setSelNum(d3.selectAll('.selected')['_groups'][0].length)
            }
          }

        }
    }, [data, d3Container.current, dimensions]);

    return (
      <div ref={containerRef} style={{width: '100%', height: '100%'}}>
        <svg ref={d3Container} />
      </div>
    );
}

export default TreeDiagram;
