import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
// create s3 bucket for backup
const backupBucket = new aws.s3.Bucket("inma-infra-backup", {
  acl: "private",
  versioning: {
    enabled: true,
  },
});

export const backupBucketName = backupBucket.bucket;
