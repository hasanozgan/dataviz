// https://www.materialui.co/colors

Number.prototype.format = function(n, x) {
    var re = '\\d(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\.' : '$') + ')';
    return this.toFixed(Math.max(0, ~~n)).replace(new RegExp(re, 'g'), '$&,');
};

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.split(search).join(replacement);
};

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
  "male": ["#1565C0", "#FFFFFF"],
  "female": ["#EF6C00", "#FFFFFF"],

  "50": ["#64B5F6", "#FFFFFF"],
  "100": ["#42A5F5", "#FFFFFF"],
  "150": ["#2196F3", "#FFFFFF"],
  "200": ["#1E88E5", "#FFFFFF"],
  "1000": ["#1976D2", "#FFFFFF"],

  "healthcare": ["#0277BD", "#FFFFFF"], // 800
  "education": ["#0288D1", "#FFFFFF"], // 700
  "stem": ["#039BE5", "#FFFFFF"], // 600
  "retail": ["#03A9F4", "#FFFFFF"], // 500
  "transportation": ["#29B6F6", "#FFFFFF"], //400
  "lawnsecurity": ["#4FC3F7", "#000000"], // 300
  "realestate": ["#00B0FF", "#FFFFFF"], // A400
  "services": ["#40C4FF", "#000000"], // A200
  "whitecolar": ["#81D4FA", "#000000"], // 200
  "publicservices": ["#80D8FF", "#000000"], // A100

  "male-50": ["#64B5F6", "#FFFFFF"],
  "male-100": ["#42A5F5", "#FFFFFF"],
  "male-150": ["#2196F3", "#FFFFFF"],
  "male-200": ["#1E88E5", "#FFFFFF"],
  "male-1000": ["#1976D2", "#FFFFFF"],

  "female-50": ["#FFB74D", "#000000"],
  "female-100": ["#FFA726", "#000000"],
  "female-150": ["#FF9800", "#000000"],
  "female-200": ["#FB8C00", "#FFFFFF"],
  "female-1000": ["#F57C00", "#FFFFFF"],

  "male-healthcare": ["#0277BD", "#FFFFFF"], // 800
  "male-education": ["#0288D1", "#FFFFFF"], // 700
  "male-stem": ["#039BE5", "#FFFFFF"], // 600
  "male-retail": ["#03A9F4", "#FFFFFF"], // 500
  "male-transportation": ["#29B6F6", "#FFFFFF"], //400
  "male-lawnsecurity": ["#4FC3F7", "#000000"], // 300
  "male-realestate": ["#00B0FF", "#FFFFFF"], // A400
  "male-services": ["#40C4FF", "#000000"], // A200
  "male-whitecolar": ["#81D4FA", "#000000"], // 200
  "male-publicservices": ["#80D8FF", "#000000"], // A100

  "female-healthcare": ["#FF8F00", "#FFFFFF"],// 800
  "female-education": ["#FFA000", "#FFFFFF"],// 700
  "female-stem": ["#FFB300", "#000000"], //600
  "female-retail": ["#FFC107", "#000000"],//500
  "female-transportation": ["#FFCA28", "#000000"],//400
  "female-lawnsecurity": ["#FFD54F", "#000000"],//300
  "female-realestate": ["#FFC400", "#000000"],//A400
  "female-services": ["#FFD740", "#000000"],//A200
  "female-whitecolar": ["#FFE082", "#000000"],//200
  "female-publicservices": ["#FFE57F", "#000000"]//A100
};

