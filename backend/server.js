const express = require('express');
const multer = require('multer');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const app = express();
const cors = require('cors');
const port = 5000;

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
      casinoOwner,
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
      bonuses.forEach(bonus => {
        const bonusQuery = `INSERT INTO Bonus (bonusTypeId, bonusAmount, bonusWE, sticky, bonusText, bonusTerms) VALUES (?, ?, ?, ?, ?, ?)`;
        db.query(bonusQuery, [bonus.bonusTypeId.value, bonus.bonusAmount, bonus.bonusWE, bonus.sticky, bonus.bonusText, bonus.bonusTerms], (err, result) => {
          if (err) {
            console.error('Error inserting bonus data:', err);
            return;
          }
          const bonusId = result.insertId;
          const casinoBonusQuery = `INSERT INTO CasinoBonus (casinoId, bonusId) VALUES (?, ?)`;
          db.query(casinoBonusQuery, [casinoId, bonusId], (err) => {
            if (err) console.error('Error inserting casino-bonus relationship:', err);
          });
        });
      });
 
bonuses.forEach(bonus => { 
  // Primero, verifica si el proveedor del juego existe
  const prevQueryBonusType = `SELECT bonusTypeId FROM BonusType WHERE bonusTypeName = ?`;
  db.query(prevQueryBonusType, [bonus.bonusTypeId.value], (err, result) => {
    if (err) {
      console.error('Error retrieving game provider data:', err);
      return;
    }

    let bonusTypeId;

    if (result.length <= 0) {
      // Si el proveedor no existe, insértalo
      const bonusTypeQ = `INSERT INTO BonusType (bonusTypeName) VALUES (?)`;
      db.query(bonusTypeQ, [bonus.bonusTypeId.value], (err, insertResult) => {
        if (err) {
          console.error('Error inserting game provider data:', err);
          return;
        }
        bonusTypeId = insertResult.insertId;
        const bonusQ = `INSERT INTO Bonus (gameName, gameDescription, gameProviderId) VALUES (?, ?, ?)`;
        db.query(bonusQ, [bonus.gameName, game.gameDescription.value, providerId], (err, insertResult) => {
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










      // Insertar relación con torneos
      tournaments.forEach(tournament => {
        const tournamentQuery = `INSERT INTO Tournament (tournamentTypeId, tournamentDescription, totalFS, totalPrizePool, casinoId) VALUES (?, ?, ?, ?, ?)`;
        db.query(tournamentQuery, [tournament.tournamentTypeId.value, tournament.tournamentDescription, tournament.totalFS, tournament.totalPrizePool, casinoId], (err) => {
          if (err) console.error('Error inserting tournament data:', err);
        });
      });

      // Insertar relación con proveedores de pago
      paymentProviders.forEach(provider => {
        const providerQuery = `SELECT providerId FROM PaymentProvider WHERE paymentProviderName = ?`;
        db.query(providerQuery, [provider.value], (err, result) => {
          if (err) {
            console.error('Error retrieving payment provider data:', err);
            return;
          }
          if (result.length > 0) {
            const providerId = result[0].providerId;
            const casinoProviderQuery = `INSERT INTO CasinoPaymentProvider (casinoId, providerId) VALUES (?, ?)`;
            db.query(casinoProviderQuery, [casinoId, providerId], (err) => {
              if (err) console.error('Error inserting casino-payment provider relationship:', err);
            });
          }
        });
      });

      // Insertar relación con licencias
      licenses.forEach(license => {
        const licenseQuery = `INSERT INTO CasinoLicense (casinoId, licenseId) VALUES (?, ?)`;
        db.query(licenseQuery, [casinoId, license.value], (err) => {
          if (err) console.error('Error inserting casino-license relationship:', err);
        });
      });

      res.status(201).send('Casino created successfully.');
    }
  );
});


//NOT WORKING RIGHT NOW 
/**
 * // Ruta para manejar la creación de casinos desde un archivo CSV
app.post('/api/uploadcsv', upload.single('file'), (req, res) => {
  const results = [];
  const fileBuffer = req.file.buffer;

  fs.createReadStream(fileBuffer)
    .pipe(csvParser())
    .on('data', (row) => {
      results.push(row);
    })
    .on('end', () => {
      results.forEach(casino => {
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
        } = casino;

        // Validar y parsear JSON strings a arrays u objetos
        let parsedBannedCountries = [];
        let parsedCountry = null;
        let parsedLanguages = [];
        let parsedCurrencies = [];
        let parsedGames = [];
        let parsedBonuses = [];
        let parsedTournaments = [];
        let parsedPaymentProviders = [];
        let parsedLicenses = [];

        try {
          if (bannedCountries) parsedBannedCountries = JSON.parse(bannedCountries);
          if (country) parsedCountry = JSON.parse(country);
          if (languages) parsedLanguages = JSON.parse(languages);
          if (currencies) parsedCurrencies = JSON.parse(currencies);
          if (games) parsedGames = JSON.parse(games);
          if (bonuses) parsedBonuses = JSON.parse(bonuses);
          if (tournaments) parsedTournaments = JSON.parse(tournaments);
          if (paymentProviders) parsedPaymentProviders = JSON.parse(paymentProviders);
          if (licenses) parsedLicenses = JSON.parse(licenses);
        } catch (error) {
          console.error('Error parsing JSON data:', error);
          return res.status(400).send('Invalid JSON data in CSV file.');
        }

        // Insertar datos del casino en la base de datos
        const casinoQuery = `INSERT INTO Casino 
          (casinoName, dateFounded, address, casinoOwner, dateLaunched, casinoUrl, phoneSupport, supportEmail, helpCentre, ageLimit, bannedCountries, liveChat, eSportBetting, cryptoCurrenciesSupported, country) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        db.query(
          casinoQuery,
          [
            casinoName, dateFounded, address, casinoOwner, dateLaunched, casinoUrl, phoneSupport, supportEmail, helpCentre, ageLimit,
            JSON.stringify(parsedBannedCountries), liveChat, eSportsBetting, cryptoCurrenciesSupported, parsedCountry ? parsedCountry.value : null
          ],
          (err, result) => {
            if (err) {
              console.error('Error inserting casino data:', err);
              return;
            }

            const casinoId = result.insertId;

            // Insertar relación con idiomas
            parsedLanguages.forEach(language => {
              const languageQuery = `INSERT INTO CasinoLanguage (casinoId, languageId) VALUES (?, ?)`;
              db.query(languageQuery, [casinoId, language.value], (err) => {
                if (err) console.error('Error inserting language data:', err);
              });
            });

            // Insertar relación con monedas
            parsedCurrencies.forEach(currency => {
              const currencyQuery = `INSERT INTO CasinoCurrency (casinoId, currencyId) VALUES (?, ?)`;
              db.query(currencyQuery, [casinoId, currency.value], (err) => {
                if (err) console.error('Error inserting currency data:', err);
              });
            });

            // Insertar relación con juegos
            parsedGames.forEach(game => {
              const gameQuery = `INSERT INTO Game (gameName, gameDescription, gameProviderId) VALUES (?, ?, ?)`;
              db.query(gameQuery, [game.gameName, game.gameDescription.value, game.gameProviderId.value], (err, result) => {
                if (err) {
                  console.error('Error inserting game data:', err);
                  return;
                }
                const gameId = result.insertId;
                const casinoGameQuery = `INSERT INTO CasinoGame (casinoId, gameId) VALUES (?, ?)`;
                db.query(casinoGameQuery, [casinoId, gameId], (err) => {
                  if (err) console.error('Error inserting casino-game relationship:', err);
                });
              });
            });

            // Insertar relación con bonos
            parsedBonuses.forEach(bonus => {
              const bonusQuery = `INSERT INTO Bonus (bonusTypeId, bonusAmount, bonusWE, sticky, bonusText, bonusTerms) VALUES (?, ?, ?, ?, ?, ?)`;
              db.query(bonusQuery, [bonus.bonusTypeId.value, bonus.bonusAmount, bonus.bonusWE, bonus.sticky, bonus.bonusText, bonus.bonusTerms], (err, result) => {
                if (err) {
                  console.error('Error inserting bonus data:', err);
                  return;
                }
                const bonusId = result.insertId;
                const casinoBonusQuery = `INSERT INTO CasinoBonus (casinoId, bonusId) VALUES (?, ?)`;
                db.query(casinoBonusQuery, [casinoId, bonusId], (err) => {
                  if (err) console.error('Error inserting casino-bonus relationship:', err);
                });
              });
            });

            // Insertar relación con torneos
            parsedTournaments.forEach(tournament => {
              const tournamentQuery = `INSERT INTO Tournament (tournamentTypeId, tournamentDescription, totalFS, totalPrizePool, casinoId) VALUES (?, ?, ?, ?, ?)`;
              db.query(tournamentQuery, [tournament.tournamentTypeId.value, tournament.tournamentDescription, tournament.totalFS, tournament.totalPrizePool, casinoId], (err) => {
                if (err) console.error('Error inserting tournament data:', err);
              });
            });

            // Insertar relación con proveedores de pago
            parsedPaymentProviders.forEach(provider => {
              const providerQuery = `SELECT providerId FROM PaymentProvider WHERE paymentProviderName = ?`;
              db.query(providerQuery, [provider.value], (err, result) => {
                if (err) {
                  console.error('Error retrieving payment provider data:', err);
                  return;
                }
                if (result.length > 0) {
                  const providerId = result[0].providerId;
                  const casinoProviderQuery = `INSERT INTO CasinoPaymentProvider (casinoId, providerId) VALUES (?, ?)`;
                  db.query(casinoProviderQuery, [casinoId, providerId], (err) => {
                    if (err) console.error('Error inserting casino-payment provider relationship:', err);
                  });
                }
              });
            });

            // Insertar relación con licencias
            parsedLicenses.forEach(license => {
              const licenseQuery = `INSERT INTO CasinoLicense (casinoId, licenseId) VALUES (?, ?)`;
              db.query(licenseQuery, [casinoId, license.value], (err) => {
                if (err) console.error('Error inserting casino-license relationship:', err);
              });
            });
          }
        );
      });

      res.status(201).send('CSV data processed successfully.');
    });
});
 */

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
