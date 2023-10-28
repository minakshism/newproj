sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageToast",
	"sap/m/MessageBox",
	"sap/ui/core/EventBus",
	"sap/ui/core/Fragment",
	"./BaseController"
], function (Controller, MessageToast, MessageBox, EventBus, Fragment, BaseController) {
	"use strict";
	var Router;
	var oView;

	return BaseController.extend("nv.productMaster.controller.Home", {
		onInit: function () {
			Router = this.getOwnerComponent().getRouter();
			oView = this.getView();
			// load loged in user details
			var oUserModel = this.getOwnerComponent().getModel("oUserModel");
			//this.getOwnerComponent().getModel().setSizeLimit(400);
			$.ajax({
				url: "/trinity/api/UserScopes",
				type: "GET",
				success: function (data, textStatus, jqXHR) {
					oUserModel.setData(data.value[0]);
				}.bind(this),
				error: function (jqXHR, textStatus, errorThrown) {}.bind(this)
			});
			// for sorting and filter popup
			var that = this;
			if (!this._oResponsivePopover) {
				this._oResponsivePopover = sap.ui.xmlfragment("nv.productMaster.view.fragments.popOver", this);
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
		},
		navToDetailOf: function (item) {
			const id = item.getBindingContext().getProperty("id");

			// if(this.getView().getModel().hasPendingChanges() == true){
			// 	sap.m.MessageBox.warning("Do you want to save the changes?", {
			// 	actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
			// 	emphasizedAction: sap.m.MessageBox.Action.YES,
			// 	onClose: function (sAction) {
			// 		if(sAction === sap.m.MessageBox.Action.YES) {
			// 			this.getView().getModel().submitBatch("$auto").then(function(){
			// 				 sap.m.MessageToast.show("Changes has been saved successfully.");
			// 			})
			// 		}

			// 	}.bind(this)
			// });
				this.byId("masterList").removeSelections(true);
		
				Router.navTo("Detail", {
					id
				});
				
			

			//}

		},
		onBeforeRendering: function () {
			var oView = this.getView();
			oView.byId("ProductTitle").setBindingContext(
				oView.byId("masterList").getBinding("items").getHeaderContext());
		},
		onChangeSystem: function (oEvent) {
			var aFilter = [];
			var squery = oEvent.getSource().getValue();
			if (squery) {
				this.byId("idProductSysModelNo").getBinding("suggestionItems").changeParameters({
					"$search": squery
				});
			}

		},
		onChangeGpu: function (oEvent) {
			var aFilter = [];
			var squery = oEvent.getSource().getValue();
			if (squery) {
				this.byId("idProductGPU").getBinding("suggestionItems").changeParameters({
					"$search": squery
				});
			}

		},
		onChangeCpu: function (oEvent) {
			var aFilter = [];
			var squery = oEvent.getSource().getValue();
			if (squery) {
				this.byId("idProductCPU").getBinding("suggestionItems").changeParameters({
					"$search": squery
				});
			}

		},
		onChangePlatform: function (oEvent) {
			var aFilter = [];
			var squery = oEvent.getSource().getValue();
			if (squery) {
				this.byId("idProductPlatform").getBinding("suggestionItems").changeParameters({
					"$search": squery
				});
			}

		},
		onSearch: function (event) {
			var aFilter = [],
				asys_model_no = this.byId("idProductSysModelNo").getTokens(),
				agpu_model_no = this.byId("idProductGPU").getTokens(),
				acpu_model_no = this.byId("idProductCPU").getTokens(),
				//aKnownas = this.byId("idKnownas").getTokens(),
				sManufact = this.byId("idmanufact").getSelectedKey(),
				sGPUManufact = this.byId("idgpumanufc").getSelectedKey(),
				//	sGPUMemorySize = this.byId("idGPUMemorySize").getSelectedKey(),
				sSysType = this.byId("idSysType").getSelectedKey(),
				sSysComp = this.byId("idSysComp").getSelectedKey(),
				ssys_platform_description = this.byId("idProductPlatform").getSelectedKey(),
				sCdate = this.byId("cdate").getValue(),
				sChdate = this.byId("chdate").getValue(),
				bStatusVal = this.byId("idStatField").getSelectedKey(),
				dd,
				mm,
				yyyy;
			// sQuery = this.byId("searchField").getValue();

			$.each(asys_model_no, function (i, token) {
				aFilter.push(new sap.ui.model.Filter("sys_model_no", sap.ui.model.FilterOperator.EQ, token.getKey()));
			});

			// $.each(aKnownas, function (i, token) {
			// 	aFilter.push(new sap.ui.model.Filter("assigned_to_empid", sap.ui.model.FilterOperator.EQ, token.getKey()));
			// });

			// $.each(aManufact, function (i, token) {
			if (sManufact) {
				aFilter.push(new sap.ui.model.Filter("sys_manufacturer_id", sap.ui.model.FilterOperator.EQ, sManufact));
			}
			//});

			if (sGPUManufact) {
				aFilter.push(new sap.ui.model.Filter("gpu_manufacturer_id", sap.ui.model.FilterOperator.EQ, sGPUManufact));
			}

			// if (sGPUMemorySize) {
			// 	aFilter.push(new sap.ui.model.Filter("gpu_memory_size_id", sap.ui.model.FilterOperator.EQ, sGPUMemorySize));
			// }

			//$.each(aSysType, function (i, token) {
			if (sSysType) {
				aFilter.push(new sap.ui.model.Filter("sys_type_id", sap.ui.model.FilterOperator.EQ, sSysType));
			}
			//});

			// $.each(aSysType, function (i, token) {
			// 	aFilter.push(new sap.ui.model.Filter("sys_type_id", sap.ui.model.FilterOperator.EQ, token.getKey()));
			// });

			$.each(agpu_model_no, function (i, token) {
				aFilter.push(new sap.ui.model.Filter("gpu/gpu_model_no", sap.ui.model.FilterOperator.EQ, token.getKey()));
			});

			$.each(acpu_model_no, function (i, token) {
				aFilter.push(new sap.ui.model.Filter("cpu/cpu_model_no", sap.ui.model.FilterOperator.EQ, token.getKey()));
			});

			// $.each(asys_platform_description, function (i, token) {
			if (ssys_platform_description) {
				aFilter.push(new sap.ui.model.Filter("sys_platform/id", sap.ui.model.FilterOperator.EQ, ssys_platform_description));
			}
			//});

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

			// if (sSysComp === "false") {
			// 	aFilter.push(new sap.ui.model.Filter("sys_competitor", sap.ui.model.FilterOperator.EQ, null));
			// 	aFilter.push(new sap.ui.model.Filter("sys_competitor", sap.ui.model.FilterOperator.EQ, "false"));
			// }

			// if (sSysComp === "true") {
			// 	aFilter.push(new sap.ui.model.Filter("sys_competitor", sap.ui.model.FilterOperator.EQ, "true"));
			// }

			if (sSysComp) {
				aFilter.push(new sap.ui.model.Filter("sys_competitor", sap.ui.model.FilterOperator.EQ, sSysComp));
				if (sSysComp == "false") {
					aFilter.push(new sap.ui.model.Filter("sys_competitor", sap.ui.model.FilterOperator.EQ, null));
					aFilter.push(new sap.ui.model.Filter("sys_competitor", sap.ui.model.FilterOperator.EQ, ""));
				}
			}

			if (bStatusVal) {
				aFilter.push(new sap.ui.model.Filter("complete", sap.ui.model.FilterOperator.EQ, bStatusVal));
				if (bStatusVal == "false") {
					aFilter.push(new sap.ui.model.Filter("complete", sap.ui.model.FilterOperator.EQ, null));
				}
			}

			// if (sQuery && sQuery.length > 0) {
			// 	this.byId("masterList").getBinding("items").changeParameters({
			// 		"$search": sQuery
			// 	});

			// } else {
			// this.byId("masterList").getBinding("items").changeParameters({
			// 	"$search": undefined
			// });
			// }
			this.byId("masterList").getBinding("items").filter(aFilter);
		},

		newProduct: function (oEvent) {

			var oView = this.getView();

			if (!this._newProductDialog) {
				this._newProductDialog = Fragment.load({
					id: oView.getId(),
					name: "nv.productMaster.view.newProduct",
					controller: this
				}).then(function (oDialog) {
					oView.addDependent(oDialog);
					return oDialog;
				});
			}
			this._newProductDialog.then(function (oDialog) {
				oDialog.open();
				this.byId("sys_model_no").setValueState("None");

			}.bind(this));

		},
		onConfirmProductDialog: function (oEvent) {

			var sVal = this.byId("sys_model_no").getValue();
			if (sVal) {
				this._newProductDialog.then(function (oDialog) {
					oDialog.close();
				});

				var oContext = this.getView().byId("masterList").getBinding("items")
					.create({
						"sys_model_no": oView.byId("sys_model_no").getValue(),
						"sys_model_description": oView.byId("sys_model_description").getSelectedKey()
					});

				oContext.created().then(
					function () {
						oView.byId("sys_model_no").setValue('');
						oView.byId("sys_model_description").setSelectedKey('');
						this.showMessage("Product Created", "bottom", "S");
						const id = oContext.getProperty('id');
						Router.navTo("Detail", {
							id
						});

					}.bind(this),
					function (oError) {
						this.showMessage("Product Creation Failed", "bottom", "E");
					}.bind(this)
				).catch(function (err) {
					console.log(err);
				}).finally(function (err) {
					console.log(err);
				});

				this.byId("sys_model_no").setValueState("None");
			} else {
				this.byId("sys_model_no").setValueState("Error");
			}
		},
		onRejectProductDialog: function (oEvent) {
			oView.byId("sys_model_no").setValue('');
			oView.byId("sys_model_description").setSelectedKey('');
			this._newProductDialog.then(function (oDialog) {
				oDialog.close();
			});
		},
		onPressClear: function () {

			this.byId("idProductSysModelNo").destroyTokens();
			this.byId("idProductSysModelNo").setValue("");
			this.byId("idmanufact").setSelectedKey("");
			this.byId("idgpumanufc").setSelectedKey("");
			// this.byId("idGPUMemorySize").setValue("");
			this.byId("idSysType").setSelectedKey("");
			this.byId("idSysComp").setSelectedKey("");
			this.byId("idProductGPU").destroyTokens();
			this.byId("idProductGPU").setValue("");
			this.byId("idProductCPU").destroyTokens();
			this.byId("idProductCPU").setValue("");
			// this.byId("idProductPlatform").destroyTokens();
			this.byId("idProductPlatform").setSelectedKey("");
			this.byId("cdate").setValue("");
			this.byId("chdate").setValue("");
			this.byId("idStatField").setSelectedKey("");
			this.getOwnerComponent().getModel("LocalDataModel").setProperty("/inputVal", "");
			var oTable = this.byId("masterList");
			var aColumns = oTable.getColumns();
			var aFilter = [];
			this.byId("masterList").getBinding("items").filter(aFilter);
			this.byId("masterList").getBinding("items").changeParameters({
				"$search": undefined
			});
		},
		fnFormatDate: function (sVal) {
			//console.log(sVal);
			if (sVal) {
				var date = new Date(sVal);
				var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({
					pattern: "dd/MM/yyyy"
				});
				return dateFormat.format(date);
			}

		}

	});
});