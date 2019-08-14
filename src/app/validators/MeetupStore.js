import * as Yup from 'yup'
import HTTP from '../../utils/httpResponse'

export default async (req, res, next) => {
  try {
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      description: Yup.string().required(),
      location: Yup.string().required(),
      date: Yup.date()
        .min(new Date())
        .required(),
    })

    await schema.validate(req.body, { aborEarly: false })
    return next()
  } catch ({ errors }) {
    return res.status(HTTP.BAD_REQUEST).json(errors)
  }
}
