//express with Node js  && API:
      require('dotenv').config()
      const express = require("express");
      const app = express();
      const bodyParser = require("body-parser")
      var md5 = require('md5');
      
      //mailchimp module
      const mailchimp = require("@mailchimp/mailchimp_marketing");
      const { response } = require("express");
      
      //body parser
      app.use(bodyParser.urlencoded({extended : true})); 
      
      //public folder storing static info:css, images
      app.use(express.static("public")); 
      
        app.get("/", function(req, res){  
            res.sendFile(__dirname + "/Signup.html")
          });
          
          //setting up mailchimp
          mailchimp.setConfig({
            
          apiKey: process.env.API_KEY,
          server: process.env.SERVER
        });
        app.post("/", function(req, res){
          
          const fname = req.body.fname;
          const lname = req.body.lname; 
          const email = req.body.email;
          const subscribingUser={
            lname:lname,
            fname:fname,
            email:email
          }
          
      async function run(){
          const response= await mailchimp.lists.addListMember(process.env.LIST_ID, {
      email_address: subscribingUser.email,
      status:"subscribed",
      merge_fields: {
        FNAME: subscribingUser.fname,
        LNAME: subscribingUser.lname}
      });
        //if all goes well move to :
        res.sendFile(__dirname + "/success.html");
      console.log( `Successfully added contact as an audience member. The contact's id is ${
        response.id
      }.`
      );
      }
      //Running the function and catching the errors (if any)
          // So the catch statement is executed when there is an error so if anything goes wrong the code in the catch code is executed. In the catch block we're sending back the failure page. This means if anything goes wrong send the faliure page
          run().catch(e => res.sendFile(__dirname + "/failure.html"));
          
        });
        app.listen(process.env.PORT || 3000, function(){
               console.log("server is running on port 3000");
            });


