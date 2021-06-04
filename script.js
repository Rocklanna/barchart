const req = new XMLHttpRequest();
var fullInfo;
const w = 1000;
const h = 500;
const padding = 50;

req.open("GET", "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json", "true");
req.send();
req.onload = function () {
  fullInfo = JSON.parse(req.responseText);
  document.getElementById('title').innerHTML = fullInfo["source_name"];
  var parseTime = d3.timeParse("%Y-%m-%d");

  var barData = fullInfo["data"];
  var gdp = barData.map(item => item[1]);
  barData = barData.map(item => [parseTime(item[0]), item[1]]);

  const domainX = d3.extent(barData, d => d[0]);
  const domainY = d3.extent(barData, d => d[1]);

  const xScale = d3.scaleTime().
  domain(domainX).
  range([padding, w - padding]);

  const yScale = d3.scaleLinear().
  domain([0, domainY[1]]).
  range([h - padding, 0]);

  const scaleYData = d3.scaleLinear().
  domain([0, domainY[1]]).
  range([0, h - padding]);

  gdp = gdp.map(item => scaleYData(item));
  const xAxis = d3.axisBottom(xScale);
  const yAxis = d3.axisLeft(yScale);

  var tooltip = d3.select("#container").
  append("div").
  attr("id", "tooltip");


  var svg = d3.select("#graph").
  append("svg").
  attr("width", w).
  attr("height", h).
  attr("class", "svgColor");

  svg.append("g").
  attr("id", "x-axis").
  attr("transform", "translate(0," + (h - padding) + ")").
  attr("class", "tick").
  call(xAxis);


  svg.append("g").
  attr("id", "y-axis").
  attr("transform", "translate(" + padding + ", 0)").
  attr("class", "tick").
  call(yAxis);


  svg.append("text").
  attr("transform", "translate(" + padding * 2 + "," + padding + ") rotate(-90)").
  attr("text-anchor", "end").
  text("Gross Domestic Product");

  svg.append("text").
  attr("transform", "translate(" + (w - padding) + "," + (h - 5) + ")").
  attr("text-anchor", "end").
  text("More Information: http://www.bea.gov/national/pdf/nipaguid.pdf");

  svg.selectAll("rect").
  data(barData).
  enter().
  append("rect").
  attr("data-date", (d, i) => JSON.stringify(d[0]).substring(1, 11)).
  attr("data-gdp", (d, i) => d[1]).
  attr("x", (d, i) => xScale(d[0])).
  attr("y", (d, i) => h - scaleYData(d[1]) - padding).
  attr("width", 3).
  attr("height", (d, i) => scaleYData(d[1])).
  attr("class", "bar").
  on("mouseover", function (event, d) {
    tooltip.attr("data-date", JSON.stringify(d[0]).substring(1, 11)).
    style("visibility", "visible").
    style("opacity", "1").
    style("top", event.pageY + "px").
    style("left", event.pageX + "px").

    html(JSON.stringify(d[0]).substring(1, 5) +
    "<br>" +
    "$" + d[1].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + " Billion");
  }).
  on("mouseout", function () {
    tooltip.style("visibility", "hidden");
  });



  console.log(JSON.stringify(barData));
  console.log(JSON.stringify(gdp));
  console.log("here I am");
  console.log(JSON.stringify(domainX) + "NOW");
  console.log(JSON.stringify(domainY));
  console.log(JSON.stringify(scaleYData(barData[0][1])) + " " + barData[0][1]);

};