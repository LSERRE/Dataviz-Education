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
            var w = $('.content').width(),
            h = $('.content').height()-49;

            var circle_radius = 500/2;

            var fakeData = [34,45,59,20,40,29,490,584,48,29,5,204,58,403,57,39,58,20,6,295,356,103,185,58,20,59,105,592,245,25,493,23,59,240,401,35,281,79];

            var leGraph = d3.select(circleChart.params.id).append("svg")
                            .attr("id","leGraph")
                            //.attr("width",w)
                            //.attr("height",h)
                                .append("g")
                                .attr("transform", "translate(" + 450 + "," + 450 + ")") //center the circle
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
                    .range([200, 200]);

                var color = d3.scale.linear()
                    .domain([0, d3.max(fakeData)])
                    .range(["#AED4FE","#0078FF"]); //#AED4FE"

                var bars = leGraph.selectAll(".uneBarSecteur")
                    .data(secteurs_bars.slice(1))
                        .enter()
                            .append("rect")
                            .attr("class","uneBarSecteur")
                            .attr("fill", function(d,i){ return color(fakeData[i]); })
                            .attr("transform", function(d,i) {
                              return "rotate(" + (d.x - 182.5 ) + ") translate(" + ( d.y - 0 ) + ")";
                            })
                            .attr("height","20")
                            .attr("width", "0")
                            .attr("rx","4")
                            .attr("ry","4")
                            .attr("secteur_id", function(d){ return d.propreties.ID_SECTEUR; })
                            .attr("secteur_nom", function(d){ return d.propreties.NOM_SECTEUR; })
                            .attr("secteur_icon", function(d){ return d.propreties.NOM_ICON; })
                            .attr("value", function(d,i){ return fakeData[i]; })

                            .transition()
                            .duration(500)
                            .delay(function(d,i){ return 30*i;})
                                .attr("width", function(d,i){
                                    return scale(fakeData[i]);
                            })
                            .each("end", function(){
                                d3.select(this)
                                .on("mouseover",function(){ 
                                    var it = this;
                                    /*d3.selectAll('.uneBarSecteur').transition().duration(50).style('fill-opacity',function () {
                                        return (this === it) ? 1.0 : 0.3;
                                    });*/
                                    d3.selectAll('.uneBarSecteur').classed("uneBarSecteurHover",function(){ return (this === it) ? false : true; });
                                    circleChart.changeValue(this);
                                },false)
                                .on("mouseout",function(){ 
                                    d3.selectAll('.uneBarSecteur').classed("uneBarSecteurHover",false);
                                },false)

                            });
                            ;

            });
        },

        changeValue: function(item){
            //var divInfos = document.getElementById("infosSecteurs");
            d3.select("#infosSecteurs2>h1").html(item.getAttribute("value"));
            d3.select("#infosSecteurs2>h2").html(item.getAttribute("secteur_nom"));
            d3.select("#infosSecteurs2>span").html("<img src='./svg/"+item.getAttribute("secteur_icon")+"' alt='icon secteur'/>");
        }
        /*
        majCircle: function() {

            var donneesCsv = [];
            d3.csv(nomDuCsv,function(data){
                donneesCsv = data;
                // donneesCsv[CodeSecteur-1][CodeDept]
                // console.log(donneesCsv["10"]["13"])
                map.afficherNewCircle(donneesCsv);
            });

        },

        afficherNewCircle: function(donneesCsv){

            //La couleur est encore à définir en fonction de l'onglet
            
            var color = d3.scale.linear()
                .domain([0, map.maxVal(donneesCsv[map.params.secteurChoisi-1])])
                .range(["#f1f1f1","#0078FF"]); //#AED4FE"
            
            d3.selectAll(".departementHM")
                .enter()
                    .transition()
                    .duration(1000)
                    .attr('fill', function(d) { 
                        if (donneesCsv[map.params.secteurChoisi-1][d.properties.CODE_DEPT] == null){
                            console.log("Undefined or NULL at "+(map.params.secteurChoisi-1)+":"+d.properties.CODE_DEPT);
                            return;
                        }
                        return color(parseInt(donneesCsv[map.params.secteurChoisi-1][d.properties.CODE_DEPT].replace(" ",""))); 
                    })
                    .attr("value",function(d){ return donneesCsv[map.params.secteurChoisi-1][d.properties.CODE_DEPT] })
        }
        */
    };

    return {
        init : circleChart.init
    };
});