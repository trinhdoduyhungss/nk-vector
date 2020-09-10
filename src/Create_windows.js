module.exports.window = function (file_url, window_size, url_save) {
    let fs = require("fs");
    let file_NL = fs.readFileSync(file_url).toString();
    file_NL = file_NL.split("\r\n")
    let file_stop_word = fs.readFileSync("stop_word.txt").toString();
    file_stop_word = file_stop_word.split("\r\n")
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
        text = text.replace(/[…]/g, " ");
        text = text.replace(/\s+/g, ' ')
        text = text.replace(/[0-9]/g, ' ');
        text = text.toLocaleLowerCase()
        text = text.trim()
        text = text.trim()
        return text
    }
    function catch_windows(text, window_size) {
        if (window_size % 2 == 0) {
            return 'Error! The window size must be an uneven number'
        }
        else {
            text = process(text)
            arr_text = text.split(" ")
            let result = []
            for (let i = 0; i <= arr_text.length; i++) {
                let arr_left = arr_text.slice(i, arr_text.length)
                if (arr_left.length >= window_size) {
                    let focus_word = (Math.round(window_size / 2) + i) - 1
                    let left_focus_word = arr_text.slice(focus_word - ((window_size - 1) / 2), focus_word)
                    let rigth_focus_word = arr_text.slice(focus_word + 1, focus_word + ((window_size - 1) / 2) + 1)
                    if (left_focus_word.indexOf('') == -1 && rigth_focus_word.indexOf('') == -1) {
                        result.push(left_focus_word.concat(rigth_focus_word, arr_text[focus_word]))
                    } else {
                        continue
                    }
                }
                else {
                    return result
                }
            }
        }
    }
    function readyData(data, window_size) {
        let data_return = []
        let data_clean = ''
        for (let i in data) {
            let sentence = data[i].split(" ")
            for (let word in sentence) {
                data_clean += sentence[word] + " "
            }
        }
        if (data_clean != '') {
            data_clean = process(data_clean).trim()
            let array_data = process(data_clean).split(" ")
            array_data = array_data.filter(function (value, index, arr) {
                return value.length > 2;
            });
            array_data = array_data.filter(function (value, index, arr) {
                return value != '';
            });
            let filtered_stop_word = array_data.filter(function (value, index, arr) {
                return file_stop_word.includes(process(value)) <= 0;
            });
            let data_catch = ''
            for (let i in filtered_stop_word) {
                if (filtered_stop_word[i] != '' && filtered_stop_word[i].length >= 2) {
                    data_catch += filtered_stop_word[i] + ' '
                }
            }
            if (data_catch != '') {
                let arr_catch = catch_windows(process(data_catch), window_size)
                if (arr_catch.length != 0) {
                    for (let item in arr_catch) {
                        data_return.push(arr_catch[item])
                    }
                }
            }
            if (data_return.length > 0) {
                return data_return
            }
        }
    }
    if (window_size % 2 == 0) {
        console.log('\x1b[41m','Error! The window size must be an uneven number','\x1b[0m')
    } else {
        let data_Save = readyData(file_NL, window_size)
        fs.writeFile(url_save, JSON.stringify(data_Save), 'utf8', function (err) {
            if (err) {
                throw err;
            }
            else {
                console.log('Saved data windows!');
                return data_Save
            }
        });
    }

}