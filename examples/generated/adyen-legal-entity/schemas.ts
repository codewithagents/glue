// Bootstrapped by @codewithagents/openapi-gen — this file is yours.
// Add error messages, refinements, and business rules freely.
// Re-running the generator will NOT overwrite this file.
// Requires zod v4 (z.record takes two args, z.lazy for circular refs).
//
// Object schemas include .passthrough() so new optional server fields are
// preserved when the API evolves — without breaking existing consumers.
//
// Form wizard pattern: extend API schemas for UI-only fields.
// The generated client strips unknown keys before sending, so extra form
// fields (step, confirmCheckbox, etc.) are never leaked to the backend:
//
//   export const CreateOrderFormSchema = CreateOrderSchema.extend({
//     step: z.number(),
//     confirmTerms: z.boolean(),
//   })
//
// Use CreateOrderFormSchema for React Hook Form validation, then pass the
// full form values to the generated client — it strips to API fields only.

import { z } from 'zod'

export const AULocalAccountIdentificationSchema = z.object({
  accountNumber: z.string().min(5).max(9),
  bsbCode: z.string().min(6).max(6),
  type: z.enum(["auLocal"])
}).passthrough()

export const AcceptTermsOfServiceRequestSchema = z.object({
  acceptedBy: z.string(),
  ipAddress: z.string().optional()
}).passthrough()

export const AcceptTermsOfServiceResponseSchema = z.object({
  acceptedBy: z.string().optional(),
  id: z.string().optional(),
  ipAddress: z.string().optional(),
  language: z.string().optional(),
  termsOfServiceDocumentId: z.string().optional(),
  type: z.enum(["adyenAccount", "adyenCapital", "adyenCard", "adyenChargeCard", "adyenForPlatformsAdvanced", "adyenForPlatformsManage", "adyenFranchisee", "adyenIssuing", "adyenPccr", "kycOnInvite"]).optional()
}).passthrough()

export const AdditionalBankIdentificationSchema = z.object({
  code: z.string().optional(),
  type: z.enum(["auBsbCode", "caRoutingNumber", "gbSortCode", "usRoutingNumber"]).optional()
}).passthrough()

export const AddressSchema = z.object({
  city: z.string().optional(),
  country: z.string(),
  postalCode: z.string().optional(),
  stateOrProvince: z.string().optional(),
  street: z.string().optional(),
  street2: z.string().optional()
}).passthrough()

export const AmountSchema = z.object({
  currency: z.string().optional(),
  value: z.number().optional()
}).passthrough()

export const AttachmentSchema = z.object({
  content: z.string(),
  contentType: z.string().optional(),
  filename: z.string().optional(),
  pageName: z.string().optional(),
  pageType: z.string().optional()
}).passthrough()

export const BirthDataSchema = z.object({
  dateOfBirth: z.string().optional()
}).passthrough()

export const CALocalAccountIdentificationSchema = z.object({
  accountNumber: z.string().min(5).max(12),
  accountType: z.enum(["checking", "savings"]).optional(),
  institutionNumber: z.string().min(3).max(3),
  transitNumber: z.string().min(5).max(5),
  type: z.enum(["caLocal"])
}).passthrough()

export const CZLocalAccountIdentificationSchema = z.object({
  accountNumber: z.string().min(2).max(17),
  bankCode: z.string().min(4).max(4),
  type: z.enum(["czLocal"])
}).passthrough()

export const CalculatePciStatusRequestSchema = z.object({
  additionalSalesChannels: z.array(z.enum(["eCommerce", "ecomMoto", "pos", "posMoto"])).optional()
}).passthrough()

export const CalculatePciStatusResponseSchema = z.object({
  signingRequired: z.boolean().optional()
}).passthrough()

export const CalculateTermsOfServiceStatusResponseSchema = z.object({
  termsOfServiceTypes: z.array(z.enum(["adyenAccount", "adyenCapital", "adyenCard", "adyenChargeCard", "adyenForPlatformsAdvanced", "adyenForPlatformsManage", "adyenFranchisee", "adyenIssuing", "adyenPccr", "kycOnInvite"])).optional()
}).passthrough()

export const CapabilityProblemEntityRecursiveSchema = z.object({
  documents: z.array(z.string()).optional(),
  id: z.string().optional(),
  type: z.enum(["BankAccount", "Document", "LegalEntity", "product"]).optional()
}).passthrough()

export const CheckTaxElectronicDeliveryConsentResponseSchema = z.object({
  US1099k: z.boolean().optional()
}).passthrough()

export const DKLocalAccountIdentificationSchema = z.object({
  accountNumber: z.string().min(4).max(10),
  bankCode: z.string().min(4).max(4),
  type: z.enum(["dkLocal"])
}).passthrough()

export const DataReviewConfirmationResponseSchema = z.object({
  dataReviewedAt: z.string().optional()
}).passthrough()

