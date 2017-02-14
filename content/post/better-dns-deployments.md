+++
date = "2017-02-17T21:37:55+10:00"
title = "Better DNS Deployments"
Tags = ["Development","AWS","Route53","DNS","Deployment"]
Description = ""
menu = "main"
Categories = ["Development","AWS","Route53","DNS","Deployment"]

+++

I've seen a few people around asking about how to back up DNS from their various providers. I feel it's entirely the wrong direction to go. Having people manually making changes to a DNS service, then backing up records somehow is just too much room for human error for my liking. I've also seen other setups using bind or another local DNS service and hosting it themselves. At least this allows for backups of the config since bind is pretty much plain text. But it is still far from ideal, and hosting DNS is a pain. Ensuring it's redundant across connections, geographic locations, providers and what not, which is a lot of work for something that is essentially a commoditized service these days.

The main points I want in maintaining something simple like DNS is:

* Version Control
* Peer-reviewed changes
* Repeatability of all current and previous versions

There are more benefits but if these 3 main tenets are met, then you have a great deal more security in your changes. To be honest, it took longer to write this down than it does to implement a system for DNS changes that follows these principles.

## My solution
So I'll detail the solution I would recommend without any knowledge of a person's current tools or services. The tools I've chosen here are the tools I'm most familiar with and that allow me the greatest flexibility. There are many ways to do this, and it is probably best to sub in one or two of your existing flows in here, e.g. if you already run a Jenkins server, use that instead of CodePipeline, there is a CloudFormation plugin that makes this easy. Below is the list of tools I would use personally:

* Github - for storing the source and handling peer-review of requested changes
* Route53 - for DNS; they offer a 100% uptime guarantee, none of this 99.999% stuff, and have enough flexibility for virtually any use case
* CloudFormation - so that we don't need to manage the creation of the resources and to give us a templating language to use for defining resources
* CodePipeline - I'm already using 2 AWS services, it's easier to keep this here, but you could just as easily use Shippable, CodeShip, Jenkins or some other CI service. But this is super simple to get going for this.

## Repository
Setting up a github repo for this is pretty straight forward, press new repository, and enter a name. There's not much more to say about the process.

## CloudFormation Template
Below is a short snippet of a template, obviously you'd want to use your own domain name, but this will create the hosted zone in Route53 which provides your NS records, and a simple `www.` example record.
```yaml
---
AWSTemplateFormatVersion: '2010-09-09'
Description: Service Specific Stack
Resources:
    HostedZone:
        Type: "AWS::Route53::HostedZone"
        Properties:
            Name: "foo.com"
    www:
        Type: "AWS::Route53::RecordSet"
        Properties:
            Name: "www.foo.com"
            HostedZoneId:
                Ref: HostedZone
            Type: "A"
            TTL: "900"
            ResourceRecords:
                - 127.0.0.1
```
Save this in your new repository, mine is named `template.yml` but any name will do.

## CodePipeline
Next step is to set up the CodePipeline to create the stack and Route53 resources for us.

1. First we need to create an IAM role to be used for the deploy
    1. Open the IAM console
    2. Go to Roles -> Create new role
        1. Give it a name
        2. For the Role Type, choose `AWS Cloudformation Role` under `AWS Service Roles`
        3. Attach the `AmazonRoute53FullAccess` policy

2. Create the pipeline itself:
    1. Open the CodePipeline console
    2. Click Get started (or create pipeline if you already have one)
    3. Enter a name for your pipeline
    4. Choose GitHub source provider, the repository you created before and the master branch
    ![Pipelines repository setup](/images/better-dns-deployments/create-pipeline-github.jpeg)
    5. Select no build
    6. Select AWS CloudFormation deploy
    ![Pipelines repository setup](/images/better-dns-deployments/create-pipeline-cfn.jpeg)
        * Action mode: Create or update a stack
        * Enter a stack name
        * Enter the template file you added to the repo previously (`template.yml` for me)
        * Choose the IAM role you created previously
    7. Click to create the AWS Service Role that the pipeline itself will use

You can press Release Change now to do the first release, any commits to the master branch in the future will start automatically.

![Pipeline deploying to CFN](/images/better-dns-deployments/running-pipeline.jpeg)

If you click on the "AWS CloudFormation" link in the beta stage it will show you the current process of making the records within the stack:

![CFN deploying Route53 resources](/images/better-dns-deployments/cfn-stack.jpeg)

## DNS
If you log on to your Route53 console you will see the NS records you need. The last step to make this live is to update your registrar to refer to the NS records provided in the Route53 console.

![Route53 NS records](/images/better-dns-deployments/route53.jpeg)

## PR workflow
The final piece is to set up GitHub to not allow direct commits to the master branch, and require peer approval to merge commits. In the repo, under Settings, then Branches, you can choose a branch to protect:

![GitHub protected branches](/images/better-dns-deployments/github-protected-branch.jpeg)

Now in order to make changes, someone has to push to a new feature branch, click create a PR, and have someone else come in and click 'I approve' before it is allowed to be merged.

## Results
Now your DNS setup has backups in the form of a git repository (which is super easy to backup somewhere, and you probably already have something set up to backup your source code anyway), it's on a service with a 100% uptime guarantee and it automatically deploys changes without human intervention once it has been peer reviewed. Meaning no-one can accidentally miss a number during a copy+paste in to the web UI of your previous favourite DNS provider. And all in, the cost is somewhere below $1/month in most cases. (50c per hosted zone and 40 cents for a million DNS requests).
