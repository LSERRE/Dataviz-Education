define([
  'jquery',
  'd3',
  'underscore',
  'backbone',
  'handlebars',
], function($, d3, _, Backbone, Handlebars){
  	var heatMap = {

  		defaults : {
			id: '#map',
			infosid: '#infosDepartements',
			zommed : false,
			nomDuTheme: 'EMPLOI',
			secteurChoisi: '2',
			parametre:'employes',
			width: $('.content').width(),
			height:  $('.content').height()-1,
			unite: '',
			color: '#000',
			status: '',
			rendered : function(){}
		},

		init : function(options){
			heatMap.params=$.extend(heatMap.defaults,options);
			if(heatMap.params.status=='update')
				heatMap.majCarte();			
			else
				heatMap.initialize();
		},
		/*
		correctParsing : function(leCSV){
			switch( map.params.parametre )
			{
				//Pas de secteur = Utiliser uniquement la ligne 1 :
				case "salaires-horaires-moyens":
				case "taux-chomage":
				case "population-active":
				case "retraites":
				case "logements":
				case "logements-vacants":
				case "taux-de-celibataires":
				
				break;
				//Recuperer la ligne 2 seulement
				case "densite-population":
				break;
				//Parsing normal
				default:
				break;
			}
		},
		*/
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
			$("#title_loader").show();

		  	var donneesCsv = [];
			d3.csv(leCSV,function(data){
				donneesCsv = data;

			  	// donneesCsv[CodeSecteur-1][CodeDept]
			  	// console.log(donneesCsv["10"]["13"])
			  	heatMap.afficherCarte(donneesCsv, deps, path);
			});
		},

		afficherCarte: function(donneesCsv, deps, path){
			/*
			* On charge les données GeoJSON
			*/
			d3.json('json/departements.json', function(req, geojson) {

			//Remove Loader
			$("#title_loader").fadeOut(500);
			
			console.log(heatMap.params.secteurChoisi);

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
					.domain([0, heatMap.maxVal(donneesCsv[heatMap.params.secteurChoisi-1])])
					.range(["#f1f1f1",heatMap.params.color]); //#AED4FE"

		  	/*
		     * Pour chaque entrée du tableau feature, on
		     * créait un élément SVG path, avec les
		     * propriétés suivantes
		     */
		  	features.enter()
			  	.append("path")
			  		.attr('class', 'departementHM')
			  		.attr('fill', function(d) { 
			  			if ( donneesCsv[heatMap.params.secteurChoisi-1][d.properties.CODE_DEPT] == null ||
			  				 donneesCsv[heatMap.params.secteurChoisi-1][d.properties.CODE_DEPT] == "NC" ||
			  				 donneesCsv[heatMap.params.secteurChoisi-1][d.properties.CODE_DEPT] == undefined ||
			  				 donneesCsv[heatMap.params.secteurChoisi-1][d.properties.CODE_DEPT] == "" )
						{
			  				console.log("Undefined or NULL at "+(heatMap.params.secteurChoisi-1)+":"+d.properties.CODE_DEPT);
			  				return "#ccc";
			  			}
			  			return color(parseInt(donneesCsv[heatMap.params.secteurChoisi-1][d.properties.CODE_DEPT].replace(" ",""))); 
			  		})
			      	.attr("d", path)
			      	.attr("nom_dept", function(d){ return d.properties.NOM_DEPT; })
			      	.attr("num_dept", function(d){ return d.properties.CODE_DEPT; })
			      	.attr("value",function(d){ 
			  			if ( donneesCsv[heatMap.params.secteurChoisi-1][d.properties.CODE_DEPT] == null ||
			  				 donneesCsv[heatMap.params.secteurChoisi-1][d.properties.CODE_DEPT] == "NC" ||
			  				 donneesCsv[heatMap.params.secteurChoisi-1][d.properties.CODE_DEPT] == undefined ||
			  				 donneesCsv[heatMap.params.secteurChoisi-1][d.properties.CODE_DEPT] == "" )
			  			{
			  				return "Indisponible";
			  			}
			      		return donneesCsv[heatMap.params.secteurChoisi-1][d.properties.CODE_DEPT]+heatMap.params.unite;
			      	})
			      	.attr("fill-opacity","0.0")
			      	.attr("stroke-opacity","0.0")
			      	.attr("transform", "scale(2.0)translate("+-heatMap.params.width/4+","+-heatMap.params.height/4+")")
			      	//.on('click', countyClickHandler);
			      	.on('mouseover', function(d){
			      		//d3.select(this).classed('dept_hover',true);

			      		var centroid = path.centroid(d);

			      		var nom_departement = d.properties.NOM_DEPT;

			      		d3.select(heatMap.params.infosid)
			      			.append("div")
		  						.attr("class","text_nom_dept2")
		  						.html("<h3>"+nom_departement+"</h3><hr /><p>"+this.getAttribute("value")+"</p>")
		  						//.style("top",centroid.top+height/2+"px")
		  						//.style("left",centroid.left-30+width/2+"px");
		  						.style("top",function(){ 
		  													//console.log(this.offsetHeight*3);
															var value = centroid[1]-this.offsetHeight*1.3;
															if(heatMap.params.zoomed)
																value *= scaleZoom/2;
															return value+"px";
														})
		  						.style("left",function(){ 
		  													var value = centroid[0];
		  													if(heatMap.params.zoomed)
																value *= scaleZoom/2;
		  													return value+"px";
		  												})
		  						.style("margin-left", function(){ return -this.offsetWidth/2+"px"; } );
			      	})
			      	.on('mouseout', function(){
			      		//d3.select(this).classed('dept_hover',false);

			      		d3.select(heatMap.params.infosid).select("div").remove();
			      	})
			      	//.on('click', choisirDepartement)

			      	.transition()
			  			.delay(function(d,i){ return i*10; })
			  			.duration(500)
			  			.attr("fill-opacity","1.0")
			  			.attr("stroke-opacity","1.0")
			  			.attr("transform", "scale(1)");

			});
			heatMap.params.rendered.call(this);
		},

		initialize: function(){
			
			var scaleDeLaCarte = 3.5*heatMap.params.height;
			var scaleZoom = 4;

			// Les 3 valeurs là sont celles à changer pour faire varier le graph

			var nom_du_CSV = 'json/'+heatMap.params.nomDuTheme+'_'+heatMap.params.parametre+'.csv'; //Nb employés
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
      			.translate([heatMap.params.width / 2, heatMap.params.height / 2]);

	        path.projection(projection);
		  
		   // On assigne la projection au path

		  	/*
		  	* On créait un nouvel élément svg à la racine de notre div #map,
		   	* définie plus haut dans le HTML
		   	*/
		  	var svg = d3.select(heatMap.params.id).append("svg")
	      		.attr("width", heatMap.params.width)
	      		.attr("height", heatMap.params.height);

		  	/*
		  	 * On créait un groupe SVG qui va accueillir
		   	* tous nos départements
		   	*/
		  	var deps = svg.append("g")
		    	.attr("id", "departements");

		  	// Appel de la fonction pour initialiser
		 	heatMap.changerCarte(nom_du_CSV, deps, path);
		},

		majCarte: function() {
			//Afficher Loader
			$("#title_loader").show();

			console.log('majCarte');
			var nomDuCSV = 'json/'+heatMap.params.nomDuTheme+'_'+heatMap.params.parametre+'.csv'; //Nb employés
			console.log(nomDuCSV);
			d3.csv(nomDuCSV,function(data){
				//Fonction asynchrone
				/*
				console.log(data);
				if (data.length == 1)
				{
					for(var i = 0; i<)
				}*/
			  	heatMap.afficherNouvelleCarte(data);
			});

		},

		afficherNouvelleCarte: function(donneesCsv){

			//Remove Loader
			$("#title_loader").delay(500).fadeOut(500);

			//La couleur est encore à définir en fonction de l'onglet
		  	var color = d3.scale.linear()
				.domain([0, heatMap.maxVal(donneesCsv[heatMap.params.secteurChoisi-1])])
				.range(["#f1f1f1",heatMap.params.color]); //COULEUR A METTRE ICI

			d3.selectAll(".departementHM")
				.attr('value', function(d){ 
	      			if ( donneesCsv[heatMap.params.secteurChoisi-1][d.properties.CODE_DEPT] == null ||
		  				 donneesCsv[heatMap.params.secteurChoisi-1][d.properties.CODE_DEPT] == "NC" ||
		  				 donneesCsv[heatMap.params.secteurChoisi-1][d.properties.CODE_DEPT] == undefined ||
		  				 donneesCsv[heatMap.params.secteurChoisi-1][d.properties.CODE_DEPT] == "")
		      		{
		  				return "Indisponible";
		      		}
		      		return donneesCsv[heatMap.params.secteurChoisi-1][d.properties.CODE_DEPT]+heatMap.params.unite;
		      	})
				.transition()
				.duration(500)
				.delay(function(d,i){ return 2*i; })
		  		.attr('fill', function(d) { 
	  				if ( donneesCsv[heatMap.params.secteurChoisi-1][d.properties.CODE_DEPT] == null ||
		  				 donneesCsv[heatMap.params.secteurChoisi-1][d.properties.CODE_DEPT] == "NC" ||
		  				 donneesCsv[heatMap.params.secteurChoisi-1][d.properties.CODE_DEPT] == undefined ||
		  				 donneesCsv[heatMap.params.secteurChoisi-1][d.properties.CODE_DEPT] == "")
		  			{
		  				console.log("Undefined or NULL at "+(heatMap.params.secteurChoisi-1)+":"+d.properties.CODE_DEPT);
		  				return "#ccc";
		  			}
		  			return color(parseInt(donneesCsv[heatMap.params.secteurChoisi-1][d.properties.CODE_DEPT].replace(" ",""))); 
		  		})
				;


		}
	};

  	return {
    	init : heatMap.init
  	};
});