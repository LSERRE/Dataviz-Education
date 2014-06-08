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
          localStorage.setItem('departement', dep);

          // redirection
          if(options.donnee){
            // route A
            glob.router.navigate('#/A/'+options.donnee+'/'+dep, {trigger: true});
          }
          else{
            // route B
            glob.router.navigate('#/B/'+dep, {trigger: true});
          }
          
        }
      });
    }
  });

  return map;
});