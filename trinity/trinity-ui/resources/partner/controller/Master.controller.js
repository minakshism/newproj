sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageToast",
	"sap/m/MessageBox",
	"sap/ui/core/EventBus",
	"sap/ui/core/Fragment",
	"./BaseController",
	"sap/m/TablePersoController",
	"partner/utils/partnerPersonalized",
	"sap/m/library"
], function (Controller, MessageToast, MessageBox, EventBus, Fragment, BaseController, TablePersoController, partnerPerService, mlibrary) {
	"use strict";
	var Router;
	var oView;
	var ResetAllMode = mlibrary.ResetAllMode;
	return BaseController.extend("partner.controller.Master", {
		_oResponsivePopover: null,
		onInit: function () {
			const bus = this.getOwnerComponent().getEventBus();
			bus.subscribe("master", "refresh", this.shouldRefresh, this);
			Router = this.getOwnerComponent().getRouter();
			oView = this.getView();

			$.ajax({
				url: "/trinity/api/UserScopes",
				type: "GET",
				success: function (data, textStatus, jqXHR) {
					this.getView().byId("idBtnNewPartner").setVisible(data.value[0].is_trinityadmin);
					this.byId("rp").setSelectedKey("true");
				}.bind(this),
				error: function (jqXHR, textStatus, errorThrown) {}.bind(this)
			});

			// Initializing short/filter popup
			var that = this;
			if (!this._oResponsivePopover) {
				this._oResponsivePopover = sap.ui.xmlfragment("partner.view.fragments.popOver", this);
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

			this._PartnerPer = new sap.m.TablePersoController({
				table: this.byId("masterList"),
				//specify the first part of persistence
				componentName: "partnerpers",
				resetAllMode: ResetAllMode.ServiceReset,
				persoService: partnerPerService
			}).activate();
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

		onSearch: function (oEvent) {

			// var sQuery = oEvent.getSource().getValue();
			// var sQuery = this.byId("searchField").getValue(),
			var aFilter = [],
				sRp = this.byId("rp").getSelectedKey(),
				sEc = this.byId("ec").getSelectedKey(),
				sCdate = this.byId("cdate").getValue(),
				sPdate = this.byId("pdate").getValue(),
				sOdate = this.byId("odate").getValue(),
				apartnerId = this.byId("idReporter").getTokens(),
				prodstatus = this.byId("prodstatus").getSelectedKey(),
				subregion = this.byId("subregion").getSelectedKey(),
				region = this.byId("region").getSelectedKey(),
				country = this.byId("country").getSelectedKey(),
				dd,
				mm,
				yyyy,
				sActive = this.byId("active").getSelectedKey();

			if (region) {
				aFilter.push(new sap.ui.model.Filter("country/region/id", sap.ui.model.FilterOperator.EQ, region));
			}

			if (subregion) {
				aFilter.push(new sap.ui.model.Filter("country/sub_region/id", sap.ui.model.FilterOperator.EQ, subregion));
			}

			if (country) {
				aFilter.push(new sap.ui.model.Filter("country/id", sap.ui.model.FilterOperator.EQ, country));
			}

			if (sRp) {
				aFilter.push(new sap.ui.model.Filter("rp_flag", sap.ui.model.FilterOperator.EQ, sRp));
			}

			if (this.byId("npn").getSelectedKey()) {
				aFilter.push(new sap.ui.model.Filter("is_npn", sap.ui.model.FilterOperator.EQ, this.byId("npn").getSelectedKey()));
			}

			if (this.byId("consumer").getSelectedKey()) {
				aFilter.push(new sap.ui.model.Filter("is_consumer", sap.ui.model.FilterOperator.EQ, this.byId("consumer").getSelectedKey()));
			}
			$.each(apartnerId, function (i, token) {
				aFilter.push(new sap.ui.model.Filter("id", sap.ui.model.FilterOperator.EQ, token.getKey()));
			});

			if (sPdate) {
				dd = String(this.byId("pdate").getDateValue().getDate()).padStart(2, '0');
				mm = String(this.byId("pdate").getDateValue().getMonth() + 1).padStart(2, '0'); //January is 0!
				yyyy = this.byId("pdate").getDateValue().getFullYear();
				var pdatel = yyyy + '-' + mm + '-' + dd;

				dd = String(this.byId("pdate").getSecondDateValue().getDate()).padStart(2, '0');
				mm = String(this.byId("pdate").getSecondDateValue().getMonth() + 1).padStart(2, '0'); //January is 0!
				yyyy = this.byId("pdate").getSecondDateValue().getFullYear();
				var pdateh = yyyy + '-' + mm + '-' + dd;

				aFilter.push(new sap.ui.model.Filter("production_date", sap.ui.model.FilterOperator.BT, pdatel, pdateh));
			}

			if (sOdate) {
				dd = String(this.byId("odate").getDateValue().getDate()).padStart(2, '0');
				mm = String(this.byId("odate").getDateValue().getMonth() + 1).padStart(2, '0'); //January is 0!
				yyyy = this.byId("odate").getDateValue().getFullYear();
				var odatel = yyyy + '-' + mm + '-' + dd;

				dd = String(this.byId("odate").getSecondDateValue().getDate()).padStart(2, '0');
				mm = String(this.byId("odate").getSecondDateValue().getMonth() + 1).padStart(2, '0'); //January is 0!
				yyyy = this.byId("odate").getSecondDateValue().getFullYear();
				var odateh = yyyy + '-' + mm + '-' + dd;

				aFilter.push(new sap.ui.model.Filter("rp_onboarding_date", sap.ui.model.FilterOperator.BT, odatel, odateh));
			}

			if (sCdate) {
				dd = String(this.byId("cdate").getDateValue().getDate()).padStart(2, '0');
				mm = String(this.byId("cdate").getDateValue().getMonth() + 1).padStart(2, '0'); //January is 0!
				yyyy = this.byId("cdate").getDateValue().getFullYear();
				var cdatel = yyyy + '-' + mm + '-' + dd;

				dd = String(this.byId("cdate").getSecondDateValue().getDate()).padStart(2, '0');
				mm = String(this.byId("cdate").getSecondDateValue().getMonth() + 1).padStart(2, '0'); //January is 0!
				yyyy = this.byId("cdate").getSecondDateValue().getFullYear();
				var cdateh = yyyy + '-' + mm + '-' + dd;

				aFilter.push(new sap.ui.model.Filter("creation_date", sap.ui.model.FilterOperator.BT, cdatel, cdateh));
			}

			if (sEc) {
				aFilter.push(new sap.ui.model.Filter("ec_flag", sap.ui.model.FilterOperator.EQ, sEc));
			}

			if (sActive) {
				aFilter.push(new sap.ui.model.Filter("active", sap.ui.model.FilterOperator.EQ, sActive));
			}

			if (prodstatus == "Yes") {
				aFilter.push(new sap.ui.model.Filter("production_date", sap.ui.model.FilterOperator.NE, null));
			}

			if (prodstatus == "No") {
				aFilter.push(new sap.ui.model.Filter("production_date", sap.ui.model.FilterOperator.EQ, null));
			}

			// if (sQuery && sQuery.length > 0) {
			// 	this.byId("masterList").getBinding("items").changeParameters({
			// 		"$search": sQuery
			// 	});

			// } else {
			// 	this.byId("masterList").getBinding("items").changeParameters({
			// 		"$search": undefined
			// 	});

			// }

			this.byId("masterList").getBinding("items").filter(aFilter);

		},
		navToDetailOf: function (item) {
			const selectedPartnerId = item.getBindingContext().getProperty("id");
			const PartnerId = window.encodeURIComponent(selectedPartnerId);

			Router.navTo("masterDetail", {
				PartnerId
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
			oView.byId("PartnerTitle").setBindingContext(
				oView.byId("masterList").getBinding("items").getHeaderContext());
		},
		onConfirmPartnerDialog: function (oEvent) {
			if (this.byId("name").getValue() && this.byId("country_id").getSelectedKey()) {
				this._NewpartnerDialog.then(function (oDialog) {
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
					"state_id": oView.byId("state_id").getSelectedKey() == '' ? null : oView.byId("state_id").getSelectedKey(),
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
						window.requestAnimationFrame(() => MessageToast.show("Partner Created"));
						const PartnerId = oContext.getProperty('id');
						Router.navTo("masterDetail", {
							PartnerId
						});

					},
					function (oError) {
						window.requestAnimationFrame(() => MessageToast.show("Partner Creation Failed"));
					}
				);
			} else {
				this.showMessage("Please fill up mandatory fields.", "bottom", "E");
			}
		},
		onRejectPartnerDialog: function (oEvent) {
			oView.byId("name").setValue('');
			oView.byId("country_id").setSelectedKey('');
			oView.byId("address_first").setValue('');
			oView.byId("address_second").setValue('');
			oView.byId("city").setValue('');
			oView.byId("postal_code").setValue('');
			oView.byId("state_id").setSelectedKey('');
			this._NewpartnerDialog.then(function (oDialog) {

				oDialog.close();
			});
		},
		newPartner: function (oEvent) {

			var oView = this.getView();

			if (!this._NewpartnerDialog) {
				this._NewpartnerDialog = Fragment.load({
					id: oView.getId(),
					name: "partner.view.newPartner",
					controller: this
				}).then(function (oDialog) {
					oView.addDependent(oDialog);
					return oDialog;
				});
			}
			this._NewpartnerDialog.then(function (oDialog) {

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
			this.byId("rp").setSelectedKey("true");
			this.byId("npn").setSelectedKey("");
			this.byId("ec").setSelectedKey("");
			this.byId("consumer").setSelectedKey("");
			this.byId("active").setSelectedKey("");
			this.byId("cdate").setValue("");
			this.byId("pdate").setValue("");
			this.byId("searchField").setValue("");
			this.byId("idReporter").destroyTokens();
			this.byId("idReporter").setSelectedKey("");
			var oTable = this.byId("masterList");
			var aColumns = oTable.getColumns();
			var aFilter = [];
			aFilter.push(new sap.ui.model.Filter("rp_flag", sap.ui.model.FilterOperator.EQ, true));

			this.byId("masterList").getBinding("items").filter(aFilter);
			this.byId("masterList").getBinding("items").changeParameters({
				"$search": undefined
			});

		}

	});
});