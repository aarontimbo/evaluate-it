/**
 * Widget, with template to render displayed sites to remove 
*/

Ext.define('EvaluateIt.view.RemoveRecordList', {
    extend: 'Ext.dataview.List', //'Ext.tab.Panel',
	alias : 'widget.removeRecordList',
    config: {
		width: Ext.os.deviceType == 'Phone' ? null : 300,
		height: Ext.os.deviceType == 'Phone' ? null : 500,
		xtype: 'list',
		store: 'SiteEvaluations', //getRange(0, 9),
		itemTpl: [
			'<div><strong>Address: {address}</strong></div> '
		],
		variableHeights: false
    }

}); 


