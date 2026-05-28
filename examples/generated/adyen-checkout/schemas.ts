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

export const AccountInfoSchema = z.object({
  accountAgeIndicator: z.enum(["notApplicable", "thisTransaction", "lessThan30Days", "from30To60Days", "moreThan60Days"]).optional(),
  accountChangeDate: z.string().optional(),
  accountChangeIndicator: z.enum(["thisTransaction", "lessThan30Days", "from30To60Days", "moreThan60Days"]).optional(),
  accountCreationDate: z.string().optional(),
  accountType: z.enum(["notApplicable", "credit", "debit"]).optional(),
  addCardAttemptsDay: z.number().optional(),
  deliveryAddressUsageDate: z.string().optional(),
  deliveryAddressUsageIndicator: z.enum(["thisTransaction", "lessThan30Days", "from30To60Days", "moreThan60Days"]).optional(),
  homePhone: z.string().optional(),
  mobilePhone: z.string().optional(),
  passwordChangeDate: z.string().optional(),
  passwordChangeIndicator: z.enum(["notApplicable", "thisTransaction", "lessThan30Days", "from30To60Days", "moreThan60Days"]).optional(),
  pastTransactionsDay: z.number().optional(),
  pastTransactionsYear: z.number().optional(),
  paymentAccountAge: z.string().optional(),
  paymentAccountIndicator: z.enum(["notApplicable", "thisTransaction", "lessThan30Days", "from30To60Days", "moreThan60Days"]).optional(),
  purchasesLast6Months: z.number().optional(),
  suspiciousActivity: z.boolean().optional(),
  workPhone: z.string().optional()
}).passthrough()

export const AcctInfoSchema = z.object({
  chAccAgeInd: z.enum(["01", "02", "03", "04", "05"]).optional(),
  chAccChange: z.string().optional(),
  chAccChangeInd: z.enum(["01", "02", "03", "04"]).optional(),
  chAccPwChange: z.string().optional(),
  chAccPwChangeInd: z.enum(["01", "02", "03", "04", "05"]).optional(),
  chAccString: z.string().optional(),
  nbPurchaseAccount: z.string().optional(),
  paymentAccAge: z.string().optional(),
  paymentAccInd: z.enum(["01", "02", "03", "04", "05"]).optional(),
  provisionAttemptsDay: z.string().optional(),
  shipAddressUsage: z.string().optional(),
  shipAddressUsageInd: z.enum(["01", "02", "03", "04"]).optional(),
  shipNameIndicator: z.enum(["01", "02"]).optional(),
  suspiciousAccActivity: z.enum(["01", "02"]).optional(),
  txnActivityDay: z.string().max(3).optional(),
  txnActivityYear: z.string().max(3).optional()
}).passthrough()

export const AchDetailsSchema = z.object({
  accountHolderType: z.enum(["business", "personal"]).optional(),
  bankAccountNumber: z.string().optional(),
  bankAccountType: z.enum(["balance", "checking", "deposit", "general", "other", "payment", "savings"]).optional(),
  bankLocationId: z.string().optional(),
  checkoutAttemptId: z.string().optional(),
  encryptedBankAccountNumber: z.string().optional(),
  encryptedBankLocationId: z.string().optional(),
  ownerName: z.string().optional(),
  recurringDetailReference: z.string().optional(),
  sdkData: z.string().max(50000).optional(),
  storedPaymentMethodId: z.string().max(64).optional(),
  transferInstrumentId: z.string().optional(),
  type: z.enum(["ach", "ach_plaid"]).optional()
}).passthrough()

export const AdditionalData3DSecureSchema = z.object({
  allow3DS2: z.string().optional(),
  challengeWindowSize: z.enum(["01", "02", "03", "04", "05"]).optional(),
  executeThreeD: z.string().optional(),
  mpiImplementationType: z.string().optional(),
  scaExemption: z.string().optional(),
  threeDSVersion: z.string().optional()
}).passthrough()

export const AdditionalDataAirlineSchema = z.object({
  'airline.agency_invoice_number': z.string().optional(),
  'airline.agency_plan_name': z.string().optional(),
  'airline.airline_code': z.string().optional(),
  'airline.airline_designator_code': z.string().optional(),
  'airline.boarding_fee': z.string().optional(),
  'airline.computerized_reservation_system': z.string().optional(),
  'airline.customer_reference_number': z.string().optional(),
  'airline.document_type': z.string().optional(),
  'airline.flight_date': z.string().optional(),
  'airline.issue_date': z.string().optional(),
  'airline.leg.carrier_code': z.string().optional(),
  'airline.leg.class_of_travel': z.string().optional(),
  'airline.leg.date_of_travel': z.string().optional(),
  'airline.leg.depart_airport': z.string().optional(),
  'airline.leg.depart_tax': z.string().optional(),
  'airline.leg.destination_code': z.string().optional(),
  'airline.leg.fare_base_code': z.string().optional(),
  'airline.leg.flight_number': z.string().optional(),
  'airline.leg.stop_over_code': z.string().optional(),
  'airline.passenger.date_of_birth': z.string().optional(),
  'airline.passenger.first_name': z.string().optional(),
  'airline.passenger.last_name': z.string().optional(),
  'airline.passenger.phone_number': z.string().optional(),
  'airline.passenger.traveller_type': z.string().optional(),
  'airline.passenger_name': z.string(),
  'airline.ticket_issue_address': z.string().optional(),
  'airline.ticket_number': z.string().optional(),
  'airline.travel_agency_code': z.string().optional(),
  'airline.travel_agency_name': z.string().optional()
}).passthrough()

export const AdditionalDataCarRentalSchema = z.object({
  'carRental.checkOutDate': z.string().optional(),
  'carRental.customerServiceTollFreeNumber': z.string().optional(),
  'carRental.daysRented': z.string().optional(),
  'carRental.fuelCharges': z.string().optional(),
  'carRental.insuranceCharges': z.string().optional(),
  'carRental.locationCity': z.string().optional(),
  'carRental.locationCountry': z.string().optional(),
  'carRental.locationStateProvince': z.string().optional(),
  'carRental.noShowIndicator': z.string().optional(),
  'carRental.oneWayDropOffCharges': z.string().optional(),
  'carRental.rate': z.string().optional(),
  'carRental.rateIndicator': z.string().optional(),
  'carRental.rentalAgreementNumber': z.string().optional(),
  'carRental.rentalClassId': z.string().optional(),
  'carRental.renterName': z.string().optional(),
  'carRental.returnCity': z.string().optional(),
  'carRental.returnCountry': z.string().optional(),
  'carRental.returnDate': z.string().optional(),
  'carRental.returnLocationId': z.string().optional(),
  'carRental.returnStateProvince': z.string().optional(),
  'carRental.taxExemptIndicator': z.string().optional(),
  'travelEntertainmentAuthData.duration': z.string().optional(),
  'travelEntertainmentAuthData.market': z.string().optional()
}).passthrough()

export const AdditionalDataCommonSchema = z.object({
  RequestedTestAcquirerResponseCode: z.string().optional(),
  RequestedTestErrorResponseCode: z.string().optional(),
  allowPartialAuth: z.string().optional(),
  authorisationType: z.string().optional(),
  autoRescue: z.string().optional(),
  customRoutingFlag: z.string().optional(),
  industryUsage: z.enum(["NoShow", "DelayedCharge"]).optional(),
  manualCapture: z.string().optional(),
  maxDaysToRescue: z.string().optional(),
  networkTxReference: z.string().optional(),
  overwriteBrand: z.string().optional(),
  subMerchantCity: z.string().optional(),
  subMerchantCountry: z.string().optional(),
  subMerchantEmail: z.string().optional(),
  subMerchantID: z.string().optional(),
  subMerchantName: z.string().optional(),
  subMerchantPhoneNumber: z.string().optional(),
  subMerchantPostalCode: z.string().optional(),
  subMerchantState: z.string().optional(),
  subMerchantStreet: z.string().optional(),
  subMerchantTaxId: z.string().optional(),
  transactionLinkId: z.string().optional()
}).passthrough()

export const AdditionalDataLevel23Schema = z.object({
  'enhancedSchemeData.customerReference': z.string().optional(),
  'enhancedSchemeData.destinationCountryCode': z.string().optional(),
  'enhancedSchemeData.destinationPostalCode': z.string().optional(),
  'enhancedSchemeData.destinationStateProvinceCode': z.string().optional(),
  'enhancedSchemeData.dutyAmount': z.string().optional(),
  'enhancedSchemeData.freightAmount': z.string().optional(),
  'enhancedSchemeData.itemDetailLine[itemNr].commodityCode': z.string().optional(),
  'enhancedSchemeData.itemDetailLine[itemNr].description': z.string().optional(),
  'enhancedSchemeData.itemDetailLine[itemNr].discountAmount': z.string().optional(),
  'enhancedSchemeData.itemDetailLine[itemNr].productCode': z.string().optional(),
  'enhancedSchemeData.itemDetailLine[itemNr].quantity': z.string().optional(),
  'enhancedSchemeData.itemDetailLine[itemNr].totalAmount': z.string().optional(),
  'enhancedSchemeData.itemDetailLine[itemNr].unitOfMeasure': z.string().optional(),
  'enhancedSchemeData.itemDetailLine[itemNr].unitPrice': z.string().optional(),
  'enhancedSchemeData.orderDate': z.string().optional(),
  'enhancedSchemeData.shipFromPostalCode': z.string().optional(),
  'enhancedSchemeData.totalTaxAmount': z.string().optional()
}).passthrough()

export const AdditionalDataLodgingSchema = z.object({
  'lodging.SpecialProgramCode': z.string().optional(),
  'lodging.checkInDate': z.string().optional(),
  'lodging.checkOutDate': z.string().optional(),
  'lodging.customerServiceTollFreeNumber': z.string().optional(),
  'lodging.fireSafetyActIndicator': z.string().optional(),
  'lodging.folioCashAdvances': z.string().optional(),
  'lodging.folioNumber': z.string().optional(),
  'lodging.foodBeverageCharges': z.string().optional(),
  'lodging.noShowIndicator': z.string().optional(),
  'lodging.prepaidExpenses': z.string().optional(),
  'lodging.propertyPhoneNumber': z.string().optional(),
  'lodging.room1.numberOfNights': z.string().optional(),
  'lodging.room1.rate': z.string().optional(),
  'lodging.totalRoomTax': z.string().optional(),
  'lodging.totalTax': z.string().optional(),
  'travelEntertainmentAuthData.duration': z.string().optional(),
  'travelEntertainmentAuthData.market': z.string().optional()
}).passthrough()

export const AdditionalDataOpenInvoiceSchema = z.object({
  'openinvoicedata.merchantData': z.string().optional(),
  'openinvoicedata.numberOfLines': z.string().optional(),
  'openinvoicedata.recipientFirstName': z.string().optional(),
  'openinvoicedata.recipientLastName': z.string().optional(),
  'openinvoicedataLine[itemNr].currencyCode': z.string().optional(),
  'openinvoicedataLine[itemNr].description': z.string().optional(),
  'openinvoicedataLine[itemNr].itemAmount': z.string().optional(),
  'openinvoicedataLine[itemNr].itemId': z.string().optional(),
  'openinvoicedataLine[itemNr].itemVatAmount': z.string().optional(),
  'openinvoicedataLine[itemNr].itemVatPercentage': z.string().optional(),
  'openinvoicedataLine[itemNr].numberOfItems': z.string().optional(),
  'openinvoicedataLine[itemNr].returnShippingCompany': z.string().optional(),
  'openinvoicedataLine[itemNr].returnTrackingNumber': z.string().optional(),
  'openinvoicedataLine[itemNr].returnTrackingUri': z.string().optional(),
  'openinvoicedataLine[itemNr].shippingCompany': z.string().optional(),
  'openinvoicedataLine[itemNr].shippingMethod': z.string().optional(),
  'openinvoicedataLine[itemNr].trackingNumber': z.string().optional(),
  'openinvoicedataLine[itemNr].trackingUri': z.string().optional()
}).passthrough()

export const AdditionalDataOpiSchema = z.object({
  'opi.includeTransToken': z.string().optional()
}).passthrough()

export const AdditionalDataRatepaySchema = z.object({
  'ratepay.installmentAmount': z.string().optional(),
  'ratepay.interestRate': z.string().optional(),
  'ratepay.lastInstallmentAmount': z.string().optional(),
  'ratepay.paymentFirstday': z.string().optional(),
  'ratepaydata.deliveryDate': z.string().optional(),
  'ratepaydata.dueDate': z.string().optional(),
  'ratepaydata.invoiceDate': z.string().optional(),
  'ratepaydata.invoiceId': z.string().optional()
}).passthrough()

export const AdditionalDataRetrySchema = z.object({
  'retry.chainAttemptNumber': z.string().optional(),
  'retry.orderAttemptNumber': z.string().optional(),
  'retry.skipRetry': z.string().optional()
}).passthrough()

export const AdditionalDataRiskSchema = z.object({
  'riskdata.[customFieldName]': z.string().optional(),
  'riskdata.basket.item[itemNr].amountPerItem': z.string().optional(),
  'riskdata.basket.item[itemNr].brand': z.string().optional(),
  'riskdata.basket.item[itemNr].category': z.string().optional(),
  'riskdata.basket.item[itemNr].color': z.string().optional(),
  'riskdata.basket.item[itemNr].currency': z.string().optional(),
  'riskdata.basket.item[itemNr].itemID': z.string().optional(),
  'riskdata.basket.item[itemNr].manufacturer': z.string().optional(),
  'riskdata.basket.item[itemNr].productTitle': z.string().optional(),
  'riskdata.basket.item[itemNr].quantity': z.string().optional(),
  'riskdata.basket.item[itemNr].receiverEmail': z.string().optional(),
  'riskdata.basket.item[itemNr].size': z.string().optional(),
  'riskdata.basket.item[itemNr].sku': z.string().optional(),
  'riskdata.basket.item[itemNr].upc': z.string().optional(),
  'riskdata.promotions.promotion[itemNr].promotionCode': z.string().optional(),
  'riskdata.promotions.promotion[itemNr].promotionDiscountAmount': z.string().optional(),
  'riskdata.promotions.promotion[itemNr].promotionDiscountCurrency': z.string().optional(),
  'riskdata.promotions.promotion[itemNr].promotionDiscountPercentage': z.string().optional(),
  'riskdata.promotions.promotion[itemNr].promotionName': z.string().optional(),
  'riskdata.riskProfileReference': z.string().optional(),
  'riskdata.skipRisk': z.string().optional()
}).passthrough()

export const AdditionalDataRiskStandaloneSchema = z.object({
  'PayPal.CountryCode': z.string().optional(),
  'PayPal.EmailId': z.string().optional(),
  'PayPal.FirstName': z.string().optional(),
  'PayPal.LastName': z.string().optional(),
  'PayPal.PayerId': z.string().optional(),
  'PayPal.Phone': z.string().optional(),
  'PayPal.ProtectionEligibility': z.string().optional(),
  'PayPal.TransactionId': z.string().optional(),
  avsResultRaw: z.string().optional(),
  bin: z.string().optional(),
  cvcResultRaw: z.string().optional(),
  riskToken: z.string().optional(),
  threeDAuthenticated: z.string().optional(),
  threeDOffered: z.string().optional(),
  tokenDataType: z.string().optional()
}).passthrough()

export const AdditionalDataSubMerchantSchema = z.object({
  'subMerchant.numberOfSubSellers': z.string().optional(),
  'subMerchant.subSeller[subSellerNr].city': z.string().optional(),
  'subMerchant.subSeller[subSellerNr].country': z.string().optional(),
  'subMerchant.subSeller[subSellerNr].email': z.string().optional(),
  'subMerchant.subSeller[subSellerNr].id': z.string().optional(),
  'subMerchant.subSeller[subSellerNr].mcc': z.string().optional(),
  'subMerchant.subSeller[subSellerNr].name': z.string().optional(),
  'subMerchant.subSeller[subSellerNr].phoneNumber': z.string().optional(),
  'subMerchant.subSeller[subSellerNr].postalCode': z.string().optional(),
  'subMerchant.subSeller[subSellerNr].state': z.string().optional(),
  'subMerchant.subSeller[subSellerNr].street': z.string().optional(),
  'subMerchant.subSeller[subSellerNr].taxId': z.string().optional()
}).passthrough()

