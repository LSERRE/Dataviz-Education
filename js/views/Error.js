// Filename: views/Home
define([
  'jquery',
  'd3',
  'underscore',
  'backbone',
  'text!../../templates/error-template.html'

], function($, d3, _, Backbone, Error){

  var error = Backbone.View.extend({
    el: 'body',
    template: Handlebars.compile(Error),
    render: function(options){
      var self = this;
      console.log(Error);
      self.$el.prepend(self.template(''));
    }
  });

  return error;
});