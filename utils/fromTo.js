const moment = require("moment");

let from=0
let to=0
const fromTo=(type)=>{
    switch(type){
        case "day":
             from=moment().subtract(0,'d')
             to=moment().subtract(1,'d')
             return {from,to};
        case "week":
             from=moment().subtract(0,'d')
             to=moment().subtract(6,'d')
            return {from,to};
        case "month":
             from=moment().subtract(0,'month')
             to=moment().subtract(1,'month')
            return {from,to};
        case "6month":
             from=moment().subtract(0,'month')
             to=moment().subtract(5,'month')
            return {from,to};    
        case "year":
             from=moment().subtract(0,'year')
             to=moment().subtract(1,'year')
            return {from,to};    
    }
}
module.exports={fromTo}