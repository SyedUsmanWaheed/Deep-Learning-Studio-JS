import AWS from 'aws-sdk';
import fs from 'fs';

const bucket_name = process.env.AWSBUCKETNAME
const region = process.env.AWSREGION
const key = process.env.S3ACCESSKEY
const secret_key = process.env.S3SECRETACCESSKEY

const s3 = new AWS.S3({
    region,
    accesskeyId: key,
    secretAccessKey: secret_key,
    signatureVersion: 'v4'
})

export const generatePutURL = async (file_name) => {
    const params = ({
        Bucket: bucket_name,
        Key: file_name,
        ContentType: 'text/csv',
        ACL: 'private'
    })

    try{
        const url = await s3.getSignedUrlPromise('putObject', params)
        return url
        // this is thr url where file will be uploaded
    }catch(err){
        console.log(err)
        throw new Error(err.message)  
    }
}

export const generateGetURL = async (key) => {
    const params = ({
        Bucket: bucket_name,
        Key: key,
    })

    try{
        const url = await s3.getSignedUrlPromise('getObject', params)
        return url
        // this is thr url from where the uploaded file will be accessed

    }catch(err){
        console.log(err)
        throw new Error(err.message) 
    }

}

export const upload_to_s3 = async (file_path, key) => {
    const fileStream = fs.createReadStream(file_path)
    const params =({
        Bucket: bucket_name,
        Body: fileStream,
        Key: key
    })
    try{
        return s3.upload(params).promise()

    }catch(err){
        console.log(err)
        throw new Error(err.message) 
    }
}