export const AdditionalDataTemporaryServicesSchema = z.object({
  'enhancedSchemeData.customerReference': z.string().optional(),
  'enhancedSchemeData.employeeName': z.string().optional(),
  'enhancedSchemeData.jobDescription': z.string().optional(),
  'enhancedSchemeData.regularHoursRate': z.string().optional(),
  'enhancedSchemeData.regularHoursWorked': z.string().optional(),
  'enhancedSchemeData.requestName': z.string().optional(),
  'enhancedSchemeData.tempStartDate': z.string().optional(),
  'enhancedSchemeData.tempWeekEnding': z.string().optional(),
  'enhancedSchemeData.totalTaxAmount': z.string().optional()
}).passthrough()

export const AdditionalDataWalletsSchema = z.object({
  'androidpay.token': z.string().optional(),
  'masterpass.transactionId': z.string().optional(),
  'payment.token': z.string().optional(),
  'paywithgoogle.token': z.string().optional(),
  'samsungpay.token': z.string().optional(),
  'visacheckout.callId': z.string().optional()
}).passthrough()

export const AddressSchema = z.object({
  city: z.string().max(3000),
  country: z.string(),
  houseNumberOrName: z.string().max(3000),
  postalCode: z.string(),
  stateOrProvince: z.string().optional(),
  street: z.string().max(3000)
}).passthrough()

export const AffirmDetailsSchema = z.object({
  checkoutAttemptId: z.string().optional(),
  sdkData: z.string().max(50000).optional(),
  type: z.enum(["affirm"]).optional()
}).passthrough()

export const AfterpayDetailsSchema = z.object({
  billingAddress: z.string().optional(),
  checkoutAttemptId: z.string().optional(),
  deliveryAddress: z.string().optional(),
  personalDetails: z.string().optional(),
  recurringDetailReference: z.string().optional(),
  sdkData: z.string().max(50000).optional(),
  storedPaymentMethodId: z.string().max(64).optional(),
  type: z.enum(["afterpay_default", "afterpaytouch", "afterpay_b2b", "clearpay"])
}).passthrough()

export const AgencySchema = z.object({
  invoiceNumber: z.string().optional(),
  planName: z.string().optional()
}).passthrough()

export const AlmaDetailsSchema = z.object({
  checkoutAttemptId: z.string().optional(),
  feeType: z.enum(["merchantPays", "shopperPays"]).optional(),
  sdkData: z.string().max(50000).optional(),
  type: z.enum(["alma"]).optional()
}).passthrough()

export const AmazonPayDetailsSchema = z.object({
  amazonPayToken: z.string().optional(),
  checkoutAttemptId: z.string().optional(),
  checkoutSessionId: z.string().optional(),
  sdkData: z.string().max(50000).optional(),
  type: z.enum(["amazonpay"]).optional()
}).passthrough()

export const AmountSchema = z.object({
  currency: z.string().min(3).max(3),
  value: z.number()
}).passthrough()

export const AmountsSchema = z.object({
  currency: z.string(),
  values: z.array(z.number())
}).passthrough()

export const AncvDetailsSchema = z.object({
  beneficiaryId: z.string().optional(),
  checkoutAttemptId: z.string().optional(),
  recurringDetailReference: z.string().optional(),
  sdkData: z.string().max(50000).optional(),
  storedPaymentMethodId: z.string().max(64).optional(),
  type: z.enum(["ancv"]).optional()
}).passthrough()

export const AndroidPayDetailsSchema = z.object({
  checkoutAttemptId: z.string().optional(),
  sdkData: z.string().max(50000).optional(),
  type: z.enum(["androidpay"]).optional()
}).passthrough()

export const AppIdentifierInfoSchema = z.object({
  androidPackageId: z.string().optional(),
  iosScheme: z.string().optional()
}).passthrough()

export const ApplePayDetailsSchema = z.object({
  applePayToken: z.string().max(10000),
  checkoutAttemptId: z.string().optional(),
  fundingSource: z.enum(["credit", "debit", "prepaid"]).optional(),
  recurringDetailReference: z.string().optional(),
  sdkData: z.string().max(50000).optional(),
  storedPaymentMethodId: z.string().max(64).optional(),
  type: z.enum(["applepay"]).optional()
}).passthrough()

export const ApplePayDonationsSchema = z.object({
  applePayToken: z.string().max(10000),
  checkoutAttemptId: z.string().optional(),
  fundingSource: z.enum(["credit", "debit", "prepaid"]).optional(),
  recurringDetailReference: z.string().optional(),
  sdkData: z.string().max(50000).optional(),
  storedPaymentMethodId: z.string().max(64).optional(),
  type: z.enum(["applepay"]).optional()
}).passthrough()

export const ApplePaySessionRequestSchema = z.object({
  displayName: z.string().max(64),
  domainName: z.string(),
  merchantIdentifier: z.string()
}).passthrough()

export const ApplePaySessionResponseSchema = z.object({
  data: z.string()
}).passthrough()

export const BacsDirectDebitDetailsSchema = z.object({
  bankAccountNumber: z.string().optional(),
  bankLocationId: z.string().optional(),
  checkoutAttemptId: z.string().optional(),
  holderName: z.string().optional(),
  recurringDetailReference: z.string().optional(),
  sdkData: z.string().max(50000).optional(),
  storedPaymentMethodId: z.string().max(64).optional(),
  transferInstrumentId: z.string().optional(),
  type: z.enum(["directdebit_GB"]).optional()
}).passthrough()

export const BillDeskDetailsSchema = z.object({
  checkoutAttemptId: z.string().optional(),
  issuer: z.string(),
  sdkData: z.string().max(50000).optional(),
  type: z.enum(["billdesk_online", "billdesk_wallet"])
}).passthrough()

export const BillingAddressSchema = z.object({
  city: z.string().max(3000),
  country: z.string(),
  houseNumberOrName: z.string().max(3000),
  postalCode: z.string(),
  stateOrProvince: z.string().max(1000).optional(),
  street: z.string().max(3000)
}).passthrough()

export const BlikDetailsSchema = z.object({
  blikCode: z.string().optional(),
  checkoutAttemptId: z.string().optional(),
  recurringDetailReference: z.string().optional(),
  sdkData: z.string().max(50000).optional(),
  storedPaymentMethodId: z.string().max(64).optional(),
  type: z.enum(["blik"]).optional()
}).passthrough()

export const BrowserInfoSchema = z.object({
  acceptHeader: z.string(),
  colorDepth: z.number(),
  javaEnabled: z.boolean(),
  javaScriptEnabled: z.boolean().optional(),
  language: z.string(),
  screenHeight: z.number(),
  screenWidth: z.number(),
  timeZoneOffset: z.number(),
  userAgent: z.string()
}).passthrough()

export const CancelOrderResponseSchema = z.object({
  pspReference: z.string(),
  resultCode: z.enum(["Received"])
}).passthrough()

export const CardBrandDetailsSchema = z.object({
  supported: z.boolean().optional(),
  type: z.string().optional()
}).passthrough()

export const CardDetailsSchema = z.object({
  billingSequenceNumber: z.string().optional(),
  brand: z.string().optional(),
  checkoutAttemptId: z.string().optional(),
  'cupsecureplus.smscode': z.string().optional(),
  cvc: z.string().optional(),
  encryptedCard: z.string().max(40000).optional(),
  encryptedCardNumber: z.string().max(15000).optional(),
  encryptedExpiryMonth: z.string().max(15000).optional(),
  encryptedExpiryYear: z.string().max(15000).optional(),
  encryptedPassword: z.string().max(15000).optional(),
  encryptedSecurityCode: z.string().max(15000).optional(),
  expiryMonth: z.string().optional(),
  expiryYear: z.string().optional(),
  fastlaneData: z.string().optional(),
  fundingSource: z.enum(["credit", "debit", "prepaid"]).optional(),
  holderName: z.string().max(15000).optional(),
  networkPaymentReference: z.string().optional(),
  number: z.string().optional(),
  recurringDetailReference: z.string().optional(),
  sdkData: z.string().max(50000).optional(),
  shopperNotificationReference: z.string().optional(),
  srcCorrelationId: z.string().optional(),
  srcDigitalCardId: z.string().optional(),
  srcScheme: z.string().optional(),
  srcTokenReference: z.string().optional(),
  storedPaymentMethodId: z.string().max(64).optional(),
  threeDS2SdkVersion: z.string().max(12).optional(),
  type: z.enum(["bcmc", "scheme", "networkToken", "giftcard", "card", "clicktopay"]).optional()
}).passthrough()

export const CardDetailsRequestSchema = z.object({
  cardNumber: z.string().optional(),
  countryCode: z.string().optional(),
  encryptedCardNumber: z.string().max(15000).optional(),
  merchantAccount: z.string(),
  supportedBrands: z.array(z.string()).optional()
}).passthrough()

export const CardDonationsSchema = z.object({
  billingSequenceNumber: z.string().optional(),
  brand: z.string().optional(),
  checkoutAttemptId: z.string().optional(),
  'cupsecureplus.smscode': z.string().optional(),
  cvc: z.string().optional(),
  encryptedCard: z.string().max(40000).optional(),
  encryptedCardNumber: z.string().max(15000).optional(),
  encryptedExpiryMonth: z.string().max(15000).optional(),
  encryptedExpiryYear: z.string().max(15000).optional(),
  encryptedPassword: z.string().max(15000).optional(),
  encryptedSecurityCode: z.string().max(15000).optional(),
  expiryMonth: z.string().optional(),
  expiryYear: z.string().optional(),
  fastlaneData: z.string().optional(),
  fundingSource: z.enum(["credit", "debit", "prepaid"]).optional(),
  holderName: z.string().max(15000).optional(),
  networkPaymentReference: z.string().optional(),
  number: z.string().optional(),
  recurringDetailReference: z.string().optional(),
  sdkData: z.string().max(50000).optional(),
  shopperNotificationReference: z.string().optional(),
  srcCorrelationId: z.string().optional(),
  srcDigitalCardId: z.string().optional(),
  srcScheme: z.string().optional(),
  srcTokenReference: z.string().optional(),
  storedPaymentMethodId: z.string().max(64).optional(),
  threeDS2SdkVersion: z.string().max(12).optional(),
  type: z.enum(["bcmc", "scheme", "networkToken", "giftcard", "card", "clicktopay"]).optional()
}).passthrough()

export const CashAppDetailsSchema = z.object({
  cashtag: z.string().optional(),
  checkoutAttemptId: z.string().optional(),
  customerId: z.string().optional(),
  grantId: z.string().optional(),
  onFileGrantId: z.string().optional(),
  recurringDetailReference: z.string().optional(),
  requestId: z.string().optional(),
  sdkData: z.string().max(50000).optional(),
  storedPaymentMethodId: z.string().max(64).optional(),
  subtype: z.string().optional(),
  type: z.enum(["cashapp"]).optional()
}).passthrough()

export const CellulantDetailsSchema = z.object({
  checkoutAttemptId: z.string().optional(),
  issuer: z.string().optional(),
  sdkData: z.string().max(50000).optional(),
  type: z.enum(["cellulant"]).optional()
}).passthrough()

export const CheckoutAwaitActionSchema = z.object({
  paymentData: z.string().optional(),
  paymentMethodType: z.string().optional(),
  type: z.enum(["await"]),
  url: z.string().optional()
}).passthrough()

export const CheckoutBankAccountSchema = z.object({
  accountType: z.enum(["balance", "checking", "deposit", "general", "other", "payment", "savings"]).optional(),
  bankAccountNumber: z.string().optional(),
  bankCity: z.string().optional(),
  bankLocationId: z.string().optional(),
  bankName: z.string().optional(),
  bic: z.string().optional(),
  countryCode: z.string().optional(),
  iban: z.string().optional(),
  ownerName: z.string().optional(),
  taxId: z.string().optional()
}).passthrough()

export const CheckoutDelegatedAuthenticationActionSchema = z.object({
  authorisationToken: z.string().optional(),
  paymentData: z.string().optional(),
  paymentMethodType: z.string().optional(),
  token: z.string().optional(),
  type: z.enum(["delegatedAuthentication"]),
  url: z.string().optional()
}).passthrough()

export const CheckoutForwardRequestCardSchema = z.object({
  cvc: z.string().optional(),
  encryptedCardNumber: z.string().optional(),
  encryptedExpiryMonth: z.string().optional(),
  encryptedExpiryYear: z.string().optional(),
  encryptedSecurityCode: z.string().optional(),
  expiryMonth: z.string().optional(),
  expiryYear: z.string().optional(),
  holderName: z.string().optional(),
  number: z.string().optional(),
  type: z.enum(["scheme"]).optional()
}).passthrough()

export const CheckoutForwardResponseFromUrlSchema = z.object({
  body: z.string().optional(),
  headers: z.record(z.string(), z.string()).optional(),
  status: z.number().optional()
}).passthrough()

export const CheckoutNativeRedirectActionSchema = z.object({
  data: z.record(z.string(), z.string()).optional(),
  method: z.string().optional(),
  nativeRedirectData: z.string().optional(),
  paymentMethodType: z.string().optional(),
  type: z.enum(["nativeRedirect"]),
  url: z.string().optional()
}).passthrough()

export const CheckoutNetworkTokenOptionSchema = z.object({
  includeCryptogram: z.boolean().optional(),
  useNetworkToken: z.boolean().optional()
}).passthrough()

export const CheckoutOutgoingForwardRequestSchema = z.object({
  body: z.string().max(20000),
  credentials: z.string().optional(),
  headers: z.record(z.string(), z.string()).optional(),
  httpMethod: z.enum(["post", "put", "patch"]),
  urlSuffix: z.string().optional()
}).passthrough()

export const CheckoutQrCodeActionSchema = z.object({
  expiresAt: z.string().optional(),
  paymentData: z.string().optional(),
  paymentMethodType: z.string().optional(),
  qrCodeData: z.string().optional(),
  type: z.enum(["qrCode"]),
  url: z.string().optional()
}).passthrough()

export const CheckoutRedirectActionSchema = z.object({
  data: z.record(z.string(), z.string()).optional(),
  method: z.string().optional(),
  paymentMethodType: z.string().optional(),
  type: z.enum(["redirect"]),
  url: z.string().optional()
}).passthrough()

export const CheckoutSDKActionSchema = z.object({
  paymentData: z.string().optional(),
  paymentMethodType: z.string().optional(),
  sdkData: z.record(z.string(), z.string()).optional(),
  type: z.enum(["sdk", "wechatpaySDK"]),
  url: z.string().optional()
}).passthrough()

export const CheckoutSessionInstallmentOptionSchema = z.object({
  plans: z.array(z.enum(["bonus", "buynow_paylater", "interes_refund_prctg", "interest_bonus", "nointeres_refund_prctg", "nointerest_bonus", "refund_prctg", "regular", "revolving", "with_interest"])).optional(),
  preselectedValue: z.number().optional(),
  values: z.array(z.number()).optional()
}).passthrough()

export const CheckoutThreeDS2ActionSchema = z.object({
  authorisationToken: z.string().optional(),
  paymentData: z.string().optional(),
  paymentMethodType: z.string().optional(),
  subtype: z.string().optional(),
  token: z.string().optional(),
  type: z.enum(["threeDS2"]),
  url: z.string().optional()
}).passthrough()

export const CommonFieldSchema = z.object({
  name: z.string().optional(),
  version: z.string().optional()
}).passthrough()

export const CompanySchema = z.object({
  homepage: z.string().optional(),
  name: z.string().optional(),
  registrationNumber: z.string().optional(),
  registryLocation: z.string().optional(),
  taxId: z.string().optional(),
  type: z.string().optional()
}).passthrough()

export const ConfidenceScoreSchema = z.object({
  errors: z.array(z.string()).optional(),
  score: z.number().optional()
}).passthrough()

export const DeliveryAddressSchema = z.object({
  city: z.string().max(3000),
  country: z.string(),
  firstName: z.string().optional(),
  houseNumberOrName: z.string().max(3000),
  lastName: z.string().optional(),
  postalCode: z.string(),
  stateOrProvince: z.string().max(1000).optional(),
  street: z.string().max(3000)
}).passthrough()

export const DestinationSchema = z.object({
  countryCode: z.string().optional(),
  postalCode: z.string().optional(),
  stateOrProvince: z.string().optional()
}).passthrough()

export const DetailsRequestAuthenticationDataSchema = z.object({
  authenticationOnly: z.boolean().optional()
}).passthrough()

export const DeviceRenderOptionsSchema = z.object({
  sdkInterface: z.enum(["native", "html", "both"]).optional(),
  sdkUiType: z.array(z.enum(["multiSelect", "otherHtml", "outOfBand", "singleSelect", "text"])).optional()
}).passthrough()

