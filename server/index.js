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

app.get('/api/users/:uid', async (req, res) => {
  const { uid } = req.params;

  try {
      const user = await admin.auth().getUser(uid);
      if (!user) {
          return res.status(404).json({ error: 'User not found' });
      }

      res.json(user);
  } catch (error) {
      console.error('Error fetching user details:', error);
      res.status(500).json({ error: 'Failed to fetch user details' });
  }
});

app.put('/api/users/:uid/:email', async (req, res) => {
  const { uid, email } = req.params;

  try {
      const user = await admin.auth().updateUser(uid, {email});
      if (!user) {
          return res.status(404).json({ error: 'User not found' });
      }

      res.json(user);
  } catch (error) {
      console.error('Error fetching user details:', error);
      res.status(500).json({ error: 'Failed to fetch user details' });
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

app.get('/api/getUserDetails/:uid', async (req, res) => {
  const uid = req.params.uid;
  const role = req.query.role;

  try {
    const snapshot = await admin.database().ref(role === 'student' ? 'Students' : 'Teachers')
      .orderByChild('uid')
      .equalTo(uid)
      .once('value');

    const userData = snapshot.val();

    if (userData) {
      const id = Object.keys(userData)[0];
      const user = userData[id];
      res.json({ id, user });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error('Error fetching user details:', error);
    res.status(500).json({ error: 'Internal server error' });
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

app.get('/api/students/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const studentRef = admin.database().ref(`Students/${id}`);
    const snapshot = await studentRef.once('value');
    if (!snapshot.exists()) {
      return res.status(404).send({ message: 'Student not found' });
    }
    const studentData = snapshot.val();
    res.status(200).json(studentData);
  } catch (error) {
    console.error('Error fetching student details:', error);
    res.status(500).send({ error: 'Error fetching student details.' });
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

app.put('/api/students/:id', async (req, res) => {
  const { id } = req.params;
  const formData = req.body;

  try {
      const studentRef = admin.database().ref(`Students/${id}`);
      await studentRef.update(formData);

      const updatedStudentSnapshot = await studentRef.once('value');
      const updatedStudent = updatedStudentSnapshot.val();

      res.json(updatedStudent);
  } catch (error) {
      console.error('Error updating student details:', error);
      res.status(500).json({ error: 'Failed to update student details' });
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

app.get('/api/grades/:gradeId', async (req, res) => {
  const gradeId = req.params.gradeId;
  try {
    const gradeRef = admin.database().ref(`Grades/${gradeId}`);
    const snapshot = await gradeRef.once('value');
    const grade = snapshot.val();
    if (grade) {
      res.status(200).send(grade);
    } else {
      res.status(404).send({ error: 'Grade not found' });
    }
  } catch (error) {
    console.error('Error fetching grade:', error);
    res.status(500).send({ error: 'Failed to fetch grade' });
  }
});

app.post('/api/grades/:gradeId/subjects', async (req, res) => {
  const gradeId = req.params.gradeId;
  const { name, teacherId } = req.body;
  try {
    const subjectsRef = admin.database().ref(`Grades/${gradeId}/subjects`);
    const newSubjectRef = subjectsRef.push();
    await newSubjectRef.set({ name, teacherId });
    res.status(200).send({ message: 'Subject added successfully' });
  } catch (error) {
    console.error('Error adding subject:', error);
    res.status(500).send({ error: 'Failed to add subject' });
  }
});

app.delete('/api/grades/:gradeId/subjects/:subjectName', async (req, res) => {
  const gradeId = req.params.gradeId;
  const subjectName = req.params.subjectName;
  try {
    const subjectRef = admin.database().ref(`Grades/${gradeId}/subjects/${subjectName}`);
    await subjectRef.remove();
    res.status(200).send({ message: 'Subject removed successfully' });
  } catch (error) {
    console.error('Error removing subject:', error);
    res.status(500).send({ error: 'Failed to remove subject' });
  }
});

app.put('/api/grades/:gradeId/subjects/:subjectName', async (req, res) => {
  const { gradeId, subjectName } = req.params;
  const { teacherId } = req.body;

  try {
    const subjectRef = admin.database().ref(`Grades/${gradeId}/subjects/${subjectName}`);
    await subjectRef.update({ teacherId });
    res.status(200).send({ message: 'Teacher assigned successfully' });
  } catch (error) {
    console.error('Error assigning teacher:', error);
    res.status(500).send({ error: 'Failed to assign teacher' });
  }
});


app.get('/api/subjects', async (req, res) => {
  try {
    const subjectsRef = admin.database().ref('Subjects');
    const snapshot = await subjectsRef.once('value');
    const subjects = [];

    snapshot.forEach(childSnapshot => {
      subjects.push({
        id: childSnapshot.key,
        ...childSnapshot.val()
      });
    });

    res.status(200).json(subjects);
  } catch (error) {
    console.error('Error fetching subjects:', error);
    res.status(500).json({ error: 'Failed to fetch subjects' });
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

app.get('/api/teachers', async (req, res) => {
  try {
    const teachersRef = admin.database().ref('Teachers');
    teachersRef.once('value', snapshot => {
      if (!snapshot.exists()) {
        return res.status(404).send({ message: 'No teachers found' });
      }
      const teachers = [];
      snapshot.forEach(childSnapshot => {
        teachers.push({ id: childSnapshot.key, ...childSnapshot.val() });
      });
      res.status(200).send(teachers);
    });
  } catch (error) {
    res.status(500).send({ error: 'Error fetching teachers' });
  }
});

app.post('/api/teachers', async (req, res) => {
  const { name, email, subjects, password, portraitSrc } = req.body;
  let userRecord;

  try {
    userRecord = await admin.auth().createUser({ email, password });

    await admin.auth().setCustomUserClaims(userRecord.uid, { role: 'teacher' });

    const newTeacherRef = admin.database().ref('Teachers').push();
    await newTeacherRef.set({
      uid: userRecord.uid,
      name,
      subjects,
      portraitSrc
    });

    res.status(200).json({ message: 'Teacher added successfully', uid: userRecord.uid });
  } catch (error) {
    if (userRecord) {
      await admin.auth().deleteUser(userRecord.uid);
    }
    console.error('Error adding teacher:', error);
    res.status(500).json({ error: 'Failed to add teacher' });
  }
});


app.get('/api/teachers/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const teacherRef = admin.database().ref(`Teachers/${id}`);
    const snapshot = await teacherRef.once('value');
    if (!snapshot.exists()) {
      return res.status(404).send({ error: 'Teacher not found' });
    }
    const teacherData = snapshot.val();
    res.status(200).send(teacherData);
  } catch (error) {
    console.error('Error fetching teacher data:', error);
    res.status(500).send({ error: 'Error fetching teacher data' });
  }
});

app.delete('/api/teachers/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const teacherRef = admin.database().ref(`Teachers/${id}`);
    const snapshot = await teacherRef.once('value');
    const teacherData = snapshot.val();
    
    await teacherRef.remove();

    if (teacherData && teacherData.portraitSrc) {
      const fileUrl = teacherData.portraitSrc;
      const fileName = fileUrl.split('/').pop();
      const fileRef = bucket.file(`portraits/${fileName}`);
      
      await fileRef.delete();
    }

    res.status(200).send({ message: 'Teacher deleted successfully.' });
  } catch (error) {
    console.error('Error deleting teacher:', error);
    res.status(500).send({ error: 'Error deleting teacher.' });
  }
});

app.get('/api/teachers/:teacherId/lessons', async (req, res) => {
  const teacherId = req.params.teacherId;
  try {
      const gradesRef = admin.database().ref('Grades');
      const gradesSnapshot = await gradesRef.once('value');
      const lessons = [];

      gradesSnapshot.forEach(gradeSnapshot => {
          const subjects = gradeSnapshot.child('subjects').val();
          for (const subjectId in subjects) {
              const subject = subjects[subjectId];
              if (subject.teacherId === teacherId) {
                  lessons.push({ id: subjectId, ...subject, grade: gradeSnapshot.child('grade').val() });
              }
          }
      });

      res.status(200).send(lessons);
  } catch (error) {
      console.error('Error fetching lessons:', error);
      res.status(500).send({ error: 'Failed to fetch lessons' });
  }
});

app.put('/api/teachers/:id', async (req, res) => {
  const { id } = req.params;
  const formData = req.body;

  try {
      const studentRef = admin.database().ref(`Teachers/${id}`);
      await studentRef.update(formData);

      const updatedStudentSnapshot = await studentRef.once('value');
      const updatedStudent = updatedStudentSnapshot.val();

      res.json(updatedStudent);
  } catch (error) {
      console.error('Error updating student details:', error);
      res.status(500).json({ error: 'Failed to update student details' });
  }
});



app.get('/api/students/:grade/lessons', async (req, res) => {
  try {
    const { grade } = req.params;
    const gradesRef = admin.database().ref('Grades').orderByChild('grade').equalTo(grade);
    const gradesSnapshot = await gradesRef.once('value');
    
    const gradesData = gradesSnapshot.val();
    if (gradesData) {
      const lessons = Object.values(gradesData)[0].subjects || [];
      res.status(200).send(lessons);
    } else {
      res.status(404).send({ error: 'Grade not found' });
    }
  } catch (error) {
    console.error('Error fetching lessons:', error);
    res.status(500).send({ error: 'Failed to fetch lessons' });
  }
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
