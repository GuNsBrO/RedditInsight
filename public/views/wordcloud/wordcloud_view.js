Redd.Views.WordCloud = Backbone.View.extend({
  // can test with "Debug.Controller.wordcloud.model.attributes.switchRotateFuncChoice.call(Debug.Controller.wordcloud.model)"
  initialize: function() {
    console.log('in WordCloud view');

    // render on change
    this.model.on('sync', this._render, this);
    this.model.on('change', this._render, this);
  },
  el: '#wordcloud',
  template: Redd.Templates('wordcloud'),
  events: {
    'submit': 'formHandler'
  },

  render: function() {
    // Fetch a fresh model
    this.model.pull();
  },

  _render: function(){
    //quick hack, refactor to fit structure
    var obj = {
      limit: this.model.get('limit'),
      sizeMultiple: this.model.get('sizeMultiple')
    };
    //no comparison operators in handlebars!!
    if (this.model.get('_rotateFuncChoice') === '_rotate90discrete') {
      obj._rotate90discrete = '_rotate90discrete';
    } else if (this.model.get('_rotateFuncChoice') === '_rotate180continuous') {
      obj._rotate180continuous = '_rotate180continuous';
    }
    if (this.model.get('selectedSubreddit') === 'TechnologyNoun') {
      obj.TechnologyNoun = 'TechnologyNoun';
    } else if (this.model.get('selectedSubreddit') === 'GamingNoun') {
      obj.GamingNoun = 'GamingNoun';
    } else if (this.model.get('selectedSubreddit') === 'FunnyNoun') {
      obj.FunnyNoun = 'FunnyNoun';
    } else if (this.model.get('selectedSubreddit') === 'AdviceAnimalsNoun') {
      obj.AdviceAnimalsNoun = 'AdviceAnimalsNoun';
    }else if (this.model.get('selectedSubreddit') === 'MineCraftNoun') {
      obj.MineCraftNoun = 'MineCraftNoun';
    }else if (this.model.get('selectedSubreddit') === 'WTFNoun') {
      obj.WTFNoun = 'WTFNoun';
    }else if (this.model.get('selectedSubreddit') === 'AwwNoun') {
      obj.AwwNoun = 'AwwNoun';
    }else if (this.model.get('selectedSubreddit') === 'GIFNoun') {
      obj.GIFNoun = 'GIFNoun';
    }else if (this.model.get('selectedSubreddit') === 'LeageOfLegendsNoun') {
      obj.LeageOfLegendsNoun = 'LeageOfLegendsNoun';
    }else if (this.model.get('selectedSubreddit') === 'PicsNoun') {
      obj.PicsNoun = 'PicsNoun';
    }else if (this.model.get('selectedSubreddit') === 'PoliticsNoun') {
      obj.PoliticsNoun = 'PoliticsNoun';
    }else if (this.model.get('selectedSubreddit') === 'ScienceNoun') {
      obj.ScienceNoun = 'ScienceNoun';
    }else if (this.model.get('selectedSubreddit') === 'TodayILearnedNoun') {
      obj.TodayILearnedNoun = 'TodayILearnedNoun';
    }else if (this.model.get('selectedSubreddit') === 'TreesNoun') {
      obj.TreesNoun = 'TreesNoun';
    }else if (this.model.get('selectedSubreddit') === 'VideosNoun') {
      obj.VideosNoun = 'VideosNoun';
    }else if (this.model.get('selectedSubreddit') === 'WorldNewsNoun') {
      obj.WorldNewsNoun = 'WorldNewsNoun';
    }else if (this.model.get('selectedSubreddit') === 'NSFWNoun') {
      obj.NSFWNoun = 'NSFWNoun';
    }
    if (this.model.get('wordArray') ) {
      this.$el.html(this.template(obj));
      this.d3Stuff('#wordcloud');
      // this.$('svg').css('background-color', 'black');
      this.$('svg').addClass('word-cloud');
      console.log('WordCloudView has been rendered ' + (this.model.renderCounter += 1) + " times");
    }
    return this;
  },
  formHandler: function(e) {
    e.preventDefault();
    console.log('handling form');
    var obj ={};
    $('#wordCloudForm').find('input').each(function(index, data){
      var dataType    = $(data).attr('type'),
          dataName    = $(data).attr('name'),
          dataChecked = $(data).is(':checked');

      if (dataName !== undefined && (dataType !== 'radio' || dataChecked) ) {
        obj[dataName] = $(data).val();
      }
    });
    $('#wordCloudForm').find('option').each(function(index, data){
      if ( $(data).is(':selected') ) {
        obj.subreddit = $(data).val();
      };
    });
    this.model.update(obj);
  },
  d3Stuff: function(parentEl){
      var self = this;
      var fill = d3.scale.category20();

      var dynWidth = $('#wordcloud').innerWidth();
      var dynHeight = dynWidth * 0.5;

      if (dynWidth === 0) {
        console.error('Attempted to render d3 portion of wordcloud into element with zero width! (causes crash in d3)');
        return;
      }

      d3.layout.cloud().size([dynWidth, dynHeight])
          .words(this.model.get('wordArray').map(function(d) {  //change wordArray should have list of words
            return {text: d, size: self.model.get('frequency')[d]}; // changed d should be name of word
          }))
          .padding(5)
          .rotate(this.model.get('rotateFunc'))
          .font("Impact")
          .fontSize(function(d) { return d.size; })
          .on("end", draw)
          .start();

      function draw(words) {
        d3.select(parentEl).append("svg")
            .attr("width", dynWidth)
            .attr("height", dynHeight)
          .append("g")
            .attr("transform", "translate("+ dynWidth / 2 +"," + dynHeight / 2 + ")")
          .selectAll("text")
            .data(words)
          .enter().append("text")
            .style("font-size", function(d) { return d.size + "px"; })
            .style("font-family", "Impact")
            .style("fill", function(d, i) { return fill(i); })
            .attr("text-anchor", "middle")
            .attr("transform", function(d) {
              return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
            })
            .text(function(d) { return d.text; });
      }
  }
});
