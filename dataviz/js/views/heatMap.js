// Filename: views/Select
define([
  'jquery',
  'd3',
  'underscore',
  'backbone',
  'views/renderHeatMap',
  'text!../../templates/heatMap-template.html',
  'text!../../templates/heatMapItem-template.html'
], function($, d3, _, Backbone, Map, templateHeatMap, templateHeatMapItem){

  Handlebars.registerHelper('if_eq', function(a, b, opts) {
      if(a == b) // Or === depending on your needs
          return opts.fn(this);
      else
          return opts.inverse(this);
  });

  var map = Backbone.View.extend({
    el: '.content',
    template: Handlebars.compile(templateHeatMap), 
    templateItem: Handlebars.compile(templateHeatMapItem), 
    render: function(options){
      var self = this;
      
      if(heatMap==false){
        var items = JSON.parse(localStorage.getItem(options.donnee));
        self.$el.html(self.template(options));
        var i=0;
        $.each(items, function(index, value) {
            $('.choix_categorie').append('<a href="#/C/'+options.donnee+'/'+options.secteur+'/'+value.url+'"><p class="btnChoixHeatMap '+ value.url+'">'+value.nom+'</p></a>');
          if(value.url==options.itemC)
            $('.btnChoixHeatMap').eq(i).addClass('activeItem');
          i++;
        }); 
        Map.init({
          id: '#map',
          infosid: '#infosDepartements',
          nomDuTheme: options.donnee.toUpperCase(),
          secteurChoisi: localStorage.getItem('idSecteur'),
          parametre: options.itemC,
          rendered: function(){
            heatMap=true;
          }
        });
      }
      else{
        Map.init({
          id: '#map',
          infosid: '#infosDepartements',
          nomDuTheme: options.donnee.toUpperCase(),
          secteurChoisi: localStorage.getItem('idSecteur'),
          parametre: options.itemC,
          status: 'update'
        });
      }      
      
      //this.d3=d3.select(this.el);
    }
  });

  return map;
});