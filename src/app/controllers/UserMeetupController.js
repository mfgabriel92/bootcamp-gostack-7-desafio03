import Meetup from '../models/Meetup'
import File from '../models/File'

class UserMeetupController {
  /**
   * Lists all of the Meetup belonging to the user
   *
   * @param {Request} req
   * @param {Response} res
   */
  async index(req, res) {
    const meetups = await Meetup.findAll({
      where: { user_id: req.userId },
      include: {
        model: File,
        as: 'banner',
      },
    })

    return res.json({ meetups })
  }
}

export default new UserMeetupController()
