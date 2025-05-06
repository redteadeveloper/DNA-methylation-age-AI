const fs = require('fs')
const es = require('event-stream')

const parseText = (text) => {
    return text.replaceAll("\"", "").replaceAll("age: ", "").replaceAll("age (y): ", "").replaceAll("Sex: ", "").replaceAll("gender: ", "").replaceAll("ethnicity: ", "").replaceAll(" - European", "").replaceAll(" - Mexican", "").replace("female", "F").replace("male", "M")
}

var lines1 = []
var lines2 = []

var obj1 = []
var obj2 = []

var s1 = fs.createReadStream('../../GSE40279/GSE40279_samples.txt')
    .pipe(es.split())
    .pipe(es.mapSync(function (line) {
        s1.pause()
        lines1.push(line.toString().split("\t"))
        s1.resume()
    })
        .on('error', function (err) { console.log('Error:', err) })
        .on('end', function () {
            for (let i1 in lines1[0]) {
                obj1.push([parseText(lines1[0][i1]), parseText(lines1[1][i1]), parseText(lines1[2][i1])])
            }
            console.log(obj1)
            fs.writeFile("GSE40279_samples.json", JSON.stringify(obj1), err => {
                if (err) throw err;
                console.log('File successfully written to disk');
            })
        })
    )

var s2 = fs.createReadStream('../../GSE72775/GSE72775_samples.txt')
    .pipe(es.split())
    .pipe(es.mapSync(function (line) {
        s2.pause()
        lines2.push(line.toString().split("\t"))
        s2.resume()
    })
        .on('error', function (err) { console.log('Error:', err) })
        .on('end', function () {
            for (let i2 in lines2[0]) {
                obj2.push([parseText(lines2[1][i2]), parseText(lines2[0][i2]), parseText(lines2[2][i2])])
            }
            console.log(obj2)
            fs.writeFile("GSE72775_samples.json", JSON.stringify(obj2), err => {
                if (err) throw err;
                console.log('File successfully written to disk');
            })
        })
    )