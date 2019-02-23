const _defaulRequestConfig = {
  method: 'get',
  url: '',
  responseType: 'text',
  withCredentials: false,
  headers: {
    'X-Requested-With': 'XMLHttpRequest'
  },
  data: null,
  done: function () { }
}

const parseJSONString = function (str) {
  if (typeof str === 'string') {
    try {
      str = JSON.parse(str)
    } catch (e) {
      console.warn('trying to parse' + str + 'with JSON.parse')
    }

    return str
  }
  return null
}

const setHeaders = function (target, headers) {
  for (let h in headers) {
    if (headers.hasOwnProperty(h)) {
      target.setRequestHeader(h, headers[h])
    }
  }
}

const serializeParams = function (params) {
  if (!params) {
    return ''
  }
  let paramStr = Object.keys(params).reduce((ret, key) => {
    ret += `${key}=${params[key]}&`
    return ret
  }, '')

  paramStr = paramStr.replace(/&$/, '')
  return paramStr
}

const _request = function (_config) {
  const xhr = new XMLHttpRequest()
  const config = Object.assign({}, _defaulRequestConfig, _config)

  if (!config.url) {
    throw new Error('request url is required!')
  }
  const method = config.method.toLowerCase()
  if (method === 'get') {
    let params = serializeParams(config.params)
    config.url = params ? `${config.url}?${params}` : config.url
    config.data = null
  }

  xhr.responseType = config.responseType
  xhr.onreadystatechange = function () {
    if (xhr.status === 200 && xhr.readyState === xhr.DONE) {
      let response = parseJSONString(xhr.responseText) || xhr.response
      config.done(response)
    }
  }
  xhr.open(config.method, config.url)
  xhr.withCredentials = config.withCredentials
  setHeaders(xhr, config.headers)
  xhr.send(config.data)
}

export default {
  get(url, params, done) {
    if (params && typeof params === 'function') {
      done = params
      params = null
    }
    _request({
      method: 'get',
      url,
      params,
      done
    })
  },
  post(url, data, done) {
    if (data && typeof data === 'function') {
      done = data
      data = null
    }
    _request({
      method: 'post',
      url,
      data,
      done
    })
  }
}
