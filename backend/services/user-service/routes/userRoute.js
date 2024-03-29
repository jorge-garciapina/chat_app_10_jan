const express = require("express");
const User = require("../models/userModel");
// eslint-disable-next-line
const router = express.Router();
// To accept a contact request
router.post("/acceptContactRequest", async (req, res) => {
  try {
    const validatedUser = req.body.validatedUser;
    const validatedUserProfile = await User.findOne({
      username: validatedUser,
    });
    if (!validatedUserProfile) {
      return res.status(200).json({error: "User not found"});
    }
    const userWhoSends = req.body.senderUsername;
    const userWhoSendsProfile = await User.findOne({username: userWhoSends});
    // Ensure that a request from the sender exists in the receiver's receivedContactRequests
    const requestIndex = validatedUserProfile.receivedContactRequests.findIndex(
      (request) =>
        request.sender === userWhoSends && request.status === "pending",
    );
    if (requestIndex === -1) {
      return res
        .status(200)
        .json({message: "No pending request from the specified sender"});
    }

    // Add each other to their contact lists
    validatedUserProfile.contactList.push(userWhoSends);
    userWhoSendsProfile.contactList.push(validatedUser);

    // Remove the request from the receiver's receivedContactRequests and sender's pendingContactRequests
    validatedUserProfile.receivedContactRequests.splice(requestIndex, 1);
    const pendingRequestIndex =
      userWhoSendsProfile.pendingContactRequests.findIndex(
        (request) => request.receiver === validatedUser,
      );
    userWhoSendsProfile.pendingContactRequests.splice(pendingRequestIndex, 1);
    await validatedUserProfile.save();
    await userWhoSendsProfile.save();
    res.status(200).json({message: "Contact request accepted"});
  } catch (error) {
    res.status(500).json({error: "Server Error: " + error.message});
  }
});

router.post("/addChat", async (req, res) => {
  // Step 0: Extract data from the request body
  const {conversationId, name, participants, isGroupalChat} = req.body;

  try {
    // Step 1: Loop through each participant's username to add the conversation
    for (const participantUsername of participants) {
      // Find the user by their username
      const user = await User.findOne({username: participantUsername});

      // Check if the user exists
      if (!user) {
        return res
          .status(404)
          .json({error: `User ${participantUsername} not found`});
      }

      // Step 2: Create the new conversation object
      const newConversation = {
        name,
        participants,
        isGroupalChat,
        date: new Date(),
      };

      // Step 3: Add the new conversation to the user's conversations,
      // using the conversationId as the key
      user.conversations[conversationId] = newConversation;

      // Mark the 'conversations' field as modified
      user.markModified("conversations");

      // Step 4: Save the updated user object to the database
      await user.save();
    }

    // Step 5: Send a success response after loop is done
    res.status(201).json({
      message: "New conversation added successfully to all participants",
    });
  } catch (error) {
    // Handle errors and send an error response
    res.status(500).json({error: "Server Error: " + error.message});
  }
});

router.post("/addChatMember", async (req, res) => {
  try {
    // Step 1: Extract the 'conversation' object from the request body
    const {conversation} = req.body;

    // Step 2: Validate that the 'conversation' object exists and has necessary fields
    if (!conversation || !conversation._id || !conversation.participants) {
      return res.status(400).json({error: "Invalid conversation object"});
    }

    // Step 3: Extract the necessary fields from the 'conversation' object
    const {_id: conversationId, participants} = conversation;

    // Step 4: Loop through each participant to update the 'conversations' field
    for (const participant of participants) {
      await User.findOneAndUpdate(
        {username: participant},
        {
          $set: {[`conversations.${conversationId}`]: conversation},
        },
        {upsert: true, new: true}
      );
    }

    // Step 5: Send success response
    res.status(200).json({
      message: "Member added successfully to the chat for all participants",
    });
  } catch (error) {
    // Handle errors and log them
    console.error("Server Error: ", error);
    res.status(500).json({error: "Server Error: " + error.message});
  }
});

