const { HttpLogger, HttpMessage, HttpRequestImpl, HttpResponseImpl } = require('resurfaceio-logger');
const { URL } = require('url');

const logger = new HttpLogger({url: "http://localhost:4001/message", rules: "include debug"});
let request, response;
let request_body, response_body;
let started = 0;

module.exports.requestHooks = [
    context => {
        started = logger.hrmillis;
        request = new HttpRequestImpl();
        const url = new URL(context.request.getUrl());
        request.protocol = url.protocol.split(':')[0];
        request.hostname = url.host;
        request.url = url.pathname;
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
        // HttpMessage.send(logger, request);
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
