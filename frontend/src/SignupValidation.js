function Validation(values) {
  let errors = {};

  if (values.name === "") {
    errors.name = "Name cannot be empty";
  } else {
    errors.name = "";
  }

  if (values.email === "") {
    errors.email = "Email should not be empty";
  } else {
    errors.email = "";
  }

  if (values.password === "") {
    errors.password = "Password should not be empty";
  } else {
    errors.password = "";
  }

  if (values.confirmPassword === "") {
    errors.confirmPassword = "Confirm Password should not be empty";
  } else if (values.password !== values.confirmPassword) {
    errors.confirmPassword = "Passwords do not match";
  } else {
    errors.confirmPassword = "";
  }

  return errors;
}

export default Validation;
