import User from '../models/User'
import HTTP from '../../utils/httpResponse'
import { newUser, updateUser } from '../../utils/validators/user'

class UserController {
  /**
   * Creates a new user
   *
   * @param {Request} req request
   * @param {Reponse} res response
   */
  async store(req, res) {
    try {
      await newUser.validate(req.body, { abortEarly: false })
    } catch (e) {
      return res.status(HTTP.BAD_REQUEST).json({ error: e.errors })
    }

    const { body } = req

    let user = await User.findOne({ where: { email: body.email } })

    if (user) {
      return res
        .status(HTTP.BAD_REQUEST)
        .json({ error: 'The e-mail is already used' })
    }

    user = await User.create(body)

    return res.status(HTTP.CREATED).json({ user })
  }

  /**
   * Updates an existing user
   *
   * @param {Request} req request
   * @param {Reponse} res response
   */
  async update(req, res) {
    const { email, oldPassword } = req.body
    const user = await User.findByPk(req.userId)

    try {
      await updateUser.validate(req.body, { abortEarly: false })
    } catch (e) {
      return res.status(HTTP.BAD_REQUEST).json({ error: e.errors })
    }

    if (email !== user.email) {
      if ((await User.count({ where: { email } })) > 0) {
        return res
          .status(HTTP.BAD_REQUEST)
          .json({ error: 'The e-mail is already used' })
      }
    }

    if (oldPassword && !(await user.isPasswordCorrect(oldPassword))) {
      return res
        .status(HTTP.UNAUTHORIZED)
        .json({ error: 'Credentials do not match' })
    }

    await user.update(req.body)

    return res.json({ user })
  }
}

export default new UserController()
