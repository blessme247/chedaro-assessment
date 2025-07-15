import { User } from "./data.types";

export  function getUser() {
//   const sessionCookie = (await cookies()).get('sessionToken');

if (!window || window === undefined) {
    return null
}
  const userString = localStorage.getItem("user");
  if (!userString) {
    return null;
  }
  const user = JSON.parse(userString);
  if (!user) {
    return null;
  }

  return user as Omit<User, 'password'>



}