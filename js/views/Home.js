// Filename: views/Home
define([
  'jquery',
  'd3',
  'underscore',
  'backbone',
  'text!../../templates/home-template.html'

], function($, d3, _, Backbone, Home){

  var Home = Backbone.View.extend({
    el: '.page',
    template: Handlebars.compile(Home),
    render: function(options){
      var self = this;
      self.$el.html(self.template(''));
    }
  });

  return Home;
});