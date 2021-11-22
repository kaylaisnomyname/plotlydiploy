function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    console.log(data);
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {

  d3.json("samples.json").then((data) => {
  
  // 3. Create a variable that holds the samples array. 
      let samples = data.samples;
      console.log(samples);
 
      // 4. Create a variable that filters the samples for the object with the desired sample number.
      var resultSample = samples.filter(sampleObject => sampleObject.id == sample);

      //  5. Create a variable that holds the first sample in the array.
      let result = resultSample[0];

      // D3. 1. Create a variable that filters the metadata array for the object with the desired sample number.
      let metaDatas = data.metadata;
      // D3. 2. Create a variable that holds the first sample in the metadata array.
      var sampleMetadata = metaDatas.filter(metadataObject => metadataObject.id == sample)[0];

      // D3. 3. Create a variable that holds the washing frequency.
      var sampleWfreq = sampleMetadata.wfreq;
      
      // check selected sample:
      console.log("The selected sample id is: " + sample);
      console.log("weekly wash frequency is: " + sampleWfreq);

      // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
      let samplevalues = result.sample_values;
      let otuids = result.otu_ids;
      let otulabels = result.otu_labels;      
      
      // 7. Create the yticks for the bar chart.
      // Hint: Get the the top 10 otu_ids and map them in descending order  
      //  so the otu_ids with the most bacteria are last. 

      var yticks = otuids.map(yvalue => `OTU ` + yvalue).slice(0,10).reverse();

      //console.log(yticks);

      // 8. Create the trace for the bar chart. 
      var barData = [{
      x: samplevalues.slice(0,10).reverse(),
      y: yticks,
      type: "bar",
      orientation: "h",
      text: otulabels.slice(0,10).reverse(),
      marker: {color: samplevalues.slice(0,10).reverse(), colorscale: "Portland"}
      }];
      // 9. Create the layout for the bar chart. 
      var barLayout = {
      title: "Top 10 Bacteria Cultures Found",
     
      };
      // 10. Use Plotly to plot the data with the layout. 
      Plotly.newPlot("bar", barData, barLayout);

      //  Bubble charts
      // 1. Create the trace for the bubble chart.
      var bubbleData = [{
        x: otuids,
        y: samplevalues,
        text: otulabels,
        mode: "markers",
        marker: {
            size: samplevalues,
            color: otuids,
            colorscale: "Portland"
        }
      }];
  
      // 2. Create the layout for the bubble chart.
      var bubbleLayout = {
          title: "Bacteria Cultures Per Sample",
          xaxis: {title: "OTU ID"},
          autosize: true,
          hovermode: true
      };
  
      // 3. Use Plotly to plot the data with the layout.
      Plotly.newPlot("bubble", bubbleData, bubbleLayout); 

      // gauge chart
      var gaugeData = [{
        domain: {x:[0,1], y:[0,1]},
        value: sampleWfreq,
        title: {text: "<span style='font-weight:bold'>Belly Button Washing Frequency</span><br><span>Scrubs per Week</span>"},
        type: "indicator",
        mode: "gauge+number",
        gauge: { 
            axis: { range: [null, 10], tickwidth: 2, "visible":true},
            bar: {color: "black"},
            steps: [
                {range: [0,2], color: "red"},
                {range: [2,4], color: "orange"},
                {range: [4,6], color: "yellow"},
                {range: [6,8], color: "lime"},
                {range: [8,10], color: "green"}
            ]
        }
      }];
    
      // 5. Create the layout for the gauge chart.
      var gaugeLayout = { 
          width: 450,
          height: 350
      };
    
      // 6. Use Plotly to plot the gauge data and layout.
      Plotly.newPlot("gauge", gaugeData, gaugeLayout);

  });
};
