import request from 'supertest'
import app from '../../src/app'

describe('User', () => {
  it('Should warn missing mandatory fields', async () => {
    const response = await request(app)
      .post('/api/users')
      .send({})

    expect(response.status).toBe(400)
    expect(response.body).toMatchObject({
      error: [
        'first_name is a required field',
        'last_name is a required field',
        'email is a required field',
        'password is a required field',
      ],
    })
  })
})
