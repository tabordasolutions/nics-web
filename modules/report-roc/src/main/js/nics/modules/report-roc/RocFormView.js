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
									allowBlank: false, cls:'roc-required', readOnlyCls: 'roc-read-only', flex:2,
									listeners: {
										select: 'onIncidentSelect',
										change: 'onIncidentChange'
									}
								},
								{bind: '{incidentId}', vtype:'alphanum', fieldLabel: 'Incident Number*', padding:'0 0 0 5', flex:1, labelAlign:"left", width: 100,
									readOnly: true, reference: 'incidentId'}
							]
					},
					{ xtype: 'fieldcontainer', layout: 'hbox', defaultType: 'textfield', defaults: {anchor: '100%'},
						items: [
							{ bind: {value: '{longitude}', readOnly: '{readOnlyIncidentDetails}'}, reference: 'longitude', xtype: 'numberfield', fieldLabel: 'Longitude*', hideTrigger: true,
							  keyNavEnabled: false, mouseWheelEnabled: false, decimalPrecision: 14, allowBlank: false, cls:'roc-required', readOnlyCls: 'roc-read-only', width: 220,
								listeners: {
									change: {fn: 'onLocationChange', delay: 100}
								}
							},
							{ bind:  {value: '{latitude}', readOnly: '{readOnlyIncidentDetails}'}, reference: 'latitude', xtype: 'numberfield', fieldLabel: 'Latitude*', hideTrigger: true,
							  keyNavEnabled: false, mouseWheelEnabled: false, decimalPrecision: 14, allowBlank: false, cls:'roc-required', 	readOnlyCls: 'roc-read-only', width: 220, padding:'0 0 0 5',
								listeners: {
									change: {fn: 'onLocationChange', delay: 100}
								}
							},
							{ xtype: 'button', text: 'Locate', enableToggle: true, toggleHandler: 'onLocateToggle', reference: 'locateButton', bind: {disabled: '{readOnlyIncidentDetails}'},
								width: 60, margin:'0 0 0 20'}
						]
					},
					{bind: {value: '{incidentType}', readOnly: '{readOnlyIncidentDetails}'}, xtype: 'checkboxgroup', fieldLabel: 'Incident Type*',
						vertical: true, columns: 2, scrollable: true, reference: 'incidentTypesRef', items: [],
					},
					{ bind: '{state}', fieldLabel: 'State / Province / Region *', xtype: 'displayfield' },
					{xtype: 'hiddenfield',bind:'{formTypeId}' },
			]
	    },

	    {
    		xtype: 'fieldset',
    		title: 'ROC Details',
    	    defaultType: 'textfield',
    	    defaults: {
    	         anchor: '100%'
    	    },
    	    items: [
	            {
	    	        xtype: 'fieldset',
	    	        title: 'Incident Info',
	                defaultType: 'textfield',
	                defaults: {
	                anchor: '100%'
	            },
	            items: [
	                    {xtype: 'combobox', fieldLabel: 'Initial County*', allowBlank:false, cls:'roc-required', store: ['', 'Alameda', 'Alpine', 'Amador', 'Butte', 'Calaveras', 'Colusa', 'Contra Costa', 'Del Norte', 'El Dorado', 'Fresno', 'Glenn', 'Humboldt',
							'Imperial', 'Inyo', 'Kern', 'Kings', 'Lake', 'Lassen', 'Los Angeles', 'Madera', 'Marin', 'Mariposa', 'Mendocino', 'Merced', 'Modoc', 'Mono', 'Monterey', 'Napa', 'Nevada', 'Orange',
							'Placer', 'Plumas', 'Riverside', 'Sacramento', 'San Benito', 'San Bernardino', 'San Diego', 'San Francisco', 'San Joaquin', 'San Luis Obispo',
							'San Mateo', 'Santa Barbara', 'Santa Clara', 'Santa Cruz', 'Shasta', 'Sierra', 'Siskiyou', 'Solano', 'Sonoma', 'Stanislaus', 'Sutter', 'Tehama',
							'Trinity', 'Tulare', 'Tuolumne', 'Ventura', 'Yolo', 'Yuba'], bind: '{initialCounty}'
						},
	                    {bind:'{county}',vtype:'extendedalphanum', fieldLabel: 'Additional Affected Counties', allowBlank:true},
                        {bind:'{location}',vtype:'extendedalphanum', fieldLabel: 'Location*', allowBlank:false, cls:'roc-required'},
                        {value:'{dpa}', xtype: 'combobox', fieldLabel: 'DPA*',
                            reference: 'dpa', queryMode: 'local', allowBlank:false, cls: 'roc-required', editable: false,
                            forceSelection: true, autoSelect: false, store: ['', 'State', 'Federal', 'Local', 'State/Federal', 'State/Local', 'State/FederalLocal']},
                        {value:'{sra}', xtype: 'combobox', fieldLabel: 'Ownership*',
                            reference: 'sra', queryMode: 'local', allowBlank:false, cls: 'roc-required', editable: false,
                            forceSelection: true, autoSelect: false, store: ['', 'SRA', 'FRA', 'LRA', 'FRA/SRA', 'FRA/LRA', 'SRA/LRA', , 'SRA/FRA', 'LRA/SRA', 'LRA/FRA', 'DOD']},
                        {bind:'{jurisdiction}', vtype:'extendedalphanum', fieldLabel: 'Jurisdiction*', allowBlank:false, cls:'roc-required'},
                        {bind: '{date}', xtype: 'datefield', fieldLabel: 'Date*', format: 'm/d/y',cls:'roc-required', allowBlank:false},
                        {bind: '{starttime}', xtype: 'timefield', fieldLabel: 'Start Time*', format: 'H:i', hideTrigger:true, allowBlank:false, cls:'roc-required'}
	                ]
	            },
	            {
	    	        xtype: 'fieldset',
	    	        title: 'Vegetaion Fire Incident Scope',
	                defaultType: 'textfield',
	                defaults: {
	                anchor: '100%'
	            },
	            items: [{bind:'{scope}',vtype:'extendedalphanum',fieldLabel: 'Acreage*',allowBlank:false,cls:'roc-required'},
                        {value:'{spreadRate}', xtype: 'combobox', vtype:'simplealphanum', fieldLabel: 'Rate of Spread',
                            reference: 'spreadRate', queryMode: 'local', editable: false,
                            forceSelection: true, autoSelect: false, store: ['', 'Low', 'Moderate', 'Dangerous', 'Critical']},
                        {bind: '{fuelType}', xtype: 'checkboxgroup', fieldLabel: 'Fuel Type(s)*', allowBlank: false, cls: 'roc-required', vertical: true, columns: 2,
                            items: [
                                { boxLabel: 'Grass', name: 'fueltype', inputValue: 'Grass', uncheckedValue: ''},
                                { boxLabel: 'Bush', name: 'fueltype', inputValue: 'Bush', uncheckedValue: ''},
                                { boxLabel: 'Timber', name: 'fueltype', inputValue: 'Timber', uncheckedValue: ''},
                                { boxLabel: 'Oak Woodland', name: 'fueltype', inputValue: 'Oak Woodland', uncheckedValue: ''},
                                { boxLabel: 'Other', name: 'fueltype', inputValue: 'Other', uncheckedValue: '', reference: 'otherFuelTypeCheckBox'}
                            ]
                        },
                        {bind: { value: '{otherFuelType}', disabled: '{!otherFuelTypeCheckBox.checked}' }, fieldLabel: 'Other Fuel Type(s)*', vtype:'extendedalphanum',
                            validator: function(val) {
                                return (!this.disabled && !val) ? "Other Fuel Type is required" : true;
                            }, cls: 'roc-required'
                        },
                        {bind:'{percentContained}',vtype:'extendednum',fieldLabel: '% Contained*',allowBlank:false,cls:'roc-required'},
	                ]
	            },
                {
                        xtype: 'fieldset',
                        title: 'Weather Information',
                        defaultType: 'textfield',
                        defaults: {
                             anchor: '100%'
                        },
                        items: [{bind:'{temperature}', vtype:'extendednum', fieldLabel: 'Temperature'},
                                {bind:'{relHumidity}', vtype:'extendednum', fieldLabel: 'Relative Humidity'},
                                {bind:'{windSpeed}', vtype:'extendedalphanum', fieldLabel: 'Wind Speed'},
                                {bind:'{windDirection}', xtype:'numberfield', fieldLabel: 'Wind Direction', minValue: 0, maxValue: 360}
                        ]

                   },
                {
                        xtype: 'fieldset',
                        title: 'Threats & Evacuations',
                        defaultType: 'textfield',
                        defaults: {
                             anchor: '100%',
                             vtype:'simplealphanum'
                        },
                        items: [{bind: '{evacuations}', xtype: 'combobox', fieldLabel: 'Evacuations*',allowBlank:false,cls:'roc-required',
                                queryMode: 'local', forceSelection: true, autoSelect: false, editable: false,
                                store: ['Yes', 'No', 'Mitigated'] },
                                {bind:{value: '{evacuationsInProgress}', disabled: '{disableEvacuationsInProgress}'}, //xtype: 'combobox',
                                    disabled: true, xtype: 'textarea',fieldLabel: 'Evacuations in progress for*', cls:'roc-required',
                                    validator: function(val) {
                                        return (!this.disabled && !val) ? "This is a required field" : true;
                                    }//, store: ['TEst 1', 'TEst 2', 'Test 3']
                                },
                                { xtype: 'button', text: 'Add', handler: 'addEvacuationsInProgressField', bind: {disabled: '{disableEvacuationsInProgress}'},
                                								width: 60, margin:'0 0 0 20'},
                                {bind:'{structuresThreat}',xtype: 'combobox',fieldLabel: 'Structures Threat*',allowBlank:false,cls:'roc-required',
                                queryMode: 'local', forceSelection: true, autoSelect: false, editable: false,
                                                                store: ['', 'Yes', 'No', 'Mitigated']},
                                {bind: {value: '{structuresThreatInProgress}', disabled: '{disableStructuresThreatInProgress}'},
                                    disabled: true, xtype: 'textarea',fieldLabel: 'Structures Threat in progress for*', cls:'roc-required',
                                    validator: function(val) {
                                        return (!this.disabled && !val) ? "This is a required field" : true;
                                    }
                                },
                                {bind: '{infrastructuresThreat}', xtype: 'combobox',fieldLabel: 'Infrastructure Threat*',allowBlank:false,cls:'roc-required',
                                queryMode: 'local', forceSelection: true, autoSelect: false, editable: false,
                                                                                                store: ['', 'Yes', 'No', 'Mitigated']},
                                {bind: {value: '{infrastructuresThreatInProgress}', disabled: '{disableInfrastructuresThreatInProgress}'},
                                    disabled: true, xtype: 'textarea',fieldLabel: 'Infrastructure Threat in progress for*',allowBlank:false,cls:'roc-required',
                                    validator: function(val) {
                                        return (!this.disabled && !val) ? "This is a required field" : true;
                                    }
                                },
                                {bind:'{otherThreatsAndEvacuations}', xtype: 'combobox',fieldLabel: 'Other Threats & Evacuations*',allowBlank:false,cls:'roc-required',
                                reference: 'otherThreatsAndEvacuations', queryMode: 'local', forceSelection: true, autoSelect: false, editable: false,
                                                                                                store: ['', 'Yes', 'No', 'Mitigated']},
                                {bind:'{otherThreatsAndEvacuationsInProgress}',xtype: 'textarea',fieldLabel: 'Other Threats & Evacuations Information*',allowBlank:false,cls:'roc-required'},

                        ]
                   },
                {
                        xtype: 'fieldset',
                        title: 'CAL FIRE Resource Commitment',
                        defaultType: 'textfield',
                        defaults: {
                             anchor: '100%',
                            vtype:'simplealphanum'
                        },
                        items: [
                        {bind:'{calfireIncident}',xtype: 'combobox',fieldLabel: 'CAL FIRE Incident',
                         reference: 'calFireIncident', queryMode: 'local', forceSelection: true, autoSelect: false, editable: false,
                         store: ['', 'Yes', 'No']},
                        {bind: '{resourcesAssigned}', xtype: 'checkboxgroup', fieldLabel: 'Resources Assigned', vertical: true, columns: 1,
                                                    items: [
                                                        { boxLabel: 'No CAL FIRE Resources', name: 'resourcesAssigned', inputValue: 'No CAL FIRE Resources', bind: {hidden: '{finalReport}'}},
                                                        { boxLabel: 'CAL FIRE Air Resources Assigned', name: 'resourcesAssigned', inputValue: 'CAL FIRE Air Resources Assigned', bind: {hidden: '{finalReport}'}},
                                                        { boxLabel: 'CAL FIRE Ground Resources Assigned', name: 'resourcesAssigned', inputValue: 'CAL FIRE Ground Resources Assigned', bind: {hidden: '{finalReport}'}},
                                                        { boxLabel: 'CAL FIRE Air and Ground Resources Assigned', name: 'resourcesAssigned', inputValue: 'CAL FIRE Air and Ground Resources Assigned', bind: {hidden: '{finalReport}'}},
                                                        { boxLabel: 'CAL FIRE Air and Ground Resources Augmented', name: 'resourcesAssigned', inputValue: 'CAL FIRE Air and Ground Resources Augmented', bind: {hidden: '{finalReport}'}},
                                                        { boxLabel: 'CAL FIRE Agency Rep ordered', name: 'resourcesAssigned', inputValue: 'CAL FIRE Agency Rep ordered', bind: {hidden: '{finalReport}'}},
                                                        { boxLabel: 'CAL FIRE Agency Rep assigned', name: 'resourcesAssigned', inputValue: 'CAL FIRE Agency Rep assigned', bind: {hidden: '{finalReport}'}},
                                                        { boxLabel: 'Significant augmentation of resources', name: 'resourcesAssigned', inputValue: 'Significant augmentation of resources', bind: {hidden: '{finalReport}'}},
                                                        { boxLabel: 'Very Large Air Tanker (VLAT) on order', name: 'resourcesAssigned', inputValue: 'Very Large Air Tanker (VLAT) on order', bind: {hidden: '{finalReport}'}},
                                                        { boxLabel: 'Very Large Air Tanker (VLAT) assigned', name: 'resourcesAssigned', inputValue: 'Very Large Air Tanker (VLAT) assigned', bind: {hidden: '{finalReport}'}},
                                                        { boxLabel: 'No divert on Air Tankers for life safety', name: 'resourcesAssigned', inputValue: 'No divert on Air Tankers for life safety', bind: {hidden: '{finalReport}'}},
                                                        { boxLabel: 'Large Air Tanker (LAT) assigned', name: 'resourcesAssigned', inputValue: 'Large Air Tanker (LAT) assigned', bind: {hidden: '{finalReport}'}},
                                                        { boxLabel: 'Continued commitment of CAL FIRE air and ground resources', name: 'resourcesAssigned', inputValue: 'Continued commitment of CAL FIRE air and ground resources', bind: {hidden: '{!updateReport}'}},
                                                        { boxLabel: 'All CAL FIRE air and ground resources released', name: 'resourcesAssigned', inputValue: 'All CAL FIRE air and ground resources released', bind: {hidden: '{!finalReport}' }}
                                                    ]
                        }
                        ]

                   },
                {
                        xtype: 'fieldset',
                        title: 'Email',
                        defaultType: 'textfield',
                        defaults: {
                             anchor: '100%'
                        },
                        items: [
                            {bind:'{email}',xtype: 'displayfield',fieldLabel: 'Recipient Email'}
                        ]
                   },
            ]
        },
    ],

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
