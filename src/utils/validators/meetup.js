import * as Yup from 'yup'

const newMeetup = Yup.object().shape({
  title: Yup.string().required(),
  description: Yup.string().required(),
  location: Yup.string().required(),
  date: Yup.date()
    .min(new Date())
    .required(),
})

const updateMeetup = Yup.object().shape({
  title: Yup.string(),
  description: Yup.string(),
  location: Yup.string(),
  date: Yup.date().min(new Date()),
})

export { newMeetup, updateMeetup }
