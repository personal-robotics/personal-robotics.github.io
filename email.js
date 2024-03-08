// Obfuscate email 
const encoded = "name@example.com".split("").reverse().join("");
const email = encoded.split("").reverse().join("");

// Dynamically generate mailto link
const mailtoLink = "mailto:"+email; 

// Set href of link  
document.querySelector(".email-link").href = mailtoLink;