import Sequelize, { Model } from 'sequelize'
import bcrypt from 'bcryptjs'

class User extends Model {
  static init(sequelize) {
    super.init(
      {
        first_name: Sequelize.STRING,
        middle_name: Sequelize.STRING,
        last_name: Sequelize.STRING,
        email: Sequelize.STRING,
        password: Sequelize.VIRTUAL,
        password_hash: Sequelize.STRING,
      },
      {
        sequelize,
      }
    )

    this.addHook('beforeSave', async user => {
      if (user.password) {
        user.password_hash = await bcrypt.hash(user.password, 10)
      }
    })

    return this
  }

  static associate(models) {
    this.belongsTo(models.File, { foreignKey: 'avatar_id', as: 'avatar' })
  }

  isPasswordCorrect(password) {
    return bcrypt.compare(password, this.password_hash)
  }

  toJSON() {
    return {
      id: this.id,
      avatar: this.avatar,
      first_name: this.first_name,
      middle_name: this.middle_name,
      last_name: this.last_name,
      email: this.email,
    }
  }
}

export default User
