// src/app/components/CasinoForm/CasinoForm.tsx
'use client'
import React, { useState } from 'react';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import axios from 'axios';
import Select, { MultiValue } from 'react-select';
import GameForm from './GameForm';
import BonusForm from './BonusForm';
import TournamentForm from './TournamentForm';
import PaymentProviderForm from './PaymentProviderForm';
import LicenseForm from './LicenseForm';

interface CasinoFormProps {
  onSubmit: (formData: CasinoFormInputs) => void;
}

interface CasinoFormInputs {
  casinoName: string;
  dateFounded: string;
  address: string;
  casinoOwner: { value: string; label: string } | null;
  dateLaunched: string;
  casinoUrl: string;
  phoneSupport: string;
  supportEmail: string;
  helpCentre: string;
  ageLimit: number;
  liveChat: boolean;
  eSportsBetting: boolean;
  timeOut: boolean;
  depositLimit: boolean;
  lossLimit:boolean;
  realityCheck:boolean;
  selfAssesmentCheck:boolean;
  selfExclusion:boolean;
  timeSessionLimit: boolean;
  wagerLimit: boolean;
  withdrawalLock: boolean;
  vpnAllowed : boolean;
  cryptoCurrenciesSupported: boolean;
  country: { value: string; label: string } | null;
  bannedCountries: { value: string; label: string }[];
  casinoCertifications: { value: string; label: string }[];
  languages: { value: string; label: string }[];
  currencies:{ value: string; label: string }[];
  games: GameFormInputs[];
  bonuses: BonusFormInputs[];
  tournaments: TournamentFormInputs[];
  paymentProviders: PaymentProviderFormInputs[];
  licenses: LicenseFormInputs[];
}

interface GameFormInputs {
  gameName: string;
  gameDescription: { value: string; label: string } | null;
  gameProviderId: { value: string; label: string } | null;
}

interface BonusFormInputs {
  bonusTypeId: { value: string; label: string } | null;
  bonusAmount: string;
  bonusWE: string;
  sticky: boolean;
  bonusText: string;
  bonusTerms: string;
}

interface TournamentFormInputs {
  tournamentTypeId: { value: string; label: string } | null;
  tournamentDescription: string;
  totalFS: number;
  totalPrizePool: number;
}

interface PaymentProviderFormInputs {
  paymentProviderName: { value: string; label: string }[];
}

interface LicenseFormInputs {
  licenseName: { value: string; label: string } | null;
}
//first version hardcoded but then fetch from DB 

const casinoCertificationsOptions = [
  { value: 'eCOGRA', label: 'eCOGRA' },
  { value: 'iTechLabs', label: 'iTech Labs' },
  { value: 'GLI', label: 'Gaming Laboratories International (GLI)' },
  { value: 'TST', label: 'Technical Systems Testing (TST)' },
  { value: 'SQS', label: 'Swiss Quality Testing Services (SQS)' },
  { value: 'BMM', label: 'BMM Testlabs' },
  { value: 'SIQ', label: 'SIQ' },
  { value: 'Quinel', label: 'Quinel' },
  { value: 'eGamingCuracao', label: 'eGaming Curacao' },
  { value: 'MGA', label: 'Malta Gaming Authority (MGA)' },
  { value: 'UKGC', label: 'UK Gambling Commission (UKGC)' },
  { value: 'AGCC', label: 'Alderney Gambling Control Commission (AGCC)' },
  { value: 'Kahnawake', label: 'Kahnawake Gaming Commission' },
  { value: 'Gibraltar', label: 'Gibraltar Gambling Commissioner' },
  { value: 'IsleOfMan', label: 'Isle of Man Gambling Supervision Commission' },
  { value: 'Spelinspektionen', label: 'Swedish Gambling Authority (Spelinspektionen)' },
  { value: 'DGOJ', label: 'Dirección General de Ordenación del Juego (DGOJ)' },
  { value: 'Arjel', label: 'Autorité de Régulation des Jeux En Ligne (ARJEL)' },
  { value: 'Pagcor', label: 'Philippine Amusement and Gaming Corporation (PAGCOR)' },
  { value: 'NZGC', label: 'New Zealand Gambling Commission (NZGC)' },
  { value: 'NMi', label: 'NMi Metrology & Gaming' },
  { value: 'EGL', label: 'Eclipse Gaming Labs (EGL)' },
  { value: 'Trisigma', label: 'Trisigma' },
  { value: 'RSG-Eclipse', label: 'RSG-Eclipse' },
  { value: 'ASGCC', label: 'Austria’s Gaming and Casino Commission (ASGCC)' },
  { value: 'HellenicGC', label: 'Hellenic Gaming Commission (HGC)' },
  { value: 'NAGRA', label: 'North American Gaming Regulators Association (NAGRA)' },
  { value: 'LotteriesCom', label: 'Lotteries and Gaming Authority of Malta (LGA)' },
  { value: 'ONJN', label: 'Romanian National Gambling Office (ONJN)' },
  { value: 'DanishGC', label: 'Danish Gambling Authority' },
  { value: 'FIFe', label: 'Fédération Internationale Féline (FIFe)' },
  { value: 'EASG', label: 'European Association for the Study of Gambling (EASG)' },
  { value: 'LVS', label: 'Las Vegas Sands Corp' },
  { value: 'MVS', label: 'Macao Gaming Standards' },
  { value: 'G4', label: 'Global Gambling Guidance Group (G4)' },
  { value: 'EGBA', label: 'European Gaming and Betting Association (EGBA)' },
  { value: 'IBAS', label: 'Independent Betting Adjudication Service (IBAS)' },
  { value: 'ADR', label: 'Alternative Dispute Resolution (ADR)' },
  { value: 'GREF', label: 'Gaming Regulators European Forum (GREF)' },
  { value: 'EAUI', label: 'European Alliance for UItimate Integrity (EAUI)' },
  { value: 'NCB', label: 'National Compliance Bureau (NCB)' },
  { value: 'RGCC', label: 'Responsible Gambling Council (RGC)' },
  { value: 'NCAGE', label: 'National Council on Problem Gambling (NCPG)' },
  { value: 'GamblingTherapy', label: 'Gambling Therapy' },
  { value: 'GamCare', label: 'GamCare' },
  { value: 'BeGambleAware', label: 'BeGambleAware' },
  { value: 'GamblersAnonymous', label: 'Gamblers Anonymous' },
  { value: 'SelfExclusion', label: 'Self-Exclusion Programs' },
  { value: 'FairGaming', label: 'Fair Gaming Advocate (FGA)' }
];

const currencyOptions = [
  { value: 'USD', label: 'US Dollar' },
  { value: 'EUR', label: 'Euro' },
  { value: 'ARS', label: 'Argentine Peso' },
  { value: 'BOB', label: 'Bolivian Boliviano' },
  { value: 'BRL', label: 'Brazilian Real' },
  { value: 'CLP', label: 'Chilean Peso' },
  { value: 'COP', label: 'Colombian Peso' },
  { value: 'CRC', label: 'Costa Rican Colón' },
  { value: 'CUP', label: 'Cuban Peso' },
  { value: 'DOP', label: 'Dominican Peso' },
  { value: 'GTQ', label: 'Guatemalan Quetzal' },
  { value: 'HNL', label: 'Honduran Lempira' },
  { value: 'MXN', label: 'Mexican Peso' },
  { value: 'NIO', label: 'Nicaraguan Córdoba' },
  { value: 'PAB', label: 'Panamanian Balboa' },
  { value: 'PYG', label: 'Paraguayan Guarani' },
  { value: 'PEN', label: 'Peruvian Sol' },
  { value: 'UYU', label: 'Uruguayan Peso' },
  { value: 'VEF', label: 'Venezuelan Bolívar' }
];


