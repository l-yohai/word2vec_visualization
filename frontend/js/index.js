var margin = {top: 20, right: 120, bottom: 20, left: 120},
    width = 960 - margin.right - margin.left,
    height = 800 - margin.top - margin.bottom;

var i = 0,
    duration = 750,
    root;

var tree = d3.layout.tree()
    .size([height, width]);

var diagonal = d3.svg.diagonal()
    .projection(function(d) { return [d.y, d.x]; });

var svg = d3.select("body").append("svg")
    //.attr("width", width + margin.right + margin.left)
    .attr("width", '100%')
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


document.getElementById("submit").onclick = function() {
    svg.selectAll("*").remove();
    var word = document.getElementById("word").value;
    var topn = document.getElementById("topn").value;
    //console.log(word);
    if (word == "")
      alert("Please enter a word!");
    else
      visualize(word, topn);
      
}


function createFlare(word, topn, data) {
    
  /*flare = {
"name": "student",
"children": [
{"name": "graduate"},
{"name": "hosei"},
{"name": "daigaku"},
{"name": "college"},
{"name": "rikkyo"},
{"name": "graduated"},
{"name": "doctorate"},
{"name": "cambridge"},
{"name": "sophia"},
{"name": "doctoral"}
]
};*/

  topn = topn;

  flare = "{";

  word = word;

  // Check whether word is in list?
  if (!(word in data)) {
    console.log("Word Not Found!");
    return 0;
  }

  flare += "\"name\": \"" + word + "\",";
  flare += "\"children\": [";

  nearest_words = data[word];

  for (i = 0; i < topn; i++) {
    flare += "{";

    flare += "\"name\": \"" + nearest_words[i]["w"] + "\","; //Before loop 1

    // Loop 1

    flare += "\"children\": [";

    if (!(nearest_words[i]["w"] in data)) {
      if (i != (topn - 1)) {
        flare += "]},";
      }
      else {
        flare += "]}";
      }
      continue;
    }
    else {
      nearest_words_1 = data[nearest_words[i]["w"]];

      for (i1 = 0; i1 < topn; i1++) {
        flare += "{";

        flare += "\"name\": \"" + nearest_words_1[i1]["w"] + "\","; //Before loop 2

        // Loop 2
        flare += "\"children\": [";

        if (!(nearest_words_1[i1]["w"] in data)) {
          if (i1 != (topn - 1)) {
            flare += "]},";
          }
          else {
            flare += "]}";
          }
          continue;
        }
        else {
          nearest_words_2 = data[nearest_words_1[i1]["w"]];

          for (i2 = 0; i2 < topn; i2++) {
            flare += "{";

            flare += "\"name\": \"" + nearest_words_2[i2]["w"] + "\","; //Before loop 3

            // Loop 3
            flare += "\"children\": [";

            if (!(nearest_words_2[i2]["w"] in data)) {
              if (i2 != (topn - 1)) {
                flare += "]},";
              }
              else {
                flare += "]}";
              }
              continue;
            }
            else {
              nearest_words_3 = data[nearest_words_2[i2]["w"]];

              for (i3 = 0; i3 < topn; i3++) {
                flare += "{";

                flare += "\"name\": \"" + nearest_words_3[i3]["w"] + "\","; //Before loop 4

                // Loop 4
                flare += "\"children\": [";

                if (!(nearest_words_3[i3]["w"] in data)) {
                  if (i3 != (topn - 1)) {
                    flare += "]},";
                  }
                  else {
                    flare += "]}";
                  }
                  continue;
                }
                else {
                  nearest_words_4 = data[nearest_words_3[i3]["w"]];

                  for (i4 = 0; i4 < topn; i4++) {
                    flare += "{";

                    flare += "\"name\": \"" + nearest_words_4[i4]["w"] + "\""; //Before loop ?
                    // If this is the final layer --> modify (delete ",")
                    if (i4 != (topn - 1)) {
                      flare += "},";
                    }
                    else {
                      flare += "}";
                    }
                  }
                }
                flare += "]";
                // End Loop 3

                if (i3 != (topn - 1)) {
                  flare += "},";
                }
                else {
                  flare += "}";
                }
              }
            }
            flare += "]";
            // End Loop 3

            if (i2 != (topn - 1)) {
              flare += "},";
            }
            else {
              flare += "}";
            }
          }
        }
        flare += "]";
        // End Loop 2

        if (i1 != (topn - 1)) {
          flare += "},";
        }
        else {
          flare += "}";
        }
      }
    }
    flare += "]";
    // End Loop 1

    if (i != (topn - 1)) {
      flare += "},";
    }
    else {
      flare += "}";
    }

  }

  flare += "]";

  flare += "}";

  return JSON.parse(flare);
}


