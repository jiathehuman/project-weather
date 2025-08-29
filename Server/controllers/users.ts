import { User } from "../src/entity/User";
import { AppDataSource } from "../src/data-source";
import { encrypt_password, generateToken, compare_password } from "../utils/helpers";

export const userRepository = AppDataSource.getRepository(User);

export const createUser = async (
  { body: { name, username, email, password } },
  res
) => {
  // check if user exist
  const emailExists = await userRepository.exists({ where: { email: email } });
  const usernameExists = await userRepository.exists({
    where: { username: username },
  });
  if (emailExists)
    return res
      .status(400)
      .json({ error: "Email taken. You have an account with us." });
  if (usernameExists) return res.status(400).json({ error: "Username taken." });
  // save the user
  try {
    const user = new User();
    user.name = name;
    user.username = username;
    user.email = email;
    user.password = await encrypt_password(password);

    await userRepository.save(user);

    const token = generateToken({ id: user.id });
    return res.status(201).json({ message: "User created!", token });
  } catch (error) {
    console.error(error.message);
    return res
      .status(500)
      .json({ error: "Could not save user", message: error });
  }
};

export const loginUser = async ({ body: { username, password } }, res) => {
  try {
    const user = await userRepository.findOne({ where: { username } });
    if (!user)
      return res
        .status(401)
        .json({ error: "No such account. Consider logging in." });

    const isValid = await compare_password(password, user.password);
    if (!isValid) return res.status(401).json({ error: "Invalid credentials" });

    const token = generateToken({ id: user.id });
    // user.password = ""; // hide password
    // const {password, ...userDeets} = user
    delete user.password
    return res
      .status(200)
      .json({ message: "Login is successful!", user, token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to log in" });
  }
};
