module.exports = function (epoch, x, y, debug) {
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
                if (result[j] >= 230) {
                    result[j] = 0
                    result[j] += matrix[i][j]
                } else {
                    result[j] += matrix[i][j]
                }
            }
        }
        return result
    }
    function dot(matrix1, matrix2, type) {
        if (type == 'MxM') {
            let result = []
            for (let item in matrix1) {
                let contain_matrix = []
                for (let i in matrix1[item]) {
                    let line = []
                    for (let j in matrix2[i]) {
                        line.push(matrix1[item][i] * matrix2[i][j])
                    }
                    if (line.length > 0) {
                        contain_matrix.push(line)
                    }
                }
                if (contain_matrix.length > 0) {
                    result.push(mashup(contain_matrix))
                }
            }
            if (result.length > 0) {
                return result
            }
        }
        if (type == 'MxA') {
            let result = []
            for (let word in matrix1) {
                for (let item in matrix1[word]) {
                    let line = []
                    for (let i in matrix2) {
                        line.push(matrix1[word][item] * matrix2[i])
                    }
                    if (line.length > 0 && line.length == matrix2.length) {
                        result.push(line)
                    }
                }
            }
            if (result.length > 0) {
                return result[0]
            }
        }
        if (type == 'NxM') {
            let result = []
            for (let i in matrix2) {
                let line = []
                for (let item in matrix2[i]) {
                    line.push(matrix2[i][item] * matrix1)
                }
                if (line.length > 0 && line.length == matrix2[i].length) {
                    result.push(line)
                }
            }
            if (result.length > 0) {
                return result
            }
        }
        if (type == 'AxA') {
            let result = 0
            for (let i in matrix1[0]) {
                result += matrix1[0][i] * matrix2[0][i]
            }
            return result
        }
    }
    function subtract(N, S) {
        let result = []
        for (let i in S) {
            if(S[i] - N[i]){
                if(N[i] == 0.5){
                    result.push(S[i])
                }else{
                    result.push(S[i] - N[i])
                }
            }
            else {
                result.push(N[i])
            }
        }
        if (result.length > 0) {
            return result
        }
    }
    function add(N, S) {
        let result = []
        for (let i in S) {
            result.push(S[i] + N[i] - 0.1)
        }
        if (result.length > 0) {
            return result
        }
    }
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
        return value_dot / (L2_norm(a) * L2_norm(b))
    }
    function sigmoid(A) {
        A = A[0]
        let result = []
        for (let i in A) {
            result.push(1 / (1 + Math.exp(-A[i])))
        }
        return [result]
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
    function train(epoch, x, y) {
        let loss_rec = {}
        let W = [...Array(x[0].length)].map(e => Math.random()*1)
        let u = dot([W], rotating_array(x), 'MxM')
        u = sigmoid(u)
        let loss = 1 - cosine_similarity(u[0], y)
        let error = subtract(clear(u[0]), y)
        let error_x = dot([error], x, 'MxM')
        W = add(W, error_x[0])
        loss_rec['Epoch:0'] = loss
        let history = {}
        history[0] = u[0]
        let check_stopsoon = {}
        for (let i = 1; i < epoch; i++) {
            u = dot([W], rotating_array(x), 'MxM')
            u = sigmoid(u)
            loss = 1 - cosine_similarity(u[0], y)
            error = subtract(clear(u[0]), y)
            error_x = dot([error], x, 'MxM')
            W = add(W, error_x[0])
            if (loss_rec['Epoch:' + (i - 1).toString()] >= loss) {
                loss_rec['Epoch:' + i.toString()] = loss
                history[i] = u[0]
                if(isNaN(check_stopsoon[loss]) || check_stopsoon[loss] == undefined){
                    check_stopsoon[loss] = 0
                }else{
                    check_stopsoon[loss] += 1
                }
            }
            if (check_stopsoon[loss] == 10) {
                console.log('stop soon')
                break
            } 
            if(loss_rec['Epoch:' + (i - 1).toString()] < loss) {
                console.log('over')
                break
            }
        }
        if (Object.keys(loss_rec).length > 0) {
            if (debug) {
                // console.log(loss_rec)
                console.log('Last loss: ', loss_rec['Epoch:' + (Object.keys(loss_rec).length - 1).toString()])
            }
            return history[Object.keys(history).length - 1]
        }
    }
    return train(epoch, x, y)
}