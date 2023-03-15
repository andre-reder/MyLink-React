export default function maskCep(value) {
  // Get the input value and remove non-digit characters
  let inputValue = value.replace(/\D/g, '');

  // Apply the CEP mask (5 digits + '-' + 3 digits)
  if (inputValue.length > 5) {
    inputValue = `${inputValue.substring(0, 5)}-${inputValue.substring(5, 8)}`;
  }

  // Set the masked value back to the input field
  return inputValue;
}