export const DocumentPageSchema = z.object({
  pageName: z.string().optional(),
  pageNumber: z.number().optional(),
  type: z.enum(["BACK", "FRONT", "UNDEFINED"]).optional()
}).passthrough()

export const EntityReferenceSchema = z.object({
  id: z.string().optional()
}).passthrough()

export const FinancialReportSchema = z.object({
  annualTurnover: z.string().optional(),
  balanceSheetTotal: z.string().optional(),
  currencyOfFinancialData: z.string().optional(),
  dateOfFinancialData: z.string().optional(),
  employeeCount: z.string().optional(),
  netAssets: z.string().optional()
}).passthrough()

export const GeneratePciDescriptionRequestSchema = z.object({
  additionalSalesChannels: z.array(z.enum(["eCommerce", "ecomMoto", "pos", "posMoto"])).optional(),
  language: z.string().optional()
}).passthrough()

export const GeneratePciDescriptionResponseSchema = z.object({
  content: z.string().optional(),
  language: z.string().optional(),
  pciTemplateReferences: z.array(z.string()).optional()
}).passthrough()

export const GetAcceptedTermsOfServiceDocumentResponseSchema = z.object({
  document: z.string().optional(),
  id: z.string().optional(),
  termsOfServiceAcceptanceReference: z.string().optional(),
  termsOfServiceDocumentFormat: z.enum(["JSON", "PDF", "TXT"]).optional()
}).passthrough()

export const GetPciQuestionnaireResponseSchema = z.object({
  content: z.string().optional(),
  createdAt: z.string().optional(),
  id: z.string().optional(),
  validUntil: z.string().optional()
}).passthrough()

export const GetTermsOfServiceDocumentRequestSchema = z.object({
  language: z.string(),
  termsOfServiceDocumentFormat: z.string().optional(),
  type: z.enum(["adyenAccount", "adyenCapital", "adyenCard", "adyenChargeCard", "adyenForPlatformsAdvanced", "adyenForPlatformsManage", "adyenFranchisee", "adyenIssuing", "adyenPccr", "kycOnInvite"])
}).passthrough()

export const GetTermsOfServiceDocumentResponseSchema = z.object({
  document: z.string().optional(),
  id: z.string().optional(),
  language: z.string().optional(),
  termsOfServiceDocumentFormat: z.string().optional(),
  termsOfServiceDocumentId: z.string().optional(),
  type: z.enum(["adyenAccount", "adyenCapital", "adyenCard", "adyenChargeCard", "adyenForPlatformsAdvanced", "adyenForPlatformsManage", "adyenFranchisee", "adyenIssuing", "adyenPccr", "kycOnInvite"]).optional()
}).passthrough()

export const HKLocalAccountIdentificationSchema = z.object({
  accountNumber: z.string().min(9).max(17),
  clearingCode: z.string().min(3).max(3),
  type: z.enum(["hkLocal"])
}).passthrough()

export const HULocalAccountIdentificationSchema = z.object({
  accountNumber: z.string().min(24).max(24),
  type: z.enum(["huLocal"])
}).passthrough()

export const IbanAccountIdentificationSchema = z.object({
  bic: z.string().optional(),
  iban: z.string(),
  type: z.enum(["iban"])
}).passthrough()

export const IdentificationDataSchema = z.object({
  cardNumber: z.string().optional(),
  expiryDate: z.string().optional(),
  issuerCountry: z.string().optional(),
  issuerState: z.string().optional(),
  nationalIdExempt: z.boolean().optional(),
  number: z.string().optional(),
  type: z.enum(["nationalIdNumber", "passport", "driversLicense", "identityCard"])
}).passthrough()

export const LegalEntityAssociationSchema = z.object({
  associatorId: z.string().optional(),
  entityType: z.string().optional(),
  jobTitle: z.string().optional(),
  legalEntityId: z.string(),
  name: z.string().optional(),
  nominee: z.boolean().optional(),
  relationship: z.string().optional(),
  settlorExemptionReason: z.array(z.string()).optional(),
  type: z.enum(["definedBeneficiary", "director", "immediateParentCompany", "legalRepresentative", "pciSignatory", "protector", "secondaryPartner", "secondaryTrustee", "settlor", "signatory", "soleProprietorship", "trust", "trustOwnership", "uboThroughControl", "uboThroughOwnership", "ultimateParentCompany", "undefinedBeneficiary", "unincorporatedPartnership"])
}).passthrough()

export const NOLocalAccountIdentificationSchema = z.object({
  accountNumber: z.string().min(11).max(11),
  type: z.enum(["noLocal"])
}).passthrough()

export const NZLocalAccountIdentificationSchema = z.object({
  accountNumber: z.string().min(15).max(16),
  type: z.enum(["nzLocal"])
}).passthrough()

