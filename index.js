/**
 * Air grab and store:
 * @param {Object} tdx Api object.
 * @param {Object} output functions.
 * @param {Object} packageParams of the databot.
 */
function CalData(tdxApi, output, packageParams) {
  "use strict";
  GrabConsultation(tdxApi,output,packageParams,(err,consultationObj) =>{
    if(err){
      output.debug(err);
    }else{
      //lsoaDemand.groupByarea(tdxApi,output,packageParams,consultationObj);
      //timeLine.groupByyear(tdxApi,output,packageParams,consultationObj);
      //detailDemand.groupBydetails(tdxApi,output,packageParams,consultationObj);
      popletPyramid.groupBypyramid(tdxApi,output,packageParams,consultationObj);
    }
  });
}

function GrabConsultation(tdxApi,output,packageParams,cb){
  "use strict";
  var opts = {
    $sort:{
      "age_band":1,
      "gender":1
    }
  };
  tdxApi.getDatasetData(packageParams.consultationRates,null,null,opts,(err,consultations) => {
    if(err){
      cb(err,null);
    }else{
      cb(null,consultations.data);
    }
  });
}
/**
 * Main databot entry function:
 * @param {Object} input schema.
 * @param {Object} output functions.
 * @param {Object} context of the databot.
 */

function databot(input, output, context) {
  "use strict";
  output.progress(0);

  var tdxApi = new TDXAPI({
    commandHost: context.commandHost,
    queryHost: context.queryHost,
    accessTokenTTL: context.packageParams.accessTokenTTL
  });

  Promise.promisifyAll(tdxApi);

  tdxApi.authenticate(context.shareKeyId, context.shareKeySecret, function (err, accessToken) {
    if (err) {
      output.error("%s", JSON.stringify(err));
      process.exit(1);
    } else {
      CalData(tdxApi, output, context.packageParams);
    }
  });
}

var input;
var _ = require("lodash");
var request = require("superagent");
var Promise = require("bluebird");
var TDXAPI = require("nqm-api-tdx");
var calDemand = require("./demandCal");
var lsoaDemand = require("./groupByarea");
var timeLine = require("./groupByyear");
var detailDemand = require("./groupBydetails");
var popletPyramid = require("./groupBypyramid");

if (process.env.NODE_ENV === "test") {
    // Requires nqm-databot-airgrab.json file for testing
  input = require("./databot-test.js")(process.argv[2]);
} else {
    // Load the nqm input module for receiving input from the process host.
  input = require("nqm-databot-utils").input;
}

// Read any data passed from the process host. Specify we're expecting JSON data.
input.pipe(databot);