var jobtitles = {
  "healthcare": "Doctor, Nurs, Anesth, Epidemiologist, Psychologist, Nutritionist, Chemist, Emergency Med, Pathologist, Health, Hlth, Therapist, Hospital, Imaging, Physician, Orthopedic, Pharm, Dental, Dentist, Medical, Acupunturist, Radiologic, Audiometrist, Emergency, Med, Audiologist, Psychiatric",
  "education": "Training, Teacher, Exam, Trainer, Trainee",
  "stem": "Science, Biology, Eng, Biologist, Eengineer, Automotive,  metal, Ngr, Technician",
  "retail": "Clerk, Retail, Cashier, Store, Customer, Purchaser, Patrol",
  "transportation": "MTA, Transit, Airport, Captain",
  "lawnsecurity": "Police, Sherif, Probation, Sergeant, Investigator, Guard, Security, Custodian, Lawyer, Judge, Criminalist, Criminal, Court",
  "realestate": "Architect, Estate, Contract, Cement, Real Prop",
  "services": "Tourism, Sport, Speaker, DJ, VJ, Journalist, Designer, Art, Media, Cook, Chef, Barber, Painter, Carpenter, Photographer, Animal Keeper, Marketing , Repairer, Plumber, Housekeeper, Baker, Curator, Animal, Machinist, Roofer, Gardener, Commissioner, Crafts, Electrical, Windowcleaner, Worker, Driver, Repair, Electrician, Glazier, Wire, Communications, Communication, Planner, Wharfinger, Cement Mason",
  "whitecolar": "Management, Consultant, Manager, Admin, Board of Supervisors, Secretary, Assistant, Asst, Auditor, Analyst, Chief Investment Officer, Director, Accountant, Account, Board, Dept Head, Dep Dir, Payroll",
  "publicservices": "Fire, Firefighter, Asphalt Plant Supervisor, Mayor, Govrnmt, Affairs, Museum, Librarian, Public, Parking Control Officer, Duty, Street Signs, Water, City Planning, Asphalt, Counselor, Marriage, Public Service, Traffic Hearing, Cfdntal, Park Section, Child, Municipal, Attorney, Meter Reader",
}

var legends = {
  "gender": ["male", "female"],
  "sector": ["healthcare", "education", "stem", "retail", "transportation", "lawnsecurity", "realestate","services","whitecolar","publicservices"],
  "salary": ["1000", "200", "150", "100", "50"]
}

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

var totalSizeList = {};

