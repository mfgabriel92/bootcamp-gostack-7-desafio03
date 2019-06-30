import File from '../models/File'
import Meetup from '../models/Meetup'
import HTTP from '../../utils/httpResponse'

class FileController {
  /**
   * Uploads a new banner for a Meetup
   *
   * @param {Request} req
   * @param {Response} res
   */
  async store(req, res) {
    const { id } = req.params
    const meetup = await Meetup.findByPk(id)

    if (!meetup) {
      return res
        .status(HTTP.NOT_FOUND)
        .json({ error: 'The meetup does not exist' })
    }

    const { filename: name } = req.file
    const file = await File.create({ name })

    await meetup.update({ banner_id: file.id })

    return res.send({ file })
  }
}

export default new FileController()
