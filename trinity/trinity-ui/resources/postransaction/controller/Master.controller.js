sap.ui.define([
	"nv/Transaction/controller/BaseController",
	"sap/m/MessageToast",
	"sap/m/MessageBox",
	"sap/ui/core/EventBus",
	"sap/ui/core/Fragment"
], function (BaseController, MessageToast, MessageBox, EventBus, Fragment) {
	"use strict";
	var Router;
	var oView;
	return BaseController.extend("nv.Transaction.controller.Master", {

		onInit: function () {
			const bus = this.getOwnerComponent().getEventBus();
			bus.subscribe("master", "refresh", this.shouldRefresh, this);
			Router = this.getOwnerComponent().getRouter();
			oView = this.getView();
			
			var that = this;
			if (!this._oResponsivePopover) {
				this._oResponsivePopover = sap.ui.xmlfragment("nv.Transaction.view.fragments.popOver", this);
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

			this.initPersonalizedEC();
		},
		onSearch: function (oEvent) {

			// var sQuery = oEvent.getSource().getValue();
			var sQuery = this.byId("searchField").getValue();
		
		},
		navToDetailOf: function (item) {
			const selectedPartnerId = item.getBindingContext().getProperty("transaction_id");
			const transaction_id = window.encodeURIComponent(selectedPartnerId);

			Router.navTo("masterDetail", {
				transaction_id
			});
		},
	
		onBeforeRendering: function () {
			var oView = this.getView();
			oView.byId("Transaction").setBindingContext(
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