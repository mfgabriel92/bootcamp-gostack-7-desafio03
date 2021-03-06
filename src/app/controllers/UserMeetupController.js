import Meetup from '../models/Meetup'
import File from '../models/File'
import User from '../models/User'

class UserMeetupController {
  /**
   * Lists all of the Meetup belonging to the user
   *
   * @param {Request} req
   * @param {Response} res
   */
  async index(req, res) {
    const { page = 1, limit = 9 } = req.query
    const meetups = await Meetup.findAll({
      where: { user_id: req.userId },
      include: [
        {
          model: File,
          as: 'banner',
        },
        {
          model: User,
          as: 'user',
        },
      ],
      limit,
      offset: (page - 1) * limit,
      order: [['date', 'DESC']],
    })

    return res.json({ meetups })
  }
}

export default new UserMeetupController()
