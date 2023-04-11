import { useState } from 'react';

export default function useErrors() {
  const [errors, setErrors] = useState([]);

  function setError({ field, message }) {
    const errorFieldAlreadyExists = errors.find((error) => error.field === field);

    if (errorFieldAlreadyExists) {
      const isSameMessage = errorFieldAlreadyExists.message === message;
      if (isSameMessage) {
        return;
      }
      setErrors((prevState) => {
        const errorFieldIndex = prevState.findIndex((error) => error.field === field);
        const errorsCloned = JSON.parse(JSON.stringify(prevState));
        errorsCloned[errorFieldIndex] = { field, message };

        return errorsCloned;
      });
      return;
    }

    setErrors((prevState) => [
      ...prevState,
      { field, message },
    ]);
  }

  function removeError(fieldName) {
    setErrors((prevState) => prevState.filter(
      (error) => error.field !== fieldName,
    ));
  }

  function getErrorMessageByFieldName(fieldname) {
    return errors.find((error) => error.field === fieldname)?.message;
  }

  return {
    setError, removeError, getErrorMessageByFieldName, errors,
  };
}