export const DirectDebitAuDetailsSchema = z.object({
  bankAccountNumber: z.string().optional(),
  bankBranchCode: z.string().optional(),
  checkoutAttemptId: z.string().optional(),
  holderName: z.string().optional(),
  recurringDetailReference: z.string().optional(),
  sdkData: z.string().max(50000).optional(),
  storedPaymentMethodId: z.string().max(64).optional(),
  type: z.enum(["directdebit_AU"]).optional()
}).passthrough()

export const DokuDetailsSchema = z.object({
  checkoutAttemptId: z.string().optional(),
  firstName: z.string(),
  lastName: z.string(),
  sdkData: z.string().max(50000).optional(),
  shopperEmail: z.string(),
  type: z.enum(["doku_mandiri_va", "doku_cimb_va", "doku_danamon_va", "doku_bni_va", "doku_permata_lite_atm", "doku_bri_va", "doku_bca_va", "doku_alfamart", "doku_indomaret", "doku_wallet", "doku_ovo"])
}).passthrough()

export const DonationSchema = z.object({
  currency: z.string(),
  donationType: z.string(),
  maxRoundupAmount: z.number().optional(),
  type: z.string(),
  values: z.array(z.number()).optional()
}).passthrough()

export const DonationCampaignsRequestSchema = z.object({
  currency: z.string(),
  locale: z.string().optional(),
  merchantAccount: z.string(),
  store: z.string().optional()
}).passthrough()

export const DragonpayDetailsSchema = z.object({
  checkoutAttemptId: z.string().optional(),
  issuer: z.string(),
  sdkData: z.string().max(50000).optional(),
  shopperEmail: z.string().optional(),
  type: z.enum(["dragonpay_ebanking", "dragonpay_otc_banking", "dragonpay_otc_non_banking", "dragonpay_otc_philippines"])
}).passthrough()

export const EBankingFinlandDetailsSchema = z.object({
  checkoutAttemptId: z.string().optional(),
  issuer: z.string().optional(),
  sdkData: z.string().max(50000).optional(),
  type: z.enum(["ebanking_FI"])
}).passthrough()

export const EcontextVoucherDetailsSchema = z.object({
  checkoutAttemptId: z.string().optional(),
  firstName: z.string(),
  lastName: z.string(),
  sdkData: z.string().max(50000).optional(),
  shopperEmail: z.string(),
  telephoneNumber: z.string(),
  type: z.enum(["econtext_seven_eleven", "econtext_online", "econtext", "econtext_stores", "econtext_atm"])
}).passthrough()

export const EftDetailsSchema = z.object({
  bankAccountNumber: z.string().optional(),
  bankCode: z.string().optional(),
  bankLocationId: z.string().optional(),
  checkoutAttemptId: z.string().optional(),
  ownerName: z.string().optional(),
  recurringDetailReference: z.string().optional(),
  sdkData: z.string().max(50000).optional(),
  storedPaymentMethodId: z.string().max(64).optional(),
  type: z.enum(["eft_directdebit_CA"]).optional()
}).passthrough()

export const EncryptedOrderDataSchema = z.object({
  orderData: z.string().max(5000),
  pspReference: z.string()
}).passthrough()

export const ExternalPlatformSchema = z.object({
  integrator: z.string().optional(),
  name: z.string().optional(),
  version: z.string().optional()
}).passthrough()

export const ExternalTokenDetailsSchema = z.object({
  checkoutAttemptId: z.string().optional(),
  expiryMonth: z.string().optional(),
  expiryYear: z.string().optional(),
  holderName: z.string().max(15000).optional(),
  number: z.string().optional(),
  storedPaymentMethodId: z.string().max(64),
  subtype: z.enum(["hilton"]),
  type: z.enum(["externalToken"])
}).passthrough()

export const FastlaneDetailsSchema = z.object({
  checkoutAttemptId: z.string().optional(),
  fastlaneData: z.string(),
  recurringDetailReference: z.string().optional(),
  sdkData: z.string().max(50000).optional(),
  storedPaymentMethodId: z.string().max(64).optional(),
  type: z.enum(["fastlane"])
}).passthrough()

export const FraudCheckResultSchema = z.object({
  accountScore: z.number(),
  checkId: z.number(),
  name: z.string()
}).passthrough()

export const GenericIssuerPaymentMethodDetailsSchema = z.object({
  checkoutAttemptId: z.string().optional(),
  issuer: z.string(),
  recurringDetailReference: z.string().optional(),
  sdkData: z.string().max(50000).optional(),
  storedPaymentMethodId: z.string().max(64).optional(),
  type: z.enum(["onlineBanking_PL", "eps", "onlineBanking_SK", "onlineBanking_CZ", "onlinebanking_IN"])
}).passthrough()

export const GooglePayDetailsSchema = z.object({
  checkoutAttemptId: z.string().optional(),
  fundingSource: z.enum(["credit", "debit", "prepaid"]).optional(),
  googlePayCardNetwork: z.string().optional(),
  googlePayToken: z.string().max(10000),
  recurringDetailReference: z.string().optional(),
  sdkData: z.string().max(50000).optional(),
  storedPaymentMethodId: z.string().max(64).optional(),
  threeDS2SdkVersion: z.string().max(12).optional(),
  type: z.enum(["googlepay"]).optional()
}).passthrough()

export const GooglePayDonationsSchema = z.object({
  checkoutAttemptId: z.string().optional(),
  fundingSource: z.enum(["credit", "debit", "prepaid"]).optional(),
  googlePayCardNetwork: z.string().optional(),
  googlePayToken: z.string().max(10000),
  recurringDetailReference: z.string().optional(),
  sdkData: z.string().max(50000).optional(),
  storedPaymentMethodId: z.string().max(64).optional(),
  threeDS2SdkVersion: z.string().max(12).optional(),
  type: z.enum(["googlepay"]).optional()
}).passthrough()

export const IdealDetailsSchema = z.object({
  checkoutAttemptId: z.string().optional(),
  issuer: z.string().optional(),
  recurringDetailReference: z.string().optional(),
  sdkData: z.string().max(50000).optional(),
  storedPaymentMethodId: z.string().max(64).optional(),
  type: z.enum(["ideal"]).optional()
}).passthrough()

export const IdealDonationsSchema = z.object({
  checkoutAttemptId: z.string().optional(),
  issuer: z.string().optional(),
  recurringDetailReference: z.string().optional(),
  sdkData: z.string().max(50000).optional(),
  storedPaymentMethodId: z.string().max(64).optional(),
  type: z.enum(["ideal"]).optional()
}).passthrough()

export const InstallmentOptionSchema = z.object({
  maxValue: z.number().optional(),
  plans: z.array(z.enum(["bonus", "buynow_paylater", "interes_refund_prctg", "interest_bonus", "nointeres_refund_prctg", "nointerest_bonus", "refund_prctg", "regular", "revolving", "with_interest"])).optional(),
  preselectedValue: z.number().optional(),
  values: z.array(z.number()).optional()
}).passthrough()

export const InstallmentsSchema = z.object({
  extra: z.number().optional(),
  plan: z.enum(["bonus", "buynow_paylater", "interes_refund_prctg", "interest_bonus", "nointeres_refund_prctg", "nointerest_bonus", "refund_prctg", "regular", "revolving", "with_interest"]).optional(),
  value: z.number()
}).passthrough()

export const ItemSchema = z.object({
  id: z.string().optional(),
  name: z.string().optional()
}).passthrough()

export const ItemDetailLineSchema = z.object({
  commodityCode: z.string().optional(),
  description: z.string().optional(),
  discountAmount: z.number().optional(),
  productCode: z.string().optional(),
  quantity: z.number().optional(),
  totalAmount: z.number().optional(),
  unitOfMeasure: z.string().optional(),
  unitPrice: z.number().optional()
}).passthrough()

export const KlarnaDetailsSchema = z.object({
  billingAddress: z.string().optional(),
  checkoutAttemptId: z.string().optional(),
  deliveryAddress: z.string().optional(),
  personalDetails: z.string().optional(),
  recurringDetailReference: z.string().optional(),
  sdkData: z.string().max(50000).optional(),
  storedPaymentMethodId: z.string().max(64).optional(),
  subtype: z.string().optional(),
  type: z.enum(["klarna", "klarnapayments", "klarnapayments_account", "klarnapayments_b2b", "klarna_paynow", "klarna_account", "klarna_b2b"])
}).passthrough()

export const KlarnaNetworkDetailsSchema = z.object({
  checkoutAttemptId: z.string().optional(),
  klarnaNetworkData: z.string().max(10240).optional(),
  klarnaNetworkSessionToken: z.string().max(10240).optional(),
  recurringDetailReference: z.string().optional(),
  sdkData: z.string().max(50000).optional(),
  storedPaymentMethodId: z.string().max(64).optional(),
  type: z.enum(["klarna_network"])
}).passthrough()

export const LegSchema = z.object({
  carrierCode: z.string().optional(),
  classOfTravel: z.string().optional(),
  dateOfTravel: z.string().optional(),
  departureAirportCode: z.string().optional(),
  departureTax: z.number().optional(),
  destinationAirportCode: z.string().optional(),
  fareBasisCode: z.string().optional(),
  flightNumber: z.string().optional(),
  stopOverCode: z.string().optional()
}).passthrough()

export const LineItemSchema = z.object({
  amountExcludingTax: z.number().optional(),
  amountIncludingTax: z.number().optional(),
  brand: z.string().optional(),
  color: z.string().optional(),
  description: z.string().max(10000).optional(),
  id: z.string().optional(),
  imageUrl: z.string().optional(),
  itemCategory: z.string().optional(),
  manufacturer: z.string().optional(),
  marketplaceSellerId: z.string().optional(),
  productUrl: z.string().optional(),
  quantity: z.number().optional(),
  receiverEmail: z.string().optional(),
  size: z.string().optional(),
  sku: z.string().optional(),
  taxAmount: z.number().optional(),
  taxPercentage: z.number().optional(),
  upc: z.string().optional()
}).passthrough()

export const MandateSchema = z.object({
  amount: z.string(),
  amountRule: z.enum(["max", "exact"]).optional(),
  billingAttemptsRule: z.enum(["on", "before", "after"]).optional(),
  billingDay: z.string().optional(),
  count: z.string().optional(),
  endsAt: z.string(),
  frequency: z.enum(["adhoc", "daily", "weekly", "biWeekly", "monthly", "quarterly", "halfYearly", "yearly"]),
  remarks: z.string().optional(),
  startsAt: z.string().optional()
}).passthrough()

export const MasterpassDetailsSchema = z.object({
  checkoutAttemptId: z.string().optional(),
  fundingSource: z.enum(["credit", "debit", "prepaid"]).optional(),
  masterpassTransactionId: z.string(),
  sdkData: z.string().max(50000).optional(),
  type: z.enum(["masterpass"]).optional()
}).passthrough()

export const MbwayDetailsSchema = z.object({
  checkoutAttemptId: z.string().optional(),
  sdkData: z.string().max(50000).optional(),
  shopperEmail: z.string(),
  telephoneNumber: z.string(),
  type: z.enum(["mbway"]).optional()
}).passthrough()

export const MerchantDeviceSchema = z.object({
  os: z.string().optional(),
  osVersion: z.string().optional(),
  reference: z.string().optional()
}).passthrough()

export const MobilePayDetailsSchema = z.object({
  checkoutAttemptId: z.string().optional(),
  sdkData: z.string().max(50000).optional(),
  type: z.enum(["mobilepay"]).optional()
}).passthrough()

export const MolPayDetailsSchema = z.object({
  checkoutAttemptId: z.string().optional(),
  issuer: z.string(),
  sdkData: z.string().max(50000).optional(),
  type: z.enum(["molpay_ebanking_fpx_MY", "molpay_ebanking_TH"])
}).passthrough()

export const NameSchema = z.object({
  firstName: z.string().max(80),
  lastName: z.string().max(80)
}).passthrough()

export const OpenInvoiceDetailsSchema = z.object({
  billingAddress: z.string().optional(),
  checkoutAttemptId: z.string().optional(),
  deliveryAddress: z.string().optional(),
  personalDetails: z.string().optional(),
  recurringDetailReference: z.string().optional(),
  sdkData: z.string().max(50000).optional(),
  storedPaymentMethodId: z.string().max(64).optional(),
  type: z.enum(["openinvoice", "afterpay_directdebit", "atome_pos"]).optional()
}).passthrough()

export const PassengerSchema = z.object({
  dateOfBirth: z.string().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  phoneNumber: z.string().optional(),
  travellerType: z.string().optional()
}).passthrough()

export const PayByBankAISDirectDebitDetailsSchema = z.object({
  checkoutAttemptId: z.string().optional(),
  recurringDetailReference: z.string().optional(),
  sdkData: z.string().max(50000).optional(),
  storedPaymentMethodId: z.string().max(64).optional(),
  type: z.enum(["paybybank_AIS_DD"])
}).passthrough()

export const PayByBankDetailsSchema = z.object({
  checkoutAttemptId: z.string().optional(),
  issuer: z.string().optional(),
  sdkData: z.string().max(50000).optional(),
  type: z.enum(["paybybank"])
}).passthrough()

export const PayPalDetailsSchema = z.object({
  checkoutAttemptId: z.string().optional(),
  orderID: z.string().optional(),
  payeePreferred: z.string().optional(),
  payerID: z.string().optional(),
  payerSelected: z.string().optional(),
  recurringDetailReference: z.string().optional(),
  sdkData: z.string().max(50000).optional(),
  storedPaymentMethodId: z.string().max(64).optional(),
  subtype: z.enum(["express", "redirect", "sdk"]).optional(),
  type: z.enum(["paypal"])
}).passthrough()

export const PayPayDetailsSchema = z.object({
  checkoutAttemptId: z.string().optional(),
  recurringDetailReference: z.string().optional(),
  sdkData: z.string().max(50000).optional(),
  storedPaymentMethodId: z.string().max(64).optional(),
  type: z.enum(["paypay"]).optional()
}).passthrough()

export const PayToDetailsSchema = z.object({
  checkoutAttemptId: z.string().optional(),
  recurringDetailReference: z.string().optional(),
  sdkData: z.string().max(50000).optional(),
  shopperAccountIdentifier: z.string().optional(),
  storedPaymentMethodId: z.string().max(64).optional(),
  type: z.enum(["payto"]).optional()
}).passthrough()

export const PayUUpiDetailsSchema = z.object({
  checkoutAttemptId: z.string().optional(),
  recurringDetailReference: z.string().optional(),
  sdkData: z.string().max(50000).optional(),
  shopperNotificationReference: z.string().optional(),
  storedPaymentMethodId: z.string().max(64).optional(),
  type: z.enum(["payu_IN_upi"]),
  virtualPaymentAddress: z.string().optional()
}).passthrough()

export const PayWithGoogleDetailsSchema = z.object({
  checkoutAttemptId: z.string().optional(),
  fundingSource: z.enum(["credit", "debit", "prepaid"]).optional(),
  googlePayToken: z.string().max(5000),
  recurringDetailReference: z.string().optional(),
  sdkData: z.string().max(50000).optional(),
  storedPaymentMethodId: z.string().max(64).optional(),
  threeDS2SdkVersion: z.string().max(12).optional(),
  type: z.enum(["paywithgoogle"]).optional()
}).passthrough()

export const PayWithGoogleDonationsSchema = z.object({
  checkoutAttemptId: z.string().optional(),
  fundingSource: z.enum(["credit", "debit", "prepaid"]).optional(),
  googlePayToken: z.string().max(5000),
  recurringDetailReference: z.string().optional(),
  sdkData: z.string().max(50000).optional(),
  storedPaymentMethodId: z.string().max(64).optional(),
  threeDS2SdkVersion: z.string().max(12).optional(),
  type: z.enum(["paywithgoogle"]).optional()
}).passthrough()

export const PaymentCancelResponseSchema = z.object({
  merchantAccount: z.string(),
  paymentPspReference: z.string(),
  pspReference: z.string(),
  reference: z.string().optional(),
  status: z.enum(["received"])
}).passthrough()

export const PaymentCompletionDetailsSchema = z.object({
  MD: z.string().max(20000).optional(),
  PaReq: z.string().max(20000).optional(),
  PaRes: z.string().max(20000).optional(),
  authorization_token: z.string().optional(),
  billingToken: z.string().optional(),
  'cupsecureplus.smscode': z.string().optional(),
  facilitatorAccessToken: z.string().optional(),
  oneTimePasscode: z.string().optional(),
  orderID: z.string().optional(),
  payerID: z.string().optional(),
  payload: z.string().max(20000).optional(),
  paymentID: z.string().optional(),
  paymentStatus: z.string().optional(),
  redirectResult: z.string().max(20000).optional(),
  resultCode: z.string().optional(),
  returnUrlQueryString: z.string().max(20000).optional(),
  threeDSResult: z.string().max(50000).optional(),
  'threeds2.challengeResult': z.string().max(50000).optional(),
  'threeds2.fingerprint': z.string().max(100000).optional(),
  vaultToken: z.string().optional()
}).passthrough()

