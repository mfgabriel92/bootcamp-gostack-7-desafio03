import jwt from 'jsonwebtoken'
import User from '../models/User'
import HTTP from '../../utils/httpResponse'
import sessionValidation from '../../utils/validators/session'

class SessionController {
  /**
   * Authenticates an user
   *
   * @param {Request} req request
   * @param {Reponse} res response
   */
  async store(req, res) {
    try {
      await sessionValidation.validate(req.body, { abortEarly: false })
    } catch (e) {
      return res.status(HTTP.BAD_REQUEST).json({ error: e.errors })
    }

    const { email, password } = req.body
    const user = await User.findOne({ where: { email } })

    if (!user || !(await user.isPasswordCorrect(password))) {
      return res
        .status(HTTP.UNAUTHORIZED)
        .json({ error: 'Credentials do not match' })
    }

    const { id, name } = user

    return res.json({
      user: { id, name, email },
      token: jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '7d',
      }),
    })
  }
}

export default new SessionController()
