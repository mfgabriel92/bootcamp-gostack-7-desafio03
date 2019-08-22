import * as Yup from 'yup'
import HTTP from '../../utils/httpResponse'

export default async (req, res, next) => {
  try {
    const schema = Yup.object().shape({
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string().required(),
    })

    await schema.validate(req.body, { abortEarly: false })
    return next()
  } catch (e) {
    return res.status(HTTP.BAD_REQUEST).json({ error: e.errors })
  }
}
