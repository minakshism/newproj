	sap.ui.define([
		"sap/ui/core/mvc/Controller",
		"sap/m/MessageToast",
		"sap/m/MessageBox",
		"sap/ui/core/EventBus",
		"country/model/formatter",
		"sap/ui/core/Fragment",
		"sap/ui/model/Filter",
		"sap/ui/model/FilterOperator"
	], function (Controller, MessageToast, MessageBox, EventBus, formatter, Fragment, Filter, FilterOperator) {
		"use strict";

		const batchGroupId = "myUpdateGroupId";
		var geography;
		var ObjectPageLayout;
		var state;
		var oModel;
		var oView;

		return Controller.extend("country.controller.Detail", {
			formatter: formatter,
			onInit: function () {

				const router = this.getOwnerComponent().getRouter();
				const route = router.getRoute("masterDetail");
				oModel = this.getOwnerComponent().getModel();
				oView = this.getView();
				route.attachPatternMatched(this.onPatternMatched, this);
				route.attachBeforeMatched(this.reset, this);
			},

			onAdd: function () {

				var oContext = oView.byId("stateList").getBinding("items")
					.create({
						"id": "",
						"description": ""
					});
			},

			onVatAdd: function () {

				var oContext = oView.byId("vatList").getBinding("items")
					.create({
						"std_vat_rate": 0,
						"reduced_vat_rate": 0
					});
			},

			onDelete: function () {
				var oSelected = this.byId("stateList").getSelectedItem();
				if (oSelected) {
					oSelected.getBindingContext().delete("$auto").then(function () {
						MessageToast.show(this._getText("State Deleted"));
					}.bind(this), function (oError) {
						MessageBox.error(oError.message);
					});
				}
			},

			onPatternMatched: function (event) {
				this.bindSelectedItem(event.getParameter("arguments"));
			},

			bindSelectedItem: function ({
				CountryId
			}) {
				const decodedCountryId = window.decodeURIComponent(CountryId);
				ObjectPageLayout = this.byId("ObjectPageLayout");
				this.getView().bindElement({
					path: `/Country('${decodedCountryId}')`,
					parameters: {
						$$updateGroupId: batchGroupId
					},
					events: {
						dataRequested: function () {
							ObjectPageLayout.setBusy(true);
						},
						dataReceived: function (oData) {
							ObjectPageLayout.setBusy(false);
						},
						change: function (oEvent) {

						}
					}
				});

			},

			handleFullScreen: function () {

			},

			handleClose: function (oEvent) {
				this.reset(oEvent);
				this.getOwnerComponent().getRouter().navTo("master");
			},

			onSubmitPress: async function () {
				if (this.getOwnerComponent().getModel().hasPendingChanges()) {
					this.byId("ObjectPageLayout").setBusy(true);
					this.refreshMasterList(batchGroupId);
					await this.submitBatch(batchGroupId);
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

			submitBatch: async function (id) {

				return await oModel.submitBatch(id).then(
					function () {
						if (!oModel.hasPendingChanges()) {
							window.requestAnimationFrame(() => MessageToast.show("Country updated"));
						}

					},
					function (oError) {

					}

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

		});
	});