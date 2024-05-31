import { useState, useEffect } from "react";

function StudentPage() {


    const [studentDetails, setStudentDetails] = useState();

    useEffect(() => {
        const storedStudent = localStorage.getItem('selectedStudent');
        if (storedStudent) {
            setStudentDetails(JSON.parse(storedStudent));
        }
    }, []);

    if (!studentDetails) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>{studentDetails.studentName}</h1>
            <p>Grade: {studentDetails.grade}</p>
            <img src={studentDetails.studentPortraitSrc} alt={studentDetails.studentName} style={{ width: '400px', height: 'auto' }} />
        </div>
    );
};

export default StudentPage;