const tournamentType = [
  { value :'Daily', label: 'Daily'},
  { value :'Weekly', label: 'Weekly'},
  { value :'Monthly', label: 'Monthly'}
];

const bonusType = [
  { value :'No deposit bonus', label: ' No deposit bonus'},
  { value :'Reload bonus', label: 'Reload bonus'},
  { value :'Cashback bonus', label: 'Cashback bonus '},
  { value :'Welcome bonus', label: 'Welcome bonus'},
  { value :'1st Deposit bonus', label: 'Deposit bonus'},
  { value :'2nd Deposit bonus', label: '2nd Deposit bonus '},
  { value :'3rd Deposit bonus', label: '3rd Deposit bonus '},
  { value :'4th Deposit bonus', label: '4th Deposit bonus '},
  { value :'Free Spins bonus', label: 'Free spins bonus '},
  { value :'Sports betting bonus', label: 'Sports betting bonus '},
  { value :'Live casino bonus', label: 'Live casino bonus '},
  { value :'Referral bonus', label: 'Referral bonus '},
  { value :'Anniversary bonus', label: 'Anniversary bonus '},


];

const languageOptions = [
  { value: 'zh', label: 'Chinese' },
  { value: 'es', label: 'Spanish' },
  { value: 'en', label: 'English' },
  { value: 'hi', label: 'Hindi' },
  { value: 'ar', label: 'Arabic' },
  { value: 'bn', label: 'Bengali' },
  { value: 'pt', label: 'Portuguese' },
  { value: 'ru', label: 'Russian' },
  { value: 'ja', label: 'Japanese' },
  { value: 'de', label: 'German' },
  { value: 'it', label: 'Italian' }
];


const gameTypeOptions = [
  { value: 'Slots', label: 'Slots' },
  { value: 'Roulette', label: 'Roulette' },
  { value: 'BlackJack', label: 'BlackJack' },
  { value: 'Video poker', label: 'Video poker' },
  { value: 'Bingo', label: 'Bingo' },
  { value: 'Baccarat', label: 'Baccarat' },
  { value: 'Craps and dice', label: 'Craps and dice' },
  { value: 'Keno', label: 'Keno' },
  { value: 'Scratch cards', label: 'Scratch cards' },
  { value: 'Crash games', label: 'Crash games' }
];

const gameProviderOptions = [
  { value: 'NetEnt', label: 'NetEnt' },
  { value: 'Novomatic', label: 'Novomatic' },
  { value: 'Nolimit City', label: 'Nolimit City' },
  { value: 'MicroGaming', label: 'MicroGaming' },
  { value: 'PlayTech', label: 'PlayTech' },
  { value: 'Plan\'n GO', label: 'Plan\'n GO' },
  { value: 'Merkur Gaming', label: 'Merkur Gaming' },
  { value: 'Blueprint Gaming', label: 'Blueprint Gaming' },
  { value: 'IGT', label: 'IGT' },
  { value: 'Pragmatic Play', label: 'Pragmatic Play' },
  { value: 'QuickSpin', label: 'QuickSpin' },
  { value: 'Yggdrasil Gaming', label: 'Yggdrasil Gaming' },
  { value: 'Realtime Gaming', label: 'Realtime Gaming' },
  { value: 'Igrosoft', label: 'Igrosoft' },
  { value: 'Thunderkick', label: 'Thunderkick' },
  { value: 'Nektan', label: 'Nektan' },
  { value: 'Red Tiger Gaming', label: 'Red Tiger Gaming' },
  { value: 'Betsoft Gaming', label: 'Betsoft Gaming' },
  { value: 'Rival', label: 'Rival' },
  { value: 'Big Time Gaming', label: 'Big Time Gaming' },
  { value: 'WMS', label: 'WMS' },
  { value: 'Scientific Games', label: 'Scientific Games' },
  { value: 'Playson', label: 'Playson' },
  { value: 'Amaya', label: 'Amaya' },
  { value: 'iSoftBet', label: 'iSoftBet' },
  { value: 'Nextgen Gaming', label: 'Nextgen Gaming' },
  { value: 'Amatic', label: 'Amatic' },
  { value: 'ELK Studios', label: 'ELK Studios' },
  { value: 'Evoplay', label: 'Evoplay' },
  { value: 'Push Gaming', label: 'Push Gaming' },
  { value: 'EyeCon', label: 'EyeCon' },
  { value: 'Saucify', label: 'Saucify' },
  { value: 'SA Gaming', label: 'SA Gaming' },
  { value: 'BCGaming', label: 'BCGaming' },
  { value: 'GameArt', label: 'GameArt' },
  { value: 'Endorphina', label: 'Endorphina' },
  { value: 'Bally', label: 'Bally' },
  { value: 'Barcrest', label: 'Barcrest' },
  { value: 'Wazdan', label: 'Wazdan' },
  { value: 'PariPlay', label: 'PariPlay' },
  { value: 'Habanero', label: 'Habanero' },
  { value: 'Lightning Box', label: 'Lightning Box' },
  { value: 'Red Rake Gaming', label: 'Red Rake Gaming' },
  { value: 'Leander Games', label: 'Leander Games' },
  { value: 'Spinomenal', label: 'Spinomenal' },
  { value: 'Rabcat', label: 'Rabcat' },
  { value: '1 X 2 Gaming', label: '1 X 2 Gaming' },
  { value: 'Booming Games', label: 'Booming Games' },
  { value: 'Tom Horn', label: 'Tom Horn' },
  { value: '2By2 Gaming', label: '2By2 Gaming' },
  { value: 'Iron Dog Studio', label: 'Iron Dog Studio' },
  { value: 'Realistic Games', label: 'Realistic Games' },
  { value: 'High 5 Games', label: 'High 5 Games' },
  { value: 'Genesis Gaming', label: 'Genesis Gaming' },
  { value: 'Ash Gaming', label: 'Ash Gaming' },
  { value: 'NeoGames', label: 'NeoGames' },
  { value: 'Belatra', label: 'Belatra' },
  { value: 'Boongo', label: 'Boongo' },
  { value: 'MrSlotty', label: 'MrSlotty' },
  { value: 'Relax Gaming', label: 'Relax Gaming' },
  { value: 'edict', label: 'edict' },
  { value: 'MultiSlot', label: 'MultiSlot' },
  { value: 'Gaming1', label: 'Gaming1' },
  { value: 'Ainsworth', label: 'Ainsworth' },
  { value: 'Arrow\'s Edge', label: 'Arrow\'s Edge' },
  { value: 'Genii', label: 'Genii' },
  { value: 'GreenTube', label: 'GreenTube' },
  { value: 'TOPTrend Gaming', label: 'TOPTrend Gaming' }
];

