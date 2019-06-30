import { Router } from 'express'
import multer from 'multer'
import multerConfig from './config/multer'
import auth from './app/middlewares/auth'
import SessionController from './app/controllers/SessionController'
import UserController from './app/controllers/UserController'
import FileController from './app/controllers/FileController'
import MeetupController from './app/controllers/MeetupController'
import AttendantController from './app/controllers/AttendantController'
import ListController from './app/controllers/ListController'
import UserMeetupController from './app/controllers/UserMeetupController'

const upload = multer(multerConfig).single('file')
const routes = new Router()

routes.post('/api/auth', SessionController.store)
routes.post('/api/users', UserController.store)

routes.use(auth)
routes.put('/api/users', UserController.update)

routes.get('/api/meetups', MeetupController.index)
routes.get('/api/meetups/all', ListController.index)
routes.get('/api/meetups/my', UserMeetupController.index)
routes.post('/api/meetups', MeetupController.store)
routes.put('/api/meetups/:id/banner', upload, FileController.store)
routes.put('/api/meetups/:id', MeetupController.update)
routes.delete('/api/meetups/:id', MeetupController.delete)
routes.post('/api/meetups/:id/attend', AttendantController.store)

export default routes
