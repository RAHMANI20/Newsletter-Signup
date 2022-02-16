const express = require("express");
// we use the body-parser to grab the data from the form
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();

// we are going to keep public folder as static folder
// we are goint to place all my static files inside public
// by using app.use...("public") : we are providing the path of our static files
// then we should be able to refer to our static files by a relative url : imagining tha we are iside the folder public 
app.use(express.static("public"))

// tell the app to use the method urlencode of our body-parser when we get a post request
// that allow us to grab the data form
app.use(bodyParser.urlencoded({extended:true}));

app.get("/",(req,res) => {
    res.sendFile(__dirname+"/signup.html");
})

app.post("/",(req,res) => {

    const firstName = req.body.fname;
    const lastName = req.body.lname;
    const email = req.body.email;

    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields:{
                    FNAME: firstName,
                    LNAME: lastName
                }

            }
        ]
    };

    const jsonData = JSON.stringify(data);
    
    const url = "https://us14.api.mailchimp.com/3.0/lists/35ea6d1bea";

    const options = {
        method: "POST",
        auth: "faical16:78cb48e5bbcbb7c676bc9a9e87d79c33-us14"
    }

    const request = https.request(url,options,function(response){

        if (response.statusCode === 200 ){
           res.sendFile(__dirname + "/success.html");
        }else{
           res.sendFile(__dirname + "/failure.html");
        }
        response.on("data", function(data){
            console.log(JSON.parse(data));
        })
    })

    request.write(jsonData);
    request.end();
})

app.post("/failure",function(req,res){
    res.redirect("/");
})




app.listen(process.env.PORT || 3000 ,() => {
    console.log("server is listening on port 3000");
})

//78cb48e5bbcbb7c676bc9a9e87d79c33-us14
// listid : 35ea6d1bea




