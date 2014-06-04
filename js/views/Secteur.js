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
          console.log(code);
          $('.choise').eq(1).html(code);
          divParent.remove();
          glob.router.navigate('#B/'+nom, {trigger: true});
        }
      });
      console.log('bug ?');
      this.d3=d3.select(this.el);
      //glob.router.navigate('#/B', {trigger: true});
    }
  });

  return secteur;
});