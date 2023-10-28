 namespace partner;
using { geo } from '../db/country-model';
using { product } from '../db/product-model';
using { lov } from '../db/lov-model';
 entity Master{
        key id      							 : String(10) @title:'Partner ID'  @readonly;
            old_reporter_id                      : String(10) @readonly;
            code                        		 : String(10)  @title:'Partner Code'@readonly;
            name                                 : String(256) @title:'Partner Name' @mandatory;
            address_first                        : String(256) @title:'Address 1';
            address_second                       : String(256) @title:'Address 2';
            city                                 : String(256) @title:'City';
            state                                : Association to geo.States @title:'State';
            postal_code                          : String(10) @title:'Postal Code';
            country                              : Association to geo.Country @title:'Country' @mandatory;
            active                               : Boolean @title:'Partner Status';
            rp_flag                              : Boolean @title:'Reporting Partner';
            ec_flag                              : Boolean @title:'End Customer' ;
            is_rp                                : String(10) @readonly;
            production_date                      : Date @title:'Production Date';
            signed_loa_date                      : Date;
            pos_data_flag                        : Boolean;
            pos_test_file_date                   : Date;
            hist_date_req                        : Date;
            test_file_date_req                   : Date;
            inv_test_file_date                   : Date;
            hist_date_recv                       : Date;
            creation_date                        : Date  @readonly;
            creation_by                          : String(256)  @readonly;
            deactivation_date                    : Date;
            rp_onboarding_date                   : Date  ;
            nv_sales_rep                         : Association to Salesrep @title:'Consumer salesrep';
            contact_name_main                    : String(256) @title:'Consumer Contact Details';
            contact_phone_main                   : String(256) @title:'Consumer Contact phone ';
            contact_email_main                   : String(256) @title:'Consumer Contact email';
            contact_name_secondary               : String(256) @title:'Enterprise Contact Details';
            contact_phone_secondary              : String(256) @title:'Enterprise Contact phone';
            contact_email_secondary              : String(256) @title:'Enterprise Contact email';
            other_info                  		 : String(500);
            dummy                                : String(10) @readonly;
            valid_from                      	 : Timestamp  @readonly;
            valid_to                             : Timestamp  @readonly;
            comments							 : Association to many Comments on comments.partner = $self;
            authorized_flag						 : Boolean @title:'Authorized Flag';
            quarantine_flag						 : Boolean @title:'Quarantine Flag';
            inv_adjust_flag						 : Boolean @title:'inv_adjust Flag';
            on_hold_flag						 : Boolean @title:'On Hold Flag';
            is_person							 : String(10) @readonly;
            ec_fuzzy_config						 : String(256);
            product_fuzzy_config				 : String(256);
            ec_fuzzy_config_person				 : String(256);
            product_mapping_message              : String(256);
            is_npn								 : Boolean @title : 'Enterprise Partners';
            is_consumer							 : Boolean @title : 'Consumer partners Partners';
            npn                                  : Association to Sfdc_Account ;
            sfdc_account                         : Association to many Sfdc_Account on sfdc_account.reporter_id = old_reporter_id ;
            classifications						 : Association to many Classification on classifications.partner = $self;
           
          
    };
    
 entity Master_History{
            id      							 : String(10);
            old_reporter_id                      : String(10) @readonly;
            code                        		 : String(10);
            name                                 : String(256);
            address_first                        : String(256);
            address_second                       : String(256);
            city                                 : String(256);
            state                                : Association to geo.States;
            postal_code                          : String(10);
            country                              : Association to geo.Country;
            active                               : Boolean;
            rp_flag                              : Boolean;
            is_rp                                : String(10) @readonly;
            ec_flag                              : Boolean;
            production_date                      : Date;
            signed_loa_date                      : Date;
            pos_data_flag                        : Boolean;
            pos_test_file_date                   : Date;
            hist_date_req                        : Date;
            test_file_date_req                   : Date;
            inv_test_file_date                   : Date;
            hist_date_recv                       : Date;
            creation_date                        : Date;
            creation_by                          : String(256)  ;
            deactivation_date                    : Date;
            rp_onboarding_date                   : Date  ;
            nv_sales_rep                         : Association to Salesrep @title:'Consumer salesrep' ;
            contact_name_main                    : String(256) @title:'Consumer Contact Details';
            contact_phone_main                   : String(256) @title:'Consumer Contact phone ';
            contact_email_main                   : String(256) @title:'Consumer Contact email';
            contact_name_secondary               : String(256) @title:'Enterprise Contact Details';
            contact_phone_secondary              : String(256) @title:'Enterprise Contact phone';
            contact_email_secondary              : String(256) @title:'Enterprise Contact email';
            other_info                  		 : String(500);
             dummy                               : String(10) @readonly;
            valid_from                      	 : Timestamp not null;
            valid_to                             : Timestamp not null;
            authorized_flag						 : Boolean @title:'Authorized Flag';
            quarantine_flag						 : Boolean @title:'Quarantine Flag';
            inv_adjust_flag						 : Boolean @title:'inv_adjust Flag';
            on_hold_flag						 : Boolean @title:'On Hold Flag';
            is_person							 : String(10);
            ec_fuzzy_config						 : String(256);
            product_fuzzy_config				 : String(256);
            ec_fuzzy_config_person				 : String(256);
            product_mapping_message              : String(256);
            is_npn								 : Boolean @title : 'Enterprise Partners';
            is_consumer							 : Boolean @title : 'Consumer partners Partners';
            npn                                  : Association to Sfdc_Account ;
           
          
    };
    
 @cds.odata.valuelist
 entity Channel_type {
        key id          						: String(10);
            description 						: String(256);
    };

 @cds.odata.valuelist
 entity Channel_program {
        key id          						: String(10);
            description 						: String(256);
    };

 entity Comments {
        key id          						: UUID;
            partner     						: Association to Master @mandatory;
            comment     						: LargeString @mandatory;
            user        						: String(256) @readonly;
            commentby   						: String(256) @readonly;
            emailsubject						: String(256);
            inserttime  						: Timestamp @readonly;
    };
    
 @assert.unique: {
  	classification_id: [ partner,sys_platform]
}
 entity Classification {
        key id          							: UUID;
            partner     							: Association to Master @mandatory;
            sys_platform							: Association to lov.Platform @mandatory;
            channel_type_main          				: Association to Channel_type;
            channel_program_main     				: Association to Channel_program;
            channel_level_main						: Integer;
            channel_type_secondary     				: Association to Channel_type;
            channel_program_secondary				: Association to Channel_program;
            channel_level_secondary					: Integer;
            
           
           
    };
    
 @cds.odata.valuelist
 @cds.persistence.exists
 entity Salesrep {
        key empid          						: String(8);
            employee_nt_id     					: String(30);
            knownas                             : String(256);
            first_name     						: String(256);
            last_name        					: String(256);
            department   						: String(256);
            country						        : String(30);
         
    };
    
 @cds.persistence.exists
 entity Sfdc_Account { 
         key id     				: String(18);
             npn_account_name		: String(256);
             reporter_id			: String(50);
             portal_access			: Boolean;
             address				: String(256);
             city					: String(40);
             state					: String(80);
             postal_code			: String(20);
             country				: String(80);
             npn_pbm            	: String(121);
             npn_agreement_date 	: Timestamp;
             npn_partner_competency : String(255);
             
           
    	
    };
 
 @cds.search : {reporting_partner,reported_country,end_customer}   
 @assert.unique: {
  	mapping_id: [ reporting_partner,reported_name,reported_city,reported_state,reported_country, reported_postal_code ]
}
 entity ec_mapping {
		key id							: UUID;
		reporting_partner       		: Association to Master @mandatory;
		reported_name           		: String(256);
		reported_address_first      	: String(256);
		reported_address_second     	: String(256);
		reported_city           		: String(256);
		reported_state          		: String(256);
        reported_country        		: Association to geo.Country @title:'Country' ;
        reported_postal_code    		: String(50)	@title:'Postal Code';
        end_customer            		: Association to Master;
        assigned_to             		: Association to Salesrep;
        on_hold                         : Boolean;
        is_person						: Boolean;
        is_person_char                  : String(10) @readonly;
        created_by             		    : String(256)	@readonly;
        created_on       	    		: Timestamp 	@readonly;
        changed_by              		: String(256)	@readonly;
        changed_on       	    		: Timestamp 	@readonly;
       	valid_from                      : Timestamp not null @readonly;
        valid_to                    	: Timestamp  not null @readonly;
	
	};
	
 
   
 entity ec_mapping_History {
		id								: UUID;
		reporting_partner       		: Association to Master @mandatory;
		reported_name           		: String(256);
		reported_address_first      	: String(256);
		reported_address_second     	: String(256);
		reported_city           		: String(256);
		reported_state          		: String(256);
        reported_country        		: Association to geo.Country @title:'Country' ;
        reported_postal_code    		: String(50)	@title:'Postal Code';
        end_customer            		: Association to Master;
        assigned_to             		: Association to Salesrep;
        on_hold                         : Boolean;
        is_person						: Boolean;
        is_person_char                  : String(10) @readonly;
        created_by             		    : String(256)	@readonly;
        created_on       	    		: Timestamp 	@readonly;
        changed_by              		: String(256)	@readonly;
        changed_on       	    		: Timestamp 	@readonly;
       	valid_from                      : Timestamp  @readonly;
        valid_to                    	: Timestamp  @readonly;

	
	}; 
	
 @cds.persistence.exists
 entity Mapping_Summary{
		category         				:	String(25);
	    new                             :   Integer;
	    on_hold							:   Integer;								
	
	 };	
	 