export const NameSchema = z.object({
  firstName: z.string(),
  infix: z.string().optional(),
  lastName: z.string()
}).passthrough()

export const OnboardingLinkSchema = z.object({
  url: z.string().optional()
}).passthrough()

export const OnboardingLinkSettingsSchema = z.object({
  acceptedCountries: z.array(z.string()).optional(),
  allowBankAccountFormatSelection: z.boolean().optional(),
  allowDebugUi: z.boolean().optional(),
  allowIntraRegionCrossBorderPayout: z.boolean().optional(),
  changeLegalEntityType: z.boolean().optional(),
  editPrefilledCountry: z.boolean().optional(),
  enforceLegalAge: z.boolean().optional(),
  hideOnboardingIntroductionIndividual: z.boolean().optional(),
  hideOnboardingIntroductionOrganization: z.boolean().optional(),
  hideOnboardingIntroductionSoleProprietor: z.boolean().optional(),
  hideOnboardingIntroductionTrust: z.boolean().optional(),
  instantBankVerification: z.boolean().optional(),
  requirePciSignEcomMoto: z.boolean().optional(),
  requirePciSignEcommerce: z.boolean().optional(),
  requirePciSignPos: z.boolean().optional(),
  requirePciSignPosMoto: z.boolean().optional(),
  transferInstrumentLimit: z.number().optional()
}).passthrough()

export const OnboardingThemeSchema = z.object({
  createdAt: z.string(),
  description: z.string().optional(),
  id: z.string(),
  properties: z.record(z.string(), z.string()),
  updatedAt: z.string().optional()
}).passthrough()

export const OwnerEntitySchema = z.object({
  id: z.string(),
  type: z.string()
}).passthrough()

export const PLLocalAccountIdentificationSchema = z.object({
  accountNumber: z.string().min(26).max(26),
  type: z.enum(["plLocal"])
}).passthrough()

export const PciDocumentInfoSchema = z.object({
  createdAt: z.string().optional(),
  id: z.string().optional(),
  validUntil: z.string().optional()
}).passthrough()

export const PciSigningRequestSchema = z.object({
  pciTemplateReferences: z.array(z.string()),
  signedBy: z.string()
}).passthrough()

export const PciSigningResponseSchema = z.object({
  pciQuestionnaireIds: z.array(z.string()).optional(),
  signedBy: z.string().optional()
}).passthrough()

export const PhoneNumberSchema = z.object({
  number: z.string(),
  phoneCountryCode: z.string().optional(),
  type: z.string().optional()
}).passthrough()

export const RemediatingActionSchema = z.object({
  code: z.string().optional(),
  message: z.string().optional()
}).passthrough()

export const SELocalAccountIdentificationSchema = z.object({
  accountNumber: z.string().min(7).max(10),
  clearingNumber: z.string().min(4).max(5),
  type: z.enum(["seLocal"])
}).passthrough()

export const SGLocalAccountIdentificationSchema = z.object({
  accountNumber: z.string().min(4).max(19),
  bic: z.string().min(8).max(11),
  type: z.enum(["sgLocal"]).optional()
}).passthrough()

export const ServiceErrorSchema = z.object({
  errorCode: z.string().optional(),
  errorType: z.string().optional(),
  message: z.string().optional(),
  pspReference: z.string().optional(),
  status: z.number().optional()
}).passthrough()

export const SetTaxElectronicDeliveryConsentRequestSchema = z.object({
  US1099k: z.boolean().optional()
}).passthrough()

export const SourceOfFundsSchema = z.object({
  acquiringBusinessLineId: z.string().optional(),
  adyenProcessedFunds: z.boolean().optional(),
  description: z.string().optional(),
  type: z.enum(["business"]).optional()
}).passthrough()

export const StockDataSchema = z.object({
  marketIdentifier: z.string().optional(),
  stockNumber: z.string().optional(),
  tickerSymbol: z.string().optional()
}).passthrough()

export const SupportingEntityCapabilitySchema = z.object({
  allowed: z.boolean().optional(),
  id: z.string().optional(),
  requested: z.boolean().optional(),
  verificationStatus: z.string().optional()
}).passthrough()

export const TaxInformationSchema = z.object({
  country: z.string().min(2).max(2).optional(),
  number: z.string().optional(),
  type: z.string().optional()
}).passthrough()

export const TaxReportingClassificationSchema = z.object({
  businessType: z.enum(["other", "listedPublicCompany", "subsidiaryOfListedPublicCompany", "governmentalOrganization", "internationalOrganization", "financialInstitution"]).optional(),
  financialInstitutionNumber: z.string().optional(),
  mainSourceOfIncome: z.enum(["businessOperation", "realEstateSales", "investmentInterestOrRoyalty", "propertyRental", "other"]).optional(),
  type: z.enum(["nonFinancialNonReportable", "financialNonReportable", "nonFinancialActive", "nonFinancialPassive"]).optional()
}).passthrough()

