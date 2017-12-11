import axios from 'axios';
 
export function getPost(id) {
    return axios({
        method: 'get',
        url: `https://jsonplaceholder.typicode.com/posts/${id}`,
    });
}

export function getComments(id) {
    return axios.get(`https://jsonplaceholder.typicode.com/posts/${id}/comments`);
}