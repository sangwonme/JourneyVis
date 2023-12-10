import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

import sim_mat from '../../../data/sim_mat_df.json'
import paper_data from '../../../data/paper_df.json'

const AdjMatrix = ({visPaperID}) => {
  const d3Container = useRef(null);

  // Assuming a width and height for the SVG
  const margin = { top: 20, right: 20, bottom: 50, left: 60 };
  const width = 300 - margin.left - margin.right;
  const height = 300 - margin.top - margin.bottom;

  useEffect(() => {
    if (d3Container.current) {
      
      const categories = visPaperID
      categories.sort((a, b) => a - b);
      
      const filteredData = sim_mat
        .filter(d => visPaperID.includes(d.index)) // Filter rows based on index
        .map(row => {
          // Filter columns for each row
          return visPaperID.reduce((acc, id) => {
            acc[id.toString()] = row[id.toString()];
            return acc;
          }, { index: row.index });
        });
      
      // Band scales for x and y axis
      const x = d3.scaleBand()
        .domain(filteredData.map(d => d.index))
        .rangeRound([0, width])
        .paddingInner(0.05);

      const y = d3.scaleBand()
        .domain(categories)
        .rangeRound([0, height])
        .paddingInner(0.05);

      // Color scale for the counts
      const color = d3.scaleSequential(d3.interpolateBlues)
        .domain([0.4, 1]);

      const xAxis = g => g
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x).tickFormat((d, i) => categories[i]))
        .selectAll("text")
        .style("text-anchor", "end") // Adjust the anchor to the end for better alignment
        .attr("dx", "-.8em") // Adjust these values as needed for your layout
        .attr("dy", ".15em") // Adjust these values as needed for your layout
        .attr("transform", "rotate(-45)"); // Rotate the labels by 45 degrees
      
      const yAxis = g => g
        .call(d3.axisLeft(y).tickFormat((d, i) => categories[i]));


      const svg = d3.select(d3Container.current)
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);


      const make_class = (item) => item.toLowerCase().split(' ').join('_').split('-').join('');
      const make_id = d => `coords_${Math.floor(x(d.xval))}_${Math.floor(y(d.yval))}`;

      const rects = svg.append("g")
        .selectAll("g")
        .data(filteredData)
        .enter().append("g")
        .attr("class", (d, i) => `${i} bar`)
        .selectAll("g")
        .data(d => categories.map(e => { return { 'xval': d.index, 'yval': e, 'count': d[e] } }))
        .enter().append("g")
        .attr("class", (d, i) => `${i} tile`)

      rects.append("rect")
        .attr("x", d => x(d.xval))
        .attr("y", d => y(d.yval))
        .attr("width", x.bandwidth())
        .attr("height", y.bandwidth())
        .style("fill", d => color(d.count))
        .append("title")
        .text(d => d.count);

      rects.append("text")
        .attr("id", d => make_id(d))
        .attr("dy", ".35em")
        .attr("x", d => x(d.xval) + x.bandwidth() / 2)
        .attr("y", d => y(d.yval) + y.bandwidth() / 2)
        .text(d => d.count)
        .style("font-size", "1rem")
        .style("opacity", "0")
        .style("text-anchor", "middle");


      // Add the x-axis
      svg.append("g")
        .attr("class", "x-axis")
        .attr("transform", `translate(0, ${height})`)
        .call(xAxis);

      // Add the y-axis
      svg.append("g")
        .attr("class", "y-axis")
        .call(yAxis);

    }

    return () => {
      if (d3Container.current) {
        d3Container.current.innerHTML = '';
      }
    };
  }, [visPaperID]);

  return (
    <div ref={d3Container}></div>
  );
}

export default AdjMatrix;
