import axios from 'axios';

const ax = axios.create({
    baseURL: 'http://52.79.170.225/api'
});

export function getCourse(elearnCourseId) {
    return ax.get('/elearning/course.djson', {
        params: { elearnCourseId }
    });
}