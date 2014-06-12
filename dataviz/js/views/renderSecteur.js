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
			console.log("Nom du secteur : "+this.getAttribute('secteur_nom')+"\n Id du secteur : "+this.getAttribute('secteur_id'));
			secteur.params.choix.call(this, this.getAttribute('secteur_nom'), this.getAttribute('secteur_id'));
		},

		initialize: function(){
			var w = $('.content').width(), 
				h = $('.content').height();

			var tailleIco = 30;
				

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
			    .attr("transform", "translate(" + (w / 2) + "," + (h / 2) + ")scale("+h/700+")") //center the circle

			var svg_circle2 = d3.select("#svg_circles")
				.append("g")
				.attr("transform", "translate(" + (w / 2) + "," + (h / 2) + ") rotate("+360/39+")scale("+h/700+")") //center the circle

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
					      	.on("mouseover",afficherNomSecteur,false)
				    		.on("mouseout",unHoverSecteur,false)
				    		.on("click", secteur.selectionSecteur,false)
					      	.attr("transform", function(d) {
					          return "rotate(" + (d.x - 90) + ") translate(" + d.y + ")";
					      	});
						  		
						//Cercles exterieur
				secteur_circle1.append("circle")
				    .attr("r", function(d) { return radiusScale(d.size); });
				
				secteur_circle1.append("svg:image")
				  		.attr("xlink:href", function(d){ return "./svg/"+d.propreties.NOM_ICON;})
				  		.attr("x",-tailleIco/2) //-height/2
				  		.attr("y",-tailleIco/2) //-width/2
				  		.attr("transform", function(d) {
					          return "rotate(" + (-d.x+90) + ")";
					     })
                    	.attr("width", tailleIco)
                    	.attr("height", tailleIco);

                secteur_circle1.attr("opacity","0.0")
							  		.transition()
							  		.delay(function(d,i){ return i*40; })
							  		.duration(500)
							  		.attr("opacity","1.0");

				var secteur_circle2 = svg_circle2.selectAll(".secteur")
				      .data(secteurs_in.slice(1)) // cut out the root node, we don't need it
					    .enter()
					    	.append("g")
					      	.attr("class", "secteur")
					      	.attr("secteur_id", function(d){ return d.propreties.ID_SECTEUR; })
					      	.attr("secteur_nom", function(d){ return d.propreties.NOM_SECTEUR; })
					      	.on("mouseover",afficherNomSecteur,false)
				    		.on("mouseout",unHoverSecteur,false)
				    		.on("click", secteur.selectionSecteur,false)
					      	.attr("transform", function(d) {
					          return "rotate(" + (d.x - 90) + ") translate(" + d.y + ")";
					      	});

				//Cercles interieur
				secteur_circle2.append("circle")
				    .attr("r", function(d) { return radiusScale(d.size); });
				
				secteur_circle2.append("svg:image")
				  		.attr("xlink:href", function(d){ return "./svg/"+d.propreties.NOM_ICON;})
				  		.attr("x",-tailleIco/2) //-height/2
				  		.attr("y",-tailleIco/2) //-width/2
				  		.attr("transform", function(d) {
					          return "rotate(" + (-d.x+80) + ")";
					     })
                    	.attr("width", tailleIco)
                    	.attr("height", tailleIco);

                secteur_circle2.attr("opacity","0.0")
							  		.transition()
							  		.delay(function(d,i){ return 800+i*40; })
							  		.duration(500)
							  		.attr("opacity","1.0");

				$( window ).resize(function() {
					w = $('.content').width(); 
					h = $('.content').height();
					console.log("coucou");
					d3.select("#svg_circles")
						.attr("width", w)
			    		.attr("height", h);
					svg_circle1.attr("transform", "translate(" + (w / 2) + "," + (h / 2) + ")scale("+h/700+")");
					svg_circle2.attr("transform", "translate(" + (w / 2) + "," + (h / 2) + ") rotate("+360/39+")scale("+h/700+")");
				});

			});

			//La recherche Live, déclaré après l'init du d3

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

				d3.select(this.children[1]).attr("xlink:href", function(d){ return "./svg/Blanc/"+d.propreties.NOM_ICON;});

				d3.select(this).classed("secteurHover",true);
				selectPlaceholder.value = this.getAttribute('secteur_nom');
			};

			function unHoverSecteur(){
				d3.select(this).classed("secteurHover",false);

				d3.select(this.children[1]).attr("xlink:href", function(d){ return "./svg/"+d.propreties.NOM_ICON;});

				selectPlaceholder.value = ph_current_value;
			};

		}

	};

  	return {
    	init : secteur.init
  	};
});