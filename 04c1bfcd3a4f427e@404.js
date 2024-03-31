import define1 from "./a2e58f97fd5e8d7c@756.js";

function _1(md){return(
md`# Visualisation: The impact that diet and food consumption has on the environment`
)}

function _2(md){return(
md`## Hierarchical heatmap`
)}

function _cycles(Inputs){return(
Inputs.range([1, 1000], {label: "mc_run_id", step: 1})
)}

function _selected(navio,sortedData){return(
navio(sortedData, { attribWidth: 25 })
)}

function _5(md){return(
md`# Load dataset. The data was processed as follows using python:
- Drop grouping column
- Scale columns to [0,1] using MinMaxScaler, except mc_run_id,  diet_group, sex, age_group columns`
)}

function _data(FileAttachment){return(
FileAttachment('Results21Mar2022_new_scaled_dataset.csv').csv()
)}

function _7(md){return(
md`## Select only one cycle test to show in a time`
)}

function _cycleData(data,cycles){return(
data.filter((d) => d.mc_run_id == cycles)
)}

function _9(md){return(
md`## After choosing specific mc_run_id, delete this column`
)}

function _newDataset(cycleData){return(
cycleData.map(({mc_run_id, ...rest}) => rest)
)}

function _11(md){return(
md`## Sort dataset by sequence veggie, vegan, fish, meat50, meat, meat100`
)}

function _dietGroupOrder(){return(
{ veggie: 1, vegan: 2, fish: 3, meat50: 4, meat: 5, meat100: 6}
)}

function _sortedData(newDataset,dietGroupOrder){return(
newDataset.sort((a, b) => {
  return dietGroupOrder[a.diet_group] - dietGroupOrder[b.diet_group];
})
)}

function _14(md){return(
md`# Define function`
)}

function _navio(d3,html,navio_npm,Event){return(
async function navio(data, _options = {}) {
   // Define color to category mapping
  const categoricalColors = [
    { color: "#006d2c", label: "Veggie/Female/Age20-29" },
    { color: "#31a354", label: "Vegan/Male/Age30-39" },
    { color: "#74c476", label: "Fish/Age40-49" },
    { color: "#FF9E3D", label: "Meat50/Age50-59" },
    { color: "#FF8000", label: "Meat/Age60-69" },
    { color: "#C26100", label: "Meat100/Age70-79" },
  ];
  const ageCategories = ['20-29', '30-39', '40-49', '50-59', '60-69', '70-79'];
  const sexCategories = ['female', 'male'];
  //const dataMapping = processDataForNavio(data, ageCategories, sexCategories, categoricalColors);
  // const dataMapping = processDataForNavio(data, ageCategories, sexCategories);
  
  const options = {
    height: 600, // Navio's height
    attribs: null, 

    x0: 0, //Where to start drawing navio in x
    y0: 100, //Where to start drawing navio in y, useful if your attrib names are too long
    maxNumDistictForCategorical: 10, // addAllAttribs uses this for deciding if an attribute is categorical (has less than     maxNumDistictForCategorical categories) or ordered
    maxNumDistictForOrdered: 90, // addAllAttribs uses this for deciding if an attribute is ordered (has less than     maxNumDistictForCategorical categories) or text. Use    maxNumDistictForOrdered : Infinity for never choosing Text

    howManyItemsShouldSearchForNotNull: 100, // How many rows should addAllAttribs search to decide guess an attribute type
    margin: 10, // Margin around navio

    levelsSeparation: 40, // Separation between the levels
    divisionsColor: "white", // Border color for the divisions
    levelConnectionsColor: "rgba(205, 220, 163, 0.5)", // Color for the conections between levels
    divisionsThreshold: 4, // What's the minimum row height needed to draw divisions
    fmtCounts: d3.format(",.0d"), // Format used to display the counts on the bottom
    legendFont: "14px sans-serif", // The font for the header
    nestedFilters: true, // Should navio use nested levels?

    showAttribTitles: true, // Show headers?
    attribWidth: 15, // Width of the columns
    attribRotation: -45, // Headers rotation
    attribFontSize: 13, // Headers font size
    attribFontSizeSelected: 32, // Headers font size when mouse over

    filterFontSize: 10, // Font size of the filters explanations on the bottom

    tooltipFontSize: 12, // Font size for the tooltip
    tooltipBgColor: "#b2ddf1", // Font color for tooltip background
    tooltipMargin: 50, // How much to separate the tooltip from the cursor
    tooltipArrowSize: 10, // How big is the arrow on the tooltip

    digitsForText: 2, // How many digits to use for text attributes
  
    addAllAttribsRecursionLevel: Infinity, // How many levels depth do we keep on adding nested attributes
    addAllAttribsIncludeObjects: false, // Should addAllAttribs include objects
    addAllAttribsIncludeArrays: false, // Should addAllAttribs include arrays

    nullColor: "#ffedfd", 
    defaultColorInterpolator: "white",
    defaultColorInterpolatorDate: d3.interpolatePurples,
    defaultColorInterpolatorDiverging: d3.interpolateBrBG,
    defaultColorInterpolatorOrdered: d3.interpolateReds,
    defaultColorInterpolatorText: d3.interpolateGreys,
    defaultColorRangeBoolean: ["#a1d76a", "#e9a3c9", "white"], //true false null
    defaultColorRangeSelected: ["white", "#b5cf6b"],
    defaultColorCategorical: categoricalColors.map(d => d.color), //categoricalColors.map(d => d.color),

    showSelectedAttrib : true, // Display the attribute that shows if a row is selected
    showSequenceIDAttrib : true, // Display the attribute with the sequence ID

    ..._options
  };
  
  const legendWidth = 170; // Adjust the width as needed
  const legendHeight = categoricalColors.length * 30; // Assuming 30px height per legend item
  const legendSvg = d3.create("svg")
    .attr("width", legendWidth)
    .attr("height", legendHeight);

  // Define a scale to position the labels equally spaced
  const xScale = d3.scaleBand()
    .domain(categoricalColors.map(d => d.label))
    .range([0, options.attribWidth * categoricalColors.length])
    .padding(0.2);

  // Draw the colored rectangles for the legend
  legendSvg.selectAll("rect")
    .data(categoricalColors)
    .join("rect")
      .attr("x", 0)
      .attr("y", (d, i) => i * 30) // 30px height per item
      .attr("width", 20) // Width of the rectangle
      .attr("height", 20) // Height of the rectangle
      .attr("fill", d => d.color);
  
  // Add labels to the right of the rectangles
  legendSvg.selectAll("text")
    .data(categoricalColors)
    .join("text")
      .attr("x", 25) // Position text to the right of the rectangle
      .attr("y", (d, i) => i * 30 + 15) // Center text vertically within each rectangle
      .attr("text-anchor", "start")
      .attr("alignment-baseline", "central")
      .attr("fill", "#000")
      .attr("font-size", "12px")
      .text(d => d.label);

  //let div = html`<div style="display:block; overflow-x:scroll"></div>`;
  let div = html`<div style="display:block; overflow-x:scroll; position: relative;"></div>`;
  // Create the Navio visualization inside the div container
  const nv = navio_npm(d3.select(div), options.height);
  
  for (let opt in options) {
    if (opt !== "attribs") {
      nv[opt] = options[opt];
    }
  }

  // Add the data
  nv.data(data);
 
  if (options.attribs) {
    nv.addAllAttribs(options.attribs);
  } else {
    nv.addAllAttribs();
  }

  nv.updateCallback(() => {
    div.value = nv.getVisible();
    div.dispatchEvent(new Event("input", { bubbles: true }));
    // notify(div);
  });

  div.value = data;
  div.nv = nv;

  // Append the legend SVG to the div AFTER the Navio visualization has been created
  div.appendChild(legendSvg.node());
  div.style.height = `${options.height + legendHeight}px`;

  return div;
}
)}

