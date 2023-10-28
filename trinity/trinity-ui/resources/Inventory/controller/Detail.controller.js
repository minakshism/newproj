	sap.ui.define([
		"sap/ui/core/mvc/Controller",
		"sap/m/MessageToast",
		"sap/m/MessageBox",
		"sap/ui/core/EventBus",

		"sap/ui/core/Fragment",
		"sap/ui/model/Filter",
		"sap/ui/model/FilterOperator"
	], function (Controller, MessageToast, MessageBox, EventBus, Fragment, Filter, FilterOperator) {
		"use strict";

		const batchGroupId = "myUpdateGroupId";
		var geography;
		var ObjectPageLayout;
		var state;
		var oModel;
		var oView;

		return Controller.extend("nv.Inventory.controller.Detail", {
	
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

		
			bindSelectedItem: function ({
				transaction_id
			}) {
				const decodedTransactionId = window.decodeURIComponent(transaction_id);
			

				this.getView().bindElement({
					path: `/PartnerMaster('${decodedTransactionId}')`,
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
							window.requestAnimationFrame(() => MessageToast.show("Partner updated"));
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