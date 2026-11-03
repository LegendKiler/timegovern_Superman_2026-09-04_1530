import CountryWorldClockPage from './pages/CountryWorldClockPage'
import TimeZoneConverterPage from './pages/TimeZoneConverterPage'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { UserProvider, useUser } from './context/UserContext'
import { AuthProvider } from './context/AuthContext'
import { CalculationProvider } from './context/CalculationContext'
import { AutoTranslateProvider, useAutoTranslate } from '@universal-i18n/react'
import {useEffect, lazy, Suspense} from 'react'
import { useLocation } from 'react-router-dom'
import Header from './components/Header'
const CarsPage = lazy(() => import('./pages/CarsPage'))
const CurrencyConverterPage = lazy(() => import('./pages/CurrencyConverterPage'))
const CurrencyPairPage = lazy(() => import('./pages/CurrencyPairPage'))
const WidgetTestPage = lazy(() => import('./pages/WidgetTestPage'))
const EmbedDocsPage = lazy(() => import('./pages/EmbedDocsPage'))
const HowToConvertCurrencyPage = lazy(() => import('./pages/HowToConvertCurrencyPage'))
const BestCurrencyConverterToolsPage = lazy(() => import('./pages/BestCurrencyConverterToolsPage'))
const MidMarketRatePage = lazy(() => import('./pages/MidMarketRatePage'))
const DateDurationPage = lazy(() => import('./pages/DateDurationPage'))
const BusinessDaysPage = lazy(() => import('./pages/BusinessDaysPage'))
const TimeDurationPage = lazy(() => import('./pages/TimeDurationPage'))
const UnixTimestampPage = lazy(() => import('./pages/UnixTimestampPage'))
const GpaCalculatorPage = lazy(() => import('./pages/GpaCalculatorPage'))
const DateDurationGuidePage = lazy(() => import('./pages/DateDurationGuidePage'))
const BusinessDaysGuidePage = lazy(() => import('./pages/BusinessDaysGuidePage'))
const AddSubtractTimeGuidePage = lazy(() => import('./pages/AddSubtractTimeGuidePage'))
const UnixTimestampGuidePage = lazy(() => import('./pages/UnixTimestampGuidePage'))
const HowToCalculateGpaPage = lazy(() => import('./pages/HowToCalculateGpaPage'))
const InflationCalculatorPage = lazy(() => import('./pages/InflationCalculatorPage'))
const SalesTaxCalculatorPage = lazy(() => import('./pages/SalesTaxCalculatorPage'))
const DiscountCalculatorPage = lazy(() => import('./pages/DiscountCalculatorPage'))
const RoiCalculatorPage = lazy(() => import('./pages/RoiCalculatorPage'))
const SimpleInterestCalculatorPage = lazy(() => import('./pages/SimpleInterestCalculatorPage'))
const WeatherVsPage = lazy(() => import('./pages/WeatherVsPage'))
const HistoricWeatherPage = lazy(() => import('./pages/HistoricWeatherPage'))
const HourlyForecastPage = lazy(() => import('./pages/HourlyForecastPage'))
const AirQualityPage = lazy(() => import('./pages/AirQualityPage'))
const CityClimatePage = lazy(() => import('./pages/CityClimatePage'))
const WeatherPage = lazy(() => import('./pages/WeatherPage'))
const CityWeatherPage = lazy(() => import('./pages/CityWeatherPage'))
const ServicesPage = lazy(() => import('./pages/ServicesPage'))
const AstronomyPage = lazy(() => import('./pages/AstronomyPage'))
const CitySunPage = lazy(() => import('./pages/CitySunPage'))
const CityMoonPage = lazy(() => import('./pages/CityMoonPage'))
const TimeInCityPage = lazy(() => import('./pages/TimeInCityPage'))
const CalendarPage = lazy(() => import('./pages/CalendarPage'))
const CalendarMonthPage = lazy(() => import('./pages/CalendarMonthPage'))
const WeekNumbersPage = lazy(() => import('./pages/WeekNumbersPage'))
const MonthsIndexPage = lazy(() => import('./pages/MonthsIndexPage'))
const ApiDocsPage = lazy(() => import('./pages/ApiDocsPage'))
const CountryPage = lazy(() => import('./pages/CountryPage'))
const SupportPage = lazy(() => import('./pages/SupportPage'))
const MeetingHeatmapPage = lazy(() => import('./pages/MeetingHeatmapPage'))
const ReadingHeatmapGuidePage = lazy(() => import('./pages/ReadingHeatmapGuidePage'))
const BestTimeMultipleCitiesPage = lazy(() => import('./pages/BestTimeMultipleCitiesPage'))
const MeetingExportTipsPage = lazy(() => import('./pages/MeetingExportTipsPage'))
const ComputerClockDriftPage = lazy(() => import('./pages/ComputerClockDriftPage'))
const HowUTCWorksPage = lazy(() => import('./pages/HowUTCWorksPage'))
const AccurateTimeRemoteWorkPage = lazy(() => import('./pages/AccurateTimeRemoteWorkPage'))
const WorldClockGuidePage = lazy(() => import('./pages/WorldClockGuidePage'))
const BestCitiesRemoteWorkPage = lazy(() => import('./pages/BestCitiesRemoteWorkPage'))
const DayNightAroundWorldPage = lazy(() => import('./pages/DayNightAroundWorldPage'))
const TeamAlignmentPage = lazy(() => import('./pages/TeamAlignmentPage'))
const TeamAlignmentGuidePage = lazy(() => import('./pages/TeamAlignmentGuidePage'))
const RemoteTeamTimeZonesPage = lazy(() => import('./pages/RemoteTeamTimeZonesPage'))
const DistributedTeamMeetingsPage = lazy(() => import('./pages/DistributedTeamMeetingsPage'))
const MeetingPlannerPage = lazy(() => import('./pages/MeetingPlannerPage'))
const MeetingPlannerGuidePage = lazy(() => import('./pages/MeetingPlannerGuidePage'))
const BestTimeEuropeAsiaMeetingPage = lazy(() => import('./pages/BestTimeEuropeAsiaMeetingPage'))
const BestTimeUSEuropeMeetingPage = lazy(() => import('./pages/BestTimeUSEuropeMeetingPage'))
const MeetingHourStripPage = lazy(() => import('./pages/MeetingHourStripPage'))
const HowToScheduleGlobalMeetingPage = lazy(() => import('./pages/HowToScheduleGlobalMeetingPage'))
const BestTimeGlobalMeetingPage = lazy(() => import('./pages/BestTimeGlobalMeetingPage'))
const WorkHoursOverlapPage = lazy(() => import('./pages/WorkHoursOverlapPage'))
const BrazilTaxBracketsPage = lazy(() => import('./pages/BrazilTaxBracketsPage'))
const BrazilTakeHomePayPage = lazy(() => import('./pages/BrazilTakeHomePayPage'))
const BrazilINSSIRRFPage = lazy(() => import('./pages/BrazilINSSIRRFPage'))
const MexicoTaxBracketsPage = lazy(() => import('./pages/MexicoTaxBracketsPage'))
const MexicoTakeHomePayPage = lazy(() => import('./pages/MexicoTakeHomePayPage'))
const MexicoISRIMSSPage = lazy(() => import('./pages/MexicoISRIMSSPage'))
const NigeriaTaxBracketsPage = lazy(() => import('./pages/NigeriaTaxBracketsPage'))
const NigeriaTakeHomePayPage = lazy(() => import('./pages/NigeriaTakeHomePayPage'))
const NigeriaPensionPage = lazy(() => import('./pages/NigeriaPensionPage'))
const KenyaTaxBracketsPage = lazy(() => import('./pages/KenyaTaxBracketsPage'))
const KenyaTakeHomePayPage = lazy(() => import('./pages/KenyaTakeHomePayPage'))
const KenyaDeductionsPage = lazy(() => import('./pages/KenyaDeductionsPage'))
const SouthAfricaTaxBracketsPage = lazy(() => import('./pages/SouthAfricaTaxBracketsPage'))
const SouthAfricaTakeHomePayPage = lazy(() => import('./pages/SouthAfricaTakeHomePayPage'))
const SouthAfricaUIFPage = lazy(() => import('./pages/SouthAfricaUIFPage'))
const IndiaTaxBracketsPage = lazy(() => import('./pages/IndiaTaxBracketsPage'))
const IndiaTakeHomePayPage = lazy(() => import('./pages/IndiaTakeHomePayPage'))
const IndiaEPFCessPage = lazy(() => import('./pages/IndiaEPFCessPage'))
const PakistanTaxBracketsPage = lazy(() => import('./pages/PakistanTaxBracketsPage'))
const PakistanTakeHomePayPage = lazy(() => import('./pages/PakistanTakeHomePayPage'))
const PakistanFilerPage = lazy(() => import('./pages/PakistanFilerPage'))
const BangladeshTaxBracketsPage = lazy(() => import('./pages/BangladeshTaxBracketsPage'))
const BangladeshTakeHomePayPage = lazy(() => import('./pages/BangladeshTakeHomePayPage'))
const BangladeshTaxRebatePage = lazy(() => import('./pages/BangladeshTaxRebatePage'))
const JapanTaxBracketsPage = lazy(() => import('./pages/JapanTaxBracketsPage'))
const JapanTakeHomePayPage = lazy(() => import('./pages/JapanTakeHomePayPage'))
const JapanSocialInsurancePage = lazy(() => import('./pages/JapanSocialInsurancePage'))
const SingaporeTaxBracketsPage = lazy(() => import('./pages/SingaporeTaxBracketsPage'))
const SingaporeTakeHomePayPage = lazy(() => import('./pages/SingaporeTakeHomePayPage'))
const SingaporeCPFPage = lazy(() => import('./pages/SingaporeCPFPage'))
const UAETaxFreePage = lazy(() => import('./pages/UAETaxFreePage'))
const UAETakeHomePayPage = lazy(() => import('./pages/UAETakeHomePayPage'))
const UAECostOfLivingPage = lazy(() => import('./pages/UAECostOfLivingPage'))
const SaudiTaxFreePage = lazy(() => import('./pages/SaudiTaxFreePage'))
const SaudiTakeHomePayPage = lazy(() => import('./pages/SaudiTakeHomePayPage'))
const SaudiGOSIPage = lazy(() => import('./pages/SaudiGOSIPage'))
const QatarTaxFreePage = lazy(() => import('./pages/QatarTaxFreePage'))
const QatarTakeHomePayPage = lazy(() => import('./pages/QatarTakeHomePayPage'))
const QatarGRSIAPage = lazy(() => import('./pages/QatarGRSIAPage'))
const CanadaTaxBracketsPage = lazy(() => import('./pages/CanadaTaxBracketsPage'))
const CanadaTakeHomePayPage = lazy(() => import('./pages/CanadaTakeHomePayPage'))
const CanadaCPPEIPage = lazy(() => import('./pages/CanadaCPPEIPage'))
const AustraliaTaxBracketsPage = lazy(() => import('./pages/AustraliaTaxBracketsPage'))
const AustraliaTakeHomePayPage = lazy(() => import('./pages/AustraliaTakeHomePayPage'))
const AustraliaMedicareLevyPage = lazy(() => import('./pages/AustraliaMedicareLevyPage'))
const NewZealandTaxBracketsPage = lazy(() => import('./pages/NewZealandTaxBracketsPage'))
const NewZealandTakeHomePayPage = lazy(() => import('./pages/NewZealandTakeHomePayPage'))
const NewZealandACCLevyPage = lazy(() => import('./pages/NewZealandACCLevyPage'))
import ScrollToTop from './components/ScrollToTop'
import Footer from './components/Footer'
const HomePage = lazy(() => import('./pages/HomePage'))
const NewsPage = lazy(() => import('./pages/NewsPage'))
const CaffeinePage = lazy(() => import('./pages/CaffeinePage'))
const ChronotypePage = lazy(() => import('./pages/ChronotypePage'))
const HowMuchSleepDoYouNeedPage = lazy(() => import('./pages/HowMuchSleepDoYouNeedPage'))
const SleepDebtAndWeightGainPage = lazy(() => import('./pages/SleepDebtAndWeightGainPage'))
const BestTimeToDrinkCoffeePage = lazy(() => import('./pages/BestTimeToDrinkCoffeePage'))
const CaffeineWithdrawalPage = lazy(() => import('./pages/CaffeineWithdrawalPage'))
const TimeZonePage = lazy(() => import('./pages/TimeZonePage'))
const PomodoroPage = lazy(() => import('./pages/PomodoroPage'))
const CountdownPage = lazy(() => import('./pages/CountdownPage'))
const WorldClockPage = lazy(() => import('./pages/WorldClockPage'))
const UnitConverterPage = lazy(() => import('./pages/UnitConverterPage'))
const WordCounterPage = lazy(() => import('./pages/WordCounterPage'))
const RandomNumberPage = lazy(() => import('./pages/RandomNumberPage'))
const StopProcrastinatingPage = lazy(() => import('./pages/StopProcrastinatingPage'))
const BestStudyTechniquesPage = lazy(() => import('./pages/BestStudyTechniquesPage'))
const DeepWorkGuidePage = lazy(() => import('./pages/DeepWorkGuidePage'))
const SleepHygieneTipsPage = lazy(() => import('./pages/SleepHygieneTipsPage'))
const BestProductivityAppsPage = lazy(() => import('./pages/BestProductivityAppsPage'))
const MorningRoutineGuidePage = lazy(() => import('./pages/MorningRoutineGuidePage'))
const WhyDifferentTimesPage = lazy(() => import('./pages/WhyDifferentTimesPage'))
const ScheduleMeetingsPage = lazy(() => import('./pages/ScheduleMeetingsPage'))
const WhatIsPomodoroPage = lazy(() => import('./pages/WhatIsPomodoroPage'))
const Why25MinutesPage = lazy(() => import('./pages/Why25MinutesPage'))
const BestPomodoroAppsPage = lazy(() => import('./pages/BestPomodoroAppsPage'))
const WhatIsSleepDebtPage = lazy(() => import('./pages/WhatIsSleepDebtPage'))
const CaffeineHalfLifePage = lazy(() => import('./pages/CaffeineHalfLifePage'))
const WhenToStopDrinkingCoffeePage = lazy(() => import('./pages/WhenToStopDrinkingCoffeePage'))
const CaffeineInCommonDrinksPage = lazy(() => import('./pages/CaffeineInCommonDrinksPage'))
const HowToRecoverFromSleepDebtPage = lazy(() => import('./pages/HowToRecoverFromSleepDebtPage'))
const SleepDebtByAgePage = lazy(() => import('./pages/SleepDebtByAgePage'))

