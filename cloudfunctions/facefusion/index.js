const cloud = require("wx-server-sdk");
const {
  getLogger,
  createResponse,
  has
} = require("./util");
const {
  client,
  models
} = require("./client");
const {
  activityId
} = require("./conf");

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
});

const log = getLogger(cloud, "facefusion");

const FaceFusion = (projectId, modelId, imageBase64) => {
  const req = new models.FaceFusionRequest();

  let params = {
    ProjectId: projectId,
    ModelId: modelId,
    Image: imageBase64,
    RspImgType: "url",
  };

  req.from_json_string(JSON.stringify(params));

  return new Promise((resolve, reject) => {
    client.FaceFusion(req, (errMsg, response) => {
      if (errMsg) {
        reject(errMsg);
        return;
      }

      resolve(JSON.parse(response.to_json_string()));
    });
  });
};

exports.main = async (event) => {
  const {
    fileId,
    modelId
  } = event;
  if (typeof fileId !== "string") {
    throw new Error("missing argument: fileId (type: string)");
  }
  if (typeof modelId !== "string") {
    throw new Error("missing argument: modelId (type: string)");
  }

  let base64Code = "";

  // 图像下载到本地
  try {
    const res = await cloud.downloadFile({
      fileID: fileId,
    });

    const {
      fileContent
    } = res;

    // 图像压缩成base64
    base64Code = fileContent.toString("base64");
  } catch (error) {
    log({
      error,
      errMsg: "图像压缩失败",
    });
    return createResponse("图像压缩失败", 500, error);
  }

  try {
    const result = await FaceFusion(activityId, modelId, base64Code);
    return {
      image: result.Image,
      requestId: result.RequestId,
      reviewResultSet: result.ReviewResultSet,
    };
  } catch (error) {
    console.log(error);
    log({
      error,
      errMsg: "图像融合失败",
    });

    // 如果是腾讯云神图返回的错误
    if (has(error, "requestId")) {
      return createResponse(error.message, 500, error);
    } else {
      return createResponse("图像融合失败", 500, error);
    }
  } finally {
    // 不管成功与否, 都删除用户的上传照片
    try {
      const res = await cloud.deleteFile({
        fileList: [fileId],
      });
      console.log("删除用户上传照片成功", res);
    } catch (e) {
      log({
        error: e,
        errMsg: "删除用户上传照片失败",
      });
    }
  }
};