import request from 'supertest'
import app from '../../src/app'

describe('User', () => {
  it('Should create a new user', async () => {
    const response = await request(app)
      .post('/api/users')
      .send({
        first_name: 'Lorem',
        last_name: 'Ipsum',
        email: 'lorem@ipsum.com',
        password: '12345678',
      })

    expect(response.body).toHaveProperty('user')
  })

  afterAll(() => {})
})
