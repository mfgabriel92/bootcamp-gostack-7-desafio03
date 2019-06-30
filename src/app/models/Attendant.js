import Sequelize, { Model } from 'sequelize'

class Attendant extends Model {
  static init(sequelize) {
    super.init(
      {
        user_id: Sequelize.INTEGER,
        meetup_id: Sequelize.INTEGER,
      },
      {
        sequelize,
      }
    )

    return this
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' })
    this.belongsTo(models.Meetup, { foreignKey: 'meetup_id', as: 'meetup' })
  }

  toJSON() {
    return {
      id: this.id,
      user: this.user,
      meetup: this.meetup,
    }
  }
}

export default Attendant
