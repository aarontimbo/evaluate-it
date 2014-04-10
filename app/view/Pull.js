/**
 * Load remote data via AJAX: display output
 *
 * TODO: Implement normalized model
 */
Ext.define('EvaluateIt.view.Pull', {
    extend: 'Ext.Container',
	alias: 'widget.pullview',
    config: {
        scrollable: true,
        items: [
            {
                xtype: 'panel',
                id: 'Pull',
                styleHtmlContent: true
            },
            {
                docked: 'top',
                xtype: 'toolbar',
                items: [
					{
						xtype: 'button',
						itemId: 'loginButton',
						text: 'Login',
						iconCls: 'arrow_right',
						iconMask: true 
					},
					{
						xtype: 'button',
						itemId: 'logOutButton',
						text: 'Logout',
						iconCls: 'arrow_right',
						iconMask: true 
					},
                    {
                        text: 'Pull data',
                        handler: function() {
                            var panel = Ext.getCmp('Pull'),
								json = [];

                            panel.getParent().setMasked({
                                xtype: 'loadmask',
                                message: 'Loading...'
                            });

                            // utilize API as per web site standard
                            // value set via {EvaluateIt.config.protocol
                            // use new API with authorization token
                           	url =  EvaluateIt.config.protocol;


                            // select mode of API access
                            // value set via {EvaluateIt.config.protocol
                          	if (EvaluateIt.config.mode === 'test') {
								url += EvaluateIt.config.test;
							}
							if (EvaluateIt.config.mode === 'live') {
								url += EvaluateIt.config.production;
							}

							url += EvaluateIt.config.domain;
							url += EvaluateIt.config.apiViewEvaluation;
							url += EvaluateIt.config.pullCriterion;
							url += sessionStorage.evaluator_id;
                            // url += 265;
							url += '?token=' + sessionStorage.sessionToken
							console.log(url);

                            // make cors request for cross domain access for data
                           	Ext.Ajax.request({
								cors: true,
								url : url,
								useDefaultXhrHeader: false,
								success: function (response) {
								   json = Ext.decode(response.responseText);
                                   // parse object into model
                                   parseJson(json);
                                   panel.setHtml(response.responseText);
                                   panel.getParent().unmask();
								   console.log('data: ' + response.responseText);
								},
								fail: function (e, jqxhr, settings, exception) {
									console.log(e);
								}
							});
                        }
                    }
                ]
            }
        ],
        listeners: [{
            delegate: '#logOutButton',
            event: 'tap',
            fn: 'onLogOutButtonTap'
        }]
    },
    onLogOutButtonTap: function () {
        this.fireEvent('onSignOffCommand');
    }

});

/**
 * parse object into model
 * @param json
 */
function parseJson (json) {

	var i,
		max,
		newEvaluator,
		Evaluators = Ext.create('EvaluateIt.store.Evaluators'),
		SiteEvaluations =  Ext.create('EvaluateIt.store.SiteEvaluations');

	for (i = 0, max = json.length; i < max; i += 1) {

        // create a psuedo-nested JSON store
        // TODO:  resolve issues with model associations
   		if (json[i].completed === '1') {
			siteEvaluations = Ext.getStore(SiteEvaluations);

            // need to see if evaluation exists in store
        	var match = siteEvaluations.find('address', json[i].garden.address.address);

			console.log(siteEvaluations.find('remoteEvaluationId', json[i].garden.evaluation_id));
					  
			if (match === -1) {
				console.log('Adding site!');

                // Write to flattened representation of model
                // TODO: write to normalized model
         		siteEvaluations.add([{
					site_id: i, 
					remoteSiteId: json[i].garden.garden_id, 
					address: json[i].garden.address.address,
					city: json[i].garden.address.city,
					state: json[i].garden.address.state,
					zipcode: json[i].garden.address.zip,
					neighborhood: json[i].garden.address.neighborhood,
					remoteEvaluatorId: json[i].evaluator.evaluator_id,
					evaluationType: 1,
					remoteEvaluationId: json[i].evaluation_id, 
					dateOfEvaluation: null,
					name: json[i].garden.gardener.name0

				}]);

                // Update proxy
				siteEvaluations.sync(); // update proxy

			}
			else { 
				console.log('Evaluation exists!');
			}

            // testing associations


            // create model instance
            var address = Ext.create('EvaluateIt.model.Address', {
                address: json[i].garden.address.address
            });

            // save record and link to site via setter method
           address_save(json[i]);


           function address_save(json) {
                address.save(function(record) {
                    // console.log('address.id ' + record.getId() + '  ' + json);
                    address_id = record.getId();
                    // callback to create linked site record
                    address.getSite( function(site, operation){
                        console.log('tried to load site. this.site is now set to the site');
                    } );

                    //site(address_id, json);

                    var site = Ext.create('EvaluateIt.model.Site', {
                        remoteSiteId: json.garden.garden_id
                    });

                    site.setAddress(record.getId());
                    site.save();

               }, this);
            }




/*
            function site(address_id, json) {
                // console.log('addressId ' + address_id + '   ' + json);
                // // create model instance
                var site = Ext.create('EvaluateIt.model.Site', {
                    //address_id: address_id,
                    remoteSiteId: json.garden.garden_id
                });

                site.setAddress(address.get('id'));

                // test an address lookup
                site.getAddress(function(address, operation) {
                    // do something with the address object
                    console.log('Yesh' + address.get('id'));
                }, this);

                // save model instance
                site.save(function(siteObj){
                    // console.log('function siteObj id is ' + siteObj.getId());

                    // once the site is saved we can save the evaluation for the site.
                    var evaluation = Ext.create('EvaluateIt.model.Evaluation', {
                        site_id:             siteObj.getId(),
                        remoteEvaluationId: json.evaluation_id,
                        dateOfEvaluation:    json.date_evaluated,
                        comments:            json.comments,
                        category:            json.category,
                        remoteEvaluatorId:   json.evaluator_id,
                        // datePostedToRemote:  json[i].date_assigned,
                        evaluationType:      json.eval_type
                        // noLongerExists:      json.garden.no_longer_exists

                    });
                    evaluation.save(function(record){
                        // console.log('evaluation.id '+ record.getId() + '   ' + json);
                    }, this);
                }, this);
                // test an evaluation lookup 2 different ways
                var evaluations = site.siteEvaluations();

                // console.log('evaluations = ' + evaluations.comments);

                // site.getEvaluation(function(siteEval, operation){
                //     console.log('siteEval id is '+ siteEval.get('id'));
                // });
            }

            */

		} // end if

        // reload store to show up-to-date data
        Ext.StoreMgr.get('SiteEvaluations').load();

        // insert evaluators for evaluation: in practice, an evaluator has many evaluations;
        // however, assume that only one evaluator uses the device,
        // and thus, no direct association is needed between models
       	Evaluators = Ext.getStore(Evaluators);

        // need to see if evaluation exists in store
		var match = Evaluators.find('remoteEvaluatorId',  json[i].evaluator.evaluator_id);

		console.log(Evaluators.find('remoteEvaluatorId', + json[i].evaluator.evaluator_id)); 
				  
		if (match === -1) {
			console.log('Adding Evaluator!');
			newEvaluator = {remoteEvaluatorId: json[i].evaluator.evaluator_id, firstName: json[i].evaluator.firstname, lastName: json[i].evaluator.lastname, email: json[i].evaluator.email};
			Evaluators.add(newEvaluator);
			Evaluators.sync();

		}
    }
}