router.post("/contactValidator", async (req, res) => {
  try {
    const username = req.body.validatedUser;
    const uniqueParticipants = req.body.uniqueParticipants;
    const validatedUserProfile = await User.findOne({username});

    const interlocutors = uniqueParticipants.filter((interlocutor)=> interlocutor !== username);

    if (!validatedUserProfile) {
      return res.status(200).json({error: "User not found"});
    }

    // Check if all uniqueParticipants are in the validatedUserProfile.contactList
    const allParticipantsValid = interlocutors.every((participant) =>
      validatedUserProfile.contactList.includes(participant)
    );

    if (!allParticipantsValid) {
      return res.status(200).json({error: "Invalid user"});
    }

    // If all checks pass, proceed with the operation
    const {contactList} = validatedUserProfile;

    res.status(200).json({
      contactList,
    });
  } catch (error) {
    res.status(500).json({error: "Server Error: " + error.message});
  }
});

router.post("/cancelRequest", async (req, res) => {
  try {
    const validatedUser = req.body.validatedUser;
    const validatedUserProfile = await User.findOne({
      username: validatedUser,
    });
    if (!validatedUserProfile) {
      return res.status(200).json({error: "Sender not found"});
    }
    const receiver = req.body.receiverUsername;
    const receiverProfile = await User.findOne({
      username: receiver,
    });
    if (!receiverProfile) {
      return res.status(200).json({error: "Receiver not found"});
    }

    // Find and remove request from sender's pendingContactRequests
    const senderRequestIndex =
      validatedUserProfile.pendingContactRequests.findIndex(
        (request) => request.receiver === receiver);
    if (senderRequestIndex !== -1) {
      validatedUserProfile.pendingContactRequests.splice(senderRequestIndex, 1);
      await validatedUserProfile.save();
    } else {
      return res.status(400).json({message: "No pending request to cancel"});
    }

    // Find and remove request from receiver's receivedContactRequests
    const receiverRequestIndex =
      receiverProfile.receivedContactRequests.findIndex(
        (request) =>
          request.sender === validatedUser && request.status === "pending");
    if (receiverRequestIndex !== -1) {
      receiverProfile.receivedContactRequests.splice(receiverRequestIndex, 1);
      await receiverProfile.save();
    }
    res.json({message: "Friend request cancelled"});
  } catch (error) {
    res.status(500).json({error: "Server Error: " + error.message});
  }
});

// changeUserToOnline Route: Sets the user's online status to true based on the provided username
router.patch("/changeUserToOffline", async (req, res) => {
  try {
    const {username} = req.body;
    const user = await User.findOne({username});
    if (!user) {
      return res.status(404).json({error: "User not found"});
    }
    user.online = false;
    await user.save();
    res.status(200).json({message: "User is now online"});
  } catch (error) {
    res.status(500).json({error: "Server Error: " + error.message});
  }
});

// changeUserToOnline Route: Sets the user's online status to true based on the provided username
router.patch("/changeUserToOnline", async (req, res) => {
  try {
    const {username} = req.body;
    const user = await User.findOne({username});
    if (!user) {
      return res.status(404).json({error: "User not found"});
    }
    user.online = true;
    await user.save();
    res.status(200).json({message: "User is now online"});
  } catch (error) {
    res.status(500).json({error: "Server Error: " + error.message});
  }
});

// changeAvatarImage Route: Updates the user's avatar image based on the provided username and avatarImage
router.patch("/changeAvatarImage", async (req, res) => {
  try {
    const {validatedUser, avatarImage} = req.body;

    const user = await User.findOne({username: validatedUser});

    if (!user) {
      return res.status(404).json({error: "User not found"});
    }
    user.avatar = avatarImage;
    await user.save();
    res.status(200).json({message: "Avatar image updated successfully", avatarImage: avatarImage});
  } catch (error) {
    res.status(500).json({error: "Server Error: " + error.message});
  }
});

// Route to create a new user
router.post("/create", async (req, res) => {
  const {email, username, avatar, contactList} = req.body;
  try {
    const user = new User({email, username, avatar, contactList});
    await user.save();
    res.status(201).json({message: "User created successfully"});
  } catch (error) {
    res.status(500).json({error: "Server Error: " + error.message});
  }
});

// Endpoint to delete a chat from a user's profile
router.delete("/deleteChat/:conversationId/:username", async (req, res) => {
  try {
    const {conversationId, username} = req.params;

    // Step 1: Find the user and remove the conversation from their profile
    const user = await User.findOne({username});
    if (!user || !user.conversations[conversationId]) {
      return res.status(404).json({error: "User or conversation not found"});
    }

    delete user.conversations[conversationId];
    user.markModified("conversations");
    await user.save();

    // Step 2: Send a success response
    res.status(200).json({message: "Chat deleted from user profile"});
  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({error: "Server Error: " + error.message});
  }
});

