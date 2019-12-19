import Cookies from 'js-cookie'

const TokenKey = 'token'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function getTokenAuth() {
  return Cookies.get('auth')
}

export function setTokenAuth() {
  return Cookies.set('auth', true)
}

export function removeTokenAuth() {
  return Cookies.remove('auth')
}
