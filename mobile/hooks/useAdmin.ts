import { adminService } from './../api/admin';
import { Loan, Project, User } from "@/types";
import { LoanStats, Summary } from '@/types/admin';
import { useEffect, useState } from "react";

export function useAdmin() {

    const [loans, setLoans] = useState<Loan[]>([])
    const [projects, setProjects] = useState<Project[]>([])
    const [users, setUsers] = useState<User[]>([])
    const [summary, setSummary] = useState<Summary[]>([])
    const [loanStats, setLoanStats] = useState<LoanStats>({
        total: 0,
        rejected: 0,
        status: []
    })

    useEffect(() => {
        const fetchLoans = async () => {
            try {
                const res = await adminService.getLoans()
                if (res.success) setLoans(res.data)
            } catch (error) {
                console.error(error)
            }
        }


        const fetchProjects = async () => {
            try {
                const res = await adminService.getProjects()
                if (res.success) setProjects(res.data)

            } catch (error) {
                console.error(error)
            }
        }

        const fetchUsers = async () => {
            try {
                const res = await adminService.getUsers()
                if (res.success) setUsers(res.data)

            } catch (error) {
                console.error(error)
            }
        }
        fetchLoans()
        fetchUsers()
        fetchProjects()
    }, [])

    useEffect(() => {
        let total = 0;
        let rejected = 0;
        const statusCounts = {
            PENDING: 0,
            APPROVED: 0,
            REJECTED: 0
        };
        
        loans.forEach(loan => {
            const amount = Number(loan.details.amount) || 0;
            total += amount;
            
            if (loan.status === 'REJECTED') {
                rejected += amount;
            }
            
            if (statusCounts.hasOwnProperty(loan.status)) {
                statusCounts[loan.status as keyof typeof statusCounts]++;
            }
        });
        
        const totalLoans = loans.length;
        const statusStats: LoanStats['status'] = [
            { 
                label: 'PENDING', 
                value: Math.round((statusCounts.PENDING / totalLoans) * 100) || 0, 
                color: 'bg-yellow-400' 
            },
            { 
                label: 'APPROVED', 
                value: Math.round((statusCounts.APPROVED / totalLoans) * 100) || 0, 
                color: 'bg-green-500' 
            },
            { 
                label: 'REJECTED', 
                value: Math.round((statusCounts.REJECTED / totalLoans) * 100) || 0, 
                color: 'bg-red-500' 
            },
        ];
        setLoanStats({
            total,
            rejected,
            status: statusStats
        });
    }, [loans]);

    useEffect(() => {
        const summaryStats :Summary[] = [
            { label: 'Users', value: users.length, sub: users.filter(u => u.status === 'ACTIVE').length, color: 'bg-green-50', text: 'text-green-700' },
            { label: 'Loans', value: loans.length, sub: loans.filter(l => l.status === 'APPROVED').length, color: 'bg-blue-50', text: 'text-blue-700' },
            { label: 'Projects', value: projects.length, sub: projects.filter(p => p.status === 'ACTIVE').length, color: 'bg-yellow-50', text: 'text-yellow-700' },
        ]
        setSummary(summaryStats)
        
    }, [projects,loans,users])

    return {
        loans,
        projects,
        users,
        summary,
        loanStats
    }

}