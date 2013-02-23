var FriendCollection = Backbone.Collection.extend({
        url:'/friends',
        model:FriendModel,
        sortByNames: function(){
            this.reset(this.sortBy(function(friendModel){
                return friendModel.get('first_name');
            }));
        },
        removeSearch: function(){
            //Reset collection
            this.trigger('reset',this);
            //Emmit change:search
            this.trigger('change:search','');
        },
        sortByBirthdays: function(){
            // See. http://backbonejs.org/#Collection-Underscore-Methods
            // See. http://backbonejs.org/#Collection-reset
            this.reset(this.sortBy(function(friendModel){
                return friendModel.get('birthday_date');
            }));
        },
        searchFor : function(token){
            //Récupération de la liste des membres
            token = token.toLowerCase();
            filteredCollection = this.filter(function(model){
                return  model.get('first_name').toLowerCase().indexOf(token) !== -1 ||
                         model.get('last_name').toLowerCase().indexOf(token) !== -1 ||
                         (model.get('birthday_date') || '').toLowerCase().indexOf(token) !== -1 ||
                         (model.get('hometown_location') ? model.get('hometown_location').name.toLowerCase().indexOf(token) !== -1 : false) ||
                         (model.get('relationship_status') || '').toLowerCase().indexOf(token) !== -1;	
            });

            // On appel la méthode pour calculer les données du Graph, en le faisant ici, 
            // on sait que les données seront actualisées à chaque fois que le user aura tappé qqchose dans la recherche
            this.calcGraph();
            
            this.trigger('filter',filteredCollection);
            this.trigger('change:search',token);
            this.trigger('drawCharts');
        },
        calcGraph: function(){
            // Graphs
            var d = new Date();
            var annee = d.getUTCFullYear();
            homme = femme = autre = 0;
            nb1520 = nb2025 = nb25 = nbInconnu = 0;
            celib = couple = marie = autre3 = 0;
            pomme = android = iphone = ipad = 0;
            nbFr = nbEtr = 0;
            
            filteredCollection.forEach(function(oneFriend){
                
                // Sexe
                if(oneFriend.attributes.sex=='male'){
                    homme++;
                }else if(oneFriend.attributes.sex=='female'){
                    femme++;
                }else{
                    autre++;
                }
                
                // Age
                dateNaiss = oneFriend.attributes.birthday_date;
                if(dateNaiss!=null && dateNaiss.length==10){
                    var dateNaissFriend = dateNaiss.substring(6);
                    // On vérifie si le friend est né entre (il y a 20 ans) et (il y a 15 ans)...
                    if((dateNaissFriend >= (annee-20)) && (dateNaissFriend < (annee-15))){
                        nb1520++;
                    }else if((dateNaissFriend >= (annee-25)) && (dateNaissFriend < (annee-20))){
                        nb2025++;
                    }else if((dateNaissFriend >= (annee-25))){
                        nb25++;
                    }
                }else{
                    nbInconnu++;
                }
                
                // Status
                if(oneFriend.attributes.relationship_status=='Single'){
                    celib++;
                }else if(oneFriend.attributes.relationship_status=='In a Relationship'){
                    couple++;
                }else if(oneFriend.attributes.relationship_status=='Engaged'){
                    marie++;
                }else{
                    autre3++; 
                }
                
                // Devices
                if(oneFriend.attributes.devices!=''){
                    var devices = oneFriend.attributes.devices;
                    devices.forEach(function(y){
                        (y.hardware=='iPhone') ? iphone++ : (y.hardware=='iPad') ? ipad++ : null;
                        y.os == 'iOS' ? pomme++ : android++;
                    });
                }
                
                // Nationnalite
                oneFriend.attributes.locale=='fr_FR' ? nbFr++ : nbEtr++;
            });
        }
});