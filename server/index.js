const express = require('express');
const admin = require('firebase-admin');
const cors = require('cors');
const serviceAccount = require('../server/serviceAccountKey.json');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "gs://schoolmanagement-65c57.appspot.com",
  databaseURL: "https://schoolmanagement-65c57-default-rtdb.europe-west1.firebasedatabase.app/"
});

const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(fileUpload());

const bucket = admin.storage().bucket()

app.get('/api/users', async (req, res) => {
  try {
    const users = [];
    const listUsersResult = await admin.auth().listUsers();
    listUsersResult.users.forEach(userRecord => {
      users.push({
        uid: userRecord.uid,
        email: userRecord.email,
        role: userRecord.customClaims?.role || 'user'
      });
    });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).send(error.message);
  }
});


async function listAllUsers(nextPageToken) {
  const listUsersResult = await admin.auth().listUsers(100, nextPageToken);
  const users = listUsersResult.users.map(userRecord => userRecord.toJSON());
  if (listUsersResult.pageToken) {
    const nextUsers = await listAllUsers(listUsersResult.pageToken);
    return users.concat(nextUsers);
  }
  return users;
}

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
    const userRecord = await admin.auth().createUser({ email, password });
    await admin.auth().setCustomUserClaims(userRecord.uid, { role });
    const customToken = await admin.auth().createCustomToken(userRecord.uid);
    res.status(200).json({ message: 'User signed up successfully', uid: userRecord.uid });
  } catch (error) {
    console.error('Error signing up user:', error);
    res.status(500).json({ error: 'Failed to sign up user' });
  }
});

app.delete('/api/students/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const studentRef = admin.database().ref(`Students/${id}`);
    const snapshot = await studentRef.once('value');
    const studentData = snapshot.val();
    
    await studentRef.remove();

    if (studentData && studentData.portraitSrc) {
      const fileUrl = studentData.portraitSrc;
      const fileName = fileUrl.split('/').pop();
      const fileRef = bucket.file(`portraits/${fileName}`);
      
      await fileRef.delete();
    }

    res.status(200).send({ message: 'Student deleted successfully.' });
  } catch (error) {
    console.error('Error deleting student:', error);
    res.status(500).send({ error: 'Error deleting student.' });
  }
});

app.get('/api/students', async (req, res) => {
  try {
    const studentsRef = admin.database().ref('Students');
    studentsRef.once('value', snapshot => {
      if (!snapshot.exists()) {
        return res.status(404).send({ message: 'No students found' });
      }
      const students = [];
      snapshot.forEach(childSnapshot => {
        students.push({ id: childSnapshot.key, ...childSnapshot.val() });
      });
      res.status(200).send(students);
    });
  } catch (error) {
    res.status(500).send({ error: 'Error fetching students' });
  }
});

app.post('/api/students', async (req, res) => {
  const { studentName, grade, portraitSrc, email, password } = req.body;
  let userRecord;

  try {
    
     userRecord = await admin.auth().createUser({ email, password });

    
    await admin.auth().setCustomUserClaims(userRecord.uid, { role: 'student' });

    
    const newStudentRef = admin.database().ref('Students').push();
    await newStudentRef.set({
      uid: userRecord.uid,
      studentName,
      grade,
      portraitSrc
    });

    res.status(200).json({ message: 'Student added successfully', uid: userRecord.uid });
  } catch (error) {

    if(userRecord) {
      await admin.auth().deleteUser(userRecord.uid);
    }
    console.error('Error adding student:', error);
    res.status(500).json({ error: 'Failed to add student' });
  }
});

app.get('/api/grades', async (req, res) => {
  try {
    const gradesRef = admin.database().ref('Grades');
    const snapshot = await gradesRef.once('value');
    const grades = [];

    snapshot.forEach(childSnapshot => {
      grades.push({
        id: childSnapshot.key,
        ...childSnapshot.val()
      });
    });

    res.status(200).json(grades);
  } catch (error) {
    console.error('Error fetching grades:', error);
    res.status(500).json({ error: 'Failed to fetch grades' });
  }
});

app.post('/api/upload', async (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }

  const file = req.files.file;
  const fileName = `portraits/${Date.now()}_${file.name}`;
  const fileUpload = bucket.file(fileName);

  const blobStream = fileUpload.createWriteStream({
    metadata: {
      contentType: file.mimetype,
    },
  });

  blobStream.on('error', (error) => {
    console.error('Error uploading file:', error);
    res.status(500).send({ error: 'Failed to upload file' });
  });

  blobStream.on('finish', async () => {
    try {
      await fileUpload.makePublic();
      const fileUrl = `https://storage.googleapis.com/${bucket.name}/${fileUpload.name}`;
      res.status(200).send({ fileUrl });
    } catch (error) {
      console.error('Error retrieving file URL:', error);
      res.status(500).send({ error: 'Failed to retrieve file URL' });
    }
  });

  blobStream.end(file.data);
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
