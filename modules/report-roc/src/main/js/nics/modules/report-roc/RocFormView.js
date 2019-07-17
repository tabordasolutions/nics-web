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
	 	defaults: { padding:'7'},
		reference: "rocReportForm",
        title: 'ROC Report',
        defaultType: 'textfield',
        bodyPadding: 12,
		referenceHolder: true,
	    items:[
	    {bind:'{errorMessage}', xtype:'displayfield', reference: 'errorLabel', xtype: 'label', hidden: true,
        		 			style: {color: 'red'}, padding: '0 0 0 5', border: true},
		{bind:'{successMessage}', xtype:'displayfield', reference: 'successLabel', xtype: 'label', hidden: true,
 			style: {color: 'green'}, padding: '0 0 0 5', border: true},
	    { 
	    	 xtype: 'fieldset',
	         title: 'Incident Info',
	         defaultType: 'textfield',
	         defaults: {
	             anchor: '100%'
	         },
	    	 items:[  {bind:'{reportType}',fieldLabel: 'Report Type',xtype:'displayfield'},
	    	 	      {xtype: 'hiddenfield',bind:'{formTypeId}' },
                      {xtype: 'fieldcontainer',layout:'hbox',defaultType: 'textfield', defaults: {anchor: '100%'},
                        items:[
						    {bind: {store: '{activeIncidentsStore}', value: '{incidentName}', readOnly: '{incidentNameReadOnly}', editable: '{!incidentNameReadOnly}'},
                                    xtype: 'combobox', vtype:'simplealphanum', fieldLabel: 'Incident Name',
							    	queryMode: 'local', displayField: 'incidentName', valueField: 'incidentName', anyMatch: true,
									allowBlank: false, cls:'roc-required', readOnlyCls: 'roc-read-only', flex:2,
									listeners: {
										select: 'onIncidentSelect',
										change: 'onIncidentChange'
									}
							}
                        ]
                      },
                      {
                         xtype: 'fieldcontainer', layout: 'hbox', defaultType: 'textfield',
                         items: [
                             {bind: '{incidentNumber}', vtype:'extendedalphanum', fieldLabel: 'Incident Number', flex:1, labelAlign:"left", width: 100, reference: 'incidentNumber'}
                         ]
                      },

					{ xtype: 'fieldcontainer', layout: 'hbox', defaultType: 'textfield', reference: 'latitudeGroupRef',
					    items: [
                            {
                                bind: {
                                    value: '{latDegrees}',
                                    readOnly: '{readOnlyIncidentDetails}'
                                },
                                xtype: 'numberfield',
                                reference: 'latDegreesRef',
                                flex: 1,
                                allowBlank: false,
                                minValue: -89,
                                maxValue: 89,
                                allowDecimals: false,
                                fieldLabel: 'Latitude',
                                cls: 'roc-required',
                                listeners: { change: {fn: 'onLocationChange', delay: 1000} }
                            },
						    {
						        xtype: 'displayfield',
						        value: '°',
						        width: 10,
						        fieldStyle  : "text-align:center"
                            },
                            {
                                bind: {
                                    value: '{latDecimal}',
                                    readOnly: '{readOnlyIncidentDetails}'
                                },
                                xtype: 'numberfield',
                                reference: 'latDecimalRef',
                                flex: 1,
                                allowBlank: false,
                                allowDecimals: false,
                                minValue:0,
                                maxValue: 59,
                                listeners: {
                                    change: {fn: 'onLocationChange', delay: 100}
                                }
                            },
						    {
						        xtype: 'displayfield',
						        value: '.',
						        width: 10,
						        fieldStyle  : "text-align:center"
                            },

                            /* Original field.  Make it hidden. */
						    {
                                bind: {
                                    value: '{latMinutes}',
                                    readOnly: '{readOnlyIncidentDetails}'
                                },
                                xtype: 'hiddenfield',
                                reference: 'latMinutesRef',
                                flex: 1,
                                allowBlank: false,
                                allowDecimals: false,
                                minValue:0,
                                maxValue: 9999,
                                listeners: {
                                    change: {fn: 'onLocationChange', delay: 100}
                                }
                            },

                            /* New field.  Make it display purpose. */
                            {
                                bind: {
                                    value: '{latMinutesDisplay}',
                                    readOnly: '{readOnlyIncidentDetails}'
                                },
                                xtype: 'numberfield',
                                reference: 'latMinutesDisplayRef',
                                flex: 1,
                                allowBlank: false,
                                allowDecimals: false,
                                minValue:0,
                                maxValue: 9999,
                                listeners: {
                                    change: {fn: 'onLocationChange', delay: 100}
                                }
                            },
                            {
                                xtype: 'displayfield',
                                value: '\'',
                                width: 10,
                                padding:'0 0 0 5'
                            }
						]
					},
					{
					    xtype: 'fieldcontainer',
					    layout: 'hbox',
					    defaultType: 'textfield',
					    reference: 'longitudeGroupRef',
					    items: [
						    {
						        bind: {
						            value: '{longDegrees}',
						            readOnly: '{readOnlyIncidentDetails}'
                                },
                                xtype: 'numberfield',
                                reference: 'longDegreesRef',
                                flex: 1,
                                allowBlank: false,
                                minValue: -179,
                                maxValue: 179,
                                allowDecimals: false,
							    fieldLabel: 'Longitude',
							    cls: 'roc-required',
							    listeners: {
							        change: {fn: 'onLocationChange', delay: 1000}
                                }
                            },
						    {
						        xtype: 'displayfield',
						        value: '°',
						        width: 10,
						        fieldStyle  : "text-align:center"
                            },
                            {
                                bind: {
                                    value: '{longDecimal}',
                                    readOnly: '{readOnlyIncidentDetails}'
                                },
                                xtype: 'numberfield',
                                reference: 'longDecimalRef',
                                flex: 1,
                                allowBlank: false,
                                allowDecimals: false,
                                minValue:0,
                                maxValue: 59,
                                listeners: {
                                    change: {fn: 'onLocationChange', delay: 100}
                                }
                            },
                            {
                                xtype: 'displayfield',
                                value: '.',
                                width: 10,
                                fieldStyle  : "text-align:center"
                            },

                            /* Original field.  Make it hidden. */
						    {
						        bind: {
						            value: '{longMinutes}',
						            readOnly: '{readOnlyIncidentDetails}'
                                },
                                xtype: 'hiddenfield',
                                reference: 'longMinutesRef',
                                flex: 1,
                                allowBlank: false,
                                minValue:0,
                                maxValue: 9999,
                                listeners: {
                                    change: {fn: 'onLocationChange', delay: 100}
                                }
                            },

                            /* New field.  Make it display purpose. */
                            {
                                bind: {
                                    value: '{longMinutesDisplay}',
                                    readOnly: '{readOnlyIncidentDetails}'
                                },
                                xtype: 'numberfield',
                                reference: 'longMinutesDisplayRef',
                                flex: 1,
                                allowBlank: false,
                                allowDecimals: false,
                                minValue:0,
                                maxValue: 9999,
                                listeners: {
                                    change: {fn: 'onLocationChange', delay: 100}
                                }
                            },

                            {
                                xtype: 'displayfield',
                                value: '\'',
                                width: 10,
                                padding:'0 0 0 5'
                            }
						]
					},
					{ xtype: 'button', text: 'Find Location on Map', enableToggle: true, toggleHandler: 'onLocateToggle', reference: 'locateButton', bind: {disabled: '{readOnlyIncidentDetails}'},
						width: 60, margin:'0 0 0 20'},
					{
					    bind: {
					        value: '{incidentTypes}',
					        readOnly: '{readOnlyIncidentDetails}'
                        },
                        xtype: 'checkboxgroup',
                        fieldLabel: 'Incident Type',
                        vertical: true,
                        columns: 2,
                        scrollable: true,
                        reference: 'incidentTypesRef',
                        items: [],
                        cls: 'roc-required',
                        validator: function(val) {
                            return (!this.readOnly && !val) ? "You must select atleast one Incident Type" : true;
                        },
                        listeners: { change: {fn: 'onIncidentTypeChange'}}
					},
					{ bind: '{state}', fieldLabel: 'State / Province / Region', xtype: 'displayfield' },
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
	                    {xtype: 'combobox', fieldLabel: 'Initial County', allowBlank:false, cls:'roc-required', store: ['', 'Alameda', 'Alpine', 'Amador', 'Butte', 'Calaveras', 'Colusa', 'Contra Costa', 'Del Norte', 'El Dorado', 'Fresno', 'Glenn', 'Humboldt',
							'Imperial', 'Inyo', 'Kern', 'Kings', 'Lake', 'Lassen', 'Los Angeles', 'Madera', 'Marin', 'Mariposa', 'Mendocino', 'Merced', 'Modoc', 'Mono', 'Monterey', 'Napa', 'Nevada', 'Orange',
							'Placer', 'Plumas', 'Riverside', 'Sacramento', 'San Benito', 'San Bernardino', 'San Diego', 'San Francisco', 'San Joaquin', 'San Luis Obispo',
							'San Mateo', 'Santa Barbara', 'Santa Clara', 'Santa Cruz', 'Shasta', 'Sierra', 'Siskiyou', 'Solano', 'Sonoma', 'Stanislaus', 'Sutter', 'Tehama',
							'Trinity', 'Tulare', 'Tuolumne', 'Ventura', 'Yolo', 'Yuba'], bind: '{county}'
						},
	                    {bind:'{additionalAffectedCounties}',vtype:'extendedalphanum', fieldLabel: 'Additional Affected Counties', allowBlank:true},
                        {bind:'{location}',vtype:'extendedalphanumsspecialchars', fieldLabel: 'Location', allowBlank:false, cls:'roc-required'},
                        {bind:'{street}',vtype:'extendedalphanumsspecialchars', fieldLabel: 'Street', allowBlank:false, cls:'roc-required'},
                        {bind:'{crossStreet}',vtype:'extendedalphanumsspecialchars', fieldLabel: 'Cross Street', allowBlank:false, cls:'roc-required'},
                        {bind:'{nearestCommunity}',vtype:'extendedalphanumsspecialchars', fieldLabel: 'Nearest Community', allowBlank:false, cls:'roc-required'},
                        {bind:'{milesFromNearestCommunity}',vtype:'extendedalphanumsspecialchars', fieldLabel: 'Miles from Nearest Community', allowBlank:false, cls:'roc-required'},
                        {bind: '{directionFromNearestCommunity}',
                            xtype: 'combobox',
                            fieldLabel: 'Direction from Nearest Community',
                            allowBlank:false,
                            cls:'roc-required',
                            store: ['', 'N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW']
                        },
                        {bind:'{dpa}', xtype: 'combobox', fieldLabel: 'DPA',
                            queryMode: 'local', allowBlank:false, cls: 'roc-required', editable: false,
                            forceSelection: true, autoSelect: false, store: ['State', 'Federal', 'Local', 'State/Federal', 'State/Local', 'State/FederalLocal']},
                        {bind:'{sra}', xtype: 'combobox', fieldLabel: 'Ownership',
                            queryMode: 'local', allowBlank:false, cls: 'roc-required', editable: false,
                            forceSelection: true, autoSelect: false, store: ['SRA', 'FRA', 'LRA', 'FRA/SRA', 'FRA/LRA', 'SRA/LRA', , 'SRA/FRA', 'LRA/SRA', 'LRA/FRA', 'DOD']},
                        {bind:'{jurisdiction}', vtype:'extendedalphanum', fieldLabel: 'Jurisdiction', allowBlank:false, cls:'roc-required'},
                        {bind: '{date}', xtype: 'datefield', fieldLabel: 'Date', format: 'm/d/y',cls:'roc-required', allowBlank:false},
                        {
                            bind: {
                                value: '{startTime}'
                            },
                            xtype: 'timefield',
                            fieldLabel: 'Start Time',
                            allowBlank: false,
                            cls: 'roc-required',
                            reference: 'startTimeRef',
                            format: 'Hi',
                            hideTrigger: true

                        }
	                ]
	            },
	            {
	    	        xtype: 'fieldset',
	    	        title: 'Vegetaion Fire Incident Scope',
	                defaultType: 'textfield',
	                defaults: {
	                anchor: '100%'
	            },
	            items: [
	                    {
	                        bind:'{scope}',
	                        vtype:'extendedalphanum',
	                        fieldLabel: 'Acreage',
	                        allowBlank: true,
	                        cls:'roc-no-style',
	                        reference: 'scopeRef'
	                    },
                        {
                            bind: '{spreadRate}',
                            xtype: 'combobox',
                            fieldLabel: 'Rate of Spread',
                            queryMode: 'local',
                            forceSelection: true,
                            autoSelect: false,
                            editable: false,
                            reference: 'spreadRateComboRef',
                            store: [
                                '',
                                'Low rate of spread',
                                'Moderate rate of spread',
                                'Dangerous rate of spread',
                                'Critical rate of spread',
                                'Forward spread has been stopped'
                            ]
                        },
                        {
                            bind: {
                                value: '{fuelTypeCheckBoxGroup}',
                                hidden: '{finalReport}'
                            },
                            xtype: 'checkboxgroup',
                            fieldLabel: 'Fuel Type(s)',
                            allowBlank: true,
                            cls: 'roc-no-style',
                            reference: 'fuelTypeCheckboxRef',
                            vertical: true,
                            columns: 2,
                            items: [
                                { boxLabel: 'Grass', name: 'fuelType', inputValue: 'Grass', cls: 'roc-no-style'},
                                { boxLabel: 'Brush', name: 'fuelType', inputValue: 'Brush', cls: 'roc-no-style'},
                                { boxLabel: 'Timber', name: 'fuelType', inputValue: 'Timber', cls: 'roc-no-style'},
                                { boxLabel: 'Oak Woodland', name: 'fuelType', inputValue: 'Oak Woodland', cls: 'roc-no-style'},
                                { boxLabel: 'Other', name: 'fuelType', inputValue: 'Other', cls: 'roc-no-style', reference: 'otherFuelTypeCheckBox'}
                            ],
                            listeners: { change: {fn: 'onOtherFuelTypeCheckBoxChecked'}}
                        },
                        {
                            bind: { value: '{otherFuelTypes}' },
                            disabled: true,
                            fieldLabel: 'Other Fuel Type(s)',
                            vtype:'extendedalphanum',
                            bind: {hidden: '{finalReport}'},
                            reference: 'otherFuelTypesRef',
                            cls: 'roc-no-style'
                        },
                        {
                            bind:'{percentContained}',
                            vtype:'extendednum',
                            fieldLabel: '% Contained',
                            allowBlank: true,
                            cls:'roc-no-style',
                            reference: 'percentContainedRef'
                        },
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
                                {bind:'{windGust}', vtype:'extendedalphanum', fieldLabel: 'Wind Gust'},
                                {bind:'{windDirection}', vtype:'extendedalphanum', fieldLabel: 'Wind Direction'}
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
                        items: [
                            {
                                bind: '{evacuations}',
                                xtype: 'combobox',
                                fieldLabel: 'Evacuations',
                                allowBlank:false,
                                cls:'roc-no-style',
                                queryMode: 'local',
                                forceSelection: true,
                                autoSelect: false,
                                editable: false,
                                store: ['Yes', 'No', 'Mitigated'],
                                reference: 'evacuationsComboboxRef'
                            },
                            {bind: {
                                value: '{evacuationsInProgress}',
                                disabled: '{disableEvacuationsInProgress}'},
                                disabled: true,
                                xtype: 'checkboxgroup',
                                fieldLabel: 'Evacuations in progress for',
                                allowBlank: false,
                                cls: 'roc-required',
                                vertical: true,
                                columns: 2,
                                reference: 'evacuationsInProgressRef',
                                items: [
                                    { boxLabel: 'Evacuation orders in place', name: 'evacuations', inputValue: 'Evacuation orders in place', cls: 'roc-no-style'},
                                    { boxLabel: 'Evacuation center has been established', name: 'evacuations', inputValue: 'Evacuation center has been established', cls: 'roc-no-style'},
                                    { boxLabel: 'Evacuation warnings have been established', name: 'evacuations', inputValue: 'Evacuation warnings have been established', cls: 'roc-no-style'},
                                    { boxLabel: 'Evacuation orders remain in place', name: 'evacuations', inputValue: 'Evacuation orders remain in place', cls: 'roc-no-style'},
                                    { boxLabel: 'Mandatory evacuations are in place', name: 'evacuations', inputValue: 'Mandatory evacuations are in place', cls: 'roc-no-style'},
                                    { boxLabel: 'Other', name: 'evacuations', inputValue: 'Other', reference: 'evacuationsRef', cls: 'roc-no-style'},

                                ],
                                validator: function(val) {
                                    return (!this.disabled && !val) ? "This is a required field" : true;
                                }
                            },
                            {bind: { value: '{otherEvacuations}', disabled: '{!evacuationsRef.checked}' }, fieldLabel: 'Other', vtype:'extendedalphanum',
                                                validator: function(val) {
                                                    return (!this.disabled && !val) ? "Evacuation field is required" : true;
                                                }, listeners: { disable: function() {
                                                   this.reset();
                                                }}, cls: 'roc-required'
                            },
                            {
                                bind:'{structuresThreat}',
                                xtype: 'combobox',
                                fieldLabel: 'Structures Threat',
                                allowBlank:false,
                                cls:'roc-no-style',
                                queryMode: 'local', forceSelection: true, autoSelect: false, editable: false,
                                store: ['', 'Yes', 'No', 'Mitigated'],
                                reference: 'structuresThreatComboRef',
                            },
                            {
                                bind: {
                                    value: '{structuresThreatInProgress}',
                                    disabled: '{disableStructuresThreatInProgress}'
                                },
                                disabled: true,
                                xtype: 'checkboxgroup',
                                fieldLabel: 'Structures Threat in progress for',
                                allowBlank: false,
                                cls: 'roc-required',
                                vertical: true,
                                columns: 2,
                                reference: 'structuresThreatInProgressRef',
                                items: [
                                    { boxLabel: 'Structures threatened', name: 'structuresThreat', inputValue: 'Structures threatened', cls: 'roc-no-style'},
                                    { boxLabel: 'Continued threat to structures', name: 'structuresThreat', inputValue: 'Continued threat to structures', cls: 'roc-no-style'},
                                    { boxLabel: 'Immediate structure threat, evacuations in place', name: 'structuresThreat', inputValue: 'Immediate structure threat, evacuations in place', cls: 'roc-no-style'},
                                    { boxLabel: 'Damage inspection is on going', name: 'structuresThreat', inputValue: 'Damage inspection is on going', cls: 'roc-no-style'},
                                    { boxLabel: 'Inspections are underway to identify damage', name: 'structuresThreat', inputValue: 'Inspections are underway to identify damage', cls: 'roc-no-style'},
                                    { boxLabel: 'Other', name: 'structuresThreat', inputValue: 'Other', reference: 'structureThreatRef', cls: 'roc-no-style'},
                                ],
                                validator: function(val) {
                                    return (!this.disabled && !val) ? "This is a required field" : true;
                                }
                            },
                            {
                                bind: {
                                    value: '{otherStructuresThreat}',
                                    disabled: '{!structureThreatRef.checked}'
                                },
                                fieldLabel: 'Other',
                                vtype:'extendedalphanum',
                                validator: function(val) {
                                    return (!this.disabled && !val) ? "Structure Threat is required" : true;
                                }, listeners: { disable: function() {
                                   this.reset();
                                }}, cls: 'roc-required'
                            },
                            {
                                bind: '{infrastructuresThreat}',
                                xtype: 'combobox',
                                fieldLabel: 'Infrastructure Threat',
                                allowBlank:false,
                                cls:'roc-no-style',
                                queryMode: 'local',
                                forceSelection: true,
                                autoSelect: false,
                                editable: false,
                                store: ['', 'Yes', 'No', 'Mitigated'],
                                reference: 'infrastructuresThreatComboRef',
                            },
                            {bind: {
                                value: '{infrastructuresThreatInProgress}',
                                disabled: '{disableInfrastructuresThreatInProgress}'},
                                disabled: true,
                                xtype: 'checkboxgroup',
                                fieldLabel: 'Infrastructure Threat in progress for',
                                allowBlank: false,
                                cls: 'roc-required',
                                vertical: true,
                                columns: 2,
                                reference: 'infrastructuresThreatInProgressRef',
                                items: [
                                    { boxLabel: 'Immediate structure threat, evacuation in place', name: 'infrastructuresThreat', inputValue: 'Immediate structure threat, evacuation in place', cls: 'roc-no-style'},
                                    { boxLabel: 'Damage inspection is on going', name: 'infrastructuresThreat', inputValue: 'Damage inspection is on going', cls: 'roc-no-style'},
                                    { boxLabel: 'Inspections are underway to identify damage', name: 'infrastructuresThreat', inputValue: 'Inspections are underway to identify damage', cls: 'roc-no-style'},
                                    { boxLabel: 'Major power lines are threatened', name: 'infrastructuresThreat', inputValue: 'Major power lines are threatened', cls: 'roc-no-style'},
                                    { boxLabel: 'Road closures are in the area', name: 'infrastructuresThreat', inputValue: 'Road closers are in the area', cls: 'roc-no-style'},
                                    { boxLabel: 'Other', name: 'infrastructuresThreat', inputValue: 'Other', reference: 'infrastructureThreatRef', cls: 'roc-no-style'},
                                ],
                                validator: function(val) {
                                    return (!this.disabled && !val) ? "This is a required field" : true;
                                }
                            },
                            {bind: { value: '{otherInfrastructuresThreat}', disabled: '{!infrastructureThreatRef.checked}' }, fieldLabel: 'Other', vtype:'extendedalphanum',
                                                validator: function(val) {
                                                    return (!this.disabled && !val) ? "Other Infrastructure Threat is required" : true;
                                                }, listeners: { disable: function() {
                                                   this.reset();
                                                }}, cls: 'roc-required'
                            },
                            {
                                bind: '{otherSignificantInfoCheckBoxGroup}',
                                xtype: 'checkboxgroup',
                                fieldLabel: 'Other Significant Info',
                                allowBlank: true,
                                vertical: true,
                                columns: 2,
                                reference: 'otherSignificantInfoRef',
                                items: [
                                    { boxLabel: 'Continued construction and improving control lines', name: 'otherSignificantInfo', inputValue: 'Continued construction and improving control lines', cls: 'roc-no-style'},
                                    { boxLabel: 'Extensive mop up in oak woodlands', name: 'otherSignificantInfo', inputValue: 'Extensive mop up in oak woodlands', cls: 'roc-no-style'},
                                    { boxLabel: 'Crews are improving control lines', name: 'otherSignificantInfo', inputValue: 'Crews are improving control lines', cls: 'roc-no-style'},
                                    { boxLabel: 'Ground resources continue to mop-up and strengthen control line', name: 'otherSignificantInfo', inputValue: 'Ground resources continue to mop-up and strengthen control line', cls: 'roc-no-style'},
                                    { boxLabel: 'Suppression repair is under way', name: 'otherSignificantInfo', inputValue: 'Suppression repair is under way', cls: 'roc-no-style'},
                                    { boxLabel: 'Fire is in remote location with difficult access', name: 'otherSignificantInfo', inputValue: 'Fire is in remote location with difficult access', cls: 'roc-no-style'},
                                    { boxLabel: 'Access and terrain continue to hamper control efforts', name: 'otherSignificantInfo', inputValue: 'Access and terrain continue to hamper control efforts', cls: 'roc-no-style'},
                                    { boxLabel: 'Short range spotting causing erratic fire behavior', name: 'otherSignificantInfo', inputValue: 'Short range spotting causing erratic fire behavior', cls: 'roc-no-style'},
                                    { boxLabel: 'Medium range spotting observed', name: 'otherSignificantInfo', inputValue: 'Medium range spotting observed', cls: 'roc-no-style'},
                                    { boxLabel: 'Long range spotting observed', name: 'otherSignificantInfo', inputValue: 'Long range spotting observed', cls: 'roc-no-style'},
                                    { boxLabel: 'Fire has spotted and is well established', name: 'otherSignificantInfo', inputValue: 'Fire has spotted and is well established', cls: 'roc-no-style'},
                                    { boxLabel: 'Erratic winds, record high temperatures and low humidity are influencing fuels resulting in extreme fire behavior', name: 'otherSignificantInfo', inputValue: 'Erratic winds, record high temperatures and low humidity are influencing fuels resulting in extreme fire behavior', cls: 'roc-no-style'},
                                    { boxLabel: 'Red Flag warning in effect in area', name: 'otherSignificantInfo', inputValue: 'Red Flag warning in effect in area', cls: 'roc-no-style'},
                                    { boxLabel: 'Minimal fire behavior observed', name: 'otherSignificantInfo', inputValue: 'Minimal fire behavior observed', cls: 'roc-no-style'},
                                    { boxLabel: 'CAL FIRE and USFS in unified command', name: 'otherSignificantInfo', inputValue: 'CAL FIRE and USFS in unified command', cls: 'roc-no-style'},
                                    { boxLabel: 'CAL FIRE Type 1 Incident Management Team ordered', name: 'otherSignificantInfo', inputValue: 'CAL FIRE Type 1 Incident Management Team ordered', cls: 'roc-no-style'},
                                    { boxLabel: 'Incident Management Team ordered', name: 'otherSignificantInfo', inputValue: 'Incident Management Team ordered', cls: 'roc-no-style'},
                                    { boxLabel: 'FMAG application initiated', name: 'otherSignificantInfo', inputValue: 'FMAG application initiated', cls: 'roc-no-style'},
                                    { boxLabel: 'FMAG has been submitted', name: 'otherSignificantInfo', inputValue: 'FMAG has been submitted', cls: 'roc-no-style'},
                                    { boxLabel: 'FMAG application approved', name: 'otherSignificantInfo', inputValue: 'FMAG application approved', cls: 'roc-no-style'},
                                    { boxLabel: 'No updated 209 data at time of report', name: 'otherSignificantInfo', inputValue: 'No updated 209 data at time of report', cls: 'roc-no-style'},
                                    { boxLabel: 'CAL FIRE Mission Tasking has been approved', name: 'otherSignificantInfo', inputValue: 'CAL FIRE Mission Tasking has been approved', cls: 'roc-no-style'},

                                    { boxLabel: 'Other', name: 'otherSignificantInfo', reference: 'otherOtherSignificantInfoCheckboxRef', inputValue: 'Other', cls: 'roc-no-style'},
                                ]
                            },
                            {
                                bind: {
                                    value: '{otherOtherSignificantInfo}',
                                    disabled: '{!otherOtherSignificantInfoCheckboxRef.checked}'
                                },
                                fieldLabel: 'Other',
                                vtype:'extendedalphanum',
                                validator: function(val) {
                                    return (!this.disabled && !val) ? "Other Significant Info is required" : true;
                                }, listeners: {
                                    disable: function() {
                                        this.reset();
                                    }
                                },
                                cls: 'roc-required'
                            },
                        ]
                   },
                   {
                        xtype: 'fieldset',
                        title: 'Resource Commitment',
                        defaultType: 'textfield',
                        defaults: {
                             anchor: '100%',
                            vtype:'simplealphanum'
                        },
                        items: [
                            {
                                bind:'{calfireIncident}',
                                xtype: 'combobox',
                                fieldLabel: 'Is this CAL FIRE Incident?',
                                queryMode: 'local',
                                forceSelection: true,
                                autoSelect: false,
                                editable: false,
                                store: ['Yes', 'No']
                            },
                            {bind: '{resourcesAssigned}',
                                xtype: 'checkboxgroup',
                                fieldLabel: 'Resources Assigned',
                                vertical: true,
                                columns: 1,
                                reference: 'resourcesAssignedRef',
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
                                    { boxLabel: 'All CAL FIRE air and ground resources released', name: 'resourcesAssigned', inputValue: 'All CAL FIRE air and ground resources released', bind: {hidden: '{!finalReport}' }},

                                    { boxLabel: 'Other', name: 'resourcesAssigned', reference: 'otherResourcesAssignedCheckboxRef', inputValue: 'Other', cls: 'roc-no-style'},

                                ]
                            },
                            {
                                bind: {
                                    value: '{otherResourcesAssigned}',
                                    disabled: '{!otherResourcesAssignedCheckboxRef.checked}'
                                },
                                fieldLabel: 'Other',
                                vtype:'extendedalphanum',
                                validator: function(val) {
                                    return (!this.disabled && !val) ? "Other Resources Assigned is required" : true;
                                }, listeners: {
                                    disable: function() {
                                        this.reset();
                                    }
                                },
                                cls: 'roc-required'
                            },
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
