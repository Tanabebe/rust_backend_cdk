import * as cdk from 'aws-cdk-lib';
import {Construct} from 'constructs';
import {ApiKeySourceType, LambdaIntegration, RestApi} from "aws-cdk-lib/aws-apigateway";
import {Architecture, Code, Function as LambdaFunction, Runtime} from "aws-cdk-lib/aws-lambda";
import {join} from "path";
import {Duration} from "aws-cdk-lib";

// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class RustBackendCdkStack extends cdk.Stack {

  // API Gatewayの作成
  private api = new RestApi(this, 'ExampleRustApi', {
    apiKeySourceType: ApiKeySourceType.HEADER
  });

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // APIキーの作成
    const apiKey = this.api.addApiKey('apiKey', {
      apiKeyName: 'ExampleRustApiKey'
    });

    // 使用量プランの作成
    const usagePlan = this.api.addUsagePlan('ExampleRustApiUsagePlan');
    usagePlan.addApiKey(apiKey);
    usagePlan.addApiStage({
      stage: this.api.deploymentStage
    })

    // Lambdaの設定
    const exampleRustLambda = new LambdaFunction(this, 'ExampleRustLambda', {
      runtime: Runtime.PROVIDED_AL2,
      code: Code.fromAsset(join(__dirname, '..', 'functions', 'target', 'lambda', 'functions', 'bootstrap.zip')),
      architecture: Architecture.ARM_64,
      memorySize: 128,
      handler: 'bootstrap',
      timeout: Duration.seconds(20),
    });

    // LambdaをAPIGatewayに統合する
    const exampleLambdaIntegration = new LambdaIntegration(exampleRustLambda);

    // API Gatewayのリソース定義
    const exampleLambdaResource = this.api.root.addResource('example');
    exampleLambdaResource.addMethod('POST', exampleLambdaIntegration, {
      apiKeyRequired: true
    });
  }
}