router.post("/deleteContact", async (req, res) => {
  try {
    const validatedUser = req.body.validatedUser;
    const validatedUserProfile = await User.findOne({
      username: validatedUser,
    });
    if (!validatedUserProfile) {
      return res.status(200).json({error: "Sender not found"});
    }
    const userToDelete = req.body.receiverUsername;
    const userToDeleteProfile = await User.findOne({username: userToDelete});
    if (!userToDeleteProfile) {
      return res.status(200).json({error: "Receiver not found"});
    }

    // Check if receiver is in sender's contactList
    const contactIndex = validatedUserProfile.contactList.findIndex(
      (contact) => contact === userToDelete);
    if (contactIndex === -1) {
      return res
        .status(200)
        .json({message: "You are not friends with this user."});
    }

    // Delete receiver from sender's contactList
    validatedUserProfile.contactList.splice(contactIndex, 1);
    await validatedUserProfile.save();

    // Delete sender from receiver's contactList
    const senderIndex = userToDeleteProfile.contactList.findIndex(
      (contact) => contact === validatedUser);
    if (senderIndex !== -1) {
      userToDeleteProfile.contactList.splice(senderIndex, 1);
      await userToDeleteProfile.save();
    }
    res.status(200).json({message: "Contact deleted"});
  } catch (error) {
    res.status(500).json({error: "Server Error: " + error.message});
  }
});

router.get("/getConversations", async (req, res) => {
  try {
    const {validatedUser} = req.query;

    const user = await User.findOne(
      {username: validatedUser},
      "conversations",
    );

    if (!user) {
      return res.status(404).json({error: "User not found"});
    }

    const conversationNames = user.conversations;

    res.status(200).json({conversations: conversationNames});
  } catch (error) {
    res.status(500).json({error: "Server Error: " + error.message});
  }
});

router.get("/getConversationsIds", async (req, res) => {
  try {
    const {validatedUser} = req.query;

    const user = await User.findOne(
      {username: validatedUser},
      "conversations",
    );

    if (!user) {
      return res.status(404).json({error: "User not found"});
    }

    const conversationNames = user.conversations;
    const keysArray = Object.keys(conversationNames);

    res.status(200).json({conversations: keysArray});
  } catch (error) {
    res.status(500).json({error: "Server Error: " + error.message});
  }
});

router.get("/getContactList/:validatedUser", async (req, res) => {
  try {
    const {validatedUser} = req.params;
    console.log(validatedUser);
    const user = await User.findOne({username: validatedUser});
    if (!user) {
      return res.status(404).json({error: "User not found"});
    }
    res.status(200).json({contactList: user.contactList});
  } catch (error) {
    res.status(500).json({error: "Server Error: " + error.message});
  }
});

router.get("/getCurrentConversation/:validatedUser", async (req, res) => {
  try {
    const {validatedUser} = req.params;
    const user = await User.findOne({username: validatedUser});
    if (!user) {
      return res.status(404).json({error: "User not found"});
    }
    res.status(200).json({currentConversation: user.currentConversation});
  } catch (error) {
    res.status(500).json({error: "Server Error: " + error.message});
  }
});

router.get("/getUserStatus/:username", async (req, res) => {
  try {
    const {username} = req.params;
    const user = await User.findOne({username}, "username online");
    if (!user) {
      return res.status(404).json({error: "User not found"});
    }
    // Return the username and online status in the desired format
    res.status(200).json({username: user.username, onlineStatus: user.online});
  } catch (error) {
    res.status(500).json({error: "Server Error: " + error.message});
  }
});

// getUserStatus Route: Retrieves the online status of a user based on the provided username
router.post("/getUserStatuses", async (req, res) => {
  try {
    const {usernames} = req.body;
    const users = await User.find(
      {username: {$in: usernames}},
      "username online",
    );
    if (!users) {
      return res.status(404).json({error: "Users not found"});
    }
    const onlineStatuses = users.map((user) => ({
      username: user.username,
      onlineStatus: user.online,
    }));
    res.status(200).json({onlineStatuses});
  } catch (error) {
    res.status(500).json({error: "Server Error: " + error.message});
  }
});

