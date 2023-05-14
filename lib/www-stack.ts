import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as s3_deploy from "aws-cdk-lib/aws-s3-deployment";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import { homedir } from "os";
//import { StaticSite } from "./static-site";

export class WwwStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const domainName = "www.dray.id.au";
    const source = "./dist";

    const bucket = new s3.Bucket(this, "bucket", {
      bucketName: domainName,
      publicReadAccess: true,
      websiteIndexDocument: "index.html",
    });

    new s3_deploy.BucketDeployment(this, "deployment", {
      destinationBucket: bucket,
      sources: [
        s3_deploy.Source.asset(source, {
          bundling: {
            image: Runtime.NODEJS_16_X.bundlingImage,
            volumes: [
              { hostPath: `${homedir()}/.npm`, containerPath: "/.npm" },
            ],
            command: [
              "bash",
              "-c",
              ["npm install", "npm run build", "npm run bundle"].join(" && "),
            ],
          },
        }),
      ],
    });

    new cdk.CfnOutput(this, "DnsName", {
      value: bucket.bucketWebsiteDomainName,
    });
  }
}
