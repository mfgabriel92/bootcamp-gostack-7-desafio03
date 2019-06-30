import 'dotenv/config'
import Bee from 'bee-queue'
import redis from '../config/redis'
import NewAttendantMail from '../app/jobs/NewAttendantMail'

const jobs = [NewAttendantMail]

class Queue {
  constructor() {
    this.queues = {}
    this.init()
  }

  init() {
    jobs.forEach(({ key, handle }) => {
      this.queues[key] = {
        bee: new Bee(key, { redis }),
        handle,
      }
    })
  }

  createJob(queue, job) {
    return this.queues[queue].bee.createJob(job).save()
  }

  process() {
    jobs.forEach(job => {
      const { bee, handle } = this.queues[job.key]
      bee.on('failue', this.onFailure).process(handle)
    })
  }

  onFailure(job, err) {
    // eslint-disable-next-line no-console
    console.log(`${job.queue.name} error:`, err)
  }
}

export default new Queue()
