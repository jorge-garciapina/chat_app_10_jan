// Importing the necessary modules and environmental variables
const express = require("express");
const Conversation = require("../models/conversationModel"); // Import the Conversation model
// eslint-disable-next-line
const router = express.Router();
router.post("/addAdmin", async (req, res) => {
  try {
    // Step 1: Extract required fields from the request body
    const {conversationId, validatedUser, newAdmins} = req.body;


    // Step 2: Validate the request parameters
    if (!conversationId || !validatedUser || !newAdmins || !Array.isArray(newAdmins)) {
      return res.status(400).json({error: "Invalid request parameters"});
    }

    // Step 3: Retrieve the conversation from the database
    const conversation = await Conversation.findById(conversationId);

    // Step 4: Check if the conversation exists
    if (!conversation) {
      return res.status(404).json({error: "Conversation not found"});
    }

    // Step 5: Validate if the 'validatedUser' is an admin or if admins array is empty
    if (!conversation.admins.includes(validatedUser) && conversation.admins.length > 0) {
      return res.status(403).json({error: "No permission for this operation"});
    }

    // Step 6: Validate if 'newAdmins' are participants in the conversation
    const invalidAdmins = newAdmins.filter((admin) => !conversation.participants.includes(admin));
    if (invalidAdmins.length > 0) {
      return res.status(403).json({
        error: "All new admins must be participants in the conversation",
      });
    }

    // Step 7: Add only new admins to the 'admins' array
    const uniqueNewAdmins = newAdmins.filter((admin) => !conversation.admins.includes(admin));
    if (uniqueNewAdmins.length > 0) {
      conversation.admins.push(...uniqueNewAdmins);
    }

    // Step 8: Save the updated conversation to the database
    await conversation.save();

    // Step 9: Respond with a success message
    res.status(200).json({
      message: "New admins added successfully",
      admins: conversation.admins,
      conversationId,
      participants: conversation.participants,
    });
  } catch (error) {
    // Step 10: Log the error and respond with a server error message
    console.error("Server Error:", error);
    res.status(500).json({error: "Server Error: " + error.message});
  }
});

router.post("/addChatMember", async (req, res) => {
  try {
    const {conversationId, namesToAdd} = req.body;

    if (!conversationId || !namesToAdd || !Array.isArray(namesToAdd)) {
      return res.status(400).json({error: "Invalid request parameters"});
    }

    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({error: "Conversation not found"});
    }

    const addedNames = [];
    for (const name of namesToAdd) {
      if (!conversation.participants.includes(name)) {
        if (!conversation.observers.includes(name)) {
          conversation.observers.push(name);
        }
        conversation.participants.push(name);
        addedNames.push(name);
      }
    }

    await conversation.save();

    const {...conversationWithoutMessages} = conversation.toObject();

    res.status(200).json({
      message: `Added to the conversation: ${addedNames.join(", ")}`,
      conversation: conversationWithoutMessages,
    });
  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({error: "Server error: " + error.message});
  }
});

router.post("/addMessageToConversation", async (req, res) => {
  try {
    // Extract all the necessary fields from the request body
    // Removed 'sender', added 'validatedUser'
    const {conversationId,
      content,
      validatedUser,
      openConversationsByOnlineUsers,
      onlineParticipants} = req.body;

    // Validate the request body
    // Removed the 'sender' validation
    if (!conversationId || !validatedUser || !content) {
      return res.status(400).json({error: "Invalid request parameters"});
    }

    // Find the existing conversation by its ID
    const conversation = await Conversation.findById(conversationId);

    // Check if the conversation exists
    if (!conversation) {
      return res.status(404).json({error: "Conversation not found"});
    }

    const participantsInConversation = conversation.participants;

    // To filter users who have open the current conversation
    const recievers = openConversationsByOnlineUsers.filter((user)=>{
      return user.conversationId === conversationId && onlineParticipants.includes(user.username);
    });

    // This is just to extract the usernames from the recievers
    const recieversThatSeeTheMessages = recievers.map((user) => user.username);

    if (participantsInConversation.indexOf(validatedUser) === -1) {
      return res.status(404).json({error: "User is not part of this conversation"});
    }

    // Extract the participants field from the conversation and filter out the validatedUser
    const receivers = conversation.participants;

    // Determine the index for the new message
    const newIndex = conversation.messages.length;

    const seenByAllReceivers = receivers.length === recieversThatSeeTheMessages.length &&
    recieversThatSeeTheMessages.every((element) => receivers.includes(element));

    const deliveredToAllReceivers = receivers.length === onlineParticipants.length &&
    onlineParticipants.every((element) => receivers.includes(element));

    const date = new Date();
    // Create the new message object
    // Replaced 'sender' with 'validatedUser'
    const newMessage = {
      sender: validatedUser,
      receivers,
      date: conversation.date,
      content,
      index: newIndex,
      deliveredTo: onlineParticipants,
      seenBy: recieversThatSeeTheMessages,
      isVisible: true,
      seenByAllReceivers,
      deliveredToAllReceivers,
      date,
    };

    // Add the new message to the conversation
    conversation.messages.push(newMessage);

    // Save the updated conversation
    await conversation.save();

    // Respond with a success message
    res.status(201).json({
      message: "Message successfully added",
      newMessage,
    });
  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({error: "Server error: " + error.message});
  }
});