export const PaymentDetailsSchema = z.object({
  checkoutAttemptId: z.string().optional(),
  sdkData: z.string().max(50000).optional(),
  type: z.enum(["alipay", "multibanco", "bankTransfer", "bankTransfer_IBAN", "paybright", "paynow", "affirm_pos", "iris", "wero", "trustly", "trustlyvector", "oney", "facilypay", "facilypay_3x", "facilypay_4x", "facilypay_6x", "facilypay_10x", "facilypay_12x", "unionpay", "kcp_banktransfer", "kcp_payco", "kcp_creditcard", "wechatpaySDK", "wechatpayQR", "wechatpayWeb", "molpay_boost", "wallet_IN", "payu_IN_cashcard", "payu_IN_nb", "paytm", "molpay_ebanking_VN", "molpay_ebanking_MY", "molpay_ebanking_direct_MY", "swish", "bizum", "walley", "walley_b2b", "paypo", "scalapay", "scalapay_3x", "scalapay_4x", "molpay_fpx", "payme", "payme_pos", "konbini", "directEbanking", "boletobancario", "cashticket", "ikano", "karenmillen", "oasis", "warehouse", "primeiropay_boleto", "mada", "benefit", "knet", "omannet", "gopay_wallet", "kcp_naverpay", "fawry", "atome", "naps", "nordea", "boletobancario_bradesco", "boletobancario_itau", "boletobancario_santander", "boletobancario_bancodobrasil", "boletobancario_hsbc", "molpay_maybank2u", "molpay_cimb", "molpay_rhb", "molpay_amb", "molpay_hlb", "molpay_affin_epg", "molpay_bankislam", "molpay_publicbank", "fpx_agrobank", "touchngo", "maybank2u_mae", "duitnow", "promptpay", "twint_pos", "alipay_hk", "alipay_hk_web", "alipay_hk_wap", "alipay_wap", "balanceplatform"]).optional()
}).passthrough()

export const PaymentMethodGroupSchema = z.object({
  name: z.string().optional(),
  paymentMethodData: z.string().optional(),
  type: z.string().optional()
}).passthrough()

export const PaymentMethodIssuerSchema = z.object({
  disabled: z.boolean().optional(),
  id: z.string(),
  name: z.string()
}).passthrough()

export const PaymentMethodToStoreSchema = z.object({
  brand: z.string().optional(),
  cvc: z.string().optional(),
  encryptedCard: z.string().max(40000).optional(),
  encryptedCardNumber: z.string().max(15000).optional(),
  encryptedExpiryMonth: z.string().max(15000).optional(),
  encryptedExpiryYear: z.string().max(15000).optional(),
  encryptedSecurityCode: z.string().max(15000).optional(),
  expiryMonth: z.string().optional(),
  expiryYear: z.string().optional(),
  holderName: z.string().optional(),
  number: z.string().optional(),
  type: z.string().optional()
}).passthrough()

export const PaymentReversalResponseSchema = z.object({
  merchantAccount: z.string(),
  paymentPspReference: z.string(),
  pspReference: z.string(),
  reference: z.string().optional(),
  status: z.enum(["received"])
}).passthrough()

export const PaymentValidationsNameRequestSchema = z.object({
  status: z.string()
}).passthrough()

export const PaymentValidationsNameResultRawResponseSchema = z.object({
  firstName: z.string().optional(),
  fullName: z.string().optional(),
  lastName: z.string().optional(),
  middleName: z.string().optional(),
  status: z.string().optional()
}).passthrough()

export const PaymentValidationsNameResultResponseSchema = z.object({
  firstName: z.string().optional(),
  fullName: z.string().optional(),
  lastName: z.string().optional(),
  middleName: z.string().optional()
}).passthrough()

export const PaypalUpdateOrderResponseSchema = z.object({
  paymentData: z.string(),
  status: z.enum(["error", "success"])
}).passthrough()

export const PhoneSchema = z.object({
  cc: z.string().min(1).max(3).optional(),
  subscriber: z.string().max(15).optional()
}).passthrough()

export const PlatformChargebackLogicSchema = z.object({
  behavior: z.enum(["deductFromOneBalanceAccount", "deductAccordingToSplitRatio", "deductFromLiableAccount"]).optional(),
  costAllocationAccount: z.string().optional(),
  targetAccount: z.string().optional()
}).passthrough()

export const PseDetailsSchema = z.object({
  bank: z.string(),
  checkoutAttemptId: z.string().optional(),
  clientType: z.string(),
  identification: z.string(),
  identificationType: z.string(),
  sdkData: z.string().max(50000).optional(),
  type: z.enum(["pse_payulatam"]).optional()
}).passthrough()

export const RakutenPayDetailsSchema = z.object({
  checkoutAttemptId: z.string().optional(),
  recurringDetailReference: z.string().optional(),
  sdkData: z.string().max(50000).optional(),
  storedPaymentMethodId: z.string().max(64).optional(),
  type: z.enum(["rakutenpay"]).optional()
}).passthrough()

export const RatepayDetailsSchema = z.object({
  billingAddress: z.string().optional(),
  checkoutAttemptId: z.string().optional(),
  deliveryAddress: z.string().optional(),
  personalDetails: z.string().optional(),
  recurringDetailReference: z.string().optional(),
  sdkData: z.string().max(50000).optional(),
  storedPaymentMethodId: z.string().max(64).optional(),
  type: z.enum(["ratepay", "ratepay_directdebit"])
}).passthrough()

export const RecurringSchema = z.object({
  contract: z.enum(["ONECLICK", "ONECLICK,RECURRING", "RECURRING", "PAYOUT", "EXTERNAL"]).optional(),
  recurringDetailName: z.string().optional(),
  recurringExpiry: z.string().optional(),
  recurringFrequency: z.string().optional(),
  tokenService: z.enum(["VISATOKENSERVICE", "MCTOKENSERVICE", "AMEXTOKENSERVICE", "TOKEN_SHARING"]).optional()
}).passthrough()

export const ResponseAdditionalData3DSecureSchema = z.object({
  cardHolderInfo: z.string().optional(),
  cavv: z.string().optional(),
  cavvAlgorithm: z.string().optional(),
  scaExemptionRequested: z.string().optional(),
  'threeds2.cardEnrolled': z.boolean().optional()
}).passthrough()

export const ResponseAdditionalDataBillingAddressSchema = z.object({
  'billingAddress.city': z.string().optional(),
  'billingAddress.country': z.string().optional(),
  'billingAddress.houseNumberOrName': z.string().optional(),
  'billingAddress.postalCode': z.string().optional(),
  'billingAddress.stateOrProvince': z.string().optional(),
  'billingAddress.street': z.string().optional()
}).passthrough()

export const ResponseAdditionalDataCardSchema = z.object({
  cardAltID: z.string().optional(),
  cardBin: z.string().optional(),
  cardHolderName: z.string().optional(),
  cardIssuingBank: z.string().optional(),
  cardIssuingCountry: z.string().optional(),
  cardIssuingCurrency: z.string().optional(),
  cardPaymentMethod: z.string().optional(),
  cardProductId: z.string().optional(),
  cardSummary: z.string().optional(),
  issuerBin: z.string().optional()
}).passthrough()

export const ResponseAdditionalDataCommonSchema = z.object({
  acquirerAccountCode: z.string().optional(),
  acquirerCode: z.string().optional(),
  acquirerReference: z.string().optional(),
  alias: z.string().optional(),
  aliasType: z.string().optional(),
  authCode: z.string().optional(),
  authorisationMid: z.string().optional(),
  authorisedAmountCurrency: z.string().optional(),
  authorisedAmountValue: z.string().optional(),
  avsResult: z.string().optional(),
  avsResultRaw: z.string().optional(),
  bic: z.string().optional(),
  coBrandedWith: z.string().optional(),
  cvcResult: z.string().optional(),
  cvcResultRaw: z.string().optional(),
  dsTransID: z.string().optional(),
  eci: z.string().optional(),
  expiryDate: z.string().optional(),
  extraCostsCurrency: z.string().optional(),
  extraCostsValue: z.string().optional(),
  'fraudCheck-[itemNr]-[FraudCheckname]': z.string().optional(),
  fraudManualReview: z.string().optional(),
  fraudResultType: z.enum(["AMBER", "GREEN", "RED"]).optional(),
  fraudRiskLevel: z.enum(["veryLow", "low", "medium", "high", "veryHigh"]).optional(),
  fundingSource: z.string().optional(),
  fundsAvailability: z.string().optional(),
  inferredRefusalReason: z.string().optional(),
  isCardCommercial: z.string().optional(),
  issuerCountry: z.string().optional(),
  liabilityShift: z.string().optional(),
  mcBankNetReferenceNumber: z.string().optional(),
  merchantAdviceCode: z.string().optional(),
  merchantReference: z.string().optional(),
  networkProcessingMode: z.string().optional(),
  networkTxReference: z.string().optional(),
  ownerName: z.string().optional(),
  paymentAccountReference: z.string().optional(),
  paymentMethod: z.string().optional(),
  paymentMethodVariant: z.string().optional(),
  payoutEligible: z.string().optional(),
  realtimeAccountUpdaterStatus: z.string().optional(),
  receiptFreeText: z.string().optional(),
  'recurring.contractTypes': z.string().optional(),
  'recurring.firstPspReference': z.string().optional(),
  'recurring.recurringDetailReference': z.string().optional(),
  'recurring.shopperReference': z.string().optional(),
  recurringProcessingModel: z.enum(["CardOnFile", "Subscription", "UnscheduledCardOnFile"]).optional(),
  referred: z.string().optional(),
  refusalReasonRaw: z.string().optional(),
  requestAmount: z.string().optional(),
  requestCurrencyCode: z.string().optional(),
  shopperInteraction: z.string().optional(),
  shopperReference: z.string().optional(),
  terminalId: z.string().optional(),
  threeDAuthenticated: z.string().optional(),
  threeDAuthenticatedResponse: z.string().optional(),
  threeDOffered: z.string().optional(),
  threeDOfferedResponse: z.string().optional(),
  threeDSVersion: z.string().optional(),
  'tokenization.shopperReference': z.string().optional(),
  'tokenization.store.operationType': z.enum(["created", "updated", "alreadyExisting"]).optional(),
  'tokenization.storedPaymentMethodId': z.string().optional(),
  transactionLinkId: z.string().optional(),
  visaTransactionId: z.string().optional(),
  xid: z.string().optional()
}).passthrough()

export const ResponseAdditionalDataDomesticErrorSchema = z.object({
  domesticRefusalReasonRaw: z.string().optional(),
  domesticShopperAdvice: z.string().optional()
}).passthrough()

export const ResponseAdditionalDataInstallmentsSchema = z.object({
  'installmentPaymentData.installmentType': z.string().optional(),
  'installmentPaymentData.option[itemNr].annualPercentageRate': z.string().optional(),
  'installmentPaymentData.option[itemNr].firstInstallmentAmount': z.string().optional(),
  'installmentPaymentData.option[itemNr].installmentFee': z.string().optional(),
  'installmentPaymentData.option[itemNr].interestRate': z.string().optional(),
  'installmentPaymentData.option[itemNr].maximumNumberOfInstallments': z.string().optional(),
  'installmentPaymentData.option[itemNr].minimumNumberOfInstallments': z.string().optional(),
  'installmentPaymentData.option[itemNr].numberOfInstallments': z.string().optional(),
  'installmentPaymentData.option[itemNr].subsequentInstallmentAmount': z.string().optional(),
  'installmentPaymentData.option[itemNr].totalAmountDue': z.string().optional(),
  'installmentPaymentData.paymentOptions': z.string().optional(),
  'installments.value': z.string().optional()
}).passthrough()

export const ResponseAdditionalDataNetworkTokensSchema = z.object({
  'networkToken.available': z.string().optional(),
  'networkToken.bin': z.string().optional(),
  'networkToken.tokenSummary': z.string().optional()
}).passthrough()

export const ResponseAdditionalDataOpiSchema = z.object({
  'opi.transToken': z.string().optional()
}).passthrough()

export const ResponseAdditionalDataSepaSchema = z.object({
  'sepadirectdebit.dateOfSignature': z.string().optional(),
  'sepadirectdebit.mandateId': z.string().optional(),
  'sepadirectdebit.sepadirectdebit.dueDate': z.string().optional(),
  'sepadirectdebit.sequenceType': z.string().optional()
}).passthrough()

export const ResponseAdditionalDataSwishSchema = z.object({
  'swish.payerAlias': z.string().optional()
}).passthrough()

export const ResponsePaymentMethodSchema = z.object({
  brand: z.string().optional(),
  type: z.string().optional()
}).passthrough()

export const RiskDataSchema = z.object({
  clientData: z.string().max(5000).optional(),
  customFields: z.record(z.string(), z.string()).optional(),
  fraudOffset: z.number().optional(),
  profileReference: z.string().optional()
}).passthrough()

export const RivertyDetailsSchema = z.object({
  billingAddress: z.string().optional(),
  checkoutAttemptId: z.string().optional(),
  deliveryAddress: z.string().optional(),
  deviceFingerprint: z.string().max(5000).optional(),
  iban: z.string().max(34).optional(),
  personalDetails: z.string().optional(),
  recurringDetailReference: z.string().optional(),
  sdkData: z.string().max(50000).optional(),
  storedPaymentMethodId: z.string().max(64).optional(),
  subtype: z.string().optional(),
  type: z.enum(["riverty", "riverty_account", "riverty_installments", "sepadirectdebit_riverty"])
}).passthrough()

export const SDKEphemPubKeySchema = z.object({
  crv: z.string().optional(),
  kty: z.string().optional(),
  x: z.string().optional(),
  y: z.string().optional()
}).passthrough()

export const SamsungPayDetailsSchema = z.object({
  checkoutAttemptId: z.string().optional(),
  fundingSource: z.enum(["credit", "debit", "prepaid"]).optional(),
  recurringDetailReference: z.string().optional(),
  samsungPayToken: z.string().max(10000),
  sdkData: z.string().max(50000).optional(),
  storedPaymentMethodId: z.string().max(64).optional(),
  type: z.enum(["samsungpay"]).optional()
}).passthrough()

export const ScreenDimensionsSchema = z.object({
  height: z.number().optional(),
  width: z.number().optional()
}).passthrough()

export const SepaDirectDebitDetailsSchema = z.object({
  checkoutAttemptId: z.string().optional(),
  dueDate: z.string().optional(),
  iban: z.string(),
  ownerName: z.string(),
  recurringDetailReference: z.string().optional(),
  sdkData: z.string().max(50000).optional(),
  storedPaymentMethodId: z.string().max(64).optional(),
  transferInstrumentId: z.string().optional(),
  type: z.enum(["sepadirectdebit", "sepadirectdebit_amazonpay"]).optional()
}).passthrough()

export const ServiceErrorSchema = z.object({
  additionalData: z.record(z.string(), z.string()).optional(),
  errorCode: z.string().optional(),
  errorType: z.string().optional(),
  message: z.string().optional(),
  pspReference: z.string().optional(),
  status: z.number().optional()
}).passthrough()

export const ShopperInteractionDeviceSchema = z.object({
  locale: z.string().optional(),
  os: z.string().optional(),
  osVersion: z.string().optional()
}).passthrough()

export const ShopperNameSchema = z.object({
  firstName: z.string().max(80),
  lastName: z.string().max(80)
}).passthrough()

export const ShopperTaxInfoSchema = z.object({
  taxCountryCode: z.string().max(2),
  taxIdentificationNumber: z.string().max(20)
}).passthrough()

export const SplitAmountSchema = z.object({
  currency: z.string().min(3).max(3).optional(),
  value: z.number()
}).passthrough()

export const StandalonePaymentCancelResponseSchema = z.object({
  merchantAccount: z.string(),
  paymentReference: z.string(),
  pspReference: z.string(),
  reference: z.string().optional(),
  status: z.enum(["received"])
}).passthrough()

export const StoredPaymentMethodSchema = z.object({
  bankAccountNumber: z.string().optional(),
  bankLocationId: z.string().optional(),
  brand: z.string().optional(),
  cashtag: z.string().optional(),
  expiryMonth: z.string().optional(),
  expiryYear: z.string().optional(),
  holderName: z.string().optional(),
  iban: z.string().optional(),
  id: z.string().optional(),
  label: z.string().optional(),
  lastFour: z.string().optional(),
  name: z.string().optional(),
  networkTxReference: z.string().optional(),
  ownerName: z.string().optional(),
  shopperEmail: z.string().optional(),
  supportedRecurringProcessingModels: z.array(z.string()).optional(),
  supportedShopperInteractions: z.array(z.string()).optional(),
  type: z.string().optional()
}).passthrough()

