import { loanService } from "@/api/loan"
import { Loan, LoanAnalytics, LoanProduct } from "@/types"
import { createContext, ReactNode, useContext, useEffect, useState } from "react"
import Toast from "react-native-toast-message"

interface LoanContextType {
    loans: Loan[]
    loading: boolean
    loanProducts: LoanProduct[]
    currentLoan: Loan | null
    loanAnalytics: LoanAnalytics | null
    currentLoanProduct: LoanProduct | null
    setCurrentLoanProduct: (currentLoanProduct: LoanProduct) => void
}

const LoanContext = createContext<LoanContextType | null>(null)

function useLoan(): LoanContextType {
    const context = useContext(LoanContext)
    if (!context) {
        throw new Error('useLoan must be used withing an LoanProvider')
    }
    return context
}

function LoanProvider({ children }: { children: ReactNode }) {
    const [loading, setLoading] = useState(false)
    const [loans, setLoans] = useState<Loan[]>([])
    const [loanProducts, setLoanProducts] = useState<LoanProduct[]>([])
    const [currentLoan, setCurrentLoan] = useState<Loan | null>(null)
    const [loanAnalytics, setLoanAnalytics] = useState<LoanAnalytics | null>(null)
    const [currentLoanProduct, setCurrentLoanProduct] = useState<LoanProduct | null>(null)

    useEffect(() => {

        const fetchLoanAnalytics = async () => {
            try {
                const res = await loanService.getLoanAnalytics()
                if (res.success) {
                    setLoanAnalytics(res.data)
                    return res.data
                }
            } catch (error) {
                console.error(error)
            } finally {
                setLoading(false)
            }
        }
        const fetchLoans = async () => {
            setLoading(true)
            try {
                const res = await loanService.getLoanHistory()
                if (res.success) {
                    setLoans(res.data)
                } else {
                    Toast.show({ type: 'error', text1: 'Failed to load loans', text2: res.message })
                }
            } catch (error) {
                Toast.show({ type: 'error', text1: 'Error', text2: error?.message || 'Unknown error' })
            } finally {
                setLoading(false)
            }
        }
        const fetchCurrentLoan = async () => {
            try {
                const res = await loanService.getCurrentLoan()
                if (res.success) {
                    setCurrentLoan(res.data)
                } else {
                    Toast.show({ type: 'error', text1: 'Failed to load current loan', text2: res.message })
                }
            } catch (error) {
                Toast.show({ type: 'error', text1: 'Error', text2: error?.message || 'Unknown error' })
            }
        }
        const fetchAnalytics = async () => {
            try {
                const res = await loanService.getLoanAnalytics()
                if (res.success) {
                    setLoanAnalytics(res.data)
                }
            } catch (error) {
                console.error(error)
            }
        }
        const fetchLoanProducts = async () => {
            try {
                const res = await loanService.getLoanProducts()
                if (res.success) {
                    setLoanProducts(res.data)
                } else {
                    Toast.show({ type: 'error', text1: 'Failed to load loan products', text2: res.message })
                }
            } catch (error) {
                Toast.show({ type: 'error', text1: 'Error', text2: error?.message || 'Unknown error' })
            }
        }
        fetchLoanProducts()
        fetchCurrentLoan()
        fetchLoans()
        fetchAnalytics()
        fetchLoanAnalytics()
    }, [])


 

    return (<LoanContext.Provider value={{
        loans,
        loading,
        loanAnalytics,
        loanProducts,
        currentLoan,
        currentLoanProduct,
        setCurrentLoanProduct
    }}>
        {children}
    </LoanContext.Provider>)
}

export { LoanProvider, useLoan }
