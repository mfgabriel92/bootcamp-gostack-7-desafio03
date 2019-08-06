import jwt from 'jsonwebtoken'
import User from '../models/User'
import File from '../models/File'
import HTTP from '../../utils/httpResponse'

class SessionController {
  /**
   * Authenticates an user
   *
   * @param {Request} req request
   * @param {Reponse} res response
   */
  async store(req, res) {
    const { email, password } = req.body
    const user = await User.findOne({
      where: { email },
      include: [
        {
          model: File,
          as: 'avatar',
        },
      ],
    })

    if (!user || !(await user.isPasswordCorrect(password))) {
      return res
        .status(HTTP.UNAUTHORIZED)
        .json({ error: 'Credentials do not match' })
    }

    return res.json({
      user,
      token: jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
        expiresIn: '7d',
      }),
    })
  }
}

export default new SessionController()
