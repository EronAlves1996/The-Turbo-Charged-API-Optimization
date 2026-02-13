import { logger } from "./logger";
import { client, replicaClient } from "./redis";

const LOG_CONTEXT = "repository";

const LOG = logger(LOG_CONTEXT);

interface Planet {
  id: number;
  name: string;
  climate: string;
}

const planets = [
  { id: 1, name: "Aethelgard", climate: "Frozen" },
  { id: 2, name: "Borealis", climate: "Icy" },
  { id: 3, name: "Caelum", climate: "Temperate" },
  { id: 4, name: "Drakon", climate: "Volcanic" },
  { id: 5, name: "Exalon", climate: "Arid" },
  { id: 6, name: "Fyros", climate: "Molten" },
  { id: 7, name: "Glacies", climate: "Frozen" },
  { id: 8, name: "Helion", climate: "Radiated" },
  { id: 9, name: "Ionia", climate: "Oceanic" },
  { id: 10, name: "Jovian-9", climate: "Gas Giant" },
  { id: 11, name: "Kyros", climate: "Arid" },
  { id: 12, name: "Lythos", climate: "Swamp" },
  { id: 13, name: "Myr", climate: "Tropical" },
  { id: 14, name: "Nyx", climate: "Dark" },
  { id: 15, name: "Olympus", climate: "Temperate" },
  { id: 16, name: "Pangaea", climate: "Rocky" },
  { id: 17, name: "Quaoar", climate: "Dwarf" },
  { id: 18, name: "Raxus", climate: "Toxic" },
  { id: 19, name: "Solinari", climate: "Hot" },
  { id: 20, name: "Terra Nova", climate: "Temperate" },
  { id: 21, name: "Umbra", climate: "Shadowy" },
  { id: 22, name: "Voria", climate: "Windy" },
  { id: 23, name: "Westeros", climate: "Variable" },
  { id: 24, name: "Xylos", climate: "Forest" },
  { id: 25, name: "Yavin-4", climate: "Jungle" },
  { id: 26, name: "Zephyr", climate: "Breezy" },
  { id: 27, name: "Alderaan", climate: "Temperate" },
  { id: 28, name: "Bothawui", climate: "Temperate" },
  { id: 29, name: "Corellia", climate: "Temperate" },
  { id: 30, name: "Dagobah", climate: "Swamp" },
  { id: 31, name: "Endor", climate: "Forest" },
  { id: 32, name: "Felucia", climate: "Humid" },
  { id: 33, name: "Geonosis", climate: "Arid" },
  { id: 34, name: "Hoth", climate: "Frozen" },
  { id: 35, name: "Ilum", climate: "Icy" },
  { id: 36, name: "Jakku", climate: "Desert" },
  { id: 37, name: "Kamino", climate: "Oceanic" },
  { id: 38, name: "Kashyyyk", climate: "Jungle" },
  { id: 39, name: "Lothal", climate: "Plains" },
  { id: 40, name: "Mandalore", climate: "Arid" },
  { id: 41, name: "Mustafar", climate: "Volcanic" },
  { id: 42, name: "Naboo", climate: "Temperate" },
  { id: 43, name: "Ord Mantell", climate: "Volcanic" },
  { id: 44, name: "Polis Massa", climate: "Asteroid" },
  { id: 45, name: "Ryloth", climate: "Arid" },
  { id: 46, name: "Sullust", climate: "Volcanic" },
  { id: 47, name: "Takodana", climate: "Temperate" },
  { id: 48, name: "Tatooine", climate: "Arid" },
  { id: 49, name: "Utapau", climate: "Arid" },
  { id: 50, name: "Voronda", climate: "Oceanic" },
  { id: 51, name: "Astron", climate: "Zero-G" },
  { id: 52, name: "Benthic", climate: "Aquatic" },
  { id: 53, name: "Cryon", climate: "Frozen" },
  { id: 54, name: "Dustball", climate: "Desert" },
  { id: 55, name: "Electra", climate: "Stormy" },
  { id: 56, name: "Flora", climate: "Overgrown" },
  { id: 57, name: "Granite", climate: "Mountainous" },
  { id: 58, name: "Halo", climate: "Artificial" },
  { id: 59, name: "Inferno", climate: "Molten" },
  { id: 60, name: "Junkyard", climate: "Polluted" },
  { id: 61, name: "Krypton", climate: "Radioactive" },
  { id: 62, name: "Lunar", climate: "Barren" },
  { id: 63, name: "Mars-X", climate: "Red Desert" },
  { id: 64, name: "Neon", climate: "Urban" },
  { id: 65, name: "Ozone", climate: "Toxic" },
  { id: 66, name: "Pluton", climate: "Dwarf" },
  { id: 67, name: "Quartz", climate: "Crystal" },
  { id: 68, name: "Rust", climate: "Corroded" },
  { id: 69, name: "Silicon", climate: "Tech" },
  { id: 70, name: "Titan", climate: "Methane" },
  { id: 71, name: "Ultima", climate: "Barren" },
  { id: 72, name: "Ventus", climate: "Windy" },
  { id: 73, name: "Wasteland", climate: "Ruined" },
  { id: 74, name: "Xenon", climate: "Gaseous" },
  { id: 75, name: "Yggdrasil", climate: "Forest" },
  { id: 76, name: "Zenith", climate: "Arid" },
  { id: 77, name: "Arcadia", climate: "Tropical" },
  { id: 78, name: "Braxis", climate: "Frozen" },
  { id: 79, name: "Chau Sara", climate: "Temperate" },
  { id: 80, name: "Dylar IV", climate: "Jungle" },
  { id: 81, name: "Eden Prime", climate: "Paradise" },
  { id: 82, name: "Feros", climate: "Ruined" },
  { id: 83, name: "Geth", climate: "Machine" },
  { id: 84, name: "Horizon", climate: "Oceanic" },
  { id: 85, name: "Ilos", climate: "Tropical" },
  { id: 86, name: "Korhal", climate: "Urban" },
  { id: 87, name: "Lisbon", climate: "Oceanic" },
  { id: 88, name: "Moros", climate: "Rocky" },
  { id: 89, name: "Noveria", climate: "Frozen" },
  { id: 90, name: "Ontarom", climate: "Temperate" },
  { id: 91, name: "Pavel", climate: "Ice" },
  { id: 92, name: "Quarian", climate: "Desert" },
  { id: 93, name: "Rannoch", climate: "Arid" },
  { id: 94, name: "Sur'Kesh", climate: "Jungle" },
  { id: 95, name: "Thessia", climate: "Tropical" },
  { id: 96, name: "Tuchanka", climate: "Wasteland" },
  { id: 97, name: "Virmire", climate: "Tropical" },
  { id: 98, name: "Xen", climate: "Hostile" },
  { id: 99, name: "Ziost", climate: "Frozen" },
  { id: 100, name: "Zion", climate: "Underground" },
];

