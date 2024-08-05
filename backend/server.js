const express = require('express');
const multer = require('multer');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const app = express();
const cors = require('cors');
const port = 5000;
const streamifier = require('streamifier'); // Asegúrate de que esta línea esté presente
const csv = require('csv-parser'); // Asegúrate de haberlo instalado
const fs = require('fs');

// Configuración de Multer para manejar archivos
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configuración de la base de datos
const db = mysql.createConnection({
  host: 'database-1-test-south-america.cdaegmc4stbt.sa-east-1.rds.amazonaws.com',
  user: 'admin',
  port: 3306,
  password: 'z8jlqgcd',
  database: 'newfiebredevelop'
});

db.connect(err => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the database.');
});

// Ruta para manejar la creación de un nuevo casino
app.post('/api/casino', (req, res) => {
  const {
    casinoName,
    dateFounded,
    address,
    casinoOwner,
    dateLaunched,
    casinoUrl,
    phoneSupport,
    supportEmail,
    helpCentre,
    ageLimit,
    liveChat,
    eSportsBetting,
    cryptoCurrenciesSupported,
    bannedCountries,
    country,
    languages,
    currencies,
    games,
    bonuses,
    tournaments,
    paymentProviders,
    licenses
  } = req.body;

  console.log('ESTO LLEGA AL BACKEND:', req.body);

  // Insertar datos del casino en la base de datos
  const casinoQuery = `INSERT INTO Casino 
    (casinoName, dateFounded, address, casinoOwner, dateLaunched, casinoUrl, phoneSupport, supportEmail, helpCentre, ageLimit, bannedCountries, liveChat, eSportsBetting, cryptoCurrenciesSupported, country, languages, currencies) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  db.query(
    casinoQuery,
    [
      casinoName,
      dateFounded,
      address,
      JSON.stringify(casinoOwner),
      dateLaunched,
      casinoUrl,
      phoneSupport,
      supportEmail,
      helpCentre,
      ageLimit,
      JSON.stringify(bannedCountries), // Convertir a cadena JSON
      liveChat,
      eSportsBetting,
      cryptoCurrenciesSupported,
      JSON.stringify(country), // Convertir a cadena JSON
      JSON.stringify(languages), // Convertir a cadena JSON
      JSON.stringify(currencies) // Convertir a cadena JSON
    ],
    (err, result) => {
      if (err) {
        console.error('Error inserting casino data:', err);
        return res.status(500).send('Error inserting casino data.');
      }

      const casinoId = result.insertId;
      const countryQ = `INSERT INTO Country (countryName, countryCode) VALUES (?, ?)`;
      db.query(countryQ, [country.label, country.value], (err,result) => {
        if (err) console.error('Error inserting country data:', err);
      });

      
      // Buscar ID  relación con país
      if (country) {
        const countryQuery= `SELECT countryId FROM Country WHERE countryName = ? AND countryCode = ?`;
        db.query(countryQuery, [country.label, country.value], (err, result) => {
  
          if (result.length > 0) {
            const countryId = result[0].countryId;
            const casinoCountryQuery = `INSERT INTO CasinoCountry (casinoId,countryId, casinoName, countryName) VALUES (?, ?, ?, ?)`;
            db.query(casinoCountryQuery, [casinoId,countryId ,casinoName,country.value ], (err) => {
          if (err) console.error('Error inserting country data:', err);
        });
          } 
        });
       
      }
            // Insertar relación con monedas
            currencies.forEach(currency => {
              const currQ = `INSERT INTO Currency (currencyCode) VALUES (?)`;
              db.query(currQ, [currency.value], (err) => {
                if (err) console.error('Error inserting currency data:', err);
              });
              if(currency){
                const currencySearch= `SELECT currencyId FROM Currency WHERE currencyCode = ?`;
                db.query(currencySearch, [currency.value], (err, result) => {
                  console.log('el resultado es :',result);
                  if(result.length > 0){
                    const currencyId = result[0].currencyId;
                    const currencyQuery = `INSERT INTO CasinoCurrency (casinoId, currencyId) VALUES (?, ?)`;
                    db.query(currencyQuery, [casinoId, currencyId], (err) => {
                      console.log('se hace el insert en CasinoCurrency')
                      if (err) console.error('Error inserting currency data:', err);
                    });
                  }
                });
              }
            });
  //Languages

  languages.forEach(language => {
    const languageQ = `INSERT INTO Language (languageName) VALUES (?)`;
    db.query(languageQ, [language.value], (err) => {
      if (err) console.error('Error inserting currency data:', err);
    });
    if(language){
      const languageSearch= `SELECT languageId FROM Language WHERE languageName = ?`;
      db.query(languageSearch, [language.value], (err, result) => {
        if(result.length > 0){
          const languageId = result[0].languageId;
          const languageQuery = `INSERT INTO CasinoLanguage (casinoId, languageId) VALUES (?, ?)`;
          db.query(languageQuery, [casinoId, languageId], (err) => {
            console.log('se hace el insert en CasinoLanguage')
            if (err) console.error('Error inserting currency data:', err);
          });
        }
      });
    }
  });

//Games 
games.forEach(game => { 
  // Primero, verifica si el proveedor del juego existe
  const prevQueryGameProvider = `SELECT providerId FROM GameProvider WHERE gameProviderName = ?`;
  db.query(prevQueryGameProvider, [game.gameProviderId.value], (err, result) => {
    if (err) {
      console.error('Error retrieving game provider data:', err);
      return;
    }

    let providerId;

    if (result.length <= 0) {
      // Si el proveedor no existe, insértalo
      const gameProviderQ = `INSERT INTO GameProvider (gameProviderName) VALUES (?)`;
      db.query(gameProviderQ, [game.gameProviderId.value], (err, insertResult) => {
        if (err) {
          console.error('Error inserting game provider data:', err);
          return;
        }
        providerId = insertResult.insertId;
        const gameQ = `INSERT INTO Game (gameName, gameDescription, gameProviderId) VALUES (?, ?, ?)`;
        db.query(gameQ, [game.gameName, game.gameDescription.value, providerId], (err, insertResult) => {
          if (err) {
            console.error('Error inserting game data:', err);
            return;
          }
          const gameId = insertResult.insertId;
          const casinoGameQuery = `INSERT INTO CasinoGame (casinoId, gameId) VALUES (?, ?)`;
          db.query(casinoGameQuery, [casinoId, gameId], (err) => {
            if (err) {
              console.error('Error inserting casino game data:', err);
            } else {
              console.log('Game successfully associated with casino.');
            }
          });
        });
      });
    } else {
      // Si el proveedor existe, usa su ID
      providerId = result[0].providerId;
      const gameQ = `INSERT INTO Game (gameName, gameDescription, gameProviderId) VALUES (?, ?, ?)`;
      db.query(gameQ, [game.gameName, game.gameDescription.value, providerId], (err, insertResult) => {
        if (err) {
          console.error('Error inserting game data:', err);
          return;
        }
        const gameId = insertResult.insertId;
        const casinoGameQuery = `INSERT INTO CasinoGame (casinoId, gameId) VALUES (?, ?)`;
        db.query(casinoGameQuery, [casinoId, gameId], (err) => {
          if (err) {
            console.error('Error inserting casino game data:', err);
          } else {
            console.log('Game successfully associated with casino.');
          }
        });
      });
    }

   
  });
});


//Bonus

// Bonus
bonuses.forEach(bonus => { 
  console.log('Procesando bonus:', bonus); // Verificar el contenido del bonus

  // Primero, verifica si el proveedor del juego existe
  const prevQueryBonusType = `SELECT bonusTypeId FROM BonusType WHERE bonusTypeName = ?`;
  db.query(prevQueryBonusType, [bonus.bonusTypeId.value], (err, result) => {
    if (err) {
      console.error('Error retrieving bonus type data:', err);
      return;
    }

    let bonusTypeId;

    if (result.length <= 0) {
      // Si el bonus type no existe, insértalo
      const bonusTypeQ = `INSERT INTO BonusType (bonusTypeName) VALUES (?)`;
      db.query(bonusTypeQ, [bonus.bonusTypeId.value], (err, insertResult) => {
        if (err) {
          console.error('Error inserting bonus type data:', err);
          return;
        }
        bonusTypeId = insertResult.insertId;

        // Asegurarse de que todos los campos de bonus estén presentes
        console.log('Insertando bonus con ID de tipo nuevo:', bonusTypeId);
        const bonusQ = `INSERT INTO Bonus (bonusTypeId,bonusAmount, bonusWE, sticky, bonusText, bonusTerms) VALUES (?, ?, ?, ?, ?, ?)`;
        db.query(bonusQ, [bonusTypeId, bonus.bonusAmount, bonus.bonusWE, bonus.sticky, bonus.bonusText, bonus.bonusTerms], (err, insertResult) => {
          if (err) {
            console.error('Error inserting bonus data:', err);
            return;
          }
          const bonusId = insertResult.insertId;
          const casinoBonusQuery = `INSERT INTO CasinoBonus (casinoId, bonusId) VALUES (?, ?)`;
          db.query(casinoBonusQuery, [casinoId, bonusId], (err) => {
            if (err) {
              console.error('Error inserting casino bonus data:', err);
            } else {
              console.log('Bonus successfully associated with casino.');
            }
          });
        });
      });
    } else {
      // Si el bonus type existe, usa su ID
      bonusTypeId = result[0].bonusTypeId;

      // Asegurarse de que todos los campos de bonus estén presentes
      console.log('Insertando bonus con ID de tipo existente:', bonusTypeId);
      const bonusQ = `INSERT INTO Bonus (bonusTypeId,bonusAmount, bonusWE, sticky, bonusText, bonusTerms) VALUES (?, ?, ?, ?, ?, ?)`;
      db.query(bonusQ, [bonusTypeId, bonus.bonusAmount, bonus.bonusWE, bonus.sticky, bonus.bonusText, bonus.bonusTerms], (err, insertResult) => {
        if (err) {
          console.error('Error inserting bonus data:', err);
          return;
        }
        const bonusId = insertResult.insertId;
        const casinoBonusQuery = `INSERT INTO CasinoBonus (casinoId, bonusId) VALUES (?, ?)`;
        db.query(casinoBonusQuery, [casinoId, bonusId], (err) => {
          if (err) {
            console.error('Error inserting casino bonus data:', err);
          } else {
            console.log('Bonus successfully associated with casino.');
          }
        });
      });
    }
  });
});


// torneos
tournaments.forEach(tournament => {
  const prevQueryTournamentType = `SELECT tournamentTypeId FROM TournamentType WHERE tournamentTypeName = ?`;
  db.query(prevQueryTournamentType, [tournament.tournamentTypeId.value], (err, result) => {
    if (err) {
      console.error('Error retrieving tournament type data:', err);
      return;
    }

    let tournamentTypeId;

    if (result.length > 0) {
      // Ya existe el tournament type
      tournamentTypeId = result[0].tournamentTypeId; // Corrección de nombre
      const tournamentQuery = `INSERT INTO Tournament (tournamentTypeId, tournamentDescription, totalFS, totalPrizePool, casinoId) VALUES (?, ?, ?, ?, ?)`;
      db.query(tournamentQuery, [tournamentTypeId, tournament.tournamentDescription, tournament.totalFS, tournament.totalPrizePool, casinoId], (err) => {
        if (err) console.error('Error inserting tournament data:', err);
      });
    } else {
      // Primero hay que añadir el tournament type
      const QueryTournamentType = `INSERT INTO TournamentType (tournamentTypeName) VALUES (?)`;
      db.query(QueryTournamentType, [tournament.tournamentTypeId.value], (err, result) => {
        if (err) {
          console.error('Error inserting tournament type data:', err);
          return;
        }

        tournamentTypeId = result.insertId; // Corrección de nombre
        const tournamentQuery = `INSERT INTO Tournament (tournamentTypeId, tournamentDescription, totalFS, totalPrizePool, casinoId) VALUES (?, ?, ?, ?, ?)`;
        db.query(tournamentQuery, [tournamentTypeId, tournament.tournamentDescription, tournament.totalFS, tournament.totalPrizePool, casinoId], (err) => {
          if (err) console.error('Error inserting tournament data:', err);
        });
      });
    }
  });
});

// Insertar relación con proveedores de pago
paymentProviders.forEach(provider => {
  // Verificar si el proveedor de pago ya existe
  console.log('AQUI LLEGAN LOS VALORES DE PROVIDER!!!!!!!!!!!: ',provider.paymentProviderName.value, provider.paymentProviderName.label)
  const providerQuery = `SELECT providerId FROM PaymentProvider WHERE paymentProviderName = ?`;
  db.query(providerQuery, [provider.paymentProviderName.value], (err, result) => {
    if (err) {
      console.error('Error retrieving payment provider data:', err);
      return;
    }

    if (result.length > 0) {
      // Si el proveedor de pago existe, usar su ID
      const providerId = result[0].providerId;
      const casinoProviderQuery = `INSERT INTO CasinoPaymentProvider (casinoId, providerId) VALUES (?, ?)`;
      db.query(casinoProviderQuery, [casinoId, providerId], (err) => {
        if (err) {
          console.error('Error inserting casino-payment provider relationship:', err);
        } else {
          console.log(`Successfully associated provider with casino.`);
        }
      });
    } else {
      // Si el proveedor de pago no existe, insertarlo primero
      const insertProviderQuery = `INSERT INTO PaymentProvider (paymentProviderName) VALUES (?)`;
      db.query(insertProviderQuery, [provider.paymentProviderName.value], (err, insertResult) => {
        if (err) {
          console.error('Error inserting payment provider data:', err);
          return;
        }
        const providerId = insertResult.insertId;
        const casinoProviderQuery = `INSERT INTO CasinoPaymentProvider (casinoId, providerId) VALUES (?, ?)`;
        db.query(casinoProviderQuery, [casinoId, providerId], (err) => {
          if (err) {
            console.error('Error inserting casino-payment provider relationship:', err);
          } else {
            console.log(`Successfully inserted and associated provider ${provider.value} with casino.`);
          }
        });
      });
    }
  });
});


      // Insertar relación con licencias
      licenses.forEach(license => {
        // Verificar si la licencia ya existe
        console.log('AQUI LLEGAN LOS VALORES DE License!!!!!!!!!!!: ',license.licenseName.value, license.licenseName.label)
        const licenseQuery = `SELECT licenseId FROM License WHERE licenseName = ?`;
        db.query(licenseQuery, [license.licenseName.value], (err, result) => {
          if (err) {
            console.error('Error retrieving license data:', err);
            return;
          }
      
          let licenseId;
      
          if (result.length > 0) {
            // Si la licencia existe, usar su ID
            licenseId = result[0].licenseId;
          } else {
            // Si la licencia no existe, insertarla primero
            const insertLicenseQuery = `INSERT INTO License (licenseName) VALUES (?)`;
            db.query(insertLicenseQuery, [license.licenseName.value], (err, insertResult) => {
              if (err) {
                console.error('Error inserting license data:', err);
                return;
              }
              licenseId = insertResult.insertId;
              // Insertar la relación después de obtener el ID de la licencia
              const casinoLicenseQuery = `INSERT INTO CasinoLicense (casinoId, licenseId) VALUES (?, ?)`;
              db.query(casinoLicenseQuery, [casinoId, licenseId], (err) => {
              if (err) {
                console.error('Error inserting casino-license relationship:', err);
                } else {
                console.log(`Successfully associated license ID with casino ID.`);
                }
              });
            });
            return; // Salir de la iteración actual del forEach
          }
      
          // Insertar la relación si la licencia ya existe
          const casinoLicenseQuery = `INSERT INTO CasinoLicense (casinoId, licenseId) VALUES (?, ?)`;
          db.query(casinoLicenseQuery, [casinoId, licenseId], (err) => {
          if (err) {
            console.error('Error inserting casino-license relationship:', err);
          } else {
          console.log(`Successfully associated license ID $with casino ID $.`);
            }
          });
        });
      });
      res.status(201).send('Casino created successfully.');
    }
  );
});
//Ruta para manejar la carga de CSV
app.post('/api/uploadcsv', upload.single('csvFile'), async (req, res) => {
  const results = [];
  const fileBuffer = req.file.buffer;

  try {
  // Parsear el archivo CSV
  await new Promise((resolve, reject) => {
    streamifier.createReadStream(fileBuffer)
      .pipe(csv())
      .on('data', (row) => {
        // Convertir campos separados por comas a arrays
        row.bannedCountries = row.bannedCountries ? row.bannedCountries.split(',') : [];
        row.country = row.country ? { label: row.country.split('|')[0], value: row.country.split('|')[1] } : {};
        row.languages = row.languages ? row.languages.split('|').map(value => ({ value })) : [];
        row.currencies = row.currencies ? row.currencies.split('|').map(value => ({ value })) : [];
        row.games = row.games ? row.games.split('|').map(game => ({ gameName: game })) : [];
        row.bonuses = row.bonuses ? row.bonuses.split('|').map(bonus => {
          const [bonusTypeId, bonusAmount, bonusWE, sticky, bonusText, bonusTerms] = bonus.split(',');
          return { bonusTypeId, bonusAmount, bonusWE, sticky, bonusText, bonusTerms };
        }) : [];
        row.tournaments = row.tournaments ? row.tournaments.split('|').map(tournament => {
          const [tournamentTypeId, tournamentDescription, totalFS, totalPrizePool] = tournament.split(',');
          return { tournamentTypeId, tournamentDescription, totalFS, totalPrizePool };
        }) : [];
        row.paymentProviders = row.paymentProviders ? row.paymentProviders.split('|').map(paymentProvider => {
          const [providerName] = paymentProvider.split(',');
          return { providerName };
        }) : [];
        row.licenses = row.licenses ? row.licenses.split('|').map(license => {
          const [licenseName] = license.split(',');
          return { licenseName };
        }) : [];

        results.push(row);
      })
      .on('end', resolve)
      .on('error', reject);
  });

  console.log('Parsed CSV data:', results);

    for (const casino of results) {
      const {
        casinoName, dateFounded, address, casinoOwner, dateLaunched, casinoUrl,
        phoneSupport, supportEmail, helpCentre, ageLimit, liveChat, eSportsBetting,
        cryptoCurrenciesSupported, bannedCountries, country, languages, currencies,
        games, bonuses, tournaments, paymentProviders, licenses
      } = casino;
    // Verificar y manejar arrays no iterables
    if (!Array.isArray(bannedCountries)) {
      console.error('Expected bannedCountries to be an array, but got:', bannedCountries);
      continue;
    }

    if (!Array.isArray(country)) {
      console.error('Expected country to be an array, but got:', country);
      continue;
    }

    if (!Array.isArray(languages)) {
      console.error('Expected languages to be an array, but got:', languages);
      continue;
    }

    if (!Array.isArray(currencies)) {
      console.error('Expected currencies to be an array, but got:', currencies);
      continue;
    }

    if (!Array.isArray(games)) {
      console.error('Expected games to be an array, but got:', games);
      continue;
    }

    if (!Array.isArray(bonuses)) {
      console.error('Expected bonuses to be an array, but got:', bonuses);
      continue;
    }

    if (!Array.isArray(tournaments)) {
      console.error('Expected tournaments to be an array, but got:', tournaments);
      continue;
    }

    if (!Array.isArray(paymentProviders)) {
      console.error('Expected paymentProviders to be an array, but got:', paymentProviders);
      continue;
    }

    if (!Array.isArray(licenses)) {
      console.error('Expected licenses to be an array, but got:', licenses);
      continue;
    }

    // Insertar datos del casino
    const casinoQuery = `INSERT INTO Casino 
      (casinoName, dateFounded, address, casinoOwner, dateLaunched, casinoUrl, phoneSupport, supportEmail, helpCentre, ageLimit, bannedCountries, liveChat, eSportsBetting, cryptoCurrenciesSupported, country, languages, currencies) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    const [casinoResult] = await db.queryAsync(casinoQuery, [
      casinoName,
      dateFounded,
      address,
      casinoOwner,
      dateLaunched,
      casinoUrl,
      phoneSupport,
      supportEmail,
      helpCentre,
      ageLimit,
      JSON.stringify(bannedCountries),
      liveChat,
      eSportsBetting,
      cryptoCurrenciesSupported,
      JSON.stringify(country),
      JSON.stringify(languages),
      JSON.stringify(currencies)
    ]);

    const casinoId = casinoResult.insertId;

    // Llamar a las funciones de ayuda para manejar datos de casino
    await handleCountry(db, country, casinoId, casinoName);
    await handleLanguages(db, languages, casinoId);
    await handleCurrencies(db, currencies, casinoId);
    await handleGames(db, games, casinoId);
    await handleBonuses(db, bonuses, casinoId);
    await handleTournaments(db, tournaments, casinoId);
    await handlePaymentProviders(db, paymentProviders, casinoId);
    await handleLicenses(db, licenses, casinoId);
  }

  res.status(201).send('CSV data processed successfully.');
} catch (error) {
  console.error('Error processing CSV data:', error);
  res.status(500).send('Error processing CSV data.');
}
});

