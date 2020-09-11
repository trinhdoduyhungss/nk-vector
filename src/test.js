let NKV = require('../index.js')
let points = [
    [ 1,  2 ],
    [ 3,  4 ],
    [ 5,  6 ],
    [ 7,  8 ]
];

let nearest = NKV.knn([ 7,  8 ], 'cosine', points, 4);
console.log(nearest);
NKV.fast_build_chatbot('cân bằng phương trình hóa học')

// console.log(NKV.clear_sentence_vn("Chào mừng các bạn lên trên trời, ở đây là trên trời"))
// console.log(NKV.clear_sentence_en("List of words in the dictionary"))
// console.log(NKV.remove_duplicate_words("chào chào mừng các bạn"))