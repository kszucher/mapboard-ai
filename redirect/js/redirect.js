var express = require('express')
var app = express();

app.use("/",function (req,res) {
    res.redirect("https:/mapboard.io/");
});