// Helper functions to handle different data types

async function handleCountry(db, country, casinoId, casinoName) {
if (!Array.isArray(country)) {
  console.error('Expected country to be an array, but got:', country);
  return;
}

const countryQ = `INSERT INTO Country (countryName, countryCode) VALUES (?, ?)`;
await db.queryAsync(countryQ, [country.label, country.value]);

const countryQuery = `SELECT countryId FROM Country WHERE countryName = ? AND countryCode = ?`;
const [countryResult] = await db.queryAsync(countryQuery, [country.label, country.value]);

if (countryResult.length > 0) {
  const countryId = countryResult[0].countryId;
  const casinoCountryQuery = `INSERT INTO CasinoCountry (casinoId, countryId, casinoName, countryName) VALUES (?, ?, ?, ?)`;
  await db.queryAsync(casinoCountryQuery, [casinoId, countryId, casinoName, country.value]);
}
}

async function handleLanguages(db, languages, casinoId) {
if (!Array.isArray(languages)) {
  console.error('Expected languages to be an array, but got:', languages);
  return;
}

for (const language of languages) {
  const languageQ = `INSERT INTO Language (languageName) VALUES (?)`;
  await db.queryAsync(languageQ, [language.value]);

  const languageSearch = `SELECT languageId FROM Language WHERE languageName = ?`;
  const [languageResult] = await db.queryAsync(languageSearch, [language.value]);

  if (languageResult.length > 0) {
    const languageId = languageResult[0].languageId;
    const languageQuery = `INSERT INTO CasinoLanguage (casinoId, languageId) VALUES (?, ?)`;
    await db.queryAsync(languageQuery, [casinoId, languageId]);
  }
}
}

