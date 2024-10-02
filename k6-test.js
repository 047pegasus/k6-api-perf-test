import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
    stages: [
        { duration: '1m', target: 10 }, // ramp-up to 100 users
        { duration: '2m', target: 500 }, // ramp-up to 500 users
        { duration: '3m', target: 1000 }, // peak load of 1000 users
        { duration: '1m', target: 0 },   // ramp-down
    ],
};

export default function () {
    let res = http.get('http://localhost:3001/api/users');
    check(res, { 'status was 200': (r) => r.status == 200 });
    sleep(1);
    res = http.get('http://localhost:3001/api/orders');
    check(res, { 'status was 200': (r) => r.status == 200 });
    sleep(1);
    res = http.get('http://localhost:3001/api/products');
    check(res, { 'status was 200': (r) => r.status == 200 });
    sleep(1);
    res = http.post('http://localhost:3001/api/orders', {
        user_id: 1,
        product_id: 1,
        quantity: 1
    });
    check(res, { 'status was 200': (r) => r.status == 200 });
    sleep(1);
    res = http.get('http://localhost:3001/api/orders');
    check(res, { 'status was 200': (r) => r.status == 200 });
    sleep(1);
}
