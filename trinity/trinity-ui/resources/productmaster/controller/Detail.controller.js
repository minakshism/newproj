sap.ui.define([
	"nv/productMaster/controller/BaseController",
	"sap/m/MessageToast",
	"sap/m/MessageBox",
	"sap/ui/core/EventBus",
	"sap/ui/core/Fragment",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"nv/productMaster/model/formatter"
], function (BaseController, MessageToast, MessageBox, EventBus, Fragment, Filter, FilterOperator, formatter) {
	"use strict";
	const batchGroupId = "myUpdateGroupId";
	var geography;
	var ObjectPageLayout;
	var state;
	var oModel;
	var oView;
	var Router;
	var oView;

	return BaseController.extend("nv.productMaster.controller.Detail", {
		formatter: formatter,
		onInit: function (Controller, MessageToast, MessageBox, EventBus, Fragment) {
			const router = this.getOwnerComponent().getRouter();
			const route = router.getRoute("Detail");
			oModel = this.getView().getModel();
			oView = this.getView();
			router.attachRoutePatternMatched(this.onPatternMatched, this);
			route.attachBeforeMatched(this.reset, this);
			Router = this.getOwnerComponent().getRouter();
			var oUserModel = this.getOwnerComponent().getModel("oUserModel");

		},
		onPatternMatched: function (oEvt) {
			//this.bindSelectedItem(event.getParameter("arguments"));
			oModel = this.getView().getModel();
			var id = oEvt.getParameter("arguments").id;
			if (!this.getView().getModel().hasPendingChanges()) {
				this.getView().bindElement({
					path: `/ProductSystems(${id})`,
					parameters: {
						$$updateGroupId: batchGroupId
					}
					// events: {
					// 	change: function (oEvent) {
					// 		console.log(oEvent);
					// 	}
					// }
				});
			}
		},
		onBack: function (oEvt) {
			if (this.getView().getModel().hasPendingChanges() == true) {
				sap.m.MessageBox.warning("Do you want to save the changes?", {
					actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
					emphasizedAction: sap.m.MessageBox.Action.YES,
					onClose: function (sAction) {
						if (sAction === sap.m.MessageBox.Action.YES) {
							this.onSubmitPress();
						} else {
							oModel.resetChanges(batchGroupId);
							Router.navTo("Home");
						}

					}.bind(this)
				});
			} else {
				Router.navTo("Home");
				oModel.resetChanges(batchGroupId);

			}

		},
		resetEditingStatus: function (exit) {
			const model = this.getOwnerComponent().getModel("detailViewModel");
			if (!model.getProperty("/editing") || exit !== undefined) {
				model.setProperty("/editing", false, null, true);
			}
		},
		//Test
		reset: function (event) {
			if (this.getView().getModel().hasPendingChanges() == true) {
				sap.m.MessageBox.warning("Do you want to save the changes?", {
					actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
					emphasizedAction: sap.m.MessageBox.Action.YES,
					onClose: function (sAction) {
						if (sAction === sap.m.MessageBox.Action.YES) {
							this.onSubmitPress();
							Router.navTo("Home");
						} else {
							oModel.resetChanges(batchGroupId);
							Router.navTo("Home");
						}

					}.bind(this)
				});
			} else {
				oModel.resetChanges(batchGroupId);
			}

			if (event !== undefined) {
				if (event.getSource().sId === "__component0---Detail--decline" ||
					event.getSource().sId === "__component0---Detail--cancelBtn") {
					this.resetEditingStatus("exit");
				} else {
					this.resetEditingStatus();
				}
			} else {
				this.resetEditingStatus();
			}
		},

		_updateProduct: function (sPath, oProduct, bForceUpdate) {
			var oDataModel = this.getView().getModel();
			return new Promise(function (resolve, reject) {
				oDataModel.update(sPath, oProduct, {
					success: resolve,
					error: reject
				});
			});
		},
		_openDialog: function () {
			var that = this;
			var dialog = new Dialog({
				title: 'Confirm',
				type: 'Message',
				content: new Text({
					text: 'There is a more recent version available. Do you want to refresh or overwrite the backend entry?'
				}),
				beginButton: new Button({
					text: 'Overwrite',
					press: function () {
						that._update(true);
						dialog.close();
					}
				}),
				endButton: new Button({
					text: 'Refresh',
					press: function () {
						//Refresh entity....
						dialog.close();
					}
				}),
				afterClose: function () {
					dialog.destroy();
				}
			});
			dialog.open();
		},
		_update: function (bForceUpdate) {
			var that = this;
			var sPath = that.getView().getBindingContext().getPath();
			var oModel = that.getView().getModel();
			var oProduct = that.getView().getBindingContext().getObject();

			this._updateProduct(sPath, oProduct, bForceUpdate)
				.then(function () {
					MessageToast.show("Success...");
				})
				.catch(function (oError) {
					// Error handling
					//open Dialog if Precondition failed
					if (oError === "412") {
						this._openDialog();
					}
				});
		},

		_updateProduct: function (sPath, oProduct, bForceUpdate) {
			var oDataModel = this.getView().getModel();
			var oPromise = new Promise(function (resolve, reject) {
				var mParameters = {
					success: resolve,
					error: function (oError) {
						reject(oError.statusCode);
					}
				};
				if (bForceUpdate) {
					mParameters.eTag = "*";
				}

				oDataModel.update(sPath, oProduct, mParameters);
			});
			return oPromise;
		},
		platformSelect: function (oEvent) {
			var selectedVal = oEvent.getBindingContext().getProperty("id")
			this._platformDialog.close();
			this.byId("sys_platform").setValue(selectedVal);

		},
		manufacturerSelect: function (oEvent) {
			var selectedVal = oEvent.getBindingContext().getProperty("id")
			this._manufacturerDialog.close();
			this.byId("sys_manufacturer").setValue(selectedVal);
		},
		OnPlatformPress: function () {
			this._platformDialog = null;
			if (!this._platformDialog) {
				this._platformDialog = Fragment.load({
					name: "nv.productMaster.view.fragments.Platform_popup",
					controller: this
				}).then(function (oFragment) {
					this._platformDialog = oFragment;
					this.getView().addDependent(this._platformDialog);
					this.getOwnerComponent().getModel("LocalDataModel").setProperty("/visible", true);
					oFragment.open();
				}.bind(this));
			}
		},

		_fnPlatform: function (sPlatform) {
			var oUIConfigModel = this.getOwnerComponent().getModel("oUIConfigModel");
			return new Promise((resolve, reject) => {
				$.ajax({
					url: "/trinity/api/ProductUIConfig?$filter=sys_platform_id eq '" + sPlatform + "'",
					type: "GET",
					success: function (data, textStatus, jqXHR) {
						oUIConfigModel.setData(data.value);
						resolve("resolved");
					}.bind(this),
					error: function (jqXHR, textStatus, errorThrown) {
						reject(jqXHR);
					}.bind(this)
				});
			});

		},

		_fnVisibleTrue: function () {
			var oArrVisible = ["sys_competitor", "sys_type", "sys_screen_size", "sys_screen_refresh_rate"];
			for (let j in oArrVisible) {
				this.byId(oArrVisible[j]).setProperty("visible", true);
			}
		},

		selectPlatform: async function (oEvent) {
			var sPlatform = oEvent.getParameters().value.toUpperCase();
			this._fnVisibleTrue();
			try {
				await this._fnPlatform(sPlatform);
				var oUIConfigModelArr = this.getOwnerComponent().getModel("oUIConfigModel").getData();
				if (oUIConfigModelArr.length > 0) {
					for (let i in oUIConfigModelArr) {
						this.byId(oUIConfigModelArr[i].field_name).setProperty("visible", oUIConfigModelArr[i].visibility);
					}
				}
			} catch (err) {
				this.showMessage(err, "bottom", "E");
			}

		},

		OnManufacturerPress: function () {
			this._manufacturerDialog = null;
			if (!this._manufacturerDialog) {
				this._manufacturerDialog = Fragment.load({
					name: "nv.productMaster.view.fragments.Manufacturer_popup",
					controller: this
				}).then(function (oFragment) {
					this._manufacturerDialog = oFragment;
					this.getView().addDependent(this._manufacturerDialog);
					this.getOwnerComponent().getModel("LocalDataModel").setProperty("/visible", true);
					oFragment.open();
				}.bind(this));
			}
		},
		onClosePlatform: function () {
			this._platformDialog.close();
		},
		onCloseManufacturer: function () {
			this._manufacturerDialog.close();
		},
		onPressCancelGPU: function (oEvent) {
			var oContext = oEvent.getSource().getBindingContext();
			this._fnWarningMessageBox(oContext, "gpu_id");

		},

		_fnWarningMessageBox: function (oContext, elm) {
			sap.m.MessageBox.warning("Do you want to save the changes ?", {
				actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
				emphasizedAction: sap.m.MessageBox.Action.YES,
				onClose: function (sAction) {
					if (sAction === sap.m.MessageBox.Action.YES) {
						oContext.setProperty(elm, null);
						this.onSubmitPress();
					}

				}.bind(this)
			});
		},

		onPressCancelCPU: function (oEvent) {
			var oContext = oEvent.getSource().getBindingContext();
			this._fnWarningMessageBox(oContext, "cpu_id");
		},

		onPost: async function (oEvent) {
			var comment = oEvent.getSource().getValue();

			var oContext = oView.byId("idCommentsList").getBinding("items")
				.create({

					"comment": comment
				});

			await this.submitBatch(batchGroupId, "Comment Posted");

		},

		onExit: function (oEvent) {
			console.log(oEvent);
		}

	});
});