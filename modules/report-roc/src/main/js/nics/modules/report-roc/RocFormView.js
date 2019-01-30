/*
 * Copyright (c) 2008-2016, Massachusetts Institute of Technology (MIT)
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice, this
 * list of conditions and the following disclaimer.
 *
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 * this list of conditions and the following disclaimer in the documentation
 * and/or other materials provided with the distribution.
 *
 * 3. Neither the name of the copyright holder nor the names of its contributors
 * may be used to endorse or promote products derived from this software without
 * specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
 * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
 * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
 * CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
 * OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
define(['iweb/CoreModule', './RocFormController', './RocFormModel' , 'nics/modules/report/common/FormVTypes'],
       
function(Core, RocFormController, RocFormModel ) {

	return Ext.define('modules.report-roc.RocFormView', {
		extend: 'Ext.form.Panel',
		
	 	controller: 'rocformcontroller',
	 	 viewModel: {
		       type: 'roc'
		    },
	 	buttonAlign: 'center',
	 	autoHeight: true,
	 	defaults: { padding:'5'},
		reference: "rocReportForm",
        title: 'ROC Report',
        defaultType: 'textfield',
        bodyPadding: 10,
		referenceHolder: true,
	    items:[
	    {bind:'{errorMessage}', xtype:'displayfield', reference: 'errorLabel', xtype: 'label', hidden: true,
        	    	 			style: {color: 'red'}, padding: '0 0 0 5', border: true},
	    { 
	    	 xtype: 'fieldset',
	         title: 'Incident Info',
	         defaultType: 'textfield',
	         defaults: {
	             anchor: '100%'
	             
	         },
	    	 items:[  {bind:'{reportType}',fieldLabel: 'Report Type',xtype:'displayfield'},
	    	 	      {xtype: 'hiddenfield',bind:'{formTypeId}' },
	    	         { xtype: 'fieldcontainer',layout:'hbox',defaultType: 'textfield', defaults: {anchor: '100%'},
							items:[
								{bind: {store: '{activeIncidentsStore}', value: '{incidentName}', readOnly: '{incidentNameReadOnly}', editable: '{!incidentNameReadOnly}'}, xtype: 'combobox', vtype:'simplealphanum', fieldLabel: 'Incident Name*',
									queryMode: 'local', displayField: 'incidentName', valueField: 'incidentName', anyMatch: true,
									allowBlank: false, cls:'roc-required', flex:2,
									listeners: {
										select: 'onIncidentSelect',
										change: 'onIncidentChange'
									}
								},
								{bind: '{incidentId}', vtype:'alphanum', fieldLabel: 'Incident Number*', padding:'0 0 0 5', flex:1, labelAlign:"left", width: 100,
									cls:'roc-required', readOnly: true}
							]
					},
					{ xtype: 'button', text: 'Edit Incident', handler: 'onEditIncidentClick', maxWidth: 100},
					{ xtype: 'fieldcontainer', layout: 'hbox', defaultType: 'textfield', defaults: {anchor: '100%'},
						items: [
							//{ text: 'Incident Location', xtype: 'label'},
							{ bind: '{longitude}', reference: 'longitude', xtype: 'numberfield', fieldLabel: 'Longitude*', hideTrigger: true, keyNavEnabled: false, mouseWheelEnabled: false, decimalPrecision: 14, allowBlank: false, cls:'roc-required', width: 220 },
							{ bind: '{latitude}', reference: 'latitude', xtype: 'numberfield', fieldLabel: 'Latitude*', hideTrigger: true, keyNavEnabled: false, mouseWheelEnabled: false, decimalPrecision: 14, allowBlank: false, cls:'roc-required', width: 220, padding:'0 0 0 5' },
							{ xtype: 'button', text: 'Locate', enableToggle: true, toggleHandler: 'onLocateToggle', reference: 'locateButton', width: 60, margin:'0 0 0 20'}
						]
					},
					{bind: '{incidentType}',vtype:'simplealphanum',fieldLabel: 'Type of Incident*',allowBlank:false,cls:'roc-required'},
					{bind:'{country}',vtype:'simplealphanum',fieldLabel: 'Country*',allowBlank:false,cls:'roc-required',emptyText:'country name only'},
					{bind:'{state}',vtype:'simplealphanum',fieldLabel: 'State*',allowBlank:false,cls:'roc-required',emptyText:'state name only'},
					{ bind: '{incidentDescription}', xtype: 'textarea', fieldLabel: 'Description', width: 100 ,  maxLength: 500, enforceMaxLength: true},
					{xtype: 'hiddenfield',bind:'{formTypeId}' },
//	    	 	        {bind:'{rocDisplayName}',vtype:'simplealphanum',fieldLabel: 'ROC Display Name*',allowBlank:false,cls:'roc-required'},
//	    	 	        {bind:'{county}',vtype:'simplealphanum',fieldLabel: 'County*',allowBlank:false,cls:'roc-required',emptyText:'county name only'},
//	    	 	        {bind: '{date}',xtype: 'datefield',fieldLabel: 'Date*',format: 'm/d/y',cls:'roc-required',allowBlank:false},
//	    	 	        {bind: '{starttime}',xtype: 'timefield',fieldLabel: 'Start Time*',format: 'H:i',hideTrigger:true,allowBlank:false,cls:'roc-required',
//	    	 	        	listeners: {beforequery : function() { return false;  }}},
//	    	 	        {bind: '{location}',xtype: 'textarea',vtype:'extendedalphanum',fieldLabel: 'Location*',allowBlank:false,cls:'roc-required'},
//	    	 	        {bind: '{jurisdiction}',vtype:'simplealphanum',fieldLabel: 'Jurisdiction*',allowBlank:false,cls:'roc-required',emptyText:'SRA,FRA,LRA'},
//	    	 	        {bind: '{incidentType}',vtype:'simplealphanum',fieldLabel: 'Type of Incident*',allowBlank:false,cls:'roc-required'},
//	    	 	        {bind: '{incidentCause}',xtype: 'textarea',vtype:'extendedalphanum',fieldLabel: 'Incident Cause'}
	    	]
	    },
	    
	    {
	    	xtype: 'fieldset',
	    	title: 'Incident Scope',
	        defaultType: 'textfield',
	        defaults: {
	             anchor: '100%'
	        },
	        items: [{bind:'{scope}',vtype:'extendedalphanum',fieldLabel: 'Size/scope of Incident*',allowBlank:false,cls:'roc-required'},
	                {bind:'{spreadRate}',vtype:'extendedalphanum',fieldLabel: 'Rate of Spread*',allowBlank:false,cls:'roc-required',emptyText:'Critical, Moderate, Slow'},
	                {bind:'{fuelType}',vtype:'extendedalphanum',fieldLabel: 'Fuel Type'},
	                {bind:'{potential}',vtype:'extendedalphanum',fieldLabel: 'Potential'},
	                {bind:'{percentContained}',vtype:'extendednum',fieldLabel: '% Contained*',allowBlank:false,cls:'roc-required'},
	                {bind:'{estimatedContainment}',vtype:'extendedalphanum',fieldLabel: 'Estimated Containment'},
		            {bind:'{estimatedControl}',vtype:'extendedalphanum',fieldLabel: 'Estimated Control'}
	                
	        ]
	   },
	   {
	    	xtype: 'fieldset',
	    	title: 'Weather',
	        defaultType: 'textfield',
	        defaults: {
	             anchor: '100%'
	        },
	        items: [{bind:'{temperature}',vtype:'extendednum',fieldLabel: 'Temperature*',allowBlank:false,cls:'roc-required'},
	                {bind:'{relHumidity}',vtype:'extendednum',fieldLabel: 'Relative Humidity*',allowBlank:false,cls:'roc-required'},
	                {bind:'{windSpeed}',vtype:'extendedalphanum',fieldLabel: 'Wind Speed  mph*',allowBlank:false,cls:'roc-required'},
	                {bind:'{windDirection}',vtype:'extendedalphanum',fieldLabel: 'Wind Direction*',allowBlank:false,cls:'roc-required'},
	                {bind:'{predictedWeather}',vtype:'extendedalphanum',fieldLabel: 'Predicted Weather Conditions*',allowBlank:false,cls:'roc-required'}
	        ]
	                
	   },
	   {
	    	xtype: 'fieldset',
	        defaultType: 'textfield',
	        defaults: {
	             anchor: '100%',
	             vtype:'simplealphanum'
	        },
	        items: [{bind:'{evacuations}',xtype: 'textarea',fieldLabel: 'Evacuations*',allowBlank:false,cls:'roc-required'},
	                {bind:'{structuresThreat}',xtype: 'textarea',fieldLabel: 'Structures Threat*',allowBlank:false,cls:'roc-required'},
	                {bind:'{infrastructuresThreat}',xtype: 'textarea',fieldLabel: 'Infrastructures Structures Threat*',allowBlank:false,cls:'roc-required'},
	                {bind:'{icpLocation}',xtype: 'textarea',fieldLabel: 'ICP Location'}
	        ]
	   },
	  
	   {
	    	xtype: 'fieldset',
	    	title: 'Resources Committed',
	        defaultType: 'textfield',
	        defaults: {
	             anchor: '100%',
     	        vtype:'simplealphanum'
	        },
	        items: [{
	        	    xtype: 'fieldset',
	        	    title: 'Aircraft',
	        	    defaultType: 'textfield',
	        	    defaults: {
	        	        anchor: '100%'
	        	    },
	        	    items: [{bind:'{airAttack}',fieldLabel: 'Air Attack'},
	        	            {bind:'{airTankers}',fieldLabel: 'Air Tankers'},
	        	            {bind:'{helicopters}',fieldLabel: 'Helicopters'}
	        	    ]
	        	               
	        	},
	        		{bind:'{overhead}',fieldLabel: 'Overhead'},
	                {bind:'{typeIEngine}',fieldLabel: 'Type I Engine'},
	                {bind:'{typeIIEngine}',fieldLabel: 'Type II Engine'},
	                {bind:'{typeIIIEngine}',fieldLabel: 'Type III Engine'},
	                {bind:'{waterTender}',fieldLabel: 'Water Tender'},
	                {bind:'{dozers}',fieldLabel: 'Dozers'},
	                {bind:'{handcrews}',fieldLabel: 'Handcrews'},
	                {bind:'{comUnit}',fieldLabel: 'Com Unit'}
	        ]
	               
	   },
	   {
	    	xtype: 'fieldset',
	        defaultType: 'textfield',
	        defaults: {
	             anchor: '100%'
	        },
	        items: [{bind:'{email}',vtype:'emaillist',xtype: 'textarea',fieldLabel: 'Email (comma separated)'},
	                {bind:'{simplifiedEmail}',xtype: 'checkboxfield', boxLabel: 'Simplified Email',id: 'simplifiedEmail',checked:true },
	                {bind:'{comments}',vtype:'extendedalphanum',xtype: 'textarea',fieldLabel: 'General Comments'},
	                {bind:'{reportBy}',vtype:'simplealphanum',fieldLabel: 'Report By'}
	        ]
	   },
	 ] ,
	 buttons: [
	{
		text: 'Submit',
		reference: 'submitButton',
	    handler: 'submitForm',
	     formBind: true, //only enabled once the form is valid
	     disabled: true
	},{
		text: 'Reset',
		reference: 'resetButton',
		handler: 'clearForm'
	},{
		text: 'Cancel',
		reference: 'cancelButton',
		handler: 'cancelForm'
	}]
		 	
	 	
	});
});