async function handleCurrencies(db, currencies, casinoId) {
if (!Array.isArray(currencies)) {
  console.error('Expected currencies to be an array, but got:', currencies);
  return;
}

for (const currency of currencies) {
  const currQ = `INSERT INTO Currency (currencyCode) VALUES (?)`;
  await db.queryAsync(currQ, [currency.value]);

  const currencySearch = `SELECT currencyId FROM Currency WHERE currencyCode = ?`;
  const [currencyResult] = await db.queryAsync(currencySearch, [currency.value]);

  if (currencyResult.length > 0) {
    const currencyId = currencyResult[0].currencyId;
    const currencyQuery = `INSERT INTO CasinoCurrency (casinoId, currencyId) VALUES (?, ?)`;
    await db.queryAsync(currencyQuery, [casinoId, currencyId]);
  }
}
}

async function handleGames(db, games, casinoId) {
if (!Array.isArray(games)) {
  console.error('Expected games to be an array, but got:', games);
  return;
}

for (const game of games) {
  const prevQueryGameProvider = `SELECT providerId FROM GameProvider WHERE gameProviderName = ?`;
  const [providerResult] = await db.queryAsync(prevQueryGameProvider, [game.gameProviderId.value]);

  let providerId;

  if (providerResult.length <= 0) {
    const gameProviderQ = `INSERT INTO GameProvider (gameProviderName) VALUES (?)`;
    const [insertResult] = await db.queryAsync(gameProviderQ, [game.gameProviderId.value]);
    providerId = insertResult.insertId;
  } else {
    providerId = providerResult[0].providerId;
  }

  const gameQ = `INSERT INTO Game (gameName, gameDescription, gameProviderId) VALUES (?, ?, ?)`;
  const [gameResult] = await db.queryAsync(gameQ, [game.gameName, game.gameDescription.value, providerId]);
  const gameId = gameResult.insertId;

  const casinoGameQuery = `INSERT INTO CasinoGame (casinoId, gameId) VALUES (?, ?)`;
  await db.queryAsync(casinoGameQuery, [casinoId, gameId]);
}
}