export const StoredPaymentMethodDetailsSchema = z.object({
  checkoutAttemptId: z.string().optional(),
  recurringDetailReference: z.string().optional(),
  sdkData: z.string().max(50000).optional(),
  storedPaymentMethodId: z.string().max(64).optional(),
  type: z.enum(["alipay_plus", "alipay_plus_alipay_cn", "alipay_plus_alipay_hk", "alipay_plus_dana", "alipay_plus_gcash", "alipay_plus_kakaopay", "alipay_plus_kplus", "alipay_plus_naverpay", "alipay_plus_rabbitlinepay", "alipay_plus_tosspay", "alipay_plus_touchngo", "alipay_plus_truemoney", "bcmc_mobile", "bcmc_mobile_QR", "bcmc_mobile_app", "momo_wallet", "momo_wallet_app", "paymaya_wallet", "grabpay_SG", "grabpay_MY", "grabpay_TH", "grabpay_ID", "grabpay_VN", "grabpay_PH", "oxxo", "gcash", "dana", "kakaopay", "truemoney", "paysafecard"]).optional()
}).passthrough()

export const SubMerchantSchema = z.object({
  city: z.string().optional(),
  country: z.string().optional(),
  mcc: z.string().optional(),
  name: z.string().optional(),
  taxId: z.string().optional()
}).passthrough()

export const SurchargeSchema = z.object({
  value: z.number()
}).passthrough()

export const ThreeDS2ResponseDataSchema = z.object({
  acsChallengeMandated: z.string().optional(),
  acsOperatorID: z.string().optional(),
  acsReferenceNumber: z.string().optional(),
  acsSignedContent: z.string().optional(),
  acsTransID: z.string().optional(),
  acsURL: z.string().optional(),
  authenticationType: z.string().optional(),
  cardHolderInfo: z.string().optional(),
  cavvAlgorithm: z.string().optional(),
  challengeIndicator: z.string().optional(),
  dsReferenceNumber: z.string().optional(),
  dsTransID: z.string().optional(),
  exemptionIndicator: z.string().optional(),
  messageVersion: z.string().optional(),
  riskScore: z.string().optional(),
  sdkEphemPubKey: z.string().optional(),
  threeDSServerTransID: z.string().optional(),
  transStatus: z.string().optional(),
  transStatusReason: z.string().optional()
}).passthrough()

export const ThreeDS2ResultSchema = z.object({
  authenticationValue: z.string().optional(),
  cavvAlgorithm: z.string().optional(),
  challengeCancel: z.enum(["01", "02", "03", "04", "05", "06", "07"]).optional(),
  dsTransID: z.string().optional(),
  eci: z.string().optional(),
  exemptionIndicator: z.enum(["lowValue", "secureCorporate", "trustedBeneficiary", "transactionRiskAnalysis"]).optional(),
  messageVersion: z.string().optional(),
  riskScore: z.string().optional(),
  threeDSRequestorChallengeInd: z.enum(["01", "02", "03", "04", "05", "06"]).optional(),
  threeDSServerTransID: z.string().optional(),
  timestamp: z.string().optional(),
  transStatus: z.string().optional(),
  transStatusReason: z.string().optional(),
  whiteListStatus: z.string().optional()
}).passthrough()

export const ThreeDSRequestDataSchema = z.object({
  challengeWindowSize: z.enum(["01", "02", "03", "04", "05"]).optional(),
  dataOnly: z.enum(["false", "true"]).optional(),
  nativeThreeDS: z.enum(["preferred", "disabled"]).optional(),
  threeDSVersion: z.enum(["2.1.0", "2.2.0"]).optional()
}).passthrough()

export const ThreeDSRequestorAuthenticationInfoSchema = z.object({
  threeDSReqAuthData: z.string().optional(),
  threeDSReqAuthMethod: z.enum(["01", "02", "03", "04", "05", "06"]).optional(),
  threeDSReqAuthTimestamp: z.string().min(12).max(12).optional()
}).passthrough()

export const ThreeDSRequestorPriorAuthenticationInfoSchema = z.object({
  threeDSReqPriorAuthData: z.string().optional(),
  threeDSReqPriorAuthMethod: z.enum(["01", "02", "03", "04"]).optional(),
  threeDSReqPriorAuthTimestamp: z.string().min(12).max(12).optional(),
  threeDSReqPriorRef: z.string().min(36).max(36).optional()
}).passthrough()

export const ThreeDSecureDataSchema = z.object({
  authenticationResponse: z.enum(["Y", "N", "U", "A"]).optional(),
  cavv: z.string().optional(),
  cavvAlgorithm: z.string().optional(),
  challengeCancel: z.enum(["01", "02", "03", "04", "05", "06", "07"]).optional(),
  directoryResponse: z.enum(["A", "C", "D", "I", "N", "R", "U", "Y"]).optional(),
  dsTransID: z.string().optional(),
  eci: z.string().optional(),
  riskScore: z.string().optional(),
  threeDSVersion: z.string().optional(),
  tokenAuthenticationVerificationValue: z.string().optional(),
  transStatusReason: z.string().optional(),
  xid: z.string().optional()
}).passthrough()

export const TicketSchema = z.object({
  issueAddress: z.string().optional(),
  issueDate: z.string().optional(),
  number: z.string().optional()
}).passthrough()

export const TokenMandateSchema = z.object({
  accountIdType: z.string().optional(),
  amount: z.string(),
  amountRule: z.enum(["max", "exact"]).optional(),
  billingAttemptsRule: z.enum(["on", "before", "after"]).optional(),
  billingDay: z.string().optional(),
  count: z.string().optional(),
  currency: z.string(),
  endsAt: z.string(),
  frequency: z.enum(["adhoc", "daily", "weekly", "biWeekly", "monthly", "quarterly", "halfYearly", "yearly"]),
  mandateId: z.string(),
  maskedAccountId: z.string().optional(),
  minAmount: z.string().optional(),
  providerId: z.string(),
  recurringAmount: z.string().optional(),
  recurringStatement: z.string().max(35).optional(),
  remarks: z.string().optional(),
  retryPolicy: z.enum(["true", "false"]).optional(),
  startsAt: z.string().optional(),
  status: z.string(),
  txVariant: z.string()
}).passthrough()

export const TravelAgencySchema = z.object({
  code: z.string().optional(),
  name: z.string().optional()
}).passthrough()

export const TwintDetailsSchema = z.object({
  checkoutAttemptId: z.string().optional(),
  recurringDetailReference: z.string().optional(),
  sdkData: z.string().max(50000).optional(),
  storedPaymentMethodId: z.string().max(64).optional(),
  subtype: z.string().optional(),
  type: z.enum(["twint"]).optional()
}).passthrough()

export const UpdatePaymentLinkRequestSchema = z.object({
  status: z.enum(["expired"])
}).passthrough()

export const UpiCollectDetailsSchema = z.object({
  billingSequenceNumber: z.string().optional(),
  checkoutAttemptId: z.string().optional(),
  recurringDetailReference: z.string().optional(),
  sdkData: z.string().max(50000).optional(),
  shopperNotificationReference: z.string().optional(),
  storedPaymentMethodId: z.string().max(64).optional(),
  type: z.enum(["upi_collect"]),
  virtualPaymentAddress: z.string().optional()
}).passthrough()

export const UpiIntentDetailsSchema = z.object({
  appId: z.string().optional(),
  billingSequenceNumber: z.string().optional(),
  checkoutAttemptId: z.string().optional(),
  recurringDetailReference: z.string().optional(),
  sdkData: z.string().max(50000).optional(),
  shopperNotificationReference: z.string().optional(),
  storedPaymentMethodId: z.string().max(64).optional(),
  type: z.enum(["upi_intent"])
}).passthrough()

export const UpiQrDetailsSchema = z.object({
  billingSequenceNumber: z.string().optional(),
  checkoutAttemptId: z.string().optional(),
  recurringDetailReference: z.string().optional(),
  sdkData: z.string().max(50000).optional(),
  shopperNotificationReference: z.string().optional(),
  storedPaymentMethodId: z.string().max(64).optional(),
  type: z.enum(["upi_qr"])
}).passthrough()

export const UtilityRequestSchema = z.object({
  originDomains: z.array(z.string())
}).passthrough()

export const UtilityResponseSchema = z.object({
  originKeys: z.record(z.string(), z.string()).optional()
}).passthrough()

export const VippsDetailsSchema = z.object({
  checkoutAttemptId: z.string().optional(),
  recurringDetailReference: z.string().optional(),
  sdkData: z.string().max(50000).optional(),
  storedPaymentMethodId: z.string().max(64).optional(),
  telephoneNumber: z.string(),
  type: z.enum(["vipps"]).optional()
}).passthrough()

export const VisaCheckoutDetailsSchema = z.object({
  checkoutAttemptId: z.string().optional(),
  fundingSource: z.enum(["credit", "debit", "prepaid"]).optional(),
  sdkData: z.string().max(50000).optional(),
  type: z.enum(["visacheckout"]).optional(),
  visaCheckoutCallId: z.string()
}).passthrough()

export const WeChatPayDetailsSchema = z.object({
  checkoutAttemptId: z.string().optional(),
  sdkData: z.string().max(50000).optional(),
  type: z.enum(["wechatpay", "wechatpay_pos"]).optional()
}).passthrough()

export const WeChatPayMiniProgramDetailsSchema = z.object({
  appId: z.string().optional(),
  checkoutAttemptId: z.string().optional(),
  openid: z.string().optional(),
  recurringDetailReference: z.string().optional(),
  sdkData: z.string().max(50000).optional(),
  storedPaymentMethodId: z.string().max(64).optional(),
  type: z.enum(["wechatpayMiniProgram"]).optional()
}).passthrough()

export const ZipDetailsSchema = z.object({
  checkoutAttemptId: z.string().optional(),
  clickAndCollect: z.string().optional(),
  recurringDetailReference: z.string().optional(),
  sdkData: z.string().max(50000).optional(),
  storedPaymentMethodId: z.string().max(64).optional(),
  type: z.enum(["zip", "zip_pos"]).optional()
}).passthrough()

export const InvalidFieldSchema = z.object({
  message: z.string(),
  name: z.string(),
  value: z.string()
}).passthrough()

export const ResultSchema = z.enum(["VALID", "INVALID", "UNKNOWN", "NOT_REQUIRED"])

export const ShopperIdPaymentMethodSchema = z.object({
  type: z.string().min(0).max(50).regex(new RegExp("payTo|upi_collect"))
}).passthrough()

export const CheckoutBankTransferActionSchema = z.object({
  accountNumber: z.string().optional(),
  bankCode: z.string().optional(),
  beneficiary: z.string().optional(),
  bic: z.string().optional(),
  branchCode: z.string().optional(),
  downloadUrl: z.string().optional(),
  iban: z.string().optional(),
  paymentMethodType: z.string().optional(),
  reference: z.string().optional(),
  routingNumber: z.string().optional(),
  shopperEmail: z.string().optional(),
  sortCode: z.string().optional(),
  totalAmount: AmountSchema.optional(),
  type: z.enum(["bankTransfer"]),
  url: z.string().optional()
}).passthrough()

export const CheckoutOrderResponseSchema = z.object({
  amount: AmountSchema.optional(),
  expiresAt: z.string().optional(),
  orderData: z.string().optional(),
  pspReference: z.string(),
  reference: z.string().optional(),
  remainingAmount: AmountSchema.optional()
}).passthrough()

export const CheckoutVoucherActionSchema = z.object({
  alternativeReference: z.string().optional(),
  collectionInstitutionNumber: z.string().optional(),
  downloadUrl: z.string().optional(),
  entity: z.string().optional(),
  expiresAt: z.string().optional(),
  initialAmount: AmountSchema.optional(),
  instructionsUrl: z.string().optional(),
  issuer: z.string().optional(),
  maskedTelephoneNumber: z.string().optional(),
  merchantName: z.string().optional(),
  merchantReference: z.string().optional(),
  passCreationToken: z.string().optional(),
  paymentData: z.string().optional(),
  paymentMethodType: z.string().optional(),
  reference: z.string().optional(),
  shopperEmail: z.string().optional(),
  shopperName: z.string().optional(),
  surcharge: AmountSchema.optional(),
  totalAmount: AmountSchema.optional(),
  type: z.enum(["voucher"]),
  url: z.string().optional()
}).passthrough()

export const CreateOrderRequestSchema = z.object({
  amount: AmountSchema,
  expiresAt: z.string().optional(),
  merchantAccount: z.string(),
  reference: z.string()
}).passthrough()

export const DeliveryMethodSchema = z.object({
  amount: AmountSchema.optional(),
  description: z.string().optional(),
  reference: z.string().optional(),
  selected: z.boolean().optional(),
  type: z.enum(["Shipping"]).optional()
}).passthrough()

export const ForexQuoteSchema = z.object({
  account: z.string().optional(),
  accountType: z.string().optional(),
  baseAmount: AmountSchema.optional(),
  basePoints: z.number(),
  buy: AmountSchema.optional(),
  interbank: AmountSchema.optional(),
  reference: z.string().optional(),
  sell: AmountSchema.optional(),
  signature: z.string().optional(),
  source: z.string().optional(),
  type: z.string().optional(),
  validTill: z.string()
}).passthrough()

export const MerchantRiskIndicatorSchema = z.object({
  addressMatch: z.boolean().optional(),
  deliveryAddressIndicator: z.enum(["shipToBillingAddress", "shipToVerifiedAddress", "shipToNewAddress", "shipToStore", "digitalGoods", "goodsNotShipped", "other"]).optional(),
  deliveryEmail: z.string().optional(),
  deliveryEmailAddress: z.string().max(254).optional(),
  deliveryTimeframe: z.enum(["electronicDelivery", "sameDayShipping", "overnightShipping", "twoOrMoreDaysShipping"]).optional(),
  giftCardAmount: AmountSchema.optional(),
  giftCardCount: z.number().optional(),
  giftCardCurr: z.string().optional(),
  preOrderDate: z.string().optional(),
  preOrderPurchase: z.boolean().optional(),
  preOrderPurchaseInd: z.string().optional(),
  reorderItems: z.boolean().optional(),
  reorderItemsInd: z.string().optional(),
  shipIndicator: z.string().optional()
}).passthrough()

export const PixRecurringSchema = z.object({
  billingDate: z.string().optional(),
  businessDayOnly: z.boolean().optional(),
  endsAt: z.string().optional(),
  frequency: z.enum(["weekly", "monthly", "quarterly", "half-yearly", "yearly"]).optional(),
  minAmount: AmountSchema.optional(),
  originalPspReference: z.string().optional(),
  recurringAmount: AmountSchema.optional(),
  recurringStatement: z.string().optional(),
  retryPolicy: z.boolean().optional(),
  startsAt: z.string().optional()
}).passthrough()

export const TaxTotalSchema = z.object({
  amount: AmountSchema.optional()
}).passthrough()

export const PaymentMethodUPIAppsSchema = z.object({
  appIdentifierInfo: AppIdentifierInfoSchema.optional(),
  id: z.string(),
  name: z.string()
}).passthrough()

export const SubMerchantInfoSchema = z.object({
  address: BillingAddressSchema.optional(),
  amount: AmountSchema.optional(),
  email: z.string().max(320).optional(),
  id: z.string().optional(),
  mcc: z.string().optional(),
  name: z.string().optional(),
  phoneNumber: z.string().max(20).optional(),
  registeredSince: z.string().optional(),
  taxId: z.string().optional(),
  url: z.string().max(320).optional()
}).passthrough()

export const CardDetailsResponseSchema = z.object({
  brands: z.array(CardBrandDetailsSchema).optional(),
  fundingSource: z.string().optional(),
  isCardCommercial: z.boolean().optional(),
  issuingCountryCode: z.string().optional()
}).passthrough()

export const CheckoutForwardResponseSchema = z.object({
  merchantReference: z.string().optional(),
  pspReference: z.string().optional(),
  response: CheckoutForwardResponseFromUrlSchema,
  storedPaymentMethodId: z.string().optional()
}).passthrough()

export const CheckoutForwardRequestOptionsSchema = z.object({
  accountUpdate: z.boolean().optional(),
  dryRun: z.boolean().optional(),
  networkToken: CheckoutNetworkTokenOptionSchema.optional(),
  networkTxReferencePaths: z.array(z.string()).optional(),
  tokenize: z.boolean().optional(),
  transactionLinkIdPaths: z.array(z.string()).optional()
}).passthrough()

