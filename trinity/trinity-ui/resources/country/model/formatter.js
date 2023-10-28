sap.ui.define([], function () {
	"use strict";

	return {

		getFlag: function (id) {
			var flagUrl;
			flagUrl = 'https://flagcdn.com/60x45/' + id.toLowerCase() + '.png';
			return flagUrl;

		}
	};

});