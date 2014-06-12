// Filename: views/Select
define([
  'jquery',
  'd3',
  'underscore',
  'backbone',
  'text!../../templates/select-template.html'

], function($, d3, _, Backbone, Select){

  var select = Backbone.View.extend({
    el: '.page',
    template: Handlebars.compile(Select),
    render: function(options){
      var self = this;
      //self.$el.html(self.template(''));
      
        console.log(options);
      //glob.router.navigate('#/B', {trigger: true});
    }
  });

  return select;
});