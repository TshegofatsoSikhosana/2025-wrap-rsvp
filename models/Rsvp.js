import mongoose from 'mongoose';

function arrayLimit(val) {
  return val.length <= 5;
}

const RsvpSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide your name'],
    maxlength: [60, 'Name cannot be more than 60 characters'],
  },
  attending: {
    type: String, // 'yes', 'no', 'maybe'
    required: [true, 'Please specify if you are attending'],
    enum: ['yes', 'no', 'maybe'],
  },
  plusOne: {
    type: Boolean,
    default: false,
  },
  guestCount: {
    type: Number,
    default: 0,
    min: [0, 'Guest count cannot be negative'],
    max: [10, 'Guest count cannot be more than 10'],
  },
  plusOneName: {
    type: String,
    maxlength: [100, 'Name(s) cannot be more than 100 characters'],
  },
  songRequests: {
    type: [String],
    validate: [arrayLimit, '{PATH} exceeds the limit of 5'],
  },
  dietaryRestrictions: {
    type: String,
    maxlength: [200, 'Dietary restrictions cannot be more than 200 characters'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Rsvp || mongoose.model('Rsvp', RsvpSchema);
