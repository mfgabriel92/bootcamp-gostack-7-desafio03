import request from 'supertest'
import app from '../../src/app'

let testUser = null

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

    expect(response.status).toBe(201)
    expect(response.body).toHaveProperty('user')
  })

  it('Should not allow duplicated e-mails', async () => {
    await request(app)
      .post('/api/users')
      .send({
        first_name: 'User',
        last_name: 'One',
        email: 'sameemail@gmail.com',
        password: '12345678',
      })

    const response = await request(app)
      .post('/api/users')
      .send({
        first_name: 'User',
        last_name: 'Two',
        email: 'sameemail@gmail.com',
        password: '12345678',
      })

    expect(response.status).toBe(400)
    expect(response.body).toMatchObject({ error: 'The e-mail is already used' })
  })

  it('Should not allow access with wrong credentials', async () => {
    const response = await request(app)
      .post('/api/auth')
      .send({
        email: 'wrong@email.com',
        password: '12345678',
      })

    expect(response.status).toBe(401)
    expect(response.body).toMatchObject({ error: 'Credentials do not match' })
  })

  it('Should generate a token when logging in successfully', async () => {
    const response = await request(app)
      .post('/api/auth')
      .send({
        email: 'lorem@ipsum.com',
        password: '12345678',
      })

    testUser = response.body

    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('user')
    expect(response.body).toHaveProperty('token')
  })

  it('Should be able to update the information of the logged in user', async () => {
    const response = await request(app)
      .put('/api/users')
      .set('Authorization', `Bearer ${testUser.token}`)
      .send({
        first_name: 'Updated Name',
        last_name: 'Updated Last Name',
        email: 'lorem@ipsum.com',
      })

    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('user')
  })

  it('Should update password and login with the new password', async () => {
    await request(app)
      .put('/api/users')
      .set('Authorization', `Bearer ${testUser.token}`)
      .send({
        first_name: 'Updated Name',
        last_name: 'Updated Last Name',
        email: 'lorem@ipsum.com',
        oldPassword: '12345678',
        password: '123123123',
        confirmPassword: '123123123',
      })

    const response = await request(app)
      .post('/api/auth')
      .send({
        email: 'lorem@ipsum.com',
        password: '123123123',
      })

    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('user')
    expect(response.body).toHaveProperty('token')
  })
})
