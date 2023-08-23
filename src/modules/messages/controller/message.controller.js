import messageModel from "../../../../Db/model/message.model.js";
import userModel from "../../../../Db/model/user.model.js";

export const sendMessage = async (req, res) => {
  const { reciverID } = req.params;
  const { Message } = req.body;

  const user = await userModel.findById(reciverID);

  if (!user) {
    return res.status(404).json({ message: "user not exist" });
  }

  const creatMessage = await messageModel.create({ Message, reciverID });
  return res.status(201).json({ message: "success", creatMessage });
};

export const getMessage = async (req, res) => {
  const id = req.id;
  const Masseges = await messageModel.find({ reciverID: id });
  return res.status(200).json({ message: "success", Masseges });
};

export const deleteMessage = async (req, res) => {
  const reciverID = req.id;
  const { messageId } = req.params;
  
  const user = await userModel.findById(reciverID);

  if (!user) {
    return res.status(400).json({ message: "invalied account" });
  }
  const message = await messageModel.deleteOne({ _id: messageId, reciverID });
  if (message.deletedCount == 0) {
    return res.status(400).json({ message: "invalid message id" });
  }

  return res.status(200).json({ message: "success" });
};
