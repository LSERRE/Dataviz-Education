// Filename: views/Select
define([
  'jquery',
  'd3',
  'underscore',
  'backbone',
  'views/renderHeatMap',
  'text!../../templates/heatMap-template.html'
], function($, d3, _, Backbone, Map, templateHeatMap){

  Handlebars.registerHelper('if_eq', function(a, b, opts) {
      if(a == b) // Or === depending on your needs
          return opts.fn(this);
      else
          return opts.inverse(this);
  });
  var map = Backbone.View.extend({
    el: '#items',  
    map : '#map',
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
        // items underneath map
        var divItems = $("<div>", {id: "items"});
        $('.content').append(divItems);

        Map.init({
          id: self.map,
          infosid: '#infosDepartements',
          nomDuTheme: 'EMPLOI',
          secteurChoisi: '2',
          parametre:'nb_employes',
        });
        divItems.html(self.template(options));
        //this.d3=d3.select(this.el);
      }
      //glob.router.navigate('#/B', {trigger: true});
    }
  });

  return map;
});