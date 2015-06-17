module.exports.randomStr = function(num) {
  var text = "";
  var possible = "abcdefghijkmnpqrstuvwxyz23456789";
  for( var i=0; i < num; i++ ) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

module.exports.slugify = function(text) {
  // var today = new Date();
  // var dd = today.getDate();
  // var mm = today.getMonth()+1;
  // var yyyy = today.getFullYear();
  // if (dd<10) { dd='0'+dd }
  // if (mm<10) { mm='0'+mm }
  
  var slugDashed = text.toString().toLowerCase()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/\:+/g, '-')           // Replace colon with dash
    .replace(/\_+/g, '-')           // Replace underscore with dash
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple -- with single -
    .trim();                         // Trim whitespace
  
  var maxLength = 50 // max number of characters 
  var truncatedSlug = slugDashed.substr(0, maxLength); //trim the string to max length
  truncatedSlug = truncatedSlug.substr(0, Math.min(truncatedSlug.length, truncatedSlug.lastIndexOf("-"))); //re-trim if in the middle of a word 
  // slug = yyyy + '-' + mm + '-' + dd + '-' + truncatedSlug;
  slug = truncatedSlug;
  return slug;
};

