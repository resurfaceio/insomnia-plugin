const { HttpLogger, HttpMessage, HttpRequestImpl, HttpResponseImpl } = require('resurfaceio-logger');
const { URL } = require('url');

let logger, loggerEnv = { url: null, enabled: null, rules: null };
let firstTime = true;
let request, response;
let request_body, response_body;
let started = 0;

module.exports.requestHooks = [
    context => {
        loggerEnv.url = context.request.getEnvironmentVariable('USAGE_LOGGERS_URL');
        let x = context.request.getEnvironmentVariable('USAGE_LOGGERS_DISABLE');
        loggerEnv.enabled = context.request.getEnvironmentVariable('USAGE_LOGGERS_DISABLE') != true;
        loggerEnv.rules = context.request.getEnvironmentVariable('USAGE_LOGGERS_RULES');
        if (firstTime || logger.url != loggerEnv.url || logger.enabled != loggerEnv.enabled) {
            logger = new HttpLogger(loggerEnv);
            firstTime = false;
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
        response_body = context.response.getBody().text;
        const now = Date.now().toString();
        const interval = (logger.hrmillis - started).toString();
        HttpMessage.send(logger, request, response, response_body, request_body, now, interval);
    }
];
