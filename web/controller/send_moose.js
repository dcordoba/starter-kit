var postEditorTemplate = '\
  <div class="postEditor">\
    <div class="app-section photoSection">\
      <% if (photoUrl) { %>\
        <div class="photo">\
          <img src="<%= photoUrl %>"></img>\
        </div>\
      <% } else { %>\
        <div class="uploadPhoto">\
          <div class="app-button uploadPhotoBtn">Upload a photo</div>\
        </div>\
      <% } %>\
    </div>\
    <div class="app-section recipientsSection">\
      <div class>Recipients</div>\
      <ul class="app-list recipientsList">\
        <% _.each(recipients, function(recipient) { %>\
          <li class="recipient">\
            <%= recipient.fullName %> (<%= recipient.username %>)\
          </li>\
        <% }) %>\
      </ul>\
      <div class="addRecipientsBtn app-button">Add Recipients</div>\
    </div>\
  </div>\
';

var Post = Backbone.Model.extend({
  defaults: function() {
    return {
      'photoUrl': null,
      'recipients': []
    };
  }
});

var PostEditorView = Backbone.View.extend({
  tagName: 'div',
  className: 'photoEditor',
  template: _.template(postEditorTemplate),
  events: {
    'click .uploadPhotoBtn': 'uploadPhotoClicked',
    'click .addRecipientsBtn': 'addRecipientsClicked'
  },
  initialize: function() {
    _.bindAll(this, 'render', 'uploadPhotoClicked', 'addRecipientsClicked');
    this.model.on('change', this.render);
  },
  render: function() {
    var html = this.template(this.model.toJSON());
    this.$el.html(html);
    return this;
  },
  uploadPhotoClicked: function() {
    var that = this;
    kik.photo.get(function(photos) {
      if (!photos) {
        console.log('no photos :(');
      } else {
        that.model.set({'photoUrl': photos[0]});
      }
    });
  },
  addRecipientsClicked: function() {
    var that = this;
    var preselected = this.model.get('recipients');
    kik.pickUsers({
      preselected: preselected
    }, function(users) {
      that.model.set({'recipients': users});
      that.render();
    });
  }
});

App.controller('sendMoose', function (page) {

  var post = new Post();

  var showAuthenticatedView = function() {
    $(page).find('.authenticated').show();
    $(page).find('.unauthenticated').hide();

    // Render the PostEditor
    var postEditorView = new PostEditorView({
      'model': post,
      'el': $(page).find('.postViewPlaceholder')
    });
    postEditorView.render();
  };

  var showUnauthenticatedView = function() {
    $(page).find('.unauthenticated').show();
    $(page).find('.authenticated').hide();
  };

  kik.getUser(function(user) {
    if (!user) {
      showUnauthenticatedView();
    } else {
      showAuthenticatedView();
    }
  });


  $(page).find('.sendBtn').click(function() {
    kik.send('davidwastaken', {
      'title': 'Message Title',
      'text': 'Message text'
    });
  });
});
