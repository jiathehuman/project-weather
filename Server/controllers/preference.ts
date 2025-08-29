import { AppDataSource } from "../src/data-source";
import { UserPreferences } from "../src/entity/UserPreferences";
import { userRepository } from "./users";
// https://typeorm.io/docs/working-with-entity-manager/repository-api

export const preferenceRepository =
  AppDataSource.getRepository(UserPreferences);

export const get_preference = async (req, res) => {
  try {
    const currentUser = req.currentUser;
    if (!currentUser?.id) // if no id, they have no valid token
      return res.status(401).json({ error: "Unauthorized" });
    // get preference associated with user
    const pref = await preferenceRepository.find({
      where: { user: { id: currentUser.id } },
    });
    // if no preference, send an empty array
    if (!pref)
      return res
        .status(200)
        .json({ message: "No preferences yet", data: [] });
    // otherwise, return with the preference
    return res.status(200).json({ data: pref });
  } catch (error) {
    return res
      .status(500)
      .json({
        error: "Failed to retrieve preferences",
        message: error,
      });
  }
};

export const create_or_update_preference = async (req, res) => {
  try {
    const currentUser = req.currentUser;
    if (!currentUser?.id)  return res.status(401).json({ error: "Unauthorized" });
    
    const userExists = await userRepository.exists({ where: { id: currentUser.id } });
    if (!userExists) return res.status(404).json({ error: `User ${currentUser.id} not found` });

    const { city, country_code, temperature_unit } = req.body ?? {};

    if (!city || !temperature_unit) {
      return res.status(400).json({ error: "city and temperature_unit are required fields" });
    }
    
    const cityInput = city.toLowerCase().trim();
    const countryCodeInput = country_code ? country_code.toLowerCase().trim() : null;


    const existing = await preferenceRepository.findOne({
      where: [
        { user: { id: currentUser.id }, city: cityInput },
        { user: { id: currentUser.id }, country_code: countryCodeInput },
      ],
    });

    let preference: UserPreferences

    if (existing) {
      // Update existing preference
      preference = existing;
      preference.temperature_unit = temperature_unit;
      if (countryCodeInput) preference.country_code = countryCodeInput;
      
    } else {
      // Create new preference
      preference = new UserPreferences();
      preference.city = cityInput;
      preference.temperature_unit = temperature_unit;
      if (countryCodeInput) preference.country_code = countryCodeInput;
      preference.user = currentUser;
    }

    // Save the preference
    const saved = await preferenceRepository.save(preference);
    return res.status(200).json({ data: saved });

  } catch (error) {
    console.error("Error creating/updating preference:", error);
    return res.status(500).json({ error: "An unexpected error occurred." });
  }
};