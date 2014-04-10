Ext.require(['EvaluateIt.model.Site']);

Ext.define('EvaluateIt.model.Address', {
    extend: 'Ext.data.Model',
    config: {
        idProperty: 'id', // use with proxy.SQL
        fields: [
            {name: 'id', type: 'int'},
            {name: 'address', type: 'string'},
            {name: 'city', type: 'string'},
            {name: 'state', type: 'string'},
            {name: 'zipcode', type: 'string'},
			{name: 'county', type: 'string'}
        ],
		proxy: {
           	type: "sql", //"localstorage",
			database: 'Test'
        },
        associations: [
        {
            type: 'belongsTo',
            model: 'EvaluateIt.model.Site',
            associationKey: 'siteId',
            name: 'site',
            instanceName: 'site',
            getterName: 'getSite',
            setterName: 'setSite',
            foreignKey: 'site_id'
        }]

    }
});
