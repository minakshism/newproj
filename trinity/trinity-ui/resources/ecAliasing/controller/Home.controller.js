sap.ui.define([
	"nv/ecAliasing/controller/BaseController",
	"sap/m/MessageToast",
	"sap/m/MessageBox",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/Fragment",
	"sap/ui/core/library",
	"sap/ui/model/FilterOperator",
	"nv/ecAliasing/utils/formatter",
	'sap/ui/core/format/DateFormat'
], function (BaseController, MessageToast, MessageBox, JSONModel, Fragment, library, FilterOperator, formatter, DateFormat) {
	"use strict";
	const batchGroupId = "myUpdateGroupId";
	var oModel;
	var context;
	var ValueState = library.ValueState;
	var aMassMapping = [];

	return BaseController.extend("nv.ecAliasing.controller.Home", {
		formatter: formatter,
		_oResponsivePopover: null,
		onInit: function () {
			var oView = this.getView();
			oModel = this.getOwnerComponent().getModel();
			var oSelectRBVisibleModel = new JSONModel();
			oSelectRBVisibleModel.setData({
				visible: true
			});

			this.getView().setModel(oSelectRBVisibleModel, "oSelectRBVisibleModel");

			if (!this._partnerSearchDialog) {
				this._partnerSearchDialog = Fragment.load({
					id: oView.getId(),
					name: "nv.ecAliasing.view.fragments.partnerMapping",
					controller: this
				}).then(function (oDialog) {
					oView.addDependent(oDialog);
					return oDialog;
				});
			}
			if (!this._partnerMerge) {
				this._partnerMerge = Fragment.load({
					id: oView.getId(),
					name: "nv.ecAliasing.view.fragments.partnerMerge",
					controller: this
				}).then(function (oPMerge) {
					oView.addDependent(oPMerge);
					return oPMerge;
				}.bind(this));
			}

			var oSearchModel = new sap.ui.model.json.JSONModel();
			oSearchModel.setData({
				from: null,
				to: null,
				chfrom: null,
				chto: null,
				bcheck: false,
				bvisible: false
			});
			oSearchModel.setDefaultBindingMode("TwoWay");
			this.getView().setModel(oSearchModel, "SearchModel");

			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.attachRouteMatched(this._onobjectMatched, this);

			this.getOwnerComponent().getModel("editViewModel").setProperty("/editing", false);

			var that = this;
			if (!this._oResponsivePopover) {
				this._oResponsivePopover = sap.ui.xmlfragment("nv.ecAliasing.view.fragments.popOver", this);
				this._oResponsivePopover.setModel(this.getView().getModel());
			}
			var oTable = this.getView().byId("list");
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

			this.initPersonalizedEC();

		},
		onBeforeRendering: function () {
			var oView = this.getView();
			oView.byId("idHeader").setBindingContext(
				oView.byId("list").getBinding("items").getHeaderContext());
		},
		_onobjectMatched: function () {
			$.get({
				url: "/trinity/api/UserScopes",
				success: $.proxy(function (data) {
					var aFilter = [];
					var sselfId = data.value[0].empid;
					this.getOwnerComponent().getModel("LocalDataModel").setProperty("/empid", sselfId);
					this.getOwnerComponent().getModel("LocalDataModel").setProperty("/is_trinityadmin", data.value[0].is_trinityadmin);
					this.getOwnerComponent().getModel("LocalDataModel").setProperty("/benable", true);
					this.getOwnerComponent().getModel("LocalDataModel").setProperty("/bdisable", false);
					this.getOwnerComponent().getModel("LocalDataModel").setProperty("/inputVal", "");
					this.getOwnerComponent().getModel("LocalDataModel").setProperty("/visibleAddress", false);
					if (data.value[0].is_trinityadmin == false) {
						aFilter.push(new sap.ui.model.Filter("assigned_to_empid", sap.ui.model.FilterOperator.EQ, sselfId));
						aFilter.push(new sap.ui.model.Filter("assigned_to_empid", sap.ui.model.FilterOperator.EQ, null));
						this.getOwnerComponent().getModel("LocalDataModel").setProperty("/bvisible", false);
					} else {
						this.getOwnerComponent().getModel("LocalDataModel").setProperty("/bvisible", true);
					}
					aFilter.push(new sap.ui.model.Filter("end_customer_id", sap.ui.model.FilterOperator.EQ, ''));
					aFilter.push(new sap.ui.model.Filter("end_customer_id", sap.ui.model.FilterOperator.EQ, null));
					this.getOwnerComponent().getModel("LocalDataModel").setProperty("/bMappedEcName", false);
					this.getOwnerComponent().getModel("LocalDataModel").setProperty("/bMappedEcCountry", false);

					this.byId("list").getBinding("items").filter(aFilter);
					this.byId("idecMapped").setSelectedKey("No");
				}, this),
				error: function (error) {
					console.log(error);
				}
			});
		},
		onFuzzySearch: function (oEvent) {

			//var sQuery = this.byId("searchField").getValue();

			if (sQuery && sQuery.length > 0) {
				this.byId("list").getBinding("items").changeParameters({
					"$search": sQuery
				});

			} else {
				this.byId("list").getBinding("items").changeParameters({
					"$search": undefined
				});

			}

		},

		onChangeRpId: function (oEvent) {
			var aFilter = [];
			var squery = oEvent.getSource().getValue();
			if (squery) {
				this.byId("idReporter").getBinding("suggestionItems").changeParameters({
					"$search": squery
				});
			}

		},
		onChangeECId: function (oEvent) {
			var aFilter = [];
			var squery = oEvent.getSource().getValue();
			if (squery) {
				this.byId("idMappedEc").getBinding("suggestionItems").changeParameters({
					"$search": squery
				});
			}

		},
		onChangeAssignTo: function (oEvent) {
			var aFilter = [];
			var squery = oEvent.getSource().getValue();
			if (squery) {
				this.byId("idKnownas").getBinding("suggestionItems").changeParameters({
					"$search": squery
				});
			}
		},
		onSearch: function (event) {
			var aFilter = [],
				sonHold = this.byId("onHold").getSelectedKey(),
				sCountry = this.byId("country").getSelectedKey(),
				sisPerson = this.byId("isPerson").getSelectedKey(),
				sregion = this.byId("region").getSelectedKey(),
				sSubreg = this.byId("subregion").getSelectedKey(),
				apartnerId = this.byId("idReporter").getTokens(),
				aKnownas = this.byId("idKnownas").getTokens(),
				aMappedEcId = this.byId("idMappedEc").getTokens(),
				secmapped = this.byId("idecMapped").getSelectedKey(),
				//szipcode = this.byId("zipcode").getValue(),
				stext = "",
				sisEnterprise = this.byId("isEnterprise").getSelectedKey(),
				sCdate = this.byId("cdate").getValue(),
				sChdate = this.byId("chdate").getValue(),
				dd,
				mm,
				yyyy,
				oDateFormat = sap.ui.core.format.DateFormat.getDateInstance({
					pattern: "yyyy-MM-ddTHH:mm:ss"
				});

			//var sQuery = this.byId("searchField").getValue();

			if (sonHold) {
				aFilter.push(new sap.ui.model.Filter("on_hold", sap.ui.model.FilterOperator.EQ, sonHold));
			}

			if (sCountry) {
				aFilter.push(new sap.ui.model.Filter("reported_country_id", sap.ui.model.FilterOperator.EQ, sCountry));
			}

			if (sisPerson) {
				aFilter.push(new sap.ui.model.Filter("is_person", sap.ui.model.FilterOperator.EQ, sisPerson));
			}

			if (sregion) {
				aFilter.push(new sap.ui.model.Filter("reporting_partner/country/region_id", sap.ui.model.FilterOperator.EQ, sregion));
			}

			if (sSubreg) {
				aFilter.push(new sap.ui.model.Filter("reporting_partner/country/sub_region_id", sap.ui.model.FilterOperator.EQ, sSubreg));
			}

			if (secmapped == "No") {

				aFilter.push(new sap.ui.model.Filter("end_customer_id", sap.ui.model.FilterOperator.EQ, ''));
				aFilter.push(new sap.ui.model.Filter("end_customer_id", sap.ui.model.FilterOperator.EQ, null));
				this.getOwnerComponent().getModel("LocalDataModel").setProperty("/bMappedEcName", false);
				this.getOwnerComponent().getModel("LocalDataModel").setProperty("/bMappedEcCountry", false);
			}

			if (secmapped == "Yes") {

				aFilter.push(new sap.ui.model.Filter({
					filters: [
						new sap.ui.model.Filter({
							path: 'end_customer_id',
							operator: FilterOperator.NE,
							value1: ''
						}),
						new sap.ui.model.Filter({
							path: 'end_customer_id',
							operator: FilterOperator.NE,
							value1: null
						})
					],
					and: true
				}));
				this.getOwnerComponent().getModel("LocalDataModel").setProperty("/bMappedEcName", true);
				this.getOwnerComponent().getModel("LocalDataModel").setProperty("/bMappedEcCountry", true);

			}

			if (sisEnterprise) {
				aFilter.push(new sap.ui.model.Filter("reporting_partner/is_npn", sap.ui.model.FilterOperator.EQ, sisEnterprise));
			}

			$.each(apartnerId, function (i, token) {
				aFilter.push(new sap.ui.model.Filter("reporting_partner_id", sap.ui.model.FilterOperator.EQ, token.getKey()));
			});

			$.each(aMappedEcId, function (i, token) {
				aFilter.push(new sap.ui.model.Filter("end_customer_id", sap.ui.model.FilterOperator.EQ, token.getKey()));
			});

			$.each(aKnownas, function (i, token) {
				aFilter.push(new sap.ui.model.Filter("assigned_to_empid", sap.ui.model.FilterOperator.EQ, token.getKey()));
			});

			if (sChdate) {
				dd = String(this.byId("chdate").getDateValue().getDate()).padStart(2, '0');
				mm = String(this.byId("chdate").getDateValue().getMonth() + 1).padStart(2, '0'); //January is 0!
				yyyy = this.byId("chdate").getDateValue().getFullYear();
				var chdate1 = yyyy + '-' + mm + '-' + dd + "T00:00:00.000Z";

				dd = String(this.byId("chdate").getSecondDateValue().getDate()).padStart(2, '0');
				mm = String(this.byId("chdate").getSecondDateValue().getMonth() + 1).padStart(2, '0'); //January is 0!
				yyyy = this.byId("chdate").getSecondDateValue().getFullYear();
				var chdate2 = yyyy + '-' + mm + '-' + dd + "T23:59:59.000Z";
				aFilter.push(new sap.ui.model.Filter("changed_on", sap.ui.model.FilterOperator.BT, chdate1, chdate2));
			}
			if (sCdate) {
				dd = String(this.byId("cdate").getDateValue().getDate()).padStart(2, '0');
				mm = String(this.byId("cdate").getDateValue().getMonth() + 1).padStart(2, '0'); //January is 0!
				yyyy = this.byId("cdate").getDateValue().getFullYear();
				var cdate1 = yyyy + '-' + mm + '-' + dd + "T00:00:00.000Z";

				dd = String(this.byId("cdate").getSecondDateValue().getDate()).padStart(2, '0');
				mm = String(this.byId("cdate").getSecondDateValue().getMonth() + 1).padStart(2, '0'); //January is 0!
				yyyy = this.byId("cdate").getSecondDateValue().getFullYear();

				var cdate2 = yyyy + '-' + mm + '-' + dd + "T23:59:59.000Z";

				aFilter.push(new sap.ui.model.Filter("created_on", sap.ui.model.FilterOperator.BT, cdate1, cdate2));
			}

			if (!this.getOwnerComponent().getModel("LocalDataModel").getProperty("/is_trinityadmin")) {
				aFilter.push(new sap.ui.model.Filter("assigned_to_empid", sap.ui.model.FilterOperator.EQ, this.getOwnerComponent().getModel(
					"LocalDataModel").getProperty("/empid")));
				aFilter.push(new sap.ui.model.Filter("assigned_to_empid", sap.ui.model.FilterOperator.EQ, null));
			}

			// if (sQuery && sQuery.length > 0) {
			// 	this.byId("list").getBinding("items").changeParameters({
			// 		"$search": sQuery
			// 	});

			// } else {
			// 	this.byId("list").getBinding("items").changeParameters({
			// 		"$search": undefined
			// 	});

			// }

			this.byId("list").getBinding("items").filter(aFilter);

		},

		onConfirmPartnerDialog: function (oEvent) {
			var oView = this.getView();
			oView.byId("name").setValueState(ValueState.None);
			oView.byId("country_id").setValueState(ValueState.None);
			oView.byId("idErr").setProperty("visible", false);
			if (oView.byId("name").getValue() && oView.byId("country_id").getSelectedKey()) {
				this._partnerSearchDialog.then(function (oDialog) {
					oDialog.close();
				});
				var oBinding = this.getOwnerComponent().getModel().bindList("/PartnerMaster");
				var oContext = oBinding
					.create({
						"name": oView.byId("name").getValue(),
						"country_id": oView.byId("country_id").getSelectedKey(),
						"address_first": oView.byId("address_first").getValue(),
						"address_second": oView.byId("address_second").getValue(),
						"city": oView.byId("city").getValue(),
						"postal_code": oView.byId("postal_code").getValue(),
						"state_id": oView.byId("state_id").getSelectedKey() == '' ? null : oView.byId("state_id").getSelectedKey(),
						"active": false,
						"rp_flag": false,
						"ec_flag": true, // this needs to true
						"pos_data_flag": false,
						"authorized_flag": false,
						"quarantine_flag": false,
						"inv_adjust_flag": false,
						"on_hold_flag": false
					});
				oContext.created().then(
					$.proxy(function () {
						var sCreatedPartner = oContext.getProperty("id")
						this._selectedPartnerId = sCreatedPartner;

						var oListItem = this.byId("list").getSelectedItems();
						var ilength = this.byId("list").getSelectedItems().length;
						if (ilength > 0) {
							for (var i in oListItem) {
								//if (!(oListItem[i].getBindingContext().getProperty("end_customer_id"))) {
								oListItem[i].getBindingContext().setProperty("end_customer_id", sCreatedPartner);
								//}
							}
							this.byId("list").removeSelections();
							//this.byId("massmapping").setProperty("enabled", false);
						} else {
							context.setProperty("end_customer_id", sCreatedPartner);
						}
						this.byId("page").setBusy(true);
						this.onSubmitPress('Y', ilength);
						this.showMessage("Partner " + sCreatedPartner + " is Updated.", "bottom", "S");
						this._fnBlankInputVal(oView);
					}, this),
					$.proxy(function (oError) {
						this.showMessage("Partner " + oContext.getProperty("id") + " update is failed.", "bottom", "E");
						this._fnBlankInputVal(oView);
					}, this)

				);

			} else if (!oView.byId("name").getValue()) {
				this._partnerSearchDialog.then(function (oDialog) {
					oDialog.open();
				});
				//	this.showMessage("Please fillup the required field");
				oView.byId("name").setValueState(ValueState.Error);
				oView.byId("idErr").setProperty("visible", true);
			} else {
				this._partnerSearchDialog.then(function (oDialog) {
					oDialog.open();
				});
				oView.byId("country_id").setValueState(ValueState.Error);
				oView.byId("idErr").setProperty("visible", true);
			}

		},

		_fnBlankInputVal: function (oView) {
			oView.byId("name").setValue('');
			oView.byId("country_id").setSelectedKey('');
			oView.byId("address_first").setValue('');
			oView.byId("address_second").setValue('');
			oView.byId("city").setValue('');
			oView.byId("postal_code").setValue('');
			oView.byId("state_id").setSelectedKey(null);
		},

		onChangeVal: function (oEvent) {
			if (oEvent.getSource().getValue()) {
				oEvent.getSource().setValueState(ValueState.None);
			} else {
				oEvent.getSource().setValueState(ValueState.Error);
			}
		},

		onRejectPartnerDialog: function (oEvent) {
			var oView = this.getView();
			this._fnBlankInputVal(oView);
			this._partnerSearchDialog.then(function (oDialog) {
				oDialog.close();
			});
		},

		partnerSelect: function (item) {
			this._partnerSearchDialog.then(function (oDialog) {
				oDialog.close();
			});
			this.byId("page").setBusy(true);
			var selectedPartnerId = item.getBindingContext().getProperty("partner_id");
			var is_person = this.byId("idPerson").getState();
			if (is_person == null) {
				is_person = 'false';
			};

			this._selectedPartnerId = selectedPartnerId;
			//context.setProperty("end_customer_id", selectedPartnerId);

			var oListItem = this.byId("list").getSelectedItems();
			var ilength = this.byId("list").getSelectedItems().length;
			if (ilength > 0) {
				for (var i in oListItem) {
					//oListItem[i].getCells()[12].setValue(selectedPartnerId);
					oListItem[i].getBindingContext().setProperty("end_customer_id", selectedPartnerId);
					oListItem[i].getBindingContext().setProperty("is_person", is_person);

				}
				this.byId("list").removeSelections();
				this.byId("page").setBusy(false);
			} else {
				context.setProperty("end_customer_id", selectedPartnerId);
				context.setProperty("is_person", is_person);
				this.byId("page").setBusy(false);
			}

			this.onSubmitPress('Y', ilength);
		},
		onSubmitPress: async function (refresh, ilength) {
			if (this.getOwnerComponent().getModel().hasPendingChanges()) {
				await this.submitBatch(refresh, ilength);
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
		onUpdateIsPerson: function (oEvent) {
			this._selectedPartnerId = oEvent.getSource().getBindingContext().getProperty("reporting_partner_id");
			var bVal = oEvent.getSource().getState();
			var oListItem = this.byId("list").getSelectedItems();
			var ilength = this.byId("list").getSelectedItems().length;
			var oSelectedItem = oEvent.getParameter("selectedItem");
			this._fnMapMassUserId("is_person", bVal);
			this.byId("list").removeSelections();
			//this.byId("page").setBusy(true);
			if (ilength > 0) {
				this.onSubmitPress('N', ilength);
			} else {
				this.onSubmitPress('N', 0);
			}
		},
		onUpdateOnHold: function (oEvent) {
			this._selectedPartnerId = oEvent.getSource().getBindingContext().getProperty("reporting_partner_id");
			var bVal = oEvent.getSource().getState();
			var oListItem = this.byId("list").getSelectedItems();
			var ilength = this.byId("list").getSelectedItems().length;
			var oSelectedItem = oEvent.getParameter("selectedItem");
			this._fnMapMassUserId("on_hold", bVal);
			this.byId("list").removeSelections();
			//	this.byId("page").setBusy(true);
			if (ilength > 0) {
				this.onSubmitPress('N', ilength);
			} else {
				this.onSubmitPress('N', 0);
			}
		},
		reset: function (event) {
			oModel.resetChanges(batchGroupId);
			this.resetEditingStatus();

		},
		resetEditingStatus: function () {
			const model = this.getOwnerComponent().getModel();
			model.setProperty("/editing", false, null, true);
		},
		onFuzzySearchAccounts: function () {
			var sParnerName = this.byId("idPartnerName").getValue() || "";
			var szipcode = this.byId("idZip").getValue() || "";
			var nAcuracy = Number(this.byId("accuracySlider").getValue()) / 100;
			var is_person = this.byId("idPerson").getState();
			if (is_person == null) {
				is_person = 'false';
			};
			var query = "REPORTING_PARTNER_ID='" + context.getProperty("reporting_partner_id") + "',PARTNER_NAME='" + sParnerName +
				"',ADDRESS_FIRST='',ADDRESS_SECOND=''" +
				",CITY='" + this.byId("idCity").getValue() + "',STATE='" + "',ZIP_CODE='" + szipcode +
				this.byId("idState").getValue() + "',COUNTRY_ID='" + this.byId("idCountry").getValue() + "',IS_PERSON='" + is_person +
				"',ACCURACY=" + nAcuracy;
			var SearchPath = "/PartnerSearchAdvance(" + encodeURIComponent(query) + ")/Set";
			var oTable = this.byId("idAccountsCreate");

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
								path: "partner_id"
							}
						}),
						new sap.m.Text({
							text: {
								path: "name"
							}
						}),
						new sap.m.Text({
							text: {
								path: "mapped_partner_name"
							}
						}),

						/*	new sap.m.Text({
								text: {
									path: "address_first"
								}
							}),
							new sap.m.Text({
								text: {
									path: "address_second"
								}
							}),*/
						new sap.m.Text({
							text: {
								path: "city"
							}
						}),
						new sap.m.Text({
							text: {
								path: "zip_code"
							}
						}),
						new sap.m.Text({
							text: {
								path: "state"
							}
						}),
						new sap.m.Text({
							text: {
								path: "country_id"
							}
						}),
						new sap.m.Switch({
							state: {
								path: "rp_flag"
							}
						})

					]

				})
			});

		},
		onAddMapping: function (oEvent) {
			context = oEvent.getSource().getBindingContext();
			var oTable = this.byId("idAccountsCreate");
			var sText = this.byId("searchAccountsCreate");
			var oView = this.getView();
			oView.byId("name").setValueState(ValueState.None);
			oView.byId("country_id").setValueState(ValueState.None);
			oView.byId("idErr").setProperty("visible", false);
			this._partnerSearchDialog.then($.proxy(function (oDialog) {
				this.byId("idPartnerName").setValue(context.getProperty("reported_name"));
				this.byId("idCity").setValue(context.getProperty("reported_city"));
				this.byId("idZip").setValue(context.getProperty("reported_postal_code"));
				this.byId("idState").setValue(context.getProperty("reported_state"));
				this.byId("idCountry").setValue(context.getProperty("reported_country_id"));
				this.byId("idPerson").setState(context.getProperty("is_person"));
				this.byId("accuracySlider").setValue(90);
				var is_person = encodeURIComponent(context.getProperty("is_person"));
				var reporting_partner_id = encodeURIComponent(context.getProperty("reporting_partner_id"));
				var reported_name = encodeURIComponent(context.getProperty("reported_name"));
				this.getOwnerComponent().getModel("LocalDataModel").setProperty("/reported_name", context.getProperty("reporting_partner/name"));
				this.getOwnerComponent().getModel("LocalDataModel").setProperty("/reported_id", context.getProperty("reporting_partner_id"));
				var reported_address_first = encodeURIComponent(context.getProperty("reported_address_first"));
				var reported_address_second = encodeURIComponent(context.getProperty("reported_address_second"));
				var reported_city = encodeURIComponent(context.getProperty("reported_city"));
				var reported_postal_code = encodeURIComponent(context.getProperty("reported_postal_code"));
				var reported_state = encodeURIComponent(context.getProperty("reported_state"));
				var reported_country_id = encodeURIComponent(context.getProperty("reported_country_id"));

				if (context.getProperty("is_person") == null) {
					is_person = 'false';
				};

				if (context.getProperty("reporting_partner_id") == null) {
					reporting_partner_id = '';
				};

				if (context.getProperty("reported_address_second") == null) {
					reported_address_second = '';
				};
				if (context.getProperty("reported_name") == null) {
					reported_name = '';
				};
				if (context.getProperty("reported_address_first") == null) {
					reported_address_first = '';
				};
				if (context.getProperty("reported_city") == null) {
					reported_city = '';
				};
				if (context.getProperty("reported_postal_code") == null) {
					reported_postal_code = '';
				};
				if (context.getProperty("reported_state") == null) {
					reported_state = '';
				};
				if (context.getProperty("reported_country_id") == null) {
					reported_country_id = '';
				};
				var query = "REPORTING_PARTNER_ID='" + reporting_partner_id + "',PARTNER_NAME='" + reported_name + "',ADDRESS_FIRST='" +
					reported_address_first + "',ADDRESS_SECOND='" +
					reported_address_second + "',CITY='" + reported_city + "',ZIP_CODE='" + reported_postal_code +
					"',STATE='" + reported_state + "',COUNTRY_ID='" + reported_country_id + "',IS_PERSON='" + is_person + "',ACCURACY=0.9";

				var SearchPath = "/PartnerSearchAdvance(" + query + ")/Set";
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
									path: "partner_id"
								}
							}),
							new sap.m.Text({
								text: {
									path: "name"
								}
							}),
							new sap.m.Text({
								text: {
									path: "mapped_partner_name"
								}
							}),

							/*	new sap.m.Text({
									text: {
										path: "address_first"
									}
								}),
								new sap.m.Text({
									text: {
										path: "address_second"
									}
								}),*/
							new sap.m.Text({
								text: {
									path: "city"
								}
							}),
							new sap.m.Text({
								text: {
									path: "zip_code"
								}
							}),
							new sap.m.Text({
								text: {
									path: "state"
								}
							}),
							new sap.m.Text({
								text: {
									path: "country_id"
								}
							}),
							new sap.m.Switch({
								state: {
									path: "rp_flag"
								}
							})

						]

					})
				});

				this.byId("rgbSelect").setSelectedIndex(0);
				this.getView().getModel("oSelectRBVisibleModel").setData({
					visible: true
				});
				oDialog.open();

			}, this));

		},
		onSuggestionCountrySelected: function (oEvent) {
			var context = oEvent.getParameter("selectedItem").getBindingContext();
			var Path = context.getPath();
			var StatePath = Path + '/state';
			// this.byId("state_id").setSelectedKey('');
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
		onSelectPartner: function (oEvent) {
			var oView = this.getView();
			this._fnBlankInputVal(oView);
			this._partnerSearchDialog.then(function (oDialog) {
				oDialog.close();
			});
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

				oView.byId("name").setValue(context.getProperty("reported_name"));
				oView.byId("country_id").setSelectedKey(context.getProperty("reported_country_id"));
				oView.byId("address_first").setValue(context.getProperty("reported_address_first"));
				oView.byId("address_second").setValue(context.getProperty("reported_address_second"));
				oView.byId("city").setValue(context.getProperty("reported_city"));
				oView.byId("postal_code").setValue(context.getProperty("reported_postal_code"));
				var sCountryKey = oView.byId("country_id").getSelectedKey();

				var StatePath = "/Country('" + sCountryKey + "')" + '/state';

				this.byId("state_id").bindAggregation("items", {
					path: StatePath,
					length: 500,
					$orderby: "description",
					template: new sap.ui.core.Item({
						key: "{id}",
						text: "{description}"
					})
				});
			}
			this.getView().getModel("oSelectRBVisibleModel").refresh(true);
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
		onAddEmployee: function (oEvent) {
			var ilength = this.byId("list").getSelectedItems().length;
			if (ilength == 0) {
				context = oEvent.getSource().getBindingContext();
			}
			this._employeeSearchDialog = null;
			if (!this._employeeSearchDialog) {
				this._employeeSearchDialog = Fragment.load({
					name: "nv.ecAliasing.view.fragments.employeeMapping",
					controller: this
				}).then(function (oFragment) {
					this._employeeSearchDialog = oFragment;
					this.getView().addDependent(this._employeeSearchDialog);
					oFragment.open();
				}.bind(this));
			}

		},
		onFuzzySearchEmployee: function (oEvent) {
			var sQuery = oEvent.getParameters().value;
			oEvent.getSource().getBinding("items").changeParameters({
				"$search": sQuery
			});

		},
		handleClose: function (oEvent) {
			var oListItem = this.byId("list").getSelectedItems();
			var ilength = this.byId("list").getSelectedItems().length;
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
		_fnModelRefresh: function (sText) {
			oModel.submitBatch("$auto").then(
				function () {
					var ilength = this.byId("list").getSelectedItems().length;
					this.byId("list").getBinding("items").refresh();
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
					this.getOwnerComponent().getModel("editViewModel").setProperty("/editing", false);

					this.byId("list").removeSelections();

				}.bind(this));
		},
		_fnMapMassUserId: function (key, val) {
			var oListItem = this.byId("list").getSelectedItems();
			var ilength = this.byId("list").getSelectedItems().length;
			if (ilength > 0) {
				for (var i in oListItem) {
					oListItem[i].getBindingContext().setProperty(key, val);
				}
			}
		},
		onSelectUser: function (oEvent) {
			var sSelectedItem = oEvent.getParameters().item.getText();
			var ilength = this.byId("list").getSelectedItems().length;
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
		onSelectionChange: function (oEvent) {
			var nselectedLength = oEvent.getParameters().listItems.length;
			if (nselectedLength) {
				this.getOwnerComponent().getModel("editViewModel").setProperty("/editing", true);
			} else {
				this.getOwnerComponent().getModel("editViewModel").setProperty("/editing", false);
			}
		},
		// Clear Filter
		onPressClear: function () {
			this.byId("onHold").setSelectedKey("");
			this.byId("country").setSelectedKey("");
			this.byId("isPerson").setSelectedKey("");
			this.byId("isEnterprise").setSelectedKey("");
			this.byId("region").setSelectedKey("");
			this.byId("subregion").setSelectedKey("");
			this.byId("idReporter").destroyTokens();
			this.byId("idKnownas").destroyTokens();
			this.byId("idMappedEc").destroyTokens();
			this.byId("idReporter").setSelectedKey("");
			this.byId("idecMapped").setSelectedKey("false");
			this.byId("cdate").setValue("");
			this.byId("chdate").setValue("");
			this.getOwnerComponent().getModel("LocalDataModel").setProperty("/inputVal", "");
			//this.byId("zipcode").setValue("");
			//this.byId("searchField").setValue("");
			var oTable = this.byId("list");
			var aColumns = oTable.getColumns();
			var aFilter = [];
			aFilter.push(new sap.ui.model.Filter("end_customer_id", sap.ui.model.FilterOperator.EQ, ''));
			aFilter.push(new sap.ui.model.Filter("end_customer_id", sap.ui.model.FilterOperator.EQ, null));
			if (!this.getOwnerComponent().getModel("LocalDataModel").getProperty("/is_trinityadmin")) {
				this.getOwnerComponent().getModel("LocalDataModel").setProperty("/bvisible", false);
				aFilter.push(new sap.ui.model.Filter("assigned_to_empid", sap.ui.model.FilterOperator.EQ, this.getOwnerComponent().getModel(
					"LocalDataModel").getProperty("/empid")));
				aFilter.push(new sap.ui.model.Filter("assigned_to_empid", sap.ui.model.FilterOperator.EQ, null));
			} else {
				this.getOwnerComponent().getModel("LocalDataModel").setProperty("/bvisible", true);
			}
			this.byId("list").getBinding("items").filter(aFilter);
			this.byId("list").getBinding("items").changeParameters({
				"$search": undefined
			});

		},
		onChangeEndCustomer: function (oEvent) {
			this._selectedPartnerId = oEvent.getSource().getBindingContext().getProperty("reporting_partner_id");
			this.onSubmitPress('Y', 0);
		},
		onMerge: function (oEvent) {
			this._partnerMerge.then(function (oPMerge) {
				oPMerge.open();
			});
		},
		onExit: function (oEvent) {
			this._partnerMerge.then(function (oPMerge) {
				oPMerge.close();
			});
		},
		onNewMergeReq: function (oEvent) {
			if (this.byId("idNewMerge").getVisible()) {
				this.byId("idNewMerge").setVisible(false);
				this.byId("idmergesave").setVisible(false);
				this.byId("input0").setValueState("None");
				this.byId("input0").setValueStateText("");
				this.byId("input1").setValueState("None");
				this.byId("input1").setValueStateText("");
				this.byId("input2").setValueState("None");
				this.byId("input2").setValueStateText("");
			} else {
				this.byId("idNewMerge").setVisible(true);
				this.byId("idmergesave").setVisible(true);
			}
		},
		onPMergeSave: function (oEvent) {
			if (!this.byId("input0").getValue() || !this.byId("input1").getValue() || !this.byId("input2").getValue()) {
				if (!this.byId("input0").getValue()) {
					this.byId("input0").setValueState("Error");
					this.byId("input0").setValueStateText("Description is required");
				} else {
					this.byId("input0").setValueState("None");
					this.byId("input0").setValueStateText("");
				}
				if (!this.byId("input1").getValue()) {
					this.byId("input1").setValueState("Error");
					this.byId("input1").setValueStateText("Customer Number is required");
				} else {
					this.byId("input1").setValueState("None");
					this.byId("input1").setValueStateText("");
				}
				if (!this.byId("input2").getValue()) {
					this.byId("input2").setValueState("Error");
					this.byId("input2").setValueStateText("Customer Number is required");
				} else {
					this.byId("input2").setValueState("None");
					this.byId("input2").setValueStateText("");
				}
			} else {
				this.showMessage("Partner Merge Request " + "'" + this.byId("input0").getValue() + "'" + " saved successfully", "bottom", "S");
			}
		},
		descInput: function (oEvent) {
			//TEST
			this.byId("input0").setValueState("None");
			this.byId("input0").setValueStateText("");
		},
		newCust: function (oEvent) {
			this.byId("input1").setValueState("None");
			this.byId("input1").setValueStateText("");
		},
		oldCust: function (oEvent) {
			this.byId("input2").setValueState("None");
			this.byId("input2").setValueStateText("");
		},
	});
});