export const TermsOfServiceAcceptanceInfoSchema = z.object({
  acceptedBy: z.string().optional(),
  acceptedFor: z.string().optional(),
  createdAt: z.string().optional(),
  id: z.string().optional(),
  type: z.enum(["adyenAccount", "adyenCapital", "adyenCard", "adyenChargeCard", "adyenForPlatformsAdvanced", "adyenForPlatformsManage", "adyenFranchisee", "adyenIssuing", "adyenPccr", "kycOnInvite"]).optional(),
  validTo: z.string().optional()
}).passthrough()

export const TransferInstrumentReferenceSchema = z.object({
  accountIdentifier: z.string(),
  id: z.string(),
  realLastFour: z.string().optional(),
  trustedSource: z.boolean().optional()
}).passthrough()

export const UKLocalAccountIdentificationSchema = z.object({
  accountNumber: z.string().min(8).max(8),
  sortCode: z.string().min(6).max(6),
  type: z.enum(["ukLocal"])
}).passthrough()

export const USLocalAccountIdentificationSchema = z.object({
  accountNumber: z.string().min(2).max(18),
  accountType: z.enum(["checking", "savings"]).optional(),
  routingNumber: z.string().min(9).max(9),
  type: z.enum(["usLocal"])
}).passthrough()

export const UndefinedBeneficiarySchema = z.object({
  description: z.string().optional(),
  reference: z.string().optional()
}).passthrough()

export const VerificationDeadlineSchema = z.object({
  capabilities: z.array(z.enum(["acceptExternalFunding", "acceptPspFunding", "acceptTransactionInRestrictedCountries", "acceptTransactionInRestrictedCountriesCommercial", "acceptTransactionInRestrictedCountriesConsumer", "acceptTransactionInRestrictedIndustries", "acceptTransactionInRestrictedIndustriesCommercial", "acceptTransactionInRestrictedIndustriesConsumer", "acquiring", "atmWithdrawal", "atmWithdrawalCommercial", "atmWithdrawalConsumer", "atmWithdrawalInRestrictedCountries", "atmWithdrawalInRestrictedCountriesCommercial", "atmWithdrawalInRestrictedCountriesConsumer", "authorisedPaymentInstrumentUser", "getGrantOffers", "issueBankAccount", "issueCard", "issueCardCommercial", "issueCardConsumer", "issueChargeCard", "issueChargeCardCommercial", "issueCreditLimit", "localAcceptance", "payout", "payoutToTransferInstrument", "processing", "receiveFromBalanceAccount", "receiveFromPlatformPayments", "receiveFromThirdParty", "receiveFromTransferInstrument", "receiveGrants", "receivePayments", "sendToBalanceAccount", "sendToThirdParty", "sendToTransferInstrument", "thirdPartyFunding", "useCard", "useCardCommercial", "useCardConsumer", "useCardInRestrictedCountries", "useCardInRestrictedCountriesCommercial", "useCardInRestrictedCountriesConsumer", "useCardInRestrictedIndustries", "useCardInRestrictedIndustriesCommercial", "useCardInRestrictedIndustriesConsumer", "useChargeCard", "useChargeCardCommercial", "withdrawFromAtm", "withdrawFromAtmCommercial", "withdrawFromAtmConsumer", "withdrawFromAtmInRestrictedCountries", "withdrawFromAtmInRestrictedCountriesCommercial", "withdrawFromAtmInRestrictedCountriesConsumer"])),
  entityIds: z.array(z.string()).optional(),
  expiresAt: z.string()
}).passthrough()

export const WebDataSchema = z.object({
  webAddress: z.string().optional(),
  webAddressId: z.string().optional()
}).passthrough()

export const WebDataExemptionSchema = z.object({
  reason: z.enum(["noOnlinePresence", "notCollectedDuringOnboarding"]).optional()
}).passthrough()

export const NumberAndBicAccountIdentificationSchema = z.object({
  accountNumber: z.string().max(34),
  additionalBankIdentification: AdditionalBankIdentificationSchema.optional(),
  bic: z.string().min(8).max(11),
  type: z.enum(["numberAndBic"])
}).passthrough()

export const CapabilitySettingsSchema = z.object({
  amountPerIndustry: z.record(z.string(), AmountSchema).optional(),
  authorizedCardUsers: z.boolean().optional(),
  fundingSource: z.array(z.enum(["credit", "debit", "prepaid"])).optional(),
  interval: z.enum(["daily", "monthly", "weekly"]).optional(),
  maxAmount: AmountSchema.optional()
}).passthrough()

export const CapabilityProblemEntitySchema = z.object({
  documents: z.array(z.string()).optional(),
  id: z.string().optional(),
  owner: CapabilityProblemEntityRecursiveSchema.optional(),
  type: z.enum(["BankAccount", "Document", "LegalEntity", "product"]).optional()
}).passthrough()

