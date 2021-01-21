'use strict';
const bcrypt = require('bcrypt');
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
    validPassword(passwordTyped) {
      let match = bcrypt.compareSync(passwordTyped, this.password);
      return match;
    }
    toJSON() {
      let userData = this.get();
      delete userData.password;
      return userData;
    }
  };
  user.init({
    email: {
      type: DataTypes.STRING,
      validate: {
        isEmail: {
          msg: 'Invalid Email Address Boi!'
        }
      }
    },
    name: {
      type: DataTypes.STRING,
      validate: {
        len: {
          args: [1, 99],
          msg: 'Name must be between 1 and 99 characters!'
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      validate: {
        len: {
          args: [8, 99],
          msg: 'Password must be at least 8 characters and less than 99 my guy'
        }
      }
    }
  }, {
    hooks: {
      beforeCreate: (pendingUser, options) => {
        if (pendingUser && pendingUser.password) {
          let hashedPassword = bcrypt.hashSync(pendingUser.password, 12);
          pendingUser.password = hashedPassword;
        }
      }
    },
    sequelize,
    modelName: 'user',
  });

  // THIS CODE CAUSES VALIDATION/INVALIDATION ISSUES
  // user.addHook('beforeCreate', (pendingUser, options) => {
  //   if (pendingUser && pendingUser.password) {
  //     let hashedPassword = bcrypt.hashSync(pendingUser.password, 10);
  //     console.log(`${pendingUser.password} >> ${hashedPassword}`);
  //     pendingUser.password = hashedPassword;
  //   }
  // })

  // compares entered password to hash password, returns bool
  // user.prototype.validPassword = async function(passwordTyped) {
  //   let match = await bcrypt.compareSync(passwordTyped, this.password);
  //   return match
  // }

  // remove the password prior to serializing (remove from JSON)
  // user.prototype.toJSON = function() {
  //   let userData = this.get();
  //   delete userData.password;
  //   return userData;
  // }
  
  return user;
};