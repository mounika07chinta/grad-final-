const metricSelect = document.getElementById("metricSelect");
const continentSelect = document.getElementById("continentSelect");
const countrySelect = document.getElementById("countrySelect");
const tooltip = document.getElementById("tooltip");
const mapMetricLabel = document.getElementById("mapMetricLabel");

let fullData = [];
let latestSnapshot = [];
let continentSummary = [];
let worldGeo = null;

let selectedCountries = ["India", "United States", "Brazil", "United Kingdom", "Japan"];

const metricLabels = {
  new_cases_smoothed: "New Cases Smoothed",
  new_deaths_smoothed: "New Deaths Smoothed",
  total_vaccinations_per_hundred: "Vaccinations per Hundred"
};

const mapMetricLookup = {
  new_cases_smoothed: "total_cases_per_million",
  new_deaths_smoothed: "total_deaths_per_million",
  total_vaccinations_per_hundred: "total_vaccinations_per_hundred"
};

Promise.all([
  d3.csv("./data/dashboard_data.csv"),
  d3.csv("./data/latest_snapshot.csv"),
  d3.csv("./data/continent_summary.csv"),
  d3.json("./data/countries.geojson")
]).then(([dashboardData, latestData, continentData, geoData]) => {
  fullData = dashboardData.map(d => ({
    ...d,
    date: d3.timeParse("%Y-%m-%d")(d.date),
    total_cases: +d.total_cases,
    new_cases_smoothed: +d.new_cases_smoothed,
    total_deaths: +d.total_deaths,
    new_deaths_smoothed: +d.new_deaths_smoothed,
    total_cases_per_million: +d.total_cases_per_million,
    total_deaths_per_million: +d.total_deaths_per_million,
    people_vaccinated: +d.people_vaccinated,
    people_fully_vaccinated: +d.people_fully_vaccinated,
    total_vaccinations_per_hundred: +d.total_vaccinations_per_hundred
  }));

  latestSnapshot = latestData.map(d => ({
    ...d,
    total_cases: +d.total_cases,
    total_deaths: +d.total_deaths,
    total_cases_per_million: +d.total_cases_per_million,
    total_deaths_per_million: +d.total_deaths_per_million,
    total_vaccinations_per_hundred: +d.total_vaccinations_per_hundred
  }));

  continentSummary = continentData;
  worldGeo = geoData;

  initializeFilters();
  updateDashboard();
});

function initializeFilters() {
  const continents = ["All", ...new Set(fullData.map(d => d.continent).filter(Boolean))];
  continents.forEach(continent => {
    const option = document.createElement("option");
    option.value = continent;
    option.textContent = continent;
    continentSelect.appendChild(option);
  });

  updateCountryOptions();

  metricSelect.addEventListener("change", updateDashboard);
  continentSelect.addEventListener("change", () => {
    updateCountryOptions();
    updateDashboard();
  });
  countrySelect.addEventListener("change", () => {
    selectedCountries = Array.from(countrySelect.selectedOptions).map(opt => opt.value);
    updateDashboard();
  });
}

function updateCountryOptions() {
  const selectedContinent = continentSelect.value;
  const filtered = selectedContinent === "All"
    ? fullData
    : fullData.filter(d => d.continent === selectedContinent);

  const countries = [...new Set(filtered.map(d => d.location))].sort();

  countrySelect.innerHTML = "";
  countries.forEach(country => {
    const option = document.createElement("option");
    option.value = country;
    option.textContent = country;
    if (selectedCountries.includes(country)) {
      option.selected = true;
    }
    countrySelect.appendChild(option);
  });

  selectedCountries = Array.from(countrySelect.selectedOptions).map(opt => opt.value);
}

function updateDashboard() {
  const metric = metricSelect.value;
  drawLineChart(metric);
  updateDetailPanel();
  drawMap(metric);
}

function drawLineChart(metric) {
  d3.select("#lineChart").selectAll("*").remove();

  const margin = { top: 30, right: 30, bottom: 50, left: 70 };
  const width = 900 - margin.left - margin.right;
  const height = 420 - margin.top - margin.bottom;

  const svg = d3.select("#lineChart")
    .append("svg")
    .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  let filtered = fullData.filter(d => selectedCountries.includes(d.location));

  if (continentSelect.value !== "All") {
    filtered = filtered.filter(d => d.continent === continentSelect.value);
  }

  filtered = filtered.filter(d => !isNaN(d[metric]) && d.date);

  if (filtered.length === 0) {
    svg.append("text")
      .attr("x", width / 2)
      .attr("y", height / 2)
      .attr("text-anchor", "middle")
      .text("No data available for selected filters");
    return;
  }

  const grouped = d3.groups(filtered, d => d.location);

  const x = d3.scaleTime()
    .domain(d3.extent(filtered, d => d.date))
    .range([0, width]);

  const y = d3.scaleLinear()
    .domain([0, d3.max(filtered, d => d[metric]) || 1])
    .nice()
    .range([height, 0]);

  const color = d3.scaleOrdinal(d3.schemeTableau10)
    .domain(grouped.map(d => d[0]));

  svg.append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(x));

  svg.append("g")
    .call(d3.axisLeft(y));

  const line = d3.line()
    .x(d => x(d.date))
    .y(d => y(d[metric]));

  grouped.forEach(([country, values]) => {
    svg.append("path")
      .datum(values)
      .attr("fill", "none")
      .attr("stroke", color(country))
      .attr("stroke-width", 2.5)
      .attr("d", line);
  });

  svg.append("text")
    .attr("x", width / 2)
    .attr("y", height + 40)
    .attr("text-anchor", "middle")
    .text("Date");

  svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -height / 2)
    .attr("y", -50)
    .attr("text-anchor", "middle")
    .text(metricLabels[metric]);

  const legend = svg.append("g")
    .attr("transform", `translate(${width - 120}, 0)`);

  grouped.forEach(([country], i) => {
    const row = legend.append("g")
      .attr("transform", `translate(0, ${i * 20})`);

    row.append("rect")
      .attr("width", 12)
      .attr("height", 12)
      .attr("fill", color(country));

    row.append("text")
      .attr("x", 18)
      .attr("y", 10)
      .attr("font-size", "12px")
      .text(country);
  });
}