const SleepDebtPage = lazy(() => import('./pages/SleepDebtPage'))
const About = lazy(() => import('./pages/About'))
const Contact = lazy(() => import('./pages/Contact'))
const SiteMap = lazy(() => import('./pages/SiteMap'))
const AuthPage = lazy(() => import('./pages/AuthPage'))
const ResetPassword = lazy(() => import('./pages/ResetPassword'))
const MyBookingsPage = lazy(() => import('./pages/MyBookingsPage'))
const MyCalculationsPage = lazy(() => import('./pages/MyCalculationsPage'))
const CompareCalculationsPage = lazy(() => import('./pages/CompareCalculationsPage'))
const SalaryPage = lazy(() => import('./pages/SalaryPage'))
const CountrySalaryPage = lazy(() => import('./pages/CountrySalaryPage'))
const GermanyTaxBracketsPage = lazy(() => import('./pages/GermanyTaxBracketsPage'))
const GermanyTakeHomePayPage = lazy(() => import('./pages/GermanyTakeHomePayPage'))
const GermanySocialContributionsPage = lazy(() => import('./pages/GermanySocialContributionsPage'))
const FranceTaxBracketsPage = lazy(() => import('./pages/FranceTaxBracketsPage'))
const FranceTakeHomePayPage = lazy(() => import('./pages/FranceTakeHomePayPage'))
const FranceSocialContributionsPage = lazy(() => import('./pages/FranceSocialContributionsPage'))
const NetherlandsTaxBracketsPage = lazy(() => import('./pages/NetherlandsTaxBracketsPage'))
const NetherlandsTakeHomePayPage = lazy(() => import('./pages/NetherlandsTakeHomePayPage'))
const Netherlands30PercentRulingPage = lazy(() => import('./pages/Netherlands30PercentRulingPage'))
const IctHubPage = lazy(() => import('./pages/IctHubPage'))
const IctToolPage = lazy(() => import('./pages/IctToolPage'))
const ForumPage = lazy(() => import('./pages/ForumPage'))
const SettingsPage = lazy(() => import('./pages/SettingsPage'))
const PremiumPage = lazy(() => import('./pages/PremiumPage'))
const PricingPage = lazy(() => import('./pages/PricingPage'))
const FlightMap = lazy(() => import('./pages/FlightMap'))
const FlightsPage = lazy(() => import('./pages/FlightsPage'))
const FlightRoutePage = lazy(() => import('./pages/FlightRoutePage'))
const TimersPage = lazy(() => import('./pages/TimersPage'))
const LiveDataPage = lazy(() => import('./pages/LiveDataPage'))
const WidgetsPage = lazy(() => import('./pages/WidgetsPage'))
const CalculatorsPage = lazy(() => import('./pages/CalculatorsPage'))
const MortgageHubPage = lazy(() => import('./pages/MortgageHubPage'))
const UsaMortgagePage = lazy(() => import('./pages/mortgage/UsaMortgagePage'))
const UkMortgagePage = lazy(() => import('./pages/mortgage/UkMortgagePage'))
const CanadaMortgagePage = lazy(() => import('./pages/mortgage/CanadaMortgagePage'))
const IndiaMortgagePage = lazy(() => import('./pages/mortgage/IndiaMortgagePage'))
const EuropeanHubPage = lazy(() => import('./pages/mortgage/EuropeanHubPage'))
const AsiaPacificHubPage = lazy(() => import('./pages/mortgage/AsiaPacificHubPage'))
const CountryMortgagePage = lazy(() => import('./pages/mortgage/CountryMortgagePage'))
const RentalYieldPage = lazy(() => import('./pages/mortgage/RentalYieldPage'))
const CountryRentalYieldPage = lazy(() => import('./pages/mortgage/CountryRentalYieldPage'))
const FirstHomeBuyerPage = lazy(() => import('./pages/mortgage/FirstHomeBuyerPage'))
const SellVsRefinancePage = lazy(() => import('./pages/mortgage/SellVsRefinancePage'))
const HomeEquityPage = lazy(() => import('./pages/mortgage/HomeEquityPage'))
const CountryHomeEquityPage = lazy(() => import('./pages/mortgage/CountryHomeEquityPage'))
const CountrySellVsRefinancePage = lazy(() => import('./pages/mortgage/CountrySellVsRefinancePage'))
const CountryFirstHomeBuyerPage = lazy(() => import('./pages/mortgage/CountryFirstHomeBuyerPage'))
const AustraliaMortgagePage = lazy(() => import('./pages/mortgage/AustraliaMortgagePage'))
const UsMortgagePage = lazy(() => import('./pages/mortgage/UsMortgagePage'))
const UkRepaymentPage = lazy(() => import('./pages/mortgage/UkRepaymentPage'))
const CaMortgagePaymentPage = lazy(() => import('./pages/mortgage/CaMortgagePaymentPage'))
const InEmiPage = lazy(() => import('./pages/mortgage/InEmiPage'))
const InPrepaymentPage = lazy(() => import('./pages/mortgage/InPrepaymentPage'))
const InBalanceTransferPage = lazy(() => import('./pages/mortgage/InBalanceTransferPage'))
const InEligibilityPage = lazy(() => import('./pages/mortgage/InEligibilityPage'))
const InStampDutyPage = lazy(() => import('./pages/mortgage/InStampDutyPage'))
const InTaxBenefitPage = lazy(() => import('./pages/mortgage/InTaxBenefitPage'))
const CaCmhcPage = lazy(() => import('./pages/mortgage/CaCmhcPage'))
const CaLandTransferTaxPage = lazy(() => import('./pages/mortgage/CaLandTransferTaxPage'))
const CaAffordabilityPage = lazy(() => import('./pages/mortgage/CaAffordabilityPage'))
const CaBiWeeklyAcceleratedPage = lazy(() => import('./pages/mortgage/CaBiWeeklyAcceleratedPage'))
const CaRenewalPage = lazy(() => import('./pages/mortgage/CaRenewalPage'))
const UkOverpaymentPage = lazy(() => import('./pages/mortgage/UkOverpaymentPage'))
const UkStampDutyPage = lazy(() => import('./pages/mortgage/UkStampDutyPage'))
const UkInterestOnlyPage = lazy(() => import('./pages/mortgage/UkInterestOnlyPage'))
const UkRemortgagePage = lazy(() => import('./pages/mortgage/UkRemortgagePage'))
const UkBuyToLetPage = lazy(() => import('./pages/mortgage/UkBuyToLetPage'))
const UsBiWeeklyPage = lazy(() => import('./pages/mortgage/UsBiWeeklyPage'))
const UsFhaPage = lazy(() => import('./pages/mortgage/UsFhaPage'))
const UsVaPage = lazy(() => import('./pages/mortgage/UsVaPage'))
const UsPmiPage = lazy(() => import('./pages/mortgage/UsPmiPage'))
const UsPropertyTaxPage = lazy(() => import('./pages/mortgage/UsPropertyTaxPage'))
const UsRentVsBuyPage = lazy(() => import('./pages/mortgage/UsRentVsBuyPage'))
const UsRefinancePage = lazy(() => import('./pages/mortgage/UsRefinancePage'))
const HomeLoanRepaymentPage = lazy(() => import('./pages/mortgage/HomeLoanRepaymentPage'))
const OffsetAccountPage = lazy(() => import('./pages/mortgage/OffsetAccountPage'))
const StampDutyPage = lazy(() => import('./pages/mortgage/StampDutyPage'))
const LmiCalculatorPage = lazy(() => import('./pages/mortgage/LmiCalculatorPage'))
const NovatedLeasePage = lazy(() => import('./pages/mortgage/NovatedLeasePage'))
const ExtraRepaymentPage = lazy(() => import('./pages/mortgage/ExtraRepaymentPage'))
const BorrowingPowerPage = lazy(() => import('./pages/mortgage/BorrowingPowerPage'))
const InterestOnlyPage = lazy(() => import('./pages/mortgage/InterestOnlyPage'))
const FirstHomeGuaranteePage = lazy(() => import('./pages/mortgage/FirstHomeGuaranteePage'))
const SplitLoanPage = lazy(() => import('./pages/mortgage/SplitLoanPage'))
const HoursCalculatorPage = lazy(() => import('./pages/HoursCalculatorPage'))
const PercentageCalculatorPage = lazy(() => import('./pages/PercentageCalculatorPage'))
const TimeCardCalculatorPage = lazy(() => import('./pages/TimeCardCalculatorPage'))
const AgeCalculatorPage = lazy(() => import('./pages/AgeCalculatorPage'))
const BmiCalculatorPage = lazy(() => import('./pages/BmiCalculatorPage'))
const SleepTimerPage = lazy(() => import('./pages/SleepTimerPage'))
const SleepToolsHub = lazy(() => import('./pages/SleepToolsHub'))
const BlogPage = lazy(() => import('./pages/BlogPage'))
const WorldometersHub = lazy(() => import('./pages/WorldometersHub'))
const WorldPopulationClockPage = lazy(() => import('./pages/WorldPopulationClockPage'))
const BirthsClockPage = lazy(() => import('./pages/BirthsClockPage'))
const DeathsClockPage = lazy(() => import('./pages/DeathsClockPage'))
const Co2EmissionsClockPage = lazy(() => import('./pages/Co2EmissionsClockPage'))
const EnergyUseClockPage = lazy(() => import('./pages/EnergyUseClockPage'))
const FoodWasteClockPage = lazy(() => import('./pages/FoodWasteClockPage'))
const ForestLossClockPage = lazy(() => import('./pages/ForestLossClockPage'))
const PlasticProducedClockPage = lazy(() => import('./pages/PlasticProducedClockPage'))
const WaterUsedClockPage = lazy(() => import('./pages/WaterUsedClockPage'))
const RenewableEnergyClockPage = lazy(() => import('./pages/RenewableEnergyClockPage'))
const EmailsSentTodayPage = lazy(() => import('./pages/EmailsSentTodayPage'))
const GoogleSearchesTodayPage = lazy(() => import('./pages/GoogleSearchesTodayPage'))
const MarriagesTodayPage = lazy(() => import('./pages/MarriagesTodayPage'))
const DivorcesTodayPage = lazy(() => import('./pages/DivorcesTodayPage'))
const CarsProducedTodayPage = lazy(() => import('./pages/CarsProducedTodayPage'))
const FlightsTodayPage = lazy(() => import('./pages/FlightsTodayPage'))
const SuicidesTodayPage = lazy(() => import('./pages/SuicidesTodayPage'))
const CancerDeathsTodayPage = lazy(() => import('./pages/CancerDeathsTodayPage'))
const DiabetesDeathsTodayPage = lazy(() => import('./pages/DiabetesDeathsTodayPage'))
const PlasticBottlesProducedTodayPage = lazy(() => import('./pages/PlasticBottlesProducedTodayPage'))
const GdpClockPage = lazy(() => import('./pages/GdpClockPage'))
const HealthSpendingClockPage = lazy(() => import('./pages/HealthSpendingClockPage'))
const EducationSpendingClockPage = lazy(() => import('./pages/EducationSpendingClockPage'))
const MilitarySpendingClockPage = lazy(() => import('./pages/MilitarySpendingClockPage'))
const BooksPublishedTodayPage = lazy(() => import('./pages/BooksPublishedTodayPage'))
const SocialMediaPostsTodayPage = lazy(() => import('./pages/SocialMediaPostsTodayPage'))
const TvsSoldTodayPage = lazy(() => import('./pages/TvsSoldTodayPage'))
const MobilePhonesSoldTodayPage = lazy(() => import('./pages/MobilePhonesSoldTodayPage'))
const HungerDeathsTodayPage = lazy(() => import('./pages/HungerDeathsTodayPage'))
const UndernourishedPeoplePage = lazy(() => import('./pages/UndernourishedPeoplePage'))
const NewlyObeseTodayPage = lazy(() => import('./pages/NewlyObeseTodayPage'))
const ObeseAdultsWorldwidePage = lazy(() => import('./pages/ObeseAdultsWorldwidePage'))
const NewlyHungryTodayPage = lazy(() => import('./pages/NewlyHungryTodayPage'))
const AcuteFoodInsecurityPeoplePage = lazy(() => import('./pages/AcuteFoodInsecurityPeoplePage'))
const CigarettesSmokedTodayPage = lazy(() => import('./pages/CigarettesSmokedTodayPage'))
const SmokingDeathsTodayPage = lazy(() => import('./pages/SmokingDeathsTodayPage'))
const AlcoholDeathsTodayPage = lazy(() => import('./pages/AlcoholDeathsTodayPage'))
const RoadTrafficDeathsTodayPage = lazy(() => import('./pages/RoadTrafficDeathsTodayPage'))
const Co2ByCountryPage = lazy(() => import('./pages/Co2ByCountryPage'))
const CountryCo2Page = lazy(() => import('./pages/CountryCo2Page'))
const WaterByCountryPage = lazy(() => import('./pages/WaterByCountryPage'))
const CountryWaterPage = lazy(() => import('./pages/CountryWaterPage'))
const GdpByCountryPage = lazy(() => import('./pages/GdpByCountryPage'))
const CountryGdpPage = lazy(() => import('./pages/CountryGdpPage'))
const RegionHubPage = lazy(() => import('./pages/RegionHubPage'))
const RegionDetailPage = lazy(() => import('./pages/RegionDetailPage'))
const CompareHubPage = lazy(() => import('./pages/CompareHubPage'))
const CompareMetricPage = lazy(() => import('./pages/CompareMetricPage'))
const ComparePairPage = lazy(() => import('./pages/ComparePairPage'))
const LifeExpectancyByCountryPage = lazy(() => import('./pages/LifeExpectancyByCountryPage'))
const CountryLifeExpectancyPage = lazy(() => import('./pages/CountryLifeExpectancyPage'))
const WorldGdpByYearPage = lazy(() => import('./pages/WorldGdpByYearPage'))
const WorldGdpYearPage = lazy(() => import('./pages/WorldGdpYearPage'))
const WorldDeathsByYearPage = lazy(() => import('./pages/WorldDeathsByYearPage'))
const WorldDeathsYearPage = lazy(() => import('./pages/WorldDeathsYearPage'))
const WorldLifeExpectancyByYearPage = lazy(() => import('./pages/WorldLifeExpectancyByYearPage'))
const WorldLifeExpectancyYearPage = lazy(() => import('./pages/WorldLifeExpectancyYearPage'))
const WorldForestByYearPage = lazy(() => import('./pages/WorldForestByYearPage'))
const WorldForestYearPage = lazy(() => import('./pages/WorldForestYearPage'))
const WorldRenewableByYearPage = lazy(() => import('./pages/WorldRenewableByYearPage'))
const WorldRenewableYearPage = lazy(() => import('./pages/WorldRenewableYearPage'))
const WorldPopulationByYearPage = lazy(() => import('./pages/WorldPopulationByYearPage'))
const WorldPopulationYearPage = lazy(() => import('./pages/WorldPopulationYearPage'))
const Co2ByYearPage = lazy(() => import('./pages/Co2ByYearPage'))
const Co2YearPage = lazy(() => import('./pages/Co2YearPage'))
const BirthsByYearPage = lazy(() => import('./pages/BirthsByYearPage'))
const BirthsYearPage = lazy(() => import('./pages/BirthsYearPage'))
const EnergyByCountryPage = lazy(() => import('./pages/EnergyByCountryPage'))
const CountryEnergyPage = lazy(() => import('./pages/CountryEnergyPage'))
const MoneySpentOnlineTodayPage = lazy(() => import('./pages/MoneySpentOnlineTodayPage'))
const AutoLoanCalculatorPage = lazy(() => import('./pages/AutoLoanCalculatorPage'))
const CreditCardPayoffCalculatorPage = lazy(() => import('./pages/CreditCardPayoffCalculatorPage'))
const RetirementCalculatorPage = lazy(() => import('./pages/RetirementCalculatorPage'))
const InvestmentCalculatorPage = lazy(() => import('./pages/InvestmentCalculatorPage'))
const GradeCalculatorPage = lazy(() => import('./pages/GradeCalculatorPage'))
const RomanNumeralCalculatorPage = lazy(() => import('./pages/RomanNumeralCalculatorPage'))
const PregnancyDueDateCalculatorPage = lazy(() => import('./pages/PregnancyDueDateCalculatorPage'))
const OvulationCalculatorPage = lazy(() => import('./pages/OvulationCalculatorPage'))
const AreaCalculatorPage = lazy(() => import('./pages/AreaCalculatorPage'))
const VolumeCalculatorPage = lazy(() => import('./pages/VolumeCalculatorPage'))
const TriangleCalculatorPage = lazy(() => import('./pages/TriangleCalculatorPage'))
const SlopeCalculatorPage = lazy(() => import('./pages/SlopeCalculatorPage'))
const QuadraticCalculatorPage = lazy(() => import('./pages/QuadraticCalculatorPage'))
const BinaryHexConverterPage = lazy(() => import('./pages/BinaryHexConverterPage'))
const DebtPayoffCalculatorPage = lazy(() => import('./pages/DebtPayoffCalculatorPage'))
const DownPaymentCalculatorPage = lazy(() => import('./pages/DownPaymentCalculatorPage'))
const AmortizationCalculatorPage = lazy(() => import('./pages/AmortizationCalculatorPage'))
const CAGRCalculatorPage = lazy(() => import('./pages/CAGRCalculatorPage'))
const CountryCalculatorPage = lazy(() => import('./pages/CountryCalculatorPage'))
const LogarithmCalculatorPage = lazy(() => import('./pages/LogarithmCalculatorPage'))
const ScientificNotationConverterPage = lazy(() => import('./pages/ScientificNotationConverterPage'))
const SignificantFiguresCalculatorPage = lazy(() => import('./pages/SignificantFiguresCalculatorPage'))
const PercentErrorCalculatorPage = lazy(() => import('./pages/PercentErrorCalculatorPage'))
const GcdLcmCalculatorPage = lazy(() => import('./pages/GcdLcmCalculatorPage'))
const PrimeFactorizationCalculatorPage = lazy(() => import('./pages/PrimeFactorizationCalculatorPage'))
const MatrixCalculatorPage = lazy(() => import('./pages/MatrixCalculatorPage'))
const ExponentRootCalculatorPage = lazy(() => import('./pages/ExponentRootCalculatorPage'))
const PermutationCombinationCalculatorPage = lazy(() => import('./pages/PermutationCombinationCalculatorPage'))
const ProbabilityCalculatorPage = lazy(() => import('./pages/ProbabilityCalculatorPage'))
const TemperatureConverterPage = lazy(() => import('./pages/TemperatureConverterPage'))
const LengthConverterPage = lazy(() => import('./pages/LengthConverterPage'))
const WeightConverterPage = lazy(() => import('./pages/WeightConverterPage'))
const DataStorageConverterPage = lazy(() => import('./pages/DataStorageConverterPage'))
const SpeedConverterPage = lazy(() => import('./pages/SpeedConverterPage'))
const MarkupCalculatorPage = lazy(() => import('./pages/MarkupCalculatorPage'))
const BreakEvenCalculatorPage = lazy(() => import('./pages/BreakEvenCalculatorPage'))
const PaybackPeriodCalculatorPage = lazy(() => import('./pages/PaybackPeriodCalculatorPage'))
const FutureValueCalculatorPage = lazy(() => import('./pages/FutureValueCalculatorPage'))
const PresentValueCalculatorPage = lazy(() => import('./pages/PresentValueCalculatorPage'))
const PopulationByCountryPage = lazy(() => import('./pages/PopulationByCountryPage'))
const CountryPopulationPage = lazy(() => import('./pages/CountryPopulationPage'))
const MacroCalculatorPage = lazy(() => import('./pages/MacroCalculatorPage'))
const TdeeCalculatorPage = lazy(() => import('./pages/TdeeCalculatorPage'))
const ProteinCalculatorPage = lazy(() => import('./pages/ProteinCalculatorPage'))
const PaceCalculatorPage = lazy(() => import('./pages/PaceCalculatorPage'))
const BacCalculatorPage = lazy(() => import('./pages/BacCalculatorPage'))
const InflationGuidePage = lazy(() => import('./pages/InflationGuidePage'))
const SalesTaxGuidePage = lazy(() => import('./pages/SalesTaxGuidePage'))
const DiscountGuidePage = lazy(() => import('./pages/DiscountGuidePage'))
const RoiGuidePage = lazy(() => import('./pages/RoiGuidePage'))
const SimpleInterestGuidePage = lazy(() => import('./pages/SimpleInterestGuidePage'))
const MacroGuidePage = lazy(() => import('./pages/MacroGuidePage'))
const TdeeGuidePage = lazy(() => import('./pages/TdeeGuidePage'))
const ProteinGuidePage = lazy(() => import('./pages/ProteinGuidePage'))
const PaceGuidePage = lazy(() => import('./pages/PaceGuidePage'))
const BacGuidePage = lazy(() => import('./pages/BacGuidePage'))
const WorldPopulationExplainedPage = lazy(() => import('./pages/WorldPopulationExplainedPage'))
const HowManyBabiesBornPage = lazy(() => import('./pages/HowManyBabiesBornPage'))
const HowManyPeopleDiePage = lazy(() => import('./pages/HowManyPeopleDiePage'))
const Co2EmissionsPerSecondPage = lazy(() => import('./pages/Co2EmissionsPerSecondPage'))
const WhereDoesCo2ComeFromPage = lazy(() => import('./pages/WhereDoesCo2ComeFromPage'))
const GlobalEnergyUsePage = lazy(() => import('./pages/GlobalEnergyUsePage'))
const FoodWasteClimatePage = lazy(() => import('./pages/FoodWasteClimatePage'))
const DeforestationRatesPage = lazy(() => import('./pages/DeforestationRatesPage'))
const HowMuchPlasticProducedPage = lazy(() => import('./pages/HowMuchPlasticProducedPage'))
const GlobalGdpExplainedPage = lazy(() => import('./pages/GlobalGdpExplainedPage'))
const BestTimeToTakeLeave2026Page = lazy(() => import('./pages/BestTimeToTakeLeave2026Page'))
const LongWeekends2026Page = lazy(() => import('./pages/LongWeekends2026Page'))
const MostPublicHolidaysPage = lazy(() => import('./pages/MostPublicHolidaysPage'))
const PublicHolidaysComparisonPage = lazy(() => import('./pages/PublicHolidaysComparisonPage'))
const SyncTeamTimeOffPage = lazy(() => import('./pages/SyncTeamTimeOffPage'))
const InternationalMeetingsPage = lazy(() => import('./pages/InternationalMeetingsPage'))
const RemoteWorkTimeZonesPage = lazy(() => import('./pages/RemoteWorkTimeZonesPage'))
const FinanceToolsHub = lazy(() => import('./pages/FinanceToolsHub'))
const MathToolsHub = lazy(() => import('./pages/MathToolsHub'))
const DeveloperToolsHub = lazy(() => import('./pages/DeveloperToolsHub'))
const LifestyleToolsHub = lazy(() => import('./pages/LifestyleToolsHub'))
const CompoundInterestPage = lazy(() => import('./pages/CompoundInterestPage'))
const LoanCalculatorPage = lazy(() => import('./pages/LoanCalculatorPage'))
const PasswordGeneratorPage = lazy(() => import('./pages/PasswordGeneratorPage'))
const QRCodeGeneratorPage = lazy(() => import('./pages/QRCodeGeneratorPage'))
const TipCalculatorPage = lazy(() => import('./pages/TipCalculatorPage'))
const CalorieCalculatorPage = lazy(() => import('./pages/CalorieCalculatorPage'))
const WaterIntakePage = lazy(() => import('./pages/WaterIntakePage'))
const BodyFatPage = lazy(() => import('./pages/BodyFatPage'))
const IdealWeightPage = lazy(() => import('./pages/IdealWeightPage'))
const TimePairPage = lazy(() => import('./pages/TimePairPage'))
const FractionCalculatorPage = lazy(() => import('./pages/FractionCalculatorPage'))
const StandardDeviationPage = lazy(() => import('./pages/StandardDeviationPage'))
const ScientificCalculatorPage = lazy(() => import('./pages/ScientificCalculatorPage'))
const AverageCalculatorPage = lazy(() => import('./pages/AverageCalculatorPage'))
const RatioCalculatorPage = lazy(() => import('./pages/RatioCalculatorPage'))
const HowToSimplifyRatioPage = lazy(() => import('./pages/HowToSimplifyRatioPage'))
const HowToSolveProportionsPage = lazy(() => import('./pages/HowToSolveProportionsPage'))
const RatioInRealLifePage = lazy(() => import('./pages/RatioInRealLifePage'))
const HowToCalculateMeanPage = lazy(() => import('./pages/HowToCalculateMeanPage'))
const MeanVsMedianPage = lazy(() => import('./pages/MeanVsMedianPage'))
const WhatIsModeStatisticsPage = lazy(() => import('./pages/WhatIsModeStatisticsPage'))
const HowToUseScientificCalculatorPage = lazy(() => import('./pages/HowToUseScientificCalculatorPage'))
const DegreesVsRadiansPage = lazy(() => import('./pages/DegreesVsRadiansPage'))
const WhatIsLogarithmPage = lazy(() => import('./pages/WhatIsLogarithmPage'))
const WhatIsStandardDeviationPage = lazy(() => import('./pages/WhatIsStandardDeviationPage'))
const PopulationVsSampleSDPage = lazy(() => import('./pages/PopulationVsSampleSDPage'))
const HowToCalculateVariancePage = lazy(() => import('./pages/HowToCalculateVariancePage'))
const HowToAddFractionsPage = lazy(() => import('./pages/HowToAddFractionsPage'))
const HowToSimplifyFractionsPage = lazy(() => import('./pages/HowToSimplifyFractionsPage'))
const FractionToDecimalPage = lazy(() => import('./pages/FractionToDecimalPage'))
const HowToCalculateIdealWeightPage = lazy(() => import('./pages/HowToCalculateIdealWeightPage'))
const HealthyBMIRangePage = lazy(() => import('./pages/HealthyBMIRangePage'))
const WaistToHeightRatioPage = lazy(() => import('./pages/WaistToHeightRatioPage'))
const HowToMeasureBodyFatPage = lazy(() => import('./pages/HowToMeasureBodyFatPage'))
const BodyFatPercentageChartPage = lazy(() => import('./pages/BodyFatPercentageChartPage'))
const BMIVsBodyFatPage = lazy(() => import('./pages/BMIVsBodyFatPage'))
const HowMuchWaterShouldIDrinkPage = lazy(() => import('./pages/HowMuchWaterShouldIDrinkPage'))
const DehydrationSignsPage = lazy(() => import('./pages/DehydrationSignsPage'))
const DoesCoffeeDehydrateYouPage = lazy(() => import('./pages/DoesCoffeeDehydrateYouPage'))
const WhatIsTDEEPage = lazy(() => import('./pages/WhatIsTDEEPage'))
const HowManyCaloriesToLoseWeightPage = lazy(() => import('./pages/HowManyCaloriesToLoseWeightPage'))
const BMRFormulaExplainedPage = lazy(() => import('./pages/BMRFormulaExplainedPage'))
const HowMuchToTipPage = lazy(() => import('./pages/HowMuchToTipPage'))
const TippingCultureAroundWorldPage = lazy(() => import('./pages/TippingCultureAroundWorldPage'))
const HowToSplitBillPage = lazy(() => import('./pages/HowToSplitBillPage'))
const WhatIsQRCodePage = lazy(() => import('./pages/WhatIsQRCodePage'))
const HowToCreateQRCodePage = lazy(() => import('./pages/HowToCreateQRCodePage'))
const QRCodeSecurityRisksPage = lazy(() => import('./pages/QRCodeSecurityRisksPage'))
const HowToCreateStrongPasswordPage = lazy(() => import('./pages/HowToCreateStrongPasswordPage'))
const PasswordSecurityGuidePage = lazy(() => import('./pages/PasswordSecurityGuidePage'))
const HowOftenChangePasswordPage = lazy(() => import('./pages/HowOftenChangePasswordPage'))
const HowToCalculateLoanPaymentsPage = lazy(() => import('./pages/HowToCalculateLoanPaymentsPage'))
const FixedVsVariableInterestPage = lazy(() => import('./pages/FixedVsVariableInterestPage'))
const WhatIsCompoundInterestPage = lazy(() => import('./pages/WhatIsCompoundInterestPage'))
const CompoundVsSimpleInterestPage = lazy(() => import('./pages/CompoundVsSimpleInterestPage'))
const HowToCalculateCompoundInterestPage = lazy(() => import('./pages/HowToCalculateCompoundInterestPage'))
const TimeToolsHub = lazy(() => import('./pages/TimeToolsHub'))
const ProductivityToolsHub = lazy(() => import('./pages/ProductivityToolsHub'))
const HealthToolsHub = lazy(() => import('./pages/HealthToolsHub'))
const UtilityToolsHub = lazy(() => import('./pages/UtilityToolsHub'))
const DaysBetweenDatesPage = lazy(() => import('./pages/DaysBetweenDatesPage'))
const MyWidgetsPage = lazy(() => import('./pages/MyWidgetsPage'))
const EmbedPage = lazy(() => import('./pages/EmbedPage'))
const CountryCodesPage = lazy(() => import('./pages/CountryCodesPage'))
const HolidaysHubPage = lazy(() => import('./pages/HolidaysHubPage'))
const CountryProfilePage = lazy(() => import('./pages/CountryProfilePage'))
const HolidayCountryPage = lazy(() => import('./pages/HolidayCountryPage'))
const LongWeekendsPage = lazy(() => import('./pages/LongWeekendsPage'))
const JobsPage = lazy(() => import('./pages/JobsPage'))
const NewsletterPage = lazy(() => import('./pages/NewsletterPage'))
const GlobalPrivacyPolicy = lazy(() => import('./pages/legal/GlobalPrivacyPolicy'))
const GlobalAIPolicy = lazy(() => import('./pages/legal/GlobalAIPolicy'))
const GlobalPrivacyCenter = lazy(() => import('./pages/legal/GlobalPrivacyCenter'))
const UsPrivacyNational = lazy(() => import('./pages/legal/UsPrivacyNational'))
const GdprPrivacy = lazy(() => import('./pages/legal/GdprPrivacy'))
const UkPrivacy = lazy(() => import('./pages/legal/UkPrivacy'))
const AustraliaAddendum = lazy(() => import('./pages/legal/AustraliaAddendum'))
const EuAIAddendum = lazy(() => import('./pages/legal/EuAIAddendum'))
const UkAIAddendum = lazy(() => import('./pages/legal/UkAIAddendum'))
const UsAIAddendum = lazy(() => import('./pages/legal/UsAIAddendum'))
const ChinaAIAddendum = lazy(() => import('./pages/legal/ChinaAIAddendum'))
const AustraliaAIAddendum = lazy(() => import('./pages/legal/AustraliaAIAddendum'))
const LinkPolicy = lazy(() => import('./pages/legal/LinkPolicy'))
const AdvertisingPolicy = lazy(() => import('./pages/legal/AdvertisingPolicy'))
const Disclaimer = lazy(() => import('./pages/legal/Disclaimer'))
const TermsConditions = lazy(() => import('./pages/legal/TermsConditions'))
const PrivacySettings = lazy(() => import('./pages/legal/PrivacySettings'))
const AfricaPrivacy = lazy(() => import('./pages/legal/AfricaPrivacy'))
const IndiaPrivacy = lazy(() => import('./pages/legal/IndiaPrivacy'))
const SingaporePrivacy = lazy(() => import('./pages/legal/SingaporePrivacy'))
const LatinAmericaPrivacy = lazy(() => import('./pages/legal/LatinAmericaPrivacy'))
const MiddleEastPrivacy = lazy(() => import('./pages/legal/MiddleEastPrivacy'))
const SouthAsiaPrivacy = lazy(() => import('./pages/legal/SouthAsiaPrivacy'))
const UsPrivacy = lazy(() => import('./pages/legal/UsPrivacy'))
const UsPrivacyState = lazy(() => import('./pages/legal/UsPrivacyState'))
const AsiaPacificPrivacy = lazy(() => import('./pages/legal/AsiaPacificPrivacy'))

