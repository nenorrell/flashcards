$(document).ready(function(){

    //Globals
    var problem;
    var solution;
    var difficulty;
    var equationType;
    var answer;
    var currentScore = 0;
    var allTimeScore;

    //Check if alltime highscore exists
    if(localStorage.highScore === undefined){
        allTimeScore = 0;
    }
    else{
        allTimeScore = atob(localStorage.highScore);
    }
    $('#all-time-score').html(allTimeScore);


    $('#difficulty-selection button').click(function(){ //Choose equation type & load initial equation
        equationType = $(this).val();
        
        let flashCard = fetchEquation(equationType);    
        equation = flashCard.equation;
        difficulty = flashCard.difficulty;
        solution = flashCard.solution;
        
        //Display game
        freshGameState();
        $('#equation').html(equation);
    });

    $('#answer').keyup(function(e){
        if(e.which == 13){
            $("#submit").trigger('click');
        }
    });

    $("#submit").click(function(){ //Validate answer. If answer correct, load new equation. 
        answer = $('#answer').val();

        if(answer == solution){
            //Update score
            currentScore += difficulty * 10;

            //Get new equation
            let flashCard = fetchEquation(equationType);
            equation = flashCard.equation;
            difficulty = flashCard.difficulty;
            solution = flashCard.solution;    
            
            //Update Display
            $('#current-score').html(currentScore);
            $('#answer').val("");
            $('#equation').html(equation);
        }

        else{ //Display Gameover screen
            $('#final-score').html(currentScore);
            $('#end-equation').html(equation);
            $('#end-solution').html(solution);
            $('#end-answer').html(answer);

            if(currentScore > allTimeScore){
                localStorage.highScore =  btoa(currentScore);
                $('#final-score-title').html("New high score!!");
                $('.conf-cont').show();
            }

            //Game over screen
            $('#current-score-contain').fadeOut();            
            $('#game').fadeOut();
            $('#game-over').fadeIn();
        }
    });

    $("#refresh").click(function(){
        location.reload();
    });
});

var freshGameState = function(){
    $('#all-time-score-contain').fadeOut();
    $('#current-score-contain').fadeIn();
    $('#difficulty-selection').fadeOut();
    $('#game').fadeIn();
}