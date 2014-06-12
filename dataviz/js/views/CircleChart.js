// Filename: views/Select
define([
  'jquery',
  'd3',
  'underscore',
  'backbone',
  'views/renderCircleChart',
  'text!../../templates/circleChart-template.html'
], function($, d3, _, Backbone, CircleChart, templateCircleChart){


  var circleChart = Backbone.View.extend({
    el: '.content',
    circleChart : '#circleChart',
    template: Handlebars.compile(templateCircleChart),   
    render: function(options){
      var self = this;
      var items = JSON.parse(localStorage.getItem(options.donnee));
      self.$el.html(self.template(options));
      $.each(items, function(index, value) {
         $('.choix_categorie').append('<a href="#/A/'+options.donnee+'/'+options.departement+'/'+value.url+'"><p class="btnChoixHeatMap">'+value.nom+'</p></a>');
      }); 
      CircleChart.init({
        id: self.circleChart
      });
    }
  });

  return circleChart;
});