const casinoOwnersOptions = [
  { value: 'MGM', label: 'MGM Resorts International' },
  { value: 'Caesars', label: 'Caesars Entertainment' },
  { value: 'LasVegasSands', label: 'Las Vegas Sands' },
  { value: 'Wynn', label: 'Wynn Resorts' },
  { value: 'Melco', label: 'Melco Resorts & Entertainment' },
  { value: 'Genting', label: 'Genting Group' },
  { value: 'Galaxy', label: 'Galaxy Entertainment Group' },
  { value: 'HardRock', label: 'Hard Rock International' },
  { value: 'Boyd', label: 'Boyd Gaming' },
  { value: 'PennNational', label: 'Penn National Gaming' },
  { value: 'Crown', label: 'Crown Resorts' },
  { value: 'SJM', label: 'SJM Holdings' },
  { value: 'Mohegan', label: 'Mohegan Gaming & Entertainment' },
  { value: 'ResortsWorld', label: 'Resorts World' },
  { value: 'RedRock', label: 'Red Rock Resorts' },
  { value: 'Sun', label: 'Sun International' },
  { value: 'GoldenEntertainment', label: 'Golden Entertainment' },
  { value: 'Pechanga', label: 'Pechanga Resort & Casino' },
  { value: 'Foxwoods', label: 'Foxwoods Resort Casino' },
  { value: 'Seminole', label: 'Seminole Gaming' },
  { value: 'StationCasinos', label: 'Station Casinos' },
  { value: 'PaddyPower', label: 'Paddy Power' },
  { value: 'WilliamHill', label: 'William Hill' },
  { value: 'Flutter', label: 'Flutter Entertainment' },
  { value: 'Grosvenor', label: 'Grosvenor Casinos' },
  { value: 'RankGroup', label: 'Rank Group' },
  { value: 'Bet365', label: 'Bet365' },
  { value: 'Pala', label: 'Pala Casino Resort and Spa' },
  { value: 'CacheCreek', label: 'Cache Creek Casino Resort' },
  { value: 'SanManuel', label: 'San Manuel Casino' },
  { value: 'Viejas', label: 'Viejas Casino & Resort' },
  { value: 'TurningStone', label: 'Turning Stone Resort Casino' },
  { value: 'Eldorado', label: 'Eldorado Resorts' },
  { value: 'ImperialPacific', label: 'Imperial Pacific International' },
  { value: 'Chukchansi', label: 'Chukchansi Gold Resort & Casino' },
  { value: 'Choctaw', label: 'Choctaw Casinos & Resorts' },
  { value: 'Harrah', label: 'Harrah\'s Entertainment' },
  { value: 'GoldenNugget', label: 'Golden Nugget' },
  { value: 'Aliante', label: 'Aliante Casino + Hotel + Spa' },
  { value: 'Cannery', label: 'Cannery Casino and Hotel' },
  { value: 'CircusCircus', label: 'Circus Circus Las Vegas' },
  { value: 'Flamingo', label: 'Flamingo Las Vegas' },
  { value: 'Luxor', label: 'Luxor Hotel and Casino' },
  { value: 'MandalayBay', label: 'Mandalay Bay Resort and Casino' },
  { value: 'Mirage', label: 'The Mirage' },
  { value: 'MonteCarlo', label: 'Monte Carlo Resort and Casino' },
  { value: 'Excalibur', label: 'Excalibur Hotel and Casino' },
  { value: 'TreasureIsland', label: 'Treasure Island Hotel and Casino' },
  { value: 'TheVenetian', label: 'The Venetian Las Vegas' },
  { value: 'Palazzo', label: 'The Palazzo' }
];

const licensingAuthorities = [
  { value: 'MGA', label: 'Malta(MGA)' },
  { value: 'AGCC', label: 'Alderney(AGCC)' },
  { value: 'IOMGSC', label: 'Isle of Man(IOMGSC)' },
  { value: 'GLA', label: 'Gibraltar(GLA)' },
  { value: 'JGC', label: 'Jersey(GLA)' },
  { value: 'KGC', label: 'Kahnawake(KGC)' },
  { value: 'JCJ', label: 'Panama(JCG)' },
  { value: 'GCB', label: 'Curacao(GCB)' },
  { value: '', label: 'Costa Rica' },
  { value: 'UKGC', label: 'United Kingdom(UKGC)' },
  { value: 'BMF', label: 'Austria(BMF)' },
  { value: '', label: 'Canada' },
  { value: '', label: 'South Africa' },
  { value: '', label: 'Argentina' },
  { value: 'AMMF', label: 'Armenia' },
  { value: '', label: 'Belarus' },
  { value: 'KSC', label: 'Belgium(KSC)' },
  { value: '', label: 'Benin' },
  { value: '', label: 'Bosnia' },
  { value: 'NRA', label: 'Bulgaria(NRA)' },
  { value: '', label: 'Chile' },
  { value: 'COLJ', label: 'Colombia(COLJ)'},
  { value: '', label: 'Estonia' },
  { value: 'KSA', label: 'Netherlands(KSA)' },
  { value: '', label: 'Peru' },
  { value: 'PAGCOR', label: 'Philippines(PAGCOR)' },
  { value: 'RSGA', label: 'Serbia(RSGA)' },
  { value: 'DGOJ', label: 'Spain(DGOJ)' },
  { value: 'SGA', label: 'Sweden(SGA)' },
  { value: '', label: 'Venezuela' },
  { value: 'iGO', label: 'Ontario(iGO)' },
  { value: 'CEG', label: 'Curacao(CEG)' },
  { value: 'CIL', label: 'Curacao(CIL)' },
  { value: 'GC', label: 'Curacao(GC)' }
];