@cds.persistence.exists
 entity Mapping_Assign{
		category         				:	String(256);
	    nala                             :   Integer;
	    apac                             :   Integer;
	    emea                             :   Integer;
	    total                            :   Integer;
	 };		 
	 
 entity ec_fuzzy_config{
      key ec_fuzzy_config_id	: String(256);
 	  key fuzzy_field			: String(256);
 	      fuzzy_accuracy		: Decimal(2,1);
 	      fuzzy_config			: String(500);
 	      fuzzy_weight			: Decimal(2,1);
 	      
 	
 };
 entity ec_mapping_stg{
		key MANDT :String(3)  ;
		key	CHANNELPARTNER :String(10)  ;
		key	REPORTEDNAME :String(40)  ;
		key	REPORTEDCITY :String(40)  ;
		key	REPORTEDSTATE :String(3)  ;
		key	REPORTEDCOUNTRY :String(3) ;
		key	REPORTEDZIPCODE :String(10)  ;
			REPORTEDSTREET :String(60) ;
			REPORTEDSTREET2 :String(40) ;
			MASSAGEDNAME :String(40) ;
			MASSAGEDCITY :String(40) ;
			MASSAGEDSTATE :String(3) ;
			MASSAGEDCOUNTRY :String(3) ;
			MASSAGEDZIPCODE :String(10) ;
			CHNLPARTNERNAME :String(40) ;
			INTERNALENDCUST :String(10) ;
			INTERNALCUSTNAME :String(40) ;
			CREATEDON :Timestamp ;
		 	CREATEDBY :String(12) ;
			CHANGEDON :Timestamp ;
			CHANGEDBY :String(12);  
    };
   
entity legacy_data{
		 CRM_PARTNER_ID : String(10);
		 FLAG	: String(10);
    };
   