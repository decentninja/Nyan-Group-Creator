var som = require("./som/som.js");
var util = require("util");

var keys = [
    "Information Visualization",
    "statistical",
    "mathematics",
    "drawing and artistic",
    "computer usage",
    "programming",
    "computer graphics programming",
    "human-computer interaction programming",
    "user experience evaluation"
];
var s = som.create({
    features: keys,
    iterationCount: 1000,
    width: 100,
    height: 100
});

s.init({});
var raw = `6	7	5	5	7	7	5	6	7
5	4	5	2	10	7	6	4	1
4	4	5	6	8	8	3	5	5
1	5	5	8	8	8	5	7	8
4	2	4	5	8	5	3	5	6
3	6	6	3	7	5	3	3	5
3	10	9	7	8	7	4	7	5
5	4	6	3	8	7	5	9	4
4	5	7	8	9	7	5	5	6
4	6	6	4	8	6	4	7	6
2	8	6	3	8	7	2	2	6
3	5	7	4	7	2	3	3	2
3	5	4	5	8	7	3	4	7
3	4	3	7	9	4	3	7	9
3	4	5	1	5	6	4	6	6
6	2	2	9	9	5	2	2	5
5	5	2	4	9	5	1	5	4
1	1	1	1	1	1	1	1	1
6	4	6	6	8	6	6	7	8
4	3	7	8	6	2	1	1	3
6	3	4	3	6	6	4	4	2
5	3	3	7	9	5	2	7	5
4	3	6	9	9	6	4	7	7
5	5	6	6	5	7	4	7	8
4	7	7	4	7	6	6	9	4
4	4	5	4	5	5	4	7	5
7	5	7	7	8	5	6	5	7
4	5	8	1	7	4	2	4	9
1	4	6	5	5	4	3	2	8
5	4	5	7	9	8	8	10	9
2	5	7	3	7	5	3	5	7
4	7	5	8	10	8	4	5	5
6	4	8	2	7	7	6	7	7
6	5	5	7	7	5	4	5	6
4	1	3	8	8	3	3	3	3
5	5	7	10	10	6	8	6	3
7	5	5	5	8	6	3	4	7
1	6	6	2	7	1	1	1	6
3	3	4	4	8	8	5	5	4
3	4	6	8	8	5	6	8	5
3	8	8	2	7	6	5	7	9
5	6	7	4	8	6	6	8	7
5	4	5	3	8	1	1	2	1
7	6	4	8	8	7	7	7	8
5	5	5	7	8	2	3	3	7
7	4	7	5	10	8	8	9	5
5	6	5	8	8	5	5	6	7
2	4	6	1	9	8	9	10	1
8	5	8	4	8	8	8	8	7
6	3	5	5	7	2	3	7	4
3	3	3	2	7	7	3	6	2
4	6	5	8	7	5	3	4	5
3	3	8	7	8	4	6	5	5
5	5	7	7	7	4	4	5	7
1	2	4	2	5	1	1	1	2
2	2	4	7	8	3	3	3	2
4	7	7	6	6	4	5	5	5
4	7	6	6	7	6	1	6	7
5	2	5	5	10	8	8	7	3
6	8	8	7	9	6	6	5	8
7	5	5	3	8	7	7	9	5
7	5	7	7	9	6	5	8	7
7	6	5	7	8	7	4	4	7
3	6	5	3	7	6	3	3	4
8	6	4	9	8	7	6	7	8
6	6	3	9	9	3	1	2	2
4	3	5	6	7	3	1	1	8
4	5	5	3	8	5	2	3	4
4	6	6	4	8	3	1	7	6
2	4	6	8	6	4	1	3	5
4	2	5	7	10	7	5	6	8
7	4	5	7	9	4	5	9	4
3	1	4	5	5	4	2	3	8
4	3	5	7	7	1	3	3	7
5	5	6	2	7	8	3	4	4
4	3	4	4	4	6	4	4	4`;

var data = raw.split("\n").forEach((person, j) => {
    var obj = {};
    person.split("\t").forEach((k, i) => obj[keys[i]] = k);
    s.train(j, obj);
});

    
for(var i = 0; i < 75; i++) {
    var thing = s.traineeIndex[i]
    console.log(i, thing.x, thing.y);
}

