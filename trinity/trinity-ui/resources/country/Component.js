sap.ui.define([
	"sap/ui/core/UIComponent"
], function (UIComponent) {
	"use strict";

	return UIComponent.extend("country.Component", {
		metadata: {
			manifest: "json"
		},

		init: function () {
			UIComponent.prototype.init.apply(this, arguments);
			this.getModel("detailViewModel").setProperty("/editing", false);
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