// Route to add a username to 'deliveredTo' for a specific message in a conversation
router.post("/addNameTodeliveredTo", async (req, res) => {
  try {
    // Extract data from request body
    const {conversationId, messageIndex, usernames, validatedUser} = req.body;
    usernames.push(validatedUser);

    // Convert messageIndex to a Number
    const msgIndex = Number(messageIndex);

    // Find the conversation by its ID
    const conversation = await Conversation.findById(conversationId);

    // Check if conversation and message exist
    if (!conversation) {
      return res.status(404).json({error: "Conversation not found"});
    }

    // Find the message within the conversation by its index
    const message = conversation.messages.find((msg) => msg.index === msgIndex);

    if (!message) {
      return res.status(404).json({error: "Message not found"});
    }

    // Add the username to the 'deliveredTo' array
    // message.deliveredTo.push(username);
    message.deliveredTo = message.deliveredTo.concat(usernames);


    // Save the updated conversation
    await conversation.save();

    res.status(200).json({message: "Username added to deliveredTo"});
  } catch (error) {
    // Log the error and respond with a 500 status code
    console.error("Server Error:", error);
    res.status(500).json({error: "Server error: " + error.message});
  }
});

// Route to add a username to 'seenBy' for a specific message in a conversation
router.post("/addNameToseenBy", async (req, res) => {
  try {
    // Extract data from request body
    const {conversationId, messageIndex, username} = req.body;

    // Convert messageIndex to a Number
    const msgIndex = Number(messageIndex);

    // Find the conversation by its ID
    const conversation = await Conversation.findById(conversationId);

    // Check if conversation and message exist
    if (!conversation) {
      return res.status(404).json({error: "Conversation not found"});
    }

    // Find the message within the conversation by its index
    const message = conversation.messages.find((msg) => msg.index === msgIndex);

    if (!message) {
      return res.status(404).json({error: "Message not found"});
    }

    // Add the username to the 'seenBy' array
    message.seenBy.push(username);

    // Save the updated conversation
    await conversation.save();

    res.status(200).json({message: "Username added to seenBy"});
  } catch (error) {
    // Log the error and respond with a 500 status code
    console.error("Server Error:", error);
    res.status(500).json({error: "Server error: " + error.message});
  }
});

// Endpoint to create a new conversation
router.post("/createConversation", async (req, res) => {
  try {
    // Step 1: Extract the required fields from the request body
    const {participants, name, isGroupalChat, validatedUser} = req.body;

    // Step 2: Validate the request. For example, it should have at least two participants.
    if (!participants || participants.length < 2) {
      return res.status(400).json({error: "Invalid participants"});
    }

    // Step 3: Initialize the admins array with the validatedUser
    const admins = [validatedUser];

    // Step 4: Create a new Conversation document with admins field
    const newConversation = new Conversation({
      participants,
      name,
      isGroupalChat,
      messages: [],
      admins,
      observers: participants,
      date: new Date(),
    });

    // Step 5: Save the new Conversation to the database
    await newConversation.save();

    // Step 6: Respond with a success message and the ID of the new conversation
    res.status(201).json({
      message: "New conversation created",
      conversationId: newConversation._id,
    });
  } catch (error) {
    // Log the full error if something goes wrong
    console.error("Server Error:", error);
    res.status(500).json({error: "Server Error: " + error.message});
  }
});

