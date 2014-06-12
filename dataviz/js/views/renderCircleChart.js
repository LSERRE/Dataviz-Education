define([
  'jquery',
  'd3',
  'underscore',
  'backbone',
  'handlebars',
], function($, d3, _, Backbone, Handlebars){
    var circleChart = {
        defaults : {
            id: '#svg_d3',
            nomDuTheme: 'EMPLOI', //Valeur par défaut qui doive être réécrite
            deptChoisi: '35',
            parametre:'entreprises',
            needInit: true,
        },

        init : function(options){
            console.log(this);
            circleChart.params=$.extend(circleChart.defaults,options);
            circleChart.chargerCsv();
        },

        chargerCsv : function(){
            // afficher le loader

            var nom_du_CSV = 'json/'+circleChart.params.nomDuTheme+'_'+circleChart.params.parametre+'.csv'; //Nb employés

            var donneesCsv = [];
            d3.csv(nom_du_CSV,function(data){
                donneesCsv = data;
                // donneesCsv[CodeSecteur-1][CodeDept]
                // circleChart.getRow(donneesCsv, CodeDept)
                 console.log( circleChart.getRow(donneesCsv, circleChart.params.deptChoisi) );
                if(circleChart.params.needInit)
                    circleChart.initialize( circleChart.getRow(donneesCsv, circleChart.params.deptChoisi) );
                else
                    circleChart.majCircle( circleChart.getRow(donneesCsv, circleChart.params.deptChoisi) );
            });
        },

        getRow : function(array, nbr){
            var retArray = new Array();
            for(var i=0; i<Object.keys(array).length; i++)
            {
                retArray[i] = array[i][nbr];
            }
            return retArray;
        },

        initialize: function(leCSV){
            var w = $('.content').width(),
            h = $('.content').height()-49;

            circleChart.params.needInit = true;

            var circle_radius = 500/2;

            var dataCSV = leCSV;

            for(var i=0; i<dataCSV.length;i++)
            {
                dataCSV[i] = parseInt(leCSV[i].replace(" ",""));
            }

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

                console.log(dataCSV);
                console.log( d3.max(dataCSV));

                var scale = d3.scale.linear()
                    .domain([0, d3.max(dataCSV)])
                    .range([10, 200]);

                var color = d3.scale.linear()
                    .domain([0, d3.max(dataCSV)])
                    .range(["#AED4FE","#0078FF"]); //#AED4FE"

                var bars = leGraph.selectAll(".uneBarSecteur")
                    .data(secteurs_bars.slice(1))
                        .enter()
                            .append("rect")
                            .attr("class","uneBarSecteur")
                            .attr("fill", function(d,i){ return color(dataCSV[i]); })
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
                            .attr("value", function(d,i){ return dataCSV[i]; })

                            .transition()
                            .duration(500)
                            .delay(function(d,i){ return 30*i;})
                            .attr("width", function(d,i){
                                return scale(dataCSV[i]);
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
            d3.select("#infosSecteurs2>#nom>h2").html(item.getAttribute("secteur_nom"));
            d3.select("#infosSecteurs2>span").html("<img src='./svg/"+item.getAttribute("secteur_icon")+"' alt='icon secteur'/>");
        }

        afficherNewCircle: function(leCSV){

            var dataCSV = leCSV;

            for(var i=0; i<dataCSV.length;i++)
            {
                dataCSV[i] = parseInt(leCSV[i].replace(" ",""));
            }
            //La couleur est encore à définir en fonction de l'onglet
            
            var scale = d3.scale.linear()
                    .domain([0, d3.max(dataCSV)])
                    .range([10, 200]);

            var color = d3.scale.linear()
                .domain([0, d3.max(dataCSV)])
                .range(["#AED4FE","#0078FF"]); //#AED4FE"
            

            d3.selectAll(".uneBarSecteur")
                .attr("fill", function(d,i){ return color(dataCSV[i]); })
                .attr("width", function(d,i){
                    return scale(dataCSV[i]);
                })
                .attr("value", function(d,i){ return dataCSV[i]; })
                ;

        }
        
    };

    return {
        init : circleChart.init
    };
});