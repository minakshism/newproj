sap.ui.define([], function () {
	"use strict";

	return {
		/**
		 * Rounds the currency value to 2 digits
		 *
		 * @public
		 * @param {string} sValue value to be formatted
		 * @returns {string} formatted currency value with 2 digits
		 */

		getOutlookPic: function (user) {
			var Url;

			if (user === 'ANONYMOUS') {
				Url = 'img/logo.png';
			} else {

			//	Url = 'https://nam.delve.office.com/mt/v3/people/profileimage?userId=' + user.toLowerCase() + '@nvidia.com&size=L';

			}

			return Url;

		},

		getNpnflag: function (value) {
			
			return value[0].index;

		},

		getFlag: function (id) {
			var flagUrl;
		//	flagUrl = 'https://flagcdn.com/60x45/' + id.toLowerCase() + '.png';
			return flagUrl;

		}
	};

});