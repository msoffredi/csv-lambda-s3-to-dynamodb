const aws = require('aws-sdk');
const s3 = new aws.S3();
const ddb = new aws.DynamoDB({apiVersion: '2012-08-10'});
const parse = require('csv-parser');

exports.handler = (event) => {
    let id = 1;
    const file = s3.getObject({
        Bucket: "sudoku-puzzles", 
        Key: "sudoku.csv"
    })
    .createReadStream()
    .pipe(parse())
    .on('data', (data) => {
        const obj = sudokuParser(data, id++);
        const params = {
            TableName: 'sudoku-puzzles',
            Item: {
                'id' : {S: obj.id},
                'puzzle' : {S: obj.puzzle},
                'solution' : {S: obj.solution}
            }
        };
        ddb.putItem(params, function(err, data) {
            if (err) {
                console.log("Error", err);
            } else {
                console.log("Success", data);
            }
        });
        
        if (id > 10000) {
            file.destroy();
        }
	})
	.on('error', () => {
	    console.log('Error parsing CSV file');
	})
	.on('end', () => {
		console.log('Finished parsing CSV file!')
	});
};

const sudokuParser = (data, id) => {
    return {
        puzzle: JSON.stringify(sudokuConverter(data.puzzle)),
        solution: JSON.stringify(sudokuConverter(data.solution)),
        id: id.toString()
    };
};

const sudokuConverter = (sudokuStr) => {
    let sudokuArr = [];
    for (let i=0; i<3; i++) {
        sudokuArr[i] = [
            parseInt(sudokuStr[i*3+0]), parseInt(sudokuStr[i*3+1]), parseInt(sudokuStr[i*3+2]),
            parseInt(sudokuStr[i*3+9]), parseInt(sudokuStr[i*3+10]), parseInt(sudokuStr[i*3+11]),
            parseInt(sudokuStr[i*3+18]), parseInt(sudokuStr[i*3+19]), parseInt(sudokuStr[i*3+20])
        ];
    }
    for (let i=0; i<3; i++) {
        sudokuArr[i+3] = [
            parseInt(sudokuStr[i*3+27+0]), parseInt(sudokuStr[i*3+27+1]), parseInt(sudokuStr[i*3+27+2]),
            parseInt(sudokuStr[i*3+27+9]), parseInt(sudokuStr[i*3+27+10]), parseInt(sudokuStr[i*3+27+11]),
            parseInt(sudokuStr[i*3+27+18]), parseInt(sudokuStr[i*3+27+19]), parseInt(sudokuStr[i*3+27+20])
        ];
    }
    for (let i=0; i<3; i++) {
        sudokuArr[i+6] = [
            parseInt(sudokuStr[i*3+54+0]), parseInt(sudokuStr[i*3+54+1]), parseInt(sudokuStr[i*3+54+2]),
            parseInt(sudokuStr[i*3+54+9]), parseInt(sudokuStr[i*3+54+10]), parseInt(sudokuStr[i*3+54+11]),
            parseInt(sudokuStr[i*3+54+18]), parseInt(sudokuStr[i*3+54+19]), parseInt(sudokuStr[i*3+54+20])
        ];
    }

    return sudokuArr.map((group) => {
        return group.map((num) => {
            return num ? num : null;
        });
    });
};
