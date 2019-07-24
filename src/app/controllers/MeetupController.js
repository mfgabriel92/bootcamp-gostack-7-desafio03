import { parseISO, startOfDay, endOfDay, isBefore } from 'date-fns'
import { Op } from 'sequelize'
import Meetup from '../models/Meetup'
import User from '../models/User'
import File from '../models/File'
import { newMeetup, updateMeetup } from '../../utils/validators/meetup'
import HTTP from '../../utils/httpResponse'

class MeetupController {
  /**
   * Lists all the meetups of the day
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

  /**
   * Creates a new Meetup
   *
   * @param {Request} req
   * @param {Response} res
   */
  async store(req, res) {
    const { title, description, location, date } = req.body

    try {
      await newMeetup.validate(req.body, { abortEarly: false })
    } catch (e) {
      return res.status(HTTP.BAD_REQUEST).json({ error: e.errors })
    }

    if (isBefore(parseISO(date), new Date())) {
      return res
        .status(HTTP.BAD_REQUEST)
        .json({ error: 'Dates before today are not allowed' })
    }

    const existingMeetup = await Meetup.count({
      where: {
        user_id: req.userId,
        date,
      },
    })

    if (existingMeetup > 0) {
      return res
        .status(HTTP.BAD_REQUEST)
        .json({ error: 'You already have another event for this day and time' })
    }

    const meetup = await Meetup.create({
      user_id: req.userId,
      title,
      description,
      location,
      date,
    })

    return res.status(HTTP.CREATED).json({ meetup })
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

    try {
      await updateMeetup.validate(body, { abortEarly: false })
    } catch (e) {
      return res.status(HTTP.BAD_REQUEST).json({ error: e.errors })
    }

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
