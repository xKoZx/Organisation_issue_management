function Validation(values){
  
    let error ={}
  //  const email_pattern=/^[^\s@]+@[^\s@]+\.[^\S@]+$/
  //  const password_pattern=/^(?=.*\d)(?=.*[a-z])(?=.*[A-z])[a-zA-Z0-9]{8,}$/
    if(values.name===""){
        error.name="Name cannot be empty"
    }
    else{
        error.name=""
    }
    if(values.email ===""){
      error.email="Email should not be empty"
  
    }
   // else if(!email_pattern.test(values.email)){
   //   error.email="email Didnt match"
  
   // }
    else{
      error.email=""
    }
    if(values.password===""){
      error.password="Password should not be empty"
    }
   // else if(!password_pattern.test(values.password)){
    //  error.password="Password Dodnt match"
   // }
    else{
      error.password=""
    }
    return error;
  
  
  }
  
  export default Validation;