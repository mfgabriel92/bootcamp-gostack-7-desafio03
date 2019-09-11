import request from 'supertest'
import app from '../../src/app'

describe('User', () => {
  it('Should create a new user', async () => {
    const response = await request(app)
      .post('/users')
      .send({
        first_name: 'Brand',
        last_name: 'New User',
        email: 'brandnewuser@gmail.com',
        password_hash: '12345678',
      })

    expect(response.status).toBe(201)
    expect(response.body).toHaveProperty('user')
  })
})
