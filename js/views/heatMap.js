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
    el: '.items',  
    template: Handlebars.compile(templateHeatMap), 
    render: function(options){
      var self = this;
      if(options.donnee && options.secteur){        
        var divParent = $("<div>", {class: "map page"});
        $('.content').prepend(divParent);
        var divEnfant1 = $("<div>", {id : 'map'});
        var divEnfant2 = $("<div>", {id : 'infosDepartements'});
        divParent.prepend(divEnfant1);
        divParent.prepend(divEnfant2);
        Map.init({
          id: '#map',
          infosid: '#infosDepartements',
          nomDuTheme: 'EMPLOI',
          secteurChoisi: '2',
          parametre:'nb_employes',
        });
        self.$el.html(self.template(''));
        //this.d3=d3.select(this.el);
      }
      //glob.router.navigate('#/B', {trigger: true});
    }
  });

  return map;
});