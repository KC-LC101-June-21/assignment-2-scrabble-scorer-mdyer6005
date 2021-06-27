// inspired by https://exercism.io/tracks/javascript/exercises/etl/solutions/91f99a3cca9548cebe5975d7ebca6a85

const input = require("readline-sync");

const oldPointStructure = {
  0: [' '],
  1: ['A', 'E', 'I', 'O', 'U', 'L', 'N', 'R', 'S', 'T'],
  2: ['D', 'G'],
  3: ['B', 'C', 'M', 'P'],
  4: ['F', 'H', 'V', 'W', 'Y'],
  5: ['K'],
  8: ['J', 'X'],
  10: ['Q', 'Z']
};

function oldScrabbleScorer(word) {
	word = word.toUpperCase();
	let letterPoints = "";
 
	for (let i = 0; i < word.length; i++) {
 
	  for (const pointValue in oldPointStructure) {
 
		 if (oldPointStructure[pointValue].includes(word[i])) {
			letterPoints += `Points for '${word[i]}': ${pointValue}\n`
		 }
 
	  }
	}
	return letterPoints;
 }

// your job is to finish writing these functions and variables that we've named //
// don't change the names or your program won't work as expected. //

function initialPrompt() {   
   let prompt = "Enter a word to score";
   console.log("Let's play some scrabble!\n");
   let word = input.question(`${prompt}: `);
   //while (!isWord(word)) {
   while (!isValidToScore(word)) {
     console.log(`${word} is not a valid word.  Try again.`)
     word = input.question(`${prompt}: `);
   }
   return word; 
};

/*  no longer used after making " " a valid character
function isWord(checkValue) {
  let wordExpression = /[^a-z]/i;
  return (!wordExpression.test(checkValue)) && checkValue.length >= 1;  
}
*/

function isValidToScore(word) {  
  if (word.length <= 0) {
    return false;
  }
  for (let i = 0; i < word.length; i++) {
    let letter = word[i];
    if (isInStringCaseInsensitive(letter, validCharacters)) {    //if (validChar.indexOf(letter) === -1) {
      // character is fine, keep going
    } else {      
      console.log(`${letter} is not a valid character`);
      return false;
    }
  }
  return true;
}

/*   scoring functions as written before blank spaces were accepted
let simpleScore = function (word) {  
  if (isValidToScore(word)) {
    return word.length;
  } else {
    cosole.log(`Error: ${word} is not a valid input`)
    return 0;
  }
};

let vowelBonusScore = function (word) {
  if (isValidToScore(word)) {
    let score = 0;
    let consonantScore = 1;
    let vowelScore = 3;
    let addForVowel = vowelScore - consonantScore;
    let vowels = "aeiou";
    for (let i = 0; i < word.length; i++) {
      let checkCharacter = word[i].toLowerCase();
      if (vowels.indexOf(checkCharacter) >= 0) {
        score += vowelScore;
      } else {
        score += consonantScore;
      }
    }
    return score;
  } else {    
      cosole.log(`Error: ${word} is not a valid input`)
      return 0;
  }
};
*/

let simpleScore = function (word) {  
  let pointsPerCharacter = 1;
  let score = 0;
  if (isValidToScore(word)) {
    for (let i = 0; i < word.length; i++) {
      let checkCharacter = word[i];
      if (isInStringCaseInsensitive(checkCharacter, zeroPointsCharacters)) {
        // do not add points
      } else {
        // not a zero point character, so add the simple point value
        score += pointsPerCharacter;
      }
    }
    return score;
  } else {
    cosole.log(`Error: ${word} is not a valid input`)
    return 0;
  }
};

let vowelBonusScore = function (word) {
  if (isValidToScore(word)) {
    let score = 0;
    let consonantScore = 1;
    let vowelScore = 3;
    let vowels = "aeiou";
    for (let i = 0; i < word.length; i++) {
      let checkCharacter = word[i];
      if (isInStringCaseInsensitive(checkCharacter, vowels)) {
        score += vowelScore;
      } else if (isInStringCaseInsensitive(checkCharacter, zeroPointsCharacters)) {
        // no additional points
      } else {
        score += consonantScore;
      }
    }
    return score;
  } else {    
      cosole.log(`Error: ${word} is not a valid input`)
      return 0;
  }
};