function updateDetailPanel() {
  const detailDiv = document.getElementById("countryDetail");

  if (selectedCountries.length === 0) {
    detailDiv.innerHTML = "<p>No country selected.</p>";
    return;
  }

  const firstCountry = selectedCountries[0];
  const countryLatest = latestSnapshot.find(d => d.location === firstCountry);

  if (!countryLatest) {
    detailDiv.innerHTML = "<p>No data available for selected country.</p>";
    return;
  }

  detailDiv.innerHTML = `
    <h3>${countryLatest.location}</h3>
    <p><strong>Continent:</strong> ${countryLatest.continent || "N/A"}</p>
    <p><strong>Total Cases:</strong> ${formatNumber(countryLatest.total_cases)}</p>
    <p><strong>Total Deaths:</strong> ${formatNumber(countryLatest.total_deaths)}</p>
    <p><strong>Total Cases per Million:</strong> ${formatNumber(countryLatest.total_cases_per_million)}</p>
    <p><strong>Total Deaths per Million:</strong> ${formatNumber(countryLatest.total_deaths_per_million)}</p>
    <p><strong>Vaccinations per Hundred:</strong> ${formatNumber(countryLatest.total_vaccinations_per_hundred)}</p>
  `;
}

function drawMap(metric) {
  d3.select("#map").selectAll("*").remove();

  const width = 850;
  const height = 420;

  const svg = d3.select("#map")
    .append("svg")
    .attr("viewBox", `0 0 ${width} ${height}`);

  const projection = d3.geoNaturalEarth1()
    .fitSize([width, height], worldGeo);

  const path = d3.geoPath().projection(projection);

  const mapMetric = mapMetricLookup[metric];

  // Update HTML label instead of drawing text inside SVG
  mapMetricLabel.textContent = `Map Metric (latest value): ${mapMetric.replaceAll("_", " ")}`;

  const values = latestSnapshot
    .map(d => d[mapMetric])
    .filter(v => !isNaN(v));

  const colorScale = d3.scaleSequential()
    .domain([0, d3.max(values) || 1])
    .interpolator(d3.interpolateBlues);

  const dataByCountry = new Map(
    latestSnapshot.map(d => [normalizeName(d.location), d])
  );

  svg.selectAll("path")
    .data(worldGeo.features)
    .join("path")
    .attr("d", path)
    .attr("fill", d => {
      const countryName = getGeoCountryName(d);
      const row = dataByCountry.get(normalizeName(countryName));
      return row && !isNaN(row[mapMetric]) ? colorScale(row[mapMetric]) : "#e0e0e0";
    })
    .attr("stroke", "#999")
    .attr("stroke-width", 0.5)
    .on("mouseover", function(event, d) {
      const countryName = getGeoCountryName(d);
      const row = dataByCountry.get(normalizeName(countryName));
      tooltip.style.visibility = "visible";
      tooltip.innerHTML = row
        ? `<strong>${row.location}</strong><br>${metricLabels[metric]} map value: ${formatNumber(row[mapMetric])}`
        : `<strong>${countryName}</strong><br>No data`;
      tooltip.style.left = (event.pageX + 10) + "px";
      tooltip.style.top = (event.pageY - 20) + "px";
    })
    .on("mousemove", function(event) {
      tooltip.style.left = (event.pageX + 10) + "px";
      tooltip.style.top = (event.pageY - 20) + "px";
    })
    .on("mouseout", function() {
      tooltip.style.visibility = "hidden";
    })
    .on("click", function(event, d) {
      const countryName = getGeoCountryName(d);
      const row = dataByCountry.get(normalizeName(countryName));
      if (row) {
        selectedCountries = [row.location];
        updateCountryOptions();
        updateDashboard();
      }
    });
}

function getGeoCountryName(feature) {
  return feature.properties.ADMIN ||
         feature.properties.name ||
         feature.properties.NAME ||
         feature.properties.Country ||
         "Unknown";
}

function normalizeName(name) {
  if (!name) return "";
  return name
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9 ]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function formatNumber(value) {
  if (value == null || isNaN(value)) return "N/A";
  return d3.format(",.2f")(value);
}