router.get("/onlineFriends/:validatedUser", async (req, res) => {
  try {
    const {validatedUser} = req.params;

    // const validatedUser = req.query.validatedUser;

    const validatedUserProfile = await User.findOne({
      username: validatedUser,
    });

    if (!validatedUserProfile) {
      return res.status(400).json({error: "User not found"});
    }


    const onlineFriends = [];

    for (const contactUsername of validatedUserProfile.contactList) {
      const contactUserProfile = await User.findOne({
        username: contactUsername,
      });

      if (contactUserProfile && contactUserProfile.online) {
        onlineFriends.push(contactUsername);
      }
    }

    res.status(200).json({onlineFriends});
  } catch (error) {
    res.status(500).json({error: "Server Error: " + error.message});
  }
});

router.get("/info/:validatedUser", async (req, res) => {
  try {
    const username = req.params.validatedUser;
    const validatedUserProfile = await User.findOne({username});
    if (!validatedUserProfile) {
      return res.status(200).json({error: "User not found"});
    }

    const {
      email,
      contactList,
      avatar,
      friendRequests,
      receivedContactRequests,
      rejectedContactRequests,
      pendingContactRequests,
      conversations,
    } = validatedUserProfile;

    res.status(200).json({
      email,
      username,
      contactList,
      avatar,
      friendRequests,
      receivedContactRequests,
      rejectedContactRequests,
      pendingContactRequests,
      conversations,
    });
  } catch (error) {
    res.status(500).json({error: "Server Error: " + error.message});
  }
});

router.post("/modifyChatDate", async (req, res) => {
  try {
    const {conversationId, participants} = req.body;

    const newDate = new Date();
    // Step 1: Validate input. In a real-world app, you'd have more validation.
    if (!conversationId) {
      return res
        .status(400)
        .json({error: "conversationId must be provided"});
    }

    // Step 1.5: Filter out duplicate participants
    const uniqueParticipants = [...new Set(participants)];

    // Step 2: Loop through each unique participant to modify the chat date
    for (const participant of uniqueParticipants) {
      // Find and update the user's conversation date
      const updatedUser = await User.findOneAndUpdate(
        {
          username: participant,
          [`conversations.${conversationId}`]: {$exists: true},
        },
        {$set: {[`conversations.${conversationId}.date`]: newDate}},
        {new: true},
      );

      if (!updatedUser) {
        return res
          .status(404)
          .json({error: `Conversation not found for user ${participant}`});
      }
    }

    res.status(200).json({
      message: "Chat date modified successfully for all participants",
    });
  } catch (error) {
    res.status(500).json({error: "Server Error: " + error.message});
  }
});

router.post("/modifyChatName", async (req, res) => {
  try {
    const {conversationId, newName, participants} = req.body;

    // Step 1: Validate input. In a real-world app, you'd have more validation.
    if (!conversationId || !newName) {
      return res
        .status(400)
        .json({error: "Both conversationId and newName must be provided"});
    }

    // Step 1.5: Filter out duplicate participants
    const uniqueParticipants = [...new Set(participants)];

    // Step 2: Loop through each unique participant to modify the chat name
    for (const participant of uniqueParticipants) {
      // Find and update the user's conversation name
      const updatedUser = await User.findOneAndUpdate(
        {
          username: participant,
          [`conversations.${conversationId}`]: {$exists: true},
        },
        {$set: {[`conversations.${conversationId}.name`]: newName}},
        {new: true},
      );

      if (!updatedUser) {
        return res
          .status(404)
          .json({error: `Conversation not found for user ${participant}`});
      }
    }

    res.status(200).json({
      message: "Chat name modified successfully for all participants",
    });
  } catch (error) {
    res.status(500).json({error: "Server Error: " + error.message});
  }
});

