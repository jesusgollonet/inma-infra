import * as pulumi from "@pulumi/pulumi";
import * as hcloud from "@pulumi/hcloud";

// grab the latest snapshot
const image = hcloud.getImage({
  withSelector: "name=inma-infra",
});
// Ensure the image ID is a string
const imageId = pulumi.output(image).apply((img) => img.id.toString());

// Create a new Hetzner Cloud Server from a snapshot
const server = new hcloud.Server("my-server", {
  serverType: "cx11",
  image: imageId, // Use the retrieved image ID
  location: "nbg1",
  sshKeys: ["inma-infra"],
});

// Export the server's IP address
export const serverIp = server.ipv4Address;
