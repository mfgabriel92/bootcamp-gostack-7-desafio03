import { parseISO, startOfDay, endOfDay } from 'date-fns'
import { Op } from 'sequelize'
import Meetup from '../models/Meetup'
import File from '../models/File'
import User from '../models/User'

class ListController {
  /**
   * Lists all the meetups by the date
   *
   * @param {Request} req
   * @param {Response} res
   */
  async index(req, res) {
    const { date, page = 1 } = req.query
    const parsedDate = parseISO(date)

    const meetups = await Meetup.findAll({
      where: {
        date: {
          [Op.between]: [startOfDay(parsedDate), endOfDay(parsedDate)],
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
      ],
      limit: 10,
      offset: (page - 1) * 10,
      order: [['created_at', 'DESC']],
    })

    return res.json({ meetups })
  }
}

export default new ListController()
