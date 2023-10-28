module.exports = class ServiceHelper {
	constructor(options) {
		this.db = options.db;

	}

	getNextPartnerNumber(sequence) {
		return new Promise((resolve, reject) => {
			let nextNumber = 0;

			var query = 'SELECT cast(' + sequence + '.NEXTVAL as nvarchar(10) ) as "NEXTVAL" FROM DUMMY';
			this.db.run(query)
				.then(result => {
					nextNumber = result[0]['NEXTVAL'];
					resolve(nextNumber);
				})
				.catch(error => {
					reject(error);
				});

		});
	}

	getCurrentUser() {
		return new Promise((resolve, reject) => {
			let User = '';

			var query = 'SELECT UPPER( SESSION_CONTEXT(\'APPLICATIONUSER\')) as "USER" FROM DUMMY';
			this.db.run(query)
				.then(result => {
					User = result[0]['USER'];
					resolve(User);
				})
				.catch(error => {
					reject(error);
				});

		});
	}

	getCurrentUserName(user) {
		return new Promise((resolve, reject) => {
			let Name = 'Anonymous';

			var query = 'SELECT KNOWNAS  as "USERNAME" FROM PARTNER_SALESREP WHERE  EMPLOYEE_NT_ID = ' + '\'' + user + '\'';
			this.db.run(query)
				.then(result => {
					Name = result[0]['USERNAME'];
					resolve(Name);
				})
				.catch(error => {
					resolve(Name);
				});

		});
	}

	getCurrentTime() {
		return new Promise((resolve, reject) => {
			let Time = '';

			var query = 'SELECT current_timestamp as "TIMESTAMP" FROM DUMMY';
			this.db.run(query)
				.then(result => {
					Time = result[0]['TIMESTAMP'];
					resolve(Time);
				})
				.catch(error => {
					reject(error);
				});

		});
	}

	getToday() {
		var today = new Date();
		var dd = String(today.getDate()).padStart(2, '0');
		var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
		var yyyy = today.getFullYear();
		today = yyyy + '-' + mm + '-' + dd;
		return today;
	}
};