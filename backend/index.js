const express = require("express");
const User = require("./db/user");
const Shop = require("./db/shop");
const Bill = require("./db/bill")
const cors = require("cors");
const Jwt = require("jsonwebtoken");
const { createObjectCsvStringifier } = require('csv-writer');
const archiver = require('archiver');
const Payment = require('./db/payment')
const jwtkey = "hari-om";
const app = express();
require("./db/config");
app.use(express.json());
app.use(cors({exposedHeaders: '*'}));
// const router = express.Router();

//////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////
//to register user
app.post("/register",async (req, res) => {
    let user = new User(req.body);
    let result = await user.save();
    result = result.toObject();
    delete result.password;
    Jwt.sign({ result }, jwtkey, { expiresIn: "2h" }, (err, token) => {
        if (err) {
            res.send({ result: "Something went wrong please try after some time" });
        }
        res.send({ result, auth: token });
    });
});
//to find weather user is in db or not
app.post("/login",async (req, res) => {
    if (req.body.email && req.body.password) {
        let user = await User.findOne(req.body).select("-password");
        if (user) {
            Jwt.sign({ user }, jwtkey, { expiresIn: "2h" }, (err, token) => {
                if (err) {
                    res.send({ result: "Something went wrong please try after some time", });
                }
                res.send({ user, auth: token });
            });
        } else res.send({ result: "No User Found" });
    } else {
        res.send({ result1: "Some Fields are missing" });
    }
});

/////////////////////////////////////////////////////////////////////////////
//To add a new shop in the db
app.post("/addshop", verifytoken,async (req, res) => {
    let shop = new Shop(req.body);
    let result = await shop.save();
    // result = result.toObject();
    res.send(result);
});

app.get("/shops", verifytoken,async (req, res) => {
    let shops = await Shop.find();
    if (shops.length > 0) {
        res.send(shops);
    } else {
        res.send({ result: "No Shops Found" });
    }
});

app.post("/shops", verifytoken, async (req,res)=>{
    let result = await Shop.find(req.body);
    if(result.length>0) res.send(result);
    else res.send({result : "No shop Found"});
})

app.delete("/delete/:id", verifytoken,async (req, res) => {
    let result2 = await Payment.deleteMany({ id: req.params.id });
    let result1 = await Bill.deleteMany({ shopid: req.params.id });
    let result = await Shop.deleteOne({ _id: req.params.id });
    if(result2.acknowledged && result1.acknowledged && result.acknowledged) res.send({result:"Delete done"});
});

app.get("/shop/:id", verifytoken ,async (req, res) => {
    let result = await Shop.findOne({ _id: req.params.id });
    if (result) {
        res.send(result);
    } else {
        res.send({ result: "No Shops Found" });
    }
});

app.put("/shop/:id", verifytoken ,async (req, res) => {
    let result = await Shop.updateOne({ _id: req.params.id }, { $set: req.body });
    res.send(result);
});

/////////////////////////////////////////////////////////////////////////

app.post("/addbill",verifytoken, async(req,res)=>{
    let bill = new Bill(req.body);
    let result = await bill.save();
    res.send(result);
})

app.post("/pendingbill", verifytoken, async (req,res)=>{
    let result = await Bill.find(req.body);
    if(result.length>0) res.send(result);
    else res.send({result : "No Pending bill Found"});
})

app.put("/updatebill/:id", verifytoken ,async (req, res) => {
    let result = await Bill.updateOne({ _id: req.params.id}, { $set: req.body });
    res.send(result);
});

app.delete("/delbill/:id", verifytoken,async (req, res) => {
    let result2 = await Payment.deleteMany({ billid: req.params.id });
    let result1 = await Bill.deleteMany({ _id: req.params.id });
    if(result2.acknowledged && result1.acknowledged) res.send({result:"Delete done"});
});

/////////////////////////////////////////////////////////////////////////////

app.get("/search/:key", verifytoken ,async (req, res) => {
    let result = await Shop.find({
        $or: [
            { name: { $regex: req.params.key.toUpperCase() } },
            { address: { $regex: req.params.key.toUpperCase() } },
            { mobile: { $regex: req.params.key.toUpperCase() } },
            { route: { $regex: req.params.key.toUpperCase() } },
        ],
    });
    res.send(result);
});

