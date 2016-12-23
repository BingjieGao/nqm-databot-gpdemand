module.exports = (function () {
  "use strict";
  const _ = require("lodash");

  function CalDemand(tdxApi, output, datasetId, consultationObj,matchObj) {

    var condString = "";
    var groupString = "";
    output.debug(matchObj.groupBy);
    if(matchObj.groupBy === "NULL"){
      groupString = "NULL";
    }else if(matchObj.groupBy.length>0){
      groupString += "{";
      _.forEach(matchObj.groupBy,(val,i) => {
        groupString += i>=1?",":"";
        groupString += '"'+val+'":"$'+val+'"';
      });
      groupString += "}";
    }
    output.debug(groupString);
   // = matchObj.groupBy === "NULL"?"NULL":'{"'+matchObj.groupBy+'":"$'+matchObj.groupBy+'"}';
    _.forEach(consultationObj, (consultationVal, i) => {
      if(consultationVal["age_band"] === "90+"){
        consultationVal["age_band"] = "90%2B";
      }
      var andString = '"$and":[{"$eq":["$age_band","' + consultationVal["age_band"] + '"]},{"$eq":["$gender","' + consultationVal["gender"] + '"]}]';
      var elseString = '{"$cond":{"if":{' + andString + '},"then":' + consultationVal["rate"] + ',"else":';
      condString += elseString;
      if (i === consultationObj.length - 1) {
        condString += 0;
        for (var j = 0; j < (i + 1) * 2; j++) {
          condString += "}";
        }
      }
    });


    var matchLine = {
      $match: {
        age_band: {
          $in: matchObj.ageArray
        },
        gender: {
          $in: matchObj.genderArray
        },
        area_id:{
          $in: matchObj.areaArray
        }
      }
    };
    if(matchObj.yearArray.length>0){
      matchLine["$match"]["year"] = {
        $in: matchObj.yearArray
      };
    }

    const projectLine = {
      $project: {
        area_id: 1,
        age_band: 1,
        gender: 1,
        persons: 1,
        year:1,
        demand: JSON.parse(condString)
      }
    };
    
    const groupLine = {
      $group: {
        _id: groupString === "NULL"?null:JSON.parse(groupString),
        total: {
          $sum: {
            $multiply: ["$persons", "$demand"]
          }
        }
      }
    };

    //var demandPipline = '[' + JSON.stringify(matchLine) + ',' + JSON.stringify(projectLine) + ',{"$limit":10000},' + JSON.stringify(groupLine) + ']';
    var demandPipline = '[' + JSON.stringify(matchLine) + ',' + JSON.stringify(projectLine) +','+ JSON.stringify(groupLine) + ']';
    output.debug(demandPipline);
    tdxApi.getAggregateData(datasetId, demandPipline, (err, demandData) => {
      if (err) {
        output.debug(err);
      } else {
        output.debug(JSON.stringify(demandData));
      }
    });
  }

  let demandCal = {
    demandCal: CalDemand
  };

  return demandCal;
}());