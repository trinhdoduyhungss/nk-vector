let NKV = require('../index.js')
let points = [
    [ 1,  2 ],
    [ 3,  4 ],
    [ 5,  6 ],
    [ 7,  8 ]
];

let nearest = NKV.knn([ 7,  8 ], 'cosine', points, 4);
// console.log(nearest);
// console.log("Ai là nhà lãnh đạo Việt Nam", "\nlabel: ",NKV.fast_build_chatbot('Ai là nhà lãnh đạo Việt Nam'))
console.log(NKV.English_or_Vietnamese('hello, hơ ảe you?'))
// console.log(NKV.clear_sentence_vn("Chào mừng các bạn lên trên trời, ở đây là trên trời"))
// console.log(NKV.clear_sentence_en("List of words in the dictionary"))
// console.log(NKV.remove_duplicate_words("chào chào mừng các bạn"))