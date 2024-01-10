INSTRUCTIONS:
1) TO RUN THE SERVERS OPEN 4 TERMINALS FOR THE BACKEND
GO TO THE backend FOLDER: cd backend

AUTH         TERMINAL: main_root/backend/
CONVERSATION TERMINAL: main_root/backend/
USER         TERMINAL: main_root/backend/
SERVER       TERMINAL: main_root/backend/
BACKEND: 
TO START THE SERVERS, SEND THE FOLLOWING COMMANDS IN THE RESPECTIVE TERMINAL: 
///////////////////////////////////////
AUTH SERVICE:
$env:AUTH_CONNECTION="mongodb://127.0.0.1:27017/auth"
$env:JWT_SECRET="secret"
npm run start-auth-service


///////////////////////////////////////
CONVERSATION SERVICE: 
$env:CONVERSATION_CONNECTION="mongodb://127.0.0.1:27017/conversation"
npm run start-conversation-service

///////////////////////////////////////
USER SERVICE:
$env:USER_CONNECTION="mongodb://127.0.0.1:27017/user"
npm run start-user-service

//////////////////////////////////////////////////
GRAPHQL SERVER:
$env:AUTH_SERVICE_CONNECTION="http://127.0.0.1:3001/auth"
$env:USER_SERVICE_CONNECTION="http://127.0.0.1:3002/user" 
$env:CONVERSATION_SERVICE_CONNECTION="http://127.0.0.1:3003/conversation"  
npm run start-apollo-server


FRONTEND: 
ONLY GO TO chat-app/frontend AND SEND THE COMMAND: 
npm start


