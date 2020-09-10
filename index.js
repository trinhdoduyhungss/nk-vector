module.exports.Create_one_hot = function (file_url, url_save) {
    let cre_oh = require('./src/Create_onehot')
    cre_oh.one_hot(file_url, url_save)
}
module.exports.Create_window_words = function (file_url, window_size, url_save) {
    let cre_w = require('./src/Create_windows')
    cre_w.window(file_url, window_size, url_save)
}
module.exports.train = function (size_output, url_data_one_hot, url_data_window_words, url_save) {
    let train = require('./src/Run_train')
    train.training(size_output, url_data_one_hot, url_data_window_words, url_save)
}
module.exports.build_vec_sentences = function (document, url_vecs_of_words, url_save) {
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
    function document2vec(document) {
        document = process(document).trim()
        document = filter_stop_word(document)
        document = document.split(' ')
        let findDuplicates = arr => arr.filter((item, index) => arr.indexOf(item) != index)
        let array_dup = findDuplicates(document)
        let array_sentence = []
        for (let i in document) {
            if (array_dup.indexOf(document[i]) == -1 && document[i].length > 3 && wordVecs[document[i]] != undefined) {
                array_sentence.push(wordVecs[document[i]])
            }
        }
        return average(array_sentence, array_sentence.length, 'mashup')
    }
    document = document.split('\n')
    let return_document_vec = {}
    for (let sentence in document) {
        let sen_vec = document2vec(document[sentence])
        if (sen_vec.length > 0) {
            return_document_vec[document[sentence]] = sen_vec
        }
    }
    if (Object.keys(return_document_vec).length > 0) {
        return_document_vec = JSON.stringify(return_document_vec)
        if (url_save.length > 0) {
            fs.writeFile(url_save, return_document_vec, function (err) {
                if (err) { console.log(err) }
                else {
                    console.log('Saved vecs')
                }
            })
        } else {
            return return_document_vec
        }
    }
}
module.exports.find_word = function (target, url_vecs_of_word, size_result) {
    let search = require('./src/search_word_similarity')
    return search(target, url_vecs_of_word, size_result)
}
module.exports.knn = function (target, type_distance, data, k) {
    let kdTree = require('./src/KD-tree')
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
    function format_result(nearest){
        let format_nearest = []
        for (let item in nearest) {
            let array_item = Object.values(nearest[item][0])
            format_nearest.push([array_item, nearest[item][1]])
        }
        return format_nearest.sort(function (a, b) { return a[1] - b[1] })
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
            return format_result(nearest)
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
            tree_cosin = tree_cosin.nearest(search, k);
            return format_result(tree_cosin).reverse()
        }
    }
}
module.exports.VN_segmentation_tag = function (document) {
    let vntk = require('vntk');
    let tokenizer = vntk.wordTokenizer();
    return tokenizer.tag(document);
}
module.exports.clear_sentence_vn = function(document){
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
    document = process(document)
    let array_token =  tokenizer.tag(document);
    let file_stop_word = fs.readFileSync("stop_word_vn.txt").toString();
    file_stop_word = file_stop_word.split("\r\n")
    array_token = array_token.filter(function (value, index, arr) {
        return file_stop_word.includes(process(value)) <= 0;
    });
    let new_text = ''
    for (let i in array_token) {
        if (array_token[i] != '' && array_token[i].length >= 2) {
            new_text += array_token[i] + ' '
        }
    }
    return new_text.trim()
}
module.exports.clear_sentence_en = function(document){
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
    document = process(document)
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
    return filter_stop_word(document)
}
module.exports.remove_duplicate_words = function(document){
    document = document.split(' ')
    document = [...new Set(document)]
    let new_text = ''
    for (let i in document) {
        if (document[i] != '' && document[i].length >= 2) {
            new_text += document[i] + ' '
        }
    }
    return new_text.trim()
}