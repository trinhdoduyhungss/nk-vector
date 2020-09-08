module.exports.Create_one_hot = function (file_url, url_save) {
    let cre_oh = require('./Create_onehot')
    cre_oh.one_hot(file_url, url_save)
}
module.exports.Create_window_words = function (file_url, window_size, url_save) {
    let cre_w = require('./Create_windows')
    cre_w.window(file_url, window_size, url_save)
}
module.exports.train = function (size_output, url_data_one_hot, url_data_window_words, url_save) {
    let train = require('./Run_train')
    train.training(size_output, url_data_one_hot, url_data_window_words, url_save)
}
module.exports.build_vec_sentences = function (doc, url_vecs_of_words, url_save) {
    let fs = require("fs");
    let data_vector = fs.readFileSync(url_vecs_of_words, 'utf8')
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
        text = text.replace(/[’“”%&!’#√.*+?,;^${}()_`'"|[\]\\//]/g, " ");
        text = text.replace(/[0-9]/g, '');
        text = text.replace(/(\r\n\t|\n|\r)/gm, " ");
        text = text.replace(/[=]/g, " ");
        text = text.replace(/[:]/g, " ");
        text = text.replace(/[-]/g, " ");
        text = text.replace(/[>]/g, " ");
        text = text.replace(/[<]/g, " ");
        text = text.replace(/[@]/g, " ");
        text = text.replace(/\s+/g, ' ')
        text = text.replace(/[0-9]/g, ' ');
        text = text.replace("\\t ", "");
        text = text.replace("\n", "");
        text = text.replace("\n\t", "");
        text = text.replace("    ", "");
        text = text.toLocaleLowerCase();
        text = text.trim();
        text = text.trim();
        return text
    }
    function doc2vec(doc) {
        doc = process(doc).trim()
        doc = filter_stop_word(doc)
        doc = doc.split(' ')
        let findDuplicates = arr => arr.filter((item, index) => arr.indexOf(item) != index)
        let array_dup = findDuplicates(doc)
        let array_sentence = []
        for (let i in doc) {
            if (array_dup.indexOf(doc[i]) == -1 && doc[i].length > 3 && wordVecs[doc[i]] != undefined) {
                array_sentence.push(wordVecs[doc[i]])
            }
        }
        return average(array_sentence, array_sentence.length, 'mashup')
    }
    doc = doc.split('\n')
    let return_doc_vec = {}
    for (let sentence in doc) {
        let sen_vec = doc2vec(doc[sentence])
        if (sen_vec.length > 0) {
            return_doc_vec[doc[sentence]] = sen_vec
        }
    }
    if (Object.keys(return_doc_vec).length > 0) {
        return_doc_vec = JSON.stringify(return_doc_vec)
        if (url_save.length > 0) {
            fs.writeFile(url_save, return_doc_vec, function (err) {
                if (err) { console.log(err) }
                else {
                    console.log('Saved vecs')
                }
            })
        } else {
            return return_doc_vec
        }
    }
}
module.exports.find_word = function (target, url_vecs_of_word, size_result) {
    let search = require('./search_word_similarity')
    return search(target, url_vecs_of_word, size_result)
}
module.exports.knn = function (target, type_distance, data, k) {
    let kdTree = require('./KD-tree')
    let points = []
    for (let i in data) {
        let item = {}
        for (let y in data[i]) {
            item[y] = data[i][y]
        }
        if (Object.keys(item).length > 0) {
            points.push(item)
        }
    }
    let search = {}
    for (let i in target) {
        search[i] = target[i]
    }
    if (points.length > 0 && Object.keys(search).length > 0) {
        let dimensions = Object.keys(points[0])
        if (type_distance == "eculid") {
            function distance_eculid(a, b) {
                let key = Object.keys(a)
                let value = 0
                for (let i in key) {
                    value += Math.pow(a[key[i]] - b[key[i]], 2)
                }
                return value
            }
            let tree_eculid = new kdTree.kdTree(points, distance_eculid, dimensions);
            let nearest = tree_eculid.nearest(search, k);
            return nearest.sort(function (a, b) { return a[1] - b[1] })
        }
        if (type_distance == 'cosine') {
            function L2_norm(a) {
                let value = 0
                for (let i in a) {
                    value += a[i] * a[i]
                }
                let sqrt_value = Math.sqrt(value)
                return sqrt_value
            }
            function cosine_similarity(a, b) {
                let value_dot = 0
                for (let i in a) {
                    value_dot += a[i] * b[i]
                }
                return Math.abs(value_dot) / (L2_norm(a) * L2_norm(b))
            }
            let tree_cosin = new kdTree.kdTree(points, cosine_similarity, dimensions);
            return tree_cosin.nearest(search, k);
        }
    }
}
module.exports.VN_segmentation_tag = function (doc) {
    let vntk = require('vntk');
    let tokenizer = vntk.wordTokenizer();
    return tokenizer.tag(doc);
}
module.exports.clear_sentence_vn = function(doc){
    function process(text) {
        text = text.replace(/[’“”%&!’#√.*+?,;^${}()_`'"|[\]\\//]/g, " ");
        text = text.replace(/[0-9]/g, '');
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
    let vntk = require('vntk');
    let fs = require('fs')
    let tokenizer = vntk.wordTokenizer();
    doc = process(doc)
    let array_token =  tokenizer.tag(doc);
    let file_stop_word = fs.readFileSync("stop_word_vn.txt").toString();
    file_stop_word = file_stop_word.split("\r\n")
    array_token = array_token.filter(function (value, index, arr) {
        return file_stop_word.includes(process(value)) <= 0;
    });
    array_token = [...new Set(array_token)]
    let new_text = ''
    for (let i in array_token) {
        if (array_token[i] != '' && array_token[i].length >= 2) {
            new_text += array_token[i] + ' '
        }
    }
    return new_text.trim()
}
module.exports.clear_sentence_en = function(doc){
    let fs = require('fs')
    function process(text) {
        text = text.replace(/[’“”%&!’#√.*+?,;^${}()_`'"|[\]\\//]/g, " ");
        text = text.replace(/[0-9]/g, '');
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
    let file_stop_word = fs.readFileSync("stop_word.txt").toString();
    file_stop_word = file_stop_word.split("\r\n")
    doc = process(doc)
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
    return filter_stop_word(doc)
}
module.exports.remove_duplicate_words = function(doc){
    doc = doc.split(' ')
    doc = [...new Set(doc)]
    let new_text = ''
    for (let i in doc) {
        if (doc[i] != '' && doc[i].length >= 2) {
            new_text += doc[i] + ' '
        }
    }
    return new_text.trim()
}