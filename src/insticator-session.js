const document = window.document
const location = window.location

// Must be a valid javascript identifier
const sessionCookieKey = 'insticator_session'

// Change this to set cookie for a different domain, i.e. to set a 3rd party cookie
const sessionCookieDomain = location.hostname

// The 1st group should be the cookie value
const sessionCookieValuePattern = new RegExp('(?:^|;)\\s*' + sessionCookieKey + '\\s*=\\s*([^;]*)')

const campaignKey = 'campaign'

export function getSession() {
  let session = getSessionInCookie()
  const campaign = getCampaign()
  if (!session || session.campaign !== campaign) {
    session = { id: generateSessionId(), campaign }
  }
  session.referrer = document.referrer
  session.expiration = getNextExpiration()
  setSessionInCookie(session)
  return session
}

function getCampaign() {
  let query = location.search
  if (query.charAt(0) === '?') {
    query = query.slice(1)
  }
  const prefix = campaignKey + '='
  const campaignPart = query.split('&').find(pair => pair.startsWith(prefix))
  return campaignPart ? campaignPart.slice(prefix.length) : ''
}

function getSessionInCookie() {
  let session = document.cookie.match(sessionCookieValuePattern)
  if (!session) {
    return null
  }
  // available cookie value implying not expiring
  session = decodeURIComponent(session[1]) // cookie value in the 1st capturing group
  try {
    session = JSON.parse(session)
  } catch (e) {
    // corrupt cookie value; treat it as no session
    try {
      console.error(e)
    } catch (_) { }
    return null
  }
  const exp = Date.parse(session.expiration)
  if (!exp) {
    // corrupt expiration; treat it as expiring
    return null
  }
  session.expiration = new Date(exp)
  return session
}

function setSessionInCookie(session) {
  let exp = new Date(0)
  let value = ''
  if (session) {
    exp = session.expiration
    value = encodeURIComponent(JSON.stringify({ ...session, expiration: exp.toISOString() }))
  }
  document.cookie = sessionCookieKey + '=' + value + ';domain=' + sessionCookieDomain + ';path=/;expires=' + exp.toUTCString()
}

function getNextExpiration() {
  const now = new Date()
  const exp = new Date(now.getTime() + 30 * 60 * 1000)
  if (now.getDate() !== exp.getDate()) { // span over two days
    exp.setHours(0, 0, 0, 0)
  }
  return exp
}

// Although not required, it is preferred that an ID does not start with a number.
function generateSessionId() {
  return (Math.floor(Math.random() * 26) + 10).toString(36) + Math.floor(Math.random() * 1e15).toString(36)
}
