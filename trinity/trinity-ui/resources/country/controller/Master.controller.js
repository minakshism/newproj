sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageToast",
	"sap/m/MessageBox",
	"sap/ui/core/EventBus",
	"sap/ui/core/Fragment",
	"country/model/formatter"
], function (Controller, MessageToast, MessageBox, EventBus, Fragment, formatter) {
	"use strict";
	var Router;
	var oView;
	return Controller.extend("country.controller.Master", {
		formatter: formatter,
		onInit: function () {
			const bus = this.getOwnerComponent().getEventBus();
			bus.subscribe("master", "refresh", this.shouldRefresh, this);
			Router = this.getOwnerComponent().getRouter();
			oView = this.getView();
		},
		onSearch: function (oEvent) {

			// var sQuery = oEvent.getSource().getValue();
			var sQuery = this.byId("searchField").getValue();
			var rtokens = this.byId("region").getTokens(),
				ttokens = this.byId("territory").getTokens(),
				stokens = this.byId("subregion").getTokens(),
				mtokens = this.byId("marketeconomy").getTokens(),
				aFilter = [];
			$.each(rtokens, function (i, token) {
				aFilter.push(new sap.ui.model.Filter("region_id", sap.ui.model.FilterOperator.EQ, token.getKey()));
			});

			$.each(ttokens, function (i, token) {
				aFilter.push(new sap.ui.model.Filter("territory_id", sap.ui.model.FilterOperator.EQ, token.getKey()));
			});

			$.each(stokens, function (i, token) {
				aFilter.push(new sap.ui.model.Filter("sub_region_id", sap.ui.model.FilterOperator.EQ, token.getKey()));
			});

			$.each(mtokens, function (i, token) {
				aFilter.push(new sap.ui.model.Filter("market_economy_id", sap.ui.model.FilterOperator.EQ, token.getKey()));
			});

			if (sQuery && sQuery.length > 0) {
				this.byId("masterList").getBinding("items").changeParameters({
					"$search": sQuery
				});

			} else {
				this.byId("masterList").getBinding("items").changeParameters({
					"$search": undefined
				});

			}
			this.byId("masterList").getBinding("items").filter(aFilter);

		},
		navToDetailOf: function (item) {
			const selectedCountryId = item.getBindingContext().getProperty("id");
			const CountryId = window.encodeURIComponent(selectedCountryId);

			Router.navTo("masterDetail", {
				CountryId
			});
		},

		onBeforeRendering: function () {
			var oView = this.getView();
			oView.byId("CountryTitle").setBindingContext(
				oView.byId("masterList").getBinding("items").getHeaderContext());
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

	});
});