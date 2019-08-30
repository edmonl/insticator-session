# Insticator Session SDK

## Build and Run

Run `npm run build` to build the project. Output is in `/dist`.

Run `npm run demo` to launch a simple demo of showing sessions and cookies.

Run `npm test` to unit test.

See other commands by `npm run`.

## Usage

`dist/insticator-session.min.js` may be used in browser. It sets `InsiticatorSession` to window. `InsiticatorSession.getSession()` returns the session object.

When the package is used as a library with bundler, `src/index.js` will be imported, e.g. `import { getSession } from 'insticator-session'`.

## Test

Unit tests are performed by `npm test`. E2E test may be difficult because the need to control browser's time to expire cookies, or cookies have to be expired manually.
Another option for E2E test is to refactor the SDK to export a SDK factory, which accepts configurable session duration.

## Other Considerations

Cookies are not safe and may be exploited by other scripts on the site. The consequences may be minor or severe, depending on for which purposes sessions are used.
Server side sessions with verificatoin token may mitigate the issue.

Analytic cookies for user activity tracking and profiling without consent may violate privacy regulations.

Session objects stored in cookies are sent along to the site domain, e.g. when requesting site pages. Is it intended? Usually analytic
events are sent cross domains, and cookies cannot serve well for that purpose. On the other hand, the server side should not rely on the cookie for the events
intended to be contained in a session, because when the events are sent following the creation of the session, the cookie may have expired.

