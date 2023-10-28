	sap.ui.define([
		"sap/ui/core/mvc/Controller",
		"sap/m/MessageToast",
		"sap/m/MessageBox",
		"sap/ui/core/EventBus",
		"productmapping/model/formatter",
		"sap/ui/core/Fragment",
		"sap/ui/model/Filter",
		"sap/ui/model/FilterOperator",
		"sap/ui/model/json/JSONModel",
		"sap/ui/model/ValidateException"
	], function (Controller, MessageToast, MessageBox, EventBus, formatter, Fragment, Filter, FilterOperator, JSONModel, ValidateException) {
		"use strict";
		const batchGroupId = "myUpdateGroupId";
		var ObjectPageLayout;
		var SysModelNumber;
		var oModel;
		var oView;
		var context;
		var nCounter = 0;
		var sReportedProID;
		var oContextTable;
		var oContextCreate;
		return Controller.extend("productmapping.controller.Detail", {
			formatter: formatter,
			onInit: function () {

				const router = this.getOwnerComponent().getRouter();
				const route = router.getRoute("masterDetail");
				oModel = this.getOwnerComponent().getModel();
				oView = this.getView();
				route.attachPatternMatched(this.onPatternMatched, this);
				route.attachBeforeMatched(this.reset, this);

				if (!this._productSearch) {
					this._productSearch = Fragment.load({
						id: oView.getId(),
						name: "productmapping.view.fragments.productSearch",
						controller: this
					}).then(function (oDialog) {
						oView.addDependent(oDialog);
						return oDialog;
					});
				}

				var oSelectRBVisibleModel = new JSONModel();
				oSelectRBVisibleModel.setData({
					visible: true
				});

				this.getView().setModel(oSelectRBVisibleModel, "oSelectRBVisibleModel");

			},

			showMessage: function (sMsg, sPos, sType) {
				if (sPos === "center") {
					MessageToast.show(sMsg, {
						duration: 5000,
						my: "center center",
						at: "center center"
					});
				} else if (sPos === "bottom") {
					MessageToast.show(sMsg, {
						duration: 5000
					});
				}
				if (sType === "S") {
					var sColor = "#007833";
				} else {
					sColor = "#cc1919";
				}

				var oMessageToastDOM = $("#content").parent().find(".sapMMessageToast");
				oMessageToastDOM.css("background", sColor);
				oMessageToastDOM.css("width", "17rem");
			},

			onRBSelect: function (oEvent) {
				var oView = this.getView();
				if (oView.byId("rgbSelect").getSelectedButton().getText() === "Search") {
					oView.getModel("oSelectRBVisibleModel").setData({
						visible: true
					});

				} else {
					oView.getModel("oSelectRBVisibleModel").setData({
						visible: false
					});

				}
			},

			onPatternMatched: function (event) {
				this.bindSelectedItem(event.getParameter("arguments"));
			},

			bindSelectedItem: function ({
				ProductMappingId
			}) {
				const decodedproductmappingId = window.decodeURIComponent(ProductMappingId);
				this.getOwnerComponent().getModel("LocalDataModel").setProperty("/ProductMappingId", ProductMappingId);
				this.byId("DetailList").getBinding("items").filter(new Filter({
					path: "header_id",
					operator: FilterOperator.EQ,
					value1: ProductMappingId,
					caseSensitive: false,
					and: true,
				}));

				ObjectPageLayout = this.byId("ObjectPageLayout");
				//SysModelNumber = this.byId("systemmodelno");

				this.getView().bindElement({
					path: `/ProductMappingHeader(${decodedproductmappingId})`,
					parameters: {
						$$updateGroupId: batchGroupId
					},
					events: {
						dataRequested: function () {
							ObjectPageLayout.setBusy(true);

						},
						dataReceived: $.proxy(function (oData) {
							//const sysmodelno = oView.getBindingContext().getProperty("sys_model_no");

							// SysModelNumber.setValue(sysmodelno);

							var mappedEmpId = oData.getSource().getBoundContext().getProperty("assigned_to_empid");
							sReportedProID = oData.getSource().getBoundContext().getProperty("reported_product_id");

							// if (sReportedProductType == "Bundled") {
							// 	this.byId("addItem").setProperty("visible", false);
							// } else {
							// 	this.byId("addItem").setProperty("visible", true);
							// }

							ObjectPageLayout.setBusy(false);
						}, this),
						change: function (oEvent) {
							console.log(oEvent);

						}
					}
				});

			},

			// onAfterRendering: function () {

			// },
			onPressEdit: function (oEvent) {
				var mappedEmpId = this.byId("empid").getValue();
				$.get({
					url: "/trinity/api/UserScopes",
					success: $.proxy(function (data) {
						var sselfId = data.value[0].empid;
						this.getOwnerComponent().getModel("LocalDataModel").setProperty("/sselfId", sselfId);
						if (sselfId == mappedEmpId || !mappedEmpId) {
							this.byId("addItem").setProperty("visible", true);
							this.byId("deleteItem").setProperty("visible", true);
							this.getOwnerComponent().getModel("LocalDataModel").setProperty("/edited", true);

						} else {
							this.byId("addItem").setProperty("visible", false);
							this.byId("deleteItem").setProperty("visible", false);
							this.getOwnerComponent().getModel("LocalDataModel").setProperty("/edited", false);
						}

					}, this),
					error: function (error) {
						console.log(error);
					}
				});

			},
			/* onProductFilter: function (oEvent) {

				var sQuery = this.getView().byId("systemmodelno").getValue();
				sQuery = escape(sQuery);

				var SearchPath = `/ProductSearchOptimized(QUERY=` + `'` + sQuery + `')` + `/Set`;

				this.byId("systemmodelno").bindSuggestionRows({
					path: SearchPath,
					template: new sap.m.ColumnListItem({
						cells: [
							new sap.m.Text({
								text: {
									path: "match_score"
								}
							}),

							new sap.m.Text({
								text: {
									path: "rp"
								}
							}),
							new sap.m.Text({
								text: {
									path: "region"
								}
							}),
							new sap.m.Text({
								text: {
									path: "rp_type"
								}
							}),

							new sap.m.Text({
								text: {
									path: "sys_model_no"
								}
							}),
							new sap.m.Text({
								text: {
									path: "product_code"
								}
							}),
							new sap.m.Text({
								text: {
									path: "sys_platform_id"
								}
							}),
							new sap.m.Text({
								text: {
									path: "reported_product_id"
								}
							}),
							new sap.m.Text({
								text: {
									path: "reported_product_description"
								}
							}),
							new sap.m.Text({
								text: {
									path: "sys_model_id"
								}
							})
						]

					})
				});

			}, */

			onValueHelpCountryRequest: function (oEvent) {
				var sInputValue = oEvent.getSource().getValue(),
					oView = this.getView();

				if (!this._pCountryValueHelpDialog) {
					this._pCountryValueHelpDialog = Fragment.load({
						id: oView.getId(),
						name: "productmapping.view.ValueHelpCountry",
						controller: this
					}).then(function (oDialog) {
						oView.addDependent(oDialog);
						return oDialog;
					});
				}
				this._pCountryValueHelpDialog.then(function (oDialog) {
					// Create a filter for the binding
					oDialog.getBinding("items").filter([new Filter("country_name", FilterOperator.Contains, sInputValue)]);
					// Open ValueHelpDialog filtered by the input's value
					oDialog.open(sInputValue);
				});
			},

			onValueHelpDialogCountryClose: function (oEvent) {
				var sDescription,
					oSelectedItem = oEvent.getParameter("selectedItem");
				oEvent.getSource().getBinding("items").filter([]);

				if (!oSelectedItem) {
					return;
				}

				sDescription = oSelectedItem.getDescription();

				this.byId("country").setSelectedKey(sDescription);

				context = oEvent.getParameter("selectedItem").getBindingContext();
				var Path = context.getPath();
				var StatePath = Path + '/state';

				this.byId("Geography").bindElement({
					path: Path
				});

				this.byId("state").setValue('');
				this.byId("state").bindAggregation("suggestionItems", {
					path: StatePath,
					template: new sap.ui.core.Item({
						key: "{id}",
						text: "{description}"
					})
				});

			},
			onValueHelpStateRequest: function (oEvent) {
				var sInputValue = oEvent.getSource().getValue(),
					oView = this.getView();
				var country = oView.byId("country").getSelectedKey();
				if (!this._pStateValueHelpDialog) {
					this._pStateValueHelpDialog = Fragment.load({
						id: oView.getId(),
						name: "productmapping.view.ValueHelpState",
						controller: this
					}).then(function (oDialog) {
						oView.addDependent(oDialog);
						return oDialog;
					});
				}
				this._pStateValueHelpDialog.then(function (oDialog) {
					// Create a filter for the binding
					oDialog.getBinding("items").filter([new Filter("country_id", FilterOperator.Contains, country)]);
					// Open ValueHelpDialog filtered by the input's value
					oDialog.open();
				});
			},

			onValueHelpDialogStateClose: function (oEvent) {
				var sDescription,
					oSelectedItem = oEvent.getParameter("selectedItem");
				debugger;
				oEvent.getSource().getBinding("items").filter([]);

				if (!oSelectedItem) {
					return;
				}

				sDescription = oSelectedItem.getDescription();

				this.byId("state").setSelectedKey(sDescription);

			},
			onValueHelpEmpRequest: function (oEvent) {
				debugger;
				var sInputValue = oEvent.getSource().getValue(),
					oView = this.getView();

				if (!this._pEmpValueHelpDialog) {
					this._pEmpValueHelpDialog = Fragment.load({
						id: oView.getId(),
						name: "productmapping.view.ValueHelpEmp",
						controller: this
					}).then(function (oDialog) {
						oView.addDependent(oDialog);
						return oDialog;
					});
				}
				this._pEmpValueHelpDialog.then(function (oDialog) {
					// Create a filter for the binding
					oDialog.getBinding("items").filter([new Filter("empid", FilterOperator.Contains, sInputValue)]);
					// Open ValueHelpDialog filtered by the input's value
					oDialog.open(sInputValue);
				});
			},

			onValueHelpDialogEmpSearch: function (oEvent) {
				var sValue = oEvent.getParameter("value");
				var oFilter = new Filter("knownas", FilterOperator.Contains, sValue);

				oEvent.getSource().getBinding("items").filter([oFilter]);
			},

			onValueHelpDialogCountrySearch: function (oEvent) {
				var sValue = oEvent.getParameter("value");
				var oFilter = new Filter("country_name", FilterOperator.Contains, sValue);

				oEvent.getSource().getBinding("items").filter([oFilter]);
			},

			onValueHelpDialogStateSearch: function (oEvent) {
				var sValue = oEvent.getParameter("value");
				var oFilter = new Filter("description", FilterOperator.Contains, sValue);

				oEvent.getSource().getBinding("items").filter([oFilter]);
			},

			onValueHelpDialogEmpClose: function (oEvent) {
				debugger;
				var sDescription;
				var sTitle;
				var oSelectedItem = oEvent.getParameter("selectedItem");

				oEvent.getSource().getBinding("items").filter([]);

				if (!oSelectedItem) {
					return;
				}

				sDescription = oSelectedItem.getDescription();
				sTitle = oSelectedItem.getTitle();

				this.byId("nv_sales_rep_empid").setValue(sDescription);
				this.byId("nv_sales_rep_knownas").setValue(sTitle);

			},
			onEmpSuggest: function (oEvent) {
				var sTerm = oEvent.getParameter("suggestValue");
				var aFilters = [];
				if (sTerm) {
					aFilters.push(new Filter("knownas", FilterOperator.StartsWith, sTerm));
				}

				oEvent.getSource().getBinding("suggestionItems").filter(aFilters);
			},

			handleFullScreen: function () {

			},

			onPressBack: function (oEvent) {
				this.reset(oEvent);
				this.getOwnerComponent().getRouter().navTo("master");
			},
			onSuggestionCountrySelected: function (oEvent) {
				context = oEvent.getParameter("selectedItem").getBindingContext();
				var Path = context.getPath();
				var StatePath = Path + '/state';

				this.byId("Geography").bindElement({
					path: Path
				});

				this.byId("state").setValue('');
				this.byId("state").bindAggregation("suggestionItems", {
					path: StatePath,
					template: new sap.ui.core.Item({
						key: "{id}",
						text: "{description}"
					})
				});

			},

			onSubmitPress: async function () {
				//var nIndex = this.byId("DetailList").getBinding("items").getContexts().findIndex((item) => !item.getProperty("sys_model_id"));
				//if (nIndex < 0) {
				var nLenth = this.byId("DetailList").getBinding("items").getLength();

				if (this.byId("reportedproducttype").getSelectedKey() == "Unbundled" && nLenth > 1) {

					this.showMessage("In System Model Mapping table one line item allowed for Unbundled", "bottom", "E");
				} else if (!this.byId("reportedproducttype").getSelectedKey()) {

					this.showMessage("Please Fill up Mandatory fields", "bottom", "E");
				} else {
					if (this.getOwnerComponent().getModel().hasPendingChanges()) {
						this.byId("ObjectPageLayout").setBusy(true);
						this.refreshMasterList('myUpdateGroupId');
						await this.submitBatch('myUpdateGroupId');
						this.resetEditingStatus();
						this.byId("ObjectPageLayout").setBusy(false);

					}
				}

				//} 
			},

			refreshMasterList: function (groupId) {
				const bus = this.getOwnerComponent().getEventBus();
				bus.publish("master", "refresh", {
					groupId
				});
			},

			submitBatch: async function (id) {

				return await oModel.submitBatch(id).then(
					$.proxy(function () {
						if (!oModel.hasPendingChanges()) {
							window.requestAnimationFrame(() =>
								//MessageToast.show("Product Mapping Updated") 
								this.showMessage(sReportedProID + "Product Mapping Updated", "bottom", "S")
							);
						}

					}, this),
					$.proxy(function (oError) {
						this.showMessage("Product ID already exist", "bottom", "E")
					}, this)

				);
			},

			reset: function (event) {
				oModel.resetChanges(batchGroupId);
				if (event !== undefined) {
					if (event.getSource().sId === "__component0---detailView--decline" ||
						event.getSource().sId === "__component0---detailView--cancelBtn") {
						this.resetEditingStatus("exit");
					} else {
						this.resetEditingStatus();
					}
				} else {
					this.resetEditingStatus();
				}
			},

			resetEditingStatus: function (exit) {
				const model = this.getOwnerComponent().getModel("detailViewModel");
				if (!model.getProperty("/editing") || exit !== undefined) {
					model.setProperty("/editing", false, null, true);
				}

			},
			onAddEmployee: function (oEvent) {
				// context = oEvent.getSource().getBindingContext();
				this._employeeSearchDialog = null;
				if (!this._employeeSearchDialog) {
					this._employeeSearchDialog = Fragment.load({
						name: "productmapping.view.fragments.employeeMapping",
						controller: this
					}).then(function (oFragment) {
						this._employeeSearchDialog = oFragment;
						this.getView().addDependent(this._employeeSearchDialog);
						oFragment.open();
					}.bind(this));
				}
			},
			handleClose: function (oEvent) {
				var oSelectedItem = oEvent.getParameter("selectedItem");

				var sselfId = this.getOwnerComponent().getModel("LocalDataModel").getProperty("/sselfId");
				var empId = this.byId("empid").getValue();
				if (sselfId == oSelectedItem.getTitle()) {
					this.byId("addItem").setProperty("visible", true);
					this.byId("deleteItem").setProperty("visible", true);
					this.getOwnerComponent().getModel("LocalDataModel").setProperty("/edited", true);

				} else {
					this.byId("addItem").setProperty("visible", false);
					this.byId("deleteItem").setProperty("visible", false);
					this.getOwnerComponent().getModel("LocalDataModel").setProperty("/edited", false);
				}
				this.byId("empid").setValue(oSelectedItem.getTitle());
				this.byId("knownas").setValue(oSelectedItem.getDescription());

				if (!empId) {
					this.byId("addItem").setProperty("visible", true);
					this.byId("deleteItem").setProperty("visible", true);
					this.getOwnerComponent().getModel("LocalDataModel").setProperty("/edited", true);

				}

			},
			addNewItem: function (oEvent) {
				//reportedproducttype
				var reportedProductType = this.byId("reportedproducttype").getSelectedKey();

				if (reportedProductType == "Bundled") {

					var oContext = this.byId("DetailList").getBinding("items")
						.create({
							"sys_model_id": "",
							"entity_type": "",
							"quantity": 1,
							"header_id": this.getOwnerComponent().getModel("LocalDataModel").getProperty("/ProductMappingId")

						});
				} else if (reportedProductType == "Unbundled") {
					this.showMessage("In System Model Mapping table one line item allowed for Unbundled", "bottom", "E");
				} else {
					this.showMessage("Please Select Reported Product Type.", "bottom", "E");
				}
			},

			onAddMapping: function (oEvent) {
				context = oEvent.getSource().getBindingContext();
				oContextTable = oEvent.getSource();
				this.oSource = oEvent.getSource();
				var oTable = this.byId("idProducts");
				var sText = this.byId("searchProducts");
				var oView = this.getView();
				this.byId("advanceSearch").setSelected(true);

				this.getOwnerComponent().getModel("LocalDataModel").setProperty("/sys_model_no", this.byId("reportedproduct").getText());
				this.getOwnerComponent().getModel("LocalDataModel").setProperty("/sys_model_description", this.byId("reportedproductdescription")
					.getText());
				this._productSearch.then($.proxy(function (oDialog) {
					var queryfree = this.byId("partnerid").getText() + " " + this.byId("reportedproduct").getText() + " " + this.byId(
						"reportedproductdescription").getText() + " " + this.byId("reportedmanufacturer").getText();
					sText.setValue(queryfree);

					this.byId("idReportedProduct").setValue(this.byId("reportedproduct").getText());
					this.byId("idReportedManufacturer").setValue(this.byId("reportedmanufacturer").getText());
					this.byId("idReportedProductDescription").setValue(this.byId("reportedproductdescription").getText());
					var query = "(REPORTING_PARTNER_ID='" + this.byId("partnerid").getText() +
						"',REPORTED_PRODUCT_ID='" + this.byId("reportedproduct").getText() +
						"',REPORTED_PRODUCT_DESCRIPTION='" + this.byId("reportedproductdescription").getText() +
						"',REPORTED_MANUFACTURER='" + this.byId("reportedmanufacturer").getText() +
						"',SYS_PLATFORM_ID='')";
					query = encodeURIComponent(query);
					var SearchPath = `/ProductSearchAdvance` + query + `/Set`;
					oTable.bindItems({
						path: SearchPath,
						template: new sap.m.ColumnListItem({
							cells: [
								new sap.m.Text({
									text: {
										path: "match_score"
									}
								}),

								new sap.m.Text({
									text: {
										path: "rp"
									}
								}),
								new sap.m.Text({
									text: {
										path: "region"
									}
								}),
								new sap.m.Text({
									text: {
										path: "rp_type"
									}
								}),

								new sap.m.Text({
									text: {
										path: "sys_model_no"
									}
								}),
								new sap.m.Text({
									text: {
										path: "product_code"
									}
								}),
								new sap.m.Text({
									text: {
										path: "sys_platform_id"
									}
								}),
								new sap.m.Text({
									text: {
										path: "reported_product_id"
									}
								}),
								new sap.m.Text({
									text: {
										path: "reported_product_description"
									}
								}),
								new sap.m.Text({
									text: {
										path: "sys_model_id"
									}
								})
							]

						})
					});

					oDialog.open();
				}, this));

			},

			onFuzzyFreeSearchProducts: function () {
				if (this.byId("freeSearch").getSelected() == false) {
					return;
				}
				var oTable = this.byId("idProducts");

				var query = this.byId("searchProducts").getValue();
				query = encodeURIComponent(query);
				var SearchPath = `/ProductSearchOptimized(QUERY=` + `'` + query + `')` + `/Set`;

				oTable.bindItems({
					path: SearchPath,
					template: new sap.m.ColumnListItem({
						cells: [
							new sap.m.Text({
								text: {
									path: "match_score"
								}
							}),

							new sap.m.Text({
								text: {
									path: "rp"
								}
							}),
							new sap.m.Text({
								text: {
									path: "region"
								}
							}),
							new sap.m.Text({
								text: {
									path: "rp_type"
								}
							}),

							new sap.m.Text({
								text: {
									path: "sys_model_no"
								}
							}),
							new sap.m.Text({
								text: {
									path: "product_code"
								}
							}),
							new sap.m.Text({
								text: {
									path: "sys_platform_id"
								}
							}),
							new sap.m.Text({
								text: {
									path: "reported_product_id"
								}
							}),
							new sap.m.Text({
								text: {
									path: "reported_product_description"
								}
							}),
							new sap.m.Text({
								text: {
									path: "sys_model_id"
								}
							})
						]

					})
				});

			},

			onFuzzySearchProducts: function () {

				if (this.byId("advanceSearch").getSelected() == false) {
					return;
				}
				var oTable = this.byId("idProducts");
				var query = "(REPORTING_PARTNER_ID='" + this.byId("partnerid").getText() + "',REPORTED_PRODUCT_ID='" + this.byId(
						"idReportedProduct").getValue() + "',REPORTED_PRODUCT_DESCRIPTION='" + this.byId("idReportedProductDescription").getValue() +
					"',REPORTED_MANUFACTURER='" + this.byId("idReportedManufacturer").getValue() +
					"',SYS_PLATFORM_ID='" + this.byId("idSysPlatform").getSelectedKey() + "')";
				query = encodeURIComponent(query);
				var SearchPath = `/ProductSearchAdvance` + query + `/Set`;

				oTable.bindItems({
					path: SearchPath,
					template: new sap.m.ColumnListItem({
						cells: [
							new sap.m.Text({
								text: {
									path: "match_score"
								}
							}),

							new sap.m.Text({
								text: {
									path: "rp"
								}
							}),
							new sap.m.Text({
								text: {
									path: "region"
								}
							}),
							new sap.m.Text({
								text: {
									path: "rp_type"
								}
							}),

							new sap.m.Text({
								text: {
									path: "sys_model_no"
								}
							}),
							new sap.m.Text({
								text: {
									path: "product_code"
								}
							}),
							new sap.m.Text({
								text: {
									path: "sys_platform_id"
								}
							}),
							new sap.m.Text({
								text: {
									path: "reported_product_id"
								}
							}),
							new sap.m.Text({
								text: {
									path: "reported_product_description"
								}
							}),
							new sap.m.Text({
								text: {
									path: "sys_model_id"
								}
							})
						]

					})
				});

			},

			productSelect: async function (item) {
				this._productSearch.then(function (oDialog) {
					oDialog.close();
				});
				var selectedSystemModelNumber = item.getBindingContext().getProperty("sys_model_no");
				var selectedSystemModelID = item.getBindingContext().getProperty("sys_model_id");

				//context.setProperty("sys_model/sys_model_no", selectedSystemModelNumber);

				await context.setProperty("sys_model_id", selectedSystemModelID);
				this.oSource.setValue(selectedSystemModelNumber);

				// if (this.getOwnerComponent().getModel().hasPendingChanges()) {
				// 	this.byId("ObjectPageLayout").setBusy(true);
				// 	this.refreshMasterList('myUpdateGroupId');
				// 	await this.submitBatch('myUpdateGroupId');
				// 	this.oSource.setValue(selectedSystemModelNumber);
				// 	this.resetEditingStatus();
				// 	this.byId("ObjectPageLayout").setBusy(false);

				// }

			},
			onSelectProduct: function (oEvent) {
				var oView = this.getView();

				this._productSearch.then(function (oDialog) {
					oDialog.close();
				});
				this.byId("gpu").setVisible(false);
				this.byId("cpu").setVisible(false);
				this.byId("sysbrand").setVisible(false);
				this.byId("sys_screen_size_id").setVisible(false);
				this.byId("systemtype").setVisible(false);
				this.byId("gpumanuf").setVisible(false);
				this.byId("gpumsize").setVisible(false);
				this.byId("sys_platform_id").setSelectedKey();
				this.byId("gpu").setSelectedKey();
				this.byId("cpu").setSelectedKey();
				this.byId("sysbrand").setSelectedKey();
				this.byId("sys_screen_size_id").setSelectedKey();
				this.byId("systemtype").setSelectedKey();
				this.byId("gpumanuf").setSelectedKey();
				this.byId("gpumsize").setSelectedKey();
			},
			onDeleteItem: function () {
				//get the selected items
				var oSelectedItems = this.byId("DetailList").getSelectedItems();
				var ilength = oSelectedItems.length;
				if (ilength > 0) {
					for (var i in oSelectedItems) {
						var sModelNo = oSelectedItems[i].getBindingContext().getProperty("sys_model/sys_model_no");
						oSelectedItems[i].getBindingContext().delete("myUpdateGroupId").then(function () {
							this.showMessage(sModelNo + " has been deleted from database.", "bottom", "S");
						}.bind(this), function (oError) {
							MessageBox.error(oError.message);
							this.showMessage(oError.message + "Please try again.", "bottom", "E");
						});
					}
				}
			},

			onFuzzySearchEmployee: function (oEvent) {
				// var oFilter = [];
				var sQuery = oEvent.getParameters().value;
				// var aFilter = new Filter([
				// 	new Filter("empid", FilterOperator.StartsWith, sQuery),
				// 	new Filter("knownas", FilterOperator.StartsWith, sQuery)
				// ], false);
				// oFilter = new Filter([aFilter]);
				// oEvent.getSource().getBinding("items").filter(oFilter);
				oEvent.getSource().getBinding("items").changeParameters({
					"$search": sQuery
				});
			},
			onConfirmProduct: function (oEvent) {

				var obj = {
					"sys_model_no": this.getOwnerComponent().getModel("LocalDataModel").getProperty("/sys_model_no"),
					"sys_model_description": this.getOwnerComponent().getModel("LocalDataModel").getProperty("/sys_model_description"),
					"sys_platform_id": null
				}

				if (obj.sys_model_no && obj.sys_model_description) {
					var oBinding = this.getOwnerComponent().getModel().bindList("/ProductSystems");
					var oContext = oBinding.create(obj);
					oContext.created().then(
						$.proxy(function () {
							this.showMessage(oContext.getProperty("sys_model_no") + " Product has been created", "bottom", "S");
							//oContext.getProperty("sys_model_no");
							//oContext.getProperty("id");

							//context.setProperty("sys_model_id", oContext.getProperty("sys_model_no"));

							//this.getOwnerComponent().getModel("LocalDataModel").setProperty("/ProductMappingId", oContext.getProperty("id"))

							// this.byId("sys_model_no").setValue("");
							// this.byId("sys_model_description").setValue("");

							// oContextTable.setValue(oContext.getProperty("sys_model_no"));
							// oContextTable.getParent().getItems()[1].setText(oContext.getProperty("id"));
							//this.byId("idSysModelId").setText(oContext.getProperty("id"));

						}, this),
						$.proxy(function (error) {
							this.showMessage("Product already exist", "bottom", "S")
						}, this)
					).then($.proxy(function () {

						this.getOwnerComponent().getModel("LocalDataModel").setProperty("/sys_model_no", "");
						this.getOwnerComponent().getModel("LocalDataModel").setProperty("/sys_model_description", "");
						// context.setProperty("sys_model_id", oContext.getProperty("id"));
						//context.setProperty("sys_model/sys_model_no", oContext.getProperty("sys_model_no"));

						this._productSearch.then($.proxy(function (oDialog) {
							oDialog.close();
							this.oSource.setValue(oContext.getProperty("sys_model_no"));
						}), this);

					}, this));

					// .catch((message) => {
					// 		this.showMessage("System Product Number already exist", "bottom","S");
					// });
				} else {
					MessageBox.alert("A validation error has occurred. Complete your input first.");
				}

			},
			onChangePlatform: function (oEvent) {
				this.byId("gpu").setSelectedKey();
				this.byId("cpu").setSelectedKey();
				this.byId("sysbrand").setSelectedKey();
				this.byId("sys_screen_size_id").setSelectedKey();
				this.byId("systemtype").setSelectedKey();
				this.byId("gpumanuf").setSelectedKey();
				this.byId("gpumsize").setSelectedKey();
				if (oEvent.getSource().getSelectedKey() !== "DESKTOP" && oEvent.getSource().getSelectedKey() !== "NOTEBOOK") {
					this.byId("gpu").setVisible(false);
					this.byId("cpu").setVisible(false);
					this.byId("sysbrand").setVisible(false);
					this.byId("sys_screen_size_id").setVisible(false);
					this.byId("systemtype").setVisible(false);
					this.byId("gpumanuf").setVisible(false);
					this.byId("gpumsize").setVisible(false);
					this.byId("sys_platform_id").setSelectedKey();
					this.byId("gpu").setSelectedKey();
					this.byId("cpu").setSelectedKey();
					this.byId("sysbrand").setSelectedKey();
					this.byId("sys_screen_size_id").setSelectedKey();
					this.byId("systemtype").setSelectedKey();
					this.byId("gpumanuf").setSelectedKey();
					this.byId("gpumsize").setSelectedKey();
				} else {
					if (oEvent.getSource().getSelectedKey() === "NOTEBOOK") {
						this.byId("gpu").setVisible(true);
						this.byId("cpu").setVisible(true);
						this.byId("sysbrand").setVisible(true);
						this.byId("sys_screen_size_id").setVisible(true);
						this.byId("systemtype").setVisible(true);
						this.byId("gpumanuf").setVisible(false);
						this.byId("gpumsize").setVisible(false);
					}
					if (oEvent.getSource().getSelectedKey() === "DESKTOP") {
						this.byId("gpu").setVisible(true);
						this.byId("gpumanuf").setVisible(true);
						this.byId("gpumsize").setVisible(true);
						this.byId("systemtype").setVisible(true);
						this.byId("cpu").setVisible(false);
						this.byId("sysbrand").setVisible(false);
						this.byId("sys_screen_size_id").setVisible(false);
					}
				}
			},
			generate: function (oEvent) {
				if (this.byId("sys_platform_id").getSelectedKey() === "NoteBook") {
					var sysModelNumber = this.byId("gpu")._getSelectedItemText() + "_" +
						this.byId("cpu")._getSelectedItemText() + "_" +
						this.byId("systemtype")._getSelectedItemText() + "_" +
						this.byId("sysbrand")._getSelectedItemText() + "_" +
						this.byId("sys_screen_size_id")._getSelectedItemText();

				} else {
					var sysModelNumber = this.byId("gpumanuf")._getSelectedItemText() + "_" +
						this.byId("gpu")._getSelectedItemText() + "_" +
						this.byId("gpumsize")._getSelectedItemText() + "_" +
						this.byId("systemtype")._getSelectedItemText();
				}
				this.getOwnerComponent().getModel("LocalDataModel").setProperty("/sys_model_no", sysModelNumber);
			}

		});

	});