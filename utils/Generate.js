let random = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 
    'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 
    'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 
    'u', 'v', 'w', 'x', 'y', 'z', 
    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 
    'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 
    'U', 'V', 'W', 'X', 'Y', 'Z', 
     '_',,

  ];
  


const GenerateID = (idLength = 0) =>{
    let result = [];
  
    for (let i = 0; i < idLength; i++) {
      let randomIndex = Math.floor(Math.random() * random.length);
      result.push(random[randomIndex]);
    }
    return result.join("")
}
const GenerateOTP = (idLength = 0) =>{
  let random = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 0 
  ];
  let result = [];

  for (let i = 0; i < idLength; i++) {
    let randomIndex = Math.floor(Math.random() * random.length);
    result.push(random[randomIndex]);
  }
  return result.join("")
}
module.exports = {GenerateID,GenerateOTP};