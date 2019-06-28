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
        password: Sequelize.STRING,
      },
      {
        sequelize,
      }
    )

    this.addHook('beforeSave', async user => {
      if (user.password) {
        user.password = await bcrypt.hash(user.password, 10)
      }
    })

    return this
  }

  isPasswordCorrect(password) {
    return bcrypt.compare(password, this.password)
  }

  toJSON() {
    return {
      id: this.id,
      first_name: this.first_name,
      middle_name: this.middle_name,
      last_name: this.last_name,
    }
  }
}

export default User