async function handleBonuses(db, bonuses, casinoId) {
if (!Array.isArray(bonuses)) {
  console.error('Expected bonuses to be an array, but got:', bonuses);
  return;
}

for (const bonus of bonuses) {
  const prevQueryBonusType = `SELECT bonusTypeId FROM BonusType WHERE bonusTypeName = ?`;
  const [bonusTypeResult] = await db.queryAsync(prevQueryBonusType, [bonus.bonusTypeId.value]);

  let bonusTypeId;

  if (bonusTypeResult.length <= 0) {
    const bonusTypeQ = `INSERT INTO BonusType (bonusTypeName) VALUES (?)`;
    const [insertResult] = await db.queryAsync(bonusTypeQ, [bonus.bonusTypeId.value]);
    bonusTypeId = insertResult.insertId;
  } else {
    bonusTypeId = bonusTypeResult[0].bonusTypeId;
  }

  const bonusQ = `INSERT INTO Bonus (bonusTypeId, bonusAmount, bonusWE, sticky, bonusText, bonusTerms) VALUES (?, ?, ?, ?, ?, ?)`;
  const [bonusResult] = await db.queryAsync(bonusQ, [bonusTypeId, bonus.bonusAmount, bonus.bonusWE, bonus.sticky, bonus.bonusText, bonus.bonusTerms]);
  const bonusId = bonusResult.insertId;

  const casinoBonusQuery = `INSERT INTO CasinoBonus (casinoId, bonusId) VALUES (?, ?)`;
  await db.queryAsync(casinoBonusQuery, [casinoId, bonusId]);
}
}

