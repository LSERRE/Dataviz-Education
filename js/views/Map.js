// Filename: views/Select
define([
  'jquery',
  'd3',
  'underscore',
  'backbone',
  'views/renderMap',
  'text!../../templates/map-template.html'
], function($, d3, _, Backbone, Map, templateMap){

  var map = Backbone.View.extend({
    el: '.content',   
    template: Handlebars.compile(templateMap), 
    render: function(options){
      $('.titleContainer h2').html('Choisissez un type de visualisation');
      var self = this;
      self.$el.html(self.template(options)); 
      Map.init({
        id: '#map',
        infosid: '#infosDepartements',
        choix: function(dep, code){
          // update sidebar
          $('.choise').eq(0).html(code);
          // departement in localstorage
          var departementUrl = findType('departements', dep, 'url');
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
          }
          
        }
      });
    }
  });

  return map;
});