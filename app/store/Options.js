/**
 * Menu structure of app using tree store data structure
 * Roots are defined by function; leaves are end points for navigating to specified views 
**/

(function () {

    var root = {
        id: 'root',
        text: 'EvaluateIt!',
        items: [
            {
                text: 'Manage Evaluations',
                id: 'ui',
                cls: 'launchscreen',
                items: [
					{
                        text: 'General',
                        leaf: true,
                        id: 'general',
            			category: 'evaluations'
                    }, 
                    {
                        text: 'Evaluation',
                        leaf: true,
                        id: 'evaluation',
            			category: 'evaluations'
                    },
					{
                        text: 'Award',
                        leaf: true,
                        id: 'award',
            			category: 'evaluations'
                    },  
					{
                        text: 'Geoposition',
                        leaf: true,
                        id: 'geoposition'
                    },
                    {
                        text: 'Geolocation',
                        leaf: true,
                        id: 'geolocation',
            			category: 'evaluations'
                    }
		
                ]
            }
        ]
    };
 
    root.items.push({ 
        text: 'Manage Data',
        id: 'data',
		card: false,
        items: [
			// GET remote
			{
                text: 'Pull',
                leaf: true,
                id: 'pull'
            },
			// POST data to remote
		 	{
                text: 'Push',
                leaf: true,
                id: 'push',
				category: 'push'
            },
			// clear data store
			{
                text: 'Clear',
                leaf: true,
                id: 'clear'
            }


        ]
    });

    Ext.define('EvaluateIt.store.Options', {
        alias: 'store.Options',
        extend: 'Ext.data.TreeStore',
        requires: ['EvaluateIt.model.Option'],

        config: {
            model: 'EvaluateIt.model.Option',
            root: root,
            defaultRootProperty: 'items'
        }
    });
})();
