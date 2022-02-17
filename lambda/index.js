const AWS = require("aws-sdk");
const sharp = require("sharp");

const s3 = new AWS.S3();

exports.handler = async (event, context, callback) => {
  const Bucket = event.Records[0].s3.bucket.name; // react-nodebird-ori
  const Key = decodeURIComponent(event.Records[0].s3.object.key); // original/201924208_ori.jpg // decodeURIComponent : 한글 해결

  console.log("handler: Bucket, Key", Bucket, Key);
  const filename = Key.split("/")[Key.split("/").length - 1]; // 201924208_ori.jpg
  const ext = Key.split(".")[Key.split(".").length - 1].toLowerCase(); //jpg
  const requireFormat = ext === "jpg" ? "jpeg" : ext; // sharp의 경우 확장자가 jpg면 jpeg로 넣어줘야한다
  console.log("filename: ", filename, "ext :", ext);

  //이미지 리사이징 시작
  try {
    const s3Object = await s3.getObject({ Bucket, Key }).promise();
    console.log("original img binary length: ", s3Object.Body.length);
    const resizedImage = await sharp(s3Object.Body)
      .resize(400, 400, { fit: "inside" }) //400 400 크기로 꽉 차게
      .toFormat(requireFormat) // jpg면 jpeg로
      .toBuffer();

    //변경한거 업로드
    await s3
      .putObject({
        Bucket,
        Key: `thumb/${filename}`,
        Body: resizedImage,
      })
      .promise();
    console.log("modified img binary length: ", resizedImage.length);
    return callback(null, `thumb/${filename}`); //성공
  } catch (error) {
    console.error(error);
    return callback(error); //람다가 끝날땐 callback을 써서 끝내주면 된다.
  }
};
