import { startOfDay } from 'date-fns'
import { Op } from 'sequelize'
import Meetup from '../models/Meetup'
import Attendant from '../models/Attendant'
import User from '../models/User'
import File from '../models/File'

class UserMeetupController {
  /**
   * Lists all the meetups the logged in user is attending
   *
   * @param {Request} req
   * @param {Response} res
   */
  async index(req, res) {
    const meetups = await Meetup.findAll({
      where: {
        date: {
          [Op.gte]: startOfDay(new Date()),
        },
      },
      include: [
        {
          model: File,
          as: 'banner',
        },
        {
          model: User,
          as: 'user',
        },
        {
          model: Attendant,
          where: {
            user_id: req.userId,
          },
        },
      ],
      order: [['created_at', 'DESC']],
    })

    return res.json({ meetups })
  }
}

export default new UserMeetupController()
