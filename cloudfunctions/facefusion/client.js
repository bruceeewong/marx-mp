const tencentcloud = require("tencentcloud-sdk-nodejs");
const { secretId, secretKey } = require("./conf");

const FacefusionClient = tencentcloud.facefusion.v20181201.Client;
const models = tencentcloud.facefusion.v20181201.Models;

const Credential = tencentcloud.common.Credential;
const ClientProfile = tencentcloud.common.ClientProfile;
const HttpProfile = tencentcloud.common.HttpProfile;

const cred = new Credential(secretId, secretKey);
const httpProfile = new HttpProfile();
httpProfile.endpoint = "facefusion.tencentcloudapi.com";
const clientProfile = new ClientProfile();
clientProfile.httpProfile = httpProfile;
const client = new FacefusionClient(cred, "ap-guangzhou", clientProfile);

module.exports = {
  client,
  models,
};
