sap.ui.define([
	"productmapping/controller/BaseController",
	"sap/m/MessageToast",
	"sap/m/MessageBox",
	"sap/ui/core/EventBus",
	"sap/ui/core/Fragment",
	"sap/ui/model/FilterOperator",
], function (BaseController, MessageToast, MessageBox, EventBus, Fragment, FilterOperator) {
	"use strict";
	var Router;
	var oView;
	var oModel;
	return BaseController.extend("productmapping.controller.Master", {
		onInit: function () {
			const bus = this.getOwnerComponent().getEventBus();
			bus.subscribe("master", "refresh", this.shouldRefresh, this);
			Router = this.getOwnerComponent().getRouter();
			oView = this.getView();
			var that = this;
			oModel = this.getOwnerComponent().getModel();

			if (!this._oResponsivePopover) {
				this._oResponsivePopover = sap.ui.xmlfragment("productmapping.view.fragments.popOver", this);
				this._oResponsivePopover.setModel(this.getView().getModel());
			}
			var oTable = this.getView().byId("masterList");
			oTable.addEventDelegate({
				onAfterRendering: function () {
					var oHeader = this.$().find('.sapMListTblHeaderCell'); //Get hold of table header elements
					for (var i = 0; i < oHeader.length; i++) {
						var oID = oHeader[i].id;
						that.onClick(oID);
					}
				}
			}, oTable);

			//tab button press
			oTable.setKeyboardMode(sap.m.ListKeyboardMode.Edit);
			$.get({
				url: "/trinity/api/UserScopes",
				success: $.proxy(function (data) {
					var aFilter = [];
					var sselfId1 = data.value[0].empid;
					this.getOwnerComponent().getModel("LocalDataModel").setProperty("/empid", sselfId1);
				}, this),
				error: function (error) {
					console.log(error);
				}
			});
		},
		onSearch: function (oEvent) {
			//TEST
			// var sQuery = oEvent.getSource().getValue();
			var sQuery = this.byId("searchField").getValue(),
				aFilter = [],
				sRp = this.byId("rp").getSelectedKey(),
				sEc = this.byId("ec").getSelectedKey(),
				region = this.byId("region").getSelectedKey(),
				subregion = this.byId("subregion").getSelectedKey(),
				country = this.byId("country").getSelectedKey(),
				crdate = this.byId("crdate").getValue(),
				cddate = this.byId("cddate").getValue(),
				subregion = this.byId("subregion").getSelectedKey(),
				region = this.byId("region").getSelectedKey(),
				country = this.byId("country").getSelectedKey(),
				secmapped = this.byId("mappedrecords").getSelectedKey(),
				dd,
				mm,
				yyyy;
			// sActive = this.byId("active").getSelectedKey();

			// if (sRp) {
			// 	aFilter.push(new sap.ui.model.Filter("rp_flag", sap.ui.model.FilterOperator.EQ, sRp));
			// }
			if (region) {
				aFilter.push(new sap.ui.model.Filter("partner/country/region/id", sap.ui.model.FilterOperator.EQ, region));
			}

			if (subregion) {
				aFilter.push(new sap.ui.model.Filter("partner/country/sub_region/id", sap.ui.model.FilterOperator.EQ, subregion));
			}

			if (country) {
				aFilter.push(new sap.ui.model.Filter("partner/country/id", sap.ui.model.FilterOperator.EQ, country));
			}
			if (crdate) {
				dd = String(this.byId("crdate").getDateValue().getDate()).padStart(2, '0');
				mm = String(this.byId("crdate").getDateValue().getMonth() + 1).padStart(2, '0'); //January is 0!
				yyyy = this.byId("crdate").getDateValue().getFullYear();
				var crdatel = yyyy + '-' + mm + '-' + dd + 'T00:00:00.000Z';

				dd = String(this.byId("crdate").getSecondDateValue().getDate()).padStart(2, '0');
				mm = String(this.byId("crdate").getSecondDateValue().getMonth() + 1).padStart(2, '0'); //January is 0!
				yyyy = this.byId("crdate").getSecondDateValue().getFullYear();
				var crdateh = yyyy + '-' + mm + '-' + dd + 'T11:59:59.000Z';

				aFilter.push(new sap.ui.model.Filter("created_on", sap.ui.model.FilterOperator.BT, crdatel, crdateh));
			}

			if (cddate) {
				dd = String(this.byId("cddate").getDateValue().getDate()).padStart(2, '0');
				mm = String(this.byId("cddate").getDateValue().getMonth() + 1).padStart(2, '0'); //January is 0!
				yyyy = this.byId("cddate").getDateValue().getFullYear();
				var cddatel = yyyy + '-' + mm + '-' + dd + 'T00:00:00.000Z';

				dd = String(this.byId("cddate").getSecondDateValue().getDate()).padStart(2, '0');
				mm = String(this.byId("cddate").getSecondDateValue().getMonth() + 1).padStart(2, '0'); //January is 0!
				yyyy = this.byId("cddate").getSecondDateValue().getFullYear();
				var cddateh = yyyy + '-' + mm + '-' + dd + 'T11:59:59.000Z';

				aFilter.push(new sap.ui.model.Filter("changed_on", sap.ui.model.FilterOperator.BT, cddatel, cddateh));
			}

			if (sRp) {
				aFilter.push(new sap.ui.model.Filter("reported_product_type", sap.ui.model.FilterOperator.EQ, sRp, sRp.toUpperCase()));
			}

			if (sEc) {
				aFilter.push(new sap.ui.model.Filter("on_hold", sap.ui.model.FilterOperator.EQ, sEc));
			}

			if (sQuery && sQuery.length > 0) {
				this.byId("masterList").getBinding("items").changeParameters({
					"$search": sQuery
				});

			} else {
				this.byId("masterList").getBinding("items").changeParameters({
					"$search": undefined
				});

			}
			if (secmapped == "No") {

				aFilter.push(new sap.ui.model.Filter("mapping_items/sys_model/sys_model_no", sap.ui.model.FilterOperator.EQ, ''));
				aFilter.push(new sap.ui.model.Filter("mapping_items/sys_model/sys_model_no", sap.ui.model.FilterOperator.EQ, null));
				// this.getOwnerComponent().getModel("LocalDataModel").setProperty("/bMappedEcName", false);
				// this.getOwnerComponent().getModel("LocalDataModel").setProperty("/bMappedEcCountry", false);
			}

			if (secmapped == "Yes") {

				aFilter.push(new sap.ui.model.Filter({
					filters: [
						new sap.ui.model.Filter({
							path: 'mapping_items/sys_model/sys_model_no',
							operator: FilterOperator.NE,
							value1: ''
						}),
						new sap.ui.model.Filter({
							path: 'mapping_items/sys_model/sys_model_no',
							operator: FilterOperator.NE,
							value1: null
						})
					],
					and: true
				}));
				// this.getOwnerComponent().getModel("LocalDataModel").setProperty("/bMappedEcName", true);
				// this.getOwnerComponent().getModel("LocalDataModel").setProperty("/bMappedEcCountry", true);

			}

			this.byId("masterList").getBinding("items").filter(aFilter);

		},
		navToDetailOf: function (oEvent) {
			// const selectedproductmappingId = this.byId("masterList").getBinding("items").aContexts[oEvent.getSource().sId.slice(16)].sPath.slice(
			// 	22, 58);
			var selectedproductmappingId = oEvent.getSource().getBindingContextPath().split("(")[1].split(")")[0];
			var ProductMappingId = window.encodeURIComponent(selectedproductmappingId);
			Router.navTo("masterDetail", {
				ProductMappingId
			});
			this.byId("masterList").removeSelections(true);
		},
		onSuggestionCountrySelected: function (oEvent) {
			var context = oEvent.getParameter("selectedItem").getBindingContext();
			var Path = context.getPath();
			var StatePath = Path + '/state';
			this.byId("state_id").setSelectedKey('');
			this.byId("state_id").bindAggregation("items", {
				path: StatePath,
				length: 500,
				$orderby: "description",
				template: new sap.ui.core.Item({
					key: "{id}",
					text: "{description}"
				})
			});

		},
		onBeforeRendering: function () {
			var oView = this.getView();
			oView.byId("productmappingTitle").setBindingContext(
				oView.byId("masterList").getBinding("items").getHeaderContext());
		},
		onConfirmproductmappingDialog: function (oEvent) {
			this._NewproductmappingDialog.then(function (oDialog) {
				oDialog.close();
			});

			var oContext = this.getView().byId("masterList").getBinding("items")

			.create({
				"name": oView.byId("name").getValue(),
				"country_id": oView.byId("country_id").getSelectedKey(),
				"address_first": oView.byId("address_first").getValue(),
				"address_second": oView.byId("address_second").getValue(),
				"city": oView.byId("city").getValue(),
				"postal_code": oView.byId("postal_code").getValue(),
				"state_id": oView.byId("state_id").getSelectedKey(),
				"active": true,
				"rp_flag": true,
				"ec_flag": false,
				"pos_data_flag": false,
				"authorized_flag": false,
				"quarantine_flag": false,
				"inv_adjust_flag": false,
				"on_hold_flag": false

			});
			oContext.created().then(
				function () {
					oView.byId("name").setValue('');
					oView.byId("country_id").setSelectedKey('');
					oView.byId("address_first").setValue('');
					oView.byId("address_second").setValue('');
					oView.byId("city").setValue('');
					oView.byId("postal_code").setValue('');
					oView.byId("state_id").setSelectedKey('');
					window.requestAnimationFrame(() => MessageToast.show("productmapping Created"));
					const productmappingId = oContext.getProperty('id');
					Router.navTo("masterDetail", {
						productmappingId
					});

				},
				function (oError) {
					window.requestAnimationFrame(() => MessageToast.show("productmapping Creation Failed"));
				}
			);
		},
		onRejectproductmappingDialog: function (oEvent) {
			oView.byId("name").setValue('');
			oView.byId("country_id").setSelectedKey('');
			oView.byId("address_first").setValue('');
			oView.byId("address_second").setValue('');
			oView.byId("city").setValue('');
			oView.byId("postal_code").setValue('');
			oView.byId("state_id").setSelectedKey('');
			this._NewproductmappingDialog.then(function (oDialog) {

				oDialog.close();
			});
		},
		newproductmapping: function (oEvent) {

			var oView = this.getView();

			if (!this._NewproductmappingDialog) {
				this._NewproductmappingDialog = Fragment.load({
					id: oView.getId(),
					name: "productmapping.view.newproductmapping",
					controller: this
				}).then(function (oDialog) {
					oView.addDependent(oDialog);
					return oDialog;
				});
			}
			this._NewproductmappingDialog.then(function (oDialog) {

				oDialog.open();
			});

		},

		shouldRefresh: function (channelId, eventId, parametersMap) {
			const listBinding = this.byId("masterList").getBinding("items");
			this.refresh(listBinding, parametersMap["groupId"]);
		},

		refresh: function (binding, groupId) {
			if (binding.hasPendingChanges()) {
				// show message that there are some changes left
			} else {
				return binding.refresh(groupId);
			}
		},
		onPressClear: function () {
			this.byId("rp").setSelectedKey("");
			this.byId("ec").setSelectedKey("");
			this.getOwnerComponent().getModel("LocalDataModel").setProperty("/inputVal", "");
			var oTable = this.byId("masterList");
			var aColumns = oTable.getColumns();
			var aFilter = [];
			this.byId("masterList").getBinding("items").filter(aFilter);
			this.byId("masterList").getBinding("items").changeParameters({
				"$search": undefined
			});
			this.byId("mappedrecords").setSelectedKey("");
			this.byId("country").setSelectedKey("");
			this.byId("region").setSelectedKey("");
			this.byId("subregion").setSelectedKey("");
			this.byId("crdate").setValue("");
			this.byId("cddate").setValue("");

		},
		onSelectUser: function (oEvent) {
			var sSelectedItem = oEvent.getParameters().item.getText();
			var ilength = this.byId("masterList").getSelectedItems().length;
			var sselfId = this.getOwnerComponent().getModel("LocalDataModel").getProperty("/empid");
			if (!ilength) {
				this.showMessage("Please Select Checkbox for Assign to Employee", "bottom", "");
			}
			if (sSelectedItem == 'Self' && ilength > 0) {
				if (sselfId) {
					this._fnMapMassUserId("assigned_to_empid", sselfId);
					this._fnModelRefresh(sselfId);
				} else {
					this.showMessage("Employee ID " + sselfId + " update is failed.", "bottom", "E");
				}
			}
			if (sSelectedItem == 'Unassign' && ilength > 0) {
				this._fnMapMassUserId("assigned_to_empid", null);
				this._fnModelRefresh(null);
			}

			if (sSelectedItem == 'Others' && ilength > 0) {
				this.onAddEmployee();
			}

		},
		onAddEmployee: function (oEvent) {
			var ilength = this.byId("masterList").getSelectedItems().length;
			if (ilength == 0) {
				context = oEvent.getSource().getBindingContext();
			}
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
		_fnMapMassUserId: function (key, val) {
			var oListItem = this.byId("masterList").getSelectedItems();
			var ilength = this.byId("masterList").getSelectedItems().length;
			if (ilength > 0) {
				for (var i in oListItem) {
					oListItem[i].getBindingContext().setProperty(key, val);
				}
			}
		},
		submitBatch: async function (refresh, ilength) {
			try {
				return await oModel.submitBatch("$auto").then(
					function (response) {
						if (refresh == 'Y') {

							this.byId("list").getBinding("items").refresh();

						}
						if (ilength > 1) {
							this.showMessage(ilength + " Partners are Updated.", "bottom", "S");
						} else {
							this.showMessage("Partner " + this._selectedPartnerId + " is Updated.", "bottom", "S");
						}

						this.byId("page").setBusy(false);
						this.byId(this.byId("list").getItems()[0].getCells()[12].sId).focus();
					}.bind(this),
					function (oError) {
						this.showMessage("Partner " + this._selectedPartnerId + " update is failed.", "bottom", "E");
						this.byId("page").setBusy(false);
					}.bind(this)

				);
			} catch (err) {
				alert(err);
			}
		},
		_fnModelRefresh: function (sText) {
			oModel.submitBatch("$auto").then(
				function () {
					var ilength = this.byId("masterList").getSelectedItems().length;
					this.byId("masterList").getBinding("items").refresh();
					if (sText) {
						if (ilength == 0) {
							this.showMessage("Employee ID " + sText + " is assigned successfully.", "bottom", "S");
						} else if (ilength > 0) {
							this.showMessage(ilength + " records assigned successfully to " + sText + ".", "bottom", "S");
						}

					} else {
						if (ilength == 0) {
							this.showMessage(ilength + " record Unassigned successfully.", "bottom", "S");
						} else if (ilength > 0) {
							this.showMessage(ilength + " records Unassigned successfully.", "bottom", "S");
						}
					}
					//this.getOwnerComponent().getModel("editViewModel").setProperty("/editing", false);

					this.byId("masterList").removeSelections();

				}.bind(this));
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
			} else if (sType === "E") {
				var sColor = "#cc1919";
			} else {
				sColor = "#333333";
			}

			var oMessageToastDOM = $("#content").parent().find(".sapMMessageToast");
			oMessageToastDOM.css("background", sColor);
			oMessageToastDOM.css("width", "17rem");
		},
		onItemSelect: function (oEvent) {

		},
		handleClose: function (oEvent) {
			var oListItem = this.byId("masterList").getSelectedItems();
			var ilength = this.byId("masterList").getSelectedItems().length;
			var oSelectedItem = oEvent.getParameter("selectedItem");
			if (oSelectedItem) {
				if (ilength == 0) {
					context.setProperty("assigned_to_empid", oSelectedItem.getTitle());
					//	context.setProperty("assigned_to/knownas", oSelectedItem.getDescription());
				}

				this._fnMapMassUserId("assigned_to_empid", oSelectedItem.getTitle());
				this._fnModelRefresh(oSelectedItem.getTitle());
			}

			oEvent.getSource().getBinding("items").filter([]);
			this._employeeSearchDialog.removeAllDependents();
		},
		onFuzzySearchEmployee: function (oEvent) {
			var sQuery = oEvent.getParameters().value;
			oEvent.getSource().getBinding("items").changeParameters({
				"$search": sQuery
			});
		},

	});
});