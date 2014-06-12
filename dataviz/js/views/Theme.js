// Filename: views/Select
define([
  'jquery',
  'd3',
  'underscore',
  'backbone',
  'views/renderTheme',
  'text!../../templates/theme-template.html'
], function($, d3, _, Backbone, Theme, templateTheme){

  var theme = Backbone.View.extend({
    el: '.content',   
    template: Handlebars.compile(templateTheme), 
    render: function(options){
      var self = this;
      self.$el.html(self.template(options)); 
      Theme.init({
        choixId: '#choixThemes',
        itemId: '.btnTheme',
        descriptionId: '#descriptionTheme',
        validerId: '#valider_item',
        rendered: function(result){
          // update sidebar
          // theme in localstorage
          var themeName = findType('themes', result, 'nom');
          if(themeName){
            localStorage.setItem('urlTheme', result);
            localStorage.setItem('nomTheme', themeName[0]);
            // redirection
            if(options.step=='A'){
              // route A
              glob.router.navigate('#/A/'+result, {trigger: true});
            }
            if(options.step=='C'){
              // route C
              glob.router.navigate('#/C/'+result, {trigger: true});
            }
          }
        }
      });
    }
  });

  return theme;
});