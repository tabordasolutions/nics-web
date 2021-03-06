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
define([  'iweb/CoreModule', 
			'nics/modules/UserProfileModule','./RocReportView', './RocFormView'
			],

function(Core, UserProfile, RocReportView, RocFormView) {
	
	Ext.define('modules.report-roc.RocReportController', {
		extend : 'Ext.app.ViewController',
		alias : 'controller.rocreportcontroller',

		init : function(args) {
			this.mediator = Core.Mediator.getInstance();
			this.lookupReference('createButton').enable();
			this.lookupReference('updateButton').disable();
			this.lookupReference('finalButton').disable();
			this.lookupReference('printButton').disable();
			this.emailList = UserProfile.getUsername();
			this.incidentNameReadOnly = false;
			this.incidentId = null;
			this.incidentName = null;
			this.incidentNumber = null;
			this.incidentTypes = null;
			this.incidentLatitude = null;
			this.incidentLongitude = null;

			this.eventListenerRemoved = false;

			var topic = "nics.report.reportType";
			Core.EventManager.createCallbackHandler(
					topic, this, function(evt, response){
						Ext.Array.each(response.types, function(type){
							if(type.formTypeName === 'ROC'){
								this.formTypeId = type.formTypeId;
								return;
							}
						}, this);
						
						//Continue loading
						this.bindEvents();
			});
			this.mediator.sendRequestMessage(Core.Config.getProperty(UserProfile.REST_ENDPOINT) +
					"/reports/types", topic);
		},
		
		bindEvents: function(){
			//Bind UI Elements
			Core.EventManager.addListener("nics.incident.join", this.onJoinIncident.bind(this));
			Core.EventManager.addListener("nics.incident.close", this.onCloseIncident.bind(this));
			Core.EventManager.addListener("LoadROCReports", this.onLoadReports.bind(this));
			Core.EventManager.addListener("PrintROCReport", this.onReportReady.bind(this));
			Core.EventManager.fireEvent("nics.report.add", {title: "ROC", component: this.getView()});
			Core.EventManager.addListener("LoadOrgAdminList", this.loadOrgAdminList.bind(this));
			Core.EventManager.addListener("LoadOrgDistList", this.loadOrgDistList.bind(this));
			Core.EventManager.addListener("nics.active.incidents.ready", this.loadActiveIncidents.bind(this));
			Core.EventManager.addListener("nics.active.incidents.update", this.updateActiveIncident.bind(this));
			var topic = Ext.String.format("iweb.NICS.ws.{0}.newIncident", UserProfile.getWorkspaceId());
			this.mediator.subscribe(topic);
			Core.EventManager.addListener(topic, this.addActiveIncident.bind(this));
			var removeTopic = Ext.String.format("iweb.NICS.ws.{0}.removeIncident", UserProfile.getWorkspaceId());
			this.mediator.subscribe(topic);
			Core.EventManager.addListener(removeTopic, this.removeActiveIncident.bind(this));

		},

		onJoinIncident: function(e, incident) {
		    var endpoint = Core.Config.getProperty(UserProfile.REST_ENDPOINT);

            if(this.eventListenerRemoved) {
                Core.EventManager.addListener("LoadROCReports", this.onLoadReports.bind(this));
                Core.EventManager.addListener("LoadOrgAdminList", this.loadOrgAdminList.bind(this));
                Core.EventManager.addListener("LoadOrgDistList", this.loadOrgDistList.bind(this));
                Core.EventManager.addListener("PrintROCReport", this.onReportReady.bind(this));

                this.eventListenerRemoved = false;
            }

		    this.clearReportsInView();
		    this.getView().enable();

			this.incidentName = incident.name;
			this.incidentNumber = incident.incidentNumber;
			this.incidentId = incident.id;
			this.incidentTypes = incident.incidentTypes;
			this.incidentLatitude = incident.latitude;
			this.incidentLongitude = incident.longitude;
			this.emailList = UserProfile.getUsername();

			//Load reports
			this.mediator.sendRequestMessage(
			    endpoint + "/reports/" + this.incidentId + '/ROC',
                "LoadROCReports"
            );

			//Load list of admins, and distribution list for this incident
			var url = Ext.String.format(
			    "{0}/orgs/{1}/adminlist/{2}",
			    endpoint,
			    UserProfile.getWorkspaceId(),
			    UserProfile.getOrgId()
            );

			this.mediator.sendRequestMessage(url, "LoadOrgAdminList");

			var url = Ext.String.format(
			    "{0}/orgs/{1}/org/{2}",
			    endpoint,
			    UserProfile.getWorkspaceId(),
			    UserProfile.getOrgName()
            );

			this.mediator.sendRequestMessage(url, "LoadOrgDistList");

			//Subscribe to New ROC report message on the bus
			this.newTopic = Ext.String.format(
                "iweb.NICS.incident.{0}.report.{1}.new",
                this.incidentId,
                "ROC"
            );
			this.mediator.subscribe(this.newTopic);
			
			this.newHandler = this.onReportAdded.bind(this);
			Core.EventManager.addListener(this.newTopic, this.newHandler);
			this.incidentNameReadOnly = true;
		},

		onCloseIncident: function(e, incidentId) {
			this.mediator.unsubscribe(this.newTopic);

			Core.EventManager.removeListener(this.newTopic, this.newHandler);
			Core.EventManager.removeListener("LoadOrgAdminList", this.loadOrgAdminList);
			Core.EventManager.removeListener("LoadOrgDistList", this.loadOrgDistList);
			Core.EventManager.removeListener("PrintROCReport", this.onReportReady);
			Core.EventManager.removeListener("LoadROCReports", this.onLoadReports);

			this.eventListenerRemoved = true;

			this.clearReportsInView();

			this.lookupReference('createButton').enable();
			this.lookupReference('updateButton').disable();
			this.lookupReference('finalButton').disable();
			this.lookupReference('printButton').disable();

			this.incidentId = null;
			this.incidentName = null;
			this.incidentNumber = null;
			this.incidentTypes = null;
			this.incidentLatitude = null;
			this.incidentLongitude = null;
			this.emailList = UserProfile.getUsername();
			this.incidentNameReadOnly = false;
		},

		clearReportsInView: function() {
			var rocReportContainer = this.view.lookupReference('rocReport');
			rocReportContainer.removeAll();
			var rocList = this.lookupReference('rocList');
			rocList.clearValue();
			rocList.getStore().removeAll()
		},

	    onAddROC: function(e) {
			var rocReportContainer = this.view.lookupReference('rocReport');
			var username  = UserProfile.getFirstName() + " " + UserProfile.getLastName();
			var initialData= {
				formTypeId:this.formTypeId,
				reportType: 'NEW',
				incidentId: this.incidentId,
				incidentName: this.incidentName, //incidentType is not coming back.  Need to figure out how to get it
				incidentNumber: this.incidentNumber,
				incidentTypes: this.incidentTypes,
				latitude : this.incidentLatitude,
				longitude: this.incidentLongitude,
				reportBy:  username,
		 		email:this.emailList,
				simplifiedEmail: true,
				incidentNameReadOnly: this.incidentNameReadOnly,
				activeIncidentsStore: this.activeIncidentsStore,
				date: new Date(),
				editROC: true
			};
			var rocForm = Ext.create('modules.report-roc.RocFormView', initialData);
			rocReportContainer.removeAll();
			rocReportContainer.add(rocForm);
			rocForm.viewModel.set(initialData);
			this.lookupReference('createButton').disable();
			
		},
		
        onUpdateRoc: function(){
        	this.displayCurrentRecord(false, 'UPDATE');
		},
		
		onFinalizeROC: function(){
			this.displayCurrentRecord(false, 'FINAL');
		},
		
		onReportSelect: function(){
			this.displayCurrentRecord(true, 'select');	
		},
		displayCurrentRecord: function(displayOnly, status){
			var combo  = this.lookupReference('rocList');
			var currentFormId=combo.getValue();
			var record = combo.findRecordByValue(currentFormId);

			if(record) {
				var rocReportContainer = this.view.lookupReference('rocReport');
				//Clear away any previous report
				rocReportContainer.removeAll();
				//Add new report
				var rocForm = Ext.create('modules.report-roc.RocFormView',{
					incidentId: this.incidentId,
					incidentName: this.incidentName,
					formTypeId: this.formTypeId,
					editROC: !displayOnly
				});

				//rocReportContainer.show();
		        rocReportContainer.add(rocForm);				//Pull data from the report, and add in the incidentName and Id
				var formData = (JSON.parse(record.data.message));
			    formData.report.incidentId = record.data.incidentId;
			    formData.report.incidentName = record.data.incidentName;
			    formData.report.incidentNumber = this.incidentNumber;
			    formData.report.formTypeId = this.formTypeId;
			    formData.report.incidentNameReadOnly = this.incidentNameReadOnly;
			    formData.report.latitude = this.incidentLatitude;
			    formData.report.longitude = this.incidentLongitude;

                formData.report.otherSignificantInfoCheckBoxGroup = {};
                formData.report.otherSignificantInfoCheckBoxGroup.otherSignificantInfo = [];
                formData.report.otherSignificantInfoCheckBoxGroup.otherSignificantInfo = formData.report.otherSignificantInfo;

                if(this.incidentTypes != null) {
                    var incidentTypeIds = formData.report.incidentTypes.incidenttype;
                    var incidentTypeNamesArray = this.getIncidentTypeNamesFromIncidentTypeIds(incidentTypeIds);
                    formData.report.incidentTypes.incidenttype = incidentTypeNamesArray;
                }

                formData.report.startTime = formData.report.startTime;
			    formData.report.editROC = !displayOnly;
			    //Convert date back to date object so it will display properly on the forms
				formData.report.date = new Date(formData.report.date);

                if(status == 'UPDATE' || status == 'FINAL' ) {
                    formData.report.scope = "";
                    formData.report.spreadRate = "";
                    formData.report.fuelTypes = [];
                    formData.report.otherFuelTypes = "";
                    formData.report.percentContained = "";

                    formData.report.evacuations = "";
                    formData.report.evacuationsInProgress = "";
                    formData.report.otherEvacuations = "";

                    formData.report.structuresThreat = "";
                    formData.report.structuresThreatInProgress = "";
                    formData.report.otherStructuresThreat = "";

                    formData.report.infrastructuresThreat = "";
                    formData.report.infrastructuresThreatInProgress = "";
                    formData.report.otherInfrastructuresThreat = "";

                    formData.report.otherSignificantInfoCheckBoxGroup = "";
                    formData.report.otherOtherSignificantInfo = "";
                }

				if (displayOnly){
					rocForm.controller.setFormReadOnly();
				} else {
					if(status == 'UPDATE' || status == 'FINAL' ) {
                        //this is an updated or finalized form, change report name to the current status
                        formData.report.reportType = status;
                        this.lookupReference('finalButton').disable();
                        this.lookupReference('printButton').disable();
					}
				}

				if(formData.report != null && rocForm != null && rocForm.viewModel != null) {
                    rocForm.viewModel.set(formData.report);
                    rocForm.viewModel.notify();
                    rocForm.controller.requestLocationBasedDataOnEditRequest();
				}
			}
		},

		getIncidentTypeNamesFromIncidentTypeIds: function(incidentTypesIds) {
            var incidentTypesWithIncidentNames = UserProfile.getIncidentTypes();
            var incidentTypesArray = [];
            for(var i=0; i<incidentTypesIds.length; i++) {
                for(var j=0; j<incidentTypesWithIncidentNames.length; j++) {
                    if(incidentTypesIds[i] === incidentTypesWithIncidentNames[j].incidentTypeId) {
                        incidentTypesArray.push(incidentTypesWithIncidentNames[j].incidentTypeName);
                        break;
                    }
                }
            }
            return incidentTypesArray;
        },

		onReportAdded: function() {	
			this.lookupReference('createButton').disable();
			this.lookupReference('updateButton').enable();
			this.lookupReference('finalButton').enable();
			this.lookupReference('printButton').enable();
			this.mediator.sendRequestMessage(Core.Config.getProperty(UserProfile.REST_ENDPOINT) +
					"/reports/" + this.incidentId + '/ROC', "LoadROCReports");
		},

		onLoadReports: function(e, response) {
			var newReports = [];
			var isFinal = false;
			var combo = this.lookupReference('rocList');
			if(response) {
				if(response.reports && 
					response.reports.length > 0){
					//Add each report
					this.lookupReference('createButton').disable();
					this.lookupReference('printButton').enable();
					
					for(var i=0; i<response.reports.length; i++){
						var report = response.reports[i];
					
						var newReport  = this.buildReportData(report);
						newReports.push(newReport);
						if (newReport.status == 'FINAL') {
							isFinal = true;	
						}						
					}
					combo.getStore().removeAll();
					combo.getStore().loadRawData(newReports, true);
					var latestForm = combo.getStore().getAt(0).data.formId;
					combo.setValue(latestForm);
					this.displayCurrentRecord(true, 'select');
					if (isFinal){
						this.lookupReference('updateButton').disable();
						this.lookupReference('finalButton').disable();
					}
					else {
						this.lookupReference('updateButton').enable();
						this.lookupReference('finalButton').enable();
					}
					
				}
				else {
					this.lookupReference('createButton').enable();
					this.lookupReference('updateButton').disable();
					this.lookupReference('finalButton').disable();
					this.lookupReference('printButton').disable();
				}
			}
		},

		buildReportData: function(report){
			var message = JSON.parse(report.message);
			var reportTitle  = message.datecreated;
			var reportType = message.report.reportType;
		
			
			
			return {
				formId: report.formId,
				incidentId: this.incidentId,
				incidentName: this.incidentName,
				incidentNumber: this.incidentNumber,
				name: reportTitle,
				message: report.message,
				status: reportType,
				datecreated: report.datecreated,
				dateupdated: report.dateupdated
			};
		},
		
		loadOrgAdminList:  function(e, response) {
			var adminList = [];
			if (typeof(response) != "undefined" && typeof(response.orgAdminList) != "undefined" && response.orgAdminList.length > 0) {
                var adminList  = response.orgAdminList;
            }
			
			if (typeof(adminList) != "undefined" && adminList.length > 0){
				var adminListString = adminList.toString();
				if (this.emailList != ""){
					this.emailList += ",";
				}
				this.emailList +=  adminListString;
			}
		},

        loadOrgDistList:  function(e, response) {
			var distributionList;
			if ( typeof(response) != "undefined" ) {
				if (response.organizations && response.organizations[0].distribution){
					distributionList  = response.organizations[0].distribution;
				}
			}
			if (typeof(distributionList) != "undefined" && distributionList  != ""){
				if (this.emailList != ""){
					this.emailList += ",";
				}
				this.emailList +=  distributionList;
			}
        },
        onPrintROC: function(){
            //Need to actually get the from from the dropdown
            this.displayCurrentRecord(true, 'select');
            var printMsg = null;
            var rocReportForm = this.view.lookupReference('rocReportForm');
            var data = rocReportForm.viewModel.data;
            Ext.MessageBox.show({
               title:'Print Format',
               form: this,
               msg: 'Would you like to print a simplified format? Choosing NO will print the entire form.',
               buttons: Ext.Msg.YESNOCANCEL,
               fn: function(btn) {
                    if (btn === 'yes') {
                     // printMsg = rocReportForm.controller.buildEmailReport(data, true);
                        rocReportForm.controller.buildReport(data, true, 'print');
                         } else if (btn === 'no') {
                       // 	 printMsg = rocReportForm.controller.buildEmailReport(data, false);
                             rocReportForm.controller.buildReport(data, false, 'print');
                         } else {
                        //do nothing
                    }
                },
               icon: Ext.MessageBox.QUESTION
            });
        },

        onReportReady: function(e, response) {
            if (response){
                 var iFrameId = "printerFrame";
                 var printFrame = Ext.get(iFrameId);
                 if (printFrame == null) {
                 printFrame = Ext.getBody().appendChild({
                            id: iFrameId,
                            tag: 'iframe',
                            cls: 'x-hidden',  style: {
                                display: "none"
                            }
                        });
                    }
                 var printContent = printFrame.dom.contentWindow;
                  // output to the iframe
                 printContent.document.open();
                 printContent.document.write(response);
                 printContent.document.close();
                // print the iframe
                 printContent.print();

                }

        },
        loadActiveIncidents: function(e, incidents) {
            this.activeIncidentsStore = Ext.create('Ext.data.Store', {
                fields: ['incidentName', 'incidentId'],
                data: incidents
            });
        },
        addActiveIncident: function(e, incident) {
            this.activeIncidentsStore.insert(0, incident);
        },
        updateActiveIncident: function(e, incidentId, incidentNameNew) {
            var updatedIncidentRecord = this.activeIncidentsStore.findRecord("incidentId", incidentId);
            updatedIncidentRecord.set("incidentName", incidentNameNew);
        },
        removeActiveIncident: function(e, incidentId) {
            var removeIncidentRecord = this.activeIncidentsStore.findRecord("incidentId", incidentId);
            this.activeIncidentsStore.remove(removeIncidentRecord);
        }
    });
});