export const DocumentReferenceSchema = z.object({
  active: z.boolean().optional(),
  description: z.string().optional(),
  fileName: z.string().optional(),
  id: z.string().optional(),
  modificationDate: z.string().optional(),
  pages: z.array(DocumentPageSchema).optional(),
  type: z.string().optional()
}).passthrough()

export const OnboardingLinkInfoSchema = z.object({
  locale: z.string().optional(),
  redirectUrl: z.string().optional(),
  settings: OnboardingLinkSettingsSchema.optional(),
  themeId: z.string().optional()
}).passthrough()

export const OnboardingThemesSchema = z.object({
  next: z.string().optional(),
  previous: z.string().optional(),
  themes: z.array(OnboardingThemeSchema)
}).passthrough()

export const DocumentSchema = z.object({
  attachment: AttachmentSchema.optional(),
  attachments: z.array(AttachmentSchema).optional(),
  creationDate: z.string().optional(),
  description: z.string(),
  expiryDate: z.string().optional(),
  fileName: z.string().optional(),
  id: z.string().optional(),
  issuerCountry: z.string().optional(),
  issuerState: z.string().optional(),
  modificationDate: z.string().optional(),
  number: z.string().optional(),
  owner: OwnerEntitySchema.optional(),
  type: z.enum(["bankStatement", "driversLicense", "identityCard", "nationalIdNumber", "passport", "proofOfAddress", "proofOfNationalIdNumber", "proofOfResidency", "registrationDocument", "vatDocument", "proofOfOrganizationTaxInfo", "proofOfIndividualTaxId", "proofOfOwnership", "proofOfSignatory", "liveSelfie", "proofOfIndustry", "constitutionalDocument", "proofOfFundingOrWealthSource", "proofOfRelationship"])
}).passthrough()

export const GetPciQuestionnaireInfosResponseSchema = z.object({
  data: z.array(PciDocumentInfoSchema).optional()
}).passthrough()

export const VerificationErrorRecursiveSchema = z.object({
  capabilities: z.array(z.enum(["acceptExternalFunding", "acceptPspFunding", "acceptTransactionInRestrictedCountries", "acceptTransactionInRestrictedCountriesCommercial", "acceptTransactionInRestrictedCountriesConsumer", "acceptTransactionInRestrictedIndustries", "acceptTransactionInRestrictedIndustriesCommercial", "acceptTransactionInRestrictedIndustriesConsumer", "acquiring", "atmWithdrawal", "atmWithdrawalCommercial", "atmWithdrawalConsumer", "atmWithdrawalInRestrictedCountries", "atmWithdrawalInRestrictedCountriesCommercial", "atmWithdrawalInRestrictedCountriesConsumer", "authorisedPaymentInstrumentUser", "getGrantOffers", "issueBankAccount", "issueCard", "issueCardCommercial", "issueCardConsumer", "issueChargeCard", "issueChargeCardCommercial", "issueCreditLimit", "localAcceptance", "payout", "payoutToTransferInstrument", "processing", "receiveFromBalanceAccount", "receiveFromPlatformPayments", "receiveFromThirdParty", "receiveFromTransferInstrument", "receiveGrants", "receivePayments", "sendToBalanceAccount", "sendToThirdParty", "sendToTransferInstrument", "thirdPartyFunding", "useCard", "useCardCommercial", "useCardConsumer", "useCardInRestrictedCountries", "useCardInRestrictedCountriesCommercial", "useCardInRestrictedCountriesConsumer", "useCardInRestrictedIndustries", "useCardInRestrictedIndustriesCommercial", "useCardInRestrictedIndustriesConsumer", "useChargeCard", "useChargeCardCommercial", "withdrawFromAtm", "withdrawFromAtmCommercial", "withdrawFromAtmConsumer", "withdrawFromAtmInRestrictedCountries", "withdrawFromAtmInRestrictedCountriesCommercial", "withdrawFromAtmInRestrictedCountriesConsumer"])).optional(),
  code: z.string().optional(),
  message: z.string().optional(),
  type: z.enum(["dataMissing", "dataReview", "invalidInput", "pendingStatus", "rejected"]).optional(),
  remediatingActions: z.array(RemediatingActionSchema).optional()
}).passthrough()

export const SoleProprietorshipSchema = z.object({
  countryOfGoverningLaw: z.string(),
  dateOfIncorporation: z.string().optional(),
  doingBusinessAs: z.string().optional(),
  financialReports: z.array(FinancialReportSchema).optional(),
  name: z.string(),
  principalPlaceOfBusiness: AddressSchema.optional(),
  registeredAddress: AddressSchema,
  registrationNumber: z.string().optional(),
  taxAbsent: z.boolean().optional(),
  taxInformation: z.array(TaxInformationSchema).optional(),
  vatAbsenceReason: z.enum(["industryExemption", "belowTaxThreshold"]).optional(),
  vatNumber: z.string().optional()
}).passthrough()

