[![npm version](http://img.shields.io/npm/v/nk-vector.svg?style=flat)](https://npmjs.org/package/nk-vector "View this project on npm")
[![npm downloads](https://img.shields.io/npm/dm/nk-vector.svg)](https://www.npmjs.com/package/nk-vector "View this project on npm")
# Giới thiệu về NK-VECTOR!
## Lý do ra đời
> Về cơ bản, NK-VEC là một Neural Network Embeddings có ý tưởng từ Word2Vec và có nhiệm vụ giống tất cả các mô hình nhúng từ hiện tại, nhưng nó có cấu tạo đơn giản hơn rất nhiều. Thông qua thư viện NK-VECTOR, bạn có thể sử dụng mô hình NK-VEC để build bộ vector theo dữ liệu riêng của bạn một cách đơn giản nhất. Ngoài ra NK-VECTOR còn cung cấp cho bạn một số tính năng, thuật toán hữu ích dùng để giải quyết các bài toán NLP.
## Về tên gọi
> Tôi tạo ra nó trong lúc nghiên cứu dự án lớn tại phòng tin học của trường THCS-THPT Nguyễn Khuyến (Đà Nẵng), nên NK là chữ viết tắt của tên trường, đây dấu ấn tôi muốn lưu lại và nó xứng đáng được thế.
# Các tính năng hiện tại
* Tạo one hot vector
* Tạo windows words
* Cho phép người dùng build bộ vector theo bộ dữ liệu riêng của họ
* Tìm từ tương tự
* Fast KNN (KNN K-d tree)
* Build vetor cho câu, cho đoạn văn, văn bản
* Tách từ tiếng Việt và tiếng Anh
* Làm sạch câu cho tiếng Việt và tiếng Anh
* Xóa từ lặp lại
# Hàm và các tham số
|Hàm|Tham số|Ví dụ|Lưu ý|
|---|-------|-----|-----|
|create_one_hot|<file_url, url_save>|"E:/project/data.txt", "E:/project/onehot.json"|Trong này sẽ mặc định lọc stopword tiếng Anh và các ký tự đặc biệt trừ dấu '_'|
|create_window_words|<file_url, window_size, url_save>|"E:/project/data.txt", 5, "E:/project/window.txt"|Trong này sẽ mặc định lọc stopword tiếng Anh và các ký tự đặc biệt trừ dấu '_'. window_size phải là số lẻ|
|train|<size_output, url_data_one_hot, url_data_window_words, url_save>|512, "E:/project/onehot.json", "E:/project/window.txt", "E:/project/data_vector.json"|size_output là số chiều vector đầu ra và nó phải nhỏ hơn số chiều đầu onehot vector đầu vào|
|build_vec_sentences|<"doc", url_vecs_of_words, url_save>|"Xin chào tất cả mọi người", "E:/project/data_vector.json", ""|Nếu url_save có độ dài bằng 0 thì mặc định trả về bộ vector mà không lưu, nếu lưu thì hãy để định dạng json - Vd: "E:/project/data_sentence_vector.json"|
|search_word_similarity|<"target", url_vecs_of_word, size_result>|"king","E:/project/data_vector.json", 15| size_result tương ứng với số lượng từ có độ tương tự từ cao nhất đến thấp được trả về"|
|knn|<"target", type_distance, data, k>|[ 7, 8 ], 'eculid', points, 4|Xem ví dụ sử dụng hàm knn bên dưới|
|VN_segmentation_tag|<"document">|"Chào mừng bạn đến với tôi"|Hãy chắc chắn rằng version node của bạn là phiên bản bắt đầy từ 10.16.0 trở lên|
|clear_sentence_VN|<"document">|"Chào mừng bạn đến với tôi"|Tại đây câu tiếng Việt của bạn sẽ được lọc từ stopword tiếng Việt cho đến các ký tự đặc biệt|
|clear_sentence_en|<"document">|"Chào mừng bạn đến với tôi"|Tại đây câu tiếng Anh của bạn sẽ được lọc từ stopword tiếng Anh cho đến các ký tự đặc biệt|
|remove_duplicate_words|<"document">|"Chào chào mừng bạn đến với tôi"|Tại đây sẽ xóa các từ bị trùng lặp trong câu và nó dùng cho cả tiếng Anh và Việt|
|fast_build_chatbot|<"text">|"Thời tiết hôm nay thế nào vậy"| Tại đây bot sẽ trả về một trong các nhãn: chemistry, general_asking, math, good_bye, hello, introduction, thanks, ask_weather, unknown|
|sentiment_VN|<"text">|"Hôm nay trời thật ảm đạm"|Tại đây sẽ trả về một trong các nhãn: buồn, vui, bực, bình thường, chưa xác định được"|
|fix_telex|<"text">|"Anh thisch awn busn char cas"|Tại đây sẽ trả về kết quả là chuỗi đã được telex - như ví dụ là: Anh thích ăn bún chả cá|
|English_or_Vietnamese|<"text">|"hello, hơ ảe you?"|Tại đây sẽ trả về kết quả là một Object gồm các trường your_text, label, fix_text - như ví dụ là { your_text: 'hello, hơ ảe you?', label: 'English',fix_text: 'hello, how are you?'
}|
# Cài đặt
> 1. Install [Node.js](http://nodejs.org/)
> 2. Run: npm i nk-vector
# Sử dụng
```javascript
let  NKV = require('nk-vector')
```
Ví dụ: Sử dụng hàm knn
```javascript
let  NKV = require('nk-vector')
let  points = [
[ 1, 2 ],
[ 3, 4 ],
[ 5, 6 ],
[ 7, 8 ]
];
let  nearest = NKV.knn([ 7, 8 ], 'eculid', points, 4);
console.log(nearest);
/*Result:
[ [ [ 7, 8 ], 0 ],
  [ [ 5, 6 ], 8 ],
  [ [ 3, 4 ], 32 ],
  [ [ 1, 2 ], 72 ] ]
Giải thích kết quả mảng trả về: [<vector trong tập dữ liệu>, <khoảng cách từ vector đầu vào tới vector này>]
*/
```
Ví dụ: Sử dụng hàm build_vec_sentences
```javascript
let NKV = require('nk-vector')
let sentence = NKV.VN_segmentation_tag(NKV.clear_sentence_vn('cân bằng phương trình hóa học'))
let full_sentence = ''
for(let word in sentence){
    full_sentence += sentence[word].replace(' ','_') + ' '
}
if(full_sentence.length > 0){
    console.log(full_sentence)
    console.log(NKV.build_vec_sentences(full_sentence.trim(), 'E:/<name_project>/data_vec.json', ''))
}
/*Result: 
{"cân_bằng phương_trình hóa học":[0.002338010428122218,...,0,0,0.00111962700489077,0.0009866701202071657,0.00111962700489077,0,0.00111962700489077,0,0,0.0009866701202071657,0,0.0010865777210490053,0,0.0010865777210490053,0,0,0,0,0,0.0009866701202071657,0,0,0,0,0,0,0.0010865777210490053,...0,0.0010865777210490053,...,0]}
*/
```
Ví dụ: Sử dụng hàm clear_sentence_vn
```javascript
let  NKV = require('nk-vector')
let clear_sentence = NKV.clear_sentence_vn("Chào mừng các bạn lên trên trời, ở đây là trên trời")
console.log(clear_sentence);
//Result: chào mừng trời trời
```
# Màu thông báo trong terminal
> <span style="color:red">Màu đỏ</span> : Lỗi không thể chạy tiếp được </br>
>
> <span style="color:yellow">Màu vàng</span> : Đây chỉ là thông báo bình thường, vẫn chạy tiếp được
# Một số lỗi bạn có thể gặp
## Lỗi không tìm thấy file stop word của cả bản Việt và Anh
> Nếu gặp lỗi không tìm thấy file stop word thì hãy tìm vào dòng lỗi theo đường dẫn trong terminal và sửa lại thành :</br>
> 1. path.join(__dirname,"/src/stop_word.txt") : Cho function clear_sentence_en
> 2. path.join(__dirname,"/src/stop_word_vn.txt"): Cho function clear_sentence_vn</br>
> Hoặc một đường dẫn tệp chính xác theo cách của bạn
>
> Lỗi này được thông báo cho người dùng với mức màu đỏ
## Lỗi không build được vector cho câu
> Lỗi này xảy ra khi các từ vựng, ký tự cấu tạo nên câu nằm trong bộ lọc stopword và ký tự đặc biệt loại bỏ trong quá trình training nên dẫn đến không có vector của các từ vựng này, dẫn đến câu nạp vào sẽ bị rỗng và không build được câu.</br>
>
> Lỗi này được thông báo cho người dùng với mức màu vàng
# Lời cảm ơn
Cảm ơn mọi người đã sử dụng NK-VECTOR, tôi sẽ cập nhật thường xuyên các thuật toán mới!<br>
Cảm ơn VUNB đã phát triển gói VNTK thần thánh
# Sản phẩm đã áp dụng
> Code Search: https://code-search-vni.herokuapp.com/ <br>
> Trước khi GPT-3 publish key cho mọi người thì mình vẫn có thể tạo ra một nơi để search code Python theo ngữ nghĩa na ná các example của GPT-3 nhé