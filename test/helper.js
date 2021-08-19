// © 2016-2021 Resurface Labs Inc.

module.exports = {
  DEMO_URL: 'https://demo.resurface.io/ping',

  MOCK_AGENT: 'helper.js',

  MOCK_HTML: '<html>Hello World!</html>',

  MOCK_HTML2: '<html>Hola Mundo!</html>',

  MOCK_HTML3: '<html>1 World 2 World Red World Blue World!</html>',

  MOCK_HTML4: '<html>1 World\n2 World\nRed World \nBlue World!\n</html>',

  MOCK_HTML5: `<html>
<input type="hidden">SENSITIVE</input>
<input class='foo' type="hidden">
SENSITIVE
</input>
</html>`,

  MOCK_JSON: '{ "hello" : "world" }',

  MOCK_JSON_ESCAPED: '{ \\"hello\\" : \\"world\\" }',

  MOCK_NOW: '1455908640173',

  MOCK_QUERY_STRING: 'foo=bar',

  MOCK_URL: 'http://localhost/index.html',

  MOCK_URLS_DENIED: [`${this.DEMO_URL}/noway3is5this1valid2`, 'https://www.noway3is5this1valid2.com/'],

  MOCK_URLS_INVALID: ['', 'noway3is5this1valid2', 'ftp:\\www.noway3is5this1valid2.com/', 'urn:ISSN:1535–3613'],

  mockRequest(r) {
    r.method = 'GET';
    r.url = this.MOCK_URL;
    return r;
  },

  mockRequestWithJson(r) {
    r.headers.push({'name':'content-type', 'value': 'Application/JSON'});
    r.body.text = this.MOCK_JSON;
    r.method = 'POST';
    r.url = `${this.MOCK_URL}?${this.MOCK_QUERY_STRING}`;
    return r;
  },

  mockRequestWithJson2(r) {
    r = this.mockRequestWithJson(r);
    r.headers.push({'name':'ABC', 'value': '123'});
    r.headers.push({'name':'A', 'value': '1'});
    r.headers.push({'name':'A', 'value': '2'});
    r.parameters.push({'name':'ABC', 'value': '123'});
    r.parameters.push({'name':'ABC', 'value': '234'});
    return r;
  },

  mockResponse(r) {
    r.statusCode = 200;
    return r;
  },

  mockResponseWithHtml(r) {
    r = this.mockResponse(r);
    r.headers.push({'name':'content-type', 'value': 'text/html'}, {'name':'A', 'value': 'Z'});
    r.body = Buffer.from(this.MOCK_HTML);
    return r;
  },

  mockResponseWithJson(r) {
    r = this.mockResponse(r);
    r.headers.push({'name':'content-type', 'value': 'application/json; charset=utf-8'});
    r.body = Buffer.from(this.MOCK_JSON);
  },

  parseable: (msg) => {
    if (!msg || !msg.startsWith('[') || !msg.endsWith(']') || msg.includes('[]') || msg.includes(',,')) return false;
    try {
      JSON.parse(msg);
      return true;
    } catch (e) {
      return false;
    }
  },
};