router.post("/deleteMessage", async (req, res) => {
  try {
    // Step 1: Extract conversation ID and message index from the request body
    const {conversationId, messageIndex, validatedUser} = req.body;

    // Step 2: Validate the request body
    if (!conversationId || !messageIndex) {
      return res.status(400).json({error: "Invalid request parameters"});
    }

    // Step 3: Find the conversation by its ID
    const conversation = await Conversation.findById(conversationId);

    // Step 4: Check if the conversation exists
    if (!conversation) {
      return res.status(404).json({error: "Conversation not found"});
    }

    // CONSIDER THAT ONLY THE USER WHO SENT THE MESSAGE CAN DELETE THAT MESSAGE

    // Step 5: Check if the message exists
    const message = conversation.messages[messageIndex];
    if (!message) {
      return res.status(404).json({error: "Message not found"});
    }

    // Only the sender can modify the message
    if (message.sender === validatedUser) {
      // Step 6: Update the isVisible field of the message to false
      message.isVisible = false;
      // Step 7: Save the updated conversation to the database
      await conversation.save();
    } else {
      return res.status(404).json({error: "Only sender can modify message"});
    }

    // Step 8: Send a response indicating the operation was successful
    res.status(200).json({message: "Message visibility set to false"});
  } catch (error) {
    // Log the error and respond with a 500 status code
    console.error("Server Error:", error);
    res.status(500).json({error: "Server error: " + error.message});
  }
});

router.post("/deleteObserver", async (req, res) => {
  try {
    // Step 1: Extract conversation ID and message index from the request body
    const {conversationId, validatedUser} = req.body;


    // Step 2: Validate the request body
    if (!conversationId || !validatedUser) {
      return res.status(400).json({error: "Invalid request parameters"});
    }

    // Step 3: Find the conversation by its ID
    const conversation = await Conversation.findById(conversationId);

    // Step 4: Check if the conversation exists
    if (!conversation) {
      return res.status(404).json({error: "Conversation not found"});
    }

    // Step 5: Check if the message exists
    conversation.observers = conversation.observers.filter((username)=>{
      return username !== validatedUser;
    });

    // Step 6: Update the isVisible field of the message to false
    await conversation.save();

    // Step 8: Send a response indicating the operation was successful
    res.status(200).json({observers: conversation.observers});
  } catch (error) {
    // Log the error and respond with a 500 status code
    console.error("Server Error:", error);
    res.status(500).json({error: "Server error: " + error.message});
  }
});

router.get("/getConversationInfo/:conversationId", async (req, res) => {
  try {
    // Extract the conversation ID from the request parameters
    const {conversationId} = req.params;
    const {validatedUser} = req.query;

    // Fetch the conversation from MongoDB using its ID
    const conversation = await Conversation.findById(conversationId);

    // Check if the conversation exists
    if (!conversation) {
      return res.status(404).json({error: "Conversation not found"});
    }

    // Extract the relevant fields
    const {name, participants, isGroupalChat, messages, admins, date} = conversation;

    // Filter messages where validatedUser is in the deliveredTo array and the message is visible
    const filteredMessages = messages.filter((message) =>
      message.receivers.includes(validatedUser) && message.isVisible
    );

    // Respond with the required conversation information
    res.status(200).json({
      name,
      participants,
      admins,
      isGroupalChat,
      messages: filteredMessages,
      date,
    });
  } catch (error) {
    // Log the error and respond with a 500 status code
    console.error("Server Error:", error);
    res.status(500).json({error: "Server error: " + error.message});
  }
});

// Route to get 'deliveredTo' array for a specific message in a conversation
router.get(
  "/getDeliveredTo/:conversationId/:messageIndex",
  async (req, res) => {
    try {
      // Parse the conversation ID and message index from the request parameters
      const {conversationId, messageIndex} = req.params;

      // Convert messageIndex to a Number
      const msgIndex = Number(messageIndex);

      // Fetch the conversation from MongoDB using its ID
      const conversation = await Conversation.findById(conversationId);

      // Check if the conversation exists
      if (!conversation) {
        return res.status(404).json({error: "Conversation not found"});
      }

      // Find the message by its index
      const message = conversation.messages.find(
        (msg) => msg.index === msgIndex,
      );

      // Check if the message exists
      if (!message) {
        return res.status(404).json({error: "Message not found"});
      }

      // Respond with the 'deliveredTo' array of the message
      res.status(200).json({deliveredTo: message.deliveredTo});
    } catch (error) {
      // Log the error and respond with a 500 status code
      console.error("Server Error:", error);
      res.status(500).json({error: "Server error: " + error.message});
    }
  },
);