async function handleTournaments(db, tournaments, casinoId) {
if (!Array.isArray(tournaments)) {
  console.error('Expected tournaments to be an array, but got:', tournaments);
  return;
}

for (const tournament of tournaments) {
  const prevQueryTournamentType = `SELECT tournamentTypeId FROM TournamentType WHERE tournamentTypeName = ?`;
  const [tournamentTypeResult] = await db.queryAsync(prevQueryTournamentType, [tournament.tournamentTypeId.value]);

  let tournamentTypeId;

  if (tournamentTypeResult.length <= 0) {
    const tournamentTypeQ = `INSERT INTO TournamentType (tournamentTypeName) VALUES (?)`;
    const [insertResult] = await db.queryAsync(tournamentTypeQ, [tournament.tournamentTypeId.value]);
    tournamentTypeId = insertResult.insertId;
  } else {
    tournamentTypeId = tournamentTypeResult[0].tournamentTypeId;
  }

  const tournamentQ = `INSERT INTO Tournament (tournamentTypeId, tournamentName, tournamentDescription, tournamentPrize) VALUES (?, ?, ?, ?)`;
  const [tournamentResult] = await db.queryAsync(tournamentQ, [tournamentTypeId, tournament.tournamentName, tournament.tournamentDescription, tournament.tournamentPrize]);
  const tournamentId = tournamentResult.insertId;

  const casinoTournamentQuery = `INSERT INTO CasinoTournament (casinoId, tournamentId) VALUES (?, ?)`;
  await db.queryAsync(casinoTournamentQuery, [casinoId, tournamentId]);
}
}

