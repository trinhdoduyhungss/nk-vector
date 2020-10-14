module.exports.check_error_telex = function(error_text){
    function remove_redundant_char(text) {
        let chars = []
        let indexof_char = []
        return [text.replace(/ch|nh|th|kh|gi|ng|ph|gh|ngh/g, function(char_deleted){
            chars.push(char_deleted)
            indexof_char.push(text.indexOf(char_deleted))
            return ''
        }), chars, indexof_char]
    }
    function change_alias(alias) {
        let str = alias;
        str = str.toLowerCase();
        let process = remove_redundant_char(str)
        str = process[0]
        let index_ali = alias.indexOf(str)
        let char_deleted = process[1]
        let indexs = process[2]
        str = str.replace(/af|as|aj|ar|ax|aaf|aas|aaj|aar|aax|aa|awf|aws|awj|awr|awx|aw/g, function (x) {
            if (x == 'af') {
                return 'à'
            }
            else if (x == 'as') {
                return 'á'
            }
            else if (x == 'aj') {
                return 'ạ'
            }
            else if (x == 'ar') {
                return 'ả'
            }
            else if (x == 'ax') {
                return 'ã'
            }
            else if (x == 'aa') {
                return 'â'
            }
            else if (x == 'aaf') {
                return 'ầ'
            }
            else if (x == 'aas') {
                return 'ấ'
            }
            else if (x == 'aax') {
                return 'ẫ'
            }
            else if (x == 'aar') {
                return 'ẩ'
            }
            else if (x == 'aaj') {
                return 'ậ'
            }
            else if (x == 'aw') {
                return 'ă'
            }
            else if (x == 'awf') {
                return 'ằ'
            }
            else if (x == 'awr') {
                return 'ẳ'
            }
            else if (x == 'aws') {
                return 'ắ'
            }
            else if (x == 'awj') {
                return 'ặ'
            }
            else if (x == 'awx') {
                return 'ẵ'
            }
        });
        str = str.replace(/ef|es|ej|er|ex|eef|ees|eej|eer|eex|ee/g, function (x) {
            if (x == 'ef') {
                return 'è'
            }
            else if (x == 'es') {
                return 'é'
            }
            else if (x == 'ej') {
                return 'ẹ'
            }
            else if (x == 'er') {
                return 'ẻ'
            }
            else if (x == 'ex') {
                return 'ẽ'
            }
            else if (x == 'ee') {
                return 'ê'
            }
            else if (x == 'eef') {
                return 'ề'
            }
            else if (x == 'ees') {
                return 'ế'
            }
            else if (x == 'eex') {
                return 'ễ'
            }
            else if (x == 'eer') {
                return 'ể'
            }
            else if (x == 'eej') {
                return 'ệ'
            }
        });
        str = str.replace(/if|is|ij|ir|ix/g, function (x) {
            if (x == 'if') {
                return 'ì'
            }
            else if (x == 'is') {
                return 'í'
            }
            else if (x == 'ij') {
                return 'ị'
            }
            else if (x == 'ir') {
                return 'ỉ'
            }
            else if (x == 'ix') {
                return 'ĩ'
            }
        });
        str = str.replace(/of|os|oj|or|ox|oof|oos|ooj|oor|oox|oo|owf|ows|owj|owr|owx|ow/g, function (x) {
            if (x == 'of') {
                return 'ò'
            }
            else if (x == 'os') {
                return 'ó'
            }
            else if (x == 'oj') {
                return 'ọ'
            }
            else if (x == 'or') {
                return 'ỏ'
            }
            else if (x == 'ox') {
                return 'õ'
            }
            else if (x == 'oo') {
                return 'ô'
            }
            else if (x == 'oof') {
                return 'ồ'
            }
            else if (x == 'oos') {
                return 'ố'
            }
            else if (x == 'oox') {
                return 'ỗ'
            }
            else if (x == 'oor') {
                return 'ổ'
            }
            else if (x == 'ooj') {
                return 'ộ'
            }
            else if (x == 'owf') {
                return 'ờ'
            }
            else if (x == 'owr') {
                return 'ở'
            }
            else if (x == 'ows') {
                return 'ớ'
            }
            else if (x == 'owj') {
                return 'ợ'
            }
            else if (x == 'owx') {
                return 'ỡ'
            }
            else if (x == 'ow') {
                return 'ơ'
            }
        });
        str = str.replace(/uf|us|uj|ur|ux|uwf|uws|uwj|uwr|uwx|uw/g, function (x) {
            if (x == 'uf') {
                return 'ù'
            }
            else if (x == 'us') {
                return 'ú'
            }
            else if (x == 'uj') {
                return 'ụ'
            }
            else if (x == 'ur') {
                return 'ủ'
            }
            else if (x == 'ux') {
                return 'ũ'
            }
            else if (x == 'uw') {
                return 'ư'
            }
            else if (x == 'uwf') {
                return 'ừ'
            }
            else if (x == 'uws') {
                return 'ứ'
            }
            else if (x == 'uwj') {
                return 'ự'
            }
            else if (x == 'uwr')   {
                return 'ử'
            }
            else if (x == 'uwx') {
                return 'ữ'
            }
        });
        str = str.replace(/yf|ys|yj|yr|yx/g, function (x) {
            if (x == 'yf') {
                return 'ỳ'
            }
            else if (x == 'ys') {
                return 'ý'
            }
            else if (x == 'yj') {
                return 'ỵ'
            }
            else if (x == 'yr') {
                return 'ỷ'
            }
            else if (x == 'yx') {
                return 'ỹ'
            }
        });
        str = str.replace(/dd/g, "đ");
        str = str.trim();
        if(char_deleted.length > 0){
            char_deleted.push(str)
            indexs.push(Math.abs(index_ali))
            let arr = [...Array(Math.max(...indexs))].map(item => '')
            for(let i in char_deleted){
                arr[indexs[i]] = char_deleted[i]
            }
            let result = ''
            for(let i in arr){
                result += arr[i]
            }
            if(result.length > 0){
                return result;
            }
        }else{
            return str
        }
    }
    let text = error_text 
    text = text.split(' ');
    let processed_text = ''
    for(let word in text){
        processed_text += change_alias(text[word]) +' '
    }
    return processed_text.trim()
}