import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.route('day', {path: '/day'});
  this.route('recipe', {path: '/recipe/:index'});
  this.route('login');
  this.route('settings');
  this.route('loading');
  this.route('search', {path: '/search'});
});

export default Router;
