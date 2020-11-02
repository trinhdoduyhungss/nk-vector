module.exports.one_hot = function (file_url, url_save){
    let fs = require('fs');
    const path = require('path');
    let file_NL = fs.readFileSync(file_url).toString();
    file_NL = file_NL.split("\r\n")
    file_NL = [...new Set(file_NL)]
    let file_stop_word = fs.readFileSync(path.join(__dirname, "/stop_word.txt"), 'utf8').toString();
    file_stop_word = file_stop_word.split("\r\n")
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
        text = text.replace(/[’“”%&!’#√.*+?,;^${}()`'"|[\]\\//]/g, " ");
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
    function create_data(data) {
        let data_clean = ''
        for (let i in data) {
            let sentence = data[i]
                data_clean += filter_stop_word(sentence) + ' '
        }
        if (data_clean != '') {
            data_clean = process(data_clean).trim()
            return data_clean.trim()
        }
    }
    function run(file_NL) {
        let full_data = create_data(file_NL)
        if (full_data.length > 0) {
            let data_vec_save = {}
            let array_data = process(full_data).split(" ")
            array_data = array_data.filter(function (value, index, arr) {
                return value.length > 2;
            });
            array_data = array_data.filter(function (value, index, arr) {
                return value != '';
            });
            for (let word in array_data) {
                if (array_data[word] != '' && array_data[word].length >= 2) {
                    if (data_vec_save[array_data[word]] == undefined) {
                        data_vec_save[array_data[word]] = [...Array(array_data.length)].map((e,i) => {
                            if(i== word){return 1}else{return 0}})
                    } else {
                        try{
                            data_vec_save[array_data[word]].splice(word, 1, 1)
                        }catch(e){
                            data_vec_save[array_data[word]] = data_vec_save[array_data[word]]
                        }
                    }
                }
            }
            if (Object.keys(data_vec_save).length > 0) {
                console.log(Object.keys(data_vec_save).length)
                let json = JSON.stringify(data_vec_save);
                fs.writeFile(url_save, json, 'utf8', function (err) {
                    if (err) {
                        console.log(err)
                        throw err;
                    } else {
                        console.log('Saved data vector!');
                        return data_vec_save
                    }
                });
            }
        }
    }
    run(file_NL)
}