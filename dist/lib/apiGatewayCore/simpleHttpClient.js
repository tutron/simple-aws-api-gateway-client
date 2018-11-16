'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; /*
                                                                                                                                                                                                                                                                   * Copyright 2010-2016 Amazon.com, Inc. or its affiliates. All Rights Reserved.
                                                                                                                                                                                                                                                                   *
                                                                                                                                                                                                                                                                   * Licensed under the Apache License, Version 2.0 (the "License").
                                                                                                                                                                                                                                                                   * You may not use this file except in compliance with the License.
                                                                                                                                                                                                                                                                   * A copy of the License is located at
                                                                                                                                                                                                                                                                   *
                                                                                                                                                                                                                                                                   *  http://aws.amazon.com/apache2.0
                                                                                                                                                                                                                                                                   *
                                                                                                                                                                                                                                                                   * or in the "license" file accompanying this file. This file is distributed
                                                                                                                                                                                                                                                                   * on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
                                                                                                                                                                                                                                                                   * express or implied. See the License for the specific language governing
                                                                                                                                                                                                                                                                   * permissions and limitations under the License.
                                                                                                                                                                                                                                                                   */
/* eslint max-len: ["error", 100]*/

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

var _utils = require('./utils');

var _utils2 = _interopRequireDefault(_utils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var simpleHttpClientFactory = {};
simpleHttpClientFactory.newClient = function (config) {
  function buildCanonicalQueryString(queryParams) {
    // Build a properly encoded query string from a QueryParam object
    if (Object.keys(queryParams).length < 1) {
      return '';
    }

    var canonicalQueryString = '';
    for (var property in queryParams) {
      if (queryParams.hasOwnProperty(property)) {
        canonicalQueryString += encodeURIComponent(property) + '=' + encodeURIComponent(queryParams[property]) + '&';
      }
    }

    return canonicalQueryString.substr(0, canonicalQueryString.length - 1);
  }

  var simpleHttpClient = {};
  simpleHttpClient.endpoint = _utils2.default.assertDefined(config.endpoint, 'endpoint');

  simpleHttpClient.makeRequest = function (request, callback) {
    var verb = _utils2.default.assertDefined(request.verb, 'verb');
    var path = _utils2.default.assertDefined(request.path, 'path');
    var queryParams = _utils2.default.copy(request.queryParams);
    if (queryParams === undefined) {
      queryParams = {};
    }
    var headers = _extends({}, _utils2.default.copy(request.headers), config.headers);

    // If the user has not specified an override for Content type the use default
    if (headers['Content-Type'] === undefined) {
      headers['Content-Type'] = config.defaultContentType;
    }

    // If the user has not specified an override for Accept type the use default
    if (headers['Accept'] === undefined) {
      headers['Accept'] = config.defaultAcceptType;
    }

    var body = _utils2.default.copy(request.body);

    var url = config.endpoint + path;
    var queryString = buildCanonicalQueryString(queryParams);
    if (queryString !== '') {
      url += '?' + queryString;
    }

    var simpleHttpRequest = {
      url: url,
      method: verb,
      headers: headers,
      data: body
    };

    var proxy = config.proxy;
    if (proxy !== undefined && proxy !== '' && proxy !== null) {
      simpleHttpRequest.proxy = proxy;
    }

    return request(simpleHttpRequest, callback);
  };

  return simpleHttpClient;
};

exports.default = simpleHttpClientFactory;