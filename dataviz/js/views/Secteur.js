// Filename: views/Select
define([
  'jquery',
  'd3',
  'underscore',
  'backbone',
  'views/renderSecteur'
], function($, d3, _, Backbone, Secteur){

  var secteur = Backbone.View.extend({
    el: '#containerSecteur',   
    render: function(options){
        var self = this;
        var divParent = $("<div>", {id: "containerSecteur"});
        $('.content').append(divParent);
        var divEnfant1 = $("<div>", {id: "svgSecteur"});
        divParent.append(divEnfant1);
        var divEnfant2 = $("<div>", {id : 'infosSecteurs'});
        divParent.append(divEnfant2);
        var input = $('<input>', {type:"text", placeholder:"Nom du secteur"});
        divEnfant2.append(input);
        var p = $('<p>', {text:"Pour faire apparaitre le nom d'un secteur, passez votre souris sur l'icone correspondante"});
        divEnfant2.append(p);
       
        Secteur.init({
          id: "#svgSecteur",
          outer_circle_radius: 550/2,
          inner_circle_radius: 450/2,
          choix: function(nom, code){
            // sidebar
            $('.choise').eq(1).children().html(code);
            // sector in localstorage
            var secteurUrl = findType('secteurs', nom, 'url');
            if(secteurUrl){

              localStorage.setItem('urlSecteur', secteurUrl[0]);
              localStorage.setItem('nomSecteur', nom);
              localStorage.setItem('imgSecteur', secteurUrl[1]);
              localStorage.setItem('idSecteur', secteurUrl[3]);
                // redirection
              if(options.departement){
                // route B
                glob.router.navigate('#/B/'+options.departement+'/'+secteurUrl[0]+'/emploi', {trigger: true});
              }
              else{
                if(options.donnee=='bienetre')
                  var itemDefault = 'temps-libre';
                else if(options.donnee=='emploi')
                  var itemDefault = 'employes';
                else
                  var itemDefault = 'population-activite';
                 // route C
                glob.router.navigate('#/C/'+options.donnee+'/'+secteurUrl[0]+'/'+itemDefault, {trigger: true});
              }
            }
          }
        });
      }
      //glob.router.navigate('#/B', {trigger: true});
  });

  return secteur;
});