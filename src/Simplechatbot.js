module.exports.chatbot = function (text) {
    let fs = require('fs');
    let NKV = require('../index.js')
    const path = require('path');
    let data_check_label = fs.readFileSync(path.join(__dirname, "/data_check_labels.json"), 'utf8')
    data_check_label = JSON.parse(data_check_label);
    let data_points = fs.readFileSync(path.join(__dirname, "/data_for_knn.txt"), 'utf8')
    data_points = JSON.parse(data_points);
    function process_sentence(document) {
        let sentence = NKV.VN_segmentation_tag(document.toLocaleLowerCase())
        let full_sentence = ''
        for (let word in sentence) {
            full_sentence += sentence[word].replace(' ', '_') + ' '
        }
        if (full_sentence.length > 0) {
            return full_sentence.trim()
        }
    }
    function find_label(document) {
        let processed = process_sentence(document)
        let vec_search = NKV.build_vec_sentences(processed, path.join(__dirname,"/data_vec.json"), '')
        if (vec_search != undefined && Object.keys(vec_search).length > 0) {
            let arrays_result_search = NKV.knn(vec_search[processed], 'eculid', data_points, 5)
            let labels_search = {}
            for (let i in arrays_result_search) {
                let label_item = data_check_label[arrays_result_search[i][0].toString()]
                if (labels_search[label_item] == undefined) {
                    labels_search[label_item] = 1
                }
                else {
                    labels_search[label_item] += 1
                }
            }
            if (Object.keys(labels_search).length > 0) {
                return Object.keys(labels_search).sort(function (a, b) { return labels_search[a] - labels_search[b] }).reverse()[0]
            }
        }
    }
    let label = find_label(text)
    if(label != undefined){
        return label
    }else{
        return "unknown"
    }
    // console.log(NKV.build_vec_sentences(process_sentence('cân bằng phương trình hóa học'), 'E:/Project chatbot NLP NK/data_vec.json', ''))
}