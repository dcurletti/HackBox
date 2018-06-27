import mongoose, {Schema} from 'mongoose';

const CardSchema = new Schema({
  text: String,
  numPrompts: {type: Number, default: 1}
})

const PlayerSchema = new Schema({
  username: String,
  score: {type: Number, default: 0}
});

const RoomSchema = new Schema({
  players: [PlayerSchema],
  code: { type: String, unique: true },
});

export const Room = mongoose.model("Room", RoomSchema)
export const Card = mongoose.model("Card", CardSchema)
export const Player = mongoose.model("Player", PlayerSchema)