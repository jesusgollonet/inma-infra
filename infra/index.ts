import * as pulumi from "@pulumi/pulumi";
import * as hcloud from "@pulumi/hcloud";
import * as aws from "@pulumi/aws";
import * as dns from "pulumi-hetznerdns";
// create s3 bucket for backup
const backupBucket = new aws.s3.Bucket("inma-infra-backup", {
  acl: "private",
  versioning: {
    enabled: true,
  },
});

// Create a new Hetzner Cloud Server from a snapshot
const server = new hcloud.Server("my-server", {
  serverType: "cx11",
  image: "40093247", // hardcoded image ID for pulumi docker-ce
  location: "nbg1",
  sshKeys: ["inma-infra"],
});

const rootRecord = new dns.Record("comencemosporelfinal", {
  zoneId: "avxh7DEXYpyLhrRbhVKCqW",
  name: "@",
  type: "A",
  value: server.ipv4Address,
});

const wwwRecord = new dns.Record("www.comencemosporelfinal", {
  zoneId: "avxh7DEXYpyLhrRbhVKCqW",
  name: "www",
  type: "A",
  value: server.ipv4Address,
});

// Export the server's IP address
export const serverIp = server.ipv4Address;
export const bucketName = backupBucket.bucket;
