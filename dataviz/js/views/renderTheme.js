define([
  'jquery',
  'd3',
  'underscore',
  'backbone',
  'handlebars',
], function($, d3, _, Backbone, Handlebars){
  	var donnees = {
        defaults : {
          choixId: '#choixThemes',
          itemId: '.btnTheme',
          descriptionId: '#descriptionTheme',
          validerId: '#valider_item',
          flecheG:'#previous_item',
          flecheD:'#next_item',
          rendered: function(){}
        },

        init : function(options){
          donnees.params=$.extend(donnees.defaults,options);
          donnees.initialize();
        },


        initialize: function(){
      
          var data = {
            name : "themes",
            children : [
              { name: 'EMPLOI', url:'emploi' },
              { name: 'SOCIETE', url:'societe' },
              { name: 'BIENETRE', url:'bien-etre' },
            ]
          }
          //console.log(localStorage.getItem('donnees'));
          var w = 600;
          var h = 600;

          var returnValue = "emploi";
          
          var radius = 400/2;
          
          var tree = d3.layout.tree()
                    .size([360, radius]);
          
          var dataTree = {
              children: data.children.map(function(d) { return d; })
          };
          
          var dataThemes = tree.nodes(dataTree); //ICI ça bug, je sais pas pourquoi...

          var lesChoix = d3.select(donnees.params.choixId)
                          .append("svg")
                          .attr("width",w)
                          .attr("height",h)
                            .append("g")
                            .attr("opacity","0.0")
                            .attr("transform", "translate(" + (w / 2) + "," + (h / 2) + ") rotate(180)"); //center the circle
          lesChoix.append("circle")
                  .attr("r",radius+25)
                  .attr("fill","none")
                  .attr("stroke","#404953")
                  .attr("stroke-width","1")
                  .attr("stroke-dasharray","4,4");
          

          var items = lesChoix.selectAll(donnees.params.itemId)
                      .data(dataThemes.slice(1))
                        .enter()
                          .append("use").attr("xlink:href",function(d,i){return "#halfcircle"+i;})
                          //.attr("x", 228)
                          //.attr("y",53)
                          .attr("nom_theme", function(d){ return d.name; })
                          .attr("url_theme", function(d){ return d.url; })
                          .attr("class","btnTheme")
                          .attr("transform", function(d) {
                              return "rotate(" + (d.x) + ") translate(" + d.y + ")";
                          })
                          .on("click", tournerRoueAt, false);

          lesChoix.transition()
              .duration(1000)
              .attr("opacity","1.0")
              .attr("transform","translate(" + (w / 2) + "," + (h / 2) + ") rotate("+30+")");

          d3.select(donnees.params.validerId).on("click",function(){  
            if(!returnValue)
              returnValue = 'emploi';
            donnees.params.rendered.call(this, returnValue);
            //Jeremy, ici l'ID du secteur est retourné via returnValue
          });

          document.onkeydown=function (e)
          {
            e=e || window.event;
            var code=e.keyCode || e.which;  
            //Gauche & Haut
            if (code==37 || code==38){
              e.preventDefault();
              tournerG();
            }
            //Droite & Bas
            if (code==39 || code==40){
              e.preventDefault();
              tournerD();
            }
          }

          d3.select(donnees.params.flecheG).on("click", tournerG, false);
          d3.select(donnees.params.flecheD).on("click", tournerD, false);

          function tournerG(){
            switch(returnValue)
            {
              case "emploi": returnValue = "societe";
              break;
              case "societe": returnValue = "bien-etre";
              break;
              case "bien-etre": returnValue = "emploi";
              break;
            }
            tournerRoueAt(true);
            return false;
          }

          function tournerD(){
            switch(returnValue)
            {
              case "emploi": returnValue = "bien-etre";
              break;
              case "bien-etre": returnValue = "societe";
              break;
              case "societe": returnValue = "emploi";
              break;
            }
            tournerRoueAt(true);
            return false;
          }

          function tournerRoueAt(at){
            //30  Emploi
            //150  Bien-être
            //270  Société
            if(at == true)
            {}  //No need to specify a value, it's returnValue
            else{
              returnValue = this.getAttribute("url_theme");
            }
            var text = "";

            var degree = 30;
            switch(returnValue)
            {
              case "emploi": degree = 30;
              text = "Lorem Elsass ipsum in, Richard Schirmeck kartoffelsalad Gal ! suspendisse nullam leverwurscht pellentesque amet eget elementum dignissim chambon Morbi sit mänele baeckeoffe Salu bissame lacus hopla so merci vielmols und ac picon bière libero. blottkopf, tchao bissame Yo dû. kuglopf messti de Bischheim Verdammi id libero, id, amet s'guelt hoplageiss schneck leo quam. senectus non Gal.  ";
              break;
              case "societe": degree = 270;
              text = "schpeck knepfle jetz gehts los Oberschaeffolsheim eleifend lotto-owe météor turpis tristique ullamcorper sit elit auctor, hopla rhoncus habitant porta geïz ornare nüdle wie sagittis flammekueche sit placerat condimentum consectetur Chulia Roberstau Salut bisamme dui risus, ac wurscht geht's tellus ornare libero, bredele ante Huguette morbi bissame mamsell rossbolla Hans gravida turpis, sed Pellentesque vielmols, Racing.";
              break;
              case "bien-etre": degree = 150;
              text = "Heineken Carola commodo Oberschaeffolsheim rucksack tellus et dolor Mauris kougelhopf Christkindelsmärik semper aliquam hopla Strasbourg varius mollis schnaps hopla hop munster yeuh. gewurztraminer quam, adipiscing ftomi! Wurschtsalad non Coopé de Truchtersheim purus amet, knack vulputate Spätzle salu réchime sed Chulien Miss Dahlias leo gal Pfourtz ! barapli ch'ai Kabinetpapier DNA, .";
              break;
              default:
              break;
            }

            document.getElementById("descriptionTheme").innerHTML = text;

            lesChoix.transition()
              .duration(1000)
              .attr("transform","translate(" + (w / 2) + "," + (h / 2) + ") rotate("+degree+")");
          }

        }
      };

  	return {
    	init : donnees.init
  	};
});