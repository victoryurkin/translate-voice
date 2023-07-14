export type AmplifyDependentResourcesAttributes = {
  "auth": {
    "translatevoice02e92ee3": {
      "AppClientID": "string",
      "AppClientIDWeb": "string",
      "IdentityPoolId": "string",
      "IdentityPoolName": "string",
      "UserPoolArn": "string",
      "UserPoolId": "string",
      "UserPoolName": "string"
    }
  },
  "hosting": {
    "S3AndCloudFront": {
      "CloudFrontDistributionID": "string",
      "CloudFrontDomainName": "string",
      "CloudFrontOriginAccessIdentity": "string",
      "CloudFrontSecureURL": "string",
      "HostingBucketName": "string",
      "Region": "string",
      "S3BucketSecureURL": "string",
      "WebsiteURL": "string"
    }
  },
  "predictions": {
    "speechGenerator627a9eb9": {
      "language": "string",
      "region": "string",
      "voice": "string"
    },
    "transcription9c3756bc": {
      "language": "string",
      "region": "string"
    },
    "translateTexte69ae279": {
      "region": "string",
      "sourceLang": "string",
      "targetLang": "string"
    }
  },
  "storage": {
    "transcribes3cc46773e": {
      "BucketName": "string",
      "Region": "string"
    }
  }
}