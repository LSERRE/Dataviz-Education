define([
  'jquery',
  'underscore',
  'backbone',
  'models/user/UserModel'
], function($, _, Backbone, UserModel){

  var UsersCollection = Backbone.Collection.extend({
      url: '/users'
    });
 
  return UsersCollection;
});