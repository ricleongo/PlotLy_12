function buildMetadata(sample) {

  d3.json(`/metadata/${sample}`).then((response) => {
    d3.select("#metaAge").select("em").remove();
    d3.select("#metaType").select("em").remove();
    d3.select("#metaEthni").select("em").remove();
    d3.select("#metaGender").select("em").remove();
    d3.select("#metaLocation").select("em").remove();
    d3.select("#metaFreq").select("em").remove();
    d3.select("#metaSample").select("em").remove();

    d3.select("#metaAge")
      .append("em")
      .html(response.AGE)

    d3.select("#metaType")
      .append("em")
      .html(response.BBTYPE);

    d3.select("#metaEthni")
      .append("em")
      .html(response.ETHNICITY);

    d3.select("#metaGender")
      .append("em")
      .html(response.GENDER);

    d3.select("#metaLocation")
      .append("em")
      .html(response.LOCATION);

      d3.select("#metaFreq")
      .append("em")
      .html(response.WFREQ);

      d3.select("#metaSample")
      .append("em")
      .html(response.sample);

    buildGauge(response.WFREQ);
  });

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
    // Use d3 to select the panel with id of `#sample-metadata`

    // Use `.html("") to clear any existing metadata

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.

    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
}

function buildCharts(sample) {

  d3.json(`/samples/${sample}`).then((response) => {

    const data = [{
      values: response.sample_values.slice(0, 10),
      labels: response.otu_ids.slice(0, 10),
      text: response.otu_labels.slice(0, 10),
      textinfo: 'percent',
      hoverinfo: 'label+text+value+percent',
      type: 'pie'
    }];
    
    const layout = {
      autosize: true,
      margin: {
        l: 0,
        r: 0,
        b: 0,
        t: 0,
        pad: 4
      }
    };

    Plotly.newPlot("plotlyPie", data, layout);


    const trace1 = {
      x: response.otu_ids,
      y: response.sample_values,
      text: response.otu_labels,
      mode: 'markers',
      marker: {
        color: response.otu_ids,
        size: response.sample_values
      }
    };

    const data2 = [trace1];

    const layout2 = {
      title: 'Marker Size',
      showlegend: false,
      height: 600,
      width: 1140
    };

    Plotly.newPlot('plotlyBubble', data2, layout2);
  })
  // @TODO: Use `d3.json` to fetch the sample data for the plots

    // @TODO: Build a Bubble Chart using the sample data

    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector.append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });

  selector.on("change", () => {
    const nextSample = selector.property("value");
    buildCharts(nextSample);
    buildMetadata(nextSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}