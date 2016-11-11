(function() {
  'use strict';

  var round = 0;
  var creaturePool = [];

  function seedCreatures(total, counter) {

    counter = counter || 1;

    var randomMom = {
      sex: 'female',
      size: Math.floor(Math.random()*10)+20,
      speed: Math.floor(Math.random()*10)+20
    };
    var randomDad = {
      sex: 'male',
      size: Math.floor(Math.random()*10)+20,
      speed: Math.floor(Math.random()*10)+20
    };

    createCreature(randomMom, randomDad);

    if (counter < total) {
      counter ++;
      seedCreatures(total, counter);
    }

  }

  function chooseColor(creature) {
    if (creature.sex === 'female') {
      return '#00B281';
    } else {
      return '#DE0017';
    }
  }

  function createCreature(mom, dad) {
    var randomSex = Math.ceil(Math.random()*10)+1;
    var randomSpeed = Math.floor(Math.random()*11)-5;
    var randomSize = Math.floor(Math.random()*11)-5;
    var babyCreature = {};

    babyCreature.ID = generateUIDNotMoreThan1million();

    babyCreature.birthday = round;

    babyCreature.energy = Math.ceil(Math.random()*5000);

    babyCreature.age = function age() {
      return round - babyCreature.birthday;
    };

    babyCreature.sensors = Math.floor(Math.random()*1000)+1;

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

    if (babyCreature.size === 0 || babyCreature.speed === 0) {
      killCreature(babyCreature);
    }

    babyCreature.htmlElement = $('#' + babyCreature.ID)[0];
    babyCreature.boundingRect = babyCreature.htmlElement.getBoundingClientRect();

    creaturePool.push(babyCreature);
    return babyCreature;

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
        'background-color': chooseColor(creature),
        'transition': 'all 0.5s ease-out'
      });
    $('.ecosystem').append(newCreature);
  }

  function killCreature(creature) {
    creature.dead = true;
    $('#' + creature.ID).hide();
    removeFromPool(creature);
  }

  function removeFromPool(creature) {
    creaturePool.splice(creaturePool.indexOf(creature), 1);
  }

  function generateUIDNotMoreThan1million() {
    return ("0000" + (Math.random()*Math.pow(36,4) << 0).toString(36)).slice(-4);
  }

  function moveCreature(creature) {
    var direction = creature.direction;
    var oldLeft = parseInt(creature.htmlElement.style.left);
    var oldTop = parseInt(creature.htmlElement.style.top);
    var leftChange = (creature.speed * Math.sin(direction * Math.PI / 180));
    var topChange = (creature.speed * Math.cos(direction * Math.PI / 180));

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
    var topRightQuadrant =
      creaturePool.filter(function topRightQuadrant(each) {
        return ($('#' + each.ID)[0].getBoundingClientRect().bottom < 250) && ($('#' + each.ID)[0].getBoundingClientRect().left > 375);
      });
    var bottomLeftQuadrant =
      creaturePool.filter(function bottomLeftQuadrant(each) {
        return ($('#' + each.ID)[0].getBoundingClientRect().top > 250) && ($('#' + each.ID)[0].getBoundingClientRect().right < 375);
      });
    var bottomRightQuadrant =
      creaturePool.filter(function bottomRightQuadrant(each) {
        return ($('#' + each.ID)[0].getBoundingClientRect().top > 250) && ($('#' + each.ID)[0].getBoundingClientRect().left > 375);
      });
    var borderAreas =
      creaturePool.filter(function borderAreas(each) {
        return (($('#' + each.ID)[0].getBoundingClientRect().bottom > 250 && $('#' + each.ID)[0].getBoundingClientRect().top < 250) ||
                ($('#' + each.ID)[0].getBoundingClientRect().right > 350 && $('#' + each.ID)[0].getBoundingClientRect().left < 350)
                );
      });
    var collisionList = {};

    topLeftQuadrant.forEach(function collide(each) {
      var eachRect = each.htmlElement.getBoundingClientRect();

      topLeftQuadrant.forEach(function (eacher) {
        var eacherRect = eacher.htmlElement.getBoundingClientRect();

        if (each.ID === eacher.ID) {
          return;
        }
        else if (  (eachRect.right > eacherRect.left) && (eachRect.left < eacherRect.right) && (eachRect.bottom > eacherRect.top) && (eachRect.top < eacherRect.bottom)) {
          var collisionName = each.ID + eacher.ID;
          var collisionNameInverse = eacher.ID + each.ID;

          if (!collisionList[collisionName] && !collisionList[collisionNameInverse]) {
            creatureInteractions(each, eacher);
            collisionList[collisionName] = true;
          }
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
          var collisionName = each.ID + eacher.ID;
          var collisionNameInverse = eacher.ID + each.ID;

          if (!collisionList[collisionName] && !collisionList[collisionNameInverse]) {
            creatureInteractions(each, eacher);
            collisionList[collisionName] = true;
          }        }
      });
    });

    bottomLeftQuadrant.forEach(function collide(each) {
      var eachRect = each.htmlElement.getBoundingClientRect();
      bottomLeftQuadrant.forEach(function (eacher) {
        var eacherRect = eacher.htmlElement.getBoundingClientRect();
        if (each.ID === eacher.ID) {
          return;
        } else if (  (eachRect.right > eacherRect.left) && (eachRect.left < eacherRect.right) && (eachRect.bottom > eacherRect.top) && (eachRect.top < eacherRect.bottom)) {
          var collisionName = each.ID + eacher.ID;
          var collisionNameInverse = eacher.ID + each.ID;

          if (!collisionList[collisionName] && !collisionList[collisionNameInverse]) {
            creatureInteractions(each, eacher);
            collisionList[collisionName] = true;
          }        }
      });
    });

    bottomRightQuadrant.forEach(function collide(each) {
      var eachRect = each.htmlElement.getBoundingClientRect();
      bottomRightQuadrant.forEach(function (eacher) {
        var eacherRect = eacher.htmlElement.getBoundingClientRect();
        if (each.ID === eacher.ID) {
          return;
        } else if (  (eachRect.right > eacherRect.left) && (eachRect.left < eacherRect.right) && (eachRect.bottom > eacherRect.top) && (eachRect.top < eacherRect.bottom)) {
          var collisionName = each.ID + eacher.ID;
          var collisionNameInverse = eacher.ID + each.ID;

          if (!collisionList[collisionName] && !collisionList[collisionNameInverse]) {
            creatureInteractions(each, eacher);
            collisionList[collisionName] = true;
          }        }
      });
    });

    borderAreas.forEach(function collide(each) {
      var eachRect = each.htmlElement.getBoundingClientRect();
      borderAreas.forEach(function (eacher) {
        var eacherRect = eacher.htmlElement.getBoundingClientRect();
        if (each.ID === eacher.ID) {
          return;
        } else if ((eachRect.right > eacherRect.left) && (eachRect.left < eacherRect.right) && (eachRect.bottom > eacherRect.top) && (eachRect.top < eacherRect.bottom)) {
          var collisionName = each.ID + eacher.ID;
          var collisionNameInverse = eacher.ID + each.ID;

          if (!collisionList[collisionName] && !collisionList[collisionNameInverse]) {
            creatureInteractions(each, eacher);
            collisionList[collisionName] = true;
          }        }
      });
    });

  }

  function creatureSenses(creature) {
    var creatureRect = creature.htmlElement.getBoundingClientRect();
    var sensedCreatures = [];
    creaturePool.forEach(function nearby(each) {
      var targetRect = each.htmlElement.getBoundingClientRect();
      if (creature.ID !== each.ID) {
        if (((creatureRect.right + creature.sensors) > targetRect.left) && ((creatureRect.left - creature.sensors) < targetRect.right) && ((creatureRect.bottom + creature.sensors) > targetRect.top) && ((creatureRect.top - creature.sensors) < targetRect.bottom)) {
          sensedCreatures.push(each);
        }
      }
    });

    creature.direction = sensorChoice(creature, sensedCreatures);

    if ((creature.ID === creaturePool[0].ID) && (sensedCreatures.length > 0)) {
      console.log(creature.ID, ' sensed ', sensedCreatures[0].ID);
      console.log(creature.direction);
    }

  }

  function sensorChoice(creature, sensedCreatures) {
    var biggestLove = {size: 0};
    var biggestEnemy = {size: 0};
    var biggestFood = {size: 0};

    sensedCreatures.forEach(function (each) {
      if ((creature.sex === each.sex) && (creature.size < each.size)) {
        if (biggestEnemy.size < each.size) {
          biggestEnemy = each;
        }
      } else if (creature.sex !== each.sex) {
        if (biggestLove.size < each.size) {
          biggestLove = each;
        }
      } else if ((creature.sex === each.sex) && (creature.size > each.size)) {
        if (biggestFood.size < each.size) {
          biggestFood = each;
        }
      }
    });

    if (biggestLove.size > 0) {
      return findAngleTowards(creature, biggestLove);
    } else if (biggestEnemy.size > 0) {
      return findAngleTowards(creature, biggestEnemy);
    } else if (biggestFood.size > 0) {
      return findAngleTowards(creature, biggestFood);
    } else {
      return Math.floor(Math.random()*360);
    }
  }

  function findAngleTowards(creature, targetCreature) {
    var creatureRect = creature.htmlElement.getBoundingClientRect();
    var targetRect = targetCreature.htmlElement.getBoundingClientRect();
    var creatureCenter = {
      top: (creatureRect.top + creatureRect.bottom)/2,
      left: (creatureRect.left + creatureRect.right)/2
    };
    var targetCenter = {
      top: (targetRect.top + targetRect.bottom)/2,
      left: (targetRect.left + targetRect.right)/2
    };

    var direction = ((Math.atan2((creatureCenter.left - targetCenter.left), (creatureCenter.top - targetCenter.top)))/(Math.PI/180))*-1;

    return direction;
  }

  function creatureInteractions(creature1, creature2) {
    if (creature1.sex !== creature2.sex) {
      createCreature(creature1, creature2);
      console.log(creature1.ID, ' and ', creature2.ID, ' had a baby!');
    } else if (creature1.size > creature2.size) {
      creature1.energy = creature1.energy + creature2.energy;
      killCreature(creature2);
      console.log(creature1.ID, ' ate ', creature2.ID);
    } else if (creature2.size >= creature1.size) {
      creature2.energy = creature2.energy + creature1.energy;
      killCreature(creature1);
      console.log(creature2.ID, ' ate ', creature1.ID);
    }
  }

  function oldAge(creature) {
    creature.energy = creature.energy - 1;
    if (creature.energy < 1) {
      killCreature(creature);
      console.log(creature.ID, ' died of old age at ', creature.age());
    }
  }

  function loop() {

    creaturePool.forEach(function moveCreatures(each) {
      moveCreature(each);
    });

    creatureCollide();

    creaturePool.forEach(function senseOtherCreatures(each) {
      creatureSenses(each);
    });

    round++;

    creaturePool.forEach(function (each) {
      oldAge(each);
    });

    if (creaturePool.length < 1) {
      clearInterval(looper);
      console.log('Everyone is Dead. You made it ' + round + ' rounds.');
    }

    if (creaturePool.length > 200) {
      clearInterval(looper);
      console.log('Overpopulation. You made it ' + round + ' rounds.');
    }
  }

  $('.step-button').on('click', function () {
    loop();
  });

  seedCreatures(2);

  $('#' + creaturePool[0].ID).addClass('special');

  // var looper = setInterval(loop, 200);


})();
