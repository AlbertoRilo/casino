const express = require('express');
const multer = require('multer');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const app = express();
const cors = require('cors');
const port = 5000;
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
app.post('/api/uploadcsv', upload.single('file'), (req, res) => {
  const results = [];
  const fileBuffer = req.file.buffer;

  // Usar el buffer directamente con csv-parser
  require('streamifier').createReadStream(fileBuffer)
    .pipe(csv())
    .on('data', (row) => {
      results.push(row);
    })
    .on('end', () => {
      // Procesar los datos del CSV
      results.forEach(casino => {
        // Desempaquetar y procesar cada campo
        const {
          casinoName, dateFounded, address, casinoOwner, dateLaunched, casinoUrl,
          phoneSupport, supportEmail, helpCentre, ageLimit, liveChat, eSportsBetting,
          cryptoCurrenciesSupported, bannedCountries, country, languages, currencies,
          games, bonuses, tournaments, paymentProviders, licenses
        } = casino;

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
        //languages 
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

  //monedas
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
            // Insertar relaciones con juegos
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
          }
        );
      });

      res.status(201).send('CSV data processed successfully.');
    });
});




// Iniciar el servidor
app.listen(port, () => {
  console.log(`Server running `);
});
