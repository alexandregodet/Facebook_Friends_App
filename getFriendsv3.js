// Full async style with concurrent limit
 
var request = require('request')
  , async   = require('async')
  , fs      = require('fs')
  , friends = require('./friends');
 
function getImgPath(friend){
  return './public/images/profils/'+friend.uid+".jpg";
}
 
/**
 * Asynchronous Iterator
 * @param  {Object} friend
 * @param  {Function} doneCallback(err, result)
 */
function friendIter(friend, doneCallback){
  request({
    url:friend.pic_big,
    encoding:'binary'
  }, function(err, resp, body){
    if(err){doneCallback(err);return;}
 
    var filepath = getImgPath(friend);
 
    fs.writeFile(filepath, body, 'binary', function(err){
      if(err){doneCallback(err);return;}
 
      friend.pic_big = '/images/profils/'+friend.uid+'.jpg';
      console.log('Downloaded', filepath);
      doneCallback(null, friend);
    });
  });
}
 
function everythingsDoneCallback(err, updatedFriends){
  friends = updatedFriends;
  console.log('Done !');
}
 
// https://github.com/caolan/async#maplimitarr-limit-iterator-callback
var concurrent = 5;
async.mapLimit(friends, concurrent, friendIter, everythingsDoneCallback);