router.get("/getLastMessage/:conversationId", async (req, res) => {
  try {
    const {conversationId} = req.params;
    const {validatedUser} = req.query;

    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
      return res.status(404).json({error: "Conversation not found"});
    }

    // Filter messages where validatedUser is in the deliveredTo array
    const filteredMessages = conversation.messages.filter((message) =>
      message.receivers.includes(validatedUser)
    );

    // Get the last message from the filtered messages array
    const lastMessage = filteredMessages.pop();

    res.status(200).json({lastMessage});
  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({error: "Server error: " + error.message});
  }
});


router.get("/getParticipants/:conversationId", async (req, res) => {
  try {
    // Extract the conversation ID from the request parameters
    const {conversationId} = req.params;

    // Fetch the conversation from MongoDB using its ID
    const conversation = await Conversation.findById(conversationId);

    // Check if the conversation exists
    if (!conversation) {
      return res.status(404).json({error: "Conversation not found"});
    }

    // Extract the relevant fields
    const {participants} = conversation;

    // Respond with the required conversation information
    res.status(200).json({
      participants,
    });
  } catch (error) {
    // Log the error and respond with a 500 status code
    console.error("Server Error:", error);
    res.status(500).json({error: "Server error: " + error.message});
  }
});

// Route to get 'seenBy' array for a specific message in a conversation
router.get("/getSeenBy/:conversationId/:messageIndex", async (req, res) => {
  try {
    // Parse the conversation ID and message index from the request parameters
    const {conversationId, messageIndex} = req.params;

    // Convert messageIndex to a Number
    const msgIndex = Number(messageIndex);

    // Fetch the conversation from MongoDB using its ID
    const conversation = await Conversation.findById(conversationId);

    // Check if the conversation exists
    if (!conversation) {
      return res.status(404).json({error: "Conversation not found"});
    }

    // Find the message by its index
    const message = conversation.messages.find((msg) => msg.index === msgIndex);

    // Check if the message exists
    if (!message) {
      return res.status(404).json({error: "Message not found"});
    }

    // Respond with the 'seenBy' array of the message
    res.status(200).json({seenBy: message.seenBy});
  } catch (error) {
    // Log the error and respond with a 500 status code
    console.error("Server Error:", error);
    res.status(500).json({error: "Server error: " + error.message});
  }
});

// Route to modify the name of a conversation
router.post("/modifyConversationDate", async (req, res) => {
  try {
    // Step 1: Extract conversation ID and the new name from the request body
    const {conversationId} = req.body;

    // Step 2: Validate the request body
    if (!conversationId) {
      return res.status(400).json({error: "Invalid request parameters"});
    }

    // Step 3: Find the conversation by its ID
    const conversation = await Conversation.findById(conversationId);

    // Step 4: Check if the conversation exists
    if (!conversation) {
      return res.status(404).json({error: "Conversation not found"});
    }

    // Step 5: Update the name field of the conversation
    conversation.date = new Date();

    // Step 6: Save the updated conversation to the database
    await conversation.save();

    // Step 7: Send a response indicating the operation was successful
    res.status(200).json({
      message: "Conversation name updated successfully",
      participants: conversation.participants,
    });
  } catch (error) {
    // Log the error and respond with a 500 status code
    console.error("Server Error:", error);
    res.status(500).json({error: "Server error: " + error.message});
  }
});

// Route to modify the name of a conversation
router.post("/modifyConversationName", async (req, res) => {
  try {
    // Step 1: Extract conversation ID and the new name from the request body
    const {conversationId, newName} = req.body;

    // Step 2: Validate the request body
    if (!conversationId || !newName) {
      return res.status(400).json({error: "Invalid request parameters"});
    }

    // Step 3: Find the conversation by its ID
    const conversation = await Conversation.findById(conversationId);

    // Step 4: Check if the conversation exists
    if (!conversation) {
      return res.status(404).json({error: "Conversation not found"});
    }

    // Step 5: Update the name field of the conversation
    conversation.name = newName;

    // Step 6: Save the updated conversation to the database
    await conversation.save();

    // Step 7: Send a response indicating the operation was successful
    res.status(200).json({
      message: "Conversation name updated successfully",
      participants: conversation.participants,
    });
  } catch (error) {
    // Log the error and respond with a 500 status code
    console.error("Server Error:", error);
    res.status(500).json({error: "Server error: " + error.message});
  }
});

