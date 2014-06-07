// Filename: views/Select
define([
  'jquery',
  'd3',
  'underscore',
  'backbone',
  'views/renderHeatMap',
  'text!../../templates/heatMap-template.html'
], function($, d3, _, Backbone, Map, heatMap){

  var map = Backbone.View.extend({
    el: '.map',  
    template: Handlebars.compile(heatMap), 
    render: function(options){
      var self = this;
      if(options.donnee && options.secteur){        
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
        console.log(self.template);
        self.$el.html(self.template(''));
        //this.d3=d3.select(this.el);
      }
      //glob.router.navigate('#/B', {trigger: true});
    }
  });

  return map;
});