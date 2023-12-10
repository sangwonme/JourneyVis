import React, { useRef, useEffect, useState} from 'react';
import styles from './TreeDiagram.module.scss';
import * as d3 from 'd3';

import paper_data from '../../../data/paper_df.json';

const GROUP_NODE = -99

const TreeDiagram = ({ data, selNodeID, setSelNodeID }) => {
    const d3Container = useRef(null);
    const containerRef = useRef(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    
    const colormap = {
      'advanced_search': 'red',
      'cited_by': 'blue',
      'same_author': 'green',
      '': 'black'
    }

    const [selNum, setSelNum] = useState(0);

    const brushRef = useRef(); 

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
          const margin = { top: 0, right: 120, bottom: 40, left: 0 },
          width = dimensions.width - margin.left - margin.right,
          height = 100*rootNum - margin.top - margin.bottom;
          const tree = d3.tree().size([height, width]);
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

          // node size
          const paper_nums = root.descendants().map(d => (d.data.attributes.papers_num) || 0);

          let sizeScale = d3.scaleLinear()
                            .domain([d3.min(paper_nums), d3.max(paper_nums)])
                            .range([7, 16]);
          
          node.append("circle")
              .attr("r", (d) => sizeScale(d.data.attributes.papers_num || 0));


              node.append("text")
                  .attr("dx", "0") // Offset the text a bit to the right of the circle
                  .attr("dy", "2.5em") // Center the text vertically
                  .text(function(d) {
                    // text label of nodes
                    const link_type = d.data.attributes.link_type
                    if(link_type == 'same_author'){
                      return 'A' + d.data.attributes.id + ":" + paper_data[d.data.attributes.seedpaper_id].title.slice(0, 3) + '...'
                    }
                    else if(link_type == 'cited_by'){
                      return 'A' + d.data.attributes.id + ":" + paper_data[d.data.attributes.seedpaper_id].title.slice(0, 3) + '...'
                    }else{
                      return 'A' + d.data.attributes.id + ":" + d.data.attributes.query.slice(0, 3) + '...'
                    }
                  })
                  .style("font-size", "10px")
                  .style("fill", "black")
                  .attr('stroke', 'none')


          // Initialize the brush only once and store it in the brushRef
          if (!brushRef.current) {
            brushRef.current = d3.brush()
                .extent([[0, 0], [width+margin.right, height]])
                .on("start brush end", brushed);
          }

          svg.append('g')
            .attr('transform', `translate(${margin.top}, ${margin.left})`)
            .call(brushRef.current); // Use the brushRef here

          // brush
          const circle = d3.selectAll('circle');
          
          function brushed({ selection }) {
            if (selection === null) {
              if (selNum !== 0) setSelNum(0);
              if (selNodeID.length !== 0) setSelNodeID([]);
            } else {
              let [[x0, y0], [x1, y1]] = selection;
              const newSelNodeIDs = [];
              circle.classed("selected", d => {
                let xCoord = d.y;
                let yCoord = d.x;
                return x0 <= xCoord && xCoord <= x1
                    && y0 <= yCoord && yCoord <= y1;
              });
              circle.attr("fill", 'white')
              d3.selectAll('.selected')
                .attr("fill", (d) => colormap[d.data.attributes.link_type])
                .each(function(d){
                  newSelNodeIDs.push(d.data.attributes.id);
                });
              
              newSelNodeIDs.sort((a, b) => a - b);
              if (JSON.stringify(newSelNodeIDs) !== JSON.stringify(selNodeID)) {
                setSelNodeID(newSelNodeIDs);
              }
              
              const newSelNum = d3.selectAll('.selected').size();
              if (newSelNum !== selNum) {
                setSelNum(newSelNum);
              }
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