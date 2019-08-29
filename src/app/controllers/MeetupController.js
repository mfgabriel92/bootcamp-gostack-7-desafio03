import { parseISO, startOfDay, endOfDay, isBefore } from 'date-fns'
import { Op } from 'sequelize'
import Attendant from '../models/Attendant'
import Meetup from '../models/Meetup'
import User from '../models/User'
import File from '../models/File'
import HTTP from '../../utils/httpResponse'
import CreateMeetupService from '../services/CreateMeetupService'

class MeetupController {
  /**
   * Lists all the meetups of the day
   *
   * @param {Request} req
   * @param {Response} res
   */
  async show(req, res) {
    const { id } = req.params

    const meetup = await Meetup.findByPk(id, {
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
    })

    const isAttending =
      (await Attendant.count({
        where: { meetup_id: meetup.id, user_id: req.userId },
      })) > 0

    return res.json({ meetup, isAttending })
  }

  /**
   * Show a specific meetup
   *
   * @param {Request} req
   * @param {Response} res
   */
  async index(req, res) {
    const { date, page = 1, limit = 9 } = req.query
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
      limit,
      offset: (page - 1) * limit,
      order: [['date', 'ASC']],
    })

    return res.json({ meetups })
  }

  /**
   * Creates a new Meetup
   *
   * @param {Request} req
   * @param {Response} res
   */
  async store(req, res) {
    const { title, description, location, date } = req.body

    try {
      const meetup = await CreateMeetupService.run({
        user_id: req.userId,
        title,
        description,
        location,
        date,
      })

      return res.status(HTTP.CREATED).json({ meetup })
    } catch (e) {
      return res.status(e.code).json(e.message)
    }
  }

  /**
   * Updates an existing Meetup
   *
   * @param {Request} req
   * @param {Response} res
   */
  async update(req, res) {
    const { body } = req
    const { id } = req.params
    const meetup = await Meetup.findByPk(id)

    if (!meetup) {
      return res
        .status(HTTP.NOT_FOUND)
        .json({ error: 'The meetup does not exist' })
    }

    if (req.userId !== meetup.user_id) {
      return res
        .status(HTTP.UNAUTHORIZED)
        .json({ error: 'You are not the organizer of this meetup' })
    }

    await meetup.update(body)

    return res.json({ meetup })
  }

  /**
   * Delete an Meetup that hasn't happened yet
   *
   * @param {Request} req
   * @param {Response} res
   */
  async delete(req, res) {
    const { id } = req.params
    const meetup = await Meetup.findByPk(id)

    if (!meetup) {
      return res
        .status(HTTP.NOT_FOUND)
        .json({ error: 'The meetup does not exist' })
    }

    if (req.userId !== meetup.user_id) {
      return res
        .status(HTTP.UNAUTHORIZED)
        .json({ error: 'You are not the organizer of this meetup' })
    }

    if (isBefore(meetup.date, new Date())) {
      return res
        .status(HTTP.BAD_REQUEST)
        .json({ error: 'You cannot cancel past meetups anymore' })
    }

    await meetup.destroy()

    return res.send()
  }
}

export default new MeetupController()
