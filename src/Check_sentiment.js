module.exports.sentiment = function (text) {
	let fs = require('fs');
    const path = require('path');
	let file_stop_word_en = fs.readFileSync(path.join(__dirname, "/stop_word.txt"), 'utf8').toString();
	file_stop_word_en = file_stop_word_en.split("\r\n")
	let file_stop_word_vn = fs.readFileSync(path.join(__dirname, "/stop_word_vn.txt"), 'utf8').toString();
	file_stop_word_vn = file_stop_word_vn.split("\r\n")
	function count(arraydata) {
		var array_elements = arraydata

		array_elements.sort();

		var current = null;
		var cnt = 0;
		for (var i = 0; i < array_elements.length; i++) {
			if (array_elements[i] != current) {
				if (cnt > 0) {
					countelement[current] = cnt
				}
				current = array_elements[i];
				cnt = 1;
			} else {
				cnt++;
			}
		}
		if (cnt > 0) {
			countelement[current] = cnt
		}

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
        text = text.replace(",", "");
        text = text.replace(/\s+/g, ' ')
        text = text.replace(/[0-9]/g, ' ');
        text = text.toLocaleLowerCase()
        text = text.trim()
        text = text.trim()
        return text
    }
	function filter_stop_word(text) {
        text = text.split(' ')
        text = text.filter(function (value, index, arr) {
            return file_stop_word_en.includes(process(value)) <= 0;
        });
        text = text.filter(function (value, index, arr) {
            return file_stop_word_vn.includes(process(value)) <= 0;
        });
        let new_text = ''
        for (let i in text) {
            if (text[i] != '' && text[i].length >= 2) {
                new_text += text[i] + ' '
            }
        }
        return new_text.trim()
	}
	var results = []
	let data_sentiment = require('./data_sentiment.json')
	text = filter_stop_word(text)
	let test = text.toLocaleLowerCase()
	test = test.replace(/[.*+?!${},]/g, " ")
	let split_test = test.split(" ")
	for (var i in data_sentiment) {
		if (i.split(" ").length >= 1) {
			if (test.toLocaleLowerCase().indexOf(i.toLocaleLowerCase()) != -1) {
				results.push(data_sentiment[i])
			}
		}
		else {
			for (var word in split_test) {
				if (i.toLocaleLowerCase() === split_test[word].toLocaleLowerCase()) {
					results.push(data_sentiment[i])
				}
			}
		}
	}
	if (results.length > 0 && results != undefined && results != null) {
		countelement = {}
		count(results)
		let sortcount = Object.values(countelement).sort(function (a, b) { return a - b })
		var maxInNumbers = Math.max.apply(Math, sortcount);
		for (var i in countelement) {
			if (countelement[i] == maxInNumbers) {
				return i
			}
		}

	} else {
		return "chưa xác định được"
	}
}