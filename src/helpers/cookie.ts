/**
 * Устанавливает cookie
 *
 * @param {string} name - name of the cookie
 * @param {string | number} value - value of the cookie
 * @param {object} options - extra props for cookie
 * @param {any} expires - expired time for cookie
 */
export function setCookie (name, value, options) {
  options = options || {}

  let expires = options.expires

  if (typeof expires === 'number' && expires) {
    const d = new Date()
    d.setTime(d.getTime() + expires * 1000)
    expires = options.expires = d
  }
  if (expires && expires.toUTCString) {
    options.expires = expires.toUTCString()
  }

  options.path = '/'

  value = encodeURIComponent(value)

  let updatedCookie = name + '=' + value

  for (const propName in options) {
    updatedCookie += '; ' + propName
    const propValue = options[propName]
    if (propValue !== true) {
      updatedCookie += '=' + propValue
    }
  }

  document.cookie = updatedCookie
}

/**
 * Удяляет cookie.
 *
 * @param {string} name - name of the cookie
 */
export function deleteCookie (name) {
  setCookie(name, '', {
    expires: -1
  })
}

/**
 * Получает cookie по имени
 *
 * @param {string} name - name of the cookie
 * @returns {string | undefined} value of the cookie or undefined
 */
export function getCookie (name) {
  const matches = document.cookie.match(new RegExp(
    '(?:^|; )' + name.replace(/([.$?*|{}()[]\/\+^])/g, '\\$1') + '=([^;]*)'
  ))
  return matches ? decodeURIComponent(matches[1]) : undefined
}