// To reject a contact request
router.post("/rejectContactRequest", async (req, res) => {
  try {
    const validatedUser = req.body.validatedUser;
    const validatedUserProfile = await User.findOne({
      username: validatedUser,
    });
    if (!validatedUserProfile) {
      return res.status(200).json({error: "User not found"});
    }

    const userWhoSends = req.body.senderUsername;
    const userWhoSendsProfile = await User.findOne({username: userWhoSends});

    // Ensure that a request from the sender exists in the receiver's receivedContactRequests
    const requestIndex = validatedUserProfile.receivedContactRequests.findIndex(
      (request) => request.sender === userWhoSends && request.status === "pending");
    if (requestIndex === -1) {
      return res
        .status(200)
        .json({message: "No pending request from the specified sender"});
    }

    // Remove the request from the receiver's receivedContactRequests and sender's pendingContactRequests
    validatedUserProfile.receivedContactRequests.splice(requestIndex, 1);
    const pendingRequestIndex =
      userWhoSendsProfile.pendingContactRequests.findIndex(
        (request) => request.receiver === validatedUser);
    userWhoSendsProfile.pendingContactRequests.splice(pendingRequestIndex, 1);

    // Add or update the rejection in the sender's rejectedContactRequests
    const rejection = userWhoSendsProfile.rejectedContactRequests.find(
      (rejection) => rejection.receiver === validatedUser,
    );
    if (rejection) {
      rejection.rejectionCount += 1;
      rejection.date = Date.now();
    } else {
      userWhoSendsProfile.rejectedContactRequests.push({
        receiver: validatedUser,
        date: Date.now(),
        rejectionCount: 1,
      });
    }
    await validatedUserProfile.save();
    await userWhoSendsProfile.save();
    res.status(200).json({message: "Contact request rejected"});
  } catch (error) {
    res.status(500).json({error: "Server Error: " + error.message});
  }
});

// Endpoint to retrieve contact requests
router.get("/retrieveContactRequests/:validatedUser", async (req, res) => {
  try {
    const validatedUser = req.params.validatedUser;
    const validatedUserProfile = await User.findOne({
      username: validatedUser,
    });

    if (!validatedUserProfile) {
      return res.status(200).json({error: "User not found"});
    }
    // Extract and return just the current received contact requests
    const contactRequests = validatedUserProfile.receivedContactRequests.map(
      (request) => request.sender,
    );
    res.status(200).json(contactRequests);
  } catch (error) {
    res.status(500).json({error: "Server Error: " + error.message});
  }
});

// Route to retrieve pending contact requests
router.get(
  "/retrievePendingContactRequests/:validatedUser",
  async (req, res) => {
    try {
      const validatedUser = req.params.validatedUser;
      const validatedUserProfile = await User.findOne({
        username: validatedUser,
      });
      if (!validatedUserProfile) {
        return res.status(200).json({error: "User not found"});
      }

      // Extract and return contact requets made by validated user
      const pendingContactRequests =
        validatedUserProfile.pendingContactRequests.map(
          (request) => request.receiver,
        );
      res.status(200).json(pendingContactRequests);
    } catch (error) {
      res.status(500).json({error: "Server Error: " + error.message});
    }
  },
);

router.post("/searchUser", async (req, res) => {
  try {
    const userToSearch = req.body.searchTerm;
    const validatedUser = req.body.validatedUser;

    const usersFound = await User.find({
      username: new RegExp("^" + userToSearch, "i"),
    });

    const filteredResults = usersFound.filter((result) => {
      return result.username !== validatedUser;
    });

    console.log(validatedUser);


    if (!usersFound.length) {
      return res
        .status(200)
        .json({error: "No user found for the given search term"});
    }

    const searchResults = filteredResults.map((user) => ({
      username: user.username,
      avatar: user.avatar,
    }));

    res.status(200).json(searchResults);
  } catch (error) {
    res.status(500).json({error: "Server Error: " + error.message});
  }
});

router.post("/sendContactRequest", async (req, res) => {
  try {
    const validatedUser = req.body.validatedUser;
    const validatedUserProfile = await User.findOne({
      username: validatedUser,
    });
    if (!validatedUserProfile) {
      return res.status(200).json({error: "Sender not found"});
    }

    // Prevent users from sending a friend request to themselves
    const receiver = req.body.receiverUsername;
    if (validatedUser === receiver) {
      return res
        .status(200)
        .json({message: "You can't send a friend request to yourself.", isRequestSent: false});
    }
    const receiverProfile = await User.findOne({username: receiver});
    if (!receiverProfile) {
      return res.status(200).json({message: "Receiver not found", isRequestSent: false});
    }

    // Check if receiver is already in sender's contactList
    if (validatedUserProfile.contactList.includes(receiver)) {
      return res
        .status(200)
        .json({message: "You are already friends with this user.", isRequestSent: false});
    }

    // Check if a pending request already exists
    const pendingRequest = validatedUserProfile.pendingContactRequests.find(
      (request) => request.receiver === receiver,
    );
    if (pendingRequest) {
      return res
        .status(200)
        .json({message: "Pending request already exists", isRequestSent: false});
    }

    // Check if there are 3 or more rejected requests
    const rejectedRequest = validatedUserProfile.rejectedContactRequests.find(
      (request) => request.receiver === receiver,
    );
    if (rejectedRequest && rejectedRequest.rejectionCount >= 3) {
      return res.status(200).json({
        message: "Your request cannot be sent due to multiple past rejections", isRequestSent: false});
    }

    // Everything is OK, send the request:
    validatedUserProfile.pendingContactRequests.push({
      receiver: receiver,
    });

    await validatedUserProfile.save();

    receiverProfile.receivedContactRequests.push({
      sender: validatedUser,
      status: "pending",
    });
    await receiverProfile.save();
    res.status(200).json({message: "Friend request sent", isRequestSent: true});
  } catch (error) {
    res.status(500).json({error: "Server Error: " + error.message});
  }
});