export const DonationCampaignSchema = z.object({
  amounts: AmountsSchema.optional(),
  bannerUrl: z.string().optional(),
  campaignName: z.string().optional(),
  causeName: z.string().optional(),
  donation: DonationSchema.optional(),
  id: z.string().optional(),
  logoUrl: z.string().optional(),
  nonprofitDescription: z.string().optional(),
  nonprofitName: z.string().optional(),
  nonprofitUrl: z.string().optional(),
  termsAndConditionsUrl: z.string().optional()
}).passthrough()

export const CancelOrderRequestSchema = z.object({
  merchantAccount: z.string(),
  order: EncryptedOrderDataSchema
}).passthrough()

export const PaymentMethodsRequestSchema = z.object({
  additionalData: z.record(z.string(), z.string()).optional(),
  allowedPaymentMethods: z.array(z.string()).optional(),
  amount: AmountSchema.optional(),
  blockedPaymentMethods: z.array(z.string()).optional(),
  browserInfo: BrowserInfoSchema.optional(),
  channel: z.enum(["iOS", "Android", "Web"]).optional(),
  countryCode: z.string().optional(),
  merchantAccount: z.string(),
  order: EncryptedOrderDataSchema.optional(),
  shopperConversionId: z.string().max(256).optional(),
  shopperEmail: z.string().optional(),
  shopperIP: z.string().optional(),
  shopperLocale: z.string().optional(),
  shopperReference: z.string().optional(),
  splitCardFundingSources: z.boolean().optional(),
  store: z.string().min(1).max(16).optional(),
  storeFiltrationMode: z.enum(["exclusive", "inclusive", "skipFilter"]).optional(),
  telephoneNumber: z.string().optional()
}).passthrough()

export const FraudResultSchema = z.object({
  accountScore: z.number(),
  results: z.array(FraudCheckResultSchema).optional()
}).passthrough()

export const SubInputDetailSchema = z.object({
  configuration: z.record(z.string(), z.string()).optional(),
  items: z.array(ItemSchema).optional(),
  key: z.string().optional(),
  optional: z.boolean().optional(),
  type: z.string().optional(),
  value: z.string().optional()
}).passthrough()

export const LevelTwoThreeSchema = z.object({
  customerReferenceNumber: z.string().optional(),
  destination: DestinationSchema.optional(),
  dutyAmount: z.number().optional(),
  freightAmount: z.number().optional(),
  itemDetailLines: z.array(ItemDetailLineSchema).optional(),
  orderDate: z.string().optional(),
  shipFromPostalCode: z.string().optional(),
  totalTaxAmount: z.number().optional()
}).passthrough()

export const FundOriginSchema = z.object({
  billingAddress: AddressSchema.optional(),
  shopperEmail: z.string().optional(),
  shopperName: NameSchema.optional(),
  telephoneNumber: z.string().optional(),
  walletIdentifier: z.string().optional()
}).passthrough()

export const PaymentDetailsRequestSchema = z.object({
  authenticationData: DetailsRequestAuthenticationDataSchema.optional(),
  details: PaymentCompletionDetailsSchema,
  paymentData: z.string().max(200000).optional(),
  threeDSAuthenticationOnly: z.boolean().optional()
}).passthrough()

export const StoredPaymentMethodRequestSchema = z.object({
  merchantAccount: z.string(),
  paymentMethod: PaymentMethodToStoreSchema,
  recurringProcessingModel: z.enum(["CardOnFile", "Subscription", "UnscheduledCardOnFile"]),
  shopperEmail: z.string().optional(),
  shopperIP: z.string().optional(),
  shopperReference: z.string()
}).passthrough()

export const PaymentValidationsSchema = z.object({
  name: PaymentValidationsNameRequestSchema.optional()
}).passthrough()

export const PaymentValidationsNameResponseSchema = z.object({
  rawResponse: PaymentValidationsNameResultRawResponseSchema.optional(),
  result: PaymentValidationsNameResultResponseSchema.optional(),
  status: z.enum(["notPerformed", "notSupported", "performed"]).optional()
}).passthrough()

export const CheckoutSessionThreeDS2RequestDataSchema = z.object({
  homePhone: PhoneSchema.optional(),
  mobilePhone: PhoneSchema.optional(),
  threeDSRequestorChallengeInd: z.enum(["01", "02", "03", "04", "05", "06"]).optional(),
  workPhone: PhoneSchema.optional()
}).passthrough()

export const PaymentSchema = z.object({
  amount: AmountSchema.optional(),
  paymentMethod: ResponsePaymentMethodSchema.optional(),
  pspReference: z.string().optional(),
  resultCode: z.enum(["Authorised", "Received", "Pending"]).optional()
}).passthrough()

export const PixPayByBankRiskSignalsSchema = z.object({
  confidenceScore: ConfidenceScoreSchema.optional(),
  elapsedTimeSinceBoot: z.number().optional(),
  isRootedDevice: z.boolean().optional(),
  language: z.string().optional(),
  osVersion: z.string().max(32).optional(),
  screenBrightness: z.number().optional(),
  screenDimensions: ScreenDimensionsSchema.optional(),
  userTimeZoneOffset: z.number().optional()
}).passthrough()

export const ApplicationInfoSchema = z.object({
  adyenLibrary: CommonFieldSchema.optional(),
  adyenPaymentSource: CommonFieldSchema.optional(),
  externalPlatform: ExternalPlatformSchema.optional(),
  merchantApplication: CommonFieldSchema.optional(),
  merchantDevice: MerchantDeviceSchema.optional(),
  shopperInteractionDevice: ShopperInteractionDeviceSchema.optional()
}).passthrough()

export const SplitSchema = z.object({
  account: z.string().optional(),
  amount: SplitAmountSchema.optional(),
  description: z.string().optional(),
  reference: z.string().optional(),
  type: z.enum(["AcquiringFees", "AdyenCommission", "AdyenFees", "AdyenMarkup", "BalanceAccount", "Commission", "Default", "Interchange", "MarketPlace", "PaymentFee", "Remainder", "SchemeFee", "Surcharge", "Tip", "TopUp", "VAT"])
}).passthrough()

export const FundRecipientSchema = z.object({
  IBAN: z.string().optional(),
  billingAddress: AddressSchema.optional(),
  paymentMethod: CardDetailsSchema.optional(),
  shopperEmail: z.string().optional(),
  shopperName: NameSchema.optional(),
  shopperReference: z.string().min(3).max(256).optional(),
  storedPaymentMethodId: z.string().max(64).optional(),
  subMerchant: SubMerchantSchema.optional(),
  telephoneNumber: z.string().optional(),
  walletIdentifier: z.string().optional(),
  walletOwnerTaxId: z.string().optional(),
  walletPurpose: z.enum(["identifiedBoleto", "transferDifferentWallet", "transferOwnWallet", "transferSameWallet", "unidentifiedBoleto"]).optional()
}).passthrough()

export const AuthenticationDataSchema = z.object({
  attemptAuthentication: z.enum(["always", "never"]).optional(),
  authenticationOnly: z.boolean().optional(),
  threeDSRequestData: ThreeDSRequestDataSchema.optional()
}).passthrough()

export const ThreeDS2RequestDataSchema = z.object({
  acctInfo: AcctInfoSchema.optional(),
  acctType: z.enum(["01", "02", "03"]).optional(),
  acquirerBIN: z.string().optional(),
  acquirerMerchantID: z.string().optional(),
  addrMatch: z.enum(["Y", "N"]).optional(),
  authenticationOnly: z.boolean().optional(),
  challengeIndicator: z.enum(["noPreference", "requestNoChallenge", "requestChallenge", "requestChallengeAsMandate"]).optional(),
  deviceChannel: z.string(),
  deviceRenderOptions: DeviceRenderOptionsSchema.optional(),
  homePhone: PhoneSchema.optional(),
  mcc: z.string().optional(),
  merchantName: z.string().optional(),
  messageVersion: z.string().optional(),
  mobilePhone: PhoneSchema.optional(),
  notificationURL: z.string().optional(),
  payTokenInd: z.boolean().optional(),
  paymentAuthenticationUseCase: z.string().optional(),
  purchaseInstalData: z.string().min(1).max(3).optional(),
  recurringExpiry: z.string().optional(),
  recurringFrequency: z.string().max(4).optional(),
  sdkAppID: z.string().optional(),
  sdkEncData: z.string().optional(),
  sdkEphemPubKey: SDKEphemPubKeySchema.optional(),
  sdkMaxTimeout: z.number().optional(),
  sdkReferenceNumber: z.string().optional(),
  sdkTransID: z.string().optional(),
  sdkVersion: z.string().optional(),
  threeDSCompInd: z.string().optional(),
  threeDSRequestorAuthenticationInd: z.string().optional(),
  threeDSRequestorAuthenticationInfo: ThreeDSRequestorAuthenticationInfoSchema.optional(),
  threeDSRequestorChallengeInd: z.enum(["01", "02", "03", "04", "05", "06"]).optional(),
  threeDSRequestorID: z.string().optional(),
  threeDSRequestorName: z.string().optional(),
  threeDSRequestorPriorAuthenticationInfo: ThreeDSRequestorPriorAuthenticationInfoSchema.optional(),
  threeDSRequestorURL: z.string().optional(),
  transType: z.enum(["01", "03", "10", "11", "28"]).optional(),
  transactionType: z.enum(["goodsOrServicePurchase", "checkAcceptance", "accountFunding", "quasiCashTransaction", "prepaidActivationAndLoad"]).optional(),
  whiteListStatus: z.string().optional(),
  workPhone: PhoneSchema.optional()
}).passthrough()

export const ThreeDS2RequestFieldsSchema = z.object({
  acctInfo: AcctInfoSchema.optional(),
  acctType: z.enum(["01", "02", "03"]).optional(),
  acquirerBIN: z.string().optional(),
  acquirerMerchantID: z.string().optional(),
  addrMatch: z.enum(["Y", "N"]).optional(),
  authenticationOnly: z.boolean().optional(),
  challengeIndicator: z.enum(["noPreference", "requestNoChallenge", "requestChallenge", "requestChallengeAsMandate"]).optional(),
  deviceRenderOptions: DeviceRenderOptionsSchema.optional(),
  homePhone: PhoneSchema.optional(),
  mcc: z.string().optional(),
  merchantName: z.string().optional(),
  messageVersion: z.string().optional(),
  mobilePhone: PhoneSchema.optional(),
  notificationURL: z.string().optional(),
  payTokenInd: z.boolean().optional(),
  paymentAuthenticationUseCase: z.string().optional(),
  purchaseInstalData: z.string().min(1).max(3).optional(),
  recurringExpiry: z.string().optional(),
  recurringFrequency: z.string().max(4).optional(),
  sdkAppID: z.string().optional(),
  sdkEphemPubKey: SDKEphemPubKeySchema.optional(),
  sdkMaxTimeout: z.number().optional(),
  sdkReferenceNumber: z.string().optional(),
  sdkTransID: z.string().optional(),
  threeDSCompInd: z.string().optional(),
  threeDSRequestorAuthenticationInd: z.string().optional(),
  threeDSRequestorAuthenticationInfo: ThreeDSRequestorAuthenticationInfoSchema.optional(),
  threeDSRequestorChallengeInd: z.enum(["01", "02", "03", "04", "05", "06"]).optional(),
  threeDSRequestorID: z.string().optional(),
  threeDSRequestorName: z.string().optional(),
  threeDSRequestorPriorAuthenticationInfo: ThreeDSRequestorPriorAuthenticationInfoSchema.optional(),
  threeDSRequestorURL: z.string().optional(),
  transType: z.enum(["01", "03", "10", "11", "28"]).optional(),
  transactionType: z.enum(["goodsOrServicePurchase", "checkAcceptance", "accountFunding", "quasiCashTransaction", "prepaidActivationAndLoad"]).optional(),
  whiteListStatus: z.string().optional(),
  workPhone: PhoneSchema.optional()
}).passthrough()

export const StoredPaymentMethodResourceSchema = z.object({
  alias: z.string().optional(),
  aliasType: z.string().optional(),
  brand: z.string().optional(),
  cardBin: z.string().optional(),
  expiryMonth: z.string().optional(),
  expiryYear: z.string().optional(),
  externalResponseCode: z.string().optional(),
  externalTokenReference: z.string().optional(),
  holderName: z.string().optional(),
  iban: z.string().optional(),
  id: z.string().optional(),
  issuerName: z.string().optional(),
  lastFour: z.string().optional(),
  mandate: TokenMandateSchema.optional(),
  name: z.string().optional(),
  networkTxReference: z.string().optional(),
  ownerName: z.string().optional(),
  shopperEmail: z.string().optional(),
  shopperReference: z.string().min(3).max(256).optional(),
  supportedRecurringProcessingModels: z.array(z.string()).optional(),
  type: z.string().optional()
}).passthrough()

export const AirlineSchema = z.object({
  agency: AgencySchema.optional(),
  boardingFee: z.number().optional(),
  code: z.string().optional(),
  computerizedReservationSystem: z.string().optional(),
  customerReferenceNumber: z.string().optional(),
  designatorCode: z.string().optional(),
  documentType: z.string().optional(),
  flightDate: z.string().optional(),
  legs: z.array(LegSchema).optional(),
  passengerName: z.string(),
  passengers: z.array(PassengerSchema).optional(),
  ticket: TicketSchema.optional(),
  travelAgency: TravelAgencySchema.optional()
}).passthrough()

export const DefaultErrorResponseEntitySchema = z.object({
  detail: z.string().optional(),
  errorCode: z.string().optional(),
  instance: z.string().optional(),
  invalidFields: z.array(InvalidFieldSchema).optional(),
  requestId: z.string().optional(),
  status: z.number().optional(),
  title: z.string().optional(),
  type: z.string().optional()
}).passthrough()

export const ValidateShopperIdResponseSchema = z.object({
  reason: z.string().optional(),
  result: ResultSchema.optional()
}).passthrough()

export const PayToPaymentMethodSchema = ShopperIdPaymentMethodSchema.and(z.object({
  shopperReference: z.string().min(0).max(256).optional()
}).passthrough())

export const UPIPaymentMethodSchema = ShopperIdPaymentMethodSchema.and(z.object({
  virtualPaymentAddress: z.string().min(1).max(256).optional()
}).passthrough())

export const ValidateShopperIdRequestSchema = z.object({
  merchantAccount: z.string().min(0).max(1000),
  paymentMethod: ShopperIdPaymentMethodSchema,
  shopperEmail: z.string().min(0).max(300).optional(),
  shopperIP: z.string().min(0).max(15).optional(),
  shopperReference: z.string().min(0).max(256).optional()
}).passthrough()

export const PixDetailsSchema = z.object({
  checkoutAttemptId: z.string().optional(),
  pixRecurring: PixRecurringSchema.optional(),
  recurringDetailReference: z.string().optional(),
  sdkData: z.string().max(50000).optional(),
  storedPaymentMethodId: z.string().max(64).optional(),
  type: z.enum(["pix"]).optional()
}).passthrough()

export const PaypalUpdateOrderRequestSchema = z.object({
  amount: AmountSchema.optional(),
  deliveryMethods: z.array(DeliveryMethodSchema).optional(),
  paymentData: z.string().optional(),
  pspReference: z.string().optional(),
  sessionId: z.string().optional(),
  taxTotal: TaxTotalSchema.optional()
}).passthrough()

export const CheckoutForwardRequestSchema = z.object({
  amount: AmountSchema.optional(),
  baseUrl: z.string(),
  merchantAccount: z.string(),
  merchantReference: z.string().optional(),
  options: CheckoutForwardRequestOptionsSchema.optional(),
  paymentMethod: CheckoutForwardRequestCardSchema.optional(),
  request: CheckoutOutgoingForwardRequestSchema,
  shopperReference: z.string(),
  storedPaymentMethodId: z.string().optional()
}).passthrough()

export const DonationCampaignsResponseSchema = z.object({
  donationCampaigns: z.array(DonationCampaignSchema).optional()
}).passthrough()

export const BalanceCheckResponseSchema = z.object({
  additionalData: z.record(z.string(), z.string()).optional(),
  balance: AmountSchema,
  fraudResult: FraudResultSchema.optional(),
  pspReference: z.string().optional(),
  refusalReason: z.string().optional(),
  resultCode: z.enum(["Success", "NotEnoughBalance", "Failed"]),
  transactionLimit: AmountSchema.optional()
}).passthrough()

