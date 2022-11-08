import AWS from 'aws-sdk';

const bucket_name = process.env.AWSBUCKETNAME
const region = process.env.AWSREGION
const key = process.env.S3ACCESSKEY
const secret_key = process.env.S3SECRETACCESSKEY

console.log(bucket_name)
console.log(region)
console.log(key)
console.log(secret_key)

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