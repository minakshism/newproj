const cds = require("@sap/cds");
const ServiceHelper = require("./lib/ServiceHelper");
module.exports = cds.service.impl(async(srv) => {
	const db = await cds.connect.to("db");
	const {
		PartnerMaster
	} = srv.entities;

	const {
		PartnerComments
	} = srv.entities;

	const {
		ProductSystems
	} = srv.entities;
	const {
		ProductComments
	} = srv.entities;
	const {
		ProductGpu
	} = srv.entities;

	const {
		ProductCpu
	} = srv.entities;

	const {
		PartnerSalesrep
	} = srv.entities;

	const {
		PartnerMapping
	} = srv.entities;

	const Helper = new ServiceHelper({
		db: db
	});

	/* Auto populated fields for Partner Master in CREATE method  */
	srv.before("CREATE", PartnerMaster, async(context) => {

		/* Generate next Partner ID from SEQUENCE  */
		var name = context.user.id;
		context.data.creation_by = name.toUpperCase();
		/*context.data.state_country_id = context.data.country_id;*/
		context.data.code = context.data.old_reporter_id = context.data.id = await Helper.getNextPartnerNumber("PARTNER_ID");
		context.data.creation_date = await Helper.getToday();
		if (context.data.rp_flag === true) {
			context.data.is_rp = 'true';
			context.data.rp_onboarding_date = await Helper.getToday();
		}

		if (context.data.rp_flag === false) {
			context.data.is_rp = 'false';
		}

	});

	srv.before("CREATE", PartnerComments, async(context) => {
		var name = context.user.id;
		context.data.user = name.toUpperCase();
		context.data.inserttime = await Helper.getCurrentTime();
		context.data.commentby = await Helper.getCurrentUserName(context.data.user);

	});

	srv.before("CREATE", ProductCpu, async(context) => {
		var name = context.user.id;
		context.changed_by = context.data.created_by = name.toUpperCase();
		context.data.changed_on = context.data.created_on = await Helper.getCurrentTime();

	});

	srv.before("UPDATE", ProductCpu, async(context) => {
		var name = context.user.id;
		context.changed_by = name.toUpperCase();
		context.data.changed_on = await Helper.getCurrentTime();

	});

	srv.before("CREATE", ProductGpu, async(context) => {
		var name = context.user.id;
		context.changed_by = context.data.created_by = name.toUpperCase();
		context.data.changed_on = context.data.created_on = await Helper.getCurrentTime();

	});

	srv.before("UPDATE", ProductGpu, async(context) => {
		var name = context.user.id;
		context.changed_by = name.toUpperCase();
		context.data.changed_on = await Helper.getCurrentTime();

	});

	srv.before("CREATE", ProductComments, async(context) => {
		var name = context.user.id;
		context.data.user = name.toUpperCase();
		context.data.inserttime = await Helper.getCurrentTime();
		context.data.commentby = await Helper.getCurrentUserName(context.data.user);

	});

	srv.before("CREATE", PartnerMapping, async(context) => {
		var name = context.user.id;
		context.data.created_by = name.toUpperCase();
		context.data.changed_by = name.toUpperCase();
		context.data.changed_on = context.data.created_on = await Helper.getCurrentTime();

		if (context.data.is_person === true) {
			context.data.is_person_char = 'true';
		}

		if (context.data.is_person === false) {
			context.data.is_person_char = 'false';
		}
	});

	srv.before("UPDATE", PartnerMapping, async(context) => {
		var name = context.user.id;
		context.data.changed_by = name.toUpperCase();
		context.data.changed_on = new Date();

		if (context.data.is_person === true) {
			context.data.is_person_char = 'true';
		}

		if (context.data.is_person === false) {
			context.data.is_person_char = 'false';
		}

	});

	srv.before("CREATE", ProductSystems, async(context) => {
		var name = context.user.id;
		context.data.created_by = name.toUpperCase();
		context.data.changed_by = name.toUpperCase();
		context.data.changed_on = context.data.created_on = await Helper.getCurrentTime();

	});

	srv.before("UPDATE", ProductSystems, async(context) => {
		var name = context.user.id;
		context.changed_by = name.toUpperCase();
		context.data.changed_on = await Helper.getCurrentTime();

	});

	/* Auto populated fields for Partner Master in UPDATE method  */
	srv.before("UPDATE", PartnerMaster, async(context) => {
		if (context.data.rp_flag === true) {
			context.data.is_rp = 'true';
			context.data.rp_onboarding_date = await Helper.getCurrentTime();
		}

		if (context.data.rp_flag === false) {
			context.data.is_rp = 'false';
		}

		if (context.data.active === false) {
			context.data.deactivation_date = await Helper.getCurrentTime();
		}

	});

	srv.on("READ", "UserScopes", async(req) => {
		var userDetails = "";
		if (req.user.id.toUpperCase() === "TRINITYADMIN") {
			userDetails = [{
				username: req.user.id.toUpperCase(),
				empid: "00001111",
				employee_nt_id: req.user.id.toUpperCase(),
				knownas: "TRINTIYADMIN",
				first_name: "TRINTIY",
				last_name: "ADMIN",
				department: "TEST",
				country: "US",
				is_trinityadmin: req.user.is("trinityadmin"),
				is_trinityenduser: req.user.is("trinityuser"),
				is_trinityproductadmin: req.user.is("is_trinityproductadmin"),
				is_trinityproductuser: req.user.is("is_trinityproductuser"),
			}, ];

		} else if (req.user.id.toUpperCase() === "TRINITYUSER") {
			userDetails = [{
				username: req.user.id.toUpperCase(),
				empid: "00002222",
				employee_nt_id: req.user.id.toUpperCase(),
				knownas: "TRINTIYUSER",
				first_name: "TRINTIY",
				last_name: "USER",
				department: "TEST",
				country: "US",
				is_trinityadmin: req.user.is("trinityadmin"),
				is_trinityenduser: req.user.is("trinityuser"),
				is_trinityproductadmin: req.user.is("is_trinityproductadmin"),
				is_trinityproductuser: req.user.is("is_trinityproductuser"),
			}, ];

		} else {

			const user = await SELECT.one(PartnerSalesrep).where({
				employee_nt_id: req.user.id.toUpperCase()
			})

			userDetails = [{
				username: req.user.id.toUpperCase(),
				empid: user.empid,
				employee_nt_id: user.employee_nt_id,
				knownas: user.knownas,
				first_name: user.first_name,
				last_name: user.last_name,
				department: user.department,
				country: user.country,
				is_trinityadmin: req.user.is("trinityadmin"),
				is_trinityenduser: req.user.is("trinityuser"),
				is_trinityproductadmin: req.user.is("is_trinityproductadmin"),
				is_trinityproductuser: req.user.is("is_trinityproductuser"),
			}, ];

		}
		return userDetails;

	});

});