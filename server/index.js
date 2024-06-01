const express = require('express');
const admin = require('firebase-admin');
const cors = require('cors');
const serviceAccount = require('../server/serviceAccountKey.json');
const bodyParser = require('body-parser');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

const listAllUsers = async (nextPageToken) => {
  const users = [];
  const listUsersResult = await admin.auth().listUsers(100, nextPageToken);
  
  for (const userRecord of listUsersResult.users) {
    const userData = userRecord.toJSON();
    const customClaims = (await admin.auth().getUser(userRecord.uid)).customClaims;
    userData.role = customClaims ? customClaims.role : 'user';
    users.push(userData);
  }
  
  if (listUsersResult.pageToken) {
    users.push(...await listAllUsers(listUsersResult.pageToken));
  }
  
  return users;
};


app.get('/api/users', async (req, res) => {
  try {
    const users = await listAllUsers();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).send('Error listing users: ' + error.message);
  }
});

app.delete('/api/users/:uid', async (req, res) => {
  const uid = req.params.uid;
  try {
    await admin.auth().deleteUser(uid);
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

app.post('/api/users/:uid/role', async (req, res) => {
  const uid = req.params.uid;
  const { role } = req.body;
  try {
    await admin.auth().setCustomUserClaims(uid, { role });
    res.status(200).json({ message: 'User role updated successfully' });
  } catch (error) {
    console.error('Error updating user role:', error);
    res.status(500).json({ error: 'Failed to update user role' });
  }
});

app.post('/api/signup', async (req, res) => {
  try {
    const { email, role, password } = req.body;

    // Create a new user with email and password
    const userRecord = await admin.auth().createUser({
      email: email,
      password: password,
    });

    // Set custom user claims for the role
    await admin.auth().setCustomUserClaims(userRecord.uid, { role: role });

    // Generate custom token for the newly created user
    const customToken = await admin.auth().createCustomToken(userRecord.uid);

    res.status(200).json({ message: 'User signed up successfully', customToken: customToken });
  } catch (error) {
    console.error('Error signing up user:', error);
    res.status(500).json({ error: 'Failed to sign up user' });
  }
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});