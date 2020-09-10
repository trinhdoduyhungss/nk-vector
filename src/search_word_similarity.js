module.exports.search_word_similarity = function(target, url_vecs_of_word, size_result){
    let fs = require("fs");
    let data_vector = fs.readFileSync(url_vecs_of_word, 'utf8')
    let wordVecs = JSON.parse(data_vector);
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
    let text = target
    let result = {}
    for (let i in wordVecs) {
        let cosine_sim = cosine_similarity(wordVecs[i], wordVecs[text])
        if(cosine_sim > 0.2){
            result[i] = cosine_sim
        }
    }
    if (Object.keys(result).length > 0) {
        result = Object.keys(result)
            .sort((c, b) => {
                return result[b] - result[c]
            })
            .reduce((acc, cur) => {
                let o = []
                o.push(cur, result[cur])
                acc[acc.length] = o
                return acc
            }, [])
        let return_sim = []
        for (let i in result) {
            if (return_sim.length < size_result) {
                return_sim.push(result[i])
            } else {
                break
            }
        }
        if (return_sim.length > 0) {
            console.log('Some words similarity "',text,'": ',return_sim)
        }
    }
    
}