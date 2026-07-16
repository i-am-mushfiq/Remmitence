export interface RegisterFormData {
  mobileNumber: string;
  otpVerified: boolean;
  pin: string;
  biometricEnabled: boolean;
  nidNumber: string;
  nidName: string;
  nidDob: string;
  workPermitNumber: string;
  workPermitExpiry: string;
  selfieVerified: boolean;
  malaysiaAddressLine: string;
  malaysiaPostcode: string;
  bangladeshAddressLine: string;
  bangladeshDivision: string;
  bangladeshDistrict: string;
  bangladeshUpazila: string;
  occupation: string;
  employer: string;
  incomeBand: string;
  referralCode: string;
  consentGiven: boolean;
}

export const initialRegisterData: RegisterFormData = {
  mobileNumber: "",
  otpVerified: false,
  pin: "",
  biometricEnabled: true,
  nidNumber: "",
  nidName: "",
  nidDob: "",
  workPermitNumber: "",
  workPermitExpiry: "",
  selfieVerified: false,
  malaysiaAddressLine: "",
  malaysiaPostcode: "",
  bangladeshAddressLine: "",
  bangladeshDivision: "",
  bangladeshDistrict: "",
  bangladeshUpazila: "",
  occupation: "",
  employer: "",
  incomeBand: "",
  referralCode: "",
  consentGiven: false,
};

export interface StepProps {
  data: RegisterFormData;
  update: (partial: Partial<RegisterFormData>) => void;
  onNext: () => void;
  onBack: () => void;
}
