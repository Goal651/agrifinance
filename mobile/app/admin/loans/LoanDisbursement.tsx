import React, { useState, useEffect } from 'react'
import { View, Text, ScrollView, ActivityIndicator, TextInput } from 'react-native'
import CustomPicker from '@/components/ui/CustomPicker'
import { useLocalSearchParams, router } from 'expo-router'
import Button from '@/components/ui/Button'
import { adminService } from '@/api/admin'
import { Loan } from '@/types/loan'
import { useToast } from '@/components/ui/use-toast'
import Card from '@/components/ui/Card'
import { formatCurrency } from '@/lib/utils'
import { format } from 'date-fns'

const LoanDisbursement = () => {
  const { id } = useLocalSearchParams<{ id: string }>()
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [loan, setLoan] = useState<Loan | null>(null)
  const [disbursementDate, setDisbursementDate] = useState(format(new Date(), 'yyyy-MM-dd'))
  const [disbursementMethod, setDisbursementMethod] = useState('BANK_TRANSFER')
  const [reference, setReference] = useState('')
  const [notes, setNotes] = useState('')
  const { toast } = useToast()

  useEffect(() => {
    const fetchLoan = async () => {
      try {
        const response = await adminService.getLoanById(id!)
        if (response.success) {
          setLoan(response.data)
          // Generate a reference number if not provided
          if (!reference) {
            setReference(`DISB-${Date.now()}`)
          }
        }
      } catch (error) {
        console.error('Error fetching loan:', error)
        toast({
          title: 'Error',
          description: 'Failed to load loan details',
          variant: 'destructive',
        })
      } finally {
        setLoading(false)
      }
    }

    fetchLoan()
  }, [id, reference, toast])

  const handleDisburse = async () => {
    if (!loan) return

    setProcessing(true)
    try {
      // In a real app, you would call the API to process the disbursement
      // const response = await adminService.disburseLoan(loan.id, {
      //   disbursementDate,
      //   disbursementMethod,
      //   reference,
      //   notes,
      // })

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      toast({
        title: 'Success',
        description: 'Loan disbursed successfully',
      })

      // Navigate back to loan details
      router.back()
    } catch (error) {
      console.error('Error disbursing loan:', error)
      toast({
        title: 'Error',
        description: 'Failed to disburse loan',
        variant: 'destructive',
      })
    } finally {
      setProcessing(false)
    }
  }

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" />
      </View>
    )
  }

  if (!loan) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-lg">Loan not found</Text>
      </View>
    )
  }

  return (
    <ScrollView className="flex-1 p-4 bg-gray-100">
      <Card className="p-4 mb-5">
        <Text className="text-2xl font-bold mb-5 text-center">Loan Disbursement</Text>

        <View className="mb-5 pb-5 border-b border-gray-200">
          <Text className="text-lg font-semibold mb-4 text-gray-800">Loan Details</Text>
          <DetailRow label="Loan ID" value={loan.id} />
          <DetailRow label="Borrower" value={`${loan.user?.firstName} ${loan.user?.lastName}`} />
          <DetailRow label="Amount" value={formatCurrency(loan.amount)} />
          <DetailRow label="Approved Date" value={format(new Date(loan.updatedAt), 'PPP')} />
        </View>

        <View className="mb-5 pb-5 border-b border-gray-200">
          <Text className="text-lg font-semibold mb-4 text-gray-800">Disbursement Details</Text>

          <View className="mb-4">
            <Text className="mb-2 font-medium text-gray-700">Disbursement Date</Text>
            <TextInput
              className="bg-white border border-gray-300 rounded-lg p-3 text-base"
              value={disbursementDate}
              onChangeText={setDisbursementDate}
              placeholder="YYYY-MM-DD"
            />
          </View>

          <View className="mb-4">
            <Text className="mb-2 font-medium text-gray-700">Di sbursement Method</Text>
            <View className="border border-gray-300 rounded-lg overflow-hidden bg-white">
              <CustomPicker
                selectedValue={disbursementMethod}
                onValueChange={(itemValue: string) => setDisbursementMethod(itemValue)}
                items={[
                  { label: 'Select Disbursement Method', value: '' },
                  { label: 'Bank Transfer', value: 'BANK_TRANSFER' },
                  { label: 'Mobile Money', value: 'MOBILE_MONEY' },
                  { label: 'Cash', value: 'CASH' },
                  { label: 'Check', value: 'CHECK' },
                ]}
              />
            </View>
          </View>

          <View className="mb-4">
            <Text className="mb-2 font-medium text-gray-700">Reference Number</Text>
            <TextInput
              className="bg-white border border-gray-300 rounded-lg p-3 text-base"
              value={reference}
              onChangeText={setReference}
              placeholder="Enter reference number"
            />
          </View>

          <View className="mb-4">
            <Text className="mb-2 font-medium text-gray-700">Notes</Text>
            <TextInput
              className="bg-white border border-gray-300 rounded-lg p-3 text-base min-h-[100px] text-top"
              value={notes}
              onChangeText={setNotes}
              placeholder="Additional notes about the disbursement"
              multiline
              numberOfLines={3}
            />
          </View>
        </View>

        <View className="flex-row justify-between mt-5">
          <Button
            title="Cancel"
            variant="outline"
            onPress={() => router.back()}
            className="flex-1 mx-1"
            disabled={processing}
          />
          <Button
            title="Confirm Disbursement"
            onPress={handleDisburse}
            loading={processing}
            disabled={processing}
            className="flex-1 mx-1 bg-green-500"
          />
        </View>
      </Card>
    </ScrollView>
  )
}

const DetailRow = ({ label, value }) => (
  <View className="flex-row justify-between mb-2">
    <Text className="font-medium text-gray-600 flex-1">{label}:</Text>
    <Text className="font-medium text-right flex-2">{value}</Text>
  </View>
)

export default LoanDisbursement
