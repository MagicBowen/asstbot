///////////////////////////////////////////////////////////
const schedule = require('node-schedule');
const model = require('./models/model');
model.init();

var  integral = require("../models/integral.js")

const  scheduleCronstyle = ()=>{  
    schedule.scheduleJob('30 * * * * *',()=>{
        console.log('schedule 30s Cronstyle:' + new Date());
        await integral.notifyUnLoginUsers()
    }); 
}

scheduleCronstyle();