// Route to remove a chat member from an existing conversation
router.post("/removeChatMember", async (req, res) => {
  try {
    const {conversationId, nameToRemove, participants} = req.body;

    // Step 1: Validate input
    if (!conversationId || !nameToRemove || !participants) {
      return res.status(400).json({
        error:
          "ConversationId, nameToRemove, and participants must be provided",
      });
    }

    // Step 2: Combine nameToRemove and participants for a complete update
    const allAffectedUsers = [...participants, nameToRemove];

    // Step 3: Loop through each user to update their conversation data
    for (const username of allAffectedUsers) {
      // Only update if the conversation exists for this user
      const updatedUser = await User.findOneAndUpdate(
        {
          username: username,
          [`conversations.${conversationId}`]: {$exists: true},
        },
        {
          $set: {
            [`conversations.${conversationId}.participants`]: participants,
          },
        },
        {new: true}
      );

      // If user doesn't have this conversation yet, skip to the next iteration
      if (!updatedUser) continue;
    }

    // Step 4: Send success response
    res.status(200).json({
      message: "Member removed successfully from the chat",
      participants: participants, // Returning the updated participants array
    });
  } catch (error) {
    // Handle errors
    res.status(500).json({error: "Server Error: " + error.message});
  }
});


router.patch("/updateCurrentConversation", async (req, res) => {
  try {
    const {validatedUser, conversationId} = req.body;
    const user = await User.findOne({username: validatedUser});
    if (!user) {
      return res.status(404).json({error: "User not found"});
    }
    user.currentConversation = conversationId;
    await user.save();
    res.status(200).json({message: "Current conversation updated"});
  } catch (error) {
    res.status(500).json({error: "Server Error: " + error.message});
  }
});


router.put("/updateUsername", async (req, res) => {
  const {validatedUser, newName} = req.body;

  if (!validatedUser || !newName) {
    return res.status(400).send("Both validatedUser and newName are required");
  }

  try {
    // Update main username field
    await User.updateMany({username: validatedUser}, {$set: {username: newName}});

    // Update username in contactList
    await User.updateMany({contactList: validatedUser}, {$set: {"contactList.$": newName}});

    // Update username in receivedContactRequests
    await User.updateMany({"receivedContactRequests.sender": validatedUser},
      {$set: {"receivedContactRequests.$.sender": newName}});

    // Update username in rejectedContactRequests
    await User.updateMany({"rejectedContactRequests.receiver": validatedUser},
      {$set: {"rejectedContactRequests.$.receiver": newName}});

    // Update username in pendingContactRequests
    await User.updateMany({"pendingContactRequests.receiver": validatedUser},
      {$set: {"pendingContactRequests.$.receiver": newName}});

    // Update username in conversations (participants, admins, observers)
    const users = await User.find();

    users.forEach(async (user) => {
      Object.keys(user.conversations).forEach(async (conversationId) => {
        const conversation = user.conversations[conversationId];
        // Update participants, admins, and observers
        const fieldsToUpdate = {};
        if (conversation.participants.includes(validatedUser)) {
          fieldsToUpdate["conversations." + conversationId + ".participants"] =
          conversation.participants.map((u) => u === validatedUser ? newName : u);
        }
        if (Object.keys(fieldsToUpdate).length > 0) {
          await User.updateOne({_id: user._id}, {$set: fieldsToUpdate});
        }
      });
    });

    res.send({updatedUsers: true});
  } catch (error) {
    console.error("Error updating username:", error);
    res.status(500).send("Internal server error");
  }
});


module.exports = router;