// Route to notify chats of a user's connection
router.post("/notifyChatsOfSeenMessages", async (req, res) => {
  try {
    // Extract data from request body
    const {validatedUser, conversationId} = req.body;

    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      // If a conversation is not found, continue to the next one
      console.warn(`Conversation ${conversationId} not found`);
    }

    for (let i = conversation.messages.length - 1; i >= 0; i--) {
      const message = conversation.messages[i];

      // Check if username is already in 'seenBy'
      if (!message.seenBy.includes(validatedUser) && message.receivers.includes(validatedUser)) {
      // Add the username to 'seenBy' if not present
        message.seenBy.push(validatedUser);
        hasUpdated = true;
        if (message.receivers.length === message.seenBy.length &&
          message.seenBy.every((element) => message.receivers.includes(element))) {
          message.seenByAllReceivers = true;
        }
      } else {
      // If username is found in 'seenBy', stop process
        break;
      }
    }
    await conversation.save();

    res.status(200).json({message: "Conversations have been updated"});
  } catch (error) {
    // Log the error and respond with a 500 status code
    console.error("Server Error:", error);
    res.status(500).json({error: "Server error: " + error.message});
  }
});

// Route to notify chats of a user's connection
router.post("/notifyChatsOfUserConnection", async (req, res) => {
  try {
    // Extract data from request body
    const {validatedUser, conversationsIDs} = req.body;

    for (const conversationId of conversationsIDs) {
      // Find the conversation by its ID
      const conversation = await Conversation.findById(conversationId);

      if (!conversation) {
        // If a conversation is not found, continue to the next one
        console.warn(`Conversation ${conversationId} not found`);
        continue;
      }

      // Iterate over the messages from last to first
      let hasUpdated = false;
      for (let i = conversation.messages.length - 1; i >= 0; i--) {
        const message = conversation.messages[i];

        // Check if username is already in 'deliveredTo' and if he is a reciever
        if (!message.deliveredTo.includes(validatedUser) && message.receivers.includes(validatedUser)) {
          // Add the username to 'deliveredTo' if not present
          message.deliveredTo.push(validatedUser);
          hasUpdated = true;
          // In case it has been deliverd to all the users, then change the deliveredToAllReceivers
          if (message.receivers.length === message.deliveredTo.length &&
            message.deliveredTo.every((element) => message.receivers.includes(element))) {
            message.deliveredToAllReceivers = true;
          }
        } else {
          // If username is found in 'deliveredTo', stop processing this conversation
          break;
        }
      }

      // Save the updated conversation if there were any changes
      if (hasUpdated) {
        await conversation.save();
      }
    }

    res.status(200).json({message: "Conversations have been updated"});
  } catch (error) {
    // Log the error and respond with a 500 status code
    console.error("Server Error:", error);
    res.status(500).json({error: "Server error: " + error.message});
  }
});

// New route to notify that messages have been delivered to a user across multiple conversations
router.post("/notifyMessageIsDelivered", async (req, res) => {
  try {
    // Step 1: Extract conversation IDs and username from the request body
    const {conversationIds, username} = req.body;

    // Step 2: Validate the request body
    if (!Array.isArray(conversationIds) || !username) {
      return res.status(400).json({error: "Invalid request parameters"});
    }

    // Step 3: Iterate over each conversation ID
    for (const id of conversationIds) {
      const conversation = await Conversation.findById(id);

      // Check if the conversation exists
      if (conversation) {
        // Step 4: Iterate over messages in reverse (starting from the latest)
        for (let i = conversation.messages.length - 1; i >= 0; i--) {
          const message = conversation.messages[i];

          // Step 5: Check if the username is already in 'deliveredTo'
          if (message.deliveredTo.includes(username)) {
            // If found, break the loop to stop further checking for this conversation
            break;
          } else {
            // Step 6: Add the username to 'deliveredTo' for this message
            message.deliveredTo.push(username);

            // Update the database
            await conversation.save();
          }
        }
      }
    }

    // Step 7: Send a response indicating the operation was successful
    res
      .status(200)
      .json({message: "Updated deliveredTo for multiple conversations"});
  } catch (error) {
    console.error("Server Error:", error); // Log the full error
    res.status(500).json({error: "Server Error: " + error.message});
  }
});