function LanguageDetector() {
  const { setLocale } = useAutoTranslate()
  const { location } = useUser()
  useEffect(() => {
    const countryLangMap = {
      'PK': 'ur', 'IN': 'hi', 'CN': 'zh', 'FR': 'fr', 'DE': 'de',
      'ES': 'es', 'JP': 'ja', 'KR': 'ko', 'BR': 'pt', 'MX': 'es',
      'AR': 'es', 'TR': 'tr', 'RU': 'ru', 'IT': 'it', 'NL': 'nl'
    }
    if (location?.country_code) {
      const targetLang = countryLangMap[location.country_code]
      if (targetLang) setLocale(targetLang)
    }
  }, [location, setLocale])
  return null
}

function AppRoutes() {
  const { pathname } = useLocation()
  const isEmbed = pathname.startsWith('/embed/')
  return (
    <>
      <LanguageDetector />
      <ScrollToTop />
      <Header />
      <RouteErrorBoundary>
        <Suspense fallback={<LoadingFallback />}>
        <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/news" element={<NewsPage />} />
        <Route path="/holidays" element={<HolidaysHubPage />} />
        <Route path="/country/:code" element={<CountryProfilePage />} />
        <Route path="/holidays/:country/:year" element={<HolidayCountryPage />} />
        <Route path="/holidays/:country/:year/long-weekends" element={<LongWeekendsPage />} />
        <Route path="/sleep-debt-calculator" element={<SleepDebtPage />} />
        <Route path="/caffeine-calculator" element={<CaffeinePage />} />
        <Route path="/chronotype-quiz" element={<ChronotypePage />} />
        <Route path="/blog/how-much-sleep-do-you-need" element={<HowMuchSleepDoYouNeedPage />} />
        <Route path="/blog/sleep-debt-and-weight-gain" element={<SleepDebtAndWeightGainPage />} />
        <Route path="/blog/best-time-to-drink-coffee" element={<BestTimeToDrinkCoffeePage />} />
        <Route path="/blog/caffeine-withdrawal" element={<CaffeineWithdrawalPage />} />
        <Route path="/time-zone-converter" element={<TimeZoneConverterPage />} />
        <Route path="/converter" element={<TimeZoneConverterPage />} />
        <Route path="/pomodoro-timer" element={<PomodoroPage />} />
        <Route path="/countdown-timer" element={<CountdownPage />} />
        <Route path="/world-clock" element={<WorldClockPage />} />
        <Route path="/world-clock/:iso2" element={<CountryWorldClockPage />} />
        <Route path="/world-clock/country/:iso2" element={<CountryWorldClockPage />} />
        <Route path="/unit-converter" element={<UnitConverterPage />} />
        <Route path="/word-counter" element={<WordCounterPage />} />
        <Route path="/random-number-generator" element={<RandomNumberPage />} />
        <Route path="/blog/how-to-stop-procrastinating" element={<StopProcrastinatingPage />} />
        <Route path="/blog/best-study-techniques" element={<BestStudyTechniquesPage />} />
        <Route path="/blog/deep-work-guide" element={<DeepWorkGuidePage />} />
        <Route path="/blog/sleep-hygiene-tips" element={<SleepHygieneTipsPage />} />
        <Route path="/blog/best-productivity-apps" element={<BestProductivityAppsPage />} />
        <Route path="/blog/morning-routine-guide" element={<MorningRoutineGuidePage />} />
        <Route path="/age-calculator" element={<AgeCalculatorPage />} />
        <Route path="/bmi-calculator" element={<BmiCalculatorPage />} />
        <Route path="/worldometers" element={<WorldometersHub />} />
        <Route path="/world-population-clock" element={<WorldPopulationClockPage />} />
        <Route path="/births-clock" element={<BirthsClockPage />} />
        <Route path="/deaths-clock" element={<DeathsClockPage />} />
        <Route path="/co2-emissions-clock" element={<Co2EmissionsClockPage />} />
        <Route path="/health-spending-clock" element={<HealthSpendingClockPage />} />
        <Route path="/education-spending-clock" element={<EducationSpendingClockPage />} />
        <Route path="/military-spending-clock" element={<MilitarySpendingClockPage />} />
        <Route path="/books-published-today" element={<BooksPublishedTodayPage />} />
        <Route path="/social-media-posts-today" element={<SocialMediaPostsTodayPage />} />
        <Route path="/tvs-sold-today" element={<TvsSoldTodayPage />} />
        <Route path="/mobile-phones-sold-today" element={<MobilePhonesSoldTodayPage />} />
        <Route path="/hunger-deaths-today" element={<HungerDeathsTodayPage />} />
        <Route path="/undernourished-people" element={<UndernourishedPeoplePage />} />
        <Route path="/newly-obese-today" element={<NewlyObeseTodayPage />} />
        <Route path="/obese-adults-worldwide" element={<ObeseAdultsWorldwidePage />} />
        <Route path="/newly-hungry-today" element={<NewlyHungryTodayPage />} />
        <Route path="/acute-food-insecurity-people" element={<AcuteFoodInsecurityPeoplePage />} />
        <Route path="/cigarettes-smoked-today" element={<CigarettesSmokedTodayPage />} />
        <Route path="/smoking-deaths-today" element={<SmokingDeathsTodayPage />} />
        <Route path="/alcohol-deaths-today" element={<AlcoholDeathsTodayPage />} />
        <Route path="/road-traffic-deaths-today" element={<RoadTrafficDeathsTodayPage />} />
        <Route path="/co2-emissions" element={<Co2ByCountryPage />} />
        <Route path="/co2-emissions/:code" element={<CountryCo2Page />} />
        <Route path="/water" element={<WaterByCountryPage />} />
        <Route path="/water/:code" element={<CountryWaterPage />} />
        <Route path="/gdp" element={<GdpByCountryPage />} />
        <Route path="/gdp/:code" element={<CountryGdpPage />} />
        <Route path="/region" element={<RegionHubPage />} />
        <Route path="/region/:slug" element={<RegionDetailPage />} />
        <Route path="/compare" element={<CompareHubPage />} />
        <Route path="/compare/:metric" element={<CompareMetricPage />} />
        <Route path="/compare/:metric/:pair" element={<ComparePairPage />} />
        <Route path="/life-expectancy" element={<LifeExpectancyByCountryPage />} />
        <Route path="/life-expectancy/:code" element={<CountryLifeExpectancyPage />} />
        <Route path="/gdp-by-year" element={<WorldGdpByYearPage />} />
        <Route path="/gdp-by-year/:year" element={<WorldGdpYearPage />} />
        <Route path="/deaths-by-year" element={<WorldDeathsByYearPage />} />
        <Route path="/deaths-by-year/:year" element={<WorldDeathsYearPage />} />
        <Route path="/life-expectancy-by-year" element={<WorldLifeExpectancyByYearPage />} />
        <Route path="/life-expectancy-by-year/:year" element={<WorldLifeExpectancyYearPage />} />
        <Route path="/forest-by-year" element={<WorldForestByYearPage />} />
        <Route path="/forest-by-year/:year" element={<WorldForestYearPage />} />
        <Route path="/renewable-energy-by-year" element={<WorldRenewableByYearPage />} />
        <Route path="/renewable-energy-by-year/:year" element={<WorldRenewableYearPage />} />
        <Route path="/world-population-by-year" element={<WorldPopulationByYearPage />} />
        <Route path="/world-population-by-year/:year" element={<WorldPopulationYearPage />} />
        <Route path="/co2-by-year" element={<Co2ByYearPage />} />
        <Route path="/co2-by-year/:year" element={<Co2YearPage />} />
        <Route path="/births-by-year" element={<BirthsByYearPage />} />
        <Route path="/births-by-year/:year" element={<BirthsYearPage />} />
        <Route path="/energy" element={<EnergyByCountryPage />} />
        <Route path="/energy/:code" element={<CountryEnergyPage />} />
        <Route path="/energy-use-clock" element={<EnergyUseClockPage />} />
        <Route path="/food-waste-clock" element={<FoodWasteClockPage />} />
        <Route path="/forest-loss-clock" element={<ForestLossClockPage />} />
        <Route path="/plastic-produced-clock" element={<PlasticProducedClockPage />} />
        <Route path="/water-used-clock" element={<WaterUsedClockPage />} />
        <Route path="/renewable-energy-clock" element={<RenewableEnergyClockPage />} />
        <Route path="/emails-sent-today" element={<EmailsSentTodayPage />} />
        <Route path="/google-searches-today" element={<GoogleSearchesTodayPage />} />
        <Route path="/marriages-today" element={<MarriagesTodayPage />} />
        <Route path="/divorces-today" element={<DivorcesTodayPage />} />
        <Route path="/cars-produced-today" element={<CarsProducedTodayPage />} />
        <Route path="/flights-today" element={<FlightsTodayPage />} />
        <Route path="/suicides-today" element={<SuicidesTodayPage />} />
        <Route path="/cancer-deaths-today" element={<CancerDeathsTodayPage />} />
        <Route path="/diabetes-deaths-today" element={<DiabetesDeathsTodayPage />} />
        <Route path="/plastic-bottles-produced-today" element={<PlasticBottlesProducedTodayPage />} />
        <Route path="/gdp-clock" element={<GdpClockPage />} />
        <Route path="/money-spent-online-today" element={<MoneySpentOnlineTodayPage />} />
        <Route path="/population" element={<PopulationByCountryPage />} />
        <Route path="/population/:code" element={<CountryPopulationPage />} />
        <Route path="/macro-calculator" element={<MacroCalculatorPage />} />
        <Route path="/tdee-calculator" element={<TdeeCalculatorPage />} />
        <Route path="/protein-calculator" element={<ProteinCalculatorPage />} />
        <Route path="/pace-calculator" element={<PaceCalculatorPage />} />
        <Route path="/bac-calculator" element={<BacCalculatorPage />} />
        <Route path="/sleep-timer" element={<SleepTimerPage />} />
        <Route path="/sleep-tools" element={<SleepToolsHub />} />
        <Route path="/time-tools" element={<TimeToolsHub />} />
        <Route path="/productivity-tools" element={<ProductivityToolsHub />} />
        <Route path="/health-tools" element={<HealthToolsHub />} />
        <Route path="/utility-tools" element={<UtilityToolsHub />} />
        <Route path="/blog/why-different-countries-have-different-times" element={<WhyDifferentTimesPage />} />
        <Route path="/blog/how-to-schedule-meetings-across-time-zones" element={<ScheduleMeetingsPage />} />
        <Route path="/blog/what-is-pomodoro-technique" element={<WhatIsPomodoroPage />} />
        <Route path="/blog/why-25-minutes-pomodoro" element={<Why25MinutesPage />} />
        <Route path="/blog/best-pomodoro-apps" element={<BestPomodoroAppsPage />} />
                <Route path="/blog" element={<BlogPage />} />
        <Route path="/blog/best-time-to-take-leave-2026" element={<BestTimeToTakeLeave2026Page />} />
        <Route path="/blog/how-to-maximise-long-weekends-2026" element={<LongWeekends2026Page />} />
        <Route path="/blog/countries-with-most-public-holidays" element={<MostPublicHolidaysPage />} />
        <Route path="/blog/public-holidays-2026-comparison" element={<PublicHolidaysComparisonPage />} />
        <Route path="/blog/sync-team-time-off-time-zones" element={<SyncTeamTimeOffPage />} />
        <Route path="/blog/how-to-convert-time-zones-international-meetings" element={<InternationalMeetingsPage />} />
        <Route path="/blog/remote-work-time-zones" element={<RemoteWorkTimeZonesPage />} />
        <Route path="/finance-tools" element={<FinanceToolsHub />} />
        <Route path="/compound-interest-calculator" element={<CompoundInterestPage />} />
        <Route path="/loan-calculator" element={<LoanCalculatorPage />} />
        <Route path="/auto-loan-calculator" element={<AutoLoanCalculatorPage />} />
        <Route path="/credit-card-payoff-calculator" element={<CreditCardPayoffCalculatorPage />} />
        <Route path="/retirement-calculator" element={<RetirementCalculatorPage />} />
        <Route path="/investment-calculator" element={<InvestmentCalculatorPage />} />
        <Route path="/grade-calculator" element={<GradeCalculatorPage />} />
        <Route path="/roman-numeral-converter" element={<RomanNumeralCalculatorPage />} />
        <Route path="/pregnancy-due-date-calculator" element={<PregnancyDueDateCalculatorPage />} />
        <Route path="/ovulation-calculator" element={<OvulationCalculatorPage />} />
        <Route path="/area-calculator" element={<AreaCalculatorPage />} />
        <Route path="/volume-calculator" element={<VolumeCalculatorPage />} />
        <Route path="/triangle-calculator" element={<TriangleCalculatorPage />} />
        <Route path="/slope-calculator" element={<SlopeCalculatorPage />} />
        <Route path="/quadratic-calculator" element={<QuadraticCalculatorPage />} />
        <Route path="/binary-hex-converter" element={<BinaryHexConverterPage />} />
        <Route path="/debt-payoff-calculator" element={<DebtPayoffCalculatorPage />} />
        <Route path="/down-payment-calculator" element={<DownPaymentCalculatorPage />} />
        <Route path="/amortization-calculator" element={<AmortizationCalculatorPage />} />
        <Route path="/cagr-calculator" element={<CAGRCalculatorPage />} />
        <Route path="/auto-loan-calculator/:code" element={<CountryCalculatorPage kind="auto-loan-calculator" />} />
        <Route path="/credit-card-payoff-calculator/:code" element={<CountryCalculatorPage kind="credit-card-payoff-calculator" />} />
        <Route path="/retirement-calculator/:code" element={<CountryCalculatorPage kind="retirement-calculator" />} />
        <Route path="/investment-calculator/:code" element={<CountryCalculatorPage kind="investment-calculator" />} />
        <Route path="/pregnancy-due-date-calculator/:code" element={<CountryCalculatorPage kind="pregnancy-due-date-calculator" />} />
        <Route path="/ovulation-calculator/:code" element={<CountryCalculatorPage kind="ovulation-calculator" />} />
        <Route path="/grade-calculator/:code" element={<CountryCalculatorPage kind="grade-calculator" />} />
        <Route path="/logarithm-calculator" element={<LogarithmCalculatorPage />} />
        <Route path="/scientific-notation-converter" element={<ScientificNotationConverterPage />} />
        <Route path="/significant-figures-calculator" element={<SignificantFiguresCalculatorPage />} />
        <Route path="/percent-error-calculator" element={<PercentErrorCalculatorPage />} />
        <Route path="/gcd-lcm-calculator" element={<GcdLcmCalculatorPage />} />
        <Route path="/prime-factorization-calculator" element={<PrimeFactorizationCalculatorPage />} />
        <Route path="/matrix-calculator" element={<MatrixCalculatorPage />} />
        <Route path="/exponent-root-calculator" element={<ExponentRootCalculatorPage />} />
        <Route path="/permutation-combination-calculator" element={<PermutationCombinationCalculatorPage />} />
        <Route path="/probability-calculator" element={<ProbabilityCalculatorPage />} />
        <Route path="/temperature-converter" element={<TemperatureConverterPage />} />
        <Route path="/length-converter" element={<LengthConverterPage />} />
        <Route path="/weight-converter" element={<WeightConverterPage />} />
        <Route path="/data-storage-converter" element={<DataStorageConverterPage />} />
        <Route path="/speed-converter" element={<SpeedConverterPage />} />
        <Route path="/markup-calculator" element={<MarkupCalculatorPage />} />
        <Route path="/break-even-calculator" element={<BreakEvenCalculatorPage />} />
        <Route path="/payback-period-calculator" element={<PaybackPeriodCalculatorPage />} />
        <Route path="/future-value-calculator" element={<FutureValueCalculatorPage />} />
        <Route path="/present-value-calculator" element={<PresentValueCalculatorPage />} />
        <Route path="/password-generator" element={<PasswordGeneratorPage />} />
        <Route path="/qr-code-generator" element={<QRCodeGeneratorPage />} />
        <Route path="/tip-calculator" element={<TipCalculatorPage />} />
        <Route path="/calorie-calculator" element={<CalorieCalculatorPage />} />
        <Route path="/water-intake-calculator" element={<WaterIntakePage />} />
        <Route path="/body-fat-calculator" element={<BodyFatPage />} />
        <Route path="/ideal-weight-calculator" element={<IdealWeightPage />} />
        <Route path="/time/:pair" element={<TimePairPage />} />
        <Route path="/fraction-calculator" element={<FractionCalculatorPage />} />
        <Route path="/standard-deviation-calculator" element={<StandardDeviationPage />} />
        <Route path="/scientific-calculator" element={<ScientificCalculatorPage />} />
        <Route path="/average-calculator" element={<AverageCalculatorPage />} />
        <Route path="/ratio-calculator" element={<RatioCalculatorPage />} />
        <Route path="/blog/how-to-simplify-ratio" element={<HowToSimplifyRatioPage />} />
        <Route path="/blog/how-to-solve-proportions" element={<HowToSolveProportionsPage />} />
        <Route path="/blog/ratio-in-real-life" element={<RatioInRealLifePage />} />
        <Route path="/blog/how-to-calculate-mean" element={<HowToCalculateMeanPage />} />
        <Route path="/blog/mean-vs-median" element={<MeanVsMedianPage />} />
        <Route path="/blog/what-is-mode-statistics" element={<WhatIsModeStatisticsPage />} />
        <Route path="/blog/how-to-use-scientific-calculator" element={<HowToUseScientificCalculatorPage />} />
        <Route path="/blog/degrees-vs-radians" element={<DegreesVsRadiansPage />} />
        <Route path="/blog/what-is-logarithm" element={<WhatIsLogarithmPage />} />
        <Route path="/blog/what-is-standard-deviation" element={<WhatIsStandardDeviationPage />} />
        <Route path="/blog/population-vs-sample-standard-deviation" element={<PopulationVsSampleSDPage />} />
        <Route path="/blog/how-to-calculate-variance" element={<HowToCalculateVariancePage />} />
        <Route path="/blog/how-to-add-fractions" element={<HowToAddFractionsPage />} />
        <Route path="/blog/how-to-simplify-fractions" element={<HowToSimplifyFractionsPage />} />
        <Route path="/blog/fraction-to-decimal" element={<FractionToDecimalPage />} />
        <Route path="/blog/how-to-calculate-ideal-weight" element={<HowToCalculateIdealWeightPage />} />
        <Route path="/blog/healthy-bmi-range" element={<HealthyBMIRangePage />} />
        <Route path="/blog/waist-to-height-ratio" element={<WaistToHeightRatioPage />} />
        <Route path="/blog/how-to-measure-body-fat" element={<HowToMeasureBodyFatPage />} />
        <Route path="/blog/body-fat-percentage-chart" element={<BodyFatPercentageChartPage />} />
        <Route path="/blog/bmi-vs-body-fat" element={<BMIVsBodyFatPage />} />
        <Route path="/blog/how-much-water-should-i-drink" element={<HowMuchWaterShouldIDrinkPage />} />
        <Route path="/blog/dehydration-signs" element={<DehydrationSignsPage />} />
        <Route path="/blog/does-coffee-dehydrate-you" element={<DoesCoffeeDehydrateYouPage />} />
        <Route path="/blog/what-is-tdee" element={<WhatIsTDEEPage />} />
        <Route path="/blog/how-many-calories-to-lose-weight" element={<HowManyCaloriesToLoseWeightPage />} />
        <Route path="/blog/bmr-formula-explained" element={<BMRFormulaExplainedPage />} />
        <Route path="/blog/how-much-to-tip" element={<HowMuchToTipPage />} />
        <Route path="/blog/tipping-culture-around-world" element={<TippingCultureAroundWorldPage />} />
        <Route path="/blog/how-to-split-bill" element={<HowToSplitBillPage />} />
        <Route path="/blog/what-is-qr-code" element={<WhatIsQRCodePage />} />
        <Route path="/blog/how-to-create-qr-code" element={<HowToCreateQRCodePage />} />
        <Route path="/blog/qr-code-security-risks" element={<QRCodeSecurityRisksPage />} />
        <Route path="/blog/how-to-create-strong-password" element={<HowToCreateStrongPasswordPage />} />
        <Route path="/blog/password-security-guide" element={<PasswordSecurityGuidePage />} />
        <Route path="/blog/how-often-change-password" element={<HowOftenChangePasswordPage />} />
        <Route path="/blog/how-to-calculate-loan-payments" element={<HowToCalculateLoanPaymentsPage />} />
        <Route path="/blog/fixed-vs-variable-interest-rates" element={<FixedVsVariableInterestPage />} />
        <Route path="/blog/what-is-compound-interest" element={<WhatIsCompoundInterestPage />} />
        <Route path="/blog/compound-interest-vs-simple-interest" element={<CompoundVsSimpleInterestPage />} />
        <Route path="/blog/how-to-calculate-compound-interest" element={<HowToCalculateCompoundInterestPage />} />
        <Route path="/math-tools" element={<MathToolsHub />} />
        <Route path="/developer-tools" element={<DeveloperToolsHub />} />
        <Route path="/lifestyle-tools" element={<LifestyleToolsHub />} />
        <Route path="/blog/what-is-sleep-debt" element={<WhatIsSleepDebtPage />} />
        <Route path="/blog/how-to-recover-from-sleep-debt" element={<HowToRecoverFromSleepDebtPage />} />
        <Route path="/blog/sleep-debt-by-age" element={<SleepDebtByAgePage />} />
        <Route path="/blog/caffeine-half-life" element={<CaffeineHalfLifePage />} />
        <Route path="/blog/when-to-stop-drinking-coffee" element={<WhenToStopDrinkingCoffeePage />} />
        <Route path="/blog/caffeine-in-common-drinks" element={<CaffeineInCommonDrinksPage />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/sitemap" element={<SiteMap />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/my-bookings" element={<MyBookingsPage />} />
        <Route path="/my-calculations" element={<MyCalculationsPage />} />
        <Route path="/compare-calculations" element={<CompareCalculationsPage />} />
        <Route path="/salary" element={<SalaryPage />} />
        <Route path="/salary/:country" element={<CountrySalaryPage />} />
        <Route path="/ict" element={<IctHubPage />} />
        <Route path="/ict/:slug" element={<IctToolPage />} />
        <Route path="/forum" element={<ForumPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/premium" element={<PremiumPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/flight-map" element={<FlightMap />} />
        <Route path="/flights" element={<FlightsPage />} />
        <Route path="/flights/:origin/:destination" element={<FlightRoutePage />} />
        <Route path="/timers" element={<TimersPage />} />
        <Route path="/live-data" element={<LiveDataPage />} />
        <Route path="/widgets" element={<WidgetsPage />} />
        <Route path="/calculators" element={<CalculatorsPage />} />
        <Route path="/mortgage" element={<MortgageHubPage />} />
        <Route path="/mortgage/australia" element={<AustraliaMortgagePage />} />
        <Route path="/mortgage/usa" element={<UsaMortgagePage />} />
        <Route path="/mortgage/uk" element={<UkMortgagePage />} />
        <Route path="/mortgage/canada" element={<CanadaMortgagePage />} />
        <Route path="/mortgage/india" element={<IndiaMortgagePage />} />
        <Route path="/mortgage/europe" element={<EuropeanHubPage />} />
        <Route path="/mortgage/asia-pacific" element={<AsiaPacificHubPage />} />
        <Route path="/mortgage/:country" element={<CountryMortgagePage />} />
        <Route path="/mortgage/rental-yield" element={<RentalYieldPage />} />
        <Route path="/mortgage/:country/rental-yield" element={<CountryRentalYieldPage />} />
        <Route path="/mortgage/first-home-buyer" element={<FirstHomeBuyerPage />} />
        <Route path="/mortgage/:country/first-home-buyer" element={<CountryFirstHomeBuyerPage />} />
        <Route path="/mortgage/sell-vs-refinance" element={<SellVsRefinancePage />} />
        <Route path="/mortgage/:country/sell-vs-refinance" element={<CountrySellVsRefinancePage />} />
        <Route path="/mortgage/home-equity" element={<HomeEquityPage />} />
        <Route path="/mortgage/:country/home-equity" element={<CountryHomeEquityPage />} />
        <Route path="/mortgage/india/emi" element={<InEmiPage />} />
        <Route path="/mortgage/india/prepayment" element={<InPrepaymentPage />} />
        <Route path="/mortgage/india/balance-transfer" element={<InBalanceTransferPage />} />
        <Route path="/mortgage/india/eligibility" element={<InEligibilityPage />} />
        <Route path="/mortgage/india/stamp-duty" element={<InStampDutyPage />} />
        <Route path="/mortgage/india/tax-benefit" element={<InTaxBenefitPage />} />
        <Route path="/mortgage/canada/mortgage-payment" element={<CaMortgagePaymentPage />} />
        <Route path="/mortgage/canada/cmhc-insurance" element={<CaCmhcPage />} />
        <Route path="/mortgage/canada/land-transfer-tax" element={<CaLandTransferTaxPage />} />
        <Route path="/mortgage/canada/affordability" element={<CaAffordabilityPage />} />
        <Route path="/mortgage/canada/bi-weekly-accelerated" element={<CaBiWeeklyAcceleratedPage />} />
        <Route path="/mortgage/canada/renewal" element={<CaRenewalPage />} />
        <Route path="/mortgage/uk/repayment" element={<UkRepaymentPage />} />
        <Route path="/mortgage/uk/overpayment" element={<UkOverpaymentPage />} />
        <Route path="/mortgage/uk/stamp-duty" element={<UkStampDutyPage />} />
        <Route path="/mortgage/uk/interest-only" element={<UkInterestOnlyPage />} />
        <Route path="/mortgage/uk/remortgage" element={<UkRemortgagePage />} />
        <Route path="/mortgage/uk/buy-to-let" element={<UkBuyToLetPage />} />
        <Route path="/mortgage/usa/amortization" element={<UsMortgagePage />} />
        <Route path="/mortgage/usa/biweekly" element={<UsBiWeeklyPage />} />
        <Route path="/mortgage/usa/fha" element={<UsFhaPage />} />
        <Route path="/mortgage/usa/va" element={<UsVaPage />} />
        <Route path="/mortgage/usa/pmi" element={<UsPmiPage />} />
        <Route path="/mortgage/usa/property-tax" element={<UsPropertyTaxPage />} />
        <Route path="/mortgage/usa/rent-vs-buy" element={<UsRentVsBuyPage />} />
        <Route path="/mortgage/usa/refinance" element={<UsRefinancePage />} />
        <Route path="/mortgage/australia/home-loan-repayment" element={<HomeLoanRepaymentPage />} />
        <Route path="/mortgage/australia/offset-account" element={<OffsetAccountPage />} />
        <Route path="/mortgage/australia/stamp-duty" element={<StampDutyPage />} />
        <Route path="/mortgage/australia/lmi" element={<LmiCalculatorPage />} />
        <Route path="/mortgage/australia/novated-lease" element={<NovatedLeasePage />} />
        <Route path="/mortgage/australia/extra-repayment" element={<ExtraRepaymentPage />} />
        <Route path="/mortgage/australia/borrowing-power" element={<BorrowingPowerPage />} />
        <Route path="/mortgage/australia/interest-only" element={<InterestOnlyPage />} />
        <Route path="/mortgage/australia/first-home-guarantee" element={<FirstHomeGuaranteePage />} />
        <Route path="/mortgage/australia/split-loan" element={<SplitLoanPage />} />
        <Route path="/hours-calculator" element={<HoursCalculatorPage />} />
        <Route path="/percentage-calculator" element={<PercentageCalculatorPage />} />
        <Route path="/time-card-calculator" element={<TimeCardCalculatorPage />} />
        
        <Route path="/days-between-dates" element={<DaysBetweenDatesPage />} />
        <Route path="/my-widgets" element={<MyWidgetsPage />} />
        <Route path="/embed/:type" element={<EmbedPage />} />
        <Route path="/embed-docs" element={<EmbedDocsPage />} />
        <Route path="/blog/how-to-convert-currency" element={<HowToConvertCurrencyPage />} />
        <Route path="/blog/best-currency-converter-tools" element={<BestCurrencyConverterToolsPage />} />
        <Route path="/blog/mid-market-exchange-rate" element={<MidMarketRatePage />} />
        <Route path="/date-duration-calculator" element={<DateDurationPage />} />
        <Route path="/business-days-calculator" element={<BusinessDaysPage />} />
        <Route path="/time-duration-calculator" element={<TimeDurationPage />} />
        <Route path="/unix-timestamp-converter" element={<UnixTimestampPage />} />
        <Route path="/gpa-calculator" element={<GpaCalculatorPage />} />
        <Route path="/blog/date-duration-guide" element={<DateDurationGuidePage />} />
        <Route path="/blog/business-days-guide" element={<BusinessDaysGuidePage />} />
        <Route path="/blog/add-subtract-time-guide" element={<AddSubtractTimeGuidePage />} />
        <Route path="/blog/unix-timestamp-guide" element={<UnixTimestampGuidePage />} />
        <Route path="/blog/how-to-calculate-gpa" element={<HowToCalculateGpaPage />} />
        <Route path="/blog/inflation-guide" element={<InflationGuidePage />} />
        <Route path="/blog/sales-tax-guide" element={<SalesTaxGuidePage />} />
        <Route path="/blog/discount-guide" element={<DiscountGuidePage />} />
        <Route path="/blog/roi-guide" element={<RoiGuidePage />} />
        <Route path="/blog/simple-interest-guide" element={<SimpleInterestGuidePage />} />
        <Route path="/blog/macro-guide" element={<MacroGuidePage />} />
        <Route path="/blog/tdee-guide" element={<TdeeGuidePage />} />
        <Route path="/blog/protein-guide" element={<ProteinGuidePage />} />
        <Route path="/blog/pace-guide" element={<PaceGuidePage />} />
        <Route path="/blog/bac-guide" element={<BacGuidePage />} />
        <Route path="/blog/world-population-explained" element={<WorldPopulationExplainedPage />} />
        <Route path="/blog/how-many-babies-born-per-day" element={<HowManyBabiesBornPage />} />
        <Route path="/blog/how-many-people-die-per-day" element={<HowManyPeopleDiePage />} />
        <Route path="/blog/co2-emissions-per-second" element={<Co2EmissionsPerSecondPage />} />
        <Route path="/blog/where-does-co2-come-from" element={<WhereDoesCo2ComeFromPage />} />
        <Route path="/blog/global-energy-use-explained" element={<GlobalEnergyUsePage />} />
        <Route path="/blog/food-waste-climate-impact" element={<FoodWasteClimatePage />} />
        <Route path="/blog/deforestation-rates-explained" element={<DeforestationRatesPage />} />
        <Route path="/blog/how-much-plastic-produced-daily" element={<HowMuchPlasticProducedPage />} />
        <Route path="/blog/global-gdp-explained" element={<GlobalGdpExplainedPage />} />
        <Route path="/inflation-calculator" element={<InflationCalculatorPage />} />
        <Route path="/sales-tax-calculator" element={<SalesTaxCalculatorPage />} />
        <Route path="/discount-calculator" element={<DiscountCalculatorPage />} />
        <Route path="/roi-calculator" element={<RoiCalculatorPage />} />
        <Route path="/simple-interest-calculator" element={<SimpleInterestCalculatorPage />} />
        <Route path="/country-codes" element={<CountryCodesPage />} />
        <Route path="/jobs" element={<JobsPage />} />
        <Route path="/newsletter" element={<NewsletterPage />} />
        <Route path="/privacy" element={<GlobalPrivacyPolicy />} />
        <Route path="/global-ai" element={<GlobalAIPolicy />} />
        <Route path="/global-privacy" element={<GlobalPrivacyCenter />} />
        <Route path="/us-privacy-national" element={<UsPrivacyNational />} />
        <Route path="/gdpr-privacy" element={<GdprPrivacy />} />
        <Route path="/uk-privacy" element={<UkPrivacy />} />
        <Route path="/australia-privacy" element={<AustraliaAddendum />} />
        <Route path="/ai-eu" element={<EuAIAddendum />} />
        <Route path="/ai-uk" element={<UkAIAddendum />} />
        <Route path="/ai-us" element={<UsAIAddendum />} />
        <Route path="/ai-china" element={<ChinaAIAddendum />} />
        <Route path="/ai-australia" element={<AustraliaAIAddendum />} />
        <Route path="/link-policy" element={<LinkPolicy />} />
        <Route path="/advertising" element={<AdvertisingPolicy />} />
        <Route path="/disclaimer" element={<Disclaimer />} />
        <Route path="/terms" element={<TermsConditions />} />
        <Route path="/privacy-settings" element={<PrivacySettings />} />
        <Route path="/africa-privacy" element={<AfricaPrivacy />} />
        <Route path="/india-privacy" element={<IndiaPrivacy />} />
        <Route path="/singapore-privacy" element={<SingaporePrivacy />} />
        <Route path="/latin-america-privacy" element={<LatinAmericaPrivacy />} />
        <Route path="/middle-east-privacy" element={<MiddleEastPrivacy />} />
        <Route path="/south-asia-privacy" element={<SouthAsiaPrivacy />} />
        <Route path="/us-privacy" element={<UsPrivacy />} />
        <Route path="/us-privacy-state" element={<UsPrivacyState />} />
        <Route path="/asia-pacific-privacy" element={<AsiaPacificPrivacy />} />
      
        <Route path="/blog/germany-income-tax-brackets" element={<GermanyTaxBracketsPage />} />
        <Route path="/blog/germany-take-home-pay" element={<GermanyTakeHomePayPage />} />
        <Route path="/blog/germany-social-contributions" element={<GermanySocialContributionsPage />} />
        <Route path="/blog/france-income-tax-brackets" element={<FranceTaxBracketsPage />} />
        <Route path="/blog/france-take-home-pay" element={<FranceTakeHomePayPage />} />
        <Route path="/blog/france-social-contributions" element={<FranceSocialContributionsPage />} />
        <Route path="/blog/netherlands-income-tax-brackets" element={<NetherlandsTaxBracketsPage />} />
        <Route path="/blog/netherlands-take-home-pay" element={<NetherlandsTakeHomePayPage />} />
        <Route path="/blog/netherlands-30-percent-ruling" element={<Netherlands30PercentRulingPage />} />
      
        <Route path="/blog/australia-income-tax-brackets" element={<AustraliaTaxBracketsPage />} />
        <Route path="/blog/australia-take-home-pay" element={<AustraliaTakeHomePayPage />} />
        <Route path="/blog/australia-medicare-levy" element={<AustraliaMedicareLevyPage />} />
        <Route path="/blog/new-zealand-income-tax-brackets" element={<NewZealandTaxBracketsPage />} />
        <Route path="/blog/new-zealand-take-home-pay" element={<NewZealandTakeHomePayPage />} />
        <Route path="/blog/new-zealand-acc-levy" element={<NewZealandACCLevyPage />} />
      
        <Route path="/blog/canada-income-tax-brackets" element={<CanadaTaxBracketsPage />} />
        <Route path="/blog/canada-take-home-pay" element={<CanadaTakeHomePayPage />} />
        <Route path="/blog/canada-cpp-ei" element={<CanadaCPPEIPage />} />
      
        <Route path="/blog/uae-0-percent-income-tax" element={<UAETaxFreePage />} />
        <Route path="/blog/uae-take-home-pay" element={<UAETakeHomePayPage />} />
        <Route path="/blog/uae-cost-of-living-salary" element={<UAECostOfLivingPage />} />
        <Route path="/blog/saudi-arabia-0-percent-income-tax" element={<SaudiTaxFreePage />} />
        <Route path="/blog/saudi-arabia-take-home-pay" element={<SaudiTakeHomePayPage />} />
        <Route path="/blog/saudi-arabia-gosi" element={<SaudiGOSIPage />} />
        <Route path="/blog/qatar-0-percent-income-tax" element={<QatarTaxFreePage />} />
        <Route path="/blog/qatar-take-home-pay" element={<QatarTakeHomePayPage />} />
        <Route path="/blog/qatar-grsia" element={<QatarGRSIAPage />} />
      
        <Route path="/blog/japan-income-tax-brackets" element={<JapanTaxBracketsPage />} />
        <Route path="/blog/japan-take-home-pay" element={<JapanTakeHomePayPage />} />
        <Route path="/blog/japan-social-insurance" element={<JapanSocialInsurancePage />} />
        <Route path="/blog/singapore-income-tax-brackets" element={<SingaporeTaxBracketsPage />} />
        <Route path="/blog/singapore-take-home-pay" element={<SingaporeTakeHomePayPage />} />
        <Route path="/blog/singapore-cpf" element={<SingaporeCPFPage />} />
      
        <Route path="/blog/india-income-tax-brackets" element={<IndiaTaxBracketsPage />} />
        <Route path="/blog/india-take-home-pay" element={<IndiaTakeHomePayPage />} />
        <Route path="/blog/india-epf-cess" element={<IndiaEPFCessPage />} />
        <Route path="/blog/pakistan-income-tax-brackets" element={<PakistanTaxBracketsPage />} />
        <Route path="/blog/pakistan-take-home-pay" element={<PakistanTakeHomePayPage />} />
        <Route path="/blog/pakistan-filer-vs-nonfiler" element={<PakistanFilerPage />} />
        <Route path="/blog/bangladesh-income-tax-brackets" element={<BangladeshTaxBracketsPage />} />
        <Route path="/blog/bangladesh-take-home-pay" element={<BangladeshTakeHomePayPage />} />
        <Route path="/blog/bangladesh-investment-tax-rebate" element={<BangladeshTaxRebatePage />} />
      
        <Route path="/blog/nigeria-income-tax-brackets" element={<NigeriaTaxBracketsPage />} />
        <Route path="/blog/nigeria-take-home-pay" element={<NigeriaTakeHomePayPage />} />
        <Route path="/blog/nigeria-pension-nhf" element={<NigeriaPensionPage />} />
        <Route path="/blog/kenya-income-tax-brackets" element={<KenyaTaxBracketsPage />} />
        <Route path="/blog/kenya-take-home-pay" element={<KenyaTakeHomePayPage />} />
        <Route path="/blog/kenya-nssf-shif-housing" element={<KenyaDeductionsPage />} />
        <Route path="/blog/south-africa-income-tax-brackets" element={<SouthAfricaTaxBracketsPage />} />
        <Route path="/blog/south-africa-take-home-pay" element={<SouthAfricaTakeHomePayPage />} />
        <Route path="/blog/south-africa-uif" element={<SouthAfricaUIFPage />} />
      
        <Route path="/blog/brazil-income-tax-brackets" element={<BrazilTaxBracketsPage />} />
        <Route path="/blog/brazil-take-home-pay" element={<BrazilTakeHomePayPage />} />
        <Route path="/blog/brazil-inss-irrf" element={<BrazilINSSIRRFPage />} />
        <Route path="/blog/mexico-income-tax-brackets" element={<MexicoTaxBracketsPage />} />
        <Route path="/blog/mexico-take-home-pay" element={<MexicoTakeHomePayPage />} />
        <Route path="/blog/mexico-isr-imss" element={<MexicoISRIMSSPage />} />
      
        <Route path="/meeting-hour-strip" element={<MeetingHourStripPage />} />
        <Route path="/blog/how-to-schedule-global-meeting" element={<HowToScheduleGlobalMeetingPage />} />
        <Route path="/blog/best-time-global-team-meeting" element={<BestTimeGlobalMeetingPage />} />
        <Route path="/blog/work-hours-overlap-guide" element={<WorkHoursOverlapPage />} />
      
        <Route path="/meeting-planner" element={<MeetingPlannerPage />} />
        <Route path="/blog/meeting-planner-guide" element={<MeetingPlannerGuidePage />} />
        <Route path="/blog/best-time-europe-asia-meeting" element={<BestTimeEuropeAsiaMeetingPage />} />
        <Route path="/blog/best-time-us-europe-meeting" element={<BestTimeUSEuropeMeetingPage />} />
      
        <Route path="/team-alignment" element={<TeamAlignmentPage />} />
        <Route path="/blog/team-alignment-guide" element={<TeamAlignmentGuidePage />} />
        <Route path="/blog/remote-team-time-zones" element={<RemoteTeamTimeZonesPage />} />
        <Route path="/blog/distributed-team-meetings" element={<DistributedTeamMeetingsPage />} />
      
        <Route path="/blog/world-clock-guide" element={<WorldClockGuidePage />} />
        <Route path="/blog/best-cities-remote-work" element={<BestCitiesRemoteWorkPage />} />
        <Route path="/blog/day-night-around-world" element={<DayNightAroundWorldPage />} />
      
        <Route path="/blog/computer-clock-drift" element={<ComputerClockDriftPage />} />
        <Route path="/blog/how-utc-time-works" element={<HowUTCWorksPage />} />
        <Route path="/blog/accurate-time-remote-work" element={<AccurateTimeRemoteWorkPage />} />
      
        <Route path="/meeting-heatmap" element={<MeetingHeatmapPage />} />
        <Route path="/blog/how-to-read-meeting-heatmap" element={<ReadingHeatmapGuidePage />} />
        <Route path="/blog/best-time-meeting-multiple-cities" element={<BestTimeMultipleCitiesPage />} />
        <Route path="/blog/meeting-export-tips" element={<MeetingExportTipsPage />} />
      
        <Route path="/support" element={<SupportPage />} />
      
        <Route path="/country-codes/:c2" element={<CountryPage />} />
      
        <Route path="/api-docs" element={<ApiDocsPage />} />
      
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/calendar/:year/:month" element={<CalendarMonthPage />} />
        <Route path="/week-numbers" element={<WeekNumbersPage />} />
        <Route path="/months" element={<MonthsIndexPage />} />
      
        <Route path="/astronomy" element={<AstronomyPage />} />
        <Route path="/sun" element={<CitySunPage />} />
        <Route path="/sun/:city" element={<CitySunPage />} />
        <Route path="/moon" element={<CityMoonPage />} />
        <Route path="/moon/:city" element={<CityMoonPage />} />
        <Route path="/time-in" element={<TimeInCityPage />} />
        <Route path="/time-in/:city" element={<TimeInCityPage />} />
      
        <Route path="/services" element={<ServicesPage />} />
      
        <Route path="/weather" element={<WeatherPage />} />
        <Route path="/weather/:city" element={<CityWeatherPage />} />
      
        <Route path="/weather/:city/climate" element={<CityClimatePage />} />
      
        <Route path="/weather/:city/air" element={<AirQualityPage />} />
      
        <Route path="/weather/:city/hourly" element={<HourlyForecastPage />} />
      
        <Route path="/weather/:city/historic" element={<HistoricWeatherPage />} />
      
        <Route path="/weather/:city/vs/:city2" element={<WeatherVsPage />} />
      
        <Route path="/cars" element={<CarsPage />} />
        <Route path="/currency-converter" element={<CurrencyConverterPage />} />
        <Route path="/currency/:pair" element={<CurrencyPairPage />} />
        <Route path="/widgets/test" element={<WidgetTestPage />} />
      </Routes>
        </Suspense>
        </RouteErrorBoundary>
      {!isEmbed && <Footer />}
    </>
  )
}

import RouteErrorBoundary from './components/RouteErrorBoundary'
import LoadingFallback from './components/LoadingFallback'

import {  } from 'lucide-react'

export default function App() {
  const isEmbedPage = typeof window !== 'undefined' && window.location.pathname.startsWith('/embed/')
  return (
    <UserProvider>
      <AuthProvider>
        <CalculationProvider>
        {isEmbedPage ? (
          <Router>
            <div className="min-h-screen bg-background text-foreground relative">
              {/* Subtle radial glow ÃƒÆ’Ã‚Â¢Ã¢â€šÂ¬\u201d no more grid cubes */}
              <div className="fixed inset-0 pointer-events-none -z-10">
                <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-teal-500/5 rounded-full blur-3xl"></div>
              </div>
              <AppRoutes />
            </div>
          </Router>
        ) : (
          <AutoTranslateProvider apiKey={import.meta.env.VITE_LINGO_API_KEY || ''} sourceLocale="en" availableLocales="all">
            <Router>
            <div className="min-h-screen bg-background text-foreground relative">
              {/* Subtle radial glow ÃƒÆ’Ã‚Â¢Ã¢â€šÂ¬\u201d no more grid cubes */}
              <div className="fixed inset-0 pointer-events-none -z-10">
                <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-teal-500/5 rounded-full blur-3xl"></div>
              </div>
              <AppRoutes />
            </div>
          </Router>
          </AutoTranslateProvider>
        )}
      </CalculationProvider>
      </AuthProvider>
    </UserProvider>
  )
}
