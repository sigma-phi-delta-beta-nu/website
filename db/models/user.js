var createSchema = function(Schema) {
  
  var Link = require(__dirname + "/link");
  
  // Create the Schema fields
  var userSchema = new Schema({
    "name": {
      "first": String,
      "last": String
    },
    "username": String,
    "password": String,
    "links": [{
      "name": String,
      "url": String
    }],
    "events": [String],
    "class": String,
    "positions": [String],
    "email": String
  });
  
  // Create the Schema functions
  // Login a user
  userSchema.statics.login = function(username, password, callback) {
    
    // Execute a query
    this.findOne({
      "username": username,
      "password": password
    }).exec(function(error, data) {
      
      // Check the result
      if (error) {
        console.log(error);
        callback(null);
        
      // Successful query
      } else {
        // Test if user was found
        if (data !== undefined) {
          callback(data);
        } else {
          callback(null);
        }
      }
      
    });
    
  };
  
  userSchema.statics.addLink = function(username, name, url, callback) {
    
    if (!username) {
      callback(false);
      return;
    }
    
    this.findOne({ "username": username }).exec(function(error, user) {
      if (error) {
        console.log(error);
        callback(false);
      } else {
        var found = false;
        for (var i = 0; i < user.links.length; i++) {
          if (user.links[i].name === name) {
            found = true;
            user.links[i].url = url;
          }
        }
        if (!found) {
          user.links.push({
            "name": name,
            "url": url
          });
        }
        user.save(function() {
          callback(user);
        });
      }
    });
    
  };

  userSchema.statics.removeLink = function(username, name, url, callback) {

    if (!username) {
      callback(false);
      return;
    }
    
    this.findOne({ "username": username }).exec(function(error, user) {
      if (error) {
        console.log(error);
        callback(false);
      } else {
        var newLinks = [];
        for (var i = 0; i < user.links.length; i++) {
          if (user.links[i].name !== name) {
            newLinks.push(user.links[i]);
          }
        }
        user.links = newLinks;
        user.save(function() {
          callback(user);
        });
      }
    });
    
  };
 
  userSchema.statics.getClasses = function(callback) {

    var classes = {};
    this.find({}, "name.first name.last class", function(err, users){
      users.forEach(function(user){
        var keys = Object.keys(classes);
        var found = false;
        keys.forEach(function(className){
           if(user.class === className) { found = true; }
        });
        if(found) {
           classes[user.class].push(user);
        }
        else {
           classes[user.class] = [user];
        }
      });
      callback(classes);
    });

  };
  
  userSchema.statics.getPositions = function(callback) {
    
    var positions = {};
    this.find({ "positions": { "$not": { "$size": 0 } } })
      .exec(function(error, members) {
      if (error) {
        console.log(error);
        callback(null);
      } else {
        
        var elected = [ "Chief Engineer", "Vice Chief Engineer", "Business Manager", "Secretary", "Historian", "Chaplain", "Pledge Master", "Guide", "Recruitment Chairman" ];
        var appointed = [ "Social Chairman", "Risk Reduction Chairman", "Fundraising Chairman", "Expansion Chairman", "Athletic Chairman", "Pledge Board Chairman", "Brotherhood Chairman", "Philanthropy Chairman", "Assistant Business Manager", "Sergeant-At-Arms", "Webmaster", "Engineering Governing Council Delegate" ];

        var positions = {
          "elected": [],
          "appointed": []
        };
        
        for (var i = 0; i < elected.length; i++) {
          for (var j = 0; j < members.length; j++) {
            for (var k = 0; k < members[j].positions.length; k++) {
              if (members[j].positions[k] === elected[i]) {
                positions.elected.push({
                  "name": members[j].name,
                  "email": members[j].email,
                  "position": members[j].positions[k]
                });
              }
            }
          }
        }
        
        for (var i = 0; i < appointed.length; i++) {
          for (var j = 0; j < members.length; j++) {
            for (var k = 0; k < members[j].positions.length; k++) {
              if (members[j].positions[k] === appointed[i]) {
                positions.appointed.push({
                  "name": members[j].name,
                  "email": members[j].email,
                  "position": members[j].positions[k]
                });
              }
            }
          }
        }
        
        callback(positions);
        
      }
    });
    
  };
  
  return userSchema;
  
};

module.exports = createSchema;