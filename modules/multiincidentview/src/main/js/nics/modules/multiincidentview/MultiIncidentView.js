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
 define(['iweb/CoreModule', './MultiIncidentViewController'], 
 	function(Core, MultiIncidentController, MapModule) {
 
		Ext.define('modules.multiincidentview.MultiIncidentView', {
            extend: 'Ext.panel.Panel',
            title: 'Multi Incident View',
            controller: 'multiincidentviewcontroller',
            layout: {
                type: 'vbox'
            },
            items: [
                {
                    xtype: 'container',
                    width: '100%',
                    layout: {
                        type: 'hbox',
                        pack: 'center'
                    },
                    padding: '10 0 0 0',
                    border: false,
                    buttonAlign: 'center',

                    items: [{
                        xtype: 'button',
                        reference: 'mivviewbutton',
                        text: 'Enable All Views',
                        height: 20,
                        handler: 'enableIncidentView'
                    },
                        {
                            xtype: 'box', width: '20px'
                        },
                        {
                            xtype: 'button',
                            reference: 'miveditbutton',
                            text: 'Edit Selected Incident',
                            height: 20,
                            handler: 'editIncident'
                        }]

                },
                {
                    xtype: 'fieldset',
                    title: 'Filter Incidents',
                    width: '100%',
                    layout: 'column',
                    padding: 5,
                    collapsible: true,
                    items: [
                        {
                            xtype: 'container',
                            columnWidth: 0.33,
                            layout: {
                                type: 'vbox'
                            },
                            border: false,
                            padding: 0,
                            items: [
                                {
                                    xtype: 'textfield',
                                    reference: 'searchFilter',
                                    emptyText: 'Search by Incident Name',
                                    width: '100%',
                                    enableKeyEvents: true,
                                    datacolumn: 'incidentname',
                                    triggers: {
                                        clear: {
                                            cls: 'x-form-clear-trigger',
                                            handler: 'onClearTriggerClick',
                                            hidden: true
                                        }
                                    },
                                    listeners: {
                                        keyup: {
                                            fn: 'onSearchKeyUp',
                                            buffer: 300
                                        }
                                    }
                                },
                                {
                                    xtype: 'button',
                                    reference: 'clearFiltersButton',
                                    text: 'Clear Filters',
                                    handler: 'clearAllFilters',
                                    disabled: true
                                }
                            ]
                        },
                        {
                            xtype: 'container',
                            columnWidth: 0.67,
                            layout: {
                                type: 'vbox',
                                align: 'stretch'
                            },
                            border: false,
                            padding: 0,
                            items: [
                                {
                                    xtype: 'combobox',
                                    flex: 1,
                                    datacolumn: 'orgname',
                                    reference: 'orgsCombo',
                                    emptyText: 'By Organization',
                                    padding: '0 5',
                                    store: {
                                        sorters: 'name',
                                        data: [{name: 'loading'}]
                                    },
                                    listeners: {
                                        select: 'onFilterSelect'
                                    },
                                    triggers: {
                                        clear: {
                                            cls: 'x-form-clear-trigger',
                                            handler: 'onClearTriggerClick',
                                            hidden: true
                                        }
                                    },
                                    queryMode: 'local',
                                    displayField: 'name',
                                    valueField: 'name'
                                }
                            ]
                        }
                    ]
                }
                ,
                {
                    xtype: 'container',
                    margin: '0 5 10 5',
                    border: false,
                    layout:  {
                        type  : 'vbox',
                        pack  : 'center',
                        align : 'middle'
                    },
                    width: '100%',
                    items: [
                        {
                            xtype: 'label',
                            reference: 'searchStatus',
                            html: 'Search Status'
                        }
                    ]
                },

                {

                    xtype: 'treepanel',
                    reference: 'multiincidentsgrid',
                    rootVisible: false,
                    cls: 'multi-incident-tree',
                    layout: 'fit',
                    flex: 1,
                    useArrows: true,
                    width: '100%',
                    listeners: {
                        selectionchange: 'onIncidentTreeSelectionChange',
                        itemdblclick: 'onIncidentTreeItemDblClick'
                    },

                    fields: ['incidentname', 'lastupdate', 'incidenttypes', 'description', 'orgname'],
                    columns: [
                    	{
                            text: 'Incident',
                            dataIndex: 'incidentname',
                            xtype: 'treecolumn',
                            width: 150,
                            flex: 1,
                            renderer: 'onRenderIncidentNameCol'
                        }, {
                            text: 'Last Update',
                            xtype: 'datecolumn',
                            dataIndex: 'lastUpdate',
                            format: 'Y-m-d H:i:s',
                            width: 120
                        }, {
                            text: 'Type',
                            dataIndex: 'incidenttypes',
                            width: 100
                        },
                        {
                            text: 'Description',
                            dataIndex: 'description',
                            width: 100
                        },
                        {
                            text: 'Organization',
                            dataIndex: 'orgname',
                            width: 120
                        }
                    ]
                },
                {
                    xtype:'form',
                    title: 'Incident Details',
                    reference: 'multiincidentform',
                    collapsible: true,
                    collapsed: true,
                    collapseDirection: 'bottom',
                    scrollable: true,
                    maxHeight: 300,
                    width: '100%',
                    items:[{

                        xtype: 'fieldset',
                        border: false,
                        items: [
                            {

                                xtype: 'displayfield',
                                fieldLabel: 'Incident Name',
                                name: 'incidentname',
                                value: ''

                            },
                            {

                                xtype: 'displayfield',
                                fieldLabel: 'Created',
                                name: 'created',
                                value: ''

                            },
                            {

                                xtype: 'displayfield',
                                fieldLabel: 'Time since creation',
                                name: 'timesincecreated',
                                value: ''

                            },
                            {

                                xtype: 'displayfield',
                                fieldLabel: 'Description',
                                name: 'description',
                                value: ''

                            }]

                    }]
                }
            ]

		});
});
