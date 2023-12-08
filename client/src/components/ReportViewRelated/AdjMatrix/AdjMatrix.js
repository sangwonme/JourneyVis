import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

// import data from '../../../data/data.json'

// Sample categories
const categories = ['Category A', 'Category B', 'Category C'];

// Sample data
const data = [
  { index: 0, 'Category A': 10, 'Category B': 5, 'Category C': 2 },
  { index: 1, 'Category A': 3, 'Category B': 8, 'Category C': 7 },
  { index: 2, 'Category A': 6, 'Category B': 1, 'Category C': 4 }
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
        .call(d3.axisBottom(x).tickFormat((d, i) => categories[i]));

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
