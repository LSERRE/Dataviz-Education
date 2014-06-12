// Filename: views/Home
define([
  'jquery',
  'd3',
  'underscore',
  'backbone',
  'text!../../templates/bar-template.html'
], function($, d3, _, Backbone, templateBar){
  var bar = Backbone.View.extend({
    el: '.content',
    bar : '.emploiBar',
    template: Handlebars.compile(templateBar), 
    render: function(options){
      var self = this;
      self.$el.html(self.template(options));
      var items = JSON.parse(localStorage.getItem(options.theme));
      console.log(items);
      self.$el.html(self.template(options));
      $.each(items, function(index, value) {
        $('.emploiBar').append('<section class="dataBar"><div class="containerBar"><div class="bar average" data-value="30%" data-number="450000"><div class="middle"><span>france : 450 000</span></div></div><div class="bar item" data-value="34%" data-number="500430" data-color="'+value.color+'"><span></span></div></div><h1>'+value.nom+'</h1></section>');
      });
      $('.dataBar').each(function(index){
        var averageBar = $(this).find('.average');
        var averageNumber = averageBar.find('span');
        var itemBar = $(this).find('.item');
        var itemNumber = itemBar.data('number');
        
        
        averageBar.height(averageBar.data('value')).addClass('animationBar').one('webkitAnimationEnd oanimationend msAnimationEnd animationend', function(e){
            averageNumber.addClass('labelBar');
            e.stopPropagation();
            itemBar.css('background-color', itemBar.data('color'));
            itemBar.height(itemBar.data('value')).addClass('animationBar');
            var temp=0;
            var iteration = itemNumber/40;
            // itemNumber <-> 2 secondes ; itemNumber/2 <-> 1 seconde ; itemNumber/(2*10) <-> 0,1 seconde ; itemNumber/(2*10*2) <-> 0,05 seconde
            //var iteration = 1.040;
            //console.log(itemNumber+' '+averageBar.height()+' '+iteration);
            var count= setInterval(function(){

              temp+=iteration;
              itemBar.find('span').text(parseInt(temp));
              if(temp>=itemNumber){
                clearInterval(count); 
                itemBar.find('span').text(itemNumber);
              }             
            }, 50);
          }
        );
      });


    }
  });

  return bar;
});