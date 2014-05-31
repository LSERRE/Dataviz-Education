// Filename: views/Home
define([
  'jquery',
  'd3',
  'underscore',
  'backbone',
  'text!../../templates/emploi-template.html'

], function($, d3, _, Backbone, emploi){

  var Emploi = Backbone.View.extend({
    el: '.emploiBar',
    render: function(options){
      var self = this;
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
            itemNumber 
            var count= setInterval(function(){

              temp+=itemNumber/380;
              itemBar.find('span').text(parseInt(temp));
              if(temp>=itemNumber){
                clearInterval(count); 
                itemBar.find('span').text(itemNumber);
              }             
            }, 1);
          }
        );
      });


    }
  });

  return Emploi;
});