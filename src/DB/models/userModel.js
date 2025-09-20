import { get, model, Schema, set, Types } from 'mongoose'
import { decryption, encryption } from '../../utils/CRYPTO.js'
import { compare_hash } from '../../utils/bycript.js'





export const Gender = {
  male: 'male',
  female: 'female',
}
Object.freeze(Gender)
export const Roles = {
  user: 'user',
  admin: 'admin',
}
export const providers = {
  system: 'system',
  google: 'google',
}
const otpSchema = new Schema(
  {
    otp: String,
    expiredAt: Date,
  },
  {
    _id: false,
  }
)
Object.freeze(Roles)
export const userSchema = new Schema(
  {
    F_name: {
      type: String,
      required: true,
    },
    L_name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: function () {
        if (this.provider == providers.google) {
          return false
        } else if (this.provider == providers.system) {
          return true
        }
      },
    },
    age: {
      type: Number,
      min: 20,
      max: 50,
    },
    gender: {
      type: String,
      enum: Object.values(Gender),
      required: true,
      default: Gender.male,
    },
    role: {
      type: String,
      enum: Object.values(Roles),
      default: Roles.user,
      required: true,
    },
    phone: {
      type: String,
      require: function () {
        if (this.provider == providers.google) {
          return false
        } else if (this.provider == providers.system) {
          return true
        }
      },
      set(value) {
        return encryption(value)
      },
      get(value) {
        return decryption(value)
      },
    },
    confirmed: {
      type: Boolean,
      default: false,
    },
    emailOtp: otpSchema,
    oldEmailOtp: otpSchema,
    newEmailOtp: otpSchema,
    passwordOtp: otpSchema,
    newEmail:String,
    changedCredentialsAt: Date,
    provider: {
      type: String,
      enum: [providers.system, providers.google],
      default: providers.system,
    }, isDeleted: {
      type: Boolean,
      default: false,
      
      
    }, DeletedBy: {
      type: Types.ObjectId,
      ref:"user"
      
    },
    profileImage:String,
    fieldAttempts: {
      type: Number,
      default: 0,
    },
    otpBan: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: {
      getters: true,
    },
    toObject: {
      getters: true,
    },
    virtuals: {
      FULL_NAME: {
        get() {
          return this.F_name + ' ' + this.L_name
        },
      },
    },
    methods: {
      CHECK_PASSWORD(password) {
        return compare_hash(password, this.password)
      },
    },
  }
)
export const userModel = model('user', userSchema)
