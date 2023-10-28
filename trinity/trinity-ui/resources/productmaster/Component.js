sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
	"nv/productMaster/model/models",
	"sap/m/Dialog",
	"sap/m/Button",
	"sap/m/Text"
], function (UIComponent, Device, models, Dialog, Button, Text) {
	"use strict";

	return UIComponent.extend("nv.productMaster.Component", {

		metadata: {
			manifest: "json"
		},

		/**
		 * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
		 * @public
		 * @override
		 */
		init: function () {
			// call the base component's init function
			UIComponent.prototype.init.apply(this, arguments);
			
			this.getModel("detailViewModel").setProperty("/editing", false);

			// enable routing
			this.getRouter().initialize();

			// set the device model
			this.setModel(models.createDeviceModel(), "device");
			this.setModel(models.createLocalModel(), "LocalDataModel");
			this.setModel(models.createLocalModel(), "oUserModel");
			this.setModel(models.createLocalModel(), "oUIConfigModel");
			this._initSessionDialogs();
		},
		_initSessionDialogs: function () {
			
			var sessionExpiringDialog = new Dialog({
				title: "Session Expiring",
				type: 'Message',
				state: 'Warning',
				content: new Text({
					text: "Your session is about to expire in 5 minutes due to inactivity. To continue working, you must perform some operations in the application."
				}),
				beginButton: new Button({
					text: "OK",
					press: function () {
						sessionExpiringDialog.close();
					}
				})
			});

			var sessionExpiredDialog = new Dialog({
				title: "Session Expired",
				type: 'Message',
				state: 'Warning',
				content: new Text({
					text: "Your session has expired. Please refresh the application."
				})
			});

		
			var counter = 0;
			var sessionExpiringTimeoutId = null;
			var sessionExpiredTimeoutId = null;

			var resetTimeouts = function () {
				if (sessionExpiringTimeoutId) {
					clearTimeout(sessionExpiringTimeoutId);
				}
				if (sessionExpiredTimeoutId) {
					clearTimeout(sessionExpiredTimeoutId);
				}
				
				document.onmousemove = function(){
					counter = 0;
				};
				
				document.onkeydown = function(){
					counter = 0;
				};

				// Don't create more timeouts if session is already expired
				
			
					sessionExpiringTimeoutId = setInterval(function () {
						counter = counter + 1;
						if(counter > 25){
							if (sessionExpiredDialog) {
								sessionExpiredDialog.open();
							}
						}
						
					}, 60000); // 30 minutes
					
			};


			resetTimeouts();
		}
	});
});