function makeVisualization(selector, csvFilename) {

  $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
    var selector = $(e.target).attr("href") // activated tab
    makeLegend(selector);
    $('[data-toggle="popover"]').popover({ trigger: "hover" });
  });

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

  $(document).ready(function() {
    makeLegend("#all");
  });

  // Main function to draw and set up the visualization, once we have the data.
  function createVisualization(json) {
    // Basic setup of page elements.
    initializeBreadcrumbTrail();

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

          if (type.length > 0) {
            return colors[type][0];
          }
         })
        .style("opacity", 1)
        .on("mouseover", mouseover);

    // Add the mouseleave handler to the bounding circle.
    d3.select(selector + " .container").on("mouseleave", mouseleave);

    // Get total size of the tree = value of root node from partition.
    totalSize = path.node().__data__.value;
    totalSizeList[selector] = totalSize;
   }

   // Fade all but the current sequence, and show it in the breadcrumb trail.
   function mouseover(d) {
     var percentage = (100 * d.value / totalSize).toPrecision(3);
     var percentageString = percentage + "%";
     if (percentage < 0.1) {
       percentageString = "< 0.1%";
     }

     var sizeString = d.value.format() + " / <small>" + totalSize.format() + "</small>";

     d3.select(selector + " .percentage")
         .text(percentageString);

     d3.select(selector + " .size")
         .html(sizeString);


     $(selector + " .sentence").html(makeSentence(d));

     d3.select(selector + " .explanation")
         .style("visibility", "");

     d3.select(selector + " .description")
         .style("visibility", "hidden");

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
        // .duration(500)
         .style("opacity", 1)
         .each("end", function() {
                 d3.select(this).on("mouseover", mouseover);
               });

     d3.select(selector + " .explanation")
         .style("visibility", "hidden");

     d3.select(selector + " .description")
         .style("visibility", "");

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
           type  = makeType(d);
           if (type.length > 0) {
             return colors[type][0];
           }
         });

     entering.append("svg:text")
         .attr("x", (b.w + b.t) / 2)
         .attr("y", b.h / 2)
         .attr("width", b.w + b.t)
         .attr("dy", "0.35em")
         .attr("text-anchor", "middle")
         .text(function(d) { return titles[d.name]; })
         .style("fill", function(d) {
           type  = makeType(d);
           if (type.length > 0) {
             return colors[type][1];
           }
         });

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

   function makeSentence(d) {
     var sequenceArray = getAncestors(d);
     var sentence = ""
     for (i = 0; i < sequenceArray.length; i++) {
       sentence += titles[sequenceArray[i].name]
       if (i < (sequenceArray.length-1))
         sentence += "<br/>";
     }
     return sentence;
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

   function makeLegend(selector) {
     var totalSize = totalSizeList[selector];
     var gender = makeColorBox("Gender", legends.gender);
     var salary  = makeColorBox("Salary Group", legends.salary, true);
     var sector = makeColorBox("Sector", legends.sector, true, jobtitles);
     $("#sidebar .gender").html(gender);
     $("#sidebar .salary").html(salary);
     $("#sidebar .sector").html(sector);

     $(".legend .item").on("mouseover", function(e) {
       $(e.target).parents("li").addClass("selected");
       var key = $(e.target).attr("data-item");
       // Fade all the segments.
       if (key == undefined || key == null || key.length > 0) {
         var a = d3.selectAll(selector+" path").style("opacity", 0.3).filter(function(node) {
           return (node.name == key);
         })[0];

         var totalLegend = 0;
         for (var i = 0; i < a.length; i++) {
           if (a[i].__data__ !== undefined) {
             var d = a[i].__data__;
             totalLegend += parseInt(d.value, 10);
           }
         }

         var d = a[0].__data__;
        //  var sequenceArray = Array({name:d.name, depth:1, value:d.value, parent:{name:"root", depth:"0", value:0}});
        //  updateBreadcrumbs(sequenceArray, percentageString);

         var percentage = (100 * totalLegend / totalSize).toPrecision(3);
         var percentageString = percentage + "%";
         if (percentage < 0.1) {
           percentageString = "< 0.1%";
         }

         var sizeString = totalLegend.format() + " / <small>" + totalSize.format() + "</small>";

         d3.select(selector + " .percentage")
             .text(percentageString);

         d3.select(selector + " .size")
             .html(sizeString);

         var legendName = $(e.target).parents("ul.legend").attr("data-name");

         $(selector + " .sentence").html("<strong style='font-size:1.3em'>"+legendName+"</strong><br/>"+titles[d.name]);

         d3.select(selector + " .explanation")
             .style("visibility", "");

         d3.select(selector + " .description")
             .style("visibility", "hidden");

         d3.selectAll(selector+" path").style("opacity", 0.3).filter(function(node) {
           return (node.name == key);
         }).style("opacity", 1).style("border", "1px solid black");


       }
     });

     $(".legend .item").on("mouseleave", function(e) {
       $(e.target).parents("li").removeClass("selected");
       d3.selectAll(selector+" path").style("opacity", 1);

       d3.select(selector + " .explanation")
           .style("visibility", "hidden");

       d3.select(selector + " .description")
           .style("visibility", "");
     });
   };
}

function makeColorBox(name, keys, multiCode=false, popoverContents=null) {
  var str = ""
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];

    str += "<li>";
    if (popoverContents != undefined && popoverContents != null) {
      var title = titles[key];
      str += "<span data-toggle='popover' title='Job Titles ("+ title +")' data-content='"+ popoverContents[key] +"'>";
    }
    if (multiCode) {
      str += "<span class='box item' style='background-color:"+colors["male-"+key][0]+"' data-item='"+key+"'></span>";
      str += "<span class='box item' style='background-color:"+colors["female-"+key][0]+"' data-item='"+key+"'></span>";
    } else {
      str += "<span class='box item' style='background-color:"+colors[key][0]+"' data-item='"+key+"'></span>";
    }

    str += "<span class='title item' data-item='"+key+"'>"+titles[key]+"</span>";
    if (popoverContents != undefined && popoverContents != null) {
      str += "</span>";
    }
    str += "</li>";
  }

  return "<ul class='legend' data-name='"+name+"'>"+str+"</ul>"
}