function _16(md){return(
md`# Imports`
)}

function _d3(require){return(
require("d3@7")
)}

function _navio_npm(require){return(
require("navio@0.0.75")
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  function toString() { return this.url; }
  const fileAttachments = new Map([
    ["Results21Mar2022_new_scaled_dataset.csv", {url: new URL("./files/9b2df3595a224f7797fcb2a4b9ad72307514c3ad0340d710edf213deb3615cde5f600d2600ae2b150b2cf2e9410c9fa7cb7a6147d72b797338d18a7cddc728c6.csv", import.meta.url), mimeType: "text/csv", toString}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["md"], _2);
  main.variable(observer("viewof cycles")).define("viewof cycles", ["Inputs"], _cycles);
  main.variable(observer("cycles")).define("cycles", ["Generators", "viewof cycles"], (G, _) => G.input(_));
  main.variable(observer("viewof selected")).define("viewof selected", ["navio","sortedData"], _selected);
  main.variable(observer("selected")).define("selected", ["Generators", "viewof selected"], (G, _) => G.input(_));
  main.variable(observer()).define(["md"], _5);
  main.variable(observer("data")).define("data", ["FileAttachment"], _data);
  main.variable(observer()).define(["md"], _7);
  main.variable(observer("cycleData")).define("cycleData", ["data","cycles"], _cycleData);
  main.variable(observer()).define(["md"], _9);
  main.variable(observer("newDataset")).define("newDataset", ["cycleData"], _newDataset);
  main.variable(observer()).define(["md"], _11);
  main.variable(observer("dietGroupOrder")).define("dietGroupOrder", _dietGroupOrder);
  main.variable(observer("sortedData")).define("sortedData", ["newDataset","dietGroupOrder"], _sortedData);
  main.variable(observer()).define(["md"], _14);
  main.variable(observer("navio")).define("navio", ["d3","html","navio_npm","Event"], _navio);
  main.variable(observer()).define(["md"], _16);
  main.variable(observer("d3")).define("d3", ["require"], _d3);
  const child1 = runtime.module(define1);
  main.import("Table", child1);
  main.variable(observer("navio_npm")).define("navio_npm", ["require"], _navio_npm);
  return main;
}
