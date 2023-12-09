import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

// import data from '../../../data/data.json'

const categories = ['Category A', 'Category B', 'Category C', 'Category D', 'Category E', 'Category F', 'Category G'];

const data = [
  { index: 0, 'Category A': 0.10, 'Category B': 0.5, 'Category C': 0.2, 'Category D': 0.3, 'Category E': 0.4, 'Category F': 0.8, 'Category G': 0.6 },
  { index: 1, 'Category A': 0.3, 'Category B': 0.8, 'Category C': 0.7, 'Category D': 0.5, 'Category E': 0.6, 'Category F': 0.2, 'Category G': 0.1 },
  { index: 2, 'Category A': 0.6, 'Category B': 0.1, 'Category C': 0.4, 'Category D': 0.7, 'Category E': 0.8, 'Category F': 0.3, 'Category G': 0.2 },
  { index: 3, 'Category A': 0.2, 'Category B': 0.4, 'Category C': 0.8, 'Category D': 0.6, 'Category E': 0.1, 'Category F': 0.7, 'Category G': 0.5 },
  { index: 4, 'Category A': 0.1, 'Category B': 0.7, 'Category C': 0.3, 'Category D': 0.2, 'Category E': 0.5, 'Category F': 0.6, 'Category G': 0.4 },
  { index: 5, 'Category A': 0.7, 'Category B': 0.2, 'Category C': 0.6, 'Category D': 0.1, 'Category E': 0.3, 'Category F': 0.4, 'Category G': 0.8 },
  { index: 6, 'Category A': 0.4, 'Category B': 0.6, 'Category C': 0.5, 'Category D': 0.8, 'Category E': 0.2, 'Category F': 0.1, 'Category G': 0.7 }
];


const AdjMatrix = () => {
  const d3Container = useRef(null);

  // Assuming a width and height for the SVG
  const margin = { top: 20, right: 20, bottom: 50, left: 60 };
  const width = 300 - margin.left - margin.right;
  const height = 300 - margin.top - margin.bottom;

  useEffect(() => {
    if (d3Container.current) {
      
      // Band scales for x and y axis
      const x = d3.scaleBand()
        .domain(data.map(d => d.index))
        .rangeRound([0, width])
        .paddingInner(0.05);

      const y = d3.scaleBand()
        .domain(categories)
        .rangeRound([0, height])
        .paddingInner(0.05);

      // Color scale for the counts
      const color = d3.scaleSequential(d3.interpolateBlues)
        .domain([0, d3.max(data, d => d3.max(categories, category => d[category]))]);

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
        .data(data)
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
  }, []);

  return (
    <div ref={d3Container}></div>
  );
}

export default AdjMatrix;
