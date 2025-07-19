import * as hcloud from "@pulumi/hcloud";
import * as dns from "pulumi-hetznerdns";
import * as pulumi from "@pulumi/pulumi";

const stack = pulumi.getStack();
const isStaging = stack === "staging";

// Create a new Hetzner Cloud Server from a snapshot
const server = new hcloud.Server(`${stack}-server`, {
  serverType: "cx11",
  image: "40093247", // hardcoded image ID for pulumi docker-ce
  location: "nbg1",
  sshKeys: ["inma-infra"],
});

// DNS configuration - staging uses subdomain
const dnsName = isStaging ? "staging" : "@";
const recordName = isStaging ? "staging.comencemosporelfinal" : "comencemosporelfinal";

const rootRecord = new dns.Record(recordName, {
  zoneId: "avxh7DEXYpyLhrRbhVKCqW",
  name: dnsName,
  type: "A",
  value: server.ipv4Address,
});

// Only create www record for production
let wwwRecord;
if (!isStaging) {
  wwwRecord = new dns.Record("www.comencemosporelfinal", {
    zoneId: "avxh7DEXYpyLhrRbhVKCqW",
    name: "www",
    type: "A",
    value: server.ipv4Address,
  });
}

// Export the server's IP address for deployment
export const serverIp = server.ipv4Address;
