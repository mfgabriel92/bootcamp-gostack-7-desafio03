import Sequelize, { Model } from 'sequelize'
import { isBefore } from 'date-fns'

class Meetup extends Model {
  static init(sequelize) {
    super.init(
      {
        user_id: Sequelize.INTEGER,
        banner_id: Sequelize.INTEGER,
        title: Sequelize.STRING,
        description: Sequelize.STRING,
        location: Sequelize.STRING,
        date: Sequelize.DATE,
        past: {
          type: Sequelize.VIRTUAL,
          get() {
            return isBefore(this.date, new Date())
          },
        },
      },
      {
        sequelize,
      }
    )

    return this
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' })
    this.belongsTo(models.File, { foreignKey: 'banner_id', as: 'banner' })
    this.hasMany(models.Attendant)
  }

  toJSON() {
    return {
      id: this.id,
      banner: this.banner,
      user: this.user,
      title: this.title,
      description: this.description,
      location: this.location,
      date: this.date,
      past: this.past,
    }
  }
}

export default Meetup
