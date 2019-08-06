import * as Yup from 'yup'
import HTTP from '../../utils/httpResponse'

export default async (req, res, next) => {
  try {
    const schema = Yup.object().shape({
      first_name: Yup.string().required(),
      last_name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string()
        .required()
        .min(8),
    })

    await schema.validate(req.body, { aborEarly: false })
    return next()
  } catch (e) {
    return res.status(HTTP.BAD_REQUEST).json({ error: e.errors })
  }
}
