import DocumentUploadField from '@/components/DocumentUploadField';
import LoanCard from '@/components/LoanCard';
import LoanInputField from '@/components/LoanInputField';
import LoanNavigationButtons from '@/components/LoanNavigationButtons';
import LoanStepHeader from '@/components/LoanStepHeader';
import { useLoanAction } from '@/hooks/useLoanAction';
import { DocumentUpload, FinancialInfo, LoanProduct, LoanRequest, PersonalInfo } from '@/types';
import { calculateMonthlyPayment } from '@/utils/loan';
import { MaterialIcons } from '@expo/vector-icons';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import Toast from 'react-native-toast-message';


export default function LoanApplication() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const { applyLoan } = useLoanAction();
  const [step, setStep] = useState(1);
  const [loanProducts, setLoanProducts] = useState<LoanProduct[]>([]);
  const product: LoanProduct = params.product ? JSON.parse(params.product as string) : null;
  console.log(params)
  const [purpose, setPurpose] = useState('');
  const [showDobPicker, setShowDobPicker] = useState(false);
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    firstName: '',
    lastName: '',
    idNumber: '',
    dateOfBirth: '',
    streetAddress: '',
    city: '',
    state: '',
    postalCode: '',
    country: ''
  });

  // ===== STEP 3: FINANCIAL INFORMATION =====
  const [financialInfo, setFinancialInfo] = useState<FinancialInfo>({
    monthlyIncome: 0,
    incomeSource: 'FARMING',
    employmentStatus: 'SELF_EMPLOYED',
    farmingExperience: 0,
    farmType: 'COOPERATIVE',
    bankName: '',
    bankBranch: '',
    accountNumber: '',
    accountHolderName: ''
  });

  // ===== STEP 4: DOCUMENT UPLOAD =====
  const [documents, setDocuments] = useState<DocumentUpload>({
    idPhoto: null,
    proofOfIncome: null,
    farmOwnershipDocuments: null,
    cooperativeMembership: null,
    treeImages: []
  });



  const getPurposeOptions = (loanType: string) => {
    switch (loanType.toLowerCase()) {
      case 'agricultural':
        return ['Crop Farming', 'Livestock Farming', 'Equipment Purchase', 'Land Development', 'Seed Purchase'];
      case 'business':
        return ['Business Expansion', 'Equipment Purchase', 'Working Capital', 'Inventory Purchase', 'Marketing'];
      case 'personal':
        return ['Education', 'Medical Expenses', 'Home Improvement', 'Debt Consolidation', 'Emergency'];
      default:
        return ['General Purpose', 'Investment', 'Development'];
    }
  };


  const validateStep2 = () => {
    if (!personalInfo.firstName || !personalInfo.lastName || !personalInfo.idNumber || !personalInfo.dateOfBirth) {
      Alert.alert('Validation Error', 'Please fill in all required personal information fields.');
      return false;
    }
    return true;
  };

  const validateStep3 = () => {
    if (!financialInfo.monthlyIncome || !financialInfo.bankName || !financialInfo.accountNumber) {
      Alert.alert('Validation Error', 'Please fill in all required financial information fields.');
      return false;
    }
    return true;
  };

  const validateStep4 = () => {
    if (!documents.idPhoto || !documents.proofOfIncome || !documents.farmOwnershipDocuments) {
      Alert.alert(
        'Document Required',
        'Please upload all required documents (ID Photo, Proof of Income, and Farm Ownership Documents).'
      );
      return false;
    }
    return true;
  };

  const pickImage = async (type: keyof DocumentUpload) => {
    console.log(type)
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      if (type === 'treeImages') {
        if (documents.treeImages.length >= 15) {
          Alert.alert('Limit Reached', 'Maximum 15 tree images allowed.');
          return;
        }
        setDocuments(prev => ({
          ...prev,
          treeImages: [...prev.treeImages, result.assets[0].uri]
        }));
      } else {
        setDocuments(prev => ({
          ...prev,
          [type]: result.assets[0].uri
        }));
      }
    }
  };

  const removeTreeImage = (index: number) => {
    setDocuments(prev => ({
      ...prev,
      treeImages: prev.treeImages.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async () => {
    if (!purpose || !product || !personalInfo || !financialInfo || !documents) return;

    const loanRequest: LoanRequest = {
      purpose,
      details: product,
      personalInfo,
      financialInfo,
      documents
    };

    await applyLoan(loanRequest);
  };

  // ===== RENDER FUNCTIONS =====

  // Step 1: Basic Loan Information
  const renderStep1 = () => (
    <ScrollView className="flex-1 bg-gray-50 px-8" showsVerticalScrollIndicator={false}>
      <LoanStepHeader
        step={1}
        totalSteps={6}
        title="Basic Information"
        subtitle="Review loan details and provide purpose"
        onBack={() => router.back()}
      />

      {/* Loan Details Card */}
      <LoanCard title="Loan Product Details">
        <LoanInputField
          label="Loan Type"
          placeholder=""
          value={product.name}
          onChangeText={() => { }}
          icon="account-balance-wallet"
          readOnly={true}
        />
        <LoanInputField
          label="Loan Amount"
          placeholder=""
          value={`$${Number(product.amount).toLocaleString()}`}
          onChangeText={() => { }}
          icon="attach-money"
          readOnly={true}
        />
        <LoanInputField
          label="Interest Rate"
          placeholder=""
          value={`${product.interest}%`}
          onChangeText={() => { }}
          icon="percent"
          readOnly={true}
        />
        <LoanInputField
          label="Loan Term"
          placeholder=""
          value={`${product.termType==='YEARS'?Number(product.term/12):product.term} ${product.termType}`}
          onChangeText={() => { }}
          icon="schedule"
          readOnly={true}
        />
        <LoanInputField
          label="Monthly Payment"
          placeholder=""
          value={`$${Number(calculateMonthlyPayment(product.amount, product.interest, product.term)).toLocaleString()}`}
          onChangeText={() => { }}
          icon="payment"
          readOnly={true}
        />
      </LoanCard>

      {/* Purpose Section */}
      <LoanCard title="Loan Purpose">
        <LoanInputField
          label="Purpose of Loan"
          placeholder="Describe the purpose of your loan..."
          value={purpose}
          onChangeText={setPurpose}
          icon="description"
          multiline={true}
          numberOfLines={4}
        />

      </LoanCard>

      <LoanNavigationButtons
        onBack={() => router.back()}
        onNext={() => {
           setStep(2);
        }}
        nextText="Continue to Personal Information"
        showBack={false}
      />
    </ScrollView>
  );

  // Step 2: Personal Information
  const renderStep2 = () => (
    <ScrollView className="flex-1 bg-gray-50 px-8" showsVerticalScrollIndicator={false}>
      <LoanStepHeader
        step={2}
        totalSteps={6}
        title="Personal Information"
        subtitle="Provide your personal details"
        onBack={() => setStep(1)}
      />

      <LoanCard title="Personal Details">
        {/* All fields in horizontal layout */}
        <LoanInputField
          label="First Name"
          placeholder="Enter first name"
          value={personalInfo.firstName}
          onChangeText={(text) => setPersonalInfo(prev => ({ ...prev, firstName: text }))}
          icon="person"
        />

        <LoanInputField
          label="Last Name"
          placeholder="Enter last name"
          value={personalInfo.lastName}
          onChangeText={(text) => setPersonalInfo(prev => ({ ...prev, lastName: text }))}
          icon="person"
        />

        <LoanInputField
          label="ID Number"
          placeholder="Enter ID number"
          value={personalInfo.idNumber}
          onChangeText={(text) => setPersonalInfo(prev => ({ ...prev, idNumber: text }))}
          icon="badge"
        />

        {/* Date of Birth */}
        <View className="mb-4">
          <Text className="text-gray-700 mb-2 font-medium">Date of Birth</Text>
          <TouchableOpacity
            className="border border-gray-300 rounded-md p-4"
            onPress={() => setShowDobPicker(true)}
          >
            <Text className={personalInfo.dateOfBirth ? 'text-black' : 'text-gray-400'}>
              {personalInfo.dateOfBirth || 'Tap to choose'}
            </Text>
          </TouchableOpacity>
        </View>
        {showDobPicker && (
          <DateTimePicker
            value={personalInfo.dateOfBirth ? new Date(personalInfo.dateOfBirth) : new Date()}
            mode="date"
            maximumDate={new Date()}
            onChange={(event: DateTimePickerEvent, selectedDate?: Date) => {
              setShowDobPicker(false);
              if (event.type === 'set' && selectedDate) {
                const iso = selectedDate.toISOString().split('T')[0];
                setPersonalInfo(prev => ({ ...prev, dateOfBirth: iso }));
              }
            }}
          />
        )}

        <LoanInputField
          label="Street Address"
          placeholder="Enter street address"
          value={personalInfo.streetAddress}
          onChangeText={(text) => setPersonalInfo(prev => ({ ...prev, streetAddress: text }))}
          icon="location-on"
        />

        <LoanInputField
          label="City"
          placeholder="Enter city"
          value={personalInfo.city}
          onChangeText={(text) => setPersonalInfo(prev => ({ ...prev, city: text }))}
          icon="location-city"
        />

        <LoanInputField
          label="State/Province"
          placeholder="Enter state/province"
          value={personalInfo.state}
          onChangeText={(text) => setPersonalInfo(prev => ({ ...prev, state: text }))}
          icon="map"
        />

        <LoanInputField
          label="Postal Code"
          placeholder="Enter postal code"
          value={personalInfo.postalCode}
          onChangeText={(text) => setPersonalInfo(prev => ({ ...prev, postalCode: text }))}
          icon="markunread-mailbox"
        />

        <LoanInputField
          label="Country"
          placeholder="Enter country"
          value={personalInfo.country}
          onChangeText={(text) => setPersonalInfo(prev => ({ ...prev, country: text }))}
          icon="public"
        />
      </LoanCard>

      <LoanNavigationButtons
        onBack={() => setStep(1)}
        onNext={() => {
          if (validateStep2()) setStep(3);
        }}
        nextText="Continue to Financial Info"
      />
    </ScrollView>
  );

  // Step 3: Financial Information
  const renderStep3 = () => (
    <ScrollView className="flex-1 bg-gray-50 px-8" showsVerticalScrollIndicator={false}>
      <LoanStepHeader
        step={3}
        totalSteps={6}
        title="Financial Information"
        subtitle="Provide your financial details"
        onBack={() => setStep(2)}
      />

      <LoanCard title="Income Information">
        <LoanInputField
          label="Monthly Income"
          placeholder="Enter monthly income"
          value={financialInfo.monthlyIncome.toString()}
          onChangeText={(text) => {
            const monthly = Number(text) || 0;
            setFinancialInfo(prev => ({ ...prev, monthlyIncome: monthly, annualIncome: monthly * 12 }));
          }}
          icon="attach-money"
          keyboardType="numeric"
        />

        <LoanInputField
          label="Income Source"
          placeholder="Select income source"
          value={financialInfo.incomeSource}
          onChangeText={(text) => setFinancialInfo(prev => ({ ...prev, incomeSource: text as any }))}
          icon="work"
        />

        <LoanInputField
          label="Employment Status"
          placeholder="Select employment status"
          value={financialInfo.employmentStatus}
          onChangeText={(text) => setFinancialInfo(prev => ({ ...prev, employmentStatus: text as any }))}
          icon="person"
        />
      </LoanCard>

      <LoanCard title="Farming Information">
        <LoanInputField
          label="Farming Experience (Years)"
          placeholder="Enter years of experience"
          value={financialInfo.farmingExperience.toString()}
          onChangeText={(text) => setFinancialInfo(prev => ({ ...prev, farmingExperience: Number(text) || 0 }))}
          icon="schedule"
          keyboardType="numeric"
        />

        <LoanInputField
          label="Farm Type"
          placeholder="Select farm type"
          value={financialInfo.farmType}
          onChangeText={(text) => setFinancialInfo(prev => ({ ...prev, farmType: text as any }))}
          icon="agriculture"
        />
      </LoanCard>

      <LoanCard title="Banking Information">
        <LoanInputField
          label="Bank Name"
          placeholder="Enter bank name"
          value={financialInfo.bankName}
          onChangeText={(text) => setFinancialInfo(prev => ({ ...prev, bankName: text }))}
          icon="account-balance"
        />

        <LoanInputField
          label="Bank Branch"
          placeholder="Enter bank branch"
          value={financialInfo.bankBranch}
          onChangeText={(text) => setFinancialInfo(prev => ({ ...prev, bankBranch: text }))}
          icon="location-on"
        />

        <LoanInputField
          label="Account Number"
          placeholder="Enter account number"
          value={financialInfo.accountNumber}
          onChangeText={(text) => setFinancialInfo(prev => ({ ...prev, accountNumber: text }))}
          icon="credit-card"
        />

        <LoanInputField
          label="Account Holder Name"
          placeholder="Enter account holder name"
          value={financialInfo.accountHolderName}
          onChangeText={(text) => setFinancialInfo(prev => ({ ...prev, accountHolderName: text }))}
          icon="person"
        />
      </LoanCard>

      <LoanNavigationButtons
        onBack={() => setStep(2)}
        onNext={() => {
          if (validateStep3()) setStep(4);
        }}
        nextText="Continue to Documents"
      />
    </ScrollView>
  );

  // Step 4: Document Upload
  const renderStep4 = () => (
    <ScrollView className="flex-1 bg-gray-50 px-8" showsVerticalScrollIndicator={false}>
      <LoanStepHeader
        step={4}
        totalSteps={6}
        title="Document Upload"
        subtitle="Upload required documents"
        onBack={() => setStep(3)}
      />

      <LoanCard title="Required Documents">
      <DocumentUploadField
          label="ID Photo"
          icon="receipt"
            onPress={() => pickImage('idPhoto')}
            value={documents.idPhoto}
          placeholder="Upload ID photo"
          required={true}
        />
        <DocumentUploadField
          label="Proof of Income"
          icon="receipt"
          onPress={() => pickImage('proofOfIncome')}
          value={documents.proofOfIncome}
          placeholder="Upload proof of income"
          required={true}
        />

        <DocumentUploadField
          label="Farm Ownership Documents"
          icon="description"
          onPress={() => pickImage('farmOwnershipDocuments')}
          value={documents.farmOwnershipDocuments}
          placeholder="Upload farm ownership documents"
          required={true}
        />

        <DocumentUploadField
          label="Cooperative Membership"
          icon="group"
          onPress={() => pickImage('cooperativeMembership')}
          value={documents.cooperativeMembership}
          placeholder="Upload cooperative membership proof"
          required={false}
        />
      </LoanCard>

      <LoanCard title="Tree Images (Optional)">
        <View className="mb-6">
          <Text className="font-semibold text-gray-700 mb-3 text-base">
            Tree Images (Max 15)
          </Text>
          <TouchableOpacity
            onPress={() => pickImage('treeImages')}
            className="border border-gray-200 rounded-2xl px-5 py-4 bg-white"
          >
            <View className="flex-row items-center">
              <MaterialIcons name="photo" size={24} color="#059669" />
              <Text className="flex-1 text-gray-500 ml-4 text-base">
                Upload tree images ({documents.treeImages.length}/15)
              </Text>
              <MaterialIcons name="add-photo-alternate" size={24} color="#059669" />
            </View>
          </TouchableOpacity>
        </View>

        {/* Display uploaded tree images */}
        {documents.treeImages.length > 0 && (
          <View className="flex-row flex-wrap">
            {documents.treeImages.map((image, index) => (
              <View key={index} className="relative mr-3 mb-3">
                <Image
                  source={{ uri: image }}
                  className="w-24 h-24 rounded-xl"
                />
                <TouchableOpacity
                  onPress={() => removeTreeImage(index)}
                  className="absolute -top-2 -right-2 bg-red-500 rounded-full w-7 h-7 items-center justify-center"
                >
                  <MaterialIcons name="close" size={18} color="white" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
      </LoanCard>

      <LoanNavigationButtons
        onBack={() => setStep(3)}
        onNext={() => {
          if (validateStep4()) setStep(5);
        }}
        nextText="Continue to Repayment Terms"
      />
    </ScrollView>
  );

  // Step 5: Repayment Terms (Read-only from product)
  const renderStep5 = () => (
    <ScrollView className="flex-1 bg-gray-50 px-8" showsVerticalScrollIndicator={false}>
      <LoanStepHeader
        step={5}
        totalSteps={6}
        title="Repayment Terms"
        subtitle="Review your loan repayment terms"
        onBack={() => setStep(4)}
      />

      <LoanCard title="Loan Summary">
        <LoanInputField
          label="Loan Term"
          placeholder=""
          value={Number(product.term) >= 12 ? `${Math.round(Number(product.term) / 12)} years` : `${product.term} months`}
          onChangeText={() => { }}
          icon="schedule"
          readOnly={true}
        />
        <LoanInputField
          label="Interest Rate"
          placeholder=""
          value={`${product.interest}%`}
          onChangeText={() => { }}
          icon="percent"
          readOnly={true}
        />
        <LoanInputField
          label="Monthly Payment"
          placeholder=""
          value={`$${Number(calculateMonthlyPayment(product.amount, product.interest, product.term)).toLocaleString()}`}
          onChangeText={() => { }}
          icon="payment"
          readOnly={true}
        />
        <LoanInputField
          label="Total Interest"
          placeholder=""
          value={`$${((Number(calculateMonthlyPayment(product.amount, product.interest, product.term)) * Number(product.term)) - Number(product.amount)).toFixed(2)}`}
          onChangeText={() => { }}
          icon="trending-up"
          readOnly={true}
        />
        <LoanInputField
          label="Total Repayment"
          placeholder=""
          value={`$${(Number(calculateMonthlyPayment(product.amount, product.interest, product.term)) * Number(product.term)).toFixed(2)}`}
          onChangeText={() => { }}
          icon="account-balance-wallet"
          readOnly={true}
        />
      </LoanCard>

      <LoanNavigationButtons
        onBack={() => setStep(4)}
        onNext={() => setStep(6)}
        nextText="Review & Submit"
      />
    </ScrollView>
  );

  // Step 6: Review & Submit
  const renderStep6 = () => (
    <ScrollView className="flex-1 bg-gray-50 px-8" showsVerticalScrollIndicator={false}>
      <LoanStepHeader
        step={6}
        totalSteps={6}
        title="Review & Submit"
        subtitle="Please review your application details"
        onBack={() => setStep(5)}
      />

      {/* Personal Information Card */}
      <LoanCard title="Personal Information">
        <View className="space-y-4">
          <View className="flex-row justify-between">
            <Text className="text-gray-500 text-base">Name:</Text>
            <Text className="font-semibold text-base">{personalInfo.firstName} {personalInfo.lastName}</Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="text-gray-500 text-base">ID Number:</Text>
            <Text className="font-semibold text-base">{personalInfo.idNumber}</Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="text-gray-500 text-base">Date of Birth:</Text>
            <Text className="font-semibold text-base">{personalInfo.dateOfBirth}</Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="text-gray-500 text-base">Address:</Text>
            <Text className="font-semibold text-base">{personalInfo.streetAddress}, {personalInfo.city}</Text>
          </View>
        </View>
      </LoanCard>

      {/* Loan Details Card */}
      <LoanCard title="Loan Details">
        <View className="space-y-4">
          <View className="flex-row justify-between">
            <Text className="text-gray-500 text-base">Loan Type:</Text>
            <Text className="font-semibold text-base">{product.name}</Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="text-gray-500 text-base">Amount:</Text>
            <Text className="font-semibold text-base">${Number(product.amount).toLocaleString()}</Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="text-gray-500 text-base">Interest Rate:</Text>
            <Text className="font-semibold text-base">{product.interest}%</Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="text-gray-500 text-base">Term:</Text>
            <Text className="font-semibold text-base">
              {Number(product.term) >= 12 ? `${Math.round(Number(product.term) / 12)} years` : `${product.term} months`}
            </Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="text-gray-500 text-base">Monthly Payment:</Text>
            <Text className="font-semibold text-base">${Number(calculateMonthlyPayment(product.amount, product.interest, product.term)).toLocaleString()}</Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="text-gray-500 text-base">Purpose:</Text>
            <Text className="font-semibold text-base">{purpose}</Text>
          </View>
        </View>
      </LoanCard>

      {/* Financial Information Card */}
      <LoanCard title="Financial Information">
        <View className="space-y-4">
          <View className="flex-row justify-between">
            <Text className="text-gray-500 text-base">Monthly Income:</Text>
            <Text className="font-semibold text-base">${financialInfo.monthlyIncome.toLocaleString()}</Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="text-gray-500 text-base">Income Source:</Text>
            <Text className="font-semibold text-base">{financialInfo.incomeSource}</Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="text-gray-500 text-base">Employment Status:</Text>
            <Text className="font-semibold text-base">{financialInfo.employmentStatus}</Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="text-gray-500 text-base">Farming Experience:</Text>
            <Text className="font-semibold text-base">{financialInfo.farmingExperience} years</Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="text-gray-500 text-base">Farm Type:</Text>
            <Text className="font-semibold text-base">{financialInfo.farmType}</Text>
          </View>
        </View>
      </LoanCard>

      {/* Banking Information Card */}
      <LoanCard title="Banking Information">
        <View className="space-y-4">
          <View className="flex-row justify-between">
            <Text className="text-gray-500 text-base">Bank Name:</Text>
            <Text className="font-semibold text-base">{financialInfo.bankName}</Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="text-gray-500 text-base">Bank Branch:</Text>
            <Text className="font-semibold text-base">{financialInfo.bankBranch}</Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="text-gray-500 text-base">Account Number:</Text>
            <Text className="font-semibold text-base">{financialInfo.accountNumber}</Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="text-gray-500 text-base">Account Holder:</Text>
            <Text className="font-semibold text-base">{financialInfo.accountHolderName}</Text>
          </View>
        </View>
      </LoanCard>

      <LoanNavigationButtons
        onBack={() => setStep(5)}
        onNext={handleSubmit}
        nextText="Submit Application"
        showBack={true}
      />
    </ScrollView>
  );

  return (
    <ScrollView className="flex-1 bg-white px-4 pt-6">
      <Toast />
      {step === 1 && renderStep1()}
      {step === 2 && renderStep2()}
      {step === 3 && renderStep3()}
      {step === 4 && renderStep4()}
      {step === 5 && renderStep5()}
      {step === 6 && renderStep6()}
    </ScrollView>
  );
}
