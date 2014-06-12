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
			nomDuTheme: 'EMPLOI',
			secteurChoisi: '2',
			parametre:'nb_employes',
			width: $('.content').width(),
			height:  $('.content').height()-1,
			status: '',
			rendered : function(){}
		},

		init : function(options){
			map.params=$.extend(map.defaults,options);
			if(map.params.status=='update')
				map.majCarte();			
			else
				map.initialize();
		},

		maxVal : function(array){
			//Fonction max custom pour les départements
	     	var maxVal = 0;
	     	//console.log(newArray);
	     	for(var i=0; i<Object.keys(array).length; i++)
	     	{
	     		var y;
	     		y = i+1;
	     		if (y<10)
	     			y="0"+y;
	     		else if(y == 96)
	     			y="2A";
	     		else if(y == 97)
	     			y="2B";
	     		// La seul erreur vient du departement 20 qui n'existe pas, c'est le undefined

	     		if (array[y] == undefined){
	     			console.log("MaxValue encounter an Undefined value : "+y);
	     		}else{
	     			if( parseInt(array[y].replace(" ",""))>maxVal )
	     				maxVal = parseInt(array[y].replace(" ",""));
	     		}
	     	}
	     	return maxVal;
		},

		changerCarte : function(leCSV, deps, path){
			// afficher le loader

		  	var donneesCsv = [];
			d3.csv(leCSV,function(data){
				donneesCsv = data;

			  	// donneesCsv[CodeSecteur-1][CodeDept]
			  	// console.log(donneesCsv["10"]["13"])
			  	map.afficherCarte(donneesCsv, deps, path);
			});
		},

		afficherCarte: function(donneesCsv, deps, path){
			/*
			* On charge les données GeoJSON
			*/
			d3.json('json/departements.json', function(req, geojson) {

			//Supprimer Loader
			
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
		  	var color = d3.scale.linear()
					.domain([0, map.maxVal(donneesCsv[map.params.secteurChoisi-1])])
					.range(["#f1f1f1","#0078FF"]); //#AED4FE"

		  	/*
		     * Pour chaque entrée du tableau feature, on
		     * créait un élément SVG path, avec les
		     * propriétés suivantes
		     */
		  	features.enter()
			  	.append("path")
			  		.attr('class', 'departementHM')
			  		.attr('fill', function(d) { 
			  			if (donneesCsv[map.params.secteurChoisi-1][d.properties.CODE_DEPT] == null | "NC" | undefined | "" || isNaN(donneesCsv[map.params.secteurChoisi-1][d.properties.CODE_DEPT]) ){
			  				console.log("Undefined or NULL at "+(map.params.secteurChoisi-1)+":"+d.properties.CODE_DEPT);
			  				return "#ccc";
			  			}
			  			return color(parseInt(donneesCsv[map.params.secteurChoisi-1][d.properties.CODE_DEPT].replace(" ",""))); 
			  		})
			      	.attr("d", path)
			      	.attr("nom_dept", function(d){ return d.properties.NOM_DEPT; })
			      	.attr("num_dept", function(d){ return d.properties.CODE_DEPT; })
			      	.attr("value",function(d){ 
			      		if (donneesCsv[map.params.secteurChoisi-1][d.properties.CODE_DEPT] == null | "NC" | undefined | "" || isNaN(donneesCsv[map.params.secteurChoisi-1][d.properties.CODE_DEPT]) ){
			  				return "Indisponible";
			  			}
			      		return donneesCsv[map.params.secteurChoisi-1][d.properties.CODE_DEPT];
			      	})
			      	.attr("fill-opacity","0.0")
			      	.attr("stroke-opacity","0.0")
			      	.attr("transform", "scale(2.0)translate("+-map.params.width/4+","+-map.params.height/4+")")
			      	//.on('click', countyClickHandler);
			      	.on('mouseover', function(d){
			      		//d3.select(this).classed('dept_hover',true);

			      		var centroid = path.centroid(d);

			      		var nom_departement = d.properties.NOM_DEPT;

			      		d3.select(map.params.infosid)
			      			.append("div")
		  						.attr("class","text_nom_dept2")
		  						.html("<h3>"+nom_departement+"</h3><hr /><p>"+this.getAttribute("value")+"</p>")
		  						//.style("top",centroid.top+height/2+"px")
		  						//.style("left",centroid.left-30+width/2+"px");
		  						.style("top",function(){ 
		  													//console.log(this.offsetHeight*3);
															var value = centroid[1]-this.offsetHeight*1.3;
															if(map.params.zoomed)
																value *= scaleZoom/2;
															return value+"px";
														})
		  						.style("left",function(){ 
		  													var value = centroid[0];
		  													if(map.params.zoomed)
																value *= scaleZoom/2;
		  													return value+"px";
		  												})
		  						.style("margin-left", function(){ return -this.offsetWidth/2+"px"; } );
			      	})
			      	.on('mouseout', function(){
			      		//d3.select(this).classed('dept_hover',false);

			      		d3.select(map.params.infosid).select("div").remove();
			      	})
			      	//.on('click', choisirDepartement)

			      	.transition()
			  			.delay(function(d,i){ return i*10; })
			  			.duration(500)
			  			.attr("fill-opacity","1.0")
			  			.attr("stroke-opacity","1.0")
			  			.attr("transform", "scale(1)");

			});
			map.params.rendered.call(this);
		},

		initialize: function(){
			
			var scaleDeLaCarte = 3.5*map.params.height;
			var scaleZoom = 4;

			// Les 3 valeurs là sont celles à changer pour faire varier le graph

			var nom_du_CSV = 'json/'+map.params.nomDuTheme+'_'+map.params.parametre+'.csv'; //Nb employés
		 	 /* 
		  	 * On créait un nouvel objet path qui permet 
		   	* de manipuler les données géographiques.
		   	*/
		  	var path = d3.geo.path();

		  	// On définit les propriétés de la projection à utiliser
		  	var projection = d3.geo.mercator();

		  
		  		
			projection
        		.center([2.454071, 46.279229]) // On centre la carte sur la France
        		.scale(scaleDeLaCarte)
      			.translate([map.params.width / 2, map.params.height / 2]);

	        path.projection(projection);
		  
		   // On assigne la projection au path

		  	/*
		  	* On créait un nouvel élément svg à la racine de notre div #map,
		   	* définie plus haut dans le HTML
		   	*/
		  	var svg = d3.select(map.params.id).append("svg")
	      		.attr("width", map.params.width)
	      		.attr("height", map.params.height);

		  	/*
		  	 * On créait un groupe SVG qui va accueillir
		   	* tous nos départements
		   	*/
		  	var deps = svg.append("g")
		    	.attr("id", "departements");

		  	// Appel de la fonction pour initialiser
		 	map.changerCarte(nom_du_CSV, deps, path);
		},

		majCarte: function() {
			console.log('majCarte');
			var nomDuCSV = 'json/'+map.params.nomDuTheme+'_'+map.params.parametre+'.csv'; //Nb employés
			d3.csv(nomDuCSV,function(data){
				//Fonction asynchrone
			  	map.afficherNouvelleCarte(data);
			});

		},

		afficherNouvelleCarte: function(donneesCsv){
			//La couleur est encore à définir en fonction de l'onglet
		  	var color = d3.scale.linear()
				.domain([0, map.maxVal(donneesCsv[map.params.secteurChoisi-1])])
				.range(["#f1f1f1","red"]); //#AED4FE"
			d3.selectAll(".departementHM")
				.transition()
				.duration(500)
		  		.attr('fill', function(d) { 
		  			if (donneesCsv[map.params.secteurChoisi-1][d.properties.CODE_DEPT] == null | "NC" | undefined | "" || isNaN(donneesCsv[map.params.secteurChoisi-1][d.properties.CODE_DEPT]) ){
		  				console.log("Undefined or NULL at "+(map.params.secteurChoisi-1)+":"+d.properties.CODE_DEPT);
		  				return "#ccc";
		  			}
		  			return color(parseInt(donneesCsv[map.params.secteurChoisi-1][d.properties.CODE_DEPT].replace(" ",""))); 
		  		})
		      	.attr('value', function(d){ 
		      		if (donneesCsv[map.params.secteurChoisi-1][d.properties.CODE_DEPT] == null | "NC" | undefined | "" || isNaN(donneesCsv[map.params.secteurChoisi-1][d.properties.CODE_DEPT]) ){
		  				return "Indisponible";
		  			}
		      		return donneesCsv[map.params.secteurChoisi-1][d.properties.CODE_DEPT];
		      	});


		}
	};

  	return {
    	init : map.init
  	};
});