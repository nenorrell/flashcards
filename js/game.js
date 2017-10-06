$(document).ready(function(){

    //Globals
    var problem;
    var solution;
    var difficulty;
    var equationType;
    var answer;
    var currentScore = 0;
    var highScore = setHighScore();
    var allTimePoints = setAllTimePoints();
    var musicSpeed = 1;
    var level = getLevel(allTimePoints);

    freshGameState();

    $('#difficulty-selection button').click(function(){ //Choose equation type & load initial equation        
        if($(this).hasClass("disabled")){
            let btn = this;
            let btnName = $(this).html();
            
            if($(this).val() == 'fraction-conversion'){
                $(this).html('Level 3 required');
            }
            else{
                $(this).html('Level ' + parseInt(level+1) + ' required');
            }
            setTimeout(function(){
                $(btn).html(btnName);
            }, 1000);
        }
        else{
            equationType = $(this).val();
            
            let flashCard = fetchEquation(equationType);    
            equation = flashCard.equation;
            difficulty = flashCard.difficulty;
            solution = flashCard.solution;
            
            //Display game
            playingState();
            $('#equation').html(equation);
        }
    });

    $('#answer').keyup(function(e){
        if(e.which == 13){
            $("#submit").trigger('click');
        }
    });

    $("#submit").click(function(){ //Validate answer. If answer correct, load new equation. 
        answer = $('#answer').val();
        $('#answer').val("");
        
        if(answer.toLowerCase() == "ms.pacman"){
            setAllTimePoints(true, parseInt(allTimePoints)+200);
            location.reload();
        }
        else if(answer.toLowerCase() == "chai"){
            setAllTimePoints(true, parseInt(allTimePoints)+100);
            location.reload();
        }
        else if(answer.toLowerCase() == "reset"){
            setHighScore(true, parseInt(0));
            setAllTimePoints(true, parseInt(0));
            location.reload();
        }
        else if(answer == solution){
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
            
            setAllTimePoints(true, currentScore+parseInt(allTimePoints));

            if(currentScore > highScore){
                setHighScore(true, currentScore);
                $('#final-score-title').html("New high score!");
                $('.conf-cont').show();
            }

            //Game over screen
            currentScore = 0;
            gameOverState();
        }
    });

    $("#refresh").click(function(){
        allTimePoints = setAllTimePoints();
        highScore = setHighScore();
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

    $('#difficulty-selection').fadeOut();
    $('#game').fadeIn();
}
var freshGameState = function(){
    level = getLevel(allTimePoints);
    
    $('#all-time-score').html(highScore);
    $('#all-time-points').html(allTimePoints);
    $('#level').html('level ' + level);
    getAvailableProblemTypes(level);

    $('#game-over-music').get(0).pause();
    $('#main-game-music').get(0).currentTime = 0;
    $('#main-game-music').get(0).play();
    
    $('.conf-cont').hide();

    $('#difficulty-selection').fadeIn();
    $('#game-over').fadeOut();

    $('#final-score-title').html("Final score:");
}

var gameOverState = function(){
    $('#main-game-music').get(0).pause();
    $('#game-over-music').get(0).currentTime = 0;
    $('#game-over-music').get(0).play();
              
    $('#game').fadeOut();
    $('#game-over').fadeIn();
}

//////////////////////
//  LEVEL HANDLING  //
//////////////////////
var getAvailableProblemTypes = function(level){
    if(level >= 2){
        $("#mult, #div").removeClass('disabled')
    }
    if(level >= 3){
        $("#mult, #div, #convFrac").removeClass('disabled');
    }
}

var setHighScore = function(override = false, val = 0){
    if(override === true){
        localStorage.highScore = btoa(val);
        return 0;
    }
    
    //Check if alltime highscore exists
    if(localStorage.highScore === undefined){
        highScore = 0;
    }
    else{
        highScore = atob(localStorage.highScore);
    }

    return highScore;
}

var setAllTimePoints = function(override = false, val = 0){
    if(override === true){
        localStorage.allTimePoints = btoa(val);
        return 0;
    }
    
    //Check if alltime highscore exists
    if(localStorage.allTimePoints === undefined){
        allTimePoints = 0;
    }
    else{
        allTimePoints = atob(localStorage.allTimePoints);
    }

    return allTimePoints;
}