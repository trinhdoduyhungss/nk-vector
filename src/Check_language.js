module.exports.check_language = function(text){
    let NKV = require('../index.js')
    function check_telex(text){
        let num_char_telex = 0
        text.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ|è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ|ì|í|ị|ỉ|ĩ|ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ|ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ|ỳ|ý|ỵ|ỷ|ỹ|đ/g, function(char){
            if(char){
                num_char_telex += 1
            }
        })
        return num_char_telex
    }
    function chage_telex(text) {
        let str = text;
        str = str.toLowerCase();
        str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, function (x) {
            if (x == 'à') {
                return 'af'
            }
            else if (x == 'á') {
                return 'as'
            }
            else if (x == 'ạ') {
                return 'aj'
            }
            else if (x == 'ả') {
                return 'ar'
            }
            else if (x == 'ã') {
                return 'ax'
            }
            else if (x == 'â') {
                return 'aa'
            }
            else if (x == 'ầ') {
                return 'aaf'
            }
            else if (x == 'ấ') {
                return 'aas'
            }
            else if (x == 'ẫ') {
                return 'aax'
            }
            else if (x == 'ẩ') {
                return 'aar'
            }
            else if (x == 'ậ') {
                return 'aaj'
            }
            else if (x == 'ă') {
                return 'aw'
            }
            else if (x == 'ằ') {
                return 'awf'
            }
            else if (x == 'ẳ') {
                return 'awr'
            }
            else if (x == 'ắ') {
                return 'aws'
            }
            else if (x == 'ặ') {
                return 'awj'
            }
            else if (x == 'ẵ') {
                return 'awx'
            }
        });
        str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, function (x) {
            if (x == 'è') {
                return 'ef'
            }
            else if (x == 'é') {
                return 'es'
            }
            else if (x == 'ẹ') {
                return 'ej'
            }
            else if (x == 'ẻ') {
                return 'er'
            }
            else if (x == 'ẽ') {
                return 'ex'
            }
            else if (x == 'ê') {
                return 'ee'
            }
            else if (x == 'ề') {
                return 'eef'
            }
            else if (x == 'ế') {
                return 'ees'
            }
            else if (x == 'ễ') {
                return 'eex'
            }
            else if (x == 'ể') {
                return 'eer'
            }
            else if (x == 'ệ') {
                return 'eej'
            }
        });
        str = str.replace(/ì|í|ị|ỉ|ĩ/g, function (x) {
            if (x == 'ì') {
                return 'if'
            }
            else if (x == 'í') {
                return 'is'
            }
            else if (x == 'ị') {
                return 'ij'
            }
            else if (x == 'ỉ') {
                return 'ir'
            }
            else if (x == 'ĩ') {
                return 'ix'
            }
        });
        str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, function (x) {
            if (x == 'ò') {
                return 'of'
            }
            else if (x == 'ó') {
                return 'os'
            }
            else if (x == 'ọ') {
                return 'oj'
            }
            else if (x == 'ỏ') {
                return 'or'
            }
            else if (x == 'õ') {
                return 'ox'
            }
            else if (x == 'ô') {
                return 'oo'
            }
            else if (x == 'ồ') {
                return 'oof'
            }
            else if (x == 'ố') {
                return 'oos'
            }
            else if (x == 'ỗ') {
                return 'oox'
            }
            else if (x == 'ổ') {
                return 'oor'
            }
            else if (x == 'ộ') {
                return 'ooj'
            }
            else if (x == 'ơ') {
                return 'ow'
            }
            else if (x == 'ờ') {
                return 'owf'
            }
            else if (x == 'ở') {
                return 'owr'
            }
            else if (x == 'ớ') {
                return 'ows'
            }
            else if (x == 'ợ') {
                return 'owj'
            }
            else if (x == 'ỡ') {
                return 'owx'
            }
        });
        str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, function (x) {
            if (x == 'ù') {
                return 'uf'
            }
            else if (x == 'ú') {
                return 'us'
            }
            else if (x == 'ụ') {
                return 'uj'
            }
            else if (x == 'ủ') {
                return 'ur'
            }
            else if (x == 'ũ') {
                return 'ux'
            }
            else if (x == 'ư') {
                return 'uw'
            }
            else if (x == 'ừ') {
                return 'uwf'
            }
            else if (x == 'ứ') {
                return 'uws'
            }
            else if (x == 'ự') {
                return 'uwj'
            }
            else if (x == 'ữ') {
                return 'aar'
            }
            else if (x == 'ử') {
                return 'uwr'
            }
        });
        str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, function (x) {
            if (x == 'ỳ') {
                return 'yf'
            }
            else if (x == 'ý') {
                return 'ys'
            }
            else if (x == 'ỵ') {
                return 'yj'
            }
            else if (x == 'ỷ') {
                return 'yr'
            }
            else if (x == 'ỹ') {
                return 'yx'
            }
        });
        str = str.replace(/đ/g, "dd");
        str = str.trim();
        return str;
    }
    function check_language(text, num_char_telex){
        let text_length = text.length
        let analytics = (text_length-num_char_telex)/text_length
        if(analytics > 0.5 && analytics < 1){
            return {'your_text':text,'label':'English', 'fix_text': chage_telex(text)}
        }
        else if (analytics = 1){
            return {'your_text':text,'label':'English'}
        }
        else if (analytics < 0.5){
            return {'your_text':text,'label':'Vietnamese'}
        }
    }
    return check_language(text, check_telex(text))
}