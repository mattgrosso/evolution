(function() {
  'use strict';

  var creaturePool = [];

  // Set up a random number of random creatures.
  function seedCreatures(total, counter) {

    counter = counter || 1;

    var randomMom = {
      sex: 'female',
      size: Math.floor(Math.random()*10)+20,
      speed: Math.floor(Math.random()*10)+1
    };
    var randomDad = {
      sex: 'male',
      size: Math.floor(Math.random()*10)+20,
      speed: Math.floor(Math.random()*10)+1
    };

    createCreature(randomMom, randomDad);

    if (counter === total) {
      console.log(creaturePool);
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
    var randomSex = Math.ceil(Math.random()*10)+1;
    var randomSpeed = Math.floor(Math.random()*11)-5;
    var randomSize = Math.floor(Math.random()*11)-5;
    var babyCreature = {};

    babyCreature.ID = generateUIDNotMoreThan1million();

    if (randomSex % 2 === 0) {
      babyCreature.sex = 'female';
    } else {
      babyCreature.sex = 'male';
    }

    if (((mom.speed + dad.speed)/2 + randomSpeed) > 0) {
      babyCreature.speed = (mom.speed + dad.speed)/2 + randomSpeed;
    } else {
      babyCreature.stillBorn = true;
      babyCreature.speed = 0;
    }

    if (((mom.size + dad.size)/2 + randomSize) > 0) {
      babyCreature.size = (mom.size + dad.size)/2 + randomSize;
    } else {
      babyCreature.tooSmall = true;
      babyCreature.size = 0;
    }

    drawCreature(babyCreature);

    babyCreature.htmlElement = $('#' + babyCreature.ID)[0];

    creaturePool.push(babyCreature);

  }

  function drawCreature(creature) {
    var randomTop = Math.floor((Math.random()*350)) + 50;
    var randomLeft = Math.floor((Math.random()*650)) + 50;
    var newCreature = $('<div>').addClass('creature').attr('id', creature.ID)
      .css({
        'width': creature.size,
        'height': creature.size,
        'position': 'absolute',
        'top': randomTop,
        'left': randomLeft,
        'background-color': randomColor(),
        'transition': 'all 0.25s ease-out'
      });
    $('.ecosystem').append(newCreature);
  }

  function killCreature(creature) {
    console.log(creature);
    creature.dead = true;
    console.log(creature.ID, " died");
    $('#' + creature.ID).remove();
  }

  function generateUIDNotMoreThan1million() {
    return ("0000" + (Math.random()*Math.pow(36,4) << 0).toString(36)).slice(-4);
  }

  function moveCreature(creature) {
    var randomDirection = Math.floor(Math.random()*360);
    var oldLeft = parseInt(creature.htmlElement.style.left);
    var oldTop = parseInt(creature.htmlElement.style.top);
    var leftChange = (creature.speed * Math.sin(randomDirection * Math.PI / 180));
    var topChange = (creature.speed * Math.cos(randomDirection * Math.PI / 180));

    $('#' + creature.ID).css({
                          'left': oldLeft + leftChange,
                          'top': oldTop + topChange
                        });

  }

  function creatureCollide() {
    var topLeftQuadrant =
      creaturePool.filter(function topLeftQuadrant(each) {
      return ($('#' + each.ID)[0].getBoundingClientRect().bottom < 250) && ($('#' + each.ID)[0].getBoundingClientRect().right < 375);
    });
    var topRightQuadrant = creaturePool.filter(function topRightQuadrant(each) {
      return ($('#' + each.ID)[0].getBoundingClientRect().bottom < 250) && ($('#' + each.ID)[0].getBoundingClientRect().left > 375);
    });
    var bottomLeftQuadrant = creaturePool.filter(function bottomLeftQuadrant(each) {
      return ($('#' + each.ID)[0].getBoundingClientRect().top > 250) && ($('#' + each.ID)[0].getBoundingClientRect().right > 375);
    });
    var bottomRightQuadrant = creaturePool.filter(function bottomRightQuadrant(each) {
      return ($('#' + each.ID)[0].getBoundingClientRect().top > 250) && ($('#' + each.ID)[0].getBoundingClientRect().left > 375);
    });

    topLeftQuadrant.forEach(function collide(each) {
      var eachRect = each.htmlElement.getBoundingClientRect();
      topLeftQuadrant.forEach(function (eacher) {
        var eacherRect = eacher.htmlElement.getBoundingClientRect();
        if (each.ID === eacher.ID) {
          return;
        } else if (  (eachRect.right > eacherRect.left) && (eachRect.left < eacherRect.right) && (eachRect.bottom > eacherRect.top) && (eachRect.top < eacherRect.bottom)) {
          creatureInteractions(each, eacher);
        }
      });
    });

    topRightQuadrant.forEach(function collide(each) {
      var eachRect = each.htmlElement.getBoundingClientRect();
      topRightQuadrant.forEach(function (eacher) {
        var eacherRect = eacher.htmlElement.getBoundingClientRect();
        if (each.ID === eacher.ID) {
          return;
        } else if (  (eachRect.right > eacherRect.left) && (eachRect.left < eacherRect.right) && (eachRect.bottom > eacherRect.top) && (eachRect.top < eacherRect.bottom)) {
          creatureInteractions(each, eacher);
        }
      });
    });

    bottomLeftQuadrant.forEach(function collide(each) {
      var eachRect = each.htmlElement.getBoundingClientRect();
      bottomLeftQuadrant.forEach(function (eacher) {
        var eacherRect = eacher.htmlElement.getBoundingClientRect();
        if (each.ID === eacher.ID) {
          return;
        } else if (  (eachRect.right > eacherRect.left) && (eachRect.left < eacherRect.right) && (eachRect.bottom > eacherRect.top) && (eachRect.top < eacherRect.bottom)) {
          creatureInteractions(each, eacher);
        }
      });
    });

    bottomRightQuadrant.forEach(function collide(each) {
      var eachRect = each.htmlElement.getBoundingClientRect();
      bottomRightQuadrant.forEach(function (eacher) {
        var eacherRect = eacher.htmlElement.getBoundingClientRect();
        if (each.ID === eacher.ID) {
          return;
        } else if (  (eachRect.right > eacherRect.left) && (eachRect.left < eacherRect.right) && (eachRect.bottom > eacherRect.top) && (eachRect.top < eacherRect.bottom)) {
          creatureInteractions(each, eacher);
        }
      });
    });

  }

  function creatureInteractions(creature1, creature2) {
    console.log(creature1.size, creature2.size);
    if (creature1.sex !== creature2.sex) {
      var babyCreature = createCreature(creature1, creature2);
      drawCreature(babyCreature);
    } else if (creature1.size > creature2.size) {
      killCreature(creature2);
    } else if (creature2.size >= creature1.size) {
      killCreature(creature1);
    }
  }

  seedCreatures(20);

  // Have them all move around and make decisions based on values I set.

  // function loop() {
  //   creaturePool.forEach(function moveCreatures(each) {
  //     moveCreature(each);
  //   });
  //
  //   creatureCollide();
  // }
  //
  // setInterval(loop, 200);

})();
