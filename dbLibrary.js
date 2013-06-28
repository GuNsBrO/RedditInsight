var mongoose = require('mongoose')
  , lib = require('./myLibrary')
  , _ = require('underscore')
  , Schema = mongoose.Schema;

exports.allPostsCollection = {
  _postModel: null,
  _lastNameModel: null,
  _nameOfLastPost: "",
  _postsSchema: null,
  _throttledPullData: null,

  _count: 0,

  _options: {
    host: 'www.reddit.com',
    path: '/r/all/top.json?t=all&limit=100',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  },
  _createLastNameSchema: function(){
    return new mongoose.Schema({
      lastName:String,
    });
  },

  _createPostsSchema: function(){
    return new mongoose.Schema({
      domain:String,
      banned_by:String,
      media_embed: Schema.Types.Mixed,
      subreddit:String,
      selftext_html: Schema.Types.Mixed,
      selftext:Schema.Types.Mixed,
      likes:Schema.Types.Mixed,
      link_flair_text:Schema.Types.Mixed,
      id: String,
      clicked:Boolean,
      title:String,
      media:Schema.Types.Mixed, 
      score:Number,
      approved_by:Schema.Types.Mixed,
      over_18:Boolean,
      hidden:Boolean,
      thumbnail:String,
      subreddit_id:String,
      edited:Boolean,
      link_flair_css_class:Schema.Types.Mixed,
      author_flair_css_class:Schema.Types.Mixed,
      downs:Number,
      saved:Boolean,
      is_self: Boolean,
      permalink: String,
      name: String,
      created: Number,
      url: String,
      author_flair_text: Schema.Types.Mixed,
      author: String,
      created_utc: Number,
      ups: Number,
      num_comments: Number,
      num_reports: Schema.Types.Mixed,
      distinguished: Schema.Types.Mixed
    }, { autoIndex: true });
  },
  start: function(){
    this._throttledPullData = _.throttle(lib.getJSON, 2000);

    if( !this._postsSchema ){
      this._postsSchema = this._createPostsSchema();
    }
    if( !this._nameSchema ){
      this._nameSchema = this._createLastNameSchema();
    }

    mongoose.connect("mongodb://localhost/RedditInsight");
    this._postModel = mongoose.model('AllTopPosts', this._postsSchema);

    //pulling data
  },
  pullData: function(intervalId){

    var afterString = null;
    if( !this._nameOfLastPost ){
      //database has been run before
      var self = this;
      this._lastNameModel = mongoose.model('LastName', this._nameSchema);
      this._lastNameModel.findOne({},function(err,name){
        if(err){
          console.log('from findOne error:', JSON.stringify(err));
          clearInterval(intervalId);
          console.log('Stopped intervalId: ', intervalId);
          throw JSON.stringify(err);
        } else if(name) {
          self._nameOfLastPost = name.lastName;
          afterString = "&after=" + self._nameOfLastPost;
          var originalPath = self._options.path;
          self._options.path = self._options.path + afterString;
          console.log('pulling name ' + name + ' from database, using url: ', self._options.path);
          self._throttledPullData(self._options, self._saveResult, self);
          self._options.path = originalPath;
        } else {
          console.log('first time access with no data, using url: ', self._options.path);
          self._throttledPullData(self._options, self._saveResult, self);
        }
      });
    } else {
      //database has something in it, last name is known
      if(this.previousLastPost && this.previousLastPost === this._nameOfLastPost){  // stop duplicates once and for all!! work on this!
        return;
      }
      afterString = "&after=" + this._nameOfLastPost;
      var originalPath = this._options.path;
      this._options.path = this._options.path + afterString;
      console.log("_nameOfLastPost exists: ", this._nameOfLastPost);
      console.log('using url: ', this._options.path);
      this._throttledPullData(this._options, this._saveResult, this);
      this._options.path = originalPath;
    }
  },
  _saveResult: function(statusCode, result, self){

    for(var i = 0; i < result.data.children.length; i++){
      var postObj = result.data.children[i].data;
      new self._postModel(postObj).save(function(err, docs){
        if(err){console.log("\n\nerror saving: ", postObj, "error: ", err)}
      });
    }
    self._nameOfLastPost = result.data.children[result.data.children.length-1].data.name;
    self._lastNameModel.find().remove();
    self._lastNameModel({lastName: self._nameOfLastPost}).save(function(err, lastName){
      if(!err){
        console.log(lastName + 'saved successfuly');
      }
      console.log("document count: ", self._count += result.data.children.length);
    })
  }
}








