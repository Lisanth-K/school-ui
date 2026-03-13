/**
 * Centralized API Service for School ERP (MOCK VERSION)
 * 
 * This file temporarily uses MOCK DATA (in-memory) so you can develop 
 * the frontend without a connected backend and without getting "Not Found" errors.
 */

// ============================================================
// 📦 MOCK DATABASES (In-Memory)
// ============================================================
let db = {
    academicYears: [
        { id: 1, year_name: '2023-2024', start_date: '2023-06-01', end_date: '2024-04-30', is_active: false },
        { id: 2, year_name: '2024-2025', start_date: '2024-06-01', end_date: '2025-04-30', is_active: true }
    ],
    subjects: [
        { id: 1, name: 'Mathematics', short_code: 'MAT101', is_elective: false, has_practical: false },
        { id: 2, name: 'Physics', short_code: 'PHY101', is_elective: false, has_practical: true },
    ],
    classes: [
        { id: 1, name: 'Grade 10', short_name: 'G10', level: 10 },
        { id: 2, name: 'Grade 11', short_name: 'G11', level: 11 }
    ],
    students: [
        { id: 1, admission_no: 'ADM001', first_name: 'John', last_name: 'Doe', class_id: 1, gender: 'Male', dob: '2010-05-15', email: 'john@example.com' },
        { id: 2, admission_no: 'ADM002', first_name: 'Jane', last_name: 'Smith', class_id: 2, gender: 'Female', dob: '2011-08-20', email: 'jane@example.com' }
    ],
    exams: [
        { id: 1, exam_name: 'Midterm Physics', start_date: '2024-10-15', end_date: '2024-10-20', class_id: 1, subject_id: 2, academic_year_id: 2, exam_type: 'Theory', max_marks: 100, passing_marks: 40 }
    ],
    examResults: [
        { id: 1, exam_id: 1, student_id: 1, marks_obtained: 85, total_marks: 100, grade: 'A', remarks: 'Good job' }
    ],
    enrollments: []
};

// ============================================================
// 🛠️ Core Fetch Wrapper (Simulating Network Delay)
// ============================================================
const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));
const generateId = () => Date.now() + Math.floor(Math.random() * 1000);

// ============================================================
// 📚 ACADEMIC YEAR API (MOCKS)
// ============================================================
export const academicYearAPI = {
    getAll: async () => { await delay(); return [...db.academicYears]; },
    create: async (data) => { 
        await delay(); 
        const newItem = { ...data, id: generateId(), is_active: false };
        db.academicYears.push(newItem);
        return newItem; 
    },
    update: async (id, data) => { /* mock */ return {}; },
    delete: async (id) => { 
        await delay(); 
        db.academicYears = db.academicYears.filter(item => item.id !== id);
        return { success: true }; 
    },
    setActive: async (id) => { 
        await delay();
        db.academicYears = db.academicYears.map(y => ({
            ...y,
            is_active: y.id === id
        }));
        return { success: true }; 
    },
};

// ============================================================
// 📖 SUBJECTS API (MOCKS)
// ============================================================
export const subjectsAPI = {
    getAll: async () => { await delay(); return [...db.subjects]; },
    create: async (data) => {
        await delay();
        const newItem = { ...data, id: generateId() };
        db.subjects.push(newItem);
        return newItem;
    },
    update: async (id, data) => { /* mock */ return {}; },
    delete: async (id) => {
        await delay();
        db.subjects = db.subjects.filter(item => item.id !== id);
        return { success: true };
    },
};

// ============================================================
// 🏫 CLASSES API (MOCKS)
// ============================================================
export const classesAPI = {
    getAll: async () => { await delay(); return [...db.classes]; },
    create: async (data) => {
        await delay();
        const newItem = { ...data, id: generateId() };
        db.classes.push(newItem);
        return newItem;
    },
    update: async (id, data) => { /* mock */ return {}; },
    delete: async (id) => {
        await delay();
        db.classes = db.classes.filter(item => item.id !== id);
        return { success: true };
    },
    assignSubjects: async (classId, subjectIds) => {
        await delay();
        return { success: true };
    },
    getSubjects: async (classId) => {
        await delay();
        return [...db.subjects];
    },
};

// ============================================================
// 👥 STUDENTS API (MOCKS)
// ============================================================
export const studentsAPI = {
    getAll: async () => { await delay(); return [...db.students]; },
    create: async (data) => {
        await delay();
        const newItem = { ...data, id: generateId() };
        db.students.push(newItem);
        return newItem;
    },
    update: async (id, data) => {
        await delay();
        db.students = db.students.map(s => s.id === id ? { ...s, ...data } : s);
        return { success: true };
    },
    delete: async (id) => {
        await delay();
        db.students = db.students.filter(item => item.id !== id);
        return { success: true };
    },
};

// ============================================================
// 📝 ENROLLMENTS API (MOCKS)
// ============================================================
export const enrollmentsAPI = {
    getAll: async () => { await delay(); return [...db.enrollments]; },
    create: async (data) => { await delay(); return {}; },
    delete: async (id) => { await delay(); return {}; },
};

// ============================================================
// 📋 EXAMS API (MOCKS)
// ============================================================
export const examsAPI = {
    getAll: async () => { await delay(); return [...db.exams]; },
    create: async (data) => {
        await delay();
        const newItem = { ...data, id: generateId() };
        db.exams.push(newItem);
        return newItem;
    },
    update: async (id, data) => { await delay(); return {}; },
    delete: async (id) => {
        await delay();
        db.exams = db.exams.filter(item => item.id !== id);
        // Also delete attached results
        db.examResults = db.examResults.filter(item => item.exam_id !== id);
        return { success: true };
    },
};

// ============================================================
// 🏆 EXAM RESULTS API (MOCKS)
// ============================================================
export const examResultsAPI = {
    getAll: async () => { await delay(); return [...db.examResults]; },
    create: async (data) => {
        await delay();
        const newItem = { ...data, id: generateId() };
        db.examResults.push(newItem);
        return newItem;
    },
    update: async (id, data) => { await delay(); return {}; },
    delete: async (id) => {
        await delay();
        db.examResults = db.examResults.filter(item => item.id !== id);
        return { success: true };
    },
};

export default {
    academicYearAPI,
    subjectsAPI,
    classesAPI,
    studentsAPI,
    enrollmentsAPI,
    examsAPI,
    examResultsAPI,
};
