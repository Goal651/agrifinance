import { MaterialIcons } from '@expo/vector-icons';
import * as LocalAuthentication from 'expo-local-authentication';
import { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function NewWorker() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [fingerprintTaken, setFingerprintTaken] = useState(false);
  const [fingerprintError, setFingerprintError] = useState('');

  const handleAddWorker = () => {
    // Logic to add a new worker
    console.log('Worker added:', { name, email, phone, fingerprintTaken });
  };

  const handleTakeFingerprint = async () => {
    setFingerprintError('');
    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      if (!hasHardware) {
        setFingerprintError('Fingerprint hardware not available');
        return;
      }
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      if (!isEnrolled) {
        setFingerprintError('No fingerprints enrolled on this device');
        return;
      }
      const result = await LocalAuthentication.authenticateAsync({ promptMessage: 'Scan your fingerprint' });
      if (result.success) {
        setFingerprintTaken(true);
      } else {
        setFingerprintError(result.error || 'Fingerprint scan cancelled or failed');
      }
    } catch (error) {
      console.error('Fingerprint error:', error);
      setFingerprintError('Error taking fingerprint');
    }
  };

  return (
    <View className="flex-1 bg-gradient-to-b from-gray-50 to-gray-100 px-4 py-6">
      <Text className="text-lg font-semibold text-blue-700 mb-4">Add New Worker</Text>

      {/* ...existing code... */}
      <View className="mb-4">
        <Text className="text-gray-700 mb-2">Name</Text>
        <TextInput
          className="border border-gray-300 rounded px-3 py-2"
          placeholder="Enter worker's name"
          value={name}
          onChangeText={setName}
        />
      </View>

      <View className="mb-4">
        <Text className="text-gray-700 mb-2">Email</Text>
        <TextInput
          className="border border-gray-300 rounded px-3 py-2"
          placeholder="Enter worker's email"
          value={email}
          onChangeText={setEmail}
        />
      </View>

      <View className="mb-4">
        <Text className="text-gray-700 mb-2">Phone</Text>
        <TextInput
          className="border border-gray-300 rounded px-3 py-2"
          placeholder="Enter worker's phone number"
          value={phone}
          onChangeText={setPhone}
        />
      </View>

      {/* Fingerprint Section */}
      <View className="mb-4">
        <Text className="text-gray-700 mb-2">Fingerprint</Text>
        <TouchableOpacity
          className={`border rounded px-3 py-2 flex-row items-center ${fingerprintTaken ? 'bg-green-100 border-green-400' : 'bg-gray-100 border-gray-300'}`}
          onPress={handleTakeFingerprint}
        >
          <MaterialIcons name="fingerprint" size={22} color={fingerprintTaken ? 'green' : 'gray'} />
          <Text className={`ml-2 font-semibold ${fingerprintTaken ? 'text-green-700' : 'text-gray-700'}`}>
            {fingerprintTaken ? 'Fingerprint Taken' : 'Take Fingerprint'}
          </Text>
        </TouchableOpacity>
        {fingerprintError ? (
          <Text className="text-red-500 mt-2">{fingerprintError}</Text>
        ) : null}
      </View>

      <TouchableOpacity
        className="bg-blue-700 rounded px-6 py-3 flex-row items-center justify-center shadow-lg"
        onPress={handleAddWorker}
      >
        <MaterialIcons name="add" size={22} color="white" />
        <Text className="text-white font-bold ml-2">Add Worker</Text>
      </TouchableOpacity>
    </View>
  );
}
