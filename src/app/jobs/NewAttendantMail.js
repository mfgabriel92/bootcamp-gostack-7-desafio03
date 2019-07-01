import { parseISO, format } from 'date-fns'
import Mail from '../../lib/Mail'

class NewAttendantMail {
  get key() {
    return 'new_attendant_mail'
  }

  async handle({ data: { meetup, attendant } }) {
    await Mail.sendMail({
      to: `${meetup.user.first_name} | <${meetup.user.email}>`,
      subject: `${attendant.user.first_name} ${attendant.user.last_name} is attending your event`,
      template: 'new-attendant',
      context: {
        attendant,
        meetup: {
          ...meetup,
          date: format(parseISO(meetup.date), "do 'of' MMMM, 'at' hh:mm a"),
        },
      },
    })
  }
}

export default new NewAttendantMail()
