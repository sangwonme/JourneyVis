import React from "react";
import * as d3 from "d3";

export const useD3 = (renderChartFn, dependencies) => {
  const ref = React.useRef();

  React.useEffect(() => {
    // Clear the content of the SVG element
    const svg = d3.select(ref.current);
    svg.selectAll("*").remove(); 

    renderChartFn(svg);

    // Optionally, you can return a cleanup function here if needed
    return () => {
      // any cleanup logic goes here
    };
  }, dependencies);

  return ref;
};
