var FriendView = Backbone.View.extend({
      className:"friend-item span4",

      // See. http://api.jquery.com/html/
      // See. http://underscorejs.org/#template
      tmpl: _.template($('#friendTmpl').html()),

      /**
       * Render the FriendView
       * @chainable
       * @return {FriendView}
       */
      render: function(){
        // See. http://backbonejs.org/#Model-toJSON
        // See. http://underscorejs.org/#template
        // See. http://api.jquery.com/html/
        this.$el.html(this.tmpl(this.model.toJSON()));
        return this;
      }
});
        
var AppView = Backbone.View.extend({        
        events:{
            "click #byName":"sortByNames",
            "click #byBirthday":"sortByBirthdays",
            "keyup input":"search",
            "click #removeSearch": "removeSearch",
            "load body":"search"
        },
        sortByNames: function(){
            this.friends.sortByNames();
        },
        search : function(e){				 
            //Récupere la valeur du input de recherche
            this.friends.searchFor(e.currentTarget.value);
        },
        removeSearch: function(){
            this.friends.removeSearch();  
        },
        sortByBirthdays: function(){
            this.friends.sortByBirthdays();
        },
        updateInput: function(token){			
            this.$el.toggleClass('searchmode',token||token.length>0);				
        },
        clearInput: function(token){
            if(!token){
                this.$el.find('input').val('');
            }		   
        },
        updateCount: function(coll){
            this.$el.find('.friendsCount .nbFriends').text(coll.length);	
        },
        drawCharts: function(){            
                /**
                 * Chart 1
                 */
                    // Create the data table.
                    var data1 = new google.visualization.DataTable();
                    data1.addColumn('string', 'Topping');
                    data1.addColumn('number', 'Slices');
                    data1.addRows([
                        ['Hommes', homme],
                        ['Femmes', femme],
                        ['N.C', autre]          
                    ]);
                    // Set chart options
                    var options1 = {'title':'Pourcentage d\'hommes et de femmes.','height':220};
                    // Instantiate and draw our chart, passing in some options.
                    var chart1 = new google.visualization.PieChart(document.getElementById('graphSexe'));
                    chart1.draw(data1, options1);

                /**
                 * Chart 2
                 */
                    var data2 = google.visualization.arrayToDataTable([
                        ['Années', 'Nb'],
                        ['15-20',  nb1520],
                        ['20-25',  nb2025],
                        ['25+',  nb25],
                        ['N.C',  nbInconnu]
                    ]);
                    var options2 = {'title':'Répartition des âges',
                                'width':300,
                                'height':220, 
                                hAxis: {
                                    titleTextStyle: {color: 'red'}
                                }};
                    var chart2 = new google.visualization.ColumnChart(document.getElementById('graphAge'));
                    chart2.draw(data2, options2);


               /**
                * Chart 3
                */
                    var data3 = new google.visualization.DataTable();
                    data3.addColumn('string', 'Topping');
                    data3.addColumn('number', 'Slices');
                    data3.addRows([
                        ['En couple', couple],
                        ['Celibataires', celib],
                        ['Mariés', marie],
                        ['Autre', autre3]  
                    ]);
                    var options3 = {'title':'Pourcentage celibataires / en couple.','height':220};
                    var chart3 = new google.visualization.PieChart(document.getElementById('graphStatus'));
                    chart3.draw(data3, options3);

               /**
                * Chart 4
                */
                    var data4 = new google.visualization.DataTable();
                    data4.addColumn('string', 'Topping');
                    data4.addColumn('number', 'Slices');
                    data4.addRows([
                        ['Pomme', pomme],
                        ['Android', android]
                    ]);
                    var options4 = {'title':'Pourcentage Pomme / Android','height':220};
                    var chart4 = new google.visualization.PieChart(document.getElementById('graphDevice'));
                    chart4.draw(data4, options4);
                    
                 
               /**
                * Chart 5 (Table)
                */
                    var data5 = new google.visualization.DataTable();
                    data5.addColumn('string', 'Device');
                    data5.addColumn('number', 'Count');
                    data5.addRows([
                        ['Android',  android],
                        ['iOS',  pomme],
                        ['- iPhone',   iphone],
                        ['- iPad', ipad]
                    ]);
                    
                    var table5 = new google.visualization.Table(document.getElementById('tableDevice'));
                    table5.draw(data5);
                    
               /**
                * Chart 6
                */
                    var data6 = new google.visualization.DataTable();
                    data6.addColumn('string', 'Topping');
                    data6.addColumn('number', 'Slices');
                    data6.addRows([
                        ['Français', nbFr],
                        ['Etrangers', nbEtr]
                    ]);
                    var options6 = {'title':'Pourcentage Français / Étrangers','height':220};
                    var chart6 = new google.visualization.PieChart(document.getElementById('graphNation'));
                    chart6.draw(data6, options6);
                    
        },
        
        
        initialize: function(options){
            _.extend(this, options);
            // FriendsViews array
            this.subViews    = [];
            // $friendList HTML element wrapped with jQuery
            this.$friendList = this.$el.find('.friend-list');

            // Listen on collection reset event to render the FriendViews
            // See: http://backbonejs.org/#Collection-reset
            this.friends.on("reset", this.render, this);
            this.friends.on("filter", this.render, this);

            this.friends.on("reset", this.updateCount, this);
            this.friends.on("filter", this.updateCount, this);

            this.friends.on("change:search", this.updateInput, this);
            this.friends.on("change:search", this.clearInput, this);
            this.friends.on("drawCharts", this.drawCharts, this);
            
        },      
      

        /**
        * Render the `friends` collection with FriendViews
        * @return {AppView}
        * @chainable
        */
        render: function(collection){
            // Remove all old FriendViews
            this.subViews.forEach(function(friendView){
                friendView.remove(); // see http://backbonejs.org/#View-remove
            });

            collection.forEach(function(friendModel){
                var view = new FriendView({
                    model: friendModel
                });
                this.subViews.push(view);
                view.render().$el.appendTo(this.$friendList);
            }, this);

            return this;
        }
});


