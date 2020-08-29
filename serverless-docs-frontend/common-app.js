const copyToClipBoard = (value) => {
  var $temp = $("<input>");
  $("body").append($temp);
  
  $temp.val(value).select();
  document.execCommand("copy");
  $temp.remove();
}

const validatePassowrds = (inputPasswords) => {
  if(inputPasswords.length !== 2) return undefined
  
  let passwords = inputPasswords.map(password => {
    return $(`#${password}`).val()
  });

  if(passwords[0] !== passwords[1]) {
    return false
  } else {
    return true
  }
}

