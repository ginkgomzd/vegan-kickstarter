import Ember from 'ember';

export default Ember.Controller.extend({
  showBackButton: 'never',
  actions: {
    viewRecipe: function(recipe) {
      this.transitionToRoute("recipe", recipe);
    }
  }
});