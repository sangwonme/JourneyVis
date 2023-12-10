import React, { useEffect, useRef, useMemo, useState } from 'react';
import * as d3 from 'd3';
import cloud from 'd3-cloud';
import seedrandom from 'seedrandom';

import paper_data from '../../../data/paper_df.json'

function getWordFrequencies(text) {
  // Convert the text to lowercase and replace all non-alphabetic characters with spaces
  const wordsArray = text.toLowerCase().replace(/[^a-zA-Z ]/g, " ").split(/\s+/);

  const frequencies = wordsArray.reduce((count, word) => {
    if (word.length > 0 && !stopwords.includes(word)) { // Exclude stopwords and empty strings
      count[word] = (count[word] || 0) + 1;
    }
    return count;
  }, {});

  return Object.keys(frequencies).map(word => ({
    text: word,
    size: frequencies[word], // Size can be based on the frequency
  }));
}

// Example list of stopwords. You can add more or use a stopwords package.
const stopwords = ["the", "and", "a", "to", "of", "in", "i", "is", "that", "it", "on", "you", "this", "for", "but", "with", "are", "have", "be", "at", "or", "as", "was", "so", "if", "out", "not", "from", "s", "us", "we", "paper", "work"];

const WordCloud = ({visPaperID}) => {
  const ref = useRef();

  const width = 260;
  const height = 260;

  Math.random = seedrandom('myrandomseed');

  useEffect(() => {

    let longText = ''
    visPaperID.forEach((id) => {
      longText += paper_data[id].title
      longText += paper_data[id].abstract
    })

    const words = getWordFrequencies(longText)

    const sizeScale = d3.scaleLinear()
      .domain([d3.min(words, w => w.size), d3.max(words, w => w.size)])
      .range([10, 100]); // Set min and max font size

    const layout = cloud()
      .size([width, height])
      .words(words.map(word => ({...word, size: sizeScale(word.size)})))
      .padding(5)
      .rotate(0)
      .font("Impact")
      .fontSize(d => d.size)
      // .random(Math.random)
      .on("end", draw);

    layout.start();

    function draw(words) {
      d3.selectAll(".cloud").remove()

      const svg = d3.select(ref.current)
        .attr("width", layout.size()[0])
        .attr("height", layout.size()[1]);

      const group = svg.append("g")
        .attr("transform", `translate(${layout.size()[0] / 2},${layout.size()[1] / 2})`)
        .attr("class", "cloud");

      group.selectAll("text")
        .data(words)
        .enter().append("text")
        .style("font-size", d => `${d.size}px`)
        .style("font-family", "Impact")
        .attr("text-anchor", "middle")
        .attr("transform", d => `translate(${[d.x, d.y]})rotate(${d.rotate})`)
        .text(d => d.text);
    }
  }, [visPaperID]); 

  return <svg ref={ref} />;
}

export default WordCloud;
