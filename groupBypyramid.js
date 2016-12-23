module.exports = (function(){
  "use strict";
  const demandCal = require("./demandCal");

  function groupBypyramid(tdxApi,output,packageParams,consultationObj){
    let thisageBands = packageParams.ageBands.concat([]);
    thisageBands.splice(thisageBands.indexOf("90+"), 1);
    thisageBands.push("90%2B");
    let matchObj = {
      ageArray:thisageBands,
      genderArray:["male","female"],
      yearArray:packageParams.year,
      groupBy:["age_band"],
      areaArray:packageParams.aggregations.area_id
    };
    demandCal.demandCal(tdxApi,output,packageParams.popletsTable,consultationObj,matchObj);
  }
  let popletPyramid = {
    groupBypyramid: groupBypyramid
  };
  return (popletPyramid);

}());