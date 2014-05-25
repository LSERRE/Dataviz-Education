// Filename: views/projects/list
define([
  'jquery',
  'underscore',
  'backbone',
  // Pull in the Collection module from above,
  'models/user/UserModel',
  'collections/users/UsersCollection',
  'text!../../../templates/users/edit-user-template.html'

], function($, _, Backbone, UserModel, UsersCollection, editUserTemplate){

  var EditUser = Backbone.View.extend({
    el: '.page',
    template: Handlebars.compile(editUserTemplate),
    render: function(options){
      var self = this;
      if(options.id){
        self.user = new UserModel({id: options.id});
        self.user.fetch({
          success: function(user){
            console.log(user.toJSON());
            self.$el.html(self.template(user.toJSON()));
          }
        });
      }
      else{
        self.$el.html(self.template(''));
      }
      
    },
    events : {
      'submit .edit-user-form': 'saveUser',
      'click .delete': 'deleteUser'
    },
    saveUser : function(e){
      var userDetails = $(e.currentTarget).serializeObject();
      var user = new UserModel();
      user.save(userDetails, {
        success: function(user){
          glob.router.navigate('', {trigger: true});
        }
      });
      return false;
    },
    deleteUser: function(evt){
      this.user.destroy({
        success: function(){
          router.navigate('', {trigger: true});
        }
      });
      return false;
    }
  });

  return EditUser;
});