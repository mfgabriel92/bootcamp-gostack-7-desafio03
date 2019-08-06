import { parseISO, isBefore } from 'date-fns'
import Meetup from '../models/Meetup'
import ErrorMessage from './ErrorMessage'
import HTTP from '../../utils/httpResponse'

class CreateMeetupService {
  async run({ user_id, title, description, location, date }) {
    if (isBefore(parseISO(date), new Date())) {
      throw new ErrorMessage(
        HTTP.BAD_REQUEST,
        'Dates before today are not allowed'
      )
    }

    const existingMeetup = await Meetup.count({
      where: {
        user_id,
        date,
      },
    })

    if (existingMeetup > 0) {
      throw new ErrorMessage(
        HTTP.BAD_REQUEST,
        'You already have another event for this day and time'
      )
    }

    const meetup = await Meetup.create({
      user_id,
      title,
      description,
      location,
      date,
    })

    return meetup
  }
}

export default new CreateMeetupService()