app.get("/profile/:id", verifytoken,async (req, res) => {
    let shop = await Shop.findOne({_id:req.params.id});
    if(shop.name){
        res.send(shop);
    } else {
        res.send({ result: "No Shops Found" });
    }
});

app.get("/backup/:name",verifytoken,async (req,res)=>{
    let data;
    let csvWriter;
    if(req.params.name=='shops'){
        data = await Shop.find();
        csvWriter = createObjectCsvStringifier({
            header: [
              { id: '_id', title: '_id' },
              { id: 'name', title: 'name' },
              { id: 'address', title: 'address' },
              { id: 'mobile', title: 'mobile' },
              { id: 'route', title: 'route' },
              { id: 'pendingamt', title: 'pendingamt' },
              { id: '__v', title: '__v' },
            ]
          });
    }
    else if(req.params.name=='bills'){
        data = await Bill.find();
        csvWriter = createObjectCsvStringifier({
            header: [
              { id: '_id', title: '_id' },
              { id: 'shopid', title: 'shopid' },
              { id: 'date', title: 'date' },
              { id: 'amount', title: 'amount' },
              { id: 'clear', title: 'clear' },
              { id: 'amountleft', title: 'amountleft' },
              { id: '__v', title: '__v' },
            ]
          });
    }else if(req.params.name=='pay'){
        data = await Payment.find();
        csvWriter = createObjectCsvStringifier({
            header: [
              { id: '_id', title: '_id' },
              { id: 'shopid', title: 'shopid' },
              { id: 'billid', title: 'billid' },
              { id: 'amount', title: 'amount' },
              { id: 'billdate', title: 'billdate' },
              { id: 'billamt', title: 'billamt' },
              { id: 'date', title: 'date' },
              { id: 'mode', title: 'mode' },
              { id: '__v', title: '__v' },
            ]
          });
    }else{
        res.send({result:"SomeThing is fishy"});
        return;
    }
    // Convert the array data to CSV format
  const csvData = csvWriter.getHeaderString() + csvWriter.stringifyRecords(data);

  // Set the response headers for file download
  res.setHeader('Content-Disposition', 'attachment; filename=data.csv');
  res.setHeader('Content-Type', 'text/csv');

  // Send the CSV data to the client
  res.send(csvData);
})

///////////////////////////////////////////////////////////////////////////

app.post("/addpayment",verifytoken ,async (req,res)=>{
    let payment = new Payment(req.body);
    let result = await payment.save();
    if(result._id) res.send(result)
    else res.send({result:"Payment error occured"})
});

app.get("/ledger/:id", verifytoken,async (req, res) => {
    let paylist = await Payment.find({shopid:req.params.id});
    if(paylist.length>0){
        res.send(paylist);
    } else {
        res.send({ result: "No Shops Found" });
    }
});
app.get("/paymenthistory/:id", verifytoken,async (req, res) => {
    let paylist = await Payment.find({billid:req.params.id});
    if(paylist.length>0){
        res.send(paylist);
    } else {
        res.send({ result: "No Shops Found" });
    }
});
app.delete("/delpaymenthistory/:id", verifytoken,async (req, res) => {
    let paylist = await Payment.deleteMany({billid:req.params.id});
    if(paylist.acknowledged){
        res.send({result:"Done"});
    } else {
        res.send({ result: "Some error" });
    }
});

////////////////////////////////////////////////////////////////////////////

function verifytoken(req,res,next){
    let token = req.headers['authorization'];
    if(token){
        token = token.split(' ')[1];
        Jwt.verify(token,jwtkey,(err,valid)=>{
            if(err) res.status(401).send({result:"Please provide valid token"})
            else next()
        })
    }else res.status(403).send({result:"Please add token with header"})
}
/////////////////////////////////////////////////////////////////////////////

const Createbackup=()=>{
    
}

/////////////////////////////////////////////////////////////////////////////

app.listen(5000);