function visualize(word, topn) {

  word = word;
  topn = topn;

  if (document.getElementById("language").elements["language"].value == "English") {
    if (document.getElementById("metric").value == "Cosine") {
      if (document.getElementById("model").value == "Skipgram")
        data_file = "data/en_data_cosine_skipgram.json";
      else
        data_file = "data/en_data_cosine_cbow.json";
    }
    else {
      if (document.getElementById("model").value == "Skipgram")
        data_file = "data/en_data_euclidean_skipgram.json";
      else
        data_file = "data/en_data_euclidean_cbow.json";
    }
  }
  else {
    if (document.getElementById("metric").value == "Cosine") {
      if (document.getElementById("model").value == "Skipgram")
        data_file = "data/ja_data_cosine_skipgram.json";
      else
        data_file = "data/ja_data_cosine_cbow.json";
    }
    else {
      if (document.getElementById("model").value == "Skipgram")
        data_file = "data/ja_data_euclidean_skipgram.json";
      else
        data_file = "data/ja_data_euclidean_cbow.json";
    }
  }

  d3.json(data_file, function(error, json) {
    if (error) throw error;

    json_data = json;

    root = createFlare(word, topn, json_data);

    // Word Not Found
    if (root == 0) {
      alert("Word Not Found!");
      return;
    }

    root.x0 = height / 2;
    root.y0 = 0;

    function collapse(d) {
      if (d.children) {
        d._children = d.children;
        d._children.forEach(collapse);
        d.children = null;
      }
    }

    root.children.forEach(collapse);
    update(root);

  });

  d3.select(self.frameElement).style("height", "800px");
}

function update(source) {

  // Compute the new tree layout.
  var nodes = tree.nodes(root).reverse(),
      links = tree.links(nodes);

  // Normalize for fixed-depth.
  nodes.forEach(function(d) { d.y = d.depth * 180; });

  // Update the nodes…
  var node = svg.selectAll("g.node")
      .data(nodes, function(d) { return d.id || (d.id = ++i); });

  // Enter any new nodes at the parent's previous position.
  var nodeEnter = node.enter().append("g")
      .attr("class", "node")
      .attr("transform", function(d) { return "translate(" + source.y0 + "," + source.x0 + ")"; })
      .on("click", click);

  nodeEnter.append("circle")
      .attr("r", 1e-6)
      .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });

  nodeEnter.append("text")
      .attr("x", function(d) { return d.children || d._children ? -10 : 10; })
      .attr("dy", ".35em")
      .attr("text-anchor", function(d) { return d.children || d._children ? "end" : "start"; })
      .text(function(d) { return d.name; })
      .style("fill-opacity", 1e-6);

  // Transition nodes to their new position.
  var nodeUpdate = node.transition()
      .duration(duration)
      .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });

  nodeUpdate.select("circle")
      .attr("r", 4.5)
      .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });

  nodeUpdate.select("text")
      .style("fill-opacity", 1);

  // Transition exiting nodes to the parent's new position.
  var nodeExit = node.exit().transition()
      .duration(duration)
      .attr("transform", function(d) { return "translate(" + source.y + "," + source.x + ")"; })
      .remove();

  nodeExit.select("circle")
      .attr("r", 1e-6);

  nodeExit.select("text")
      .style("fill-opacity", 1e-6);

  // Update the links…
  var link = svg.selectAll("path.link")
      .data(links, function(d) { return d.target.id; });

  // Enter any new links at the parent's previous position.
  link.enter().insert("path", "g")
      .attr("class", "link")
      .attr("d", function(d) {
        var o = {x: source.x0, y: source.y0};
        return diagonal({source: o, target: o});
      });

  // Transition links to their new position.
  link.transition()
      .duration(duration)
      .attr("d", diagonal);

  // Transition exiting nodes to the parent's new position.
  link.exit().transition()
      .duration(duration)
      .attr("d", function(d) {
        var o = {x: source.x, y: source.y};
        return diagonal({source: o, target: o});
      })
      .remove();

  // Stash the old positions for transition.
  nodes.forEach(function(d) {
    d.x0 = d.x;
    d.y0 = d.y;
  });
}

// Toggle children on click.
function click(d) {
  if (d.children) {
    d._children = d.children;
    d.children = null;
  } else {
    d.children = d._children;
    d._children = null;
  }
  update(d);
}
