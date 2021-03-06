import { Router } from 'express'
import multer from 'multer'
// import Brute from 'express-brute'
import multerConfig from './config/multer'
// import bruteConfig from './config/brute-redis'
import auth from './app/middlewares/auth'
import SessionController from './app/controllers/SessionController'
import UserController from './app/controllers/UserController'
import FileController from './app/controllers/FileController'
import AvatarController from './app/controllers/AvatarController'
import MeetupController from './app/controllers/MeetupController'
import AttendantController from './app/controllers/AttendantController'
import UserMeetupController from './app/controllers/UserMeetupController'
import validSessionStore from './app/validators/SessionStore'
import validUserStore from './app/validators/UserStore'
import validUserUpdate from './app/validators/UserUpdate'
import validMeetupStore from './app/validators/MeetupStore'
import validMeetupUpdate from './app/validators/MeetupUpdate'

const upload = multer(multerConfig).single('file')
// const bruteForce = new Brute(bruteConfig).prevent
const routes = new Router()

routes.post('/api/auth', validSessionStore, SessionController.store)
routes.post('/api/users', validUserStore, UserController.store)

routes.use(auth)

routes.put('/api/users', validUserUpdate, UserController.update)
routes.post('/api/users/avatar', upload, AvatarController.store)
routes.get('/api/users/meetups', UserMeetupController.index)

routes.get('/api/meetups', MeetupController.index)
routes.get('/api/meetups/attending', AttendantController.index)
routes.post('/api/meetups', validMeetupStore, MeetupController.store)
routes.put('/api/meetups/:id', validMeetupUpdate, MeetupController.update)
routes.get('/api/meetups/:id', MeetupController.show)
routes.delete('/api/meetups/:id', MeetupController.delete)
routes.put('/api/meetups/:id/banner', upload, FileController.store)
routes.post('/api/meetups/:id/attend', AttendantController.store)
routes.delete('/api/meetups/:id/unattend', AttendantController.destroy)

export default routes
