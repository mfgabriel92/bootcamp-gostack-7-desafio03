import Sequelize, { Model } from 'sequelize'

class File extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        path: {
          type: Sequelize.VIRTUAL,
          get() {
            return `${process.env.APP_URL}/files/${this.name}`
          },
        },
      },
      {
        sequelize,
      }
    )

    return this
  }

  toJSON() {
    return {
      name: this.name,
      path: this.path,
    }
  }
}

export default File
