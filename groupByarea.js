module.exports = (function () {
  "use strict";

  const demandCal = require("./demandCal");

  function groupByarea(tdxApi, output, packageParams, consultationObj) {
    let thisageBands = packageParams.ageBands.concat([]);
    thisageBands.splice(thisageBands.indexOf("90+"), 1);
    thisageBands.push("90%2B");
    let genderArray = ["male", "female"];
    let yearArray = [].concat(packageParams.aggregations.year);
    let groupBy = ["area_id"];
    let matchObj = {
      ageArray: thisageBands,
      genderArray: genderArray,
      yearArray: yearArray,
      areaArray:packageParams.aggregations.area_id,
      groupBy: groupBy
    };
    demandCal.demandCal(tdxApi, output, packageParams.popletsTable, consultationObj, matchObj);
  }

  let demandByarea = {
    groupByarea:groupByarea
  };

  return (demandByarea);
}());