export const CreateOrderResponseSchema = z.object({
  additionalData: z.record(z.string(), z.string()).optional(),
  amount: AmountSchema,
  expiresAt: z.string(),
  fraudResult: FraudResultSchema.optional(),
  orderData: z.string(),
  pspReference: z.string().optional(),
  reference: z.string().optional(),
  refusalReason: z.string().optional(),
  remainingAmount: AmountSchema,
  resultCode: z.enum(["Success"])
}).passthrough()

export const InputDetailSchema = z.object({
  configuration: z.record(z.string(), z.string()).optional(),
  details: z.array(SubInputDetailSchema).optional(),
  inputDetails: z.array(SubInputDetailSchema).optional(),
  itemSearchUrl: z.string().optional(),
  items: z.array(ItemSchema).optional(),
  key: z.string().optional(),
  optional: z.boolean().optional(),
  type: z.string().optional(),
  value: z.string().optional()
}).passthrough()

export const PaymentValidationsResponseSchema = z.object({
  name: PaymentValidationsNameResponseSchema.optional()
}).passthrough()

export const SessionResultResponseSchema = z.object({
  additionalData: z.record(z.string(), z.string()).optional(),
  id: z.string().optional(),
  payments: z.array(PaymentSchema).optional(),
  reference: z.string().optional(),
  status: z.enum(["active", "canceled", "completed", "expired", "paymentPending", "refused"]).optional()
}).passthrough()

export const PixPayByBankDetailsSchema = z.object({
  checkoutAttemptId: z.string().optional(),
  deviceId: z.string().max(36).optional(),
  issuer: z.string().optional(),
  recurringDetailReference: z.string().optional(),
  riskSignals: PixPayByBankRiskSignalsSchema.optional(),
  sdkData: z.string().max(50000).optional(),
  storedPaymentMethodId: z.string().max(64).optional(),
  type: z.enum(["paybybank_pix"]).optional()
}).passthrough()

export const PaymentAmountUpdateResponseSchema = z.object({
  amount: AmountSchema,
  industryUsage: z.enum(["delayedCharge", "installment", "noShow"]).optional(),
  lineItems: z.array(LineItemSchema).optional(),
  merchantAccount: z.string(),
  paymentPspReference: z.string(),
  pspReference: z.string(),
  reference: z.string(),
  splits: z.array(SplitSchema).optional(),
  status: z.enum(["received"])
}).passthrough()

export const PaymentCaptureResponseSchema = z.object({
  amount: AmountSchema,
  lineItems: z.array(LineItemSchema).optional(),
  merchantAccount: z.string(),
  paymentPspReference: z.string(),
  platformChargebackLogic: PlatformChargebackLogicSchema.optional(),
  pspReference: z.string(),
  reference: z.string().optional(),
  splits: z.array(SplitSchema).optional(),
  status: z.enum(["received"]),
  subMerchants: z.array(SubMerchantInfoSchema).optional()
}).passthrough()

export const PaymentRefundResponseSchema = z.object({
  amount: AmountSchema,
  capturePspReference: z.string().optional(),
  lineItems: z.array(LineItemSchema).optional(),
  merchantAccount: z.string(),
  merchantRefundReason: z.enum(["FRAUD", "CUSTOMER REQUEST", "RETURN", "DUPLICATE", "OTHER"]).optional(),
  paymentPspReference: z.string(),
  pspReference: z.string(),
  reference: z.string().optional(),
  splits: z.array(SplitSchema).optional(),
  status: z.enum(["received"]),
  store: z.string().optional()
}).passthrough()

export const PaymentLinkRequestSchema = z.object({
  allowedPaymentMethods: z.array(z.string()).optional(),
  amount: AmountSchema,
  applicationInfo: ApplicationInfoSchema.optional(),
  billingAddress: AddressSchema.optional(),
  blockedPaymentMethods: z.array(z.string()).optional(),
  captureDelayHours: z.number().optional(),
  countryCode: z.string().max(100).optional(),
  dateOfBirth: z.string().optional(),
  deliverAt: z.string().optional(),
  deliveryAddress: AddressSchema.optional(),
  description: z.string().optional(),
  expiresAt: z.string().optional(),
  fundOrigin: FundOriginSchema.optional(),
  fundRecipient: FundRecipientSchema.optional(),
  installmentOptions: z.record(z.string(), InstallmentOptionSchema).optional(),
  lineItems: z.array(LineItemSchema).optional(),
  manualCapture: z.boolean().optional(),
  mcc: z.string().max(16).optional(),
  merchantAccount: z.string(),
  merchantOrderReference: z.string().max(1000).optional(),
  metadata: z.record(z.string(), z.string()).optional(),
  platformChargebackLogic: PlatformChargebackLogicSchema.optional(),
  recurringProcessingModel: z.enum(["CardOnFile", "Subscription", "UnscheduledCardOnFile"]).optional(),
  reference: z.string(),
  requiredShopperFields: z.array(z.enum(["billingAddress", "deliveryAddress", "shopperEmail", "shopperName", "telephoneNumber"])).optional(),
  returnUrl: z.string().max(8000).optional(),
  reusable: z.boolean().optional(),
  riskData: RiskDataSchema.optional(),
  shopperEmail: z.string().max(500).optional(),
  shopperLocale: z.string().max(32).optional(),
  shopperName: NameSchema.optional(),
  shopperReference: z.string().min(3).max(256).optional(),
  shopperStatement: z.string().max(10000).optional(),
  showRemovePaymentMethodButton: z.boolean().optional(),
  socialSecurityNumber: z.string().max(32).optional(),
  splitCardFundingSources: z.boolean().optional(),
  splits: z.array(SplitSchema).optional(),
  store: z.string().optional(),
  storePaymentMethodMode: z.enum(["askForConsent", "disabled", "enabled"]).optional(),
  telephoneNumber: z.string().max(32).optional(),
  themeId: z.string().optional(),
  threeDS2RequestData: CheckoutSessionThreeDS2RequestDataSchema.optional()
}).passthrough()

export const PaymentLinkResponseSchema = z.object({
  allowedPaymentMethods: z.array(z.string()).optional(),
  amount: AmountSchema,
  applicationInfo: ApplicationInfoSchema.optional(),
  billingAddress: AddressSchema.optional(),
  blockedPaymentMethods: z.array(z.string()).optional(),
  captureDelayHours: z.number().optional(),
  countryCode: z.string().max(100).optional(),
  dateOfBirth: z.string().optional(),
  deliverAt: z.string().optional(),
  deliveryAddress: AddressSchema.optional(),
  description: z.string().optional(),
  expiresAt: z.string().optional(),
  fundOrigin: FundOriginSchema.optional(),
  fundRecipient: FundRecipientSchema.optional(),
  id: z.string(),
  installmentOptions: z.record(z.string(), InstallmentOptionSchema).optional(),
  lineItems: z.array(LineItemSchema).optional(),
  manualCapture: z.boolean().optional(),
  mcc: z.string().max(16).optional(),
  merchantAccount: z.string(),
  merchantOrderReference: z.string().max(1000).optional(),
  metadata: z.record(z.string(), z.string()).optional(),
  platformChargebackLogic: PlatformChargebackLogicSchema.optional(),
  recurringProcessingModel: z.enum(["CardOnFile", "Subscription", "UnscheduledCardOnFile"]).optional(),
  reference: z.string(),
  requiredShopperFields: z.array(z.enum(["billingAddress", "deliveryAddress", "shopperEmail", "shopperName", "telephoneNumber"])).optional(),
  returnUrl: z.string().max(8000).optional(),
  reusable: z.boolean().optional(),
  riskData: RiskDataSchema.optional(),
  shopperEmail: z.string().max(500).optional(),
  shopperLocale: z.string().max(32).optional(),
  shopperName: NameSchema.optional(),
  shopperReference: z.string().min(3).max(256).optional(),
  shopperStatement: z.string().max(10000).optional(),
  showRemovePaymentMethodButton: z.boolean().optional(),
  socialSecurityNumber: z.string().max(32).optional(),
  splitCardFundingSources: z.boolean().optional(),
  splits: z.array(SplitSchema).optional(),
  status: z.enum(["active", "completed", "expired", "paid", "paymentPending"]),
  store: z.string().optional(),
  storePaymentMethodMode: z.enum(["askForConsent", "disabled", "enabled"]).optional(),
  telephoneNumber: z.string().max(32).optional(),
  themeId: z.string().optional(),
  threeDS2RequestData: CheckoutSessionThreeDS2RequestDataSchema.optional(),
  updatedAt: z.string().optional(),
  url: z.string()
}).passthrough()

export const CreateCheckoutSessionRequestSchema = z.object({
  accountInfo: AccountInfoSchema.optional(),
  additionalAmount: AmountSchema.optional(),
  additionalData: z.record(z.string(), z.string()).optional(),
  allowedPaymentMethods: z.array(z.string()).optional(),
  amount: AmountSchema,
  applicationInfo: ApplicationInfoSchema.optional(),
  authenticationData: AuthenticationDataSchema.optional(),
  billingAddress: BillingAddressSchema.optional(),
  blockedPaymentMethods: z.array(z.string()).optional(),
  captureDelayHours: z.number().optional(),
  channel: z.enum(["iOS", "Android", "Web"]).optional(),
  company: CompanySchema.optional(),
  countryCode: z.string().optional(),
  dateOfBirth: z.string().optional(),
  deliverAt: z.string().optional(),
  deliveryAddress: DeliveryAddressSchema.optional(),
  enableOneClick: z.boolean().optional(),
  enablePayOut: z.boolean().optional(),
  enableRecurring: z.boolean().optional(),
  expiresAt: z.string().optional(),
  fundOrigin: FundOriginSchema.optional(),
  fundRecipient: FundRecipientSchema.optional(),
  installmentOptions: z.record(z.string(), CheckoutSessionInstallmentOptionSchema).optional(),
  lineItems: z.array(LineItemSchema).optional(),
  mandate: MandateSchema.optional(),
  mcc: z.string().optional(),
  merchantAccount: z.string(),
  merchantOrderReference: z.string().optional(),
  metadata: z.record(z.string(), z.string()).optional(),
  mode: z.enum(["embedded", "hosted"]).optional(),
  mpiData: ThreeDSecureDataSchema.optional(),
  platformChargebackLogic: PlatformChargebackLogicSchema.optional(),
  recurringExpiry: z.string().optional(),
  recurringFrequency: z.string().optional(),
  recurringProcessingModel: z.enum(["CardOnFile", "Subscription", "UnscheduledCardOnFile"]).optional(),
  redirectFromIssuerMethod: z.string().optional(),
  redirectToIssuerMethod: z.string().optional(),
  reference: z.string(),
  returnUrl: z.string().max(8000),
  riskData: RiskDataSchema.optional(),
  shopperEmail: z.string().optional(),
  shopperIP: z.string().optional(),
  shopperInteraction: z.enum(["Ecommerce", "ContAuth", "Moto", "POS"]).optional(),
  shopperLocale: z.string().optional(),
  shopperName: ShopperNameSchema.optional(),
  shopperReference: z.string().min(3).max(256).optional(),
  shopperStatement: z.string().optional(),
  showInstallmentAmount: z.boolean().optional(),
  showRemovePaymentMethodButton: z.boolean().optional(),
  socialSecurityNumber: z.string().optional(),
  splitCardFundingSources: z.boolean().optional(),
  splits: z.array(SplitSchema).optional(),
  store: z.string().optional(),
  storeFiltrationMode: z.enum(["exclusive", "inclusive", "skipFilter"]).optional(),
  storePaymentMethod: z.boolean().optional(),
  storePaymentMethodMode: z.enum(["askForConsent", "disabled", "enabled"]).optional(),
  telephoneNumber: z.string().optional(),
  themeId: z.string().optional(),
  threeDS2RequestData: CheckoutSessionThreeDS2RequestDataSchema.optional(),
  threeDSAuthenticationOnly: z.boolean().optional(),
  trustedShopper: z.boolean().optional()
}).passthrough()

export const CreateCheckoutSessionResponseSchema = z.object({
  accountInfo: AccountInfoSchema.optional(),
  additionalAmount: AmountSchema.optional(),
  additionalData: z.record(z.string(), z.string()).optional(),
  allowedPaymentMethods: z.array(z.string()).optional(),
  amount: AmountSchema,
  applicationInfo: ApplicationInfoSchema.optional(),
  authenticationData: AuthenticationDataSchema.optional(),
  billingAddress: BillingAddressSchema.optional(),
  blockedPaymentMethods: z.array(z.string()).optional(),
  captureDelayHours: z.number().optional(),
  channel: z.enum(["iOS", "Android", "Web"]).optional(),
  company: CompanySchema.optional(),
  countryCode: z.string().optional(),
  dateOfBirth: z.string().optional(),
  deliverAt: z.string().optional(),
  deliveryAddress: DeliveryAddressSchema.optional(),
  enableOneClick: z.boolean().optional(),
  enablePayOut: z.boolean().optional(),
  enableRecurring: z.boolean().optional(),
  expiresAt: z.string(),
  fundOrigin: FundOriginSchema.optional(),
  fundRecipient: FundRecipientSchema.optional(),
  id: z.string(),
  installmentOptions: z.record(z.string(), CheckoutSessionInstallmentOptionSchema).optional(),
  lineItems: z.array(LineItemSchema).optional(),
  mandate: MandateSchema.optional(),
  mcc: z.string().optional(),
  merchantAccount: z.string(),
  merchantOrderReference: z.string().optional(),
  metadata: z.record(z.string(), z.string()).optional(),
  mode: z.enum(["embedded", "hosted"]).optional(),
  mpiData: ThreeDSecureDataSchema.optional(),
  platformChargebackLogic: PlatformChargebackLogicSchema.optional(),
  recurringExpiry: z.string().optional(),
  recurringFrequency: z.string().optional(),
  recurringProcessingModel: z.enum(["CardOnFile", "Subscription", "UnscheduledCardOnFile"]).optional(),
  redirectFromIssuerMethod: z.string().optional(),
  redirectToIssuerMethod: z.string().optional(),
  reference: z.string(),
  returnUrl: z.string().max(8000),
  riskData: RiskDataSchema.optional(),
  sessionData: z.string().optional(),
  shopperEmail: z.string().optional(),
  shopperIP: z.string().optional(),
  shopperInteraction: z.enum(["Ecommerce", "ContAuth", "Moto", "POS"]).optional(),
  shopperLocale: z.string().optional(),
  shopperName: ShopperNameSchema.optional(),
  shopperReference: z.string().min(3).max(256).optional(),
  shopperStatement: z.string().optional(),
  showInstallmentAmount: z.boolean().optional(),
  showRemovePaymentMethodButton: z.boolean().optional(),
  socialSecurityNumber: z.string().optional(),
  splitCardFundingSources: z.boolean().optional(),
  splits: z.array(SplitSchema).optional(),
  store: z.string().optional(),
  storeFiltrationMode: z.enum(["exclusive", "inclusive", "skipFilter"]).optional(),
  storePaymentMethod: z.boolean().optional(),
  storePaymentMethodMode: z.enum(["askForConsent", "disabled", "enabled"]).optional(),
  telephoneNumber: z.string().optional(),
  themeId: z.string().optional(),
  threeDS2RequestData: CheckoutSessionThreeDS2RequestDataSchema.optional(),
  threeDSAuthenticationOnly: z.boolean().optional(),
  trustedShopper: z.boolean().optional(),
  url: z.string().optional()
}).passthrough()

export const BalanceCheckRequestSchema = z.object({
  accountInfo: AccountInfoSchema.optional(),
  additionalAmount: AmountSchema.optional(),
  additionalData: z.record(z.string(), z.string()).optional(),
  amount: AmountSchema,
  applicationInfo: ApplicationInfoSchema.optional(),
  billingAddress: AddressSchema.optional(),
  browserInfo: BrowserInfoSchema.optional(),
  captureDelayHours: z.number().optional(),
  dateOfBirth: z.string().optional(),
  dccQuote: ForexQuoteSchema.optional(),
  deliveryAddress: AddressSchema.optional(),
  deliveryDate: z.string().optional(),
  deviceFingerprint: z.string().max(5000).optional(),
  fraudOffset: z.number().optional(),
  installments: InstallmentsSchema.optional(),
  localizedShopperStatement: z.record(z.string(), z.string()).optional(),
  mcc: z.string().optional(),
  merchantAccount: z.string(),
  merchantOrderReference: z.string().optional(),
  merchantRiskIndicator: MerchantRiskIndicatorSchema.optional(),
  metadata: z.record(z.string(), z.string()).optional(),
  orderReference: z.string().optional(),
  paymentMethod: z.record(z.string(), z.string()),
  recurring: RecurringSchema.optional(),
  recurringProcessingModel: z.enum(["CardOnFile", "Subscription", "UnscheduledCardOnFile"]).optional(),
  reference: z.string().optional(),
  selectedBrand: z.string().optional(),
  selectedRecurringDetailReference: z.string().optional(),
  sessionId: z.string().optional(),
  shopperEmail: z.string().optional(),
  shopperIP: z.string().optional(),
  shopperInteraction: z.enum(["Ecommerce", "ContAuth", "Moto", "POS"]).optional(),
  shopperLocale: z.string().optional(),
  shopperName: NameSchema.optional(),
  shopperReference: z.string().optional(),
  shopperStatement: z.string().optional(),
  socialSecurityNumber: z.string().optional(),
  splits: z.array(SplitSchema).optional(),
  store: z.string().min(1).max(16).optional(),
  telephoneNumber: z.string().optional(),
  threeDS2RequestData: ThreeDS2RequestDataSchema.optional(),
  threeDSAuthenticationOnly: z.boolean().optional(),
  totalsGroup: z.string().min(1).max(16).optional(),
  trustedShopper: z.boolean().optional()
}).passthrough()