router.post("/removeAdmin", async (req, res) => {
  try {
    // Step 1: Extract required fields from the request body
    const {conversationId, validatedUser, adminsToRemove} = req.body;

    // Step 2: Validate the request parameters
    if (!conversationId || !validatedUser || !adminsToRemove || !Array.isArray(adminsToRemove)) {
      return res.status(400).json({error: "Invalid request parameters"});
    }

    // Step 3: Retrieve the conversation from the database
    const conversation = await Conversation.findById(conversationId);

    // Step 4: Check if the conversation exists
    if (!conversation) {
      return res.status(404).json({error: "Conversation not found"});
    }

    // Step 5: Validate if the 'validatedUser' is an admin
    if (!conversation.admins.includes(validatedUser)) {
      return res.status(403).json({error: "No permission for this operation"});
    }

    // Step 6: Validate that the admins to remove are currently admins
    const invalidAdminsToRemove = adminsToRemove.filter((admin) => !conversation.admins.includes(admin));
    if (invalidAdminsToRemove.length > 0) {
      return res.status(403).json({
        error: "All admins to remove must currently be admins of the conversation",
      });
    }

    // Step 7: Remove the specified admins
    conversation.admins = conversation.admins.filter((admin) => !adminsToRemove.includes(admin));

    // Step 8: Save the updated conversation to the database
    await conversation.save();

    res.status(200).json({
      message: "Admins removed successfully",
      admins: conversation.admins,
      conversationId: conversation._id,
      participants: conversation.participants,
    });
  } catch (error) {
    // Step 9: Log the error and respond with a server error message
    console.error("Server Error:", error);
    res.status(500).json({error: "Server Error: " + error.message});
  }
});

// Route to remove a member from a conversation
router.post("/removeChatMember", async (req, res) => {
  try {
    // Step 1: Extract conversationId and nameToRemove from the request body
    const {conversationId, nameToRemove} = req.body;

    // Step 2: Validate the request parameters
    if (!conversationId || !nameToRemove) {
      return res.status(400).json({error: "Invalid request parameters"});
    }

    // Step 3: Retrieve the conversation by its ID
    const conversation = await Conversation.findById(conversationId);

    // Step 4: Check if the conversation exists
    if (!conversation) {
      return res.status(404).json({error: "Conversation not found"});
    }

    // Step 5: Find and remove the member from the participants array
    const index = conversation.participants.indexOf(nameToRemove);
    if (index > -1) {
      conversation.participants.splice(index, 1);
    } else {
      return res
        .status(404)
        .json({error: "Member name not found in conversation"});
    }

    // Step 6: Save the updated conversation object
    await conversation.save();

    // Step 7: Return the success message and updated participants array
    res.status(200).json({
      message: "Member removed from the conversation",
      conversation,
    });
  } catch (error) {
    // Handle errors and log them
    console.error("Server Error:", error);
    res.status(500).json({error: "Server Error: " + error.message});
  }
});


// Endpoint to remove a conversation
router.delete("/removeConversation/:conversationId", async (req, res) => {
  try {
    const {conversationId} = req.params;

    // Step 1: Find and remove the conversation from the database
    const result = await Conversation.findByIdAndRemove(conversationId);

    if (!result) {
      return res.status(404).json({error: "Conversation not found"});
    }

    // Step 2: Send a success response
    res.status(200).json({message: "Conversation removed"});
  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({error: "Server Error: " + error.message});
  }
});


router.put("/updateUsername", async (req, res) => {
  const {validatedUser, newName} = req.body;

  if (!validatedUser || !newName) {
    return res.status(400).send("Both validatedUser and newName are required");
  }

  try {
    // Update username in conversations (participants, admins, observers)
    await Conversation.updateMany(
      {participants: validatedUser},
      {$set: {"participants.$": newName}}
    );
    await Conversation.updateMany(
      {admins: validatedUser},
      {$set: {"admins.$": newName}}
    );
    await Conversation.updateMany(
      {observers: validatedUser},
      {$set: {"observers.$": newName}}
    );

    // Fetch conversations where the user is a participant
    const conversations = await Conversation.find({participants: newName});

    for (const conversation of conversations) {
      let isUpdated = false;

      conversation.messages.forEach((message) => {
        // Check and update the sender
        if (message.sender === validatedUser) {
          message.sender = newName;
          isUpdated = true;
        }

        // Check and update the receivers, deliveredTo, and seenBy arrays
        ["receivers", "deliveredTo", "seenBy"].forEach((field) => {
          if (message[field].includes(validatedUser)) {
            message[field] = message[field].map((user) => user === validatedUser ? newName : user);
            isUpdated = true;
          }
        });
      });

      // Save the updated conversation if there were any changes
      if (isUpdated) {
        await conversation.save();
      }
    }

    res.send({updatedUsers: true});
  } catch (error) {
    console.error("Error updating username:", error);
    res.status(500).send("Internal server error");
  }
});


module.exports = router;
