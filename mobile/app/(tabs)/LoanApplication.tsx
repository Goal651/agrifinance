import { getLoanProducts } from '@/api/loan';
import { useLoan } from '@/hooks/useLoan';
import { DocumentUpload, FinancialInfo, LoanProduct, LoanRequest, PersonalInfo } from '@/types';
import { calculateMonthlyPayment } from '@/utils/loan';
import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Image, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Toast from 'react-native-toast-message';

export default function LoanApplication({ navigation }) {
  const params = useLocalSearchParams();
  const router = useRouter();
  const { applyLoan, loading } = useLoan();

  // Fetch loan products from server
  const [loanProducts, setLoanProducts] = useState<LoanProduct[]>([]);
  useEffect(() => {
    getLoanProducts().then(setLoanProducts);
  }, []);

  const product = params.product ? JSON.parse(params.product as string) : null;

  const [step, setStep] = useState(1);
  
  // Step 1: Basic Loan Information
  const [loanType, setLoanType] = useState(product?.name || '');
  const [amount, setAmount] = useState(product?.minAmount?.toString() || '');
  const [purpose, setPurpose] = useState('');
  const [purposeError, setPurposeError] = useState('');
  const [term, setTerm] = useState(product?.termMonths?.toString() || '');
  const [interestRate, setInterestRate] = useState(product?.interest?.toString() || '');
  const [monthlyPayment, setMonthlyPayment] = useState('');

  // Step 2: Personal Information
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

  // Step 3: Financial Information
  const [financialInfo, setFinancialInfo] = useState<FinancialInfo>({
    monthlyIncome: 0,
    annualIncome: 0,
    incomeSource: 'farming',
    employmentStatus: 'self-employed',
    farmingExperience: 0,
    farmType: 'crop',
    bankName: '',
    bankBranch: '',
    accountNumber: '',
    accountHolderName: ''
  });

  // Step 4: Document Upload
  const [documents, setDocuments] = useState<DocumentUpload>({
    idPhoto: null,
    proofOfIncome: null,
    farmOwnershipDocuments: null,
    cooperativeMembership: null,
    treeImages: []
  });

  const farmInfo = { size: '503', location: 'Kigali', existingLoans: 'No' };

  // Loan purpose options based on loan type
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

  useEffect(() => {
    if (product) {
      setLoanType(product.name);
      setAmount(product.minAmount?.toString() || '');
      setInterestRate(product.interest?.toString() || '');
      setTerm(product.termMonths?.toString() || '');
      const amt = Number(product.minAmount);
      const rate = Number(product.interest);
      const termValue = Number(product.termMonths);
      if (amt && rate && termValue) {
        const monthly = calculateMonthlyPayment(amt, rate, termValue);
        setMonthlyPayment(monthly.toFixed(2));
      }
    }
  }, [product]);

  useEffect(() => {
    const amt = Number(amount);
    const rate = Number(interestRate);
    const termValue = Number(term);
    if (amt && rate && termValue) {
      const monthly = calculateMonthlyPayment(amt, rate, termValue);
      setMonthlyPayment(monthly.toFixed(2));
    } else {
      setMonthlyPayment('');
    }
  }, [amount, interestRate, term]);

  const validateStep1 = () => {
    if (!purpose) {
      setPurposeError('Loan purpose is required');
      return false;
    }
    setPurposeError('');
    return true;
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
      Alert.alert('Document Required', 'Please upload all required documents (ID Photo, Proof of Income, and Farm Ownership Documents).');
      return false;
    }
    return true;
  };

  const pickImage = async (type: keyof DocumentUpload) => {
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
    if (!amount || !purpose || !term || !interestRate) return;
    
    const loanRequest: LoanRequest = {
      amount: Number(amount),
      type: loanType,
      interest: Number(interestRate),
      term: term,
      purpose,
      termType: loanType,
      personalInfo,
      financialInfo,
      documents
    };
    
    await applyLoan(loanRequest);
  };

  // Step 1: Basic Loan Information
  const renderStep1 = () => (
    <View>
      <View className='flex flex-row items-center py-6'>
        <TouchableOpacity onPress={() => router.back()}>
          <Text><MaterialIcons name='arrow-back' size={18} color="#9CA3AF" /></Text>
        </TouchableOpacity>
        <Text className="text-lg font-bold text-green-700 text-center mb-2 flex-1">Loan Application</Text>
      </View>
      <View className="w-full h-2 bg-gray-200 rounded-full mb-6">
        <View className="h-2 bg-green-700 rounded-full" style={{ width: '17%' }} />
      </View>
      <Text className="text-center text-xs text-gray-400 mb-2">Step 1 of 6</Text>
      <Text className="text-green-700 font-bold mb-1">Step 1: Basic Information</Text>
      <Text className="text-gray-500 mb-6">Tell us about your loan request</Text>

      <Text className="font-semibold mb-1">Loan Type</Text>
      <View className="flex-row items-center border border-gray-300 rounded-md px-3 py-2 bg-white mb-3">
        <MaterialIcons name="account-balance-wallet" size={18} color="#9CA3AF" />
        <TextInput
          className="flex-1 text-base ml-2"
          placeholder="Select loan type"
          value={loanType}
          onChangeText={setLoanType}
        />
      </View>

      <Text className="font-semibold mb-1">Loan Amount ($)</Text>
      <View className="flex-row items-center border border-gray-300 rounded-md px-3 py-2 bg-white mb-3">
        <MaterialIcons name="attach-money" size={18} color="#9CA3AF" />
        <TextInput
          className="flex-1 text-base ml-2"
          placeholder="Enter loan amount"
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
        />
      </View>

      <Text className="font-semibold mb-1">Purpose of Loan</Text>
      <View className="flex-row items-center border border-gray-300 rounded-md px-3 py-2 bg-white mb-3">
        <MaterialIcons name="description" size={18} color="#9CA3AF" />
        <TextInput
          className="flex-1 text-base ml-2"
          placeholder="Describe the purpose of your loan"
          value={purpose}
          onChangeText={setPurpose}
          multiline
        />
      </View>
      {purposeError ? <Text className="text-red-500 text-sm mb-3">{purposeError}</Text> : null}

      <TouchableOpacity className="bg-green-700 rounded-full py-3 mt-4" onPress={() => {
        if (validateStep1()) setStep(2);
      }}>
        <Text className="text-white text-center font-semibold text-base">Next</Text>
      </TouchableOpacity>
    </View>
  );

  // Step 2: Personal Information
  const renderStep2 = () => (
    <View>
      <View className='flex flex-row items-center py-6'>
        <TouchableOpacity onPress={() => setStep(1)}>
          <Text><MaterialIcons name='arrow-back' size={18} color="#9CA3AF" /></Text>
        </TouchableOpacity>
        <Text className="text-lg font-bold text-green-700 text-center mb-2 flex-1">Loan Application</Text>
      </View>
      <View className="w-full h-2 bg-gray-200 rounded-full mb-6">
        <View className="h-2 bg-green-700 rounded-full" style={{ width: '33%' }} />
      </View>
      <Text className="text-center text-xs text-gray-400 mb-2">Step 2 of 6</Text>
      <Text className="text-green-700 font-bold mb-1">Step 2: Personal Information</Text>
      <Text className="text-gray-500 mb-6">Provide your personal details</Text>

      <Text className="font-semibold mb-1">First Name</Text>
      <View className="flex-row items-center border border-gray-300 rounded-md px-3 py-2 bg-white mb-3">
        <MaterialIcons name="person" size={18} color="#9CA3AF" />
        <TextInput
          className="flex-1 text-base ml-2"
          placeholder="Enter first name"
          value={personalInfo.firstName}
          onChangeText={(text) => setPersonalInfo(prev => ({ ...prev, firstName: text }))}
        />
      </View>

      <Text className="font-semibold mb-1">Last Name</Text>
      <View className="flex-row items-center border border-gray-300 rounded-md px-3 py-2 bg-white mb-3">
        <MaterialIcons name="person" size={18} color="#9CA3AF" />
        <TextInput
          className="flex-1 text-base ml-2"
          placeholder="Enter last name"
          value={personalInfo.lastName}
          onChangeText={(text) => setPersonalInfo(prev => ({ ...prev, lastName: text }))}
        />
      </View>

      <Text className="font-semibold mb-1">ID Number</Text>
      <View className="flex-row items-center border border-gray-300 rounded-md px-3 py-2 bg-white mb-3">
        <MaterialIcons name="badge" size={18} color="#9CA3AF" />
        <TextInput
          className="flex-1 text-base ml-2"
          placeholder="Enter ID number"
          value={personalInfo.idNumber}
          onChangeText={(text) => setPersonalInfo(prev => ({ ...prev, idNumber: text }))}
        />
      </View>

      <Text className="font-semibold mb-1">Date of Birth</Text>
      <View className="flex-row items-center border border-gray-300 rounded-md px-3 py-2 bg-white mb-3">
        <MaterialIcons name="event" size={18} color="#9CA3AF" />
        <TextInput
          className="flex-1 text-base ml-2"
          placeholder="YYYY-MM-DD"
          value={personalInfo.dateOfBirth}
          onChangeText={(text) => setPersonalInfo(prev => ({ ...prev, dateOfBirth: text }))}
        />
      </View>

      <Text className="font-semibold mb-1">Street Address</Text>
      <View className="flex-row items-center border border-gray-300 rounded-md px-3 py-2 bg-white mb-3">
        <MaterialIcons name="location-on" size={18} color="#9CA3AF" />
        <TextInput
          className="flex-1 text-base ml-2"
          placeholder="Enter street address"
          value={personalInfo.streetAddress}
          onChangeText={(text) => setPersonalInfo(prev => ({ ...prev, streetAddress: text }))}
        />
      </View>

      <Text className="font-semibold mb-1">City</Text>
      <View className="flex-row items-center border border-gray-300 rounded-md px-3 py-2 bg-white mb-3">
        <MaterialIcons name="location-city" size={18} color="#9CA3AF" />
        <TextInput
          className="flex-1 text-base ml-2"
          placeholder="Enter city"
          value={personalInfo.city}
          onChangeText={(text) => setPersonalInfo(prev => ({ ...prev, city: text }))}
        />
      </View>

      <Text className="font-semibold mb-1">State/Province</Text>
      <View className="flex-row items-center border border-gray-300 rounded-md px-3 py-2 bg-white mb-3">
        <MaterialIcons name="map" size={18} color="#9CA3AF" />
        <TextInput
          className="flex-1 text-base ml-2"
          placeholder="Enter state/province"
          value={personalInfo.state}
          onChangeText={(text) => setPersonalInfo(prev => ({ ...prev, state: text }))}
        />
      </View>

      <Text className="font-semibold mb-1">Postal Code</Text>
      <View className="flex-row items-center border border-gray-300 rounded-md px-3 py-2 bg-white mb-3">
        <MaterialIcons name="mark-email-unread" size={18} color="#9CA3AF" />
        <TextInput
          className="flex-1 text-base ml-2"
          placeholder="Enter postal code"
          value={personalInfo.postalCode}
          onChangeText={(text) => setPersonalInfo(prev => ({ ...prev, postalCode: text }))}
        />
      </View>

      <Text className="font-semibold mb-1">Country</Text>
      <View className="flex-row items-center border border-gray-300 rounded-md px-3 py-2 bg-white mb-3">
        <MaterialIcons name="public" size={18} color="#9CA3AF" />
        <TextInput
          className="flex-1 text-base ml-2"
          placeholder="Enter country"
          value={personalInfo.country}
          onChangeText={(text) => setPersonalInfo(prev => ({ ...prev, country: text }))}
        />
      </View>

      <View className="flex-row justify-between mt-4">
        <TouchableOpacity className="bg-gray-200 rounded-full py-3 px-10 mr-2" onPress={() => setStep(1)}>
          <Text className="text-gray-700 text-center font-semibold text-base">Back</Text>
        </TouchableOpacity>
        <TouchableOpacity className="flex-1 bg-green-700 rounded-full py-3 ml-2" onPress={() => {
          if (validateStep2()) setStep(3);
        }}>
          <Text className="text-white text-center font-semibold text-base">Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  // Step 3: Financial Information
  const renderStep3 = () => (
    <View>
      <View className='flex flex-row items-center py-6'>
        <TouchableOpacity onPress={() => setStep(2)}>
          <Text><MaterialIcons name='arrow-back' size={18} color="#9CA3AF" /></Text>
        </TouchableOpacity>
        <Text className="text-lg font-bold text-green-700 text-center mb-2 flex-1">Loan Application</Text>
      </View>
      <View className="w-full h-2 bg-gray-200 rounded-full mb-6">
        <View className="h-2 bg-green-700 rounded-full" style={{ width: '50%' }} />
      </View>
      <Text className="text-center text-xs text-gray-400 mb-2">Step 3 of 6</Text>
      <Text className="text-green-700 font-bold mb-1">Step 3: Financial Information</Text>
      <Text className="text-gray-500 mb-6">Provide your financial details</Text>

      <Text className="font-semibold mb-1">Monthly Income ($)</Text>
      <View className="flex-row items-center border border-gray-300 rounded-md px-3 py-2 bg-white mb-3">
        <MaterialIcons name="payments" size={18} color="#9CA3AF" />
        <TextInput
          className="flex-1 text-base ml-2"
          placeholder="Enter monthly income"
          value={financialInfo.monthlyIncome.toString()}
          onChangeText={(text) => setFinancialInfo(prev => ({ ...prev, monthlyIncome: Number(text) || 0 }))}
          keyboardType="numeric"
        />
      </View>

      <Text className="font-semibold mb-1">Annual Income ($)</Text>
      <View className="flex-row items-center border border-gray-300 rounded-md px-3 py-2 bg-white mb-3">
        <MaterialIcons name="account-balance" size={18} color="#9CA3AF" />
        <TextInput
          className="flex-1 text-base ml-2"
          placeholder="Enter annual income"
          value={financialInfo.annualIncome.toString()}
          onChangeText={(text) => setFinancialInfo(prev => ({ ...prev, annualIncome: Number(text) || 0 }))}
          keyboardType="numeric"
        />
      </View>

      <Text className="font-semibold mb-1">Income Source</Text>
      <View className="flex-row items-center border border-gray-300 rounded-md px-3 py-2 bg-white mb-3">
        <MaterialIcons name="work" size={18} color="#9CA3AF" />
        <TextInput
          className="flex-1 text-base ml-2"
          placeholder="farming, employment, business, other"
          value={financialInfo.incomeSource}
          onChangeText={(text) => setFinancialInfo(prev => ({ ...prev, incomeSource: text as any }))}
        />
      </View>

      <Text className="font-semibold mb-1">Employment Status</Text>
      <View className="flex-row items-center border border-gray-300 rounded-md px-3 py-2 bg-white mb-3">
        <MaterialIcons name="person" size={18} color="#9CA3AF" />
        <TextInput
          className="flex-1 text-base ml-2"
          placeholder="employed, self-employed, unemployed, retired"
          value={financialInfo.employmentStatus}
          onChangeText={(text) => setFinancialInfo(prev => ({ ...prev, employmentStatus: text as any }))}
        />
      </View>

      <Text className="font-semibold mb-1">Farming Experience (Years)</Text>
      <View className="flex-row items-center border border-gray-300 rounded-md px-3 py-2 bg-white mb-3">
        <MaterialIcons name="schedule" size={18} color="#9CA3AF" />
        <TextInput
          className="flex-1 text-base ml-2"
          placeholder="Enter years of farming experience"
          value={financialInfo.farmingExperience.toString()}
          onChangeText={(text) => setFinancialInfo(prev => ({ ...prev, farmingExperience: Number(text) || 0 }))}
          keyboardType="numeric"
        />
      </View>

      <Text className="font-semibold mb-1">Farm Type</Text>
      <View className="flex-row items-center border border-gray-300 rounded-md px-3 py-2 bg-white mb-3">
        <MaterialIcons name="agriculture" size={18} color="#9CA3AF" />
        <TextInput
          className="flex-1 text-base ml-2"
          placeholder="crop, livestock, mixed, other"
          value={financialInfo.farmType}
          onChangeText={(text) => setFinancialInfo(prev => ({ ...prev, farmType: text as any }))}
        />
      </View>

      <Text className="font-semibold mb-1">Bank Name</Text>
      <View className="flex-row items-center border border-gray-300 rounded-md px-3 py-2 bg-white mb-3">
        <MaterialIcons name="account-balance" size={18} color="#9CA3AF" />
        <TextInput
          className="flex-1 text-base ml-2"
          placeholder="Enter bank name"
          value={financialInfo.bankName}
          onChangeText={(text) => setFinancialInfo(prev => ({ ...prev, bankName: text }))}
        />
      </View>

      <Text className="font-semibold mb-1">Bank Branch</Text>
      <View className="flex-row items-center border border-gray-300 rounded-md px-3 py-2 bg-white mb-3">
        <MaterialIcons name="location-on" size={18} color="#9CA3AF" />
        <TextInput
          className="flex-1 text-base ml-2"
          placeholder="Enter bank branch"
          value={financialInfo.bankBranch}
          onChangeText={(text) => setFinancialInfo(prev => ({ ...prev, bankBranch: text }))}
        />
      </View>

      <Text className="font-semibold mb-1">Account Number</Text>
      <View className="flex-row items-center border border-gray-300 rounded-md px-3 py-2 bg-white mb-3">
        <MaterialIcons name="credit-card" size={18} color="#9CA3AF" />
        <TextInput
          className="flex-1 text-base ml-2"
          placeholder="Enter account number"
          value={financialInfo.accountNumber}
          onChangeText={(text) => setFinancialInfo(prev => ({ ...prev, accountNumber: text }))}
        />
      </View>

      <Text className="font-semibold mb-1">Account Holder Name</Text>
      <View className="flex-row items-center border border-gray-300 rounded-md px-3 py-2 bg-white mb-3">
        <MaterialIcons name="person" size={18} color="#9CA3AF" />
        <TextInput
          className="flex-1 text-base ml-2"
          placeholder="Enter account holder name"
          value={financialInfo.accountHolderName}
          onChangeText={(text) => setFinancialInfo(prev => ({ ...prev, accountHolderName: text }))}
        />
      </View>

      <View className="flex-row justify-between mt-4">
        <TouchableOpacity className="bg-gray-200 rounded-full py-3 px-10 mr-2" onPress={() => setStep(2)}>
          <Text className="text-gray-700 text-center font-semibold text-base">Back</Text>
        </TouchableOpacity>
        <TouchableOpacity className="flex-1 bg-green-700 rounded-full py-3 ml-2" onPress={() => {
          if (validateStep3()) setStep(4);
        }}>
          <Text className="text-white text-center font-semibold text-base">Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  // Step 4: Document Upload
  const renderStep4 = () => (
    <View>
      <View className='flex flex-row items-center py-6'>
        <TouchableOpacity onPress={() => setStep(3)}>
          <Text><MaterialIcons name='arrow-back' size={18} color="#9CA3AF" /></Text>
        </TouchableOpacity>
        <Text className="text-lg font-bold text-green-700 text-center mb-2 flex-1">Loan Application</Text>
      </View>
      <View className="w-full h-2 bg-gray-200 rounded-full mb-6">
        <View className="h-2 bg-green-700 rounded-full" style={{ width: '67%' }} />
      </View>
      <Text className="text-center text-xs text-gray-400 mb-2">Step 4 of 6</Text>
      <Text className="text-green-700 font-bold mb-1">Step 4: Document Upload</Text>
      <Text className="text-gray-500 mb-6">Upload required documents</Text>

      {/* ID Photo Upload */}
      <View className="mb-4">
        <Text className="font-semibold mb-2">ID Photo (Required)</Text>
        <TouchableOpacity 
          className="border-2 border-dashed border-gray-300 rounded-lg p-4 items-center"
          onPress={() => pickImage('idPhoto')}
        >
          {documents.idPhoto ? (
            <Image source={{ uri: documents.idPhoto }} className="w-20 h-20 rounded-lg" />
          ) : (
            <View className="items-center">
              <MaterialIcons name="add-a-photo" size={40} color="#9CA3AF" />
              <Text className="text-gray-500 mt-2">Upload ID Photo</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Proof of Income Upload */}
      <View className="mb-4">
        <Text className="font-semibold mb-2">Proof of Income (Required)</Text>
        <TouchableOpacity 
          className="border-2 border-dashed border-gray-300 rounded-lg p-4 items-center"
          onPress={() => pickImage('proofOfIncome')}
        >
          {documents.proofOfIncome ? (
            <Image source={{ uri: documents.proofOfIncome }} className="w-20 h-20 rounded-lg" />
          ) : (
            <View className="items-center">
              <MaterialIcons name="description" size={40} color="#9CA3AF" />
              <Text className="text-gray-500 mt-2">Upload Proof of Income</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Farm Ownership Documents Upload */}
      <View className="mb-4">
        <Text className="font-semibold mb-2">Farm Ownership Documents (Required)</Text>
        <TouchableOpacity 
          className="border-2 border-dashed border-gray-300 rounded-lg p-4 items-center"
          onPress={() => pickImage('farmOwnershipDocuments')}
        >
          {documents.farmOwnershipDocuments ? (
            <Image source={{ uri: documents.farmOwnershipDocuments }} className="w-20 h-20 rounded-lg" />
          ) : (
            <View className="items-center">
              <MaterialIcons name="folder" size={40} color="#9CA3AF" />
              <Text className="text-gray-500 mt-2">Upload Farm Documents</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Cooperative Membership Upload */}
      <View className="mb-4">
        <Text className="font-semibold mb-2">Proof of Cooperative Membership (Required)</Text>
        <TouchableOpacity 
          className="border-2 border-dashed border-gray-300 rounded-lg p-4 items-center"
          onPress={() => pickImage('cooperativeMembership')}
        >
          {documents.cooperativeMembership ? (
            <Image source={{ uri: documents.cooperativeMembership }} className="w-20 h-20 rounded-lg" />
          ) : (
            <View className="items-center">
              <MaterialIcons name="groups" size={40} color="#9CA3AF" />
              <Text className="text-gray-500 mt-2">Upload Cooperative Membership</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Tree Images Upload */}
      <View className="mb-4">
        <Text className="font-semibold mb-2">Tree Images (Optional - Max 15)</Text>
        <TouchableOpacity 
          className="border-2 border-dashed border-gray-300 rounded-lg p-4 items-center"
          onPress={() => pickImage('treeImages')}
        >
          <View className="items-center">
            <MaterialIcons name="nature" size={40} color="#9CA3AF" />
            <Text className="text-gray-500 mt-2">Add Tree Images ({documents.treeImages.length}/15)</Text>
          </View>
        </TouchableOpacity>
        
        {/* Display uploaded tree images */}
        {documents.treeImages.length > 0 && (
          <View className="mt-2">
            <Text className="text-sm text-gray-600 mb-2">Uploaded Images:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {documents.treeImages.map((uri, index) => (
                <View key={index} className="mr-2 relative">
                  <Image source={{ uri }} className="w-16 h-16 rounded-lg" />
                  <TouchableOpacity 
                    className="absolute -top-2 -right-2 bg-red-500 rounded-full w-6 h-6 items-center justify-center"
                    onPress={() => removeTreeImage(index)}
                  >
                    <Text className="text-white text-xs">×</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          </View>
        )}
      </View>

      <View className="flex-row justify-between mt-4">
        <TouchableOpacity className="bg-gray-200 rounded-full py-3 px-10 mr-2" onPress={() => setStep(3)}>
          <Text className="text-gray-700 text-center font-semibold text-base">Back</Text>
        </TouchableOpacity>
        <TouchableOpacity className="flex-1 bg-green-700 rounded-full py-3 ml-2" onPress={() => {
          if (validateStep4()) setStep(5);
        }}>
          <Text className="text-white text-center font-semibold text-base">Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  // Step 5: Repayment Terms
  const renderStep5 = () => (
    <View>
      <View className='flex flex-row items-center py-6'>
        <TouchableOpacity onPress={() => setStep(4)}>
          <Text><MaterialIcons name='arrow-back' size={18} color="#9CA3AF" /></Text>
        </TouchableOpacity>
        <Text className="text-lg font-bold text-green-700 text-center mb-2 flex-1">Loan Application</Text>
      </View>
      <View className="w-full h-2 bg-gray-200 rounded-full mb-6">
        <View className="h-2 bg-green-700 rounded-full" style={{ width: '83%' }} />
      </View>
      <Text className="text-center text-xs text-gray-400 mb-2">Step 5 of 6</Text>
      <Text className="text-green-700 font-bold mb-1">Step 5: Repayment Terms</Text>
      <Text className="text-gray-500 mb-6">Set your repayment preferences</Text>

      <Text className="font-semibold mb-1">Term (months)</Text>
      <View className="flex-row items-center border border-gray-300 rounded-md px-3 py-2 bg-white mb-3">
        <MaterialIcons name="date-range" size={18} color="#9CA3AF" />
        <TextInput
          className="flex-1 text-base ml-2"
          placeholder="8"
          value={term}
          onChangeText={setTerm}
          keyboardType="numeric"
        />
      </View>

      <Text className="font-semibold mb-1">Interest Rate (%)</Text>
      <View className="flex-row items-center border border-gray-300 rounded-md px-3 py-2 bg-white mb-3">
        <MaterialIcons name="percent" size={18} color="#9CA3AF" />
        <TextInput
          className="flex-1 text-base ml-2"
          placeholder="8.0"
          value={interestRate}
          onChangeText={setInterestRate}
          keyboardType="numeric"
        />
      </View>

      <Text className="font-semibold mb-1">Est. Monthly Payment</Text>
      <View className="flex-row items-center border border-gray-300 rounded-md px-3 py-2 bg-white mb-3">
        <MaterialIcons name="payments" size={18} color="#9CA3AF" />
        <TextInput
          className="flex-1 text-base ml-2"
          placeholder="$90.15"
          value={monthlyPayment}
          onChangeText={setMonthlyPayment}
          keyboardType="numeric"
          editable={false}
        />
      </View>

      <View className="flex-row justify-between mt-4">
        <TouchableOpacity className="bg-gray-200 rounded-full py-3 px-10 mr-2" onPress={() => setStep(4)}>
          <Text className="text-gray-700 text-center font-semibold text-base">Back</Text>
        </TouchableOpacity>
        <TouchableOpacity className="flex-1 bg-green-700 rounded-full py-3 ml-2" onPress={() => setStep(6)}>
          <Text className="text-white text-center font-semibold text-base">Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  // Step 6: Review & Submit
  const renderStep6 = () => (
    <View>
      <View className='flex flex-row items-center py-6'>
        <TouchableOpacity onPress={() => setStep(5)}>
          <Text><MaterialIcons name='arrow-back' size={18} color="#9CA3AF" /></Text>
        </TouchableOpacity>
        <Text className="text-lg font-bold text-green-700 text-center mb-2 flex-1">Loan Application</Text>
      </View>
      <View className="w-full h-2 bg-gray-200 rounded-full mb-6">
        <View className="h-2 bg-green-700 rounded-full" style={{ width: '100%' }} />
      </View>
      <Text className="text-center text-xs text-gray-400 mb-2">Step 6 of 6</Text>
      <Text className="text-green-700 font-bold mb-1">Step 6: Review & Submit</Text>
      <Text className="text-gray-500 mb-6">Please review your application details</Text>

      {/* Personal Information Card */}
      <View className="bg-gray-50 rounded-xl shadow p-4 mb-4 border border-gray-100">
        <View className="flex-row items-center mb-2">
          <MaterialIcons name="person" size={22} color="#15803d" />
          <Text className="font-bold ml-2">Personal Information</Text>
        </View>
        <View className="flex-row justify-between mb-1">
          <Text className="text-gray-500">Name:</Text>
          <Text className="font-semibold">{personalInfo.firstName} {personalInfo.lastName}</Text>
        </View>
        <View className="flex-row justify-between mb-1">
          <Text className="text-gray-500">ID Number:</Text>
          <Text className="font-semibold">{personalInfo.idNumber}</Text>
        </View>
        <View className="flex-row justify-between mb-1">
          <Text className="text-gray-500">Date of Birth:</Text>
          <Text className="font-semibold">{personalInfo.dateOfBirth}</Text>
        </View>
        <View className="flex-row justify-between mb-1">
          <Text className="text-gray-500">Address:</Text>
          <Text className="font-semibold">{personalInfo.streetAddress}, {personalInfo.city}</Text>
        </View>
      </View>

      {/* Loan Details Card */}
      <View className="bg-gray-50 rounded-xl shadow p-4 mb-4 border border-gray-100">
        <View className="flex-row items-center mb-2">
          <MaterialIcons name="account-balance-wallet" size={22} color="#15803d" />
          <Text className="font-bold ml-2">Loan Details</Text>
        </View>
        <View className="flex-row justify-between mb-1">
          <Text className="text-gray-500">Loan Type:</Text>
          <Text className="font-semibold">{loanType}</Text>
        </View>
        <View className="flex-row justify-between mb-1">
          <Text className="text-gray-500">Amount:</Text>
          <Text className="font-semibold">${amount}</Text>
        </View>
        <View className="flex-row justify-between mb-1">
          <Text className="text-gray-500">Purpose:</Text>
          <Text className="font-semibold">{purpose}</Text>
        </View>
      </View>

      {/* Financial Information Card */}
      <View className="bg-gray-50 rounded-xl shadow p-4 mb-4 border border-gray-100">
        <View className="flex-row items-center mb-2">
          <MaterialIcons name="account-balance" size={22} color="#15803d" />
          <Text className="font-bold ml-2">Financial Information</Text>
        </View>
        <View className="flex-row justify-between mb-1">
          <Text className="text-gray-500">Monthly Income:</Text>
          <Text className="font-semibold">${financialInfo.monthlyIncome}</Text>
        </View>
        <View className="flex-row justify-between mb-1">
          <Text className="text-gray-500">Income Source:</Text>
          <Text className="font-semibold">{financialInfo.incomeSource}</Text>
        </View>
        <View className="flex-row justify-between mb-1">
          <Text className="text-gray-500">Bank:</Text>
          <Text className="font-semibold">{financialInfo.bankName}</Text>
        </View>
        <View className="flex-row justify-between mb-1">
          <Text className="text-gray-500">Account:</Text>
          <Text className="font-semibold">****{financialInfo.accountNumber.slice(-4)}</Text>
        </View>
      </View>

      {/* Documents Card */}
      <View className="bg-gray-50 rounded-xl shadow p-4 mb-4 border border-gray-100">
        <View className="flex-row items-center mb-2">
          <MaterialIcons name="folder" size={22} color="#15803d" />
          <Text className="font-bold ml-2">Documents</Text>
        </View>
        <View className="flex-row justify-between mb-1">
          <Text className="text-gray-500">ID Photo:</Text>
          <Text className="font-semibold">{documents.idPhoto ? '✓ Uploaded' : '✗ Missing'}</Text>
        </View>
        <View className="flex-row justify-between mb-1">
          <Text className="text-gray-500">Proof of Income:</Text>
          <Text className="font-semibold">{documents.proofOfIncome ? '✓ Uploaded' : '✗ Missing'}</Text>
        </View>
        <View className="flex-row justify-between mb-1">
          <Text className="text-gray-500">Farm Documents:</Text>
          <Text className="font-semibold">{documents.farmOwnershipDocuments ? '✓ Uploaded' : '✗ Missing'}</Text>
        </View>
        <View className="flex-row justify-between mb-1">
          <Text className="text-gray-500">Cooperative Membership:</Text>
          <Text className="font-semibold">{documents.cooperativeMembership ? '✓ Uploaded' : '✗ Missing'}</Text>
        </View>
        <View className="flex-row justify-between mb-1">
          <Text className="text-gray-500">Tree Images:</Text>
          <Text className="font-semibold">{documents.treeImages.length} uploaded</Text>
        </View>
      </View>

      {/* Repayment Terms Card */}
      <View className="bg-gray-50 rounded-xl shadow p-4 mb-4 border border-gray-100">
        <View className="flex-row items-center mb-2">
          <MaterialIcons name="event" size={22} color="#15803d" />
          <Text className="font-bold ml-2">Repayment Terms</Text>
        </View>
        <View className="flex-row justify-between mb-1">
          <Text className="text-gray-500">Term:</Text>
          <Text className="font-semibold">{term} months</Text>
        </View>
        <View className="flex-row justify-between mb-1">
          <Text className="text-gray-500">Interest Rate:</Text>
          <Text className="font-semibold">{interestRate}% per annum</Text>
        </View>
        <View className="flex-row justify-between mb-1">
          <Text className="text-gray-500">Est. Monthly Payment:</Text>
          <Text className="font-semibold">${monthlyPayment}</Text>
        </View>
      </View>

      <Text className="text-xs text-gray-400 mb-3 text-center">
        By submitting this application, you confirm that all information provided is accurate and complete.
      </Text>

      <View className="flex-row justify-between mt-2">
        <TouchableOpacity className="bg-gray-200 rounded-full py-3 px-10 mr-2" onPress={() => setStep(5)}>
          <Text className="text-gray-700 text-center font-semibold text-base">Back</Text>
        </TouchableOpacity>
        <TouchableOpacity className="flex-1 bg-green-700 rounded-full py-3 ml-2" onPress={handleSubmit} disabled={loading}>
          <Text className="text-white text-center font-semibold text-base">{loading ? 'Submitting...' : 'Submit Application'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <ScrollView className="flex-1 bg-white px-4 pt-6">
      <Toast/>
      {step === 1 && renderStep1()}
      {step === 2 && renderStep2()}
      {step === 3 && renderStep3()}
      {step === 4 && renderStep4()}
      {step === 5 && renderStep5()}
      {step === 6 && renderStep6()}
    </ScrollView>
  );
}
