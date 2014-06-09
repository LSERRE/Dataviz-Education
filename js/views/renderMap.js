define([
  'jquery',
  'd3',
  'underscore',
  'backbone',
  'handlebars',
], function($, d3, _, Backbone, Handlebars){
  	var map = {

  		defaults : {
			id: '#map',
			infosid: '#infosDepartements',
			zommed : false,
			choix: function(){}
		},

		init : function(options){
			map.params=$.extend(map.defaults,options);
			map.initialize();
		},


		initialize: function(){
			var self=this;
			var path = d3.geo.path();
			var projection = d3.geo.mercator();
			
			var width = $('.content').width();
			var height = $('.content').height()-1;
			var scaleDeLaCarte = 3.5*height;
			
			projection
	        	.center([2.454071, 46.279229]) // On centre la carte sur la France
	        	.scale(scaleDeLaCarte)
	      		.translate([width / 2, height / 2]);

	        path.projection(projection);

	        var svg = d3.select(map.params.id).append("svg")
	      		.attr("width", width)
	      		.attr("height", height);

			var deps = svg.append("g")
		    	.attr("id", "departements");

	    	d3.json('json/departements.json', function(req, geojson) {
			  	/*
			     * On "bind" un élément SVG path pour chaque entrée
			     * du tableau features de notre objet geojson
			     */
			  	var features = deps
			  			.selectAll("path")
						.data(geojson.features);

					/*
			     * On créait un ColorScale, qui va nous
			     * permettre d'assigner plus tard une
			     * couleur de fond à chacun de nos
			     * départements
			     */
			  	//var colorScale = d3.scale.category20c();

			  	/*
			     * Pour chaque entrée du tableau feature, on
			     * créait un élément SVG path, avec les
			     * propriétés suivantes
			     */
		  		features.enter()
			  	.append("path")
			  		.attr('class', 'departement')
			  		/*.attr('fill', function(d) { 
			  			return colorScale(+d.properties.CODE_DEPT); 
			  		})*/
			     	.attr("d", path)
			      	.attr("nom_dept", function(d){ return d.properties.NOM_DEPT; })
			      	.attr("num_dept", function(d){ return d.properties.CODE_DEPT; })
			      	.attr("fill-opacity","0.0")
			      	.attr("stroke-opacity","0.0")
		      		.attr("transform", "scale(2.0)translate("+-width/4+","+-height/4+")")
		     		 //.on('click', countyClickHandler);
		      		.on('mouseover', function(d){
		      			d3.select(this).classed('dept_hover',true);
		      			var centroid = path.centroid(d);
		      			var value = d.properties.NOM_DEPT;
		      			d3.select(map.params.infosid)
		      				.append("p")
	  						.attr("class","text_nom_dept")
	  						.html(value)
	  						//.style("top",centroid.top+height/2+"px")
	  						//.style("left",centroid.left-30+width/2+"px");
	  						.style("top",function(){ 
														var value = centroid[1]-50
														if(self.params.zoomed)
															value *= scaleZoom/2;
														return value+"px";
													})
	  						.style("left",function(){ 
	  													var value = centroid[0]
	  													if(self.params.zoomed)
															value *= scaleZoom/2;
	  													return value+"px";
	  												})
	  						.style("margin-left", function(){ return -this.offsetWidth/2+"px"; } );
		      		})
		     	 	.on('mouseout', function(){
		      			d3.select(this).classed('dept_hover',false);
		      			d3.select(map.params.infosid).select("p").remove();
		      		})
		      		.on('click', map.choisirDepartement)

		      		.transition()
				  		.delay(function(d,i){ return i*10; })
				  		.duration(500)
				  		.attr("fill-opacity","1.0")
				  		.attr("stroke-opacity","1.0")
				  		.attr("transform", "scale(1)translate(0,0,0)");

	  		});
		},


	  	zoomerMap: function(d) {
	  		var centered;
				var x, y, k;

				if (d && centered !== d) {
				var centroid = path.centroid(d);
				x = centroid[0];
				y = centroid[1];
				k = scaleZoom;
				centered = d;
				self.params.zoomed = true;
			} 
			else {
				x = width / 2;
				y = height / 2;
				k = 1;
				centered = null;
				self.params.zoomed = true;
			}
		
			deps.selectAll("path")
				.classed("active", centered && function(d) { return d === centered; });
		
			var trStr = "translate(" + width / 2 + "," + height / 2 + ")" + "scale(" + k + ")translate(" + -x + "," + -y + ")";
		
			deps.transition()
				.duration(500)
				.attr("transform", trStr);

				var trStr2 = "translate(" + -x + width / (scaleZoom*2) + "px ," + -y + height / (scaleZoom*2) + "px )" +
				" scale(" + k + ")"
			console.log(trStr);

			var container = d3.select("#infosDepartements");
			//console.log(d3.select("#container_map"));
			container.style("transform",trStr2);
			container.style("-ms-transform",trStr2);
			container.style("-moz-transform",trStr2);
			container.style("-webkit-transform",trStr2);
		
		},

		choisirDepartement: function(){
			//zoomerMap(d);
			//console.log(+d.properties.CODE_DEPTS+"");
			//console.log("Nom du département : "+this.getAttribute('nom_dept')+"\n Code du Département : "+this.getAttribute('num_dept'));
			//d3.selectAll(".departement").style('fill',patternDept);
			d3.selectAll(".departement").classed('dept_select',false);
			d3.select(this).classed('dept_select',true);
			map.params.choix.call(this, this.getAttribute('nom_dept'), this.getAttribute('num_dept'));
			//d3.select(this).style('fill',patternSelect);
		}
	};

  	return {
    	init : map.init
  	};
});