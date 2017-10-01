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
define(['ext', 'iweb/CoreModule', 'ol', './MultiIncidentViewModel', 'nics/modules/UserProfileModule', 'iweb/modules/MapModule'],
		function(Ext, Core, ol, MultiIncidentModel, UserProfile, MapModule){
	
	return Ext.define('modules.multiincidentview.MultiIncidentViewController', {
		extend : 'Ext.app.ViewController',

		alias: 'controller.multiincidentviewcontroller',

		incidentColor : 'rgb(0,0,0)',
		
		viewEnabled: false,



		init: function(){
			this.mediator = Core.Mediator.getInstance();

			this.treestore = this.lookupReference('multiincidentsgrid').getStore();
            this.treestore.addListener('filterchange', function(store,filters) {
                if (filters instanceof Ext.util.FilterCollection) {
                    this.updateFilterCountLabel();
                    this.lookup('clearFiltersButton').setDisabled(filters.length == 0);
                }
            },this)
            this.treestore.setAutoLoad(true);
            this.searchField = this.lookupReference('searchFilter');
            this.orgsStore = this.lookupReference('orgsCombo').getStore();
            this.incidentTypeStore = this.lookupReference('incidentTypeCombo').getStore();
            this.searchStatus = this.lookupReference('searchStatus');
            this.lastFilterValue = "";
            this.incidentCount = 0;
			var source = new ol.source.Vector();
			this.vectorLayer = new ol.layer.Vector({
				source : source,
				style : Core.Ext.Map.getStyle
			});
			
			this.vectorLayer.setVisible(false);
			
			Core.Ext.Map.addLayer(this.vectorLayer);
			
			Core.EventManager.addListener(UserProfile.PROFILE_LOADED, this.loadAllIncidents.bind(this));
			Core.EventManager.addListener("nics.miv.onloadallincidents", this.onLoadAllIncidents.bind(this));
			Core.EventManager.addListener("nics.incident.update.callback", this.onUpdateIncident.bind(this));
			Core.EventManager.addListener("nics.miv.update.mivpanel", this.loadAllIncidents.bind(this));
			Core.EventManager.addListener("nics.incident.create.callback", this.loadAllIncidents.bind(this));
			Core.EventManager.addListener('nics.incident.find', this.onShowFindIncidents.bind(this));
			
			
		},
        onShowFindIncidents: function(){
            var sidepanel = Ext.getCmp('cSidePanel');
            sidepanel.setActiveTab(this.view);
            sidepanel.expand();
        },
		loadAllIncidents: function(e) {
			var grid = this.lookupReference('multiincidentsgrid');
			
			if(UserProfile.getSystemRoleId() != 4 && !UserProfile.isSuperUser()){
				this.lookupReference('miveditbutton').hide()
			}
			
			if(grid.getSelectionModel().getSelection()){
				grid.getSelectionModel().clearSelections();
				this.resetFormPanel();
			}
			
			var topic = Ext.String.format("iweb.NICS.ws.{0}.newIncident", UserProfile.getWorkspaceId());
			Core.EventManager.addListener(topic, this.getAllIncidents.bind(this));
			
			var removeTopic = Ext.String.format("iweb.NICS.ws.{0}.removeIncident", UserProfile.getWorkspaceId());
			Core.EventManager.addListener(removeTopic, this.getAllIncidents.bind(this));
			
			topic = Ext.String.format("iweb.NICS.ws.{0}.updateIncident", UserProfile.getWorkspaceId());
			this.mediator.subscribe(topic);
			Core.EventManager.addListener(topic, this.getAllIncidents.bind(this));
			
			this.getAllIncidents();
			
		},
		
		getAllIncidents: function(){
		
			var url = Ext.String.format("{0}/incidents/{1}/getincidenttree",
					Core.Config.getProperty(UserProfile.REST_ENDPOINT),
					UserProfile.getWorkspaceId());
				
			this.mediator.sendRequestMessage(url, "nics.miv.onloadallincidents");
		
		},


		onUpdateIncident: function(e, response, incident){
			if(response.message != "OK"){
					Ext.MessageBox.alert("Status", response.message);
				}else{
					Ext.MessageBox.alert("Status", "Incident successfully updated.");
					var selected = this.lookupReference('multiincidentsgrid').getSelectionModel().getSelection()[0];
					Core.EventManager.fireEvent("nics.miv.update.mivpanel");
				}
		},
		
		onLoadAllIncidents: function(e,response) {
		    var self = this;
			if(response != null){
				
				this.getIncidentOrgs(function (err, incidentorgsdata) {
                    if (err) {
                        console.log(err);
                        self.searchStatus.setHtml('<p class=error>Error:' + err.message + '</p>');
                    }
                    else {
                        self.processIncidentData(response, incidentorgsdata);
                    }
                })
			}
			else {
			    var err = new Error('Bad incident data response');
			    console.log(err);
			    self.searchStatus.setHtml('<p class=error>Error:' + err.message + '</p>');
            }

		},
        processIncidentData: function(incidentData, incidentorgsdata) {

            if(incidentData != null && incidentData.incidents != null && incidentorgsdata != null && incidentorgsdata.data){
                //Create a lookup map
                var IncidentOrgsLookup = {};
                incidentorgsdata.data.forEach(function(incidentOrg) {
                    IncidentOrgsLookup[incidentOrg.incidentid] = incidentOrg;
                })
                this.IncidentOrgsLookup = IncidentOrgsLookup;
                var storeData = {

                };

                //fix the incident data
                for(var i=0;i<incidentData.incidents.length;i++) {
                    var incident = incidentData.incidents[i];
                    this.adjustIncident.call(this, incident);
                }
                storeData.children = incidentData.incidents;
                this.treestore.setRoot(storeData);
                this.incidentCount = this.treestore.getTotalCount();

                var uniqueorgsdata = incidentData.incidents.map(function(obj) {
                    return obj.orgname;
                })
                    .filter(function(value, index, arr) {
                        return arr.indexOf(value) === index;
                    })
                    .map(function(orgname) {
                        return { name: orgname}
                    })

                this.orgsStore.setData(uniqueorgsdata);
                var uniqueincidenttypes = incidentData.incidents.map(function(inc) {
                    return inc.incidentIncidenttypes.map(function(incinctype) {
                        return incinctype.incidentType.incidentTypeName;
                    })
                })
                    .reduce(function(a,b) {
                        return a.concat(b); //flatten
                    })
                    .filter(function(value, index, arr) {
                        return arr.indexOf(value) === index;
                    })
                    .map(function(incidentTypeName) {
                        return { name: incidentTypeName }
                    })
                this.incidentTypeStore.setData(uniqueincidenttypes);


                this.updateFilterCountLabel();

                this.addMIVLayer(incidentData.incidents);
            }
        },
        updateFilterCountLabel: function() {
            var text = 'Showing ' + this.treestore.getCount() + ' of ' + this.incidentCount + ' incidents.';
            this.searchStatus.setHtml(text);

        },
        adjustIncident: function(incident){

            incident.orgname = this.IncidentOrgsLookup[incident.incidentid].name;
            incident.orgid = this.IncidentOrgsLookup[incident.incidentid].orgid;
            if(!incident.lastUpdate){
                incident.lastUpdate = incident.created;
            }

            incident.lastUpdate = new Date(incident.lastUpdate);

            incident.incidenttypes = incident.incidentIncidenttypes.map(function(incidentIncentType) {
                return incidentIncentType.incidentType.incidentTypeName;
            }).filter(function(typename) {
                return typename != null;
            }).join(", ");

            if(!incident.leaf){
                incident.children.forEach(function(incident){
                    var childIncident = this.adjustIncident(incident);
                    incident.lastUpdate = childIncident.lastUpdate;
                    incident.incidenttypesstring = childIncident.incidenttypesstring;
                }, this);
            }
            return incident;

        },
        filterStore: function(value, column) {
            var me = this,
                store = me.treestore,
                searchString = value.toLowerCase(),
                filterFn = function(node) {
                    var children = node.childNodes,
                        len = children && children.length,
                        visible = v.test(node.get(column)),
                        i;

                    // If the current node does NOT match the search condition
                    // specified by the user...
                    if (!visible) {

                        // Check to see if any of the child nodes of this node
                        // match the search condition.  If they do then we will
                        // mark the current node as visible as well.
                        for (i = 0; i < len; i++) {
                            if (children[i].isLeaf()) {
                                visible = children[i].get('visible');
                            } else {
                                visible = filterFn(children[i]);
                            }
                            if (visible) {
                                break;
                            }
                        }

                    } else { // Current node matches the search condition...

                        // Force all of its child nodes to be visible as well so
                        // that the user is able to select an example to display.
                        for (i = 0; i < len; i++) {
                            children[i].set('visible', true);
                        }

                    }

                    return visible;
                },
                v;

            if (searchString.length < 1) {
                store.getFilters().removeByKey(column);

            } else {
                v = new RegExp(this.escapeRegExp(searchString), 'i');
                store.getFilters().replace({
                    id: column,
                    filterFn: filterFn
                });
            }
        },
        escapeRegExp: function(string) {
            return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
        },
        onRenderIncidentNameCol: function(value) {
            var searchString = this.searchField.getValue();

            if (searchString.length > 0) {
                return this.strMarkRedPlus(searchString, value);
            }

            return value;
        },
        strMarkRedPlus: function(search, subject) {
            return subject.replace(
                new RegExp('(' + search + ')', "gi"), "<span style='color: red;'><b>$1</b></span>");
        },
        onSearchKeyUp: function(field, event, eOpts) {
            var value = field.getValue();
            const column = field.datacolumn;
            // Only filter if they actually changed the field value.
            // Otherwise the view refreshes and scrolls to top.
            if (value == '') {
                field.getTrigger('clear').hide();
                this.filterStore(value,column);
                this.lastFilterValue = value;
            } else if (value && value !== this.lastFilterValue) {
                field.getTrigger('clear')[(value.length > 0) ? 'show' : 'hide']();
                this.filterStore(value,column);
                this.lastFilterValue = value;
            }
        },
        clearAllFilters: function() {
            var filterComponents = ['searchFilter','orgsCombo','incidentTypeCombo'];
            filterComponents.forEach(function(componentname) {
                this.onClearTriggerClick(this.lookup(componentname));
            },this)
        },
        onClearTriggerClick: function(obj) {
            obj.setValue();
            this.filterStore('', obj.datacolumn);
            obj.getTrigger('clear').hide();
        },
        onFilterSelect: function(field, rec) {
            var name = rec.get('name');
            field.getTrigger('clear').show();
            this.filterStore(name, field.datacolumn);
        },
        getIncidentOrgs: function(callback){
			var topic = Core.Util.generateUUID();

			Core.EventManager.createCallbackHandler(topic, this,
					function(evt, response){
						if (response) {
							callback(null,response);
						}
						else {
						    callback(new Error("Bad response from server getting incident orgs"));
                        }
					}
			);
			
			var url = Ext.String.format('{0}/incidents/{1}/incidentorgs',
					Core.Config.getProperty(UserProfile.REST_ENDPOINT),
					UserProfile.getWorkspaceId());
			
			this.mediator.sendRequestMessage(url, topic);
		},

		addMIVLayer: function(incidents){
			
			for(var i = 0; i < incidents.length; i++){
				
				var feature = new ol.Feature({
					geometry : new ol.geom.Point(ol.proj.transform([ incidents[i].lon, incidents[i].lat ],
							'EPSG:4326', 'EPSG:3857'))	
				});
				
				feature.set('type', 'incident');
				feature.set('fillColor', this.incidentColor);
				feature.set('strokeColor',this.incidentColor);
				feature.set('incidentname',incidents[i].incidentname);
				feature.set('description',incidents[i].description);
					
				this.vectorLayer.getSource().addFeature(feature);
				
				if(incidents[i].children != null){
					this.addMIVLayer(incidents[i].children);
				}
			}
			
		},
		
		resetFormPanel: function(){
		
			var form = this.lookupReference('multiincidentform');
			
			form.collapse();
			form.getForm().findField('incidentname').setValue('');
			form.getForm().findField('created').setValue('');
			form.getForm().findField('description').setValue('');
			form.getForm().findField('timesincecreated').setValue('');
			
		},
		
		editIncident: function(e){
		
			var selected = this.lookupReference('multiincidentsgrid').getSelectionModel().getSelection()[0];
			if(selected == null){
				Ext.MessageBox.alert("Multi-Incident-View Error","Select an incident to update.");
			}
			else{
				Core.EventManager.fireEvent('nics.incident.window.update',selected);
			}
		
		},
		
		enableIncidentView: function(e){
		
			if(this.viewEnabled){
				this.vectorLayer.setVisible(false);
				this.viewEnabled = false;
				this.lookupReference('mivviewbutton').setText('Enable All Views');
			}
			else{
				this.vectorLayer.setVisible(true);
				this.viewEnabled = true;
				this.lookupReference('mivviewbutton').setText('Disable All Views');
			}
			
		},

        onIncidentTreeItemDblClick: function(dv, incident, item, index, e){
    		var latAndLonValues = [incident.data.lon,incident.data.lat];
    		var center = ol.proj.transform(latAndLonValues,'EPSG:4326','EPSG:3857');
    		MapModule.getMap().getView().setCenter(center);
    		
    		if(!this.viewEnabled){
    			this.lookupReference('mivviewbutton').el.dom.click();
    		}
		},

        onIncidentTreeSelectionChange: function(grid, selected, eOpts) {
            var form = this.lookupReference('multiincidentform');
            if (selected.length > 0) {
                var incident = selected[0].data;
                var date = new Date(incident.created);

                var dateFormat = date.getFullYear() + '-' + (date.getMonth()+1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
                var diff = date.getTime() - Date.now();
                var hours = Math.abs(Math.round((((diff/1000)/60)/60)));
                var days = Math.abs(Math.round(hours / 24));

                form.getForm().findField('incidentname').setValue(incident.incidentname);
                form.getForm().findField('created').setValue(dateFormat);

                if(incident.description == ""){
                    form.getForm().findField('description').setValue("No description available");
                }
                else{
                    form.getForm().findField('description').setValue(incident.description);
                }

                if(days == 0){
                    form.getForm().findField('timesincecreated').setValue(hours + " hours");
                }
                else{

                    form.getForm().findField('timesincecreated').setValue(days + " days, " + hours + " hours");
                }
                if(UserProfile.getSystemRoleId() == 4){
                    this.lookup('miveditbutton').setDisabled(UserProfile.getOrgId() != incident.orgid);
                }
                form.expand();

            }
            else {
                this.resetFormPanel();
                form.collapse();
            }



        }
		
	});
});
