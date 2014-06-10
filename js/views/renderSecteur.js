define([
  'jquery',
  'd3',
  'underscore',
  'backbone',
  'handlebars',
], function($, d3, _, Backbone, Handlebars){
  	var secteur = {
		defaults : {
			id: "#svg_d3",
			outer_circle_radius: 550/2,
			inner_circle_radius: 450/2,
			choix: function(){}
		},

		init : function(options){
			secteur.params=$.extend(secteur.defaults,options);
			secteur.initialize();
		},

		getRadius: function (isInner, inner_circle_radius, outer_circle_radius) {
			if(isInner)
				return inner_circle_radius;
			return outer_circle_radius;
		},

		

		compareString: function(string, searchVal){
			var regEx = new RegExp(searchVal, "g");
			var result = regEx.test(string);
			return result;
		},

		noAccentNoCase: function(string){
			var stringLower = string.toLowerCase();
			var stringReturn = "";
			for(var i=0;i<stringLower.length;i++)
			{
				switch(stringLower[i]){
					//e
					case "é":
					case "è":
					case "ë":
					case "ê":
						stringReturn += "e";
					break;
					//a
					case "à":
					case "ä":
					case "â":
						stringReturn += "a";
					break;
					//c
					case "ç":
						stringReturn += "c";
					break;
					//o
					case "ö":
					case "ô":
						stringReturn += "o";
					break;
					//i
					case "ï":
					case "î":
						stringReturn += "i";
					break;
					//u
					case "û":
					case "ü":
						stringReturn += "u";
					break;

					default:
						stringReturn += stringLower[i];
					break;
				}
			}
			return stringReturn;
		},

		selectionSecteur: function(){
			console.log("Nom du secteur : "+this.parentNode.getAttribute('secteur_nom')+"\n Id du secteur : "+this.parentNode.getAttribute('secteur_id'));
			secteur.params.choix.call(this, this.parentNode.getAttribute('secteur_nom'), this.parentNode.getAttribute('secteur_id'));
		},

		initialize: function(){
			var w = $('.content').width(), 
				h = $('.content').height();
				

			var selectPlaceholder = document.querySelectorAll("#infosSecteurs>input[placeholder]")[0];
			var inputRecherche = document.querySelectorAll('#infosSecteurs>input')[0];
			var ph_current_value = "Nom du secteur";
			
			selectPlaceholder.value = ph_current_value;

			//Petit UX lors du premier click sur le champ de recherche
			inputRecherche.addEventListener("click",function(){
				if(selectPlaceholder.value == "Nom du secteur"){
					selectPlaceholder.value = "";}
			},false);

			// size scale for data
			/*var radiusScale = d3.scale.sqrt()
			    .domain([0, d3.max(data)])
			    .range([0, maxRadius]);*/
			var radiusScale = function(){return 50/2;};

			// determine the appropriate radius for the circle
			/*
			var roughCircumference = d3.sum(data.map(radiusScale)) * 2 + padding * (data.length - 1),
			    radius = roughCircumference / (Math.PI * 2);*/

			// make 2 radial tree layout
			var tree1 = d3.layout.tree()
			    .size([360, secteur.getRadius(false, secteur.params.inner_circle_radius, secteur.params.outer_circle_radius)])
			    .separation(function(a, b) {
			        return radiusScale(a.size) + radiusScale(b.size);
			    });

			var tree2 = d3.layout.tree()
			    .size([360, secteur.getRadius(true, secteur.params.inner_circle_radius, secteur.params.outer_circle_radius)])
			    .separation(function(a, b) {
			        return radiusScale(a.size) + radiusScale(b.size);
			    });

			// make the svg
			var svg_circle1 = d3.select(secteur.params.id).append("svg")
			    .attr("width", w)
			    .attr("height", h)
			    .attr("id","svg_circles")
			  .append("g")
			    .attr("transform", "translate(" + (w / 2) + "," + (h / 2) + ")scale("+h/640+")") //center the circle

			var svg_circle2 = d3.select("#svg_circles")
				.append("g")
				.attr("transform", "translate(" + (w / 2) + "," + (h / 2) + ") rotate("+360/39+")scale("+h/640+")") //center the circle

			d3.json('json/secteurs.json', function(req, secjson) {

				// some made-up data
				var dataOri = secjson.features;
				//Couper le tableau en 2 pour les 2 cercles
				var data = dataOri.slice(0,dataOri.length/2);
				var data2 = dataOri.slice(dataOri.length/2,dataOri.length);

				// tree-ify our fake data
				var dataTree = {
				    children: data.map(function(d) { return d; })
				};
				var dataTree2 = {
				    children: data2.map(function(d) { return d; })
				};

				// apply the layout to the data
				var secteurs_out = tree1.nodes(dataTree);
				var secteurs_in = tree2.nodes(dataTree2);

				// create dom elements for the node
				var secteur_circle1 = svg_circle1.selectAll(".secteur")
				      .data(secteurs_out.slice(1)) // cut out the root node, we don't need it
					    .enter()
					    	.append("g")
					      	.attr("class", "secteur")
					      	.attr("secteur_id", function(d){ return d.propreties.ID_SECTEUR; })
					      	.attr("secteur_nom", function(d){ return d.propreties.NOM_SECTEUR; })
					      	.attr("transform", function(d) {
					          return "rotate(" + (d.x - 90) + ") translate(" + d.y + ")";
					      	})

				var secteur_circle2 = svg_circle2.selectAll(".secteur")
				      .data(secteurs_in.slice(1)) // cut out the root node, we don't need it
					    .enter()
					    	.append("g")
					      	.attr("class", "secteur")
					      	.attr("secteur_id", function(d){ return d.propreties.ID_SECTEUR; })
					      	.attr("secteur_nom", function(d){ return d.propreties.NOM_SECTEUR; })
					      	.attr("transform", function(d) {
					          return "rotate(" + (d.x - 90) + ") translate(" + d.y + ")";
					      	})
				//Cercles exterieur
				var circles_in_circle1 = secteur_circle1.append("circle")
				    .attr("r", "0")
				    .on("mouseover",afficherNomSecteur,false)
				    .on("mouseout",unHoverSecteur,false)
				    .on("click", secteur.selectionSecteur,false)
				    .attr("fill-opacity","0.0")
				  	.attr("stroke-opacity","0.0");

			   	circles_in_circle1.transition()
				  		.delay(function(d,i){ return i*40; })
				  		.duration(500)
				  		.attr("fill-opacity","1.0")
				  		.attr("stroke-opacity","1.0")
				  		.attr("r", function(d) { return radiusScale(d.size); });
				
				circles_in_circle1.append("svg:image")
				  		.attr("xlink:href", function(d){ return "./svg/"+d.propreties.NOM_ICON;})
				  		.attr("x",-20) //-height/2
				  		.attr("y",-20) //-width/2
                    	.attr("width", 40)
                    	.attr("height", 40);
				//Cercles interieur
				var circles_in_circle2 = secteur_circle2.append("circle")
				    .attr("r", "0")
				    .on("mouseover",afficherNomSecteur,false)
				    .on("mouseout",unHoverSecteur,false)
				    .on("click", secteur.selectionSecteur,false)
				    .attr("fill-opacity","0.0")
				  	.attr("stroke-opacity","0.0");

				circles_in_circle2.transition()
				  		.delay(function(d,i){ return 800+i*40; })
				  		.duration(500)
				  		.attr("fill-opacity","1.0")
				  		.attr("stroke-opacity","1.0")
				  		.attr("r", function(d) { return radiusScale(d.size); });
				 /*
				d3.selectAll(".secteur")
						.enter()
						.append("img")
				  		.attr("src","./svg/industrie.svg")
				  		.attr("x",0) //-height/2
				  		.attr("y",0) //-width/2
                    	.attr("width", 40)
                    	.attr("height", 40);*/

			});

			//La recherche Live, déclaré après l'init du d3
			/*
			inputRecherche.onchange = function() {
				if ( this.value == this.getAttribute('value') ) {
					this.value='';
				}
				alert("COUCOU");
				console.log("CONNARD");

			}
			*/
			var tousLesSecteurs = document.getElementsByClassName('secteur');

			inputRecherche.onkeyup = function(){
				//console.log(inputRecherche.value.toString());
				if(inputRecherche.value.toString() != "")
				{
					for(var i=0;i<tousLesSecteurs.length;i++)
					{
						if(secteur.compareString(secteur.noAccentNoCase( tousLesSecteurs[i].getAttribute('secteur_nom') ), secteur.noAccentNoCase( inputRecherche.value ) ) ){
							tousLesSecteurs[i].classList.add("secteurHighlight");
						}else{
							tousLesSecteurs[i].classList.remove("secteurHighlight");
						}
					}
				}else{
					for(var i=0;i<tousLesSecteurs.length;i++)
						tousLesSecteurs[i].classList.remove("secteurHighlight");
				}
			};

			function afficherNomSecteur(){
				ph_current_value = selectPlaceholder.value;

				d3.select(this).classed("secteurHover",true);
				selectPlaceholder.value = this.parentNode.getAttribute('secteur_nom');
			};

			function unHoverSecteur(){
				d3.select(this).classed("secteurHover",false);

				selectPlaceholder.value = ph_current_value;
			};

		}

	};

  	return {
    	init : secteur.init
  	};
});