import MockDate from 'mockdate'
import moment from 'moment'
import { getSession } from '../src'

describe('Session', () => {
  function mockDate(date) {
    MockDate.set(date)
    window.envMockDate(date)
  }

  afterEach(() => {
    MockDate.reset()
    window.envResetDate()
  })

  test('should continue within 30 minutes', () => {
    const t = moment('2019-08-29T12:03:04.567Z')
    mockDate(t)
    const session0 = getSession()
    expect(session0.expiration).toEqual(moment(t).add(30, 'minutes').toDate())

    t.add(29, 'minutes')
    mockDate(t)
    const session1 = getSession()
    expect(session1.id).toBe(session0.id)
    expect(session1.referrer).toBe(session0.referrer)
    expect(session1.campaign).toBe(session0.campaign)
    expect(session1.expiration).toEqual(moment(t).add(30, 'minutes').toDate())
  })

  test('should continue when changing URL', () => {
    const t = moment('2019-08-29T12:03:04.567Z')
    mockDate(t)
    const session0 = getSession()
    expect(session0.expiration).toEqual(moment(t).add(30, 'minutes').toDate())

    window.history.replaceState({}, '', '/change-url')
    const session1 = getSession()
    expect(session1.id).toBe(session0.id)
    expect(session1.referrer).toBe(session0.referrer)
    expect(session1.campaign).toBe(session0.campaign)
    expect(session1.expiration).toEqual(moment(t).add(30, 'minutes').toDate())
  })

  test('should expire after 30 minutes', () => {
    const t = moment('2019-08-29T12:03:04.567Z')
    mockDate(t)
    const session0 = getSession()
    expect(session0.expiration).toEqual(moment(t).add(30, 'minutes').toDate())

    t.add(30, 'minutes')
    mockDate(t)
    const session1 = getSession()
    expect(session1.id).not.toBe(session0.id)
    expect(session1.referrer).toBe(session0.referrer)
    expect(session1.campaign).toBe(session0.campaign)
    expect(session1.expiration).toEqual(moment(t).add(30, 'minutes').toDate())
  })

  test('should restart at midnight', () => {
    const t = moment('2019-08-29T23:59:00.000-04')
    mockDate(t)
    const session0 = getSession()
    expect(session0.expiration).toEqual(moment('2019-08-30T00:00:00.000-04').toDate())

    t.add(1, 'minutes')
    mockDate(t)
    const session1 = getSession()
    expect(session1.id).not.toBe(session0.id)
    expect(session1.referrer).toBe(session0.referrer)
    expect(session1.campaign).toBe(session0.campaign)
    expect(session1.expiration).toEqual(moment(t).add(30, 'minutes').toDate())
  })

  test('should contain correct referrer', () => {
    const t = moment('2019-08-29T12:03:04.567Z')
    mockDate(t)
    const session0 = getSession()
    expect(session0.referrer).toBe('')
    expect(session0.expiration).toEqual(moment(t).add(30, 'minutes').toDate())

    const newReferrer = 'http://test.com/referrer'
    Object.defineProperty(window.document, 'referrer', {
      value: newReferrer,
      configurable: true,
    })
    const session1 = getSession()
    expect(session1.id).toBe(session0.id)
    expect(session1.referrer).toBe(newReferrer)
    expect(session1.campaign).toBe(session0.campaign)
    expect(session1.expiration).toEqual(session0.expiration)
  })

  test('should restart on changed campaign', () => {
    const t = moment('2019-08-29T12:03:04.567Z')
    mockDate(t)
    const session0 = getSession()
    expect(session0.campaign).toBe('')
    expect(session0.expiration).toEqual(moment(t).add(30, 'minutes').toDate())

    t.add(1, 'minutes')
    mockDate(t)
    window.history.replaceState({}, '', window.location.pathname + '?campaign=campaign1')
    const session1 = getSession()
    expect(session1.id).not.toBe(session0.id)
    expect(session1.campaign).toBe('campaign1')
    expect(session1.expiration).toEqual(moment(t).add(30, 'minutes').toDate())

    t.add(1, 'minutes')
    mockDate(t)
    window.history.replaceState({}, '', window.location.pathname + '?campaign=campaign2')
    const session2 = getSession()
    expect(session2.id).not.toBe(session1.id)
    expect(session2.campaign).toBe('campaign2')
    expect(session2.expiration).toEqual(moment(t).add(30, 'minutes').toDate())

    t.add(1, 'minutes')
    mockDate(t)
    window.history.replaceState({}, '', window.location.pathname)
    const session3 = getSession()
    expect(session3.id).not.toBe(session2.id)
    expect(session3.campaign).toBe('')
    expect(session3.expiration).toEqual(moment(t).add(30, 'minutes').toDate())
  })
})
