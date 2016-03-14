import Ember from 'ember';

export default Ember.Controller.extend(Ember.Evented, {
  showBackButton: 'always',
  /**
   * Returns a list of recipes that have been favorited.
   */
  favoriteRecipes: function() {
    return this.get("model").recipes.filterBy("favorite", true);
  }.property("model.recipes.@each"),

  /**
   *
   */
  searchRecipes: function() {
    var needles = this.get("queryString").split(" ").map(function(str) {
      return new RegExp(str, "ig");
    });
    var recipes = this.get("model").recipes.filter(function(item) {
      //This is a shortcut to get all the data for an item in a single string.
      var haystack = JSON.stringify(item);
      item.weight = 0;
      for (var i in needles) {
        if(needles.hasOwnProperty(i)) {
           item.weight = item.weight + (haystack.match(needles[i]) || []).length;
        }
      }
      return (item.weight > 0);
    });
    if (recipes.length > 0) {
      return recipes.sortBy("weight");
      //return recipes.sortBy("name");
    } else {
      return false;
    }
  },

  /**
   * Property to hold the input query String
   * We are searching on model, but holding the query string
   * in it's own property to facilitate UI changes, and to
   * debounce live search results.
   */
  queryString: function() {
    if (this.get("model").query === "favorites") {
      return "";
    } else {
      return this.get("model").query;
    }
  }.property(),

  /**
   * This function observes the queryString and does a
   * debounce so live update only happens after the user stops typing
   */
  updateSearchResults: function() {
    Ember.run.debounce(this, function() {
      this.set("model.query", this.get("queryString"));
    }, 1000);
  }.observes("queryString"),

  /**
   * This function is a helper to wrap our favorite functionality
   * and keep it separate from the search functionality
   */
  results: function() {
    var model = this.get("model");
    if(model.query) {
      if (model.query === "favorites") {
        return this.get("favoriteRecipes");
      } else {
        return this.searchRecipes();
      }
    } else {
      return false;
    }
  }.property("model.query"),

  /**
   * Helper functions that produce class strings that hide/show
   * the search box and set style for the active button
   */
  favoriteActive: function() {
    if (this.get("model").query === "favorites") {
      return "vka-tab-active";
    }
  }.property("model.query"),
  searchActive: function() {
    if (this.get("model").query !== "favorites") {
      return "vka-tab-active";
    }
  }.property("model.query"),


  actions: {
    showSearch: function() {
      this.set("model.query", this.get("queryString"));
    },
    showFavorites: function() {
      this.set("model.query", "favorites");
    }
  }
});