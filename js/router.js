var glob = {};

define([
  'jquery',
  'd3',
  'underscore',
  'backbone',
  'handlebars',
  'views/users/ListView',
  'views/users/EditView'
], function($, d3, _, Backbone, Handlebars, UserList, EditView) {

  // Our router
  var Router = Backbone.Router.extend({
    routes : {
      '': 'home',
      'new': 'editUser',
      'edit/:id': 'editUser'
    }
  });
  
  var initialize = function(){
    // Listen the routes
    var router = new Router();

    glob.router = router;
    router.on('route:home', function(){
      var userList = new UserList();
      userList.render();
    });

    router.on('route:editUser', function(id){
      var editView = new EditView();
      editView.render({id: id});
    });

    Backbone.history.start();
  };
  
  return { 
    initialize: initialize
  };
});