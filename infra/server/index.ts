import * as hcloud from "@pulumi/hcloud";
import * as dns from "pulumi-hetznerdns";
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
