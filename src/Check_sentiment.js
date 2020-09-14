module.exports.sentiment = function (text) {
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
    var results = []
    let data_sentiment = require('./data_sentiment.json')
	let test = text.toLocaleLowerCase()
	test = test.replace(/[.*+?!${},]/g, " ")
	let split_test = test.split(" ")
	for (var i in data_sentiment) {
		if(i.split(" ").length > 1){           
			if (test.toLocaleLowerCase().indexOf(i.toLocaleLowerCase()) != -1) {
				results.push(data_sentiment[i])
			}
		}
		else{
			for(var word in split_test){
				if(i.toLocaleLowerCase() === split_test[word].toLocaleLowerCase()){
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
				console.log(text, ' ', i)
				return i
			}
		}

	}else{
        return "chưa xác định được"
    }
}