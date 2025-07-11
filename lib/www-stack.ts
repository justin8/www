import * as cdk from "aws-cdk-lib";
import * as iam from "aws-cdk-lib/aws-iam";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as s3_deploy from "aws-cdk-lib/aws-s3-deployment";
import { Construct } from "constructs";
import { homedir } from "os";
//import { StaticSite } from "./static-site";

export class WwwStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const deployRole = new iam.Role(this, "github-www", {
      roleName: "github-www",
      assumedBy: new iam.WebIdentityPrincipal(
        `arn:aws:iam::${this.account}:oidc-provider/token.actions.githubusercontent.com`,
        {
          StringEquals: {
            "token.actions.gitHubusercontent.com:aud": "sts.amazonaws.com",
            "token.actions.githubusercontent.com:sub":
              "repo:justin8/www:ref:refs/heads/main",
          },
        }
      ),
    });

    deployRole.addToPolicy(
      new iam.PolicyStatement({
        actions: ["sts:AssumeRole"],
        resources: [`arn:aws:iam::*:role/cdk-*-${this.region}`],
      })
    );

    deployRole.addToPolicy(
      new iam.PolicyStatement({
        actions: ["cloudformation:DescribeStacks"],
        resources: ["*"],
      })
    );

    const domainName = "www.dray.id.au";
    const source = "./dist";

    const bucket = new s3.Bucket(this, "bucket", {
      bucketName: domainName,
      publicReadAccess: true,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ACLS_ONLY,
      websiteIndexDocument: "index.html",
    });

    new s3_deploy.BucketDeployment(this, "deployment", {
      destinationBucket: bucket,
      sources: [
        s3_deploy.Source.asset(source, {
          bundling: {
            image: Runtime.NODEJS_22_X.bundlingImage,
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
