(function() {
  'use strict';

  var creaturePool = [];

  // Set up a random number of random creatures.
  function seedCreatures(total, counter) {

    counter = counter || 1;

    var randomMom = {
      gender: 'female',
      size: Math.floor(Math.random()*10)+1,
      speed: Math.floor(Math.random()*10)+1
    };
    var randomDad = {
      gender: 'male',
      size: Math.floor(Math.random()*10)+1,
      speed: Math.floor(Math.random()*10)+1
    };

    creaturePool.push(createCreature(randomMom, randomDad));

    if (counter === total) {
      creaturePool.forEach(function addCreatureToView(each) {
        var randomTop = Math.floor((Math.random()*350)) + 50;
        var randomLeft = Math.floor((Math.random()*650)) + 50;
        console.log('randomTop: ', randomTop);
        console.log('randomLeft: ', randomLeft);

        var newCreature = $('<div>').addClass('creature').css({
                                                            'width': each.size,
                                                            'height': each.size,
                                                            'position': 'absolute',
                                                            'top': randomTop,
                                                            'left': randomLeft,
                                                            'background-color': randomColor()
                                                          });
        $('.ecosystem').append(newCreature);
      });
    } else {
      counter ++;
      seedCreatures(total, counter);
    }

  }

  function randomColor() {
    var randomColor = Math.floor((Math.random()*1000000));

    if (randomColor < 10) {
      randomColor = '#00000' + randomColor;
    } else if (randomColor < 100) {
      randomColor = '#0000' + randomColor;
    } else if (randomColor < 1000) {
      randomColor = '#000' + randomColor;
    } else if (randomColor < 10000) {
      randomColor = '#00' + randomColor;
    } else if (randomColor < 100000) {
      randomColor = '#0' + randomColor;
    } else {
      randomColor = '#' + randomColor;
    }

    return randomColor;
  }

  seedCreatures(10);


  // Function to create a creature.
  function createCreature(mom, dad) {
    var randomGender = Math.ceil(Math.random()*10000)+1;
    var randomSpeed = Math.floor(Math.random()*11)-5;
    var randomSize = Math.floor(Math.random()*11)-5;
    var babyCreature = {};

    if (randomGender % 2 === 0) {
      babyCreature.gender = 'female';
    } else {
      babyCreature.gender = 'male';
    }

    if (((mom.speed + dad.speed)/2 + randomSpeed) > 0) {
      babyCreature.speed = (mom.speed + dad.speed)/2 + randomSpeed;
    } else {
      babyCreature.stillBorn = true;
      console.log(babyCreature);
    }

    if (((mom.size + dad.size)/2 + randomSize) > 0) {
      babyCreature.size = (mom.size + dad.size)/2 + randomSize;
    } else {
      babyCreature.tooSmall = true;
      console.log(babyCreature);
    }

    return babyCreature;
  }

  // Have them all move around and make decisions based on values I set.

  // function loop() {
  //
  // }

  // var looper = setInterval(loop, 20);

})();
