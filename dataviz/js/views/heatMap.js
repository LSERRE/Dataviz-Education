// Filename: views/Select
define([
  'jquery',
  'd3',
  'underscore',
  'backbone',
  'views/renderHeatMap',
  'text!../../templates/heatMap-template.html',
  'text!../../templates/heatMapItem-template.html'
], function($, d3, _, Backbone, HeatMap, templateHeatMap, templateHeatMapItem){

  Handlebars.registerHelper('if_eq', function(a, b, opts) {
      if(a == b) // Or === depending on your needs
          return opts.fn(this);
      else
          return opts.inverse(this);
  });

  var heatMap = Backbone.View.extend({
    el: '.content',
    heatMap : '#map',
    template: Handlebars.compile(templateHeatMap), 
    templateItem: Handlebars.compile(templateHeatMapItem), 
    render: function(options){
      var self = this;
      if(statusHeatMap==false){
        var items = JSON.parse(localStorage.getItem(options.donnee));
        self.$el.html(self.template(options));
        var i=0;
        $.each(items, function(index, value) {
            $('.choix_categorie').append('<a href="#/C/'+options.donnee+'/'+options.secteur+'/'+value.url+'"><p class="btnChoixHeatMap '+ value.url+'">'+value.nom+'</p></a>');
          if(value.url==options.itemC)
            $('.btnChoixHeatMap').eq(i).addClass('activeItem');
          i++;
        }); 
        HeatMap.init({
          id: self.heatMap,
          infosid: '#infosDepartements',
          nomDuTheme: options.donnee.toUpperCase(),
          secteurChoisi: localStorage.getItem('idSecteur'),
          parametre: options.itemC,
          color: localStorage.getItem('colorItemC'),
          unite: localStorage.getItem('uniteItemC'),
          rendered: function(){
            statusHeatMap=true;
          },
          status:'no'
        });
      }
      else{
        $(".btnChoixHeatMap").removeClass("activeItem");
        $('.'+options.itemC).addClass('activeItem');
        HeatMap.init({
          id: self.heatMap,
          infosid: '#infosDepartements',
          nomDuTheme: options.donnee.toUpperCase(),
          secteurChoisi: localStorage.getItem('idSecteur'),
          parametre: options.itemC,
          color: localStorage.getItem('colorItemC'),
          unite: localStorage.getItem('uniteItemC'),
          status: 'update'
        });
      }      
      
      //this.d3=d3.select(this.el);
    }
  });

  return heatMap;
});