const bannedCountryOptions = [
  { value: 'AF', label: 'Afghanistan' },
  { value: 'AL', label: 'Albania' },
  { value: 'DZ', label: 'Algeria' },
  { value: 'AD', label: 'Andorra' },
  { value: 'AO', label: 'Angola' },
  { value: 'AG', label: 'Antigua and Barbuda' },
  { value: 'AR', label: 'Argentina' },
  { value: 'AM', label: 'Armenia' },
  { value: 'AU', label: 'Australia' },
  { value: 'AT', label: 'Austria' },
  { value: 'AZ', label: 'Azerbaijan' },
  { value: 'BS', label: 'Bahamas' },
  { value: 'BH', label: 'Bahrain' },
  { value: 'BD', label: 'Bangladesh' },
  { value: 'BB', label: 'Barbados' },
  { value: 'BY', label: 'Belarus' },
  { value: 'BE', label: 'Belgium' },
  { value: 'BZ', label: 'Belize' },
  { value: 'BJ', label: 'Benin' },
  { value: 'BT', label: 'Bhutan' },
  { value: 'BO', label: 'Bolivia' },
  { value: 'BA', label: 'Bosnia and Herzegovina' },
  { value: 'BW', label: 'Botswana' },
  { value: 'BR', label: 'Brazil' },
  { value: 'BN', label: 'Brunei' },
  { value: 'BG', label: 'Bulgaria' },
  { value: 'BF', label: 'Burkina Faso' },
  { value: 'BI', label: 'Burundi' },
  { value: 'CV', label: 'Cabo Verde' },
  { value: 'KH', label: 'Cambodia' },
  { value: 'CM', label: 'Cameroon' },
  { value: 'CA', label: 'Canada' },
  { value: 'CF', label: 'Central African Republic' },
  { value: 'TD', label: 'Chad' },
  { value: 'CL', label: 'Chile' },
  { value: 'CN', label: 'China' },
  { value: 'CO', label: 'Colombia' },
  { value: 'KM', label: 'Comoros' },
  { value: 'CD', label: 'Congo (Congo-Brazzaville)' },
  { value: 'CG', label: 'Congo (DRC)' },
  { value: 'CR', label: 'Costa Rica' },
  { value: 'CI', label: 'Côte d’Ivoire' },
  { value: 'HR', label: 'Croatia' },
  { value: 'CU', label: 'Cuba' },
  { value: 'CY', label: 'Cyprus' },
  { value: 'CZ', label: 'Czechia (Czech Republic)' },
  { value: 'DK', label: 'Denmark' },
  { value: 'DJ', label: 'Djibouti' },
  { value: 'DM', label: 'Dominica' },
  { value: 'DO', label: 'Dominican Republic' },
  { value: 'EC', label: 'Ecuador' },
  { value: 'EG', label: 'Egypt' },
  { value: 'SV', label: 'El Salvador' },
  { value: 'GQ', label: 'Equatorial Guinea' },
  { value: 'ER', label: 'Eritrea' },
  { value: 'EE', label: 'Estonia' },
  { value: 'SZ', label: 'Eswatini' },
  { value: 'ET', label: 'Ethiopia' },
  { value: 'FJ', label: 'Fiji' },
  { value: 'FI', label: 'Finland' },
  { value: 'FR', label: 'France' },
  { value: 'GA', label: 'Gabon' },
  { value: 'GM', label: 'Gambia' },
  { value: 'GE', label: 'Georgia' },
  { value: 'DE', label: 'Germany' },
  { value: 'GH', label: 'Ghana' },
  { value: 'GR', label: 'Greece' },
  { value: 'GD', label: 'Grenada' },
  { value: 'GT', label: 'Guatemala' },
  { value: 'GN', label: 'Guinea' },
  { value: 'GW', label: 'Guinea-Bissau' },
  { value: 'GY', label: 'Guyana' },
  { value: 'HT', label: 'Haiti' },
  { value: 'HN', label: 'Honduras' },
  { value: 'HU', label: 'Hungary' },
  { value: 'IS', label: 'Iceland' },
  { value: 'IN', label: 'India' },
  { value: 'ID', label: 'Indonesia' },
  { value: 'IR', label: 'Iran' },
  { value: 'IQ', label: 'Iraq' },
  { value: 'IE', label: 'Ireland' },
  { value: 'IL', label: 'Israel' },
  { value: 'IT', label: 'Italy' },
  { value: 'JM', label: 'Jamaica' },
  { value: 'JP', label: 'Japan' },
  { value: 'JO', label: 'Jordan' },
  { value: 'KZ', label: 'Kazakhstan' },
  { value: 'KE', label: 'Kenya' },
  { value: 'KI', label: 'Kiribati' },
  { value: 'KW', label: 'Kuwait' },
  { value: 'KG', label: 'Kyrgyzstan' },
  { value: 'LA', label: 'Laos' },
  { value: 'LV', label: 'Latvia' },
  { value: 'LB', label: 'Lebanon' },
  { value: 'LS', label: 'Lesotho' },
  { value: 'LR', label: 'Liberia' },
  { value: 'LY', label: 'Libya' },
  { value: 'LI', label: 'Liechtenstein' },
  { value: 'LT', label: 'Lithuania' },
  { value: 'LU', label: 'Luxembourg' },
  { value: 'MG', label: 'Madagascar' },
  { value: 'MW', label: 'Malawi' },
  { value: 'MY', label: 'Malaysia' },
  { value: 'MV', label: 'Maldives' },
  { value: 'ML', label: 'Mali' },
  { value: 'MT', label: 'Malta' },
  { value: 'MH', label: 'Marshall Islands' },
  { value: 'MR', label: 'Mauritania' },
  { value: 'MU', label: 'Mauritius' },
  { value: 'MX', label: 'Mexico' },
  { value: 'FM', label: 'Micronesia' },
  { value: 'MD', label: 'Moldova' },
  { value: 'MC', label: 'Monaco' },
  { value: 'MN', label: 'Mongolia' },
  { value: 'ME', label: 'Montenegro' },
  { value: 'MA', label: 'Morocco' },
  { value: 'MZ', label: 'Mozambique' },
  { value: 'MM', label: 'Myanmar (Burma)' },
  { value: 'NA', label: 'Namibia' },
  { value: 'NR', label: 'Nauru' },
  { value: 'NP', label: 'Nepal' },
  { value: 'NL', label: 'Netherlands' },
  { value: 'NZ', label: 'New Zealand' },
  { value: 'NI', label: 'Nicaragua' },
  { value: 'NE', label: 'Niger' },
  { value: 'NG', label: 'Nigeria' },
  { value: 'KP', label: 'North Korea' },
  { value: 'MK', label: 'North Macedonia' },
  { value: 'NO', label: 'Norway' },
  { value: 'OM', label: 'Oman' },
  { value: 'PK', label: 'Pakistan' },
  { value: 'PW', label: 'Palau' },
  { value: 'PA', label: 'Panama' },
  { value: 'PG', label: 'Papua New Guinea' },
  { value: 'PY', label: 'Paraguay' },
  { value: 'PE', label: 'Peru' },
  { value: 'PH', label: 'Philippines' },
  { value: 'PL', label: 'Poland' },
  { value: 'PT', label: 'Portugal' },
  { value: 'QA', label: 'Qatar' },
  { value: 'RO', label: 'Romania' },
  { value: 'RU', label: 'Russia' },
  { value: 'RW', label: 'Rwanda' },
  { value: 'KN', label: 'Saint Kitts and Nevis' },
  { value: 'LC', label: 'Saint Lucia' },
  { value: 'VC', label: 'Saint Vincent and the Grenadines' },
  { value: 'WS', label: 'Samoa' },
  { value: 'SM', label: 'San Marino' },
  { value: 'ST', label: 'Sao Tome and Principe' },
  { value: 'SA', label: 'Saudi Arabia' },
  { value: 'SN', label: 'Senegal' },
  { value: 'RS', label: 'Serbia' },
  { value: 'SC', label: 'Seychelles' },
  { value: 'SL', label: 'Sierra Leone' },
  { value: 'SG', label: 'Singapore' },
  { value: 'SK', label: 'Slovakia' },
  { value: 'SI', label: 'Slovenia' },
  { value: 'SB', label: 'Solomon Islands' },
  { value: 'SO', label: 'Somalia' },
  { value: 'ZA', label: 'South Africa' },
  { value: 'KR', label: 'South Korea' },
  { value: 'SS', label: 'South Sudan' },
  { value: 'ES', label: 'Spain' },
  { value: 'LK', label: 'Sri Lanka' },
  { value: 'SD', label: 'Sudan' },
  { value: 'SR', label: 'Suriname' },
  { value: 'SE', label: 'Sweden' },
  { value: 'CH', label: 'Switzerland' },
  { value: 'SY', label: 'Syria' },
  { value: 'TW', label: 'Taiwan' },
  { value: 'TJ', label: 'Tajikistan' },
  { value: 'TZ', label: 'Tanzania' },
  { value: 'TH', label: 'Thailand' },
  { value: 'TL', label: 'Timor-Leste' },
  { value: 'TG', label: 'Togo' },
  { value: 'TO', label: 'Tonga' },
  { value: 'TT', label: 'Trinidad and Tobago' },
  { value: 'TN', label: 'Tunisia' },
  { value: 'TR', label: 'Turkey' },
  { value: 'TM', label: 'Turkmenistan' },
  { value: 'TV', label: 'Tuvalu' },
  { value: 'UG', label: 'Uganda' },
  { value: 'UA', label: 'Ukraine' },
  { value: 'AE', label: 'United Arab Emirates' },
  { value: 'GB', label: 'United Kingdom' },
  { value: 'US', label: 'United States of America' },
  { value: 'UY', label: 'Uruguay' },
  { value: 'UZ', label: 'Uzbekistan' },
  { value: 'VU', label: 'Vanuatu' },
  { value: 'VA', label: 'Vatican City' },
  { value: 'VE', label: 'Venezuela' },
  { value: 'VN', label: 'Vietnam' },
  { value: 'YE', label: 'Yemen' },
  { value: 'ZM', label: 'Zambia' },
  { value: 'ZW', label: 'Zimbabwe' }
];


