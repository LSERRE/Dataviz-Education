// Filename: views/Select
define([
  'jquery',
  'd3',
  'underscore',
  'backbone',
  'views/renderMap'
], function($, d3, _, Backbone, Map){

  var map = Backbone.View.extend({
    el: '#map',   
    render: function(options){
      $('.titleContainer h2').html('Choisissez un type de visualisation');
      var self = this;
      var divParent = $("<div>", {class: "map page"});
      $('.content').prepend(divParent);
      var divEnfant1 = $("<div>", {id : 'map'});
      var divEnfant2 = $("<div>", {id : 'infosDepartements'});
      divParent.append(divEnfant1);
      divParent.append(divEnfant2);
      Map.init({
        id: self.el,
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
              glob.router.navigate('#/A/'+options.donnee+'/'+departementUrl[0], {trigger: true});
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