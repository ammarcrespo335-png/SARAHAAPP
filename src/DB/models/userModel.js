import { get, model, Schema, set } from 'mongoose'
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
      required: true,
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
      required: true,
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
    emailOtp: {
      otp: String,
      expiredAt: Date,
    },
    passwordOtp: {
      otp: String,
      expiredAt: Date,
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
