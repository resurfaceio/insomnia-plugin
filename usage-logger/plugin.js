const {
    HttpLogger,
    HttpMessage,
    HttpRequestImpl,
    HttpResponseImpl,
    HttpRules
} = require('resurfaceio-logger');

const { URL } = require('url');

const RESPONSE_BODY_LIMIT = 1024 * 1024;

let logger, request, response, request_body, response_body;
let environment = {
    url: null,
    enabled: null,
    rules: null,
    body_limit: null
}, started = 0;

module.exports.requestHooks = [
    context => {
        environment.url = context.request
        .getEnvironmentVariable('USAGE_LOGGERS_URL');
        environment.enabled = context.request
        .getEnvironmentVariable('USAGE_LOGGERS_DISABLE') != true;
        environment.rules = new HttpRules(context.request
        .getEnvironmentVariable('USAGE_LOGGERS_RULES')).text;
        const body_limit = context.request
        .getEnvironmentVariable('USAGE_LOGGERS_LIMIT');
        if (logger == undefined 
            || logger.url !== environment.url
            || logger.rules.text !== environment.rules
            || environment.body_limit !== body_limit) {
            environment.body_limit = body_limit;
            logger = new HttpLogger(environment);
        } else if (logger.enabled != environment.enabled) {
            environment.enabled ? logger.enable() : logger.disable();
        }
        started = logger.hrmillis;
        request = new HttpRequestImpl();
        const url = new URL(context.request.getUrl());
        request.protocol = url.protocol.split(':')[0];
        request.hostname = url.host;
        request.url = url.pathname + url.search + url.hash;
        context.request.getHeaders().forEach(header => {
            request.addHeader(header.name, header.value);
        });
        context.request.getParameters().forEach(param => {
            request.addQueryParam(param.name, param.value);
        });
        url.searchParams.forEach((v, k) => {
            request.addQueryParam(k, v);
        });
        request.method = context.request.getMethod();
        request_body = context.request.getBody().text;
    }
];

module.exports.responseHooks = [
    context => {
        const now = Date.now().toString();
        const interval = (logger.hrmillis - started).toString();
        response = new HttpResponseImpl();
        response.statusCode = context.response.getStatusCode();
        context.response.getHeaders().forEach(header => {
            response.addHeader(header.name, header.value);
        });
        response_body = context.response.getBody();
        if (response_body.length > environment.body_limit) {
            response_body = `{"overflowed: ${response_body.length}"}`;
        } else {
            response_body = response_body.toString();
        }
        HttpMessage.send(
            logger,
            request,
            response,
            response_body,
            request_body,
            now,
            interval
        );
    }
];
