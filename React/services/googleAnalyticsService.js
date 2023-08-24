import axios from "axios";
import * as helper from "./serviceHelpers";

const googleService = {
  endpoint: helper.API_HOST_PREFIX,
};

const getReport = (startDate, endDate) => {
  const config = {
    method: "GET",
    url: `${googleService.endpoint}/api/googleanalytics/?startDate=${startDate}&endDate=${endDate}`,
    withCredentials: true,
    crossDomain: true,
    headers: { "content-type": "application/json" },
  };
  return axios(config).then(helper.onGlobalSuccess);
};

export { getReport };
