define([
  'jquery',
  'd3',
  'underscore',
  'backbone',
  'handlebars',
  'models/user/UserModel',
  'collections/users/UsersCollection',
  'text!../../../templates/users/user-list-template.html'
], function($, d3, _, Backbone, Handlebars, UserModel, UsersCollection, listUserTemplate){


  
  var UserList = Backbone.View.extend({
    el: '.page',
    template: Handlebars.compile(listUserTemplate),
    render: function(){
      $('.page').removeClass();
      $('.edit-user').addClass('none');
      $('.page').addClass('fade');
      var self = this;
      var users = new UsersCollection();
      users.fetch({
        success: function(users){
          console.log(users.toJSON());

          self.$el.html(self.template(users.toJSON()));

          return self;
        },
        error: function(err){
          console.log(err);
        }
      });
    }
  }); 

  return UserList;
});