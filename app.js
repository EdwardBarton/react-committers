const Commit = Backbone.Model.extend({
  urlRoot: 'https://api.github.com/repos/facebook/react/commits',

  defaults: () => ({id: 0, login: '', image: ''}),

  parse(resp) {
    return {
      id: resp.sha,
      login: resp.author.login,
      image: resp.author.avatar_url
    };
  }
});

const Commits = Backbone.Collection.extend({model: Commit});
const commits = new Commits();

const AppView = Backbone.View.extend({
  el: '.container',

  events: {
    'keypress .sha': 'createCommit'
  },

  initialize() {
    this.$input = this.$(`.sha`);
    this.$list = this.$(`.commits`);

    this.listenTo(commits, 'add', this.renderCommit);    
  },

  renderCommit(commit) {
    const commitView = new CommitView({model: commit});
    this.$list.append(commitView.render().el);
  },

  createCommit(e) {
    if(e.keyCode === 13 && this.$input.val()) {
      new Commit({id: this.$input.val()}).fetch({
        success: model => {
          commits.add(model);
        }
      });
      
      this.$input.val('');
    }
  }
});
const app = new AppView();

const CommitView = Backbone.View.extend({
  className: 'commit col-md-3 mb-4',
  template: Handlebars.compile($(`#commit-template`).html()),

  render() {
    this.$el.html(this.template(this.model.toJSON()));
    return this;
  }
});