export const UnincorporatedPartnershipSchema = z.object({
  countryOfGoverningLaw: z.string(),
  dateOfIncorporation: z.string().optional(),
  description: z.string().optional(),
  doingBusinessAs: z.string().optional(),
  name: z.string(),
  principalPlaceOfBusiness: AddressSchema.optional(),
  registeredAddress: AddressSchema,
  registrationNumber: z.string().optional(),
  taxInformation: z.array(TaxInformationSchema).optional(),
  type: z.enum(["limitedPartnership", "generalPartnership", "familyPartnership", "commercialPartnership", "publicPartnership", "otherPartnership", "gbr", "gmbh", "kgaa", "cv", "vof", "maatschap", "privateFundLimitedPartnership", "businessTrustEntity", "businessPartnership", "limitedLiabilityPartnership", "eg", "cooperative", "vos", "comunidadDeBienes", "herenciaYacente", "comunidadDePropietarios", "sep", "sca", "bt", "kkt", "scs", "snc"]).optional(),
  vatAbsenceReason: z.enum(["industryExemption", "belowTaxThreshold"]).optional(),
  vatNumber: z.string().optional()
}).passthrough()

export const GetTermsOfServiceAcceptanceInfosResponseSchema = z.object({
  data: z.array(TermsOfServiceAcceptanceInfoSchema).optional()
}).passthrough()

export const TrustSchema = z.object({
  countryOfGoverningLaw: z.string(),
  dateOfIncorporation: z.string().optional(),
  description: z.string().optional(),
  doingBusinessAs: z.string().optional(),
  name: z.string(),
  principalPlaceOfBusiness: AddressSchema.optional(),
  registeredAddress: AddressSchema,
  registrationNumber: z.string().optional(),
  taxInformation: z.array(TaxInformationSchema).optional(),
  type: z.enum(["businessTrust", "cashManagementTrust", "charitableTrust", "corporateUnitTrust", "deceasedEstate", "discretionaryTrust", "discretionaryInvestmentTrust", "discretionaryServicesManagementTrust", "discretionaryTradingTrust", "familyTrust", "firstHomeSaverAccountsTrust", "fixedTrust", "fixedUnitTrust", "hybridTrust", "listedPublicUnitTrust", "otherTrust", "pooledSuperannuationTrust", "publicTradingTrust", "unlistedPublicUnitTrust"]),
  undefinedBeneficiaryInfo: z.array(UndefinedBeneficiarySchema).optional(),
  vatAbsenceReason: z.enum(["industryExemption", "belowTaxThreshold"]).optional(),
  vatNumber: z.string().optional()
}).passthrough()

export const IndividualSchema = z.object({
  birthData: BirthDataSchema.optional(),
  email: z.string().optional(),
  identificationData: IdentificationDataSchema.optional(),
  name: NameSchema,
  nationality: z.string().optional(),
  phone: PhoneNumberSchema.optional(),
  residentialAddress: AddressSchema,
  taxInformation: z.array(TaxInformationSchema).optional(),
  webData: WebDataSchema.optional()
}).passthrough()

export const OrganizationSchema = z.object({
  countryOfGoverningLaw: z.string().optional(),
  dateOfIncorporation: z.string().optional(),
  dateOfInitiationOfLegalProceeding: z.string().optional(),
  description: z.string().optional(),
  doingBusinessAs: z.string().optional(),
  economicSector: z.string().optional(),
  email: z.string().optional(),
  financialReports: z.array(FinancialReportSchema).optional(),
  globalLegalEntityIdentifier: z.string().optional(),
  headOfficeIndicator: z.boolean().optional(),
  institutionalSector: z.enum(["nonFinancialCorporation", "centralBank", "creditInstitutions", "depositTakingCorporations", "moneyMarketFunds", "nonMMFInvestmentFunds", "financialVehicleCorporation", "otherFinancialIntermediaries", "financialAuxiliaries", "captiveFinancialInstitutionsAndMoneyLenders", "insuranceCorporations", "pensionFunds", "centralGovernment", "stateGovernment", "localGovernment", "socialSecurityFunds", "nonProfitInstitutionsServingHouseholds"]).optional(),
  legalForm: z.string().optional(),
  legalName: z.string(),
  phone: PhoneNumberSchema.optional(),
  principalPlaceOfBusiness: AddressSchema.optional(),
  registeredAddress: AddressSchema,
  registrationNumber: z.string().optional(),
  statusOfLegalProceeding: z.enum(["noLegalActionsTaken", "underJudicialAdministration", "bankruptcyInsolvency", "otherLegalMeasures"]).optional(),
  stockData: StockDataSchema.optional(),
  taxInformation: z.array(TaxInformationSchema).optional(),
  taxReportingClassification: TaxReportingClassificationSchema.optional(),
  type: z.enum(["associationIncorporated", "governmentalOrganization", "listedPublicCompany", "nonProfit", "partnershipIncorporated", "privateCompany"]).optional(),
  vatAbsenceReason: z.enum(["industryExemption", "belowTaxThreshold"]).optional(),
  vatNumber: z.string().optional(),
  webData: WebDataSchema.optional()
}).passthrough()

