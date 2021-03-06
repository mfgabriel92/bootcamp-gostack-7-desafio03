import { startOfDay, endOfDay, isBefore } from 'date-fns'
import { Op } from 'sequelize'
import Meetup from '../models/Meetup'
import User from '../models/User'
import File from '../models/File'
import Attendant from '../models/Attendant'
import HTTP from '../../utils/httpResponse'
import Queue from '../../lib/Queue'
import NewAttendantMail from '../jobs/NewAttendantMail'

class AttendantController {
  /**
   * List all the meetups the user is attending to by date
   *
   * @param {Request} req
   * @param {Response} res
   */
  async index(req, res) {
    const { page = 1, limit = 9 } = req.query

    const meetups = await Meetup.findAll({
      where: {
        date: {
          [Op.between]: [startOfDay(new Date()), endOfDay(new Date())],
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
          include: {
            model: File,
            as: 'avatar',
          },
        },
        {
          model: Attendant,
          where: {
            user_id: req.userId,
          },
        },
      ],
      limit,
      offset: (page - 1) * limit,
      order: [['created_at', 'DESC']],
    })

    return res.json({ meetups })
  }

  /**
   * Attend a meetup
   *
   * @param {Request} req
   * @param {Response} res
   */
  async store(req, res) {
    const { id } = req.params
    const meetup = await Meetup.findByPk(id, {
      include: [
        {
          model: User,
          as: 'user',
        },
      ],
    })

    if (!meetup) {
      return res.status(HTTP.NOT_FOUND).json(['The meetup does not exist'])
    }

    // Your meetup
    if (meetup.user_id === req.userId) {
      return res
        .status(HTTP.UNAUTHORIZED)
        .json(['You cannot register as an attendee of a meetup you created'])
    }

    // Past meetup
    if (isBefore(meetup.date, new Date())) {
      return res
        .status(HTTP.BAD_REQUEST)
        .json(['You cannot attend a past meetup'])
    }

    // Same meetup
    const existingMeetup = await Attendant.count({
      where: {
        meetup_id: meetup.id,
        user_id: req.userId,
      },
    })

    if (existingMeetup > 0) {
      return res
        .status(HTTP.BAD_REQUEST)
        .json(['You already are attending this meetup'])
    }

    // Same day
    const existingDate = await Attendant.count({
      where: {
        user_id: req.userId,
      },
      include: [
        {
          model: Meetup,
          as: 'meetup',
          where: {
            date: meetup.date,
          },
        },
      ],
    })

    if (existingDate > 0) {
      return res
        .status(HTTP.BAD_REQUEST)
        .json(['You already have a meetup on this day and time'])
    }

    const newAttendant = await Attendant.create({
      user_id: req.userId,
      meetup_id: meetup.id,
    })

    // Mail
    const attendant = await Attendant.findByPk(newAttendant.id, {
      include: [
        {
          model: User,
          as: 'user',
        },
      ],
    })

    await Queue.createJob(NewAttendantMail.key, { meetup, attendant })

    return res.status(HTTP.CREATED).send()
  }

  /**
   * Unattend a meetup
   *
   * @param {Request} req
   * @param {Response} res
   */
  async destroy(req, res) {
    const { id } = req.params
    const attending = await Attendant.findOne({
      where: {
        user_id: req.userId,
        meetup_id: id,
      },
      include: [
        {
          model: Meetup,
          as: 'meetup',
        },
      ],
    })

    if (!attending) {
      return res
        .status(HTTP.NOT_FOUND)
        .json(['The meetup does not exist or you are not attending it.'])
    }

    if (isBefore(attending.meetup.date, new Date())) {
      return res.status(HTTP.BAD_REQUEST).json(['This meetup is already past.'])
    }

    await attending.destroy()

    return res.json(attending)
  }
}

export default new AttendantController()
