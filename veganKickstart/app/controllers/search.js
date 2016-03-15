import Ember from 'ember';

export default Ember.Controller.extend(Ember.Evented, {
  showBackButton: 'always',
  sortProperty: function() {
    return "weight";
  }.property(),
  sortDirection: function() {
    return "reverse";
  }.property(),
  /**
   * Returns a list of recipes that have been favorited.
   */
  favoriteRecipes: function() {
    return this.get("model").recipes.filterBy("favorite", true);
  }.property("model.recipes.@each"),

  /**
   * This function responds to changes in the sort params
   * and sets the results accordingly.
   */
  updateSort: function() {
    if (this.get("sortDirection") === "reverse") {
      this.set("results", this.get("cachedRecipes").sortBy(this.get("sortProperty")).reverse());
    } else {
      this.set("results", this.get("cachedRecipes").sortBy(this.get("sortProperty")));
    }
  }.observes("sortProperty"),


  /**
   * Field to hold the last query string we searched for.
   */
  cachedQuery: function() {
    return "";
  }.property(),

  /**
   * property to hold the last list of search results.
   */
  cachedRecipes: function() {
    return [];
  }.property(),

  results: function() {
    return [];
  }.property(),

  /**
   * This function actually does the searching
   */
  searchRecipes: function() {
    if(this.get("cachedQuery") === this.get("queryString")) {
      this.updateSort();
    } else {

      if (!this.get("queryString")) {
        return this.set("results", []);
      }

      var needles = this.get("queryString").split(" ").map(function (str) {
        if (str) {
          return new RegExp(str, "ig");
        }
        return false;
      });

      var recipes = this.get("model").recipes.filter(function (item) {
        //This is a shortcut to get all the data for an item in a single string.
        var haystack = JSON.stringify(item);
        var weight = 0;
        for (var i in needles) {
          if (needles.hasOwnProperty(i) && needles[i]) {
            weight = weight + (haystack.match(needles[i]) || []).length;
          }
        }
        item.set("weight", weight);
        return (item.weight > 0);
      });
      this.set("cachedRecipes", recipes);
      this.set("cachedQuery", this.get("queryString"));

      if (recipes.length > 0) {
        if (this.get("sortDirection") === "reverse") {
          this.set("results", recipes.sortBy(this.get("sortProperty")).reverse());
        } else {
          this.set("results", recipes.sortBy(this.get("sortProperty")));
        }
      } else {
        this.set("results", []);
      }
    }
  },

  /**
   * Property to hold the input query String
   * We are searching on model, but holding the query string
   * in it's own property to facilitate UI changes, and to
   * debounce live search results.
   *
   * This fascilitates two-way data-binding
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
      this.searchRecipes();
    }, 1000);
  }.observes("queryString"),


  /**
   * Helper functions that produce class strings that hide/show
   * the search box and set style for the active button
   */
  favoriteActive: function() {
    if (this.get("model").query === "favorites") {
      return "tab-style-active";
    }
  }.property("model.query"),
  searchActive: function() {
    if (this.get("model").query !== "favorites") {
      return "tab-style-active";
    }
  }.property("model.query"),
  relevanceActive: function() {
    return (this.get("sortProperty") === "weight") ? "tab-style-active" : "";
  }.property("sortProperty"),
  alphabeticalActive: function() {
    return (this.get("sortProperty") === "name") ? "tab-style-active" : "";
  }.property("sortProperty"),


  actions: {
    showSearch: function() {
      this.set("model.query", this.get("queryString"));
      this.searchRecipes();
    },
    showFavorites: function() {
      this.set("model.query", "favorites");
      this.set("results", this.get("favoriteRecipes"));
    },
    gotoRecipe: function(recipeId) {
      this.transitionToRoute("recipe", recipeId);
    },
    sortByRelevance: function() {
      this.set("sortDirection", "reverse");
      this.set("sortProperty", "weight");
    },
    sortAlphabetical: function() {
      this.set("sortDirection", "asc");
      this.set("sortProperty", "name");
    }
  }
});