export const DonationPaymentRequestSchema = z.object({
  accountInfo: AccountInfoSchema.optional(),
  additionalData: z.record(z.string(), z.string()).optional(),
  amount: AmountSchema,
  applicationInfo: ApplicationInfoSchema.optional(),
  authenticationData: AuthenticationDataSchema.optional(),
  billingAddress: BillingAddressSchema.optional(),
  browserInfo: BrowserInfoSchema.optional(),
  channel: z.enum(["iOS", "Android", "Web"]).optional(),
  checkoutAttemptId: z.string().optional(),
  conversionId: z.string().optional(),
  countryCode: z.string().max(100).optional(),
  dateOfBirth: z.string().optional(),
  deliverAt: z.string().optional(),
  deliveryAddress: DeliveryAddressSchema.optional(),
  deviceFingerprint: z.string().max(5000).optional(),
  donationAccount: z.string().optional(),
  donationCampaignId: z.string().optional(),
  donationOriginalPspReference: z.string().optional(),
  donationToken: z.string().optional(),
  lineItems: z.array(LineItemSchema).optional(),
  merchantAccount: z.string(),
  merchantRiskIndicator: MerchantRiskIndicatorSchema.optional(),
  metadata: z.record(z.string(), z.string()).optional(),
  mpiData: ThreeDSecureDataSchema.optional(),
  origin: z.string().max(80).optional(),
  paymentMethod: z.union([ApplePayDonationsSchema, CardDonationsSchema, GooglePayDonationsSchema, IdealDonationsSchema, PayWithGoogleDonationsSchema]).optional(),
  recurringProcessingModel: z.enum(["CardOnFile", "Subscription", "UnscheduledCardOnFile"]).optional(),
  redirectFromIssuerMethod: z.string().optional(),
  redirectToIssuerMethod: z.string().optional(),
  reference: z.string(),
  returnUrl: z.string().max(8000),
  sessionValidity: z.string().optional(),
  shopperEmail: z.string().optional(),
  shopperIP: z.string().max(1000).optional(),
  shopperInteraction: z.enum(["Ecommerce", "ContAuth", "Moto", "POS"]).optional(),
  shopperLocale: z.string().optional(),
  shopperName: ShopperNameSchema.optional(),
  shopperReference: z.string().min(3).max(256).optional(),
  socialSecurityNumber: z.string().optional(),
  store: z.string().min(1).max(16).optional(),
  telephoneNumber: z.string().optional(),
  threeDS2RequestData: ThreeDS2RequestFieldsSchema.optional(),
  threeDSAuthenticationOnly: z.boolean().optional()
}).passthrough()

export const ListStoredPaymentMethodsResponseSchema = z.object({
  merchantAccount: z.string().optional(),
  shopperReference: z.string().optional(),
  storedPaymentMethods: z.array(StoredPaymentMethodResourceSchema).optional()
}).passthrough()

export const EnhancedSchemeDataSchema = z.object({
  airline: AirlineSchema.optional(),
  levelTwoThree: LevelTwoThreeSchema.optional()
}).passthrough()

export const PaymentMethodSchema = z.object({
  apps: z.array(PaymentMethodUPIAppsSchema).optional(),
  brand: z.string().optional(),
  brands: z.array(z.string()).optional(),
  configuration: z.record(z.string(), z.string()).optional(),
  fundingSource: z.enum(["credit", "debit", "prepaid"]).optional(),
  group: PaymentMethodGroupSchema.optional(),
  inputDetails: z.array(InputDetailSchema).optional(),
  issuers: z.array(PaymentMethodIssuerSchema).optional(),
  name: z.string().optional(),
  promoted: z.boolean().optional(),
  type: z.string().optional()
}).passthrough()

export const PaymentDetailsResponseSchema = z.object({
  action: z.union([CheckoutThreeDS2ActionSchema]).optional(),
  additionalData: z.record(z.string(), z.string()).optional(),
  amount: AmountSchema.optional(),
  donationToken: z.string().optional(),
  fraudResult: FraudResultSchema.optional(),
  merchantReference: z.string().optional(),
  order: CheckoutOrderResponseSchema.optional(),
  paymentMethod: ResponsePaymentMethodSchema.optional(),
  paymentValidations: PaymentValidationsResponseSchema.optional(),
  pspReference: z.string().optional(),
  refusalReason: z.string().optional(),
  refusalReasonCode: z.string().optional(),
  resultCode: z.enum(["AuthenticationFinished", "AuthenticationNotRequired", "Authorised", "Cancelled", "ChallengeShopper", "Error", "IdentifyShopper", "PartiallyAuthorised", "Pending", "PresentToShopper", "Received", "RedirectShopper", "Refused", "Success"]).optional(),
  shopperLocale: z.string().optional(),
  threeDS2ResponseData: ThreeDS2ResponseDataSchema.optional(),
  threeDS2Result: ThreeDS2ResultSchema.optional(),
  threeDSPaymentData: z.string().optional()
}).passthrough()

export const PaymentResponseSchema = z.object({
  action: z.union([CheckoutAwaitActionSchema, CheckoutBankTransferActionSchema, CheckoutDelegatedAuthenticationActionSchema, CheckoutNativeRedirectActionSchema, CheckoutQrCodeActionSchema, CheckoutRedirectActionSchema, CheckoutSDKActionSchema, CheckoutThreeDS2ActionSchema, CheckoutVoucherActionSchema]).optional(),
  additionalData: z.record(z.string(), z.string()).optional(),
  amount: AmountSchema.optional(),
  donationToken: z.string().optional(),
  fraudResult: FraudResultSchema.optional(),
  merchantReference: z.string().optional(),
  order: CheckoutOrderResponseSchema.optional(),
  paymentMethod: ResponsePaymentMethodSchema.optional(),
  paymentValidations: PaymentValidationsResponseSchema.optional(),
  pspReference: z.string().optional(),
  refusalReason: z.string().optional(),
  refusalReasonCode: z.string().optional(),
  resultCode: z.enum(["AuthenticationFinished", "AuthenticationNotRequired", "Authorised", "Cancelled", "ChallengeShopper", "Error", "IdentifyShopper", "PartiallyAuthorised", "Pending", "PresentToShopper", "Received", "RedirectShopper", "Refused", "Success"]).optional(),
  threeDS2ResponseData: ThreeDS2ResponseDataSchema.optional(),
  threeDS2Result: ThreeDS2ResultSchema.optional(),
  threeDSPaymentData: z.string().optional()
}).passthrough()

export const PaymentAmountUpdateRequestSchema = z.object({
  amount: AmountSchema,
  applicationInfo: ApplicationInfoSchema.optional(),
  enhancedSchemeData: EnhancedSchemeDataSchema.optional(),
  industryUsage: z.enum(["delayedCharge", "installment", "noShow"]).optional(),
  lineItems: z.array(LineItemSchema).optional(),
  merchantAccount: z.string(),
  reference: z.string().optional(),
  splits: z.array(SplitSchema).optional()
}).passthrough()

export const PaymentCancelRequestSchema = z.object({
  applicationInfo: ApplicationInfoSchema.optional(),
  enhancedSchemeData: EnhancedSchemeDataSchema.optional(),
  merchantAccount: z.string(),
  reference: z.string().optional()
}).passthrough()

export const PaymentCaptureRequestSchema = z.object({
  amount: AmountSchema,
  applicationInfo: ApplicationInfoSchema.optional(),
  enhancedSchemeData: EnhancedSchemeDataSchema.optional(),
  lineItems: z.array(LineItemSchema).optional(),
  merchantAccount: z.string(),
  platformChargebackLogic: PlatformChargebackLogicSchema.optional(),
  reference: z.string().optional(),
  splits: z.array(SplitSchema).optional(),
  subMerchants: z.array(SubMerchantInfoSchema).optional()
}).passthrough()

export const PaymentRefundRequestSchema = z.object({
  amount: AmountSchema,
  applicationInfo: ApplicationInfoSchema.optional(),
  capturePspReference: z.string().optional(),
  enhancedSchemeData: EnhancedSchemeDataSchema.optional(),
  lineItems: z.array(LineItemSchema).optional(),
  merchantAccount: z.string(),
  merchantRefundReason: z.enum(["FRAUD", "CUSTOMER REQUEST", "RETURN", "DUPLICATE", "OTHER"]).optional(),
  reference: z.string().optional(),
  splits: z.array(SplitSchema).optional(),
  store: z.string().optional()
}).passthrough()

export const PaymentRequestSchema = z.object({
  accountInfo: AccountInfoSchema.optional(),
  additionalAmount: AmountSchema.optional(),
  additionalData: z.record(z.string(), z.string()).optional(),
  amount: AmountSchema,
  applicationInfo: ApplicationInfoSchema.optional(),
  authenticationData: AuthenticationDataSchema.optional(),
  bankAccount: CheckoutBankAccountSchema.optional(),
  billingAddress: BillingAddressSchema.optional(),
  browserInfo: BrowserInfoSchema.optional(),
  captureDelayHours: z.number().optional(),
  channel: z.enum(["iOS", "Android", "Web"]).optional(),
  checkoutAttemptId: z.string().max(256).optional(),
  company: CompanySchema.optional(),
  conversionId: z.string().optional(),
  countryCode: z.string().max(100).optional(),
  dateOfBirth: z.string().optional(),
  dccQuote: ForexQuoteSchema.optional(),
  deliverAt: z.string().optional(),
  deliveryAddress: DeliveryAddressSchema.optional(),
  deliveryDate: z.string().optional(),
  deviceFingerprint: z.string().max(5000).optional(),
  enableOneClick: z.boolean().optional(),
  enablePayOut: z.boolean().optional(),
  enableRecurring: z.boolean().optional(),
  enhancedSchemeData: EnhancedSchemeDataSchema.optional(),
  entityType: z.enum(["NaturalPerson", "CompanyName"]).optional(),
  fraudOffset: z.number().optional(),
  fundOrigin: FundOriginSchema.optional(),
  fundRecipient: FundRecipientSchema.optional(),
  industryUsage: z.enum(["delayedCharge", "installment", "noShow"]).optional(),
  installments: InstallmentsSchema.optional(),
  lineItems: z.array(LineItemSchema).optional(),
  localizedShopperStatement: z.record(z.string(), z.string()).optional(),
  mandate: MandateSchema.optional(),
  mcc: z.string().optional(),
  merchantAccount: z.string(),
  merchantOrderReference: z.string().max(1000).optional(),
  merchantRiskIndicator: MerchantRiskIndicatorSchema.optional(),
  metadata: z.record(z.string(), z.string()).optional(),
  mpiData: ThreeDSecureDataSchema.optional(),
  order: EncryptedOrderDataSchema.optional(),
  orderReference: z.string().optional(),
  origin: z.string().max(80).optional(),
  paymentMethod: z.union([AchDetailsSchema, AffirmDetailsSchema, AfterpayDetailsSchema, AlmaDetailsSchema, AmazonPayDetailsSchema, AncvDetailsSchema, AndroidPayDetailsSchema, ApplePayDetailsSchema, BacsDirectDebitDetailsSchema, BillDeskDetailsSchema, BlikDetailsSchema, CardDetailsSchema, CashAppDetailsSchema, CellulantDetailsSchema, DirectDebitAuDetailsSchema, DokuDetailsSchema, DragonpayDetailsSchema, EBankingFinlandDetailsSchema, EcontextVoucherDetailsSchema, EftDetailsSchema, ExternalTokenDetailsSchema, FastlaneDetailsSchema, GenericIssuerPaymentMethodDetailsSchema, GooglePayDetailsSchema, IdealDetailsSchema, KlarnaDetailsSchema, KlarnaNetworkDetailsSchema, MasterpassDetailsSchema, MbwayDetailsSchema, MobilePayDetailsSchema, MolPayDetailsSchema, OpenInvoiceDetailsSchema, PayByBankAISDirectDebitDetailsSchema, PayByBankDetailsSchema, PayPalDetailsSchema, PayPayDetailsSchema, PayToDetailsSchema, PayUUpiDetailsSchema, PayWithGoogleDetailsSchema, PaymentDetailsSchema, PixDetailsSchema, PixPayByBankDetailsSchema, PseDetailsSchema, RakutenPayDetailsSchema, RatepayDetailsSchema, RivertyDetailsSchema, SamsungPayDetailsSchema, SepaDirectDebitDetailsSchema, StoredPaymentMethodDetailsSchema, TwintDetailsSchema, UpiCollectDetailsSchema, UpiIntentDetailsSchema, UpiQrDetailsSchema, VippsDetailsSchema, VisaCheckoutDetailsSchema, WeChatPayDetailsSchema, WeChatPayMiniProgramDetailsSchema, ZipDetailsSchema]),
  paymentValidations: PaymentValidationsSchema.optional(),
  platformChargebackLogic: PlatformChargebackLogicSchema.optional(),
  recurringExpiry: z.string().optional(),
  recurringFrequency: z.string().optional(),
  recurringProcessingModel: z.enum(["CardOnFile", "Subscription", "UnscheduledCardOnFile"]).optional(),
  redirectFromIssuerMethod: z.string().optional(),
  redirectToIssuerMethod: z.string().optional(),
  reference: z.string(),
  returnUrl: z.string().max(8000),
  riskData: RiskDataSchema.optional(),
  sessionValidity: z.string().optional(),
  shopperConversionId: z.string().max(256).optional(),
  shopperEmail: z.string().optional(),
  shopperIP: z.string().max(1000).optional(),
  shopperInteraction: z.enum(["Ecommerce", "ContAuth", "Moto", "POS"]).optional(),
  shopperLocale: z.string().optional(),
  shopperName: ShopperNameSchema.optional(),
  shopperReference: z.string().min(3).max(256).optional(),
  shopperStatement: z.string().max(10000).optional(),
  shopperTaxInfo: ShopperTaxInfoSchema.optional(),
  socialSecurityNumber: z.string().optional(),
  splits: z.array(SplitSchema).optional(),
  store: z.string().min(1).max(64).optional(),
  storePaymentMethod: z.boolean().optional(),
  subMerchants: z.array(SubMerchantInfoSchema).optional(),
  surcharge: SurchargeSchema.optional(),
  telephoneNumber: z.string().optional(),
  threeDS2RequestData: ThreeDS2RequestFieldsSchema.optional(),
  threeDSAuthenticationOnly: z.boolean().optional(),
  trustedShopper: z.boolean().optional()
}).passthrough()

export const PaymentReversalRequestSchema = z.object({
  applicationInfo: ApplicationInfoSchema.optional(),
  enhancedSchemeData: EnhancedSchemeDataSchema.optional(),
  merchantAccount: z.string(),
  reference: z.string().optional()
}).passthrough()

export const StandalonePaymentCancelRequestSchema = z.object({
  applicationInfo: ApplicationInfoSchema.optional(),
  enhancedSchemeData: EnhancedSchemeDataSchema.optional(),
  merchantAccount: z.string(),
  paymentReference: z.string(),
  reference: z.string().optional()
}).passthrough()

export const PaymentMethodsResponseSchema = z.object({
  paymentMethods: z.array(PaymentMethodSchema).optional(),
  storedPaymentMethods: z.array(StoredPaymentMethodSchema).optional()
}).passthrough()

export const DonationPaymentResponseSchema = z.object({
  amount: AmountSchema.optional(),
  donationAccount: z.string().optional(),
  id: z.string().optional(),
  merchantAccount: z.string().optional(),
  payment: PaymentResponseSchema.optional(),
  reference: z.string().optional(),
  status: z.enum(["completed", "pending", "refused"]).optional()
}).passthrough()
