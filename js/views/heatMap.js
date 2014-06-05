// Filename: views/Select
define([
  'jquery',
  'd3',
  'underscore',
  'backbone',
  'views/renderHeatMap'
], function($, d3, _, Backbone, Map){

  var map = Backbone.View.extend({
    el: '.map',   
    render: function(options){
      if(options.donnee && options.secteur){
        var self = this;
        var divParent = $("<div>", {class: "map page"});
        $('.content').append(divParent);
        var divEnfant1 = $("<div>", {id : 'map'});
        var divEnfant2 = $("<div>", {id : 'infosDepartements'});
        divParent.append(divEnfant1);
        divParent.append(divEnfant2);
        Map.init({
          id: '#map',
          infosid: '#infosDepartements',
          nomDuTheme: 'EMPLOI',
          secteurChoisi: '2',
          parametre:'nb_employes',
        });
        this.d3=d3.select(this.el);
      }
      //glob.router.navigate('#/B', {trigger: true});
    }
  });

  return map;
});