// Filename: views/Select
define([
  'jquery',
  'd3',
  'underscore',
  'backbone',
  'views/renderHeatMap',
  'text!../../templates/heatMap-template.html'
], function($, d3, _, Backbone, Map, templateHeatMap){

 

  var map = Backbone.View.extend({
    el: '.content',
    template: Handlebars.compile(templateHeatMap), 
    render: function(options){
      var self = this;
      self.$el.html(self.template(options));          
      Map.init({
        id: '#map',
        infosid: '#infosDepartements',
        nomDuTheme: 'EMPLOI',
        secteurChoisi: '2',
        parametre:'nb_employes',
      });
      //this.d3=d3.select(this.el);
    }
  });

  return map;
});