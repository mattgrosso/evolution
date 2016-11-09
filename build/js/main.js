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
      drawCreatures(creaturePool);
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

  function createCreature(mom, dad) {
    var randomGender = Math.ceil(Math.random()*10)+1;
    var randomSpeed = Math.floor(Math.random()*11)-5;
    var randomSize = Math.floor(Math.random()*11)-5;
    var babyCreature = {};

    babyCreature.ID = generateUIDNotMoreThan1million();

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

  function drawCreatures(arrayOfCreatures) {
    arrayOfCreatures.forEach(function addCreatureToView(each) {
      var randomTop = Math.floor((Math.random()*350)) + 50;
      var randomLeft = Math.floor((Math.random()*650)) + 50;
      var newCreature = $('<div>').addClass('creature').attr('id', each.ID)
        .css({
          'width': each.size,
          'height': each.size,
          'position': 'absolute',
          'top': randomTop,
          'left': randomLeft,
          'background-color': randomColor(),
          'transition': 'transition: all 0.25s ease-out'
        });
      $('.ecosystem').append(newCreature);
    });
  }

  function generateUIDNotMoreThan1million() {
    return ("0000" + (Math.random()*Math.pow(36,4) << 0).toString(36)).slice(-4);
  }

  function moveCreature(creature) {
    var creatureHTMLElement = $('#' + creature.ID);
    var randomDirection = Math.floor(Math.random()*360);
    var oldLeft = parseInt(creatureHTMLElement[0].style.left);
    var oldTop = parseInt(creatureHTMLElement[0].style.top);
    var leftChange = (creature.speed * Math.sin(randomDirection * Math.PI / 180));
    var topChange = (creature.speed * Math.cos(randomDirection * Math.PI / 180));

    creatureHTMLElement.css({
                          'left': oldLeft + leftChange,
                          'top': oldTop + topChange
                        });

  }

  function creatureCollide() {
    var topLeftQuadrant = creaturePool.filter(function topLeftQuadrant(each) {
      return ($('#' + each.ID)[0].getBoundingClientRect().top < 250) && ($('#' + each.ID)[0].getBoundingClientRect().left < 375);
    });
    var topRightQuadrant = creaturePool.filter(function topRightQuadrant(each) {
      return ($('#' + each.ID)[0].getBoundingClientRect().top < 250) && ($('#' + each.ID)[0].getBoundingClientRect().left > 375);
    });
    var bottomLeftQuadrant = creaturePool.filter(function bottomLeftQuadrant(each) {
      return ($('#' + each.ID)[0].getBoundingClientRect().top > 250) && ($('#' + each.ID)[0].getBoundingClientRect().left > 375);
    });
    var bottomRightQuadrant = creaturePool.filter(function bottomRightQuadrant(each) {
      return ($('#' + each.ID)[0].getBoundingClientRect().top > 250) && ($('#' + each.ID)[0].getBoundingClientRect().left > 375);
    });

    console.log(topLeftQuadrant);
    console.log(topRightQuadrant);
    console.log(bottomLeftQuadrant);
    console.log(bottomRightQuadrant);
  }

  seedCreatures(10);

  creatureCollide($('#' + creaturePool[0].ID));

  // Have them all move around and make decisions based on values I set.

  function loop() {
    creaturePool.forEach(function moveCreatures(each) {
      moveCreature(each);
    });

  }

  // var looper = setInterval(loop, 200);

})();
