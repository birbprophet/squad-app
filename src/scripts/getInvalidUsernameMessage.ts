export const getInvalidUsernameMessage = (rawInputUsername: string): string => {
  if (rawInputUsername.length === 1) {
    return 'Please enter a username';
  }
  const inputUsername = rawInputUsername.slice(1);

  if (
    !inputUsername.match(/^[a-z0-9_][a-z0-9._]+[a-z0-9_]$/) ||
    inputUsername.match(/\.\./)
  ) {
    if (inputUsername === '') {
      return '';
    } else if (inputUsername.match(/^\./) || inputUsername.match(/\.$/)) {
      return 'Username cannot start or end with .';
    } else if (inputUsername.match(/\.\./)) {
      return 'Username cannot contain more than 1 . in a row';
    } else if (inputUsername.length < 3) {
      return 'Username must be at least 3 characters long';
    } else {
      return 'Username can only contain lowercase letters, numbers, ., or _';
    }
  } else {
    return '';
  }
};
