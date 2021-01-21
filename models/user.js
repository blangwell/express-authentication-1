// SARAH-SOLUTION BRANCH ITERATION PASSING TESTS
// appended sequelize, modelName: sequelize after hooks object
'use strict';
const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define('user', {
    email: {
      type: DataTypes.STRING,
      validate: {
        isEmail: {
          msg: 'Invalid email address'
        }
      }
    },
    name: {
      type: DataTypes.STRING,
      validate: {
        len: {
          args: [1, 99],
          msg: 'Name must be between 1 and 99 characters'
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      validate: {
        len: {
          args: [8, 99],
          msg: 'Password must be between 8 and 99 characters'
        }
      }
    }
  }, {
    hooks: {
      beforeCreate: (pendingUser, options) => {
        if (pendingUser && pendingUser.password) {
          // hash the password
          let hash = bcrypt.hashSync(pendingUser.password, 12);
          // store the hash as the user's password
          pendingUser.password = hash;
        }
      }
    },
    sequelize,
    modelName: 'user',
  });
  
  user.associate = function(models) {
    // associations can be defined here
  };

  // Compares entered password to hashed password
  user.prototype.validPassword = function(passwordTyped) {
    return bcrypt.compareSync(passwordTyped, this.password);
  };

  // remove the password before serializing
  user.prototype.toJSON = function() {
    let userData = this.get();
    delete userData.password;
    return userData;
  }

  return user;
};

/////////////////////////////////////////////////////
// TAYLOR REPO VERSION - FAILING HASH / INVALIDATE TESTS
// 'use strict';
// const bcrypt = require('bcrypt')

// const {
//   Model
// } = require('sequelize');
// module.exports = (sequelize, DataTypes) => {
//   class user extends Model {
//     /**
//      * Helper method for defining associations.
//      * This method is not a part of Sequelize lifecycle.
//      * The `models/index` file will call this method automatically.
//      */
//     static associate(models) {
//       // define association here
//     }
//   };
//   user.init({
//     name: {
//       type: DataTypes.STRING,
//       allowNull: false,
//       validate: {
//         len: {
//           args: [2,25],
//           msg: 'Name must be 2-25 characters long.'
//         }
//       }
//     },
//     email: {
//       type: DataTypes.STRING,
//       allowNull: false,
//       unique: true,
//       validate: {
//         isEmail: {
//           args: true,
//           msg: 'Please enter a valid email address.'
//         }
//       }
//     },
//     password: {
//       type: DataTypes.STRING,
//       allowNull: false,
//       validate: {
//         len: {
//           args: [8,99],
//           msg: 'Password must be between 8 and 99 characters.'
//         }
//       }
//     }
//   }, {
//     sequelize,
//     modelName: 'user',
//   });
  
//   // user.addHook('beforeCreate', async (pendingUser, options)=>{
//   //   await bcrypt.hash(pendingUser.password, 10)
//   //   .then(hashedPassword=>{
//   //     console.log(`${pendingUser.password} became -----> ${hashedPassword}`)
//   //     // replace the original password with the hash
//   //     pendingUser.password = hashedPassword
//   //   })
//   // })

//   user.addHook('beforeCreate', (pendingUser, options)=>{
//     let hashedPassword = bcrypt.hashSync(pendingUser.password, 10)
//     console.log(`${pendingUser.password} became -----> ${hashedPassword}`)
//     pendingUser.password = hashedPassword
//   })

//   user.prototype.validPassword = async function(passwordInput) {
//     let match = await bcrypt.compare(passwordInput, this.password)
//     console.log("???????????match:", match)
//     return match
//   }

//   return user;
// };

////////////////////////////////////////////////////////////
// TWO WRONGS DONT MAKE A RIGHT
// 'use strict';
// const bcrypt = require('bcrypt');
// const {
//   Model
// } = require('sequelize');
// module.exports = (sequelize, DataTypes) => {
//   class user extends Model {
//     /**
//      * Helper method for defining associations.
//      * This method is not a part of Sequelize lifecycle.
//      * The `models/index` file will call this method automatically.
//      */
//     static associate(models) {
//       // define association here
//     }
//   };
//   user.init({
//     email: {
//       type: DataTypes.STRING,
//       validate: {
//         isEmail: {
//           msg: 'Invalid Email Address Boi!'
//         }
//       }
//     },
//     name: {
//       type: DataTypes.STRING,
//       validate: {
//         len: {
//           args: [1, 99],
//           msg: 'Name must be between 1 and 99 characters!'
//         }
//       }
//     },
//     password: {
//       type: DataTypes.STRING,
//       validate: {
//         len: {
//           args: [8, 99],
//           msg: 'Password must be at least 8 characters and less than 99 my guy'
//         }
//       }
//     }
//   }, {
//     hooks: {
//       beforeCreate: (pendingUser, options) => {
//         if (pendingUser && pendingUser.password) {
//           let hashedPassword = bcrypt.hashSync(pendingUser.password, 12);
//           pendingUser.password = hashedPassword;
//         }
//       }
//     },
//     sequelize,
//     modelName: 'user',
//   });

//   // THIS CODE CAUSES VALIDATION/INVALIDATION ISSUES
//   user.addHook('beforeCreate', (pendingUser, options) => {
//     if (pendingUser && pendingUser.password) {
//       let hashedPassword = bcrypt.hashSync(pendingUser.password, 12);
//       console.log(`${pendingUser.password} >> ${hashedPassword}`);
//       pendingUser.password = hashedPassword;
//     }
//   })

//   // compares entered password to hash password, returns bool
//   user.prototype.validPassword = async function(passwordTyped) {
//     let match = await bcrypt.compareSync(passwordTyped, this.password);
//     return match
//   }

//   // remove the password prior to serializing (remove from JSON)
//   user.prototype.toJSON = function() {
//     let userData = this.get();
//     delete userData.password;
//     return userData;
//   }
  
//   return user;
// };