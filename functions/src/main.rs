use lambda_runtime::{service_fn, LambdaEvent, Error};
use serde_json::{json, Value};
use lambda_apigateway_response::http::StatusCode;
use lambda_apigateway_response::{Headers, MultiValueHeaders, Response};

type LambdaResult<T> = Result<T, Error>;

#[tokio::main]
async fn main() -> Result<(), Error> {
    let func = service_fn(func);
    lambda_runtime::run(func).await?;
    Ok(())
}

async fn func(event: LambdaEvent<Value>) -> LambdaResult<Response<Value>> {
    let (event, _context) = event.into_parts();
    let first_name = event["body"]["firstName"].as_str().unwrap_or("world");

    let res = Response {
        status_code: StatusCode::OK,
        body: json!({ "message": format!("Hello, {}!", first_name) }),
        headers: Headers::new(),
        multi_value_headers: MultiValueHeaders::new(),
        is_base64_encoded: false,
    };
    Ok(res)
}