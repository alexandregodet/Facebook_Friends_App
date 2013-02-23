var friends = new FriendCollection();
var myApp = new AppView({
    el:      $('.app')[0],
    friends: friends
});

// Affiche les amis  	 
friends.fetch();

// Load the Visualization API and the piechart package.
google.load('visualization', '1.0', {'packages':['corechart','table']});