const router = require("express").Router();
const Conversation = require("../models/Conversation");
const Message = require("../models/Message");

/* new conversation */
router.post("/", async (req, res) => {
  const { users, chatName, isGroup, groupAdmin, latestMessage } = req.body;
  console.log(users);
  const newConversation = new Conversation({
    members: users,
    chatName: chatName,
    isGroup: isGroup,
    groupAdmin: groupAdmin,
    latestMessage: latestMessage,
  });
  try {
    const savedConversation = await newConversation.save();
    res.status(200).json(savedConversation);
  } catch (err) {
    res.status(500).json(err);
  }
});
//update conversation
router.put("/:conversationId", async (req, res) => {
  try {
    const conv = await Conversation.findByIdAndUpdate(
      req.params.conversationId,
      {
        $set: req.body,
      }
    );
    res.status(200).json({ message: "Conversation has been updated", conv });
  } catch (err) {
    return res.status(500).json(err);
  }
});
/* get conversations */
router.get("/:userId", async (req, res) => {
  try {
    const conversation = await Conversation.find({
      members: { $in: [req.params.userId] },
    });
    res.status(200).json(conversation);
  } catch (err) {
    res.status(500).json(err);
  }
});
/* get conversations includes two userId */

router.get("/find/:firstUserId/:secondUserId", async (req, res) => {
  try {
    const conversation = await Conversation.findOne({
      members: { $all: [req.params.firstUserId, req.params.secondUserId] },
    });
    res.status(200).json(conversation);
  } catch (err) {
    res.status(500).json(err);
  }
});

//delete converations and messages in that conversations
router.delete("/:conversationId", async (req, res) => {
  console.log(req.params.conversationId);
  try {
    Conversation.findByIdAndDelete(
      { _id: req.params.conversationId },
      (err, conv) => {
        if (err) {
          return res.status(400).json(err);
        } else if (conv) {
          Message.deleteMany(
            { conversationId: req.params.conversationId },
            (err, resp) => {
              if (err) {
                return res.status(400).json(err);
              } else {
                res.status(200).json({
                  message: "conversation has been deleted.",
                  resp: resp,
                });
              }
            }
          );
        }
      }
    );
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
