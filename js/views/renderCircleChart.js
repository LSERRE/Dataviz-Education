define([
  'jquery',
  'd3',
  'underscore',
  'backbone',
  'handlebars',
], function($, d3, _, Backbone, Handlebars){
    var circleChart = {
        defaults : {
            id: '#svg_d3'
        },

        init : function(options){
            console.log(this);
            circleChart.params=$.extend(circleChart.defaults,options);
            circleChart.initialize();
        },


        initialize: function(){
            var w = window.innerWidth,
            h = window.innerHeight;

            var circle_radius = 500/2;

            var fakeData = [34,45,59,20,40,29,490,584,48,29,5,204,58,403,57,39,58,20,6,295,356,103,185,58,20,59,105,592,245,25,493,23,59,240,401,35,281,79];
            console.log(fakeData.length);

            var leGraph = d3.select(circleChart.params.id).append("svg")
                            .attr("id","leGraph")
                            .attr("width",w)
                            .attr("height",h)
                                .append("g")
                                .attr("transform", "translate(" + (w / 2) + "," + (h / 1.2) + ") rotate(-92.3)") //center the circle
                            ;

            var tree = d3.layout.tree()
                .size([180, circle_radius])

            d3.json('json/secteurs.json', function(req, secjson) {
        
                var data = secjson.features;

                var dataTree = {
                    children: data.map(function(d) { return d; })
                };
                var secteurs_bars = tree.nodes(dataTree);

                var scale = d3.scale.linear()
                    .domain([0, d3.max(fakeData)])
                    .range([10, 200]);

                var color = d3.scale.linear()
                    .domain([0, d3.max(fakeData)])
                    .range(["#AED4FE","#0078FF"]); //#AED4FE"

                var bars = leGraph.selectAll(".uneBarSecteur")
                    .data(secteurs_bars.slice(1))
                        .enter()
                            .append("rect")
                            .attr("class","uneBarSecteur")
                            .attr("fill", function(d,i){ return color(fakeData[i]); })
                            .attr("transform", function(d) {
                              return "rotate(" + (d.x - 90) + ") translate(" + d.y + ")";
                            })
                            .attr("height","20")
                            .attr("width", "0")
                            .attr("rx","4")
                            .attr("ry","4")
                            .attr("secteur_id", function(d){ return d.propreties.ID_SECTEUR; })
                            .attr("secteur_nom", function(d){ return d.propreties.NOM_SECTEUR; })
                            .attr("secteur_icon", function(d){ return d.propreties.NOM_ICON; })
                            .attr("value", function(d,i){ return fakeData[i]; })
                            .on("mouseover",function(){ 
                                var it = this;
                                d3.selectAll('.uneBarSecteur').transition().duration(50).style('fill-opacity',function () {
                                    return (this === it) ? 1.0 : 0.3;
                                });
                                circleChart.changeValue(this);
                            },false)
                            .on("mouseout",function(){ 
                                d3.selectAll('.uneBarSecteur').transition().duration(500).style('fill-opacity','1.0');
                            },false)

                            .transition()
                            .duration(500)
                            .delay(function(d,i){ return 30*i;})
                                .attr("width", function(d,i){
                                    return scale(fakeData[i]);
                                })
                            ;

            });
        },

        changeValue: function(item){
            //var divInfos = document.getElementById("infosSecteurs");
            d3.select("#infosSecteurs>h1").html(item.getAttribute("value"));
            d3.select("#infosSecteurs>h2").html(item.getAttribute("secteur_nom"));
            //d3.select("#infosSecteurs>span").html(it.getAttribute("secteur_icon"));
        }

    };

    return {
        init : circleChart.init
    };
});