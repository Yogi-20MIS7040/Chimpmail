const express = require("express");
const bodyparser = require("body-parser");
const request = require("request");
const https = require("https");
const apiKey = process.env.API_KEY;

const app = express();

app.use(bodyparser.urlencoded({ extended: true }));

app.use(express.static("pulblic"));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function (req, res) {
  var inputEmail = req.body.Email;
  var inputFirstName = req.body.Firstname;
  var inputLastName = req.body.Lastname;

  var data = {
    members: [
      {
        email_address: inputEmail,
        status: "subscribed",
        merge_fields: {
          FNAME: inputFirstName,
          LNAME: inputLastName,
        },
      },
    ],
  };

  var jsonData = JSON.stringify(data);

  const url = "https://us21.api.mailchimp.com/3.0/lists/bd8886e5c1";

  const options = {
    method: "POST",
    auth: `yogi:${apiKey}`,
  };

  const request = https.request(url, options, function (response) {
    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    }

    response.on("data", function (data) {
      console.log(JSON.parse(data));
    });
  });

  request.write(jsonData);
  request.end();
});


app.post('/failure', function (req, res){
  res.redirect('/');
});


app.listen(process.env.PORT|| 3000, function (res) {
  console.log("listening on 8080");
});

// 485f51de590f2cc0094c632d8a65886f-us21

//bd8886e5c1