export const BusinessLineInfoSchema = z.object({
  capability: z.enum(["receivePayments", "receiveFromPlatformPayments", "issueBankAccount"]).optional(),
  industryCode: z.string(),
  industryCodeDescription: z.string().optional(),
  legalEntityId: z.string(),
  salesChannels: z.array(z.string()).optional(),
  service: z.enum(["paymentProcessing", "banking"]),
  sourceOfFunds: SourceOfFundsSchema.optional(),
  webData: z.array(WebDataSchema).optional(),
  webDataExemption: WebDataExemptionSchema.optional()
}).passthrough()

export const BusinessLineInfoUpdateSchema = z.object({
  industryCode: z.string().optional(),
  industryCodeDescription: z.string().optional(),
  salesChannels: z.array(z.string()).optional(),
  sourceOfFunds: SourceOfFundsSchema.optional(),
  webData: z.array(WebDataSchema).optional(),
  webDataExemption: WebDataExemptionSchema.optional()
}).passthrough()

export const BankAccountInfoSchema = z.object({
  accountIdentification: z.union([AULocalAccountIdentificationSchema, CALocalAccountIdentificationSchema, CZLocalAccountIdentificationSchema, DKLocalAccountIdentificationSchema, HKLocalAccountIdentificationSchema, HULocalAccountIdentificationSchema, IbanAccountIdentificationSchema, NOLocalAccountIdentificationSchema, NZLocalAccountIdentificationSchema, NumberAndBicAccountIdentificationSchema, PLLocalAccountIdentificationSchema, SELocalAccountIdentificationSchema, SGLocalAccountIdentificationSchema, UKLocalAccountIdentificationSchema, USLocalAccountIdentificationSchema]).optional(),
  accountType: z.string().optional(),
  bankName: z.string().optional(),
  countryCode: z.string().optional(),
  trustedSource: z.boolean().optional()
}).passthrough()

export const LegalEntityCapabilitySchema = z.object({
  allowed: z.boolean().optional(),
  allowedLevel: z.enum(["high", "low", "medium", "notApplicable"]).optional(),
  allowedSettings: CapabilitySettingsSchema.optional(),
  requested: z.boolean().optional(),
  requestedLevel: z.enum(["high", "low", "medium", "notApplicable"]).optional(),
  requestedSettings: CapabilitySettingsSchema.optional(),
  transferInstruments: z.array(SupportingEntityCapabilitySchema).optional(),
  verificationStatus: z.string().optional()
}).passthrough()

export const VerificationErrorSchema = z.object({
  capabilities: z.array(z.enum(["acceptExternalFunding", "acceptPspFunding", "acceptTransactionInRestrictedCountries", "acceptTransactionInRestrictedCountriesCommercial", "acceptTransactionInRestrictedCountriesConsumer", "acceptTransactionInRestrictedIndustries", "acceptTransactionInRestrictedIndustriesCommercial", "acceptTransactionInRestrictedIndustriesConsumer", "acquiring", "atmWithdrawal", "atmWithdrawalCommercial", "atmWithdrawalConsumer", "atmWithdrawalInRestrictedCountries", "atmWithdrawalInRestrictedCountriesCommercial", "atmWithdrawalInRestrictedCountriesConsumer", "authorisedPaymentInstrumentUser", "getGrantOffers", "issueBankAccount", "issueCard", "issueCardCommercial", "issueCardConsumer", "issueChargeCard", "issueChargeCardCommercial", "issueCreditLimit", "localAcceptance", "payout", "payoutToTransferInstrument", "processing", "receiveFromBalanceAccount", "receiveFromPlatformPayments", "receiveFromThirdParty", "receiveFromTransferInstrument", "receiveGrants", "receivePayments", "sendToBalanceAccount", "sendToThirdParty", "sendToTransferInstrument", "thirdPartyFunding", "useCard", "useCardCommercial", "useCardConsumer", "useCardInRestrictedCountries", "useCardInRestrictedCountriesCommercial", "useCardInRestrictedCountriesConsumer", "useCardInRestrictedIndustries", "useCardInRestrictedIndustriesCommercial", "useCardInRestrictedIndustriesConsumer", "useChargeCard", "useChargeCardCommercial", "withdrawFromAtm", "withdrawFromAtmCommercial", "withdrawFromAtmConsumer", "withdrawFromAtmInRestrictedCountries", "withdrawFromAtmInRestrictedCountriesCommercial", "withdrawFromAtmInRestrictedCountriesConsumer"])).optional(),
  code: z.string().optional(),
  message: z.string().optional(),
  remediatingActions: z.array(RemediatingActionSchema).optional(),
  subErrors: z.array(VerificationErrorRecursiveSchema).optional(),
  type: z.enum(["dataMissing", "dataReview", "invalidInput", "pendingStatus", "rejected"]).optional()
}).passthrough()

