$(document).ready(function(){

    //Globals
    var problem;
    var solution;
    var difficulty;
    var equationType;
    var answer;
    var currentScore = 0;
    var allTimeScore = setAllTimeScore();
    var musicSpeed = 1;

    freshGameState();

    $('#difficulty-selection button').click(function(){ //Choose equation type & load initial equation        
        equationType = $(this).val();
        
        let flashCard = fetchEquation(equationType);    
        equation = flashCard.equation;
        difficulty = flashCard.difficulty;
        solution = flashCard.solution;
        
        //Display game
        playingState();
        $('#equation').html(equation);
    });

    $('#answer').keyup(function(e){
        if(e.which == 13){
            $("#submit").trigger('click');
        }
    });

    $("#submit").click(function(){ //Validate answer. If answer correct, load new equation. 
        answer = $('#answer').val();
        $('#answer').val("");
                
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
            currentScore = 0;
            gameOverState();
        }
    });

    $("#refresh").click(function(){
        allTimeScore = setAllTimeScore();
        freshGameState();
    });
    
    //SOUND CONTROLS
    $("#mute").click(function(){
        $("audio").prop('muted', true);
        $(this).hide();
        $('#unmute').show();
    });

    $("#unmute").click(function(){
        $("audio").prop('muted', false);        
        $(this).hide();
        $('#mute').show();
    });
});

var playingState = function(){
    $('#main-game-music').get(0).currentTime = 38;

    $('#all-time-score-contain').fadeOut();
    $('#current-score-contain').fadeIn();
    $('#difficulty-selection').fadeOut();
    $('#game').fadeIn();
}
var freshGameState = function(){
    $('#all-time-score').html(allTimeScore);    

    $('#game-over-music').get(0).pause();
    $('#main-game-music').get(0).currentTime = 0;
    $('#main-game-music').get(0).play();
    
    $('.conf-cont').hide();    
    $('#all-time-score-contain').fadeIn();
    $('#current-score-contain').fadeOut();
    $('#difficulty-selection').fadeIn();
    $('#game-over').fadeOut();    
}

var gameOverState = function(){
    $('#main-game-music').get(0).pause();
    $('#game-over-music').get(0).currentTime = 0;
    $('#game-over-music').get(0).play();

    $('#current-score-contain').fadeOut();            
    $('#game').fadeOut();
    $('#game-over').fadeIn();
}

var setAllTimeScore = function(){
    //Check if alltime highscore exists
    if(localStorage.highScore === undefined){
        allTimeScore = 0;
    }
    else{
        allTimeScore = atob(localStorage.highScore);
    }

    return allTimeScore;
}