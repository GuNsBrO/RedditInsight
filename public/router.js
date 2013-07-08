Redd.Router = Backbone.Router.extend({
  initialize: function(control) {
    this.controller = control;
  },
  routes: {
    '':'dashboard',
    '#/':'dashboard',
    'prediction':'prediction',
    'trackpost':'trackpost',
    'trackuser':'trackuser',
    'wordcloud':'wordcloud',
    'topiccluster': 'topiccluster',
    'circlecluster': 'circlecluster'
  },
  dashboard: function(){
    this.controller.hide();
    this.controller.hidePages();
    this.controller.showFull();
    this.controller.show('dashboard');
  },
  prediction: function(){
    this.controller.hide();
    this.controller.hideFull();
    this.controller.showPages();
    this.controller.show('prediction');
  },
  trackpost: function(url){
    this.controller.hide();
    this.controller.hideFull();
    this.controller.showPages();
    this.controller.show('trackpost');
  },
  trackuser: function(url){
    this.controller.hide();
    this.controller.hideFull();
    this.controller.showPages();
    this.controller.show('trackuser');
  },
  wordcloud: function(url){
    this.controller.hide();
    this.controller.hidePages();
    this.controller.showFull();
    this.controller.show('wordcloud');
  },
  topiccluster: function(url){
    this.controller.hide();
    this.controller.hideFull();
    this.controller.showPages();
    this.controller.show('topiccluster');
  },
  circlecluster: function(){
    this.controller.hide();
    this.controller.hidePages();
    this.controller.showFull();
    this.controller.show('circlecluster');
  }
});
