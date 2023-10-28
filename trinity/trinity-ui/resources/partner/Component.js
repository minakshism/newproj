sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
	"partner/model/models"
], function (UIComponent,Device, models) {
	"use strict";

	return UIComponent.extend("partner.Component", {
		metadata: {
			manifest: "json"
		},

		init: function () {
			UIComponent.prototype.init.apply(this, arguments);
			this.getModel("detailViewModel").setProperty("/editing", false);
			// set the device model
			this.setModel(models.createDeviceModel(), "device");
			this.setModel(models.createLocalModel(), "LocalDataModel");
			this.getRouter().initialize();
			window.addEventListener("beforeunload", this.onBeforeLeave.bind(this));
		},

		onBeforeLeave: function (event) {
			if (this.getModel().hasPendingChanges()) { // display confirmation dialog
				event.preventDefault(); // as specified by the HTML standard
				event.returnValue = ""; // as required by Chromium-based UAs
			}
		}

	});
});