let scrabbleScore = function (word) {
  if (isValidToScore(word)) {
    let scoreWord = word.toLowerCase();
    let score = 0;
    for (let i = 0; i < scoreWord.length; i++) {
      let letter = scoreWord[i];
      let addPoints = newPointStructure[letter];
      score += addPoints;      
    }
    return score;
  } else {
    console.log(`Error: ${word} is not a valid input`)
    return 0;
  }
};

let simpleScorer = {
    name: "Simple Score", 
    description: "Each letter is worth 1 point.", 
    scoringFunction: simpleScore
  };

let vowelScorer = {
    name: "Bonus Vowels", 
    description: "Vowels are 3 pts. consonants are 1 pt.", 
    scoringFunction: vowelBonusScore
  };

let scrabbleScorer = {
    name: "Scrabble", 
    description: "The traditional scoring algorithm.", 
    scoringFunction: scrabbleScore
  };

const scoringAlgorithms = [simpleScorer, vowelScorer, scrabbleScorer];

function scorerPrompt(scorers) {
  console.log("Which scoring algorithm would you like to use?\n");
  let promptList = "Enter ";  
  for (let i = 0; i < scorers.length; i++) {
    console.log(`${i} - ${scorers[i].name}:  ${scorers[i].description}`);
    if (i < (scorers.length - 1)) {
      promptList += `${i}, `;
    } else {
      // last entry
      promptList += `or ${i}`;
    }
  }
  let scorerIndex = Number(input.question(`${promptList}: `));
  
  while (scorerIndex < 0 || scorerIndex > (scorers.length - 1) || isNaN(scorerIndex) || !Number.isInteger(scorerIndex)) {
    console.log(`${scorerIndex} is not a valid selection.`);
    scorerIndex = Number(input.question(`${promptList}: `));
  }  
  return scorers[scorerIndex];
}

function transform(oldPointsObject) {  
  let newPointsObject = {};
  // get each key from oldObject which was sorted by point value
  for (const pointVal in oldPointsObject) {
    // get the value from oldObjects's key, which will be an array of letters
    let letters = oldPointsObject[pointVal];
    // add each letter as a key in the new object
    for (let i = 0; i < letters.length; i++) {
      let letter = letters[i].toLowerCase();
      newPointsObject[letter] = Number(pointVal);
    }    
  }
  return newPointsObject;
};

let newPointStructure = transform(oldPointStructure);

function isInStringCaseInsensitive(lookForStr, lookInStr) {
  if (lookInStr.toLowerCase().indexOf(lookForStr.toLowerCase()) >= 0) {
    return true;
  } else {
    return false;
  }
}

function getValidCharactersString(pointStructure) {
  let characterString = "";
  for (let letter in pointStructure) {
    characterString += letter;
  }
  return characterString;
}

function getZeroPointsCharacterString(pointStructure) {
  let characterString = "";
  for (let character in pointStructure) {
    if (pointStructure[character] === 0) {
      characterString += character;
    }
  }
  return characterString;
}

const validCharacters = getValidCharactersString(newPointStructure);

const zeroPointsCharacters = getZeroPointsCharacterString(newPointStructure);

//console.log(`Zero points for: ${zeroPointsCharacters}`);

function runProgram() {
   let word = initialPrompt();
   let scorer = scorerPrompt(scoringAlgorithms);
   console.log(`Score for '${word}': ${scorer.scoringFunction(word)}`);
}

// Don't write any code below this line //
// And don't change these or your program will not run as expected //
module.exports = {
   initialPrompt: initialPrompt,
   transform: transform,
   oldPointStructure: oldPointStructure,
   simpleScore: simpleScore,
   vowelBonusScore: vowelBonusScore,
   scrabbleScore: scrabbleScore,
   scoringAlgorithms: scoringAlgorithms,
   newPointStructure: newPointStructure,
	runProgram: runProgram,
	scorerPrompt: scorerPrompt
};

