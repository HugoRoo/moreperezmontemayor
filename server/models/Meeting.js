import mongoose from 'mongoose'

const meetingSchema = new mongoose.Schema({
  url:       { type: String, required: true },
  label:     { type: String, default: 'Sesión semanal' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true })

export default mongoose.model('Meeting', meetingSchema)