const countryOptions = [
  { value: 'AR', label: 'Argentina' },
  { value: 'BO', label: 'Bolivia' },
  { value: 'BR', label: 'Brazil' },
  { value: 'CL', label: 'Chile' },
  { value: 'CO', label: 'Colombia' },
  { value: 'CR', label: 'Costa Rica' },
  { value: 'CU', label: 'Cuba' },
  { value: 'DO', label: 'Dominican Republic' },
  { value: 'EC', label: 'Ecuador' },
  { value: 'SV', label: 'El Salvador' },
  { value: 'GT', label: 'Guatemala' },
  { value: 'HN', label: 'Honduras' },
  { value: 'MX', label: 'Mexico' },
  { value: 'NI', label: 'Nicaragua' },
  { value: 'PA', label: 'Panama' },
  { value: 'PY', label: 'Paraguay' },
  { value: 'PE', label: 'Peru' },
  { value: 'PR', label: 'Puerto Rico' },
  { value: 'ROW', label: 'Rest of the World' },
  { value: 'ES', label: 'Spain' },
  { value: 'UY', label: 'Uruguay' },
  { value: 'VE', label: 'Venezuela' }
];

const paymentMethodsOptions = [
  { value: 'ach', label: 'ACH' },
  { value: 'afterpay', label: 'Afterpay' },
  { value: 'alipay', label: 'Alipay' },
  { value: 'american-express', label: 'American Express' },
  { value: 'apple-pay', label: 'Apple Pay' },
  { value: 'amazon-pay', label: 'Amazon Pay' },
  { value: 'bancontact', label: 'Bancontact' },
  { value: 'bank-transfer', label: 'Bank Transfer' },
  { value: 'bitcoin', label: 'Bitcoin' },
  { value: 'boleto', label: 'Boleto' },
  { value: 'cash-app', label: 'Cash App' },
  { value: 'cirrus', label: 'Cirrus' },
  { value: 'credit-card', label: 'Credit Card' },
  { value: 'diners-club', label: 'Diners Club' },
  { value: 'discover', label: 'Discover' },
  { value: 'ecopayz', label: 'ecoPayz' },
  { value: 'eps', label: 'EPS' },
  { value: 'ethereum', label: 'Ethereum' },
  { value: 'google-pay', label: 'Google Pay' },
  { value: 'giropay', label: 'Giropay' },
  { value: 'ideal', label: 'iDEAL' },
  { value: 'interac', label: 'Interac' },
  { value: 'jcb', label: 'JCB' },
  { value: 'klarna', label: 'Klarna' },
  { value: 'litecoin', label: 'Litecoin' },
  { value: 'maestro', label: 'Maestro' },
  { value: 'mastercard', label: 'Mastercard' },
  { value: 'mercadopago', label: 'MercadoPago' },
  { value: 'neosurf', label: 'Neosurf' },
  { value: 'neteller', label: 'Neteller' },
  { value: 'paypal', label: 'PayPal' },
  { value: 'payoneer', label: 'Payoneer' },
  { value: 'paysafecard', label: 'Paysafecard' },
  { value: 'phonepe', label: 'PhonePe' },
  { value: 'qiwi-wallet', label: 'Qiwi Wallet' },
  { value: 'revolut', label: 'Revolut' },
  { value: 'ripple', label: 'Ripple' },
  { value: 'skrill', label: 'Skrill' },
  { value: 'sofort', label: 'Sofort' },
  { value: 'square', label: 'Square' },
  { value: 'stripe', label: 'Stripe' },
  { value: 'tink', label: 'Tink' },
  { value: 'trustly', label: 'Trustly' },
  { value: 'unionpay', label: 'UnionPay' },
  { value: 'venmo', label: 'Venmo' },
  { value: 'visa', label: 'Visa' },
  { value: 'visa-electron', label: 'Visa Electron' },
  { value: 'wechat-pay', label: 'WeChat Pay' },
  { value: 'wise', label: 'Wise' },
  { value: 'worldpay', label: 'Worldpay' },
  { value: 'yandex-money', label: 'Yandex Money' },
  // Agrega más métodos de pago según sea necesario
];