export const TransferInstrumentInfoSchema = z.object({
  bankAccount: BankAccountInfoSchema,
  legalEntityId: z.string(),
  type: z.enum(["bankAccount", "recurringDetail"])
}).passthrough()

export const LegalEntityInfoSchema = z.object({
  capabilities: z.record(z.string(), LegalEntityCapabilitySchema).optional(),
  entityAssociations: z.array(LegalEntityAssociationSchema).optional(),
  individual: IndividualSchema.optional(),
  organization: OrganizationSchema.optional(),
  reference: z.string().max(150).optional(),
  soleProprietorship: SoleProprietorshipSchema.optional(),
  trust: TrustSchema.optional(),
  type: z.enum(["individual", "organization", "soleProprietorship", "trust", "unincorporatedPartnership"]).optional(),
  unincorporatedPartnership: UnincorporatedPartnershipSchema.optional(),
  verificationPlan: z.string().optional()
}).passthrough()

export const LegalEntityInfoRequiredTypeSchema = z.object({
  capabilities: z.record(z.string(), LegalEntityCapabilitySchema).optional(),
  entityAssociations: z.array(LegalEntityAssociationSchema).optional(),
  individual: IndividualSchema.optional(),
  organization: OrganizationSchema.optional(),
  reference: z.string().max(150).optional(),
  soleProprietorship: SoleProprietorshipSchema.optional(),
  trust: TrustSchema.optional(),
  type: z.enum(["individual", "organization", "soleProprietorship", "trust", "unincorporatedPartnership"]),
  unincorporatedPartnership: UnincorporatedPartnershipSchema.optional(),
  verificationPlan: z.string().optional()
}).passthrough()

export const CapabilityProblemSchema = z.object({
  entity: CapabilityProblemEntitySchema.optional(),
  verificationErrors: z.array(VerificationErrorSchema).optional()
}).passthrough()

export const BusinessLineSchema = z.object({
  capability: z.enum(["receivePayments", "receiveFromPlatformPayments", "issueBankAccount"]).optional(),
  id: z.string(),
  industryCode: z.string(),
  industryCodeDescription: z.string().optional(),
  legalEntityId: z.string(),
  problems: z.array(CapabilityProblemSchema).optional(),
  salesChannels: z.array(z.string()).optional(),
  service: z.enum(["paymentProcessing", "banking"]),
  sourceOfFunds: SourceOfFundsSchema.optional(),
  webData: z.array(WebDataSchema).optional(),
  webDataExemption: WebDataExemptionSchema.optional()
}).passthrough()

export const LegalEntitySchema = z.object({
  capabilities: z.record(z.string(), LegalEntityCapabilitySchema).optional(),
  documentDetails: z.array(DocumentReferenceSchema).optional(),
  documents: z.array(EntityReferenceSchema).optional(),
  entityAssociations: z.array(LegalEntityAssociationSchema).optional(),
  id: z.string(),
  individual: IndividualSchema.optional(),
  organization: OrganizationSchema.optional(),
  problems: z.array(CapabilityProblemSchema).optional(),
  reference: z.string().max(150).optional(),
  soleProprietorship: SoleProprietorshipSchema.optional(),
  transferInstruments: z.array(TransferInstrumentReferenceSchema).optional(),
  trust: TrustSchema.optional(),
  type: z.enum(["individual", "organization", "soleProprietorship", "trust", "unincorporatedPartnership"]).optional(),
  unincorporatedPartnership: UnincorporatedPartnershipSchema.optional(),
  verificationDeadlines: z.array(VerificationDeadlineSchema).optional(),
  verificationPlan: z.string().optional()
}).passthrough()

export const TransferInstrumentSchema = z.object({
  bankAccount: BankAccountInfoSchema,
  capabilities: z.record(z.string(), SupportingEntityCapabilitySchema).optional(),
  documentDetails: z.array(DocumentReferenceSchema).optional(),
  id: z.string(),
  legalEntityId: z.string(),
  problems: z.array(CapabilityProblemSchema).optional(),
  type: z.enum(["bankAccount", "recurringDetail"])
}).passthrough()

export const VerificationErrorsSchema = z.object({
  problems: z.array(CapabilityProblemSchema).optional()
}).passthrough()

export const BusinessLinesSchema = z.object({
  businessLines: z.array(BusinessLineSchema)
}).passthrough()
