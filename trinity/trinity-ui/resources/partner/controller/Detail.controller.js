	sap.ui.define([
		"sap/ui/core/mvc/Controller",
		"sap/m/MessageToast",
		"sap/m/MessageBox",
		"sap/ui/core/EventBus",
		"partner/model/formatter",
		"sap/ui/core/Fragment",
		"sap/ui/model/Filter",
		"sap/ui/model/FilterOperator",
		"./BaseController",
		"sap/m/Dialog",
		"sap/m/DialogType",
		"sap/m/Button",
		"sap/m/ButtonType",
		"sap/m/Text",
		"sap/ui/core/ValueState"
	], function (Controller, MessageToast, MessageBox, EventBus, formatter, Fragment, Filter, FilterOperator, BaseController,
		Dialog, DialogType, Button, ButtonType, Text, ValueState) {
		"use strict";
		const batchGroupId = "myUpdateGroupId";
		var geography;
		var ObjectPageLayout;
		var state;
		var oModel;
		var oView;

		return BaseController.extend("partner.controller.Detail", {
			formatter: formatter,
			onInit: function () {

				const router = this.getOwnerComponent().getRouter();
				const route = router.getRoute("masterDetail");
				oModel = this.getOwnerComponent().getModel();
				oView = this.getView();
				route.attachPatternMatched(this.onPatternMatched, this);
				route.attachBeforeMatched(this.reset, this);
			},

			onPatternMatched: function (event) {
				this.bindSelectedItem(event.getParameter("arguments"));
			},

			onPost: async function (oEvent) {
				var comment = oEvent.getSource().getValue();

				var oContext = oView.byId("idCommentsList").getBinding("items")
					.create({

						"comment": comment
					});

				await this.submitBatch(batchGroupId, "Comment Posted");

			},
			onAddClassification: function () {

				var oContext = oView.byId("classification").getBinding("items")
					.create({
						"sys_platform_id": "",
						"channel_type_main_id": ""
					});
			},

			onDeleteClassification: function () {
				//get the selected items
				var oSelectedItems = this.byId("classification").getSelectedItems();
				var ilength = oSelectedItems.length;
				if (ilength > 0) {
					for (var i in oSelectedItems) {
						oSelectedItems[i].getBindingContext().delete("$auto").then(function () {
							this.showMessage("Classifications for the partner " + this.partnerId + " is deleted from database.", "bottom", "S");
						}.bind(this), function (oError) {
							MessageBox.error(oError.message);
							this.showMessage(oError.message + "Please try again.", "bottom", "E");
						});
					}
				}
			},
			bindSelectedItem: function ({
				PartnerId
			}) {
				console.log(PartnerId);
				const decodedPartnerId = window.decodeURIComponent(PartnerId);
				this.partnerId = decodedPartnerId;
				geography = this.byId("Geography");
				ObjectPageLayout = this.byId("ObjectPageLayout");
				state = this.byId("state");

				this.getView().bindElement({
					path: `/PartnerMaster('${decodedPartnerId}')`,
					parameters: {
						$$updateGroupId: batchGroupId
					},
					events: {
						dataRequested: function () {
							ObjectPageLayout.setBusy(true);
						},
						dataReceived: function (oData) {

							if (oData.getParameter("error")) {
								this.showMessage("Data Fetch Error.", "bottom", "E");
							} else {
								geography.bindElement({
									path: "country"
								});

								state.bindAggregation("suggestionItems", {
									path: 'country/state',
									template: new sap.ui.core.Item({
										key: "{id}",
										text: "{description}"
									})
								});
							}

							ObjectPageLayout.setBusy(false);
						},
						change: function (oEvent) {

						}
					}
				});

			},

			onValueHelpCountryRequest: function (oEvent) {
				var sInputValue = oEvent.getSource().getValue(),
					oView = this.getView();

				if (!this._pCountryValueHelpDialog) {
					this._pCountryValueHelpDialog = Fragment.load({
						id: oView.getId(),
						name: "partner.view.ValueHelpCountry",
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

				var context = oEvent.getParameter("selectedItem").getBindingContext();
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
						name: "partner.view.ValueHelpState",
						controller: this
					}).then(function (oDialog) {
						oView.addDependent(oDialog);
						return oDialog;
					});
				}
				this._pStateValueHelpDialog.then(function (oDialog) {
					oDialog.getBinding("items").filter([new Filter("country_id", FilterOperator.Contains, country)]);
					oDialog.open();
				});
			},

			onValueHelpDialogStateClose: function (oEvent) {
				var sDescription,
					oSelectedItem = oEvent.getParameter("selectedItem");
				oEvent.getSource().getBinding("items").filter([]);

				if (!oSelectedItem) {
					return;
				}

				sDescription = oSelectedItem.getDescription();

				this.byId("state").setSelectedKey(sDescription);

			},
			onValueHelpEmpRequest: function (oEvent) {
				var sInputValue = oEvent.getSource().getValue(),
					oView = this.getView();

				if (!this._pEmpValueHelpDialog) {
					this._pEmpValueHelpDialog = Fragment.load({
						id: oView.getId(),
						name: "partner.view.ValueHelpEmp",
						controller: this
					}).then(function (oDialog) {
						oView.addDependent(oDialog);
						return oDialog;
					});
				}
				this._pEmpValueHelpDialog.then(function (oDialog) {
					oDialog.getBinding("items").filter([new Filter("empid", FilterOperator.Contains, sInputValue)]);
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

			handleClose: function (oEvent) {
				this.reset(oEvent);
				this.getOwnerComponent().getRouter().navTo("master");
			},

			toggleFullScreen: function () {
				this.getOwnerComponent().getRouter().navTo("master");
			},

			onSuggestionCountrySelected: function (oEvent) {
				var context = oEvent.getParameter("selectedItem").getBindingContext();
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
				if (this.getOwnerComponent().getModel().hasPendingChanges()) {
					this.byId("ObjectPageLayout").setBusy(true);
					this.refreshMasterList(batchGroupId);
					await this.submitBatch(batchGroupId, "Partner Updated");
					this.resetEditingStatus();
					this.byId("ObjectPageLayout").setBusy(false);

				}
			},

			refreshMasterList: function (groupId) {
				const bus = this.getOwnerComponent().getEventBus();
				bus.publish("master", "refresh", {
					groupId
				});
			},

			submitBatch: async function (id, message) {
				var lmessage = message;
				return await oModel.submitBatch(id).then(
					function () {
						if (!oModel.hasPendingChanges()) {
							this.showMessage("Partner " + this.partnerId + " is Updated.", "bottom", "S");
						}

					}.bind(this),

					function (oError) {
						this.showMessage("Something failed. Please LOGIN again.", "bottom", "E");
					}.bind(this)

				);
			},

			reset: function (event) {
				oModel.resetChanges(batchGroupId);
				this.resetEditingStatus();

			},

			resetEditingStatus: function () {
				const model = this.getOwnerComponent().getModel("detailViewModel");
				model.setProperty("/editing", false, null, true);

			},

			onChangeActivePrtnr: function (oEvent) {
				var bactivestate = this.byId("active").getState();
				var that = this;
				if (!this.oErrorMessageDialog) {
					this.oErrorMessageDialog = new sap.m.Dialog({
						type: DialogType.Message,
						title: "Warning",
						state: ValueState.Warning,
						content: new sap.m.Text({
							text: "Reporting Parnter Active attribute is changed. Do you want to proceed? "
						}),
						beginButton: new sap.m.Button({
							type: ButtonType.Accept,
							text: "Yes",
							press: function () {
								//this.getView().getBindingContext().setProperty("active", bactivestate);
								this.oErrorMessageDialog.close();
								that.onSubmitPress();
							}.bind(this)
						}),
						endButton: new sap.m.Button({
							type: ButtonType.Reject,
							text: "No",
							press: function () {

								if (bactivestate) {

									this.getView().getBindingContext().setProperty("active", false);
								} else {
									this.getView().getBindingContext().setProperty("active", true);
								}
								that.oErrorMessageDialog.close();
							}.bind(this)
						})
					});
				}

				this.oErrorMessageDialog.open();
			}

		});
	});