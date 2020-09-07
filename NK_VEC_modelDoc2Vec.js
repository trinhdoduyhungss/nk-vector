let fs = require("fs");
let data_vector = fs.readFileSync('NK_VEC_build_vec_success(1).json', 'utf8')
let wordVecs = JSON.parse(data_vector);
let file_stop_word = fs.readFileSync("stop_word.txt").toString();
file_stop_word = file_stop_word.split("\r\n")
function mashup(matrix) {
    let result = matrix[0]
    for (let i = 1; i < matrix.length; i++) {
        for (let j in matrix[i]) {
            result[j] += matrix[i][j]
        }
    }
    return result
}
function average(matrix, size, type) {
    if (type == "mashup") {
        let matrix_mashup = mashup(matrix)
        let result = []
        for (let i in matrix_mashup) {
            result.push(matrix_mashup[i] / size)
        }
        if (result.length != 0) {
            return result
        }
    } else if (type == "nonmashup") {
        let result = []
        for (let i in matrix) {
            let line = []
            for (let j in matrix[i]) {
                line.push(matrix[i][j] / size)
            }
            if (line.length > 0 && line.length == matrix[i].length) {
                result.push(line)
            }
        }
        if (result.length != 0) {
            return result
        }
    }
    else {
        let result = []
        for (let i in matrix[0]) {
            result.push(matrix[0][i] / matrix[0].length)
        }
        if (result.length != 0) {
            return result
        }
    }
}
function doc2vec(doc){
    doc = process(doc).trim()
    doc = filter_stop_word(doc)
    doc = doc.split(' ')
    let array_sentence = []
    for(let i in doc){
        if(wordVecs[doc[i]] != undefined){
            array_sentence.push(wordVecs[doc[i]])
        }
    }
    return average(array_sentence, array_sentence.length, 'mashup')
}
function L2_norm(a) {
    let value = 0
    for (let i in a) {
        value += a[i] * a[i]
    }
    let sqrt_value = Math.sqrt(value)
    return sqrt_value
}
function filter_stop_word(text) {
    text = text.split(' ')
    text = text.filter(function (value, index, arr) {
        return file_stop_word.includes(process(value)) <= 0;
    });
    let new_text = ''
    for (let i in text) {
        if (text[i] != '' && text[i].length >= 2) {
            new_text += text[i] + ' '
        }
    }
    return new_text.trim()
}
function process(text) {
    text = text.replace(/[’“”%&!’#√.*+?,;^${}()_`'"|[\]\\//]/g, " ")
    text = text.replace(/(\r\n\t|\n|\r)/gm, " ");
    text = text.replace(/[=]/g, " ");
    text = text.replace(/[:]/g, " ");
    text = text.replace(/[-]/g, " ");
    text = text.replace(/[>]/g, " ");
    text = text.replace(/[<]/g, " ");
    text = text.replace(/[@]/g, " ");
    text = text.replace(/\s+/g, ' ')
    text = text.replace(/[0-9]/g, ' ');
    text = text.toLocaleLowerCase()
    text = text.trim()
    text = text.trim()
    return text
}
function cosine_similarity(a, b) {
    let value_dot = 0
    for (let i in a) {
        value_dot += a[i] * b[i]
    }
    return Math.abs(value_dot) / (L2_norm(a) * L2_norm(b))
}
let sentence1 = doc2vec('apple')
let sentence2 = doc2vec('macbook')
let cosine_sim = cosine_similarity(sentence1, sentence2)
console.log(cosine_sim)