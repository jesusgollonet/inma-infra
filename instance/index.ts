import * as hcloud from "@pulumi/hcloud";

// Create a new Hetzner Cloud Server from a snapshot
const server = new hcloud.Server("my-server", {
  serverType: "cx11",
  image: "167702948", // TODO: parameterize
  location: "nbg1",
  sshKeys: ["inma-infra"], // TODO: parameterize
});

// Export the server's IP address
export const serverIp = server.ipv4Address;
