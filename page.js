var express = require("express"),
     mongoose=require("mongoose"),
    passport=require("passport"),
    bodyParser=require("body-parser"),
    
    LocalStartegy=require("passport-local"),
    passportLocalMongoose=require("passport-local-mongoose");
 const dotenv= require('dotenv');
 dotenv.config();
   
    
mongoose.connect("mongodb://localhost/ngo_app", { useNewUrlParser: true, useUnifiedTopology: true  });




var page=express();
page.set("view engine" , "ejs");
page.use(express.static("public"));
page.use(bodyParser.urlencoded({extended: true}));
page.use(require("express-session")({
   secret: "This will be our login page",
   resave: false,
   saveUninitialized: false
}));
 

page.use(passport.initialize());
page.use(passport.session());

////////////////////////////////////////////////schema//////////////////////////////////////////////////////////////////
 


 const ServiceSchema= new mongoose.Schema({
 
 	NameOfService : String,
 	location : String,
 	Date : Date,	
 	Volunteers: {
 		type: mongoose.Schema.Types.ObjectId,
 		ref : 'User'
 	},
 	description : String,
 	amount: Number

 });
var UserSchema=new mongoose.Schema({
	username:String,
	password:String,
	email: String,
	Name: String,
	Phoneno:Number,
	role : {
		type : String,
		enum : ['restricted','admin'],
		default : 'restricted'
	}
});
UserSchema.plugin(passportLocalMongoose);

var BudgetSchema= new mongoose.Schema({
	name : String,
	expenditure : Number,
	income : Number,
	Balance : Number
});

var ColloborationSchema = new mongoose.Schema({
	NameOfOrganisation : String,
	Description: String,
    ReasonForPartnership:String,
    Location:String
});

var VolunteerSchema=new mongoose.Schema({
	Fullname: String,
	Mobile: Number,
	Email: String,
	DOB: Date,
    Location:String
     });

var EmployeeSchema=new mongoose.Schema({
	Fullname:String,
	Occupation:String,
	Designationreq:String,
    Mobile:Number,
    Email:String
});
var DonatorSchema=new mongoose.Schema({
	Name:String,
	Phoneno:Number,
	Email:String,
	Country:String,
	City:String,
	WouldLikeTo:String,
	Amount:Number
});
const faqSchema=new mongoose.Schema({
	question : String,
	description: String,
	answer : Array
})


ServiceSchema.index({NameOfService : 'text'});
/////////////////////////////////////////////////////////////global variables////////////////////////////////////////////


var user = "me" ;




/////////////////////////////////////////////////////////////////models////////////////////////////////////////////////////
const User= mongoose.model("User", UserSchema);

const Service= mongoose.model("Service", ServiceSchema);

const Donator=  mongoose.model("Donator", DonatorSchema);

const  Budget= mongoose.model("Budget", BudgetSchema);

const Colloboration= mongoose.model("Colloboration", ColloborationSchema);

const Volunteer=mongoose.model("Volunteer",VolunteerSchema);

const Employee=mongoose.model("Employee",EmployeeSchema);

const  faq=mongoose.model("faq", faqSchema) ;



//////////////////////////////////////////////////////get requests////////////////////////////////////////////////////////

page.get("/" ,function(req, res){
	res.redirect("/home");
});

page.get("/home",function(req,res)
{
	var user=req.user;
	res.render("index",{ user : user});
});
page.get("/contact",function(req,res)
{
	res.render("contact");
});
page.get("/vol",isLoggedIn,function(req,res)
{
	res.render("vol");
});

page.get("/join",isLoggedIn,function(req,res)
{
   	res.render("join");

});

page.get("/budget",function(req,res)
{
	res.render("budget");
})
page.get("/register",function(req,res)
{
	res.render("register");
});

page.get("/col",isLoggedIn,function(req,res)
{
	res.render("col");
});

page.get("/tq",isLoggedIn,function(req,res)
{
	res.render("tq");
});

page.get("/tq2",isLoggedIn,function(req,res)
{
	res.render("tq2");
});

page.get("/emp",isLoggedIn,function(req,res)
{
	res.render("emp");
});

page.get("/don",isLoggedIn,function(req,res)
{
	res.render("don");
});

page.get("/services",isLoggedIn, function(req,res){
	Service.find({}, function(err, services){
		if(err){
			console.log(err);
		} else{
			res.render("services", {services: services});
		}
	})
})

page.get("/addservice",isLoggedIn,function(req,res){
	if(req.user.role== "admin"){
		res.render("addservices");
	}else{
		res.send("only admins can access")
	}
	
});


page.get("/faq", function(req ,res){

	faq.find({}, function(err, faqs){
		if (err) {
			console.log(err)
		}else{
			res.render("allfaqs",{faqs : faqs});
		}
	})

	
});


page.get("/login",function(req,res){
	res.render("login");
});


