var glob = {};

define([
  'jquery',
  'underscore',
  'backbone',
  'handlebars',
  'views/standardView',
  'views/Home',
  'views/Select',
], function($,  _, Backbone, Handlebars, StandardView, Home, _Select) {

  // Our router
  var Router = Backbone.Router.extend({
    routes : {
      '': 'home',
      'select': 'select'
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


    Backbone.history.start();
  };
  
  return { 
    initialize: initialize
  };
});