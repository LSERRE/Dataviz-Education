var glob = {};

define([
  'jquery',
  'underscore',
  'backbone',
  'handlebars',
  'views/standardView',
  'views/Home',
  'views/Select',
  'views/Emploi'
], function($,  _, Backbone, Handlebars, StandardView, Home, _Select, Emploi) {

  // Our router
  var Router = Backbone.Router.extend({
    routes : {
      '': 'home',
      'select': 'select',
      'emploi': 'emploi'
    }
  });
  
  var initialize = function(){
    // Listen the routes
    var router = new Router();
    var view = new StandardView();

    glob.router = router;
    router.on('route:home', function(){
      var home = new Home();
      home.render();
    });
    router.on('route:select', function(){
      var select = new _Select();
      select.render();
    });
    router.on('route:emploi', function(){
      var emploi = new Emploi();
      emploi.render();
    });


    Backbone.history.start();
  };
  
  return { 
    initialize: initialize
  };
});