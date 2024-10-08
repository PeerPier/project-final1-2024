const storeInSession = (key: string, value: string) => {
  return sessionStorage.setItem(key, value);
};

const lookInSession = (key: string): string | null => {
  return sessionStorage.getItem(key);
};

const removeFromSession = (key: string) => {
  return sessionStorage.removeItem(key);
};

const logOutUser = () => {
  sessionStorage.clear();
};

export { storeInSession, lookInSession, removeFromSession, logOutUser };