function isPlanet(jsonObj: unknown): jsonObj is (typeof planets)[0] {
  if (typeof jsonObj !== "object" || jsonObj === null) {
    return false;
  }

  if ("id" in jsonObj && "name" in jsonObj && "climate" in jsonObj) {
    return (
      typeof jsonObj.id === "number" &&
      typeof jsonObj.name === "string" &&
      typeof jsonObj.climate === "string"
    );
  }

  return false;
}

function getPlanetRedisKey(planetId: number) {
  return `planet:${planetId}`;
}

async function readJsonFromReplicatedCache(key: string) {
  try {
    return await replicaClient.json.get(key);
  } catch (ex) {
    LOG.error("Error occurred! Fallbacking to master redis", ex);
    return await client.json.get(key).catch((ex) => {
      LOG.error("Error occurred while fetching from master", ex);
    });
  }
}

async function fetchPlanetFromRedis(planetId: number) {
  const planet = await readJsonFromReplicatedCache(getPlanetRedisKey(planetId));

  if (!isPlanet(planet)) {
    return;
  }

  return planet;
}

const REDIS_TTL = 60;

async function savePlanetOnRedis(planet: (typeof planets)[0]) {
  const planetKey = getPlanetRedisKey(planet.id);
  const result = await client.json.set(planetKey, "$", planet).catch((ex) => {
    LOG.error("Error occurred while caching planet", ex);
    return null;
  });

  if (result !== "OK") {
    LOG.warn("caching planet not sucessfull", { planet });
  }

  try {
    await client.expire(planetKey, REDIS_TTL);
  } catch (ex) {
    LOG.error("error occurred while seting expire time", ex);
  }
}

export async function getPlanet(planetId: number) {
  const cachedPlanet = await fetchPlanetFromRedis(planetId);
  if (cachedPlanet) {
    return cachedPlanet;
  }

  const planet = planets[planetId - 1];

  if (!planet) {
    return;
  }

  const cachingPlanetPromise = savePlanetOnRedis(planet);

  const planetPromise = new Promise<Planet>((resolve) => {
    setTimeout(() => {
      resolve(planet);
    }, 3000);
  });

  await Promise.all([cachingPlanetPromise, planetPromise]);
  return planetPromise;
}
