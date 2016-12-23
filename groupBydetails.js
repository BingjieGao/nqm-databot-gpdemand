module.exports = (function(){
  "use strict";
  const demandCal = require("./demandCal");

  function groupBydetails(tdxApi,output,packageParams,consultationObj){
    let thisageBands = packageParams.ageBands.concat([]);
    thisageBands.splice(thisageBands.indexOf("90+"), 1);
    thisageBands.push("90%2B");
    let matchObj = {
      ageArray:thisageBands,
      genderArray:["male","female"],
      yearArray:["2016"],
      groupBy:"NULL",
      areaArray:packageParams.aggregations.area_id
    };
    demandCal.demandCal(tdxApi,output,packageParams.popletsTable,consultationObj,matchObj);
  }

  let details = {
    groupBydetails: groupBydetails
  };
  return (details);
}());