page.get("/faq/:id", function(req, res){

	faq.findById( req.params.id, function(err , faq){
		if(err){
			console.log(err);
		}else{
			res.render("faq", { faq : faq });

		}
	});
	
});

page.get("/logout",function(req,res){
	req.logout();
	res.redirect("/home");
})

page.get("/addvolevent/:id",function(req,res){
	Volunteer.find({ Email : req.user.email},function(err, Volunteer){
		Service.findByIdAndUpdate(req.params.id, {'$push' :  {Volunteers : Volunteer._id }}, function(err, success){
			if(err){
				console.log(err);
			}else{
				res.render("appliedServices",{ Volunteer : Volunteer,
					service : service });
			}
		});

	});
});


page.get("/services/:id", function(req, res){

Service.findById(req.params.id, function(err , service){
	if(err){
		console.log(err);
	}else{
		res.render("serviceInfo",{ service : service });
	}
})
});


/////////////////////////////////////////////////post request///////////////////////////////////////////

page.post( "/register",function(req,res)
{
	User.register(new User({
		username: req.body.username,
		name:req.body.name,
		email: req.body.email,
	    Phoneno:req.body.Phoneno
	})
	,req.body.password,function(err,user){
		if(err){
			console.log(err);

			return res.render('register');
		}
		if (user.username== process.env.ADMIN) {
			User.findOneAndUpdate({_id : user._id},{ '$set' : { role : 'admin'}}, function(err){
				if(err){
					console.log(err);
				}
			});
		}
		passport.authenticate("local")(req,res,function(){

			res.redirect("/join");
		})
	})
});


page.post("/services", function(req, res){
var ServiceData= new Service({
		NameOfService: req.body.name,
		location : req.body.location,
		description : req.body.description,
 	    amount: req.body.amount,
 	    Date: req.body.date
 	});
 	ServiceData.save(function(err){
 		 if(!err){
      res.redirect("/services");
      }
      else{
     console.log(err);
    }
})
});

page.post("/vol",function(req,res)
{
var VolunteerData=new Volunteer({
	Fullname:req.body.fullname,
	Mobile:req.body.mobile,
	Email:req.body.email,
    DOB:req.body.dob,
    Location:req.body.location
})
VolunteerData.save(function(err){
 		 if(!err){
      res.redirect("/tq2");
      }
      else{
     console.log(err);
    }
})
});


page.post("/col",function(req,res)
{
	var ColloborationData=new Colloboration({
      NameOfOrganisation:req.body.nameoforganisation,
      Description:req.body.description,
      ReasonForPartnership:req.body.reasonforpartnership,
      Location:req.body.location
	})
	ColloborationData.save(function(err){
		if(!err){
			res.render("tq2");
		}
		else{
			console.log(err);
		}
	})
});

page.post("/emp",function(req,res)
{
	var EmployeeData=new Employee({
		Fullname:req.body.fullname,
		Occupation:req.body.occupation,
		Designationreq:req.body.designationreq,
		Mobile:req.body.mobile,
		Email:req.body.email
	})
	EmployeeData.save(function(err){
		if(!err){
			res.render("tq");
		}
		else
		{
			console.log(err);
		}
	})
});

page.post("/don",function(req,res)
{
	var DonatorData=new Donator({
	   Name:req.body.name,
	   	Phoneno:req.body.phoneno,
	   	Email:req.body.email,
	   	Country:req.body.country,
	   	City:req.body.city,
	   	WouldLikeTo:req.body.exampleRadios1,
	   	Amount:req.body.amount
	})
	DonatorData.save(function(err){
		if(!err){
			res.render("tq");
		}
		else
		{
			console.log(err);
		}
	})
});


page.post("/addfaq", function(req,res){
	var faqData=new faq({
		question: req.body.question
	});

	faqData.save(function(err){
		if (err) {
			console.log(err);
		}else{
			res.redirect("/faq");
		}
	})
});

page.post("/addans",function(req, res){
	faq.findOneAndUpdate({ _id :req.body.faqId }, {
		"$push" : {
			answer : req.body.answer
		}
	}, function(err,faq){
		if (err) {
			console.log(err);

		}else{
			var site="/faq/"+faq._id;
			res.redirect(site);
		}
			
			});

});


page.post("/searchservices", function(req,res){
  Service.find({"$text" : {
    "$search" : req.body.search
  }}).populate('Volunteer').exec(function(err,services){
    console.log(services);
    if(err){
      alert("No service found");
    }else{
      res.render("services", {
        services : services
      });
    }
  });
});


page.post("/login",passport.authenticate("local",{
failureRedirect: "/login"
}),function(req,res){

	if(req.user.role=="admin"){
		res.redirect("/home");
	}else{
		res.redirect("/join");
	}

});
///////////////////////////////////////functions///////////////////////////////////////////////////////////////////

function isLoggedIn(req,res,next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
}




page.listen(3000,function(){
console.log("Server started");
});
passport.use(new LocalStartegy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());