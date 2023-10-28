sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageToast",
	"sap/ui/model/Sorter",
	"sap/m/library",
	"nv/productMaster/utils/PMPersonalizedService",
	"nv/productMaster/utils/CpuPersonalizedService",
	"nv/productMaster/utils/GpuPersonalizedService",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/m/TablePersoController",
	"sap/ui/core/Fragment"
], function (Controller, MessageToast, Sorter, mlibrary, DemoPersoService, CpuPersonalized, GpuPeronalized, Filter, FilterOperator,
	TablePersoController, Fragment) {
	"use strict";
	const batchGroupId = "myUpdateGroupId";
	var ResetAllMode = mlibrary.ResetAllMode;
	var prodMappingObj = {
		"sysModelNum": "sys_model_no",
		"manufct": "sys_manufacturer/name",
		"gpuModelNum": "gpu/gpu_model_no",
		"cpuModelNum": "cpu/cpu_model_no",
		"platform": "sys_platform/description",
		"sysComptr": "sys_competitor",
		"sysType": "sys_type/description",
		"gpuMemorySize": "gpu_memory_size/description",
		"crtdOn": "created_on"
	};

	return Controller.extend("partner.controller.BaseController", {

	

		showMessage: function (sMsg, sPos, sType) {
			if (sPos === "center") {
				MessageToast.show(sMsg, {
					duration: 5000,
					my: "center center",
					at: "center center"
				});
			} else if (sPos === "bottom") {
				MessageToast.show(sMsg, {
					duration: 5000
				});
			}
			if (sType === "S") {
				var sColor = "#007833";
			} else {
				sColor = "#cc1919";
			}

			var oMessageToastDOM = $("#content").parent().find(".sapMMessageToast");
			oMessageToastDOM.css("background", sColor);
			oMessageToastDOM.css("width", "17rem");
		},

		//////filter and sort
		onClick: function (oID) {
			var that = this;
			$('#' + oID).click(function (oEvent) { //Attach Table Header Element Event
				var oTarget = oEvent.currentTarget; //Get hold of Header Element
				var oIndex = oTarget.id.split('--')[2]; //Get the column Index
				that.getOwnerComponent().getModel("LocalDataModel").setProperty("/inputVal", "");
				that.getOwnerComponent().getModel("LocalDataModel").setProperty("/bindingValue", prodMappingObj[oIndex]);
				that._oResponsivePopover.openBy(oTarget);
			});
		},

		onChange: function (oEvent) {
			var oValue = oEvent.getParameter("value");
			var oTable = this.getView().byId("masterList");
			var oBindingPath = this.getOwnerComponent().getModel("LocalDataModel").getProperty("/bindingValue"); //Get Hold of Model Key value that was saved
			var aFilters = [];
			var oFilter = new Filter(oBindingPath, "EQ", oValue);
			aFilters.push(oFilter);

			var oItems = oTable.getBinding("items");
			oItems.filter(aFilters, "Application");
			this._oResponsivePopover.close();
			oEvent.getSource().setValue("");

		},
		// sort Ascending
		onAscending: function () {
			var oTable = this.getView().byId("masterList");
			var oItems = oTable.getBinding("items");
			var oBindingPath = this.getOwnerComponent().getModel("LocalDataModel").getProperty("/bindingValue");
			var oSorter = new Sorter(oBindingPath, false);
			oItems.sort(oSorter);
			this._oResponsivePopover.close();
		},
		//sort descending
		onDescending: function () {
			var oTable = this.getView().byId("masterList");
			var oItems = oTable.getBinding("items");
			var oBindingPath = this.getOwnerComponent().getModel("LocalDataModel").getProperty("/bindingValue");
			var oSorter = new Sorter(oBindingPath, true);
			oItems.sort(oSorter);
			this._oResponsivePopover.close();
		},

		onOpen: function (oEvent) {
			//On Popover open focus on Input control
			var oPopover = sap.ui.getCore().byId(oEvent.getParameter("id"));
			var oPopoverContent = oPopover.getContent()[0];
			var oCustomListItem = oPopoverContent.getItems()[2];
			var oCustomContent = oCustomListItem.getContent()[0];
			var oInput = oCustomContent.getItems()[1];
			oInput.focus();
			oInput.$().find('.sapMInputBaseInner')[0].select();
		},

		onExit: function () {
			this._oTPC.destroy();
			this._gpuPop.destroy();
			this._cpuPop.destroy();
		},

		onPersoButtonPressed: function (oEvent) { // Personalized Table columns. Show hide columns and shuffle columns.
			if (this._oTPC) {
				this._oTPC.destroy();
			}

			if (this._gpuPop) {
				this._gpuPop.destroy();
			}

			if (this._cpuPop) {
				this._cpuPop.destroy();
			}

			if (oEvent.getSource().sId === 'gpuPopup') {
				this._gpuPop = new sap.m.TablePersoController({
					table: sap.ui.getCore().byId("idGpuList"),
					//specify the first part of persistence
					componentName: "gpuMaster",
					resetAllMode: ResetAllMode.ServiceReset,
					persoService: GpuPeronalized
				}).activate();
				// init and activate controller for personalization of table
				this._gpuPop.openDialog();
			} else if (oEvent.getSource().sId === 'cpuPopup') {
				this._cpuPop = new sap.m.TablePersoController({
					table: sap.ui.getCore().byId("idCpuList"),
					//specify the first part of persistence
					componentName: "cpuMaster",
					resetAllMode: ResetAllMode.ServiceReset,
					persoService: CpuPersonalized
				}).activate();
				// init and activate controller for personalization of table
				this._cpuPop.openDialog();
			} else {
				this._oTPC = new sap.m.TablePersoController({
					table: this.byId("masterList"),
					//specify the first part of persistence
					componentName: "productMaster",
					resetAllMode: ResetAllMode.ServiceReset,
					persoService: DemoPersoService
				}).activate();
				// init and activate controller for personalization of table
				this._oTPC.openDialog();
			}
		},
		onTablePersoRefresh: function () {
			DemoPersoService.resetPersData().done(
				function () {
					this._oTPC.refresh();
				}.bind(this)
			);

			CpuPersonalized.resetPersData().done(
				function () {
					this._cpuPop.refresh();
				}.bind(this)
			);

			GpuPeronalized.resetPersData().done(
				function () {
					this._gpuPop.refresh();
				}.bind(this)
			);
		},
		onTableGrouping: function (oEvent) {
			this._oTPC.setHasGrouping(oEvent.getSource().getSelected());
		},
		onCloseCPU: function () {
			this._cpuModelDialog.destroy();
		},

		_fnOpenCpuFragment: function (elm) {
			this.getOwnerComponent().getModel("LocalDataModel").setProperty("/gpudata", {});
			this.getOwnerComponent().getModel("LocalDataModel").setProperty("/cpudata", {});
			this.getOwnerComponent().getModel("LocalDataModel").setProperty("/visibleError", false);
			this.getOwnerComponent().getModel("LocalDataModel").setProperty("/visible", true);
			this._cpuModelDialog = null;
			if (!this._cpuModelDialog) {
				this._cpuModelDialog = Fragment.load({
					name: elm,
					controller: this
				}).then(function (oFragment) {
					this._cpuModelDialog = oFragment;
					this.getView().addDependent(this._cpuModelDialog);

					oFragment.open();
				}.bind(this));
			}
		},

		OnCpuMdelPress: function (oEvent) {
			this._fnOpenCpuFragment("nv.productMaster.view.fragments.CPU_popup");
		},
		OnCpuMdelEditPress: function (oEvent) {
			this._fnOpenCpuFragment("nv.productMaster.view.fragments.CPU_popup_home");
		},
		onCloseGPU: function () {
			this._cpuModelDialog.destroy();
		},

		OnGpuMdelPress: function (oEvent) {

			this._fnOpenCpuFragment("nv.productMaster.view.fragments.GPU_popup");

		},
		OnGpuMdelEditPress: function (oEvent) {
			this._fnOpenCpuFragment("nv.productMaster.view.fragments.GPU_popup_home");
		},
		confirmGPU: function () {
			var oBinding = this.getOwnerComponent().getModel().bindList("/ProductGpu");
			var oLocalModel = this.getOwnerComponent().getModel("LocalDataModel");

			if (oLocalModel.getProperty("/gpudata/gpu_model_no")) {
				var oContext = oBinding.create({
					"gpu_model_no": oLocalModel.getProperty("/gpudata/gpu_model_no"),
					"gpu_model_description": oLocalModel.getProperty("/gpudata/gpu_model_description"),
					"gpu_model_no_current": oLocalModel.getProperty("/gpudata/gpu_model_no_current"),
					"gpu_model_no2": oLocalModel.getProperty("/gpudata/gpu_model_no2"),
					"gpu_architecture_id": oLocalModel.getProperty("/gpudata/gpu_architecture_id"),
					"gpu_dx_type_id": oLocalModel.getProperty("/gpudata/gpu_dx_type_id"),
					"gpu_gf_segment_id": oLocalModel.getProperty("/gpudata/gpu_gf_segment_id"),
					"gpu_gf_sub_segment_id": oLocalModel.getProperty("/gpudata/gpu_gf_sub_segment_id"),
					"gpu_class_id": oLocalModel.getProperty("/gpudata/gpu_class_id")
				});
				oContext.created().then(
					$.proxy(function () {
						if (this.getView().sId.split("---")[1] === "Home") {
							this.showMessage("GPU " + oContext.getProperty("gpu_model_no") + " is created successfully.", "bottom", "S");
						} else {
							this.getView().getBindingContext().setProperty("gpu_id", oContext.getProperty("id"));
							this.onSubmitPress();
						}
						this._cpuModelDialog.destroy();
					}, this),

					$.proxy(function (err) {
						console.log(err);
					}, this)

				);
			} else {
				this.getOwnerComponent().getModel("LocalDataModel").setProperty("/visibleError", true);
			}

		},

		confirmCPU: function () {
			var oBinding = this.getOwnerComponent().getModel().bindList("/ProductCpu");
			var oLocalModel = this.getOwnerComponent().getModel("LocalDataModel");

			if (oLocalModel.getProperty("/cpudata/cpu_model_no")) {
				var oContext = oBinding.create({
					"cpu_model_no": oLocalModel.getProperty("/cpudata/cpu_model_no"),
					"cpu_brand_id": oLocalModel.getProperty("/cpudata/cpu_brand_id"),
					"cpu_core_frequency_id": oLocalModel.getProperty("/cpudata/cpu_core_frequency_id"),
					"cpu_core_id": oLocalModel.getProperty("/cpudata/cpu_core_id"),
					"cpu_manufacturer_id": oLocalModel.getProperty("/cpudata/cpu_manufacturer_id"),
					"cpu_architecture_id": oLocalModel.getProperty("/cpudata/cpu_architecture_id"),
					"cpu_class_id": oLocalModel.getProperty("/cpudata/cpu_class_id")

				});
				oContext.created().then(
					$.proxy(function () {
						if (this.getView().sId.split("---")[1] === "Home") {
							this.showMessage("CPU " + oContext.getProperty("cpu_model_no") + " is created successfully.", "bottom", "S");
						} else {
							this.getView().getBindingContext().setProperty("cpu_id", oContext.getProperty("id"));
							this.onSubmitPress();
						}

						this._cpuModelDialog.destroy();
					}, this),

					$.proxy(function (err) {
						console.log(err);
					}, this)

				);
			} else {
				this.getOwnerComponent().getModel("LocalDataModel").setProperty("/visibleError", true);
			}

		},
		onSearchCPU: function (oEvent) {
			var aFilters = [];
			var sQuery = oEvent.getSource().getValue();
			if (sQuery && sQuery.length > 0) {
				sap.ui.getCore().byId("idCpuList").getBinding("items").changeParameters({
					"$search": sQuery
				});

				/*	var filter = new Filter("cpu_model_no", FilterOperator.Contains, sQuery);
					aFilters.push(filter);*/
			}

			// update list binding
			//var oList = sap.ui.getCore().byId("idCpuList");
			//var oBinding = oList.getBinding("items");
			//oBinding.filter(aFilters, "Application");
		},
		onSearchGPU: function (oEvent) {
			var aFilters = [];
			var sQuery = oEvent.getSource().getValue();
			if (sQuery && sQuery.length > 0) {

				sap.ui.getCore().byId("idGpuList").getBinding("items").changeParameters({
					"$search": sQuery
				});
				/*	var filter = new Filter("gpu_model_no", FilterOperator.Contains, sQuery);
					aFilters.push(filter);*/
			}

			// update list binding
			//var oList = sap.ui.getCore().byId("idGpuList");
			//var oBinding = oList.getBinding("items");
			//oBinding.filter(aFilters, "Application");
		},

		onSearchForEditCpu: function (oEvent) {
			//var oItem = oEvent.getSource().getSuggestionItems();
			var oModel = this.getView().getModel();
			var sKey = oEvent.getSource().getSelectedKey();
			if (sKey) {
				sap.ui.getCore().byId("idEditCpu").bindElement({
					path: `/ProductCpu(${sKey})`,
					parameters: {
						$$updateGroupId: batchGroupId
					}
				})
			} else {
				this.showMessage("Product CPU doesn't exist.", "bottom", "E");
			}
		},

		onSearchForEditGpu: function (oEvent) {
			//var oItem = oEvent.getSource().getSuggestionItems();
			var sKey = oEvent.getSource().getSelectedKey();
			if (sKey) {
				sap.ui.getCore().byId("idEditGpu").bindElement({
					path: `/ProductGpu(${sKey})`,
					parameters: {
						$$updateGroupId: batchGroupId
					}
				})
			} else {
				this.showMessage("Product GPU doesn't exist.", "bottom", "E");
			}
		},
		onUpdateGPU: async function (oEvent) {

			var oModel = this.getView().getModel();
			if (sap.ui.getCore().byId("idGPUModelNo").getValue() != '') {
				if (this.getView().getModel().hasPendingChanges()) {
					await this.submitHomeBatch(batchGroupId);
				} else {
					this.showMessage("No Changes done.", "bottom", "S");
				}
			} else {
				this.showMessage("Please search for a GPU to Edit.", "bottom", "E");
			}
		},
		onUpdateCPU: async function (oEvent) {
			var oModel = this.getView().getModel();
			if (sap.ui.getCore().byId("idCPUModelNo").getValue() != '') {
				if (this.getView().getModel().hasPendingChanges()) {
					await this.submitHomeBatch(batchGroupId);
				} else {
					this.showMessage("No Changes done.", "bottom", "S");
				}
			} else {
				this.showMessage("Please search for a CPU to Edit.", "bottom", "E");
			}
		},
		submitHomeBatch: async function (id) {
			var oModel = this.getView().getModel(),
				sProductModelNo, sText;
			var that = this;

			that.getView().setBusy(true);
			if (this._cpuModelDialog.getTitle() == "CPU Create/Edit") {
				sProductModelNo = sap.ui.getCore().byId("idEditCpu").getBindingContext().getProperty("cpu_model_no");
				sText = "Product CPU ";
			} else {
				sProductModelNo = sap.ui.getCore().byId("idEditGpu").getBindingContext().getProperty("gpu_model_no");
				sText = "Product GPU ";
			}

			return await oModel.submitBatch(id).then(
				function () {
					if (!oModel.hasPendingChanges()) {
						that.getView().setBusy(false);
						that._cpuModelDialog.destroy();
						that.showMessage(sText + sProductModelNo + " is Updated.", "bottom", "S");
						oModel.resetChanges(batchGroupId);
					}
				},
				function (oError) {
					that.getView().setBusy(false);
				}
			);
		},
		cpuSelect: function (oEvent) {

			var selectedText = oEvent.getBindingContext().getProperty("id");
			this._cpuModelDialog.destroy();
			this.getView().getBindingContext().setProperty("cpu_id", selectedText);
			this.onSubmitPress();

		},
		gpuSelect: async function (oEvent) {
			var selectedVal = oEvent.getBindingContext().getProperty("gpu_model_no");
			var selectedId = oEvent.getBindingContext().getProperty("id")
			this._cpuModelDialog.destroy();
			//this.byId("gpu_model_no").setValue(selectedVal);
			//this.byId("gpu_id").setText(selectedId);

			this.getView().getBindingContext().setProperty("gpu_id", selectedId);

			this.onSubmitPress();
		},

		onRBSelect: function (oEvent) {
			var oView = this.getView();
			if (oEvent.getSource().getSelectedIndex() === 0) {
				this.getOwnerComponent().getModel("LocalDataModel").setProperty("/visible", true);
				this.getOwnerComponent().getModel("LocalDataModel").setProperty("/bvisblecreategpu", false);

			} else {
				this.getOwnerComponent().getModel("LocalDataModel").setProperty("/visible", false);
				this.getOwnerComponent().getModel("LocalDataModel").setProperty("/bvisblecreategpu", true);

			}
		},
		onSubmitPress: async function (oEvent) {
			var sPath = this.getView().getBindingContext().getPath();
			var oProduct = this.getView().getBindingContext().getObject();
			this.getView().setBusy(false);
			if (this.getView().getModel().hasPendingChanges()) {
				this.byId("ObjectPageLayout").setBusy(true);
				await this.submitBatch(batchGroupId);
				this.byId("ObjectPageLayout").setBusy(false);
			}

			await this.getView().getModel().submitBatch(batchGroupId).then(function () {
				this.getView().getBindingContext().refresh();
			}.bind(this));

		},
		submitBatch: async function (id) {
			var oModel = this.getView().getModel();
			var that = this;
			var sProductModelNo = this.getView().getBindingContext().getProperty("sys_model_no");

			return await oModel.submitBatch(id).then(
				function () {
					if (!oModel.hasPendingChanges()) {
						that.getView().setBusy(false);
						that.showMessage("Product " + sProductModelNo + " is Updated.", "bottom", "S");
						that.reset();
					}
				},
				function (oError) {
					that.getView().setBusy(false);
				}
			);
		},
		// on logout from page
		onPressLogout: function () {
			window.location.replace("/my/logout");
		}

	});
});