const CasinoForm: React.FC<CasinoFormProps> = ({ onSubmit }) => {
  const { control} = useForm();

  const [casinoName, setCasinoName] = useState('');
  const [dateFounded, setDateFounded] = useState('');
  const [address, setAddress] = useState('');
  const [casinoOwner, setCasinoOwner] = useState<{ value: string; label: string } | null>(null);
  const [dateLaunched, setDateLaunched] = useState('');
  const [casinoUrl, setCasinoUrl] = useState('');
  const [phoneSupport, setPhoneSupport] = useState('');
  const [supportEmail, setSupportEmail] = useState('');
  const [helpCentre, setHelpCentre] = useState('');
  const [ageLimit, setAgeLimit] = useState<number>(0);
  const [liveChat, setLiveChat] = useState(false);
  const [eSportsBetting, setESportsBetting] = useState(false);
  const [timeOut, setTimeOut] = useState(false);
  const [depositLimit, setDepositLimit] = useState(false);
  const [lossLimit, setLossLimit] = useState(false);
  const [realityCheck, setRealityCheck] = useState(false);
  const [selfAssesmentCheck, setSelfAssesmentCheck] = useState(false);
  const [selfExclusion, setSelfExclusion] = useState(false);
  const [timeSessionLimit, setTimeSessionLimit] = useState(false);
  const [wagerLimit, setWagerLimit] = useState(false);
  const [withdrawalLock, setWithdrawalLock] = useState(false);
  const [vpnAllowed, setVPNAllowed] = useState(false);


  
  

  const [cryptoCurrenciesSupported, setCryptoCurrenciesSupported] = useState(false);
  const [country, setCountry] = useState<{ value: string; label: string } | null>(null);
  const [bannedCountries, setBannedCountries] = useState<{ value: string; label: string }[]>([]);
  const [casinoCertifications, setCasinoCertifications] = useState<{ value: string; label: string }[]>([]);
  const [languages, setLanguages] = useState<{ value: string; label: string }[]>([]);
  const [currencies, setCurrencies] = useState<{ value: string; label: string }[]>([]);
  const [games, setGames] = useState<GameFormInputs[]>([]);
  const [bonuses, setBonuses] = useState<BonusFormInputs[]>([]);
  const [tournaments, setTournaments] = useState<TournamentFormInputs[]>([]);
  const [paymentProviders, setPaymentProviders] = useState<PaymentProviderFormInputs[]>([]);
  const [licenses, setLicenses] = useState<LicenseFormInputs[]>([]);

  const handleAddGame = () => {
    setGames([...games, { gameName: '', gameDescription: {label:'',value:''}, gameProviderId: {label:'',value:''}}]);
  };

  const handleAddBonus = () => {
    setBonuses([...bonuses, { bonusTypeId: {label:'',value:''}, bonusAmount: '', bonusWE: '', sticky: false, bonusText: '', bonusTerms: '' }]);
  };

  const handleAddTournament = () => {
    setTournaments([...tournaments, { tournamentTypeId: {label:'',value:''}, tournamentDescription: '',totalFS: 0, totalPrizePool: 0}]);
  };

 const handleAddPaymentProvider = () => {
  setPaymentProviders([...paymentProviders, { paymentProviderName: [] }]);
};


  const handleAddLicense = () => {
    setLicenses([...licenses, { licenseName: {label:'',value:''} }]);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const payload = {
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
      timeOut,
      depositLimit ,
      lossLimit,
      realityCheck,
      selfAssesmentCheck,
      selfExclusion,
      timeSessionLimit,
      wagerLimit,
      withdrawalLock,
      vpnAllowed ,
      cryptoCurrenciesSupported,
      country,
      bannedCountries,
      casinoCertifications,
      languages,
      currencies,
      games,
      bonuses,
      tournaments,
      paymentProviders,
      licenses
    };
  
    try {
      // Determina la URL de la API basándote en NODE_ENV
      let apiUrl;
      if (process.env.NODE_ENV === 'development') {
        apiUrl = 'http://localhost:5000/api';
      } else {
        apiUrl = process.env.REACT_APP_API_URL;
      }
  
      // Usa la URL en la llamada a axios
      const response = await axios.post(`${apiUrl}/casino`, payload, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      alert('Casino uploaded successfully');
      // Maneja la respuesta
      console.log(response.data);
    } catch (error) {
      // Maneja el error
      alert('Error submitting data');
      console.error('There was an error submitting the form!', error);
    }
  };
  

 

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto">
      {/* Información del Casino */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Casino Information</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Casino Name </label>
          <input
            type="text"
            className="w-full mt-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
            value={casinoName}
            onChange={(e) => setCasinoName(e.target.value)}
          />
        </div>
        <div>
        <label className="block text-gray-700">Country</label>
          <Select
            options={countryOptions}
            value={country} // Asigna el valor seleccionado a través del estado country
            onChange={(selectedOption) => setCountry(selectedOption)} // Actualiza el estado country con la opción seleccionada
            className="mt-1"
          />
        </div>
 

      <div>
        <label className="block text-gray-700">Banned Countries</label>
        <Controller
          name="bannedCountries"
          control={control}
          defaultValue={bannedCountries}
          render={({ field }) => (
            <Select
              {...field}
              isMulti
              options={bannedCountryOptions}
              value={bannedCountries}
              onChange={(selectedOptions: MultiValue<{ value: string; label: string }>) => {
                const selectedArray = selectedOptions as { value: string; label: string }[];
                setBannedCountries(selectedArray);
                field.onChange(selectedArray);
              }}
              className="mt-1"
            />
          )}
        />
      </div>
      <div>
        <label className="block text-gray-700">Casino Certifications</label>
        <Controller
          name="casinoCertifications"
          control={control}
          defaultValue={casinoCertifications}
          render={({ field }) => (
            <Select
              {...field}
              isMulti
              options={casinoCertificationsOptions}
              value={casinoCertifications}
              onChange={(selectedOptions: MultiValue<{ value: string; label: string }>) => {
                const selectedArray = selectedOptions as { value: string; label: string }[];
                setCasinoCertifications(selectedArray);
                field.onChange(selectedArray);
              }}
              className="mt-1"
            />
          )}
        />
      </div>

      <div>
        <label className="block text-gray-700">Currencies supported</label>
        <Controller
          name="currencies"
          control={control}
          defaultValue={currencies}
          render={({ field }) => (
            <Select
              {...field}
              isMulti
              options={currencyOptions}
              value={currencies}
              onChange={(selectedOptions: MultiValue<{ value: string; label: string }>) => {
                const selectedArray = selectedOptions as { value: string; label: string }[];
                setCurrencies(selectedArray);
                field.onChange(selectedArray);
              }}
              className="mt-1"
            />
          )}
        />
      </div>

      <div>
        <label className="block text-gray-700">Languages</label>
        <Controller
          name="languages"
          control={control}
          defaultValue={languages}
          render={({ field }) => (
            <Select
              {...field}
              isMulti
              options={languageOptions}
              value={languages}
              onChange={(selectedOptions: MultiValue<{ value: string; label: string }>) => {
                const selectedArray = selectedOptions as { value: string; label: string }[];
                setLanguages(selectedArray);
                field.onChange(selectedArray);
              }}
              className="mt-1"
            />
          )}
        />
      </div>
      <div>
        <label className="block text-gray-700">Date Founded</label>
        <Controller
          name="dateFounded"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <input
              {...field}
              type="date"
              className="w-full mt-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
              value={dateFounded}
              onChange={(e) => {
                setDateFounded(e.target.value);
                field.onChange(e.target.value);
              }}
            />
          )}
        />
      </div>
      <div>
        <label className="block text-gray-700">Address</label>
        <Controller
          name="address"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <input
              {...field}
              type="text"
              className="w-full mt-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
              onChange={(e) => {
                setAddress(e.target.value);
                field.onChange(e.target.value);
              }}
            />
          )}
        />
      </div>
      <div>
            <label className="block text-gray-700">Casino owner</label>
          <Select
            options={casinoOwnersOptions}
            value={casinoOwner} // Asigna el valor seleccionado a través del estado country
            onChange={(selectedOption) => setCasinoOwner(selectedOption)} // Actualiza el estado country con la opción seleccionada
            className="mt-1"
          />
      </div>
      <div>
        <label className="block text-gray-700">Date Launched</label>
        <Controller
          name="dateLaunched"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <input
              {...field}
              type="date"
              className="w-full mt-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
              value={dateLaunched}
              onChange={(e) => {
                setDateLaunched(e.target.value);
                field.onChange(e.target.value);
              }}
            />
          )}
        />
      </div>
      <div>
        <label className="block text-gray-700">Casino URL</label>
        <Controller
          name="casinoUrl"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <input
              {...field}
              type="url"
              className="w-full mt-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
              onChange={(e) => {
                setCasinoUrl(e.target.value);
                field.onChange(e.target.value);
              }}
            />
          )}
        />
      </div>
      <div>
        <label className="block text-gray-700">Support phone</label>
        <Controller
          name="supportPhone"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <input
              {...field}
              type="tel"
              className="w-full mt-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
              onChange={(e) => {
                setPhoneSupport(e.target.value);
                field.onChange(e.target.value);
              }}
            />
          )}
        />
      </div>
      <div>
        <label className="block text-gray-700">Support email</label>
        <Controller
          name="supportEmail"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <input
              {...field}
              type="email"
              className="w-full mt-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
              onChange={(e) => {
                setSupportEmail(e.target.value);
                field.onChange(e.target.value);
              }}
            />
          )}
        />
      </div>
      <div>
        <label className="block text-gray-700">Help Centre URL</label>
        <Controller
          name="helpCentre"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <input
              {...field}
              type="url"
              className="w-full mt-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
              onChange={(e) => {
                setHelpCentre(e.target.value);
                field.onChange(e.target.value);
              }}
            />
          )}
        />
      </div>
      <div>
        <label className="block text-gray-700">Age Limit</label>
        <Controller
          name="ageLimit"
          control={control}
          defaultValue={ageLimit}
          render={({ field }) => (
            <input
              {...field}
              type="number"
              className="w-full mt-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
              onChange={(e) => {
                const value = parseInt(e.target.value, 10);
                setAgeLimit(value);
                field.onChange(value);
              }}
            />
          )}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">

        <div>
        <label className="block text-gray-700">Live Chat</label>
        <Controller
          name="liveChat"
          control={control}
          defaultValue={false}
          render={({ field }) => (
            <input
              {...field}
              type="checkbox"
              className="mt-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
              checked={field.value}
              onChange={(e) => {
                const value = e.target.checked;
                setLiveChat(value);
                field.onChange(value);
              }}
            />
          )}
        />
      </div> 
      <div>
        <label className="block text-gray-700">Cool Off/Time-Out Available</label>
        <Controller
          name="timeOut"
          control={control}
          defaultValue={false}
          render={({ field }) => (
            <input
              {...field}
              type="checkbox"
              className="mt-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
              checked={field.value}
              onChange={(e) => {
                const value = e.target.checked;
                setTimeOut(value);
                field.onChange(value);
              }}
            />
          )}
        />
      </div>  
      <div>
        <label className="block text-gray-700">Deposit Limit Available</label>
        <Controller
          name="depositLimit"
          control={control}
          defaultValue={false}
          render={({ field }) => (
            <input
              {...field}
              type="checkbox"
              className="mt-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
              checked={field.value}
              onChange={(e) => {
                const value = e.target.checked;
                setDepositLimit(value);
                field.onChange(value);
              }}
            />
          )}
        />
      </div>
      <div>
        <label className="block text-gray-700">Loss Limit Available</label>
        <Controller
          name="lossLimit"
          control={control}
          defaultValue={false}
          render={({ field }) => (
            <input
              {...field}
              type="checkbox"
              className="mt-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
              checked={field.value}
              onChange={(e) => {
                const value = e.target.checked;
                setLossLimit(value);
                field.onChange(value);
              }}
            />
          )}
        />
      </div>
      <div>
        <label className="block text-gray-700">Reality check Available</label>
        <Controller
          name="realityCheck"
          control={control}
          defaultValue={false}
          render={({ field }) => (
            <input
              {...field}
              type="checkbox"
              className="mt-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
              checked={field.value}
              onChange={(e) => {
                const value = e.target.checked;
                setRealityCheck(value);
                field.onChange(value);
              }}
            />
          )}
        />
      </div>
      <div>
        <label className="block text-gray-700">Self assesment check Available</label>
        <Controller
          name="selfAssesmentCheck"
          control={control}
          defaultValue={false}
          render={({ field }) => (
            <input
              {...field}
              type="checkbox"
              className="mt-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
              checked={field.value}
              onChange={(e) => {
                const value = e.target.checked;
                setSelfAssesmentCheck(value);
                field.onChange(value);
              }}
            />
          )}
        />
      </div>
      <div>
        <label className="block text-gray-700">Self Exclusion Available</label>
        <Controller
          name="selfExclusion"
          control={control}
          defaultValue={false}
          render={({ field }) => (
            <input
              {...field}
              type="checkbox"
              className="mt-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
              checked={field.value}
              onChange={(e) => {
                const value = e.target.checked;
                setSelfExclusion(value);
                field.onChange(value);
              }}
            />
          )}
        />
      </div>
      <div>
        <label className="block text-gray-700">Time Session Limit Available</label>
        <Controller
          name="timeSessionLimit"
          control={control}
          defaultValue={false}
          render={({ field }) => (
            <input
              {...field}
              type="checkbox"
              className="mt-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
              checked={field.value}
              onChange={(e) => {
                const value = e.target.checked;
                setTimeSessionLimit(value);
                field.onChange(value);
              }}
            />
          )}
        />
      </div>

      <div>
        <label className="block text-gray-700">Wager limit Available</label>
        <Controller
          name="wagerLimit"
          control={control}
          defaultValue={false}
          render={({ field }) => (
            <input
              {...field}
              type="checkbox"
              className="mt-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
              checked={field.value}
              onChange={(e) => {
                const value = e.target.checked;
                setWagerLimit(value);
                field.onChange(value);
              }}
            />
          )}
        />
      </div>
      <div>
        <label className="block text-gray-700">Withdrawal Lock Available</label>
        <Controller
          name="withdrawalLock"
          control={control}
          defaultValue={false}
          render={({ field }) => (
            <input
              {...field}
              type="checkbox"
              className="mt-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
              checked={field.value}
              onChange={(e) => {
                const value = e.target.checked;
                setWithdrawalLock(value);
                field.onChange(value);
              }}
            />
          )}
        />
      </div>
      <div>
        <label className="block text-gray-700">VPN Allowed</label>
        <Controller
          name="vpnAllowed"
          control={control}
          defaultValue={false}
          render={({ field }) => (
            <input
              {...field}
              type="checkbox"
              className="mt-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
              checked={field.value}
              onChange={(e) => {
                const value = e.target.checked;
                setVPNAllowed(value);
                field.onChange(value);
              }}
            />
          )}
        />
      </div>
      <div>
        <label className="block text-gray-700">eSportsBetting</label>
        <Controller
          name="eSportsBetting"
          control={control}
          defaultValue={false}
          render={({ field }) => (
            <input
              {...field}
              type="checkbox"
              className="mt-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
              checked={field.value}
              onChange={(e) => {
                const value = e.target.checked;
                setESportsBetting(value);
                field.onChange(value);
              }}
            />
          )}
        />
      </div> 
</div>
      <div>
        <label className="block text-gray-700">Crypto</label>
        <Controller
          name="crypto"
          control={control}
          defaultValue={false}
          render={({ field }) => (
            <input
              {...field}
              type="checkbox"
              className="mt-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
              checked={field.value}
              onChange={(e) => {
                const value = e.target.checked;
                setCryptoCurrenciesSupported(value);
                field.onChange(value);
              }}
            />
          )}
        />
      </div>     
                     

        {/* Agregar otros campos según sea necesario */}
      </div>

      {/* Subformularios para Juegos */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Games</h2>
        <button
          type="button"
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          onClick={handleAddGame}
        >
          Add Game
        </button>
        {games.map((game, index) => (
          <div key={index} className="mt-4 border rounded-md p-4">
            <div>
            <input
              type="text"
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
              placeholder="Game Name"
              value={game.gameName}
              onChange={(e) => {
                const updatedGames = [...games];
                updatedGames[index].gameName = e.target.value;
                setGames(updatedGames);
              }}
            />
            </div>
            <br></br>

            <div>
              {/**
               *     <label>Bonus Type</label>
            <Controller
                name={`bonuses[${index}].bonusTypeId`}
                control={control}
                defaultValue={null} // Valor predeterminado
                render={({ field }) => (
                  <Select
                    {...field}
                    options={bonusType}
                    className="w-full mt-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                    onChange={(selectedOption) => {
                      const updatedBonuses = [...bonuses];
                      updatedBonuses[index].bonusTypeId = selectedOption;
                      setBonuses(updatedBonuses);
                      field.onChange(selectedOption);
                    }}
                    value={field.value} // Asegura que el valor seleccionado sea el correcto
                  />
                )}
              />
               */}
            <label>Game type</label>
        <Controller
          name={`games[${index}].gameDescription`}
          control={control}
          defaultValue={null}
          render={({ field }) => (
            <Select
            {...field}
              options={gameTypeOptions} // Aquí debes definir las opciones disponibles
              className="w-full mt-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
              onChange={(selectedOption) => {
                const updatedGames = [...games];
                updatedGames[index].gameDescription = selectedOption;
                setGames(updatedGames);
                field.onChange(selectedOption);
              }}
              value={field.value} // Asegura que el valor seleccionado sea el correcto
            />
          )}
        />
            </div>
            <div>
            <label>Game provider Id </label>
        <Controller
          name={`games[${index}].gameProviderId`}
          control={control}
          defaultValue={[]}
          render={({ field }) => (
            <Select
            {...field}
              options={gameProviderOptions} // Aquí debes definir las opciones disponibles
              className="w-full mt-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
              onChange={(selectedOption) => {
                const updatedGames = [...games];
                updatedGames[index].gameProviderId = selectedOption;
                setGames(updatedGames);
                field.onChange(selectedOption);
              }}
              value={field.value} 
            />
          )}
        />
            </div>
              
            {/* Agregar otros campos para juegos */}
          </div>
        ))}
      </div>

      {/* Subformularios para Bonificaciones */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Bonus</h2>
        <button
          type="button"
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          onClick={handleAddBonus}
        >
         Add Bonus
        </button>
        {bonuses.map((bonus, index) => (
          <div key={index} className="mt-4 border rounded-md p-4">
            <label>Bonus Type</label>
            <Controller
                name={`bonuses[${index}].bonusTypeId`}
                control={control}
                defaultValue={null} // Valor predeterminado
                render={({ field }) => (
                  <Select
                    {...field}
                    options={bonusType}
                    className="w-full mt-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                    onChange={(selectedOption) => {
                      const updatedBonuses = [...bonuses];
                      updatedBonuses[index].bonusTypeId = selectedOption;
                      setBonuses(updatedBonuses);
                      field.onChange(selectedOption);
                    }}
                    value={field.value} // Asegura que el valor seleccionado sea el correcto
                  />
                )}
              />
              <input
              type="text"
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
              placeholder="Bonus Amount"
              value={bonus.bonusAmount}
              onChange={(e) => {
                const updatedBonuses = [...bonuses];
                updatedBonuses[index].bonusAmount = e.target.value;
                setBonuses(updatedBonuses);
              }}
            />
              <input
              type="text"
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
              placeholder="Bonus WE"
              value={bonus.bonusWE}
              onChange={(e) => {
                const updatedBonuses = [...bonuses];
                updatedBonuses[index].bonusWE = e.target.value;
                setBonuses(updatedBonuses);
              }}
            />
            <div>
            <label className="block text-gray-700"> Sticky  </label>
            <input
              type="checkbox"
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
              placeholder="sticky"
              onChange={(e) => {
                const updatedBonuses = [...bonuses];
                setBonuses(updatedBonuses);
              }}
            />
            </div>
            <input
              type="text"
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
              placeholder="Bonus Text"
              value={bonus.bonusText}
              onChange={(e) => {
                const updatedBonuses = [...bonuses];
                updatedBonuses[index].bonusText = e.target.value;
                setBonuses(updatedBonuses);
              }}
            />
              <input
              type="text"
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
              placeholder="Bonus Terms"
              value={bonus.bonusTerms}
              onChange={(e) => {
                const updatedBonuses = [...bonuses];
                updatedBonuses[index].bonusTerms = e.target.value;
                setBonuses(updatedBonuses);
              }}
            />
            {/* Agregar otros campos para bonificaciones */}
          </div>
        ))}
      </div>

      {/* Subformularios para Torneos */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Tournaments</h2>
        <button
          type="button"
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          onClick={handleAddTournament}
        >
          Add Tournament
        </button>
        {tournaments.map((tournament, index) => (
          <div key={index} className="mt-4 border rounded-md p-4">
      
      <div>
              <label className="block text-gray-700">Tournament type</label>
              <Controller
                name={`tournaments[${index}].tournamentTypeId`}
                control={control}
                defaultValue={null} // Valor predeterminado
                render={({ field }) => (
                  <Select
                    {...field}
                    options={tournamentType}
                    className="w-full mt-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                    onChange={(selectedOption) => {
                      const updatedTournaments = [...tournaments];
                      updatedTournaments[index].tournamentTypeId = selectedOption;
                      setTournaments(updatedTournaments);
                      field.onChange(selectedOption);
                    }}
                    value={field.value} // Asegura que el valor seleccionado sea el correcto
                  />
                )}
              />
            </div>
            <input
              type="text"
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
              placeholder="Tournament Description"
              value={tournament.tournamentDescription}
              onChange={(e) => {
                const updatedTournaments = [...tournaments];
                updatedTournaments[index].tournamentDescription = e.target.value;
                setTournaments(updatedTournaments);
              }}
            />
               <input
            type="number"
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
            placeholder="Total Free Spins"
            value={tournament.totalFS}
            onChange={(e) => {
              const updatedTournaments = [...tournaments];
              const value = parseInt(e.target.value, 10);
              updatedTournaments[index].totalFS = isNaN(value) ? 0 : value;
              setTournaments(updatedTournaments);
            }}
          />
          <input
            type="number"
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
            placeholder="Prize Pool"
            value={tournament.totalPrizePool}
            onChange={(e) => {
              const updatedTournaments = [...tournaments];
              const value = parseInt(e.target.value, 10);
              updatedTournaments[index].totalPrizePool = isNaN(value) ? 0 : value;
              setTournaments(updatedTournaments);
            }}
          />
            
            {/* Agregar otros campos para torneos */}
          </div>
        ))}
      </div>
      

      {/* Subformularios para Proveedores de Pago */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Payment provider</h2>
        <button
          type="button"
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          onClick={handleAddPaymentProvider}
        >
          Add Payment Provider
        </button>
        {paymentProviders.map((provider, index) => (
          <div key={index} className="mt-4 border rounded-md p-4">
         
            <div>
              <label className="block text-gray-700">Payment Provider Name</label>
              <Controller
                name={`paymentProviders[${index}].paymentProviderName`}
                control={control}
                defaultValue={null} // Valor predeterminado
                render={({ field }) => (
                  <Select
                    {...field}
                    options={paymentMethodsOptions}
                    className="w-full mt-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                    onChange={(selectedOption) => {
                      const updatedProviders = [...paymentProviders];
                      updatedProviders[index].paymentProviderName = selectedOption;
                      setPaymentProviders(updatedProviders);
                      field.onChange(selectedOption);
                    }}
                    value={field.value} // Asegura que el valor seleccionado sea el correcto
                  />
                )}
              />
            </div>
          </div>
        ))}
      </div>

<div className="mb-8">
  <h2 className="text-xl font-semibold mb-4">Licenses</h2>
  <button
    type="button"
    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
    onClick={handleAddLicense}
  >
    Add License
  </button>
  {licenses.map((license, index) => (
    <div key={index} className="mt-4 border rounded-md p-4">
      <label className="block text-gray-700">Licensing Authorities</label>
      <Controller
        name={`licenses[${index}].licenseName`}
        control={control}
        defaultValue={license.licenseName || null}  // Asegúrate de que el valor predeterminado sea null o un objeto válido
        render={({ field }) => (
          <Select
            {...field}
            options={licensingAuthorities} // Define las opciones disponibles
            className="w-full mt-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
            onChange={(selectedOption) => {
              const updatedLicenses = [...licenses];
              updatedLicenses[index].licenseName = selectedOption;
              setLicenses(updatedLicenses);
              field.onChange(selectedOption); // Actualiza el estado con la opción seleccionada
            }}
            value={license.licenseName} // Asegúrate de que el valor esté correctamente asignado
          />
        )}
      />
      {/* Agregar otros campos para licencias si es necesario */}
    </div>
  ))}
</div>


      {/* Botón de Envío */}
      <div className="text-center">
        <button
          type="submit"
          className="bg-green-500 text-white px-6 py-3 rounded-md hover:bg-green-600"
        >
          Send
        </button>
      </div>
    </form>
  );
};

export default CasinoForm;
