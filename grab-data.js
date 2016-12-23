module.exports = (function(){
  "use strict";
  var TDXApi = require("nqm-api-tdx");
  const debug = require("debug")("data-grab");
  const _ = require("lodash");
  const fs = require("fs");
  const configFile = require("./config.json");
  var config = {
    commandHost: "https://cmd.nqminds.com",
    queryHost: "https://q.nqminds.com"  
  };
  var nqmindsTDX = new TDXApi(config);
  var opts = {
    $sort:{"age":1,"gender":1}
  };
  nqmindsTDX.getDatasetData("EkZjV5MGIx",null,null,opts,(err,consultations) => {
    if(err){
      debug("err retrive data");
    }else{
      _.forEach(consultations.data,(objVal,i) => {
        var arrayIndex = i>=configFile.packageParams.ageBands.length?(i-configFile.packageParams.ageBands.length):i;
        var thisobjVal = {
          gender:objVal["gender"],
          rate:objVal["rate"],
          age_band:configFile.packageParams.ageBands[arrayIndex]
        };
        var stringVal = JSON.stringify(thisobjVal)+"\n";
        fs.appendFileSync("consultations.json",stringVal,{enconding:"utf-8"});
      });
    }
  });
}());