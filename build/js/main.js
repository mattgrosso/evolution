(function() {
  'use strict';

  var round = 0;
  var creaturePool = [];
  var seedNumber = 10;
  var overPopulation = 200;
  var looper;

  function seedCreatures(total, counter) {

    counter = counter || 1;

    var randomMom = {
      sex: 'female',
      size: Math.floor(Math.random()*10)+50,
      speed: Math.floor(Math.random()*10)+40,
      sensors: Math.floor(Math.random()*200)+200,
      energy: Math.ceil(Math.random()*50)
    };
    var randomDad = {
      sex: 'male',
      size: Math.floor(Math.random()*10)+50,
      speed: Math.floor(Math.random()*10)+40,
      sensors: Math.floor(Math.random()*200)+200,
      energy: Math.ceil(Math.random()*50)
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
    var randomSensors = Math.floor(Math.random()*200)-100;
    var momEnergyContrib = mom.energy * (Math.ceil(Math.random()*40)+10)/100;
    var dadEnergyContrib = dad.energy * (Math.ceil(Math.random()*40)+10)/100;
    var babyCreature = {};

    babyCreature.ID = generateUIDNotMoreThan1million();

    babyCreature.birthday = round;

    babyCreature.energy = momEnergyContrib + dadEnergyContrib;
    mom.energy = mom.energy - momEnergyContrib;
    dad.energy = dad.energy - dadEnergyContrib;


    babyCreature.age = function age() {
      return round - babyCreature.birthday;
    };

    babyCreature.sensors = (mom.sensors + dad.sensors)/2 + randomSensors;

    if (randomSex % 2 === 0) {
      babyCreature.sex = 'female';
    }
    else {
      babyCreature.sex = 'male';
    }

    if (((mom.speed + dad.speed)/2 + randomSpeed) > 0) {
      babyCreature.speed = (mom.speed + dad.speed)/2 + randomSpeed;
    }
    else {
      babyCreature.stillBorn = true;
      babyCreature.speed = 0;
    }

    if (((mom.size + dad.size)/2 + randomSize) > 0) {
      babyCreature.size = (mom.size + dad.size)/2 + randomSize;
    }
    else {
      babyCreature.tooSmall = true;
      babyCreature.size = 0;
    }

    drawCreature(babyCreature);

    if (babyCreature.size === 0 || babyCreature.speed === 0) {
      killCreature(babyCreature);
    }

    babyCreature.htmlElement = $('#' + babyCreature.ID)[0];

    creaturePool.push(babyCreature);
    return babyCreature;

  }

  function drawCreature(creature) {
    var randomTop = Math.floor((Math.random()*window.innerHeight)) + 75;
    var randomLeft = Math.floor((Math.random()*window.innerWidth));
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
    // var newArrow = $('<div>').addClass('arrow')
    //   .css({
    //     'position': 'relative',
    //     'bottom': '50px',
    //     'left': '50%',
    //     'width': '2px',
    //     'height': '70px',
    //     'background-color': 'black',
    //     'transform-origin': 'bottom'
    //   });
    // var text = $('<p>')
    //   .text(creature.ID)
    //   .css({
    //     'position': 'relative',
    //     'top': '0px',
    //     'left': '-40px'
    //   });
    //
    // newCreature.append(newArrow);
    // newCreature.append(text);
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
    if (creature.speed) {
      var direction = creature.direction;
      var oldCenterLeft = parseInt(creature.htmlElement.style.left) + creature.size/2;
      var oldCenterTop = parseInt(creature.htmlElement.style.top) + creature.size/2;
      var leftChange = (creature.speed * Math.sin(direction * Math.PI/180));
      var topChange = (creature.speed * Math.cos(direction * Math.PI/180)) * -1;

      if (oldCenterLeft + leftChange > window.innerWidth - 50) {
        $('#' + creature.ID)
          .css({
            'transition': 'none',
            'left': (oldCenterLeft - creature.size/2) + leftChange - window.innerWidth
          });
      }
      else {
        $('#' + creature.ID)
          .css({
            'left': (oldCenterLeft - creature.size/2) + leftChange,
          });
      }

      if (oldCenterTop + topChange > window.innerHeight - 100) {
        $('#' + creature.ID)
          .css({
            'transition': 'none',
            'top':( oldCenterTop - creature.size/2) + topChange - window.innerHeight + 75
          });
      }
      else {
        $('#' + creature.ID)
          .css({
            'top':( oldCenterTop - creature.size/2) + topChange,
          });
      }
    }

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
    // $('#' + creature.ID + ' .arrow').css({
    //   'transform': 'rotate(' + creature.direction + 'deg)'
    // });

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
      return findAngleTowards(creature, biggestEnemy) - 180;
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
      left: (creatureRect.left + creatureRect.right)/2,
      speed: creature.speed
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
      if (Math.ceil(Math.random()*10) % 2 < 1 ) {
        createCreature(creature1, creature2);
      }
    } else if (creature1.size > creature2.size) {
      creature1.energy = creature1.energy + creature2.energy;
      killCreature(creature2);
    } else if (creature2.size >= creature1.size) {
      creature2.energy = creature2.energy + creature1.energy;
      killCreature(creature1);
    }
  }

  function addFood() {
    var foodSize = Math.ceil(Math.random()*90)+10;
    var randomTop = Math.floor((Math.random()*window.innerHeight)) + 75;
    var randomLeft = Math.floor((Math.random()*window.innerWidth));
    var randomID = generateUIDNotMoreThan1million();
    var newFood = {
      ID: randomID,
      food: true,
      energy: foodSize
    };


    creaturePool.push(newFood);

    var newFoodDiv = $('<div>')
      .addClass('food')
      .css({
        'position': 'absolute',
        'width': foodSize,
        'height': foodSize,
        'top': randomTop,
        'left': randomLeft,
        'border-radius': foodSize/2,
        'background-color': 'blue'
      });
    $('.ecosystem')
      .append(newFoodDiv);
  }

  function oldAge(creature) {
    creature.energy = creature.energy - 1;
    if (creature.energy < 1) {
      killCreature(creature);
    }
  }

  function startLoopOver() {
    clearInterval(looper);

    $('.ecosystem').html('');
    round = 0;
    creaturePool = [];
    seedNumber = $('#seedNumber')[0].value || 10;
    overPopulation = $('#maxPopulation')[0].value || 50;

    seedCreatures(seedNumber);

    looper = setInterval(loop, 200);
    console.log(looper);
  }

  function loop() {

    creaturePool.forEach(function senseOtherCreatures(each) {
      creatureSenses(each);
    });

    creaturePool.forEach(function moveCreatures(each) {
      moveCreature(each);
    });

    creatureCollide();

    round++;

    creaturePool.forEach(function (each) {
      oldAge(each);
    });

    $('.creature')
      .css({'transition': 'all 0.5s ease-out'});

    if (creaturePool.length < 1) {
      clearInterval(looper);
      $('.start-button-popup').css({
        'display': 'block'
      });
      $('.message').text('Everyone is Dead. You made it ' + round + ' rounds.');
    }

    if (creaturePool.length > overPopulation) {
      clearInterval(looper);
      $('.message').text('Overpopulation. You made it ' + round + ' rounds.');
    }
  }

  $('.start-button').on('click', function startSimulation() {
    $('.start-button-popup').css({
      'display': 'none'
    });
    $('.page-wrapper').css({
      'display': 'block'
    });
    startLoopOver();
  });

  $('.startLoopOver').on('click', function () {
    $('.message').text('Loop reset with ' + seedNumber + ' to start and maxpop set to ' + overPopulation);
    startLoopOver();
  });

  $('.inputsForm').on('submit', function (event) {
    event.preventDefault();
    $('.message').text('Loop reset with ' + seedNumber + ' to start and maxpop set to ' + overPopulation);
    startLoopOver();
  });

  $('.manualSeed').on('click', function () {
    $('.ecosystem').html('');
    round = 0;
    creaturePool = [];
    seedNumber = $('#seedNumber')[0].value || 10;
    overPopulation = $('#maxPopulation')[0].value || 50;
    seedCreatures(seedNumber);
    $('.message').text('Reseeded with ' + seedNumber + ' to start and maxpop set to ' + overPopulation);
  });

  $('.stopLoop').on('click', function () {
    clearInterval(looper);
  });

  $('.step-button').on('click', function () {
    $('.message').text('Loop started with ' + seedNumber + ' to start and maxpop set to ' + overPopulation);
    loop();
  });

  $('.addFood').on('click', function () {
    addFood();
  });

  $('.clearFood').on('click', function () {
    var filteredArray = creaturePool.filter(function removeFoods(each) {
      return !each.food;
    });
    console.log(filteredArray);

    // creaturePool.forEach(function removeFoods(each) {
    //   creaturePool.splice(each, 1);
    //   console.log(creaturePool);
    // });
    // console.log(creaturePool);
    $('.food').remove();
  });
})();
