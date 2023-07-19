// © 2016-2023 Graylog, Inc.

const { expect } = require('chai');
const hooks = require('../src/plugin');
const helper = require('./helper');


function getContext() {
    const context = {
        "USAGE_LOGGERS_QUEUE": [],
        "request": {
            environment: {
                "USAGE_LOGGERS_URL": null,
                "USAGE_LOGGERS_DISABLE": false,
                "USAGE_LOGGERS_RULES": "include debug",
                "USAGE_LOGGERS_LIMIT": null,
            },
            headers: [],
            parameters: [],
            url: null,
            method: null,
            body: {
                "text": null
            },
            getEnvironmentVariable(name) {
                return this.environment[name];
            },
            getHeaders() {
                return this.headers.map(h => ({
                    name: h.name,
                    value: h.value
                }))
            },
            getParameters() {
                return this.parameters.map(h => ({
                    name: h.name,
                    value: h.value
                }))
            },
            getUrl() {
                return this.url;
            },
            getMethod() {
                return this.method;
            },
            getBody() {
                return this.body;
            }
        },
        "response": {
            statusCode: null,
            headers: [],
            body: Buffer.alloc(0),
            getStatusCode() {
                return this.statusCode;
            },
            getHeaders() {
                return this.headers.map(h => ({
                    name: h.name,
                    value: h.value
                }))
            },
            getBody() {
                return this.body
            }
        }
    }
    return context;
}


describe('Plugin', () => {
    it('Logs', () => {
        context = getContext();
        helper.mockRequest(context.request);
        hooks.requestHooks[0](context);
        helper.mockResponse(context.response);
        hooks.responseHooks[0](context);
        expect(context.USAGE_LOGGERS_QUEUE.length).to.equal(1);
        msg = context.USAGE_LOGGERS_QUEUE[0];
        expect(helper.parseable(msg)).to.be.true;
        expect(msg).to.contain("[\"request_method\",\"GET\"]");
        expect(msg).to.contain("[\"request_url\",\"" + helper.MOCK_URL + "\"]");
        expect(msg).to.contain("[\"response_code\",\"200\"]");
        expect(msg).to.contain("[\"now\",\"");
        expect(msg).to.contain("[\"interval\",\"");
        expect(msg).to.not.contain("request_body");
        expect(msg).to.not.contain("request_header");
        expect(msg).to.not.contain("request_param");
        expect(msg).to.not.contain("response_body");
        expect(msg).to.not.contain("response_header");
    });

    it('LogsHTML', () => {
        context = getContext();
        helper.mockRequest(context.request);
        hooks.requestHooks[0](context);
        helper.mockResponseWithHtml(context.response);
        hooks.responseHooks[0](context);
        expect(context.USAGE_LOGGERS_QUEUE.length).to.equal(1);
        msg = context.USAGE_LOGGERS_QUEUE[0];
        expect(helper.parseable(msg)).to.be.true;
        expect(msg).to.contain("[\"request_method\",\"GET\"]");
        expect(msg).to.contain("[\"request_url\",\"" + helper.MOCK_URL + "\"]");
        expect(msg).to.contain("[\"response_body\",\"" + helper.MOCK_HTML + "\"]");
        expect(msg).to.contain("[\"response_code\",\"200\"]");
        expect(msg).to.contain("[\"response_header:a\",\"Z\"]");
        expect(msg).to.contain("[\"response_header:content-type\",\"text/html\"]");
        expect(msg).to.not.contain("request_body");
        expect(msg).to.not.contain("request_header");
        expect(msg).to.not.contain("request_param");
    });

    it('LogsJSONPOST', () => {
        context = getContext();
        helper.mockRequestWithJson(context.request);
        hooks.requestHooks[0](context);
        helper.mockResponseWithJson(context.response);
        hooks.responseHooks[0](context);
        expect(context.USAGE_LOGGERS_QUEUE.length).to.equal(1);
        msg = context.USAGE_LOGGERS_QUEUE[0];
        expect(helper.parseable(msg)).to.be.true;
        expect(msg).to.contain("[\"request_method\",\"POST\"]");
        expect(msg).to.contain("[\"request_url\",\"" + helper.MOCK_URL + '?' + helper.MOCK_QUERY_STRING + "\"]");
        expect(msg).to.contain("[\"request_header:content-type\",\"Application/JSON\"]");
        expect(msg).to.contain("[\"request_body\",\"" + helper.MOCK_JSON_ESCAPED + "\"]");
        expect(msg).to.contain("[\"response_body\",\"" + helper.MOCK_JSON_ESCAPED + "\"]");
        expect(msg).to.contain("[\"response_code\",\"200\"]");
        expect(msg).to.contain("[\"response_header:content-type\",\"application/json; charset=utf-8\"]");
        expect(msg).to.contain("[\"request_param:" + helper.MOCK_QUERY_STRING.replace('=', '\",\"') + "\"]");
    });

    it('LogsJSONPOSTWithHeadersAndParams', () => {
        context = getContext();
        helper.mockRequestWithJson2(context.request);
        hooks.requestHooks[0](context);
        helper.mockResponseWithHtml(context.response);
        hooks.responseHooks[0](context);
        expect(context.USAGE_LOGGERS_QUEUE.length).to.equal(1);
        msg = context.USAGE_LOGGERS_QUEUE[0];
        expect(helper.parseable(msg)).to.be.true;
        expect(msg).to.contain("[\"request_method\",\"POST\"]");
        expect(msg).to.contain("[\"request_url\",\"" + helper.MOCK_URL + '?' + helper.MOCK_QUERY_STRING + "\"]");
        expect(msg).to.contain("[\"request_header:content-type\",\"Application/JSON\"]");
        expect(msg).to.contain("[\"request_header:a\",\"1, 2\"]");
        expect(msg).to.contain("[\"request_param:abc\",\"123, 234\"]");
        expect(msg).to.contain("[\"response_body\",\"" + helper.MOCK_HTML + "\"]");
        expect(msg).to.contain("[\"response_code\",\"200\"]");
        expect(msg).to.contain("[\"response_header:content-type\",\"text/html\"]");
        expect(msg).to.contain("[\"response_header:a\",\"Z\"]");
    });

    it('canBeDisabled', () => {
        context = getContext();
        context.request.environment.USAGE_LOGGERS_DISABLE = true;
        helper.mockRequest(context.request);
        hooks.requestHooks[0](context);
        helper.mockResponse(context.response);
        hooks.responseHooks[0](context);
        expect(context.USAGE_LOGGERS_QUEUE.length).to.equal(0);
    });
});