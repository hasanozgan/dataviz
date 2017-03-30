// https://www.materialui.co/colors

// Dimensions of sunburst.
var width = 750;
var height = 600;
var radius = Math.min(width, height) / 2;

// Breadcrumb dimensions: width, height, spacing, width of tip/tail.
var b = {
  w: 105, h: 30, s: 3, t: 10
};

// Mapping of step names to colors.
var colors = {
  "male": "#1565C0",
  "female": "#EF6C00",

  "male-50": "#64B5F6",
  "male-100": "#42A5F5",
  "male-150": "#2196F3",
  "male-200": "#1E88E5",
  "male-1000": "#1976D2",

  "female-50": "#FFB74D",
  "female-100": "#FFA726",
  "female-150": "#FF9800",
  "female-200": "#FB8C00",
  "female-1000": "#F57C00",

  "male-healthcare": "#0288D1",
  "male-education": "#039BE5",
  "male-stem": "#03A9F4",
  "male-retail": "#039BE5",
  "male-transportation": "#03A9F4",
  "male-lawnsecurity": "#29B6F6",
  "male-realestate": "#4FC3F7",
  "male-services": "#81D4FA",
  "male-whitecolar": "#B3E5FC",
  "male-publicservices": "#80D8FF",


  "female-healthcare": "#FFA000",
  "female-education": "#FFB300",
  "female-stem": "#FFC107",
  "female-retail": "#FFCA28",
  "female-transportation": "#FFD54F",
  "female-lawnsecurity": "#FFE082",
  "female-realestate": "#FFECB3",
  "female-services": "#FFD740",
  "female-whitecolar": "#FFE57F",
  "female-publicservices": "#FFD180"
};

var titles = {
  "male": "Male",
  "female": "Female",

  "50": "< 50K",
  "100": "50K-100K",
  "150": "100K-150K",
  "200": "150K-200K",
  "1000": "200K >",

  "services": "Services",
  "healthcare": "Healtcare",
  "education": "Education",
  "stem": "STEM",
  "retail": "Retail",
  "transportation": "Transportation",
  "lawnsecurity": "Law & Security",
  "realestate": "Real Estate",
  "whitecolar": "White Color",
  "publicservices": "Public Services"
}

makeVisualization("#all", "gender_salary_sector.csv");
makeVisualization("#year2011", "data/gender_salary_sector_2011.csv");
makeVisualization("#year2012", "data/gender_salary_sector_2012.csv");
makeVisualization("#year2013", "data/gender_salary_sector_2013.csv");
makeVisualization("#year2014", "data/gender_salary_sector_2014.csv");

