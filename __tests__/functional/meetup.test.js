import request from 'supertest'
import app from '../../src/app'

let testUser = null

describe('Meetup', () => {
  beforeAll(async () => {
    await request(app)
      .post('/api/users')
      .send({
        first_name: 'Another',
        last_name: 'User',
        email: 'another@user.com',
        password: '12345678',
      })

    const response = await request(app)
      .post('/api/auth')
      .send({
        email: 'another@user.com',
        password: '12345678',
      })

    testUser = response.body
  })

  it('Should create a meetup for an authenticated user', async () => {
    const response = await request(app)
      .post('/api/meetups')
      .set('Authorization', `Bearer ${testUser.token}`)
      .send({
        user_id: testUser.user.id,
        title: 'Lorem ipsum',
        description: 'Lorem ipsum dolor sit amet',
        location: 'Lorem',
        date: '2019-12-31 23:59:59',
      })

    expect(response.status).toBe(201)
  })

  it('Should list the created meetups given a date', async () => {
    const response = await request(app)
      .get('/api/meetups?date=2019-12-31 23:59:59')
      .set('Authorization', `Bearer ${testUser.token}`)

    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('meetups')
  })

  it('Should not list the created meetups for a different date', async () => {
    const response = await request(app)
      .get('/api/meetups?date=2019-12-30 23:59:59')
      .set('Authorization', `Bearer ${testUser.token}`)

    expect(response.status).toBe(200)
    expect(response.body).toMatchObject({ meetups: [] })
  })

  it('Should list a specific meetup by its ID', async () => {
    const response = await request(app)
      .get('/api/meetups/1')
      .set('Authorization', `Bearer ${testUser.token}`)

    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('meetup')
    expect(response.body).toHaveProperty('meetup.id')
  })

  it('Should update a meetup information and return new values', async () => {
    const response = await request(app)
      .put('/api/meetups/1')
      .set('Authorization', `Bearer ${testUser.token}`)
      .send({
        title: 'Updated meetup title',
      })

    expect(response.status).toBe(200)
    expect(response.body).toMatchObject({
      meetup: {
        title: 'Updated meetup title',
      },
    })
  })
})
