///////////////////////////////////////////////////////////
const schedule = require('node-schedule');
const model = require('./models/model');
var  integral = require("./models/integral.js")
model.init();

const  scheduleCronstyle = ()=>{  
    schedule.scheduleJob('30 */3 19 * * *',()=>{
        console.log('schedule 30s Cronstyle:' + new Date());
        integral.notifyAwardLuckyDraw()
    }); 
}

scheduleCronstyle();