function makeVisualization(selector, csvFilename) {

  // Total size of all segments; we set this later, after loading the data.
  var totalSize = 0;

  var vis = d3.select(selector + " .chart").append("svg:svg")
      .attr("width", width)
      .attr("height", height)
      .append("svg:g")
      .attr("class", "container")
      .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

  var partition = d3.layout.partition()
      .size([2 * Math.PI, radius * radius])
      .value(function(d) { return d.size; });

  var arc = d3.svg.arc()
      .startAngle(function(d) { return d.x; })
      .endAngle(function(d) { return d.x + d.dx; })
      .innerRadius(function(d) { return Math.sqrt(d.y); })
      .outerRadius(function(d) { return Math.sqrt(d.y + d.dy); });

  // Use d3.text and d3.csv.parseRows so that we do not need to have a header
  // row, and can receive the csv as an array of arrays.
  d3.text(csvFilename, function(text) {
    var csv = d3.csv.parseRows(text);
    var json = buildHierarchy(csv);
    createVisualization(json);
  });


  // Main function to draw and set up the visualization, once we have the data.
  function createVisualization(json) {
    // Basic setup of page elements.
    initializeBreadcrumbTrail();
    drawLegend();
    d3.select(selector + " .togglelegend").on("click", toggleLegend);

    // Bounding circle underneath the sunburst, to make it easier to detect
    // when the mouse leaves the parent g.
    vis.append("svg:circle")
        .attr("r", radius)
        .style("opacity", 0);

    // For efficiency, filter nodes to keep only those large enough to see.
    var nodes = partition.nodes(json)
        .filter(function(d) {
        return (d.dx > 0.005); // 0.005 radians = 0.29 degrees
        });

    var path = vis.data([json]).selectAll("path")
        .data(nodes)
        .enter().append("svg:path")
        .attr("display", function(d) { return d.depth ? null : "none"; })
        .attr("d", arc)
        .attr("fill-rule", "evenodd")
        .style("fill", function(d) {
          type = makeType(d);
          return colors[type];
         })
        .style("opacity", 1)
        .on("mouseover", mouseover);

    // Add the mouseleave handler to the bounding circle.
    d3.select(selector + " .container").on("mouseleave", mouseleave);

    // Get total size of the tree = value of root node from partition.
    totalSize = path.node().__data__.value;
   }

   // Fade all but the current sequence, and show it in the breadcrumb trail.
   function mouseover(d) {
     var percentage = (100 * d.value / totalSize).toPrecision(3);
     var percentageString = percentage + "%";
     if (percentage < 0.1) {
       percentageString = "< 0.1%";
     }

     d3.select(selector + " .percentage")
         .text(percentageString);

     d3.select(selector + " .explanation")
         .style("visibility", "");

     var sequenceArray = getAncestors(d);
     updateBreadcrumbs(sequenceArray, percentageString);

     // Fade all the segments.
     vis.selectAll("path")
         .style("opacity", 0.3);

     // Then highlight only those that are an ancestor of the current segment.
     vis.selectAll("path")
         .filter(function(node) {
                   return (sequenceArray.indexOf(node) >= 0);
                 })
         .style("opacity", 1);
   }

   // Restore everything to full opacity when moving off the visualization.
   function mouseleave(d) {

     // Hide the breadcrumb trail
     d3.select(selector + " .trail")
         .style("visibility", "hidden");

     // Deactivate all segments during transition.
     vis.selectAll("path").on("mouseover", null);

     // Transition each segment to full opacity and then reactivate it.
     vis.selectAll("path")
         .transition()
         .duration(1000)
         .style("opacity", 1)
         .each("end", function() {
                 d3.select(this).on("mouseover", mouseover);
               });

     d3.select(selector + " .explanation")
         .style("visibility", "hidden");
   }

   function initializeBreadcrumbTrail() {
     // Add the svg area.
     var trail = d3.select(selector + " .sequence").append("svg:svg")
         .attr("width", width)
         .attr("height", 50)
         .attr("class", "trail");
     // Add the label at the end, for the percentage.
     trail.append("svg:text")
       .attr("class", "endlabel")
       .style("fill", "#000");
   }

   // Update the breadcrumb trail to show the current sequence and percentage.
   function updateBreadcrumbs(nodeArray, percentageString) {

     // Data join; key function combines name and depth (= position in sequence).
     var g = d3.select(selector + " .trail")
         .selectAll("g")
         .data(nodeArray, function(d) { return d.name + d.depth; });

     // Add breadcrumb and label for entering nodes.
     var entering = g.enter().append("svg:g");

     entering.append("svg:polygon")
         .attr("points", breadcrumbPoints)
         .style("fill", function(d) {
           // TODO 2
           type  = makeType(d);
           return colors[type];
         });

     entering.append("svg:text")
         .attr("x", (b.w + b.t) / 2)
         .attr("y", b.h / 2)
         .attr("width", b.w + b.t)
         .attr("dy", "0.35em")
         .attr("text-anchor", "middle")
         .text(function(d) { return titles[d.name]; });

     // Set position for entering and updating nodes.
     g.attr("transform", function(d, i) {
       return "translate(" + i * (b.w + b.s) + ", 0)";
     });

     // Remove exiting nodes.
     g.exit().remove();

     // Now move and update the percentage at the end.
     d3.select(selector + " .trail").select(selector + " .endlabel")
         .attr("x", (nodeArray.length + 0.5) * (b.w + b.s))
         .attr("y", b.h / 2)
         .attr("dy", "0.35em")
         .attr("text-anchor", "middle")
         .text(percentageString);

     // Make the breadcrumb trail visible, if it's hidden.
     d3.select(selector + " .trail")
         .style("visibility", "");

   }

   function drawLegend() {
     // Dimensions of legend item: width, height, spacing, radius of rounded rect.
     var li = {
       w: 75, h: 30, s: 3, r: 3
     };

     var legend = d3.select(selector + " .legend").append("svg:svg")
         .attr("width", li.w)
         .attr("height", d3.keys(colors).length * (li.h + li.s));

     var g = legend.selectAll("g")
         .data(d3.entries(colors))
         .enter().append("svg:g")
         .attr("transform", function(d, i) {
                 return "translate(0," + i * (li.h + li.s) + ")";
              });

     g.append("svg:rect")
         .attr("rx", li.r)
         .attr("ry", li.r)
         .attr("width", li.w)
         .attr("height", li.h)
         .style("fill", function(d) { return d.value; });

     g.append("svg:text")
         .attr("x", li.w / 2)
         .attr("y", li.h / 2)
         .attr("dy", "0.35em")
         .attr("text-anchor", "middle")
         .text(function(d) { return titles[d.key]; });
   }

   function toggleLegend() {
     var legend = d3.select(selector + " .legend");
     if (legend.style("visibility") == "hidden") {
       legend.style("visibility", "");
     } else {
       legend.style("visibility", "hidden");
     }
   }



   // Given a node in a partition layout, return an array of all of its ancestor
   // nodes, highest first, but excluding the root.
   function getAncestors(node) {
     var path = [];
     var current = node;
     while (current.parent) {
       path.unshift(current);
       current = current.parent;
     }
     return path;
   }

   // Generate a string that describes the points of a breadcrumb polygon.
   function breadcrumbPoints(d, i) {
     var points = [];
     points.push("0,0");
     points.push(b.w + ",0");
     points.push(b.w + b.t + "," + (b.h / 2));
     points.push(b.w + "," + b.h);
     points.push("0," + b.h);
     if (i > 0) { // Leftmost breadcrumb; don't include 6th vertex.
       points.push(b.t + "," + (b.h / 2));
     }
     return points.join(" ");
   }

   function makePath(d) {
     var sequenceArray = getAncestors(d);
     var path = ""
     for (i = 0; i < sequenceArray.length; i++) {
       path += sequenceArray[i].name
       if (i < (sequenceArray.length-1))
         path += "-";
     }
     return path;
   }

   function makeType(d) {
     var sequenceArray = getAncestors(d);
     if (sequenceArray.length > 1) {
       var gender = sequenceArray[0].name;
       var name = sequenceArray[sequenceArray.length-1].name;
       return gender+"-"+name;
     } else if (sequenceArray.length == 1) {
       return sequenceArray[0].name
     } else {
       return ""
     }
   }

   // Take a 2-column CSV and transform it into a hierarchical structure suitable
   // for a partition layout. The first column is a sequence of step names, from
   // root to leaf, separated by hyphens. The second column is a count of how
   // often that sequence occurred.
   function buildHierarchy(csv) {
     var root = {"name": "root", "children": []};
     for (var i = 0; i < csv.length; i++) {
       var sequence = csv[i][0];
       var size = +csv[i][1];
       if (isNaN(size)) { // e.g. if this is a header row
         continue;
       }
       var parts = sequence.split("-");
       var currentNode = root;
       for (var j = 0; j < parts.length; j++) {
         var children = currentNode["children"];
         var nodeName = parts[j];
         var childNode;
         if (j + 1 < parts.length) {
      // Not yet at the end of the sequence; move down the tree.
    	var foundChild = false;
    	for (var k = 0; k < children.length; k++) {
    	  if (children[k]["name"] == nodeName) {
    	    childNode = children[k];
    	    foundChild = true;
    	    break;
    	  }
    	}
     // If we don't already have a child node for this branch, create it.
    	if (!foundChild) {
    	  childNode = {"name": nodeName, "children": []};
    	  children.push(childNode);
    	}
    	currentNode = childNode;
         } else {
    	// Reached the end of the sequence; create a leaf node.
    	childNode = {"name": nodeName, "size": size};
    	children.push(childNode);
         }
       }
     }
     return root;
   };

}
