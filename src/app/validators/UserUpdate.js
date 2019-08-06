import * as Yup from 'yup'
import HTTP from '../../utils/httpResponse'

export default async (req, res, next) => {
  try {
    const schema = Yup.object().shape({
      first_name: Yup.string(),
      middle_name: Yup.string(),
      last_name: Yup.string(),
      email: Yup.string().email(),
      oldPassword: Yup.string().min(8),
      password: Yup.string()
        .min(8)
        .when('oldPassword', (oldPassword, field) =>
          oldPassword ? field.required() : field
        ),
      confirmPassword: Yup.string().when('oldPassword', (password, field) =>
        password ? field.required().oneOf([Yup.ref('password')]) : field
      ),
    })

    await schema.validate(req.body, { aborEarly: false })
    return next()
  } catch (e) {
    return res.status(HTTP.BAD_REQUEST).json({ error: e.errors })
  }
}
