Redd.Models.TrackUser = Backbone.Model.JSONP.extend({
  initialize: function() {
    this.on('usernameSubmitChange', this.usernameSubmit, this);
  },
  url: function() {
    return 'https://pay.reddit.com/user/'+ this.usernameSubmit +'/about.json';
  },
  parse: function(data) {
    return data.data;
  },

  usernameSubmit: function(username) {
    this.usernameSubmit = username;
    this.fetch();
  }
});
