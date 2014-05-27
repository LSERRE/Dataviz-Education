// Filename: views/Select
define([
  'jquery',
  'd3',
  'underscore',
  'backbone',
  'text!../../templates/select-template.html'

], function($, d3, _, Backbone, _Select){

  var _Select = Backbone.View.extend({
    el: '.page',
    template: Handlebars.compile(_Select),
    render: function(options){
      var self = this;
      self.$el.html(self.template(''));
    }
  });

  return _Select;
});