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
      self.$el.html(self.template(options));
      CircleChart.init({
        id: self.circleChart
      });
    }
  });

  return circleChart;
});