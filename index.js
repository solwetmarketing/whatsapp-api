const express = require("express");
const body_parser = require("body-parser");
const axios=require(axios);
require('dotenv').config()
const app=express().use(body_parser.json());

const token=process.env.TOKEN;
const mytoken=process.env.MYTOKEN;

app.listen(8000||process.env.PORT,()=>{
    console.log("webhook is listening");
});

app.get("/webhook",(req,res)=>{
    let mode=req.query["hub.mode"];
    let challange=req.query["hub.challenge"];
    let token=req.query["hub.verify_token"];

    const mytoken="solwet";

    if(mode && token){

        if(mode==="subscribe" && token===mytoken){
            res.status(200).send(challange);
        }else{
            res.status(403);
        }

    }

});

app.post("/webhook",(req,res)=>{

    let body_param=req.body;

    console.log(JSON.stringify(body_param,null,2));

    if(body_param.object){
        if(body_param.entry &&
            body_param.entry[0].changes &&
            body_param.entry[0].changes[0].value.message &&
            body_param.entry[0].changes[0].value.message[0]
        ){
            let phon_no_id=body_param.entry[0].changes[0].value.metadata.phone_number_id;
            let from = body_param.entry[0].changes[0].value.message[0].from;
            let msg_body = body_param.entry[0].changes[0].value.message[0].text.body;

            axios({
                method:"post",
                url:"https://graph.facebook.com/v22.0/"+phon_no_id+"/messages?access_token="+token,
                data:{
                    messaging_product:"whatsapp",
                    to:from,
                    text:{
                        body:"hello, welcome to solwet marketing pvt ltd"
                    }
                },
                headers:{
                    "Content-Type":"application/json"
                }
            });

            res.sendStatus(200);
        }else{
            res.sendStatus(404);
        }
    }
});
