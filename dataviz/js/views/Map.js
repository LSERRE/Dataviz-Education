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
      var self = this;
      self.$el.html(self.template(options)); 
      Map.init({
        id: '#map',
        infosid: '#infosDepartements',
        choix: function(dep, code){
          // update sidebar
          $('.choise').eq(0).children().html(code);
          // departement in localstorage
          var departementUrl = findType('departements', dep, 'url');
          if(departementUrl){
            localStorage.setItem('urlDepartement', departementUrl[0]);
            localStorage.setItem('nomDepartement', dep);
            localStorage.setItem('codeDepartement', departementUrl[2]);
            // redirection
            if(options.donnee){
              var urlDefault;
              var nomDefault;
              var colorDefault;
              var uniteDefault;
              if(options.donnee=='bienetre'){
                urlDefault = 'temps-libre';
                nomDefault = 'Temps libre';
                uniteDefault = 'min';
                colorDefault = '#0078FF';
              }
              else if(options.donnee=='emploi'){
                urlDefault = 'employes';
                nomDefault = 'Employés';
                uniteDefault = '';
                colorDefault = '#0078FF';
              }
              else{
                urlDefault = 'Population active';
                nomDefault = 'population-active';
                uniteDefault = '';
                colorDefault = '#0078FF';
              }
              // route A
              localStorage.setItem('urlItemA', urlDefault);
              localStorage.setItem('nomItemA', nomDefault);
              localStorage.setItem('uniteItemA', uniteDefault);
              localStorage.setItem('colorItemA', colorDefault);
              glob.router.navigate('#/A/'+options.donnee+'/'+departementUrl[0]+'/'+urlDefault, {trigger: true});
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