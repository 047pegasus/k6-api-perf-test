import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
    stages: [
        { duration: '30s', target: 10 }, // ramp-up to 100 users
        // { duration: '2m', target: 500 }, // ramp-up to 500 users
        // { duration: '3m', target: 1000 }, // peak load of 1000 users
        { duration: '30s', target: 0 },   // ramp-down
    ],
};

export default function () {
    let res = http.get('http://localhost:3000/api/users');
    check(res, { 'status was 200': (r) => r.status == 200 });
    sleep(1);
}
