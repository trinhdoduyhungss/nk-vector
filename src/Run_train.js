module.exports.training = function (size_output, url_data_one_hot, url_data_window_words, url_save) {
    let fs = require('fs')
    let NKV = require('./NK_VEC.js')
    let data_one_hot = fs.readFileSync(url_data_one_hot, 'utf8')
    data_one_hot = JSON.parse(data_one_hot);
    let data_windows_words = fs.readFileSync(url_data_window_words, 'utf8').toString();
    data_windows_words = JSON.parse(data_windows_words)
    function rotating_array(W) {
        let result_W = []
        for (let j = 0; j < W[0].length; j++) {
            let x_W = []
            for (let i in W) {
                x_W.push(W[i][j])
            }
            if (x_W.length > 0) {
                result_W.push(x_W)
            }
        }
        if (result_W.length > 0) {
            return result_W
        }
    }
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
    function clear(vector) {
        let result = []
        for (let i in vector) {
            if (vector[i] == 0.5) {
                result.push(0)
            } else {
                result.push(vector[i])
            }
        }
        return result
    }
    function auto_focus(array, size_result_focus) {
        let check = {}
        let key_check = []
        for (let i = 0; i < array.length; i++) {
            if (array.length - i >= size_result_focus) {
                let array_item = []
                let count = 0
                for (let j = i; j < size_result_focus + i; j++) {
                    array_item.push(array[j])
                    count += array[j]
                }
                check[count] = array_item
                key_check.push(count)
            }
        }
        return check[Math.max(...key_check).toString()]
    }
    function run(epoch) {
        let data_result = {}
        for (let window in data_windows_words) {
            let training_data = []
            let focus_word = []
            try {
                let text_focus_word = ''
                for (let i in data_windows_words[window]) {
                    if (data_one_hot[data_windows_words[window][i]] != undefined) {
                        if (training_data.length != data_windows_words[window].length - 1) {
                            training_data.push(auto_focus(data_one_hot[data_windows_words[window][i]], size_output))
                        } else {
                            training_data = rotating_array(training_data)
                            text_focus_word = data_windows_words[window][i]
                            focus_word = auto_focus(data_one_hot[data_windows_words[window][i]], size_output)
                        }
                    } else {
                        console.log("windows và từ không có onehot vector: ", data_windows_words[window], data_windows_words[window][i]);
                    }
                }
                if (training_data != undefined && focus_word != undefined && training_data.length > 0 && focus_word.length > 0) {
                    let vector = NKV(epoch, training_data, focus_word, 0.1, true)
                    if (vector.length > 0) {
                        if (data_result[text_focus_word] == undefined) {
                            data_result[text_focus_word] = clear(vector)
                        }
                        else {
                            let vec_before = data_result[text_focus_word]
                            data_result[text_focus_word] = average([clear(vector), vec_before], 'mashup')
                        }
                        if (Object.keys(data_result).length % 10 == 0) {
                            console.log('You had ', Object.keys(data_result).length, ' words')
                        }
                    }
                }
            }
            catch (e) {
                console.log(e)
                continue
            }
            // if (Object.keys(data_result).length == 1) {
            //     break
            // }
        }
        if (Object.keys(data_result).length > 0) {
            return data_result
        }
    }
    if (size_output > data_one_hot[data_windows_words[0]].length) {
        console.log('\x1b[41m','Error! The size output is so large which must smaller size onehot input','\x1b[0m')
    } else {
        let data = run(20)
        if (Object.keys(data).length > 0) {
            data = JSON.stringify(data)
            fs.writeFile(url_save, data, function (err) {
                if (err) { console.log(err) }
                else {
                    console.log('Saved vecs')
                }
            })
        }
    }
}