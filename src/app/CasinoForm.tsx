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
  casinoOwner: string;
  dateLaunched: string;
  casinoUrl: string;
  phoneSupport: string;
  supportEmail: string;
  helpCentre: string;
  ageLimit: number;
  liveChat: boolean;
  eSportsBetting: boolean;
  cryptoCurrenciesSupported: boolean;
  country: { value: string; label: string } | null;
  bannedCountries: { value: string; label: string }[];
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
  { value :'Deposit bonus', label: 'Deposit bonus'},
  { value :'Reload bonus', label: 'Reload bonus'},
  { value :'Cashback bonus', label: 'Cashback bonus '}

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
  const [casinoOwner, setCasinoOwner] = useState('');
  const [dateLaunched, setDateLaunched] = useState('');
  const [casinoUrl, setCasinoUrl] = useState('');
  const [phoneSupport, setPhoneSupport] = useState('');
  const [supportEmail, setSupportEmail] = useState('');
  const [helpCentre, setHelpCentre] = useState('');
  const [ageLimit, setAgeLimit] = useState<number>(0);
  const [liveChat, setLiveChat] = useState(false);
  const [eSportsBetting, setESportsBetting] = useState(false);
  const [cryptoCurrenciesSupported, setCryptoCurrenciesSupported] = useState(false);
  const [country, setCountry] = useState<{ value: string; label: string } | null>(null);
  const [bannedCountries, setBannedCountries] = useState<{ value: string; label: string }[]>([]);
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
      cryptoCurrenciesSupported,
      country,
      bannedCountries,
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
              options={countryOptions}
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
        <Controller
          name="owner"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <input
              {...field}
              type="text"
              className="w-full mt-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
              onChange={(e) => {
                setCasinoOwner(e.target.value);
                field.onChange(e.target.value);
              }}
            />
          )}
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
