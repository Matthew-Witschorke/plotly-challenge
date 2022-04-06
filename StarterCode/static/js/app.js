function buildPlotly(id) {
    //Reading the data from the json
    d3.json("samples.json").then (sampledata =>{
        console.log(sampledata)

        var samples = sampledata.samples[0].otu_ids;
        console.log(samples)

        var values = sampledata.samples[0].sample_values.slice(0,10).reverse();
        console.log(values)

        //Top 10 otu ids
        var top_ten = ( sampledata.samples[0].otu_ids.slice(0,10)).reverse();
        //Formating for plot
        var top_ten_ids = top_ten.map(d => "OTU" +d);
        console.log(`otu lables: ${top_ten_ids}`)

        //Grabbing the labels for the top 10 
        var top_ten_lables = sampledata.samples[0].otu_labels.slice(0,10);
        console.log(`otu lables: ${top_ten_lables}`)
        
        // creating bar_trace
        
        var bar_trace = {
            x: values,
            y: top_ten_ids,
            text: top_ten_lables,
            type: 'bar',
            orientation: 'h',
        };

        var bar_data = [bar_trace];

        var layout = {
            title: "Top Ten Samples",
            yaxis:{
                tickmode:"linear",
            },
            margin: {
                l: 100,
                r: 100,
                t: 100,
                b: 30
            }
        };
        Plotly.newPlot("bar", bar_data, layout);


        var bubble_trace = {
            x: samples,
            y: values,
            mode: "markers",
            marker:{
                size: values,
                color: samples
            }
        }
        var layout2 = {
            xaxis:{title: "OTU ID"},
            height: 500,
            width:800
        };

        var bubble_data = [bubble_trace]

        Plotly.newPlot("bubble", bubble_data, layout2)
        });

};

function getData(id) {
    d3.json("samples.json").then((data)=> {
        
        var metadata = data.metadata;
        console.log(metadata)

        // filter metadata by id
        var result = metadata.filter(meta => meta.id.toString() === id)[0];
        // Use d3.select  to selct demographic panel to put data
        var demographicInfo = d3.select("#sample-metadata");
        // Emptying table for new data
        demographicInfo.html("");

        // Appending the data into the empty table
        Object.entries(result).forEach((key) => {   
                demographicInfo.append("h5").text(key[0].toUpperCase() + ": " + key[1] + "\n");    
        });
    });
}

//Func. for the change event
function optionChanged(id) {
    buildPlotly(id);
    getData(id);
}

// Func. for data rendering
function init() {
    // select dropdown menu 
    var dropdown = d3.select("#selDataset");

    // Reading the data
    d3.json("samples.json").then((data)=> {
        console.log(data)

        // append id data to dropdown
        data.names.forEach(function(name) {
            dropdown.append("option").text(name).property("value");
        });

        //Displaying plots
        buildPlotly(data.names[0]);
        getData(data.names[0]);
    });
}

init();