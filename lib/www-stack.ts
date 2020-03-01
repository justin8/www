import cdk = require("@aws-cdk/core");
import {} from "@aws-cdk/aws-cloudfront";
import {} from "@aws-cdk/aws-codepipeline";
import {} from "@aws-cdk/aws-codepipeline-actions";
import {} from "@aws-cdk/aws-s3";
//import { StaticSite } from "./static-site";
import { StaticSite } from "@justin8-cdk/static-site";

export class WwwStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const domainName = "www.dray.id.au";
    const source = "./dist";

    const site = new StaticSite(this, "site", {
      source: { path: source },
      domainName: domainName
    });
  }
}
