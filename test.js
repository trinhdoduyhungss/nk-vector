let NKV = require('./index.js')
let points = [
    [ 1,  2 ],
    [ 3,  4 ],
    [ 5,  6 ],
    [ 7,  8 ]
];

let nearest = NKV.knn([ 7,  8 ], 'cosine', points, 4);
console.log(nearest);