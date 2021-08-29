#!/usr/bin/env node
import "source-map-support/register";
import cdk = require("@aws-cdk/core");
import { WwwStack } from "../lib/www-stack";

const app = new cdk.App();
new WwwStack(app, "www", {
  env: { region: "us-east-1", account: "185873083718" },
});
