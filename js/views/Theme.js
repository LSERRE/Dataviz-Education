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
          console.log(result);
          // departement in localstorage
          /*var departementUrl = findType('departements', dep, 'url');
          if(departementUrl){
            localStorage.setItem('urlDepartement', departementUrl[0]);
            localStorage.setItem('nomDepartement', dep);
            localStorage.setItem('codeDepartement', departementUrl[2]);
            // redirection
            if(options.donnee){
              // route A
              glob.router.navigate('#/A/'+options.donnee+'/'+departementUrl[0]+'/employes', {trigger: true});
            }
            else{
              // route B
              glob.router.navigate('#/B/'+departementUrl[0], {trigger: true});
            }
          }*/
          
        }
      });
    }
  });

  return theme;
});