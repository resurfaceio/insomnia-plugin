const {
    HttpLogger,
    HttpMessage,
    HttpRequestImpl,
    HttpResponseImpl
} = require('resurfaceio-logger');

const { URL } = require('url');

let logger, request, response, request_body, response_body;
let environment = {url: null, enabled: null, rules: null}, started = 0;

module.exports.requestHooks = [
    context => {
        environment.url = context.request
        .getEnvironmentVariable('USAGE_LOGGERS_URL');
        environment.enabled = context.request
        .getEnvironmentVariable('USAGE_LOGGERS_DISABLE') != true;
        const rules = context.request
        .getEnvironmentVariable('USAGE_LOGGERS_RULES');
        if (logger == undefined 
            || logger.url != environment.url
            || environment.rules != rules) {
            environment.rules = rules;
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
        response = new HttpResponseImpl();
        response.statusCode = context.response.getStatusCode();
        context.response.getHeaders().forEach(header => {
            response.addHeader(header.name, header.value);
        });
        response_body = context.response.getBody().text;
        const now = Date.now().toString();
        const interval = (logger.hrmillis - started).toString();
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
