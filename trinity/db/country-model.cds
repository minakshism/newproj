namespace geo;

@cds.odata.valuelist
entity	Country  {
  key	id					:	String(3) @mandatory;
		country_iso 		:	String(3);
		country_name		:	String(255) @mandatory	;
		country_grouping	:	Association to Grouping ;
		territory			:	Association to Territory ;
		sub_region			:	Association to Sub_Region ;
		region				:	Association to Region ;
		market_economy		:	Association to Market_Economy ;
		state				:	Association to many States on state.country = $self;
		vat					:	Association to many country_vat on vat.country = $self;
		};

@assert.unique: {
  	sys_model_no: [ country ]
}
entity country_vat {
  key	id          		:	UUID;
        country 			:	Association to Country;
		std_vat_rate		:	Decimal(10,2);
		reduced_vat_rate	:	Decimal(10,2);
		valid_from          :	Timestamp  @readonly;
        valid_to        	:	Timestamp  @readonly;
 
};

entity country_vat_history {
        id          		:	UUID;
    	country				:	Association to  Country;
		std_vat_rate		:	Decimal(10,2);
		reduced_vat_rate	:	Decimal(10,2);
		valid_from         	:	Timestamp not null;
        valid_to            :	Timestamp not null;
 
};

@cds.odata.valuelist
entity States {
  key	id					:	String(10);
		description			:	String(255);
		country 			:	Association to Country;
 
};

@cds.odata.valuelist
entity	Territory {
    key id  				:	String(3);
        description 		:	String(256) ;
        country				:	Association to many Country on country.territory = $self;
};

@cds.odata.valuelist
entity  Grouping {
     key id  				:	String(4);
        description 		:	String(256);
        country				:	Association to many Country on country.country_grouping = $self;
};

@cds.odata.valuelist
entity Sub_Region {
    key id  				:	String(20);
        description 		:	String(256);
        country				:	Association to many Country on country.sub_region = $self;
};

@cds.odata.valuelist
entity Region {
    key id  				:	String(20);
        description 		:	String(256);
        country				:	Association to many Country on country.region = $self;
};

@cds.odata.valuelist
entity Market_Economy {
     key	id  			:	String(20);
        	description 	:	String(256);
        	country			:	Association to many Country on country.market_economy = $self;
};









