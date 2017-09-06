//////////////////////////
//  Problem generation  //
/////////////////////////
var buildEquation = function(type){
    let problem = {};

    switch(type){
        case 'addition-subtraction' :
            problem.difficulty = 1;
            problem.equation = genAddSubProblem();
        break;

        case 'multiplication' :
            problem.difficulty = 2;
            problem.equation = genMultProblem();
        break;

        case 'division' :
            problem.difficulty = 2;
            problem.equation = genDivProblem();
        break;
        
        case 'fraction-conversion' :
            problem.difficulty = 3;
            problem.equation = genFractionConvProblem();
        break;
    }

    return problem;
}

//Generate Addition & Subtraction problem
var genAddSubProblem = function(){
    let num1 = rand(1, 25);
    let num2 = rand(1, 25);

    if(num1 % 2 === 0){ 
        return num1 + ' + ' + num2;
    }
    else{
        return num1 + ' - ' + num2;
    }
}

//Generate Multiplication problem
var genMultProblem = function(){
    let num1 = rand(1, 13);
    let num2 = rand(1, 13);
    let tmp;

    return num1 + ' * ' + num2;
}

/**
* Generate divison problem
* 
* Every x (limiter) problem generate a problem divisible by 5 or 10
*/
var genDivProblem = function(){
    let num1;
    let num2;
    let equation;
    let tmp;
    
    if(localStorage.counter === undefined){
        localStorage.counter = 0;
    }

    if(localStorage.limiter === undefined){
        localStorage.limiter = rand(1,7);
    }

    if(localStorage.counter == localStorage.limiter){
        num1 = rand(10, 100);
        num2 = [5, 10];

        while(num1 % 10 !== 0){
            num1 = rand(10, 50);
        }

        num2 = num2[rand(0,1)];
                
        equation = num1 + ' / ' + num2;
        localStorage.limiter = rand(1,7);
        localStorage.counter = 0;
    }
    else{
        num1 = rand(1, 20);
        num2 = rand(1, 20);

        if(num1 < num2){
            tmp = num1;
            num1 = num2;
            num2 = tmp;
        }

        while(num1%num2 !== 0){
            num1 = rand(1, 20);
            num2 = rand(1, 20);
        }

        equation = num1 + ' / ' + num2;
    }
    
    localStorage.counter = parseInt(localStorage.counter) + 1;

    return equation;
}

// Generate Fraction conversion to decimal problem
var genFractionConvProblem = function(){
    let num1 = rand(1, 13);
    let num2 = rand(1, 13);
    let tmp;

    while(num1%num2 !== 0){
        num1 = rand(1, 13);
        num2 = rand(1, 13);
    }

    if(num1 > num2){
        tmp = num1;
        num1 = num2;
        num2 = tmp;
    }
    
    return num1 + ' / ' + num2;
}


///////////////////////////
//    Helper Methods     //
///////////////////////////
var fetchEquation = function(equationType){
    let problemObj = buildEquation(equationType);
    let solution = solve(problemObj.equation);
    
    if(equationType == "fraction-conversion"){
        problemObj.equation = convertToFraction(problemObj.equation);
    }

    let returnObj = {
        equation : problemObj.equation,
        difficulty : problemObj.difficulty,
        solution : solution
    };

    return returnObj;
}

var solve = function(string){
    let equations = {
        '+' : function(x, y){ return x + y },
        '-' : function(x, y){ return x - y },
        '*' : function(x, y){return x * y},
        '/' : function(x, y){
                let res = (x / y).toString().match(/^-?\d+(?:\.\d{0,2})?/)[0];
                while(res.charAt(0) === '0')
                {
                    res = res.substr(1);
                }

                return res;
            }
    };

    let arr = string.split(" ");
    let operator = arr[1];
    let num1 = parseInt(arr[0]);
    let num2 = parseInt(arr[2]);

    return equations[operator](num1, num2);
};

/**
 * Returns a random integer between min (inclusive) and max (inclusive)
 * Using Math.round() will give you a non-uniform distribution!
 */
var rand = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

var convertToFraction = function(equation){
    var split = equation.split("/")
    if(split.length == 2 ){
        return '<span class="top">'+split[0]+'</span>'+'<span class="bottom">'+split[1]+'</span>';
    }    
}