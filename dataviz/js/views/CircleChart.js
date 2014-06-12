// Filename: views/Select
define([
  'jquery',
  'd3',
  'underscore',
  'backbone',
  'views/renderCircleChart',
  'text!../../templates/circleChart-template.html'
], function($, d3, _, Backbone, CircleChart, templateCircleChart){


  var circleChart = Backbone.View.extend({
    el: '.content',
    circleChart : '#circleChart',
    template: Handlebars.compile(templateCircleChart),   
    render: function(options){
      var self = this;
      if(statusCircleChart==false){
        console.log('circleChart');
        var items = JSON.parse(localStorage.getItem(options.donnee));
        self.$el.html(self.template(options));
        var i=0;
        $.each(items, function(index, value) {
          var element = $('.choix_categorie').append('<a href="#/A/'+options.donnee+'/'+options.departement+'/'+value.url+'"><p class="btnChoixHeatMap">'+value.nom+'</p></a>');
          if(value.url==options.itemA)
            $('.btnChoixHeatMap').eq(i).addClass('activeItem');
          i++;
        }); 
        CircleChart.init({
          id: self.circleChart,
          nomDuTheme: options.donnee.toUpperCase(), //Valeur par défaut qui doive être réécrite
          deptChoisi: localStorage.getItem('codeDepartement'),
          parametre: options.itemA,
        });
        statusCircleChart=true;
      }
      else{
        console.log(statusCircleChart);
        console.log('la');
        CircleChart.init({
          id: self.circleChart,
          nomDuTheme: options.donnee.toUpperCase(), //Valeur par défaut qui doive être réécrite
          deptChoisi: localStorage.getItem('codeDepartement'),
          parametre: options.itemA,
          status:'update'
        });
      }
    }
  });

  return circleChart;
});