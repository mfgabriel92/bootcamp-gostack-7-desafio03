import multer from 'multer'
import crypto from 'crypto'
import { extname, resolve } from 'path'

export default {
  storage: multer.diskStorage({
    destination: resolve(__dirname, '..', '..', 'uploads'),
    filename: (req, file, cb) => {
      crypto.randomBytes(12, (err, res) => {
        if (err) return cb(err)

        const ms = new Date().getTime()
        const hx = res.toString('hex')
        const ex = extname(file.originalname)

        return cb(null, `${ms}.${hx}${ex}`)
      })
    },
  }),
}
