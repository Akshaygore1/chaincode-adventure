export function decodeMorseCode(morseCode) {
  const morseToChar = {
    ".-": "A",
    "-...": "B",
    "-.-.": "C",
    "-..": "D",
    ".": "E",
    "..-.": "F",
    "--.": "G",
    "....": "H",
    "..": "I",
    ".---": "J",
    "-.-": "K",
    ".-..": "L",
    "--": "M",
    "-.": "N",
    "---": "O",
    ".--.": "P",
    "--.-": "Q",
    ".-.": "R",
    "...": "S",
    "-": "T",
    "..-": "U",
    "...-": "V",
    ".--": "W",
    "-..-": "X",
    "-.--": "Y",
    "--..": "Z",
    ".----": "1",
    "..---": "2",
    "...--": "3",
    "....-": "4",
    ".....": "5",
    "-....": "6",
    "--...": "7",
    "---..": "8",
    "----.": "9",
    "-----": "0",
    "/": " ",
  };

  const codes = morseCode.split("➡➡➡");

  return codes
    .map((code) => {
      code = code.trim();
      if (morseToChar[code]) {
        return morseToChar[code];
      } else {
        return "?";
      }
    })
    .join("");
}

export function decodeAllString(morse) {
  let string = {};

  for (const key in morse) {
    const morseCode = morse[key].join("");
    const morseText = morseCode.split("➡➡➡").join(",");
    let arr = morseText.split(",");
    const nums = arr[0];
    const text = arr[1];

    if (nums.length > 5) {
      let firstnumber = nums.substring(0, 5);
      let secondnumber = nums.substring(5, nums.length);
      const decodedNumber = decodeMorseCode(firstnumber);
      const decodedSecondNumber = decodeMorseCode(secondnumber);
      const mixedNumber = decodedNumber + decodedSecondNumber;
      string[mixedNumber] = decodeMorseCode(text);
    } else {
      const decodedSingleNumber = decodeMorseCode(nums);
      string[decodedSingleNumber] = decodeMorseCode(text);
    }
  }

  return Object.values(string).join("");
}
