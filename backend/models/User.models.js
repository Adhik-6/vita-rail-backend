import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  phone: {
    type: String,
    required: [true, "Phone number is required"],
    unique: true,
    minlength: [10, "Phone number must be at least 10 digits long"],
    trim: true,
    validate: {
      validator: function(v) {
        return /^(?:\+91|91|0)?[6-9]\d{9}$/.test(v); 
      },
      message: props => `${props.value} is not a valid phone number!`
    }
  },
  dob: {
    type: Date,
    required: [true, "Date of birth is required"],
    validate: {
      validator: function(v) {
        return v <= new Date(); // Ensure date is not in the future
      },
      message: props => `Date of birth cannot be in the future!`
    },
  },
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true,
    minlength: [3, "Name must be at least 3 characters long"],
    maxlength: [50, "Name must be at most 50 characters long"],
    validate: {
      validator: function(v) {
        return /^[a-zA-Z\s]+$/.test(v); 
      },
      message: props => `${props.value} is not a valid name!`
    }, 
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    trim: true,
    validate: {
      validator: function(v) {
        return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(v);
      },
      message: props => `${props.value} is not a valid email!`
    }
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [8, "Password must be at least 8 characters long"],
    validate: {
      validator: function(v) {
        return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(v); 
      },
      message: props => `${props.value} is not a valid password!`
    },
    select: false,
  },
  userId: {
    type: String,
    required: [true, "User ID is required"],
    unique: true,
    trim: true,
    minlength: [6, "User ID must be at least 6 characters long"],
    maxlength: [50, "User ID must be at most 50 characters long"],
    validate: {
      validator: function(v) {
        return /^[a-zA-Z0-9]+$/.test(v);
      },
      message: props => `${props.value} is not a valid User ID!`
    }
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  }
}, { 
  timestamps: true 
});
// userId, aadhar

userSchema.pre('save', async function(next) {
  if (!this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err)
  }
})

userSchema.methods.comparePassword = async function(inputPassword) {
  return await bcrypt.compare(inputPassword, this.password);
}

const User = mongoose.model("User", userSchema)

export default User