async function handlePaymentProviders(db, paymentProviders, casinoId) {
if (!Array.isArray(paymentProviders)) {
  console.error('Expected paymentProviders to be an array, but got:', paymentProviders);
  return;
}

for (const payment of paymentProviders) {
  const prevQueryPayment = `SELECT providerId FROM PaymentProvider WHERE providerName = ?`;
  const [paymentResult] = await db.queryAsync(prevQueryPayment, [payment.providerName.value]);

  let providerId;

  if (paymentResult.length <= 0) {
    const paymentProviderQ = `INSERT INTO PaymentProvider (providerName) VALUES (?)`;
    const [insertResult] = await db.queryAsync(paymentProviderQ, [payment.providerName.value]);
    providerId = insertResult.insertId;
  } else {
    providerId = paymentResult[0].providerId;
  }

  const paymentQ = `INSERT INTO CasinoPaymentProvider (casinoId, providerId, minDeposit, maxWithdrawal) VALUES (?, ?, ?, ?)`;
  await db.queryAsync(paymentQ, [casinoId, providerId, payment.minDeposit, payment.maxWithdrawal]);
}
}

async function handleLicenses(db, licenses, casinoId) {
if (!Array.isArray(licenses)) {
  console.error('Expected licenses to be an array, but got:', licenses);
  return;
}

for (const license of licenses) {
  const prevQueryLicense = `SELECT licenseId FROM License WHERE licenseName = ?`;
  const [licenseResult] = await db.queryAsync(prevQueryLicense, [license.value]);

  let licenseId;

  if (licenseResult.length <= 0) {
    const licenseQ = `INSERT INTO License (licenseName) VALUES (?)`;
    const [insertResult] = await db.queryAsync(licenseQ, [license.value]);
    licenseId = insertResult.insertId;
  } else {
    licenseId = licenseResult[0].licenseId;
  }

  const licenseQ = `INSERT INTO CasinoLicense (casinoId, licenseId) VALUES (?, ?)`;
  await db.queryAsync(licenseQ, [casinoId, licenseId]);
}
}

// Iniciar el servidor
app.listen(5000, () => {